import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb, Filter } from '$lib/server/firebase-admin';
import { authenticate } from '$lib/server/auth';
import { checkClassLimit } from '$lib/server/plans';
import { serializeRecord } from '$lib/server/serialize';

export const GET: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const snapshot = await adminDb.collection("classes")
      .where(Filter.or(
        Filter.where('owner_id', '==', user.uid),
        Filter.where('ownerId', '==', user.uid)
      ))
      .get();
        
    // Standardize response fields and sort in-memory
    const classes = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt || data.created_at,
        updatedAt: data.updatedAt || data.updated_at
      };
    }).sort((a: any, b: any) => {
      const dateA = a.createdAt || '';
      const dateB = b.createdAt || '';
      return dateB.localeCompare(dateA);
    }).map((c: any) => serializeRecord(c));
    return json({ classes });
  } catch (error: any) {
    console.error('❌ Error in GET classes API:', error.message);
    return json({ error: 'Error al obtener las clases' }, { status: 500 });
  }
};

export const POST: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const canAddClass = await checkClassLimit(user.uid);
    if (!canAddClass) {
      return json({ 
        error: 'Límite alcanzado', 
        message: 'Has alcanzado el límite de 1 clase del plan gratuito. ¡Pásate a Premium para gestionar clases ilimitadas!',
        code: 'LIMIT_REACHED'
      }, { status: 403 });
    }

    const { request } = event;
    const body = await request.json();
    const classData = {
      ...body,
      owner_id: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Support legacy field names in outgoing data for a graceful transition
    if ((classData as any).created_at) delete (classData as any).created_at;
    if ((classData as any).updated_at) delete (classData as any).updated_at;

    const docRef = await adminDb.collection("classes").add(classData);
    return json({ class: { id: docRef.id, ...classData } });
  } catch (error: any) {
    console.error('❌ Error in POST classes API:', error.message);
    return json({ error: 'Error al crear la clase' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const { request } = event;
    const body = await request.json();
    const { id } = body;

    if (!id) return json({ error: 'ID requerido' }, { status: 400 });

    const docRef = adminDb.collection("classes").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return json({ error: 'Clase no encontrada' }, { status: 404 });
    }

    const currentOwner = docSnap.data()?.owner_id || docSnap.data()?.ownerId;
    if (currentOwner !== user.uid) {
      return json({ error: 'No autorizado' }, { status: 403 });
    }

    const updateData = {
      ...body,
      updatedAt: new Date().toISOString()
    };
    delete updateData.id;
    delete updateData.owner_id;
    delete updateData.createdAt;
    delete updateData.created_at;
    delete updateData.updated_at;

    await docRef.update(updateData);
    return json({ success: true, class: { id, ...docSnap.data(), ...updateData } });
  } catch (error: any) {
    console.error('❌ Error in PUT classes API:', error.message);
    return json({ error: 'Error al actualizar la clase' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const { request } = event;
    const body = await request.json();
    const { id } = body;
    if (!id) return json({ error: 'ID requerido' }, { status: 400 });

    const docRef = adminDb.collection("classes").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return json({ error: 'Clase no encontrada' }, { status: 404 });
    }

    const data = docSnap.data();
    const currentOwner = data?.owner_id || data?.ownerId;
    if (currentOwner !== user.uid) {
      return json({ error: 'No autorizado' }, { status: 403 });
    }

    // Cleanup in a batch
    const batch = adminDb.batch();

    // 1. Find and remove all enrollments for this class
    const enrollmentsSnapshot = await adminDb.collection("class_students")
      .where(Filter.or(
        Filter.where('classId', '==', id),
        Filter.where('class_id', '==', id)
      ))
      .get();
    enrollmentsSnapshot.docs.forEach((doc: any) => {
      batch.delete(doc.ref);
    });

    // 2. Find and update all students assigned to this class
    const studentsSnapshot = await adminDb.collection("students")
      .where(Filter.or(
        Filter.where('classId', '==', id),
        Filter.where('class_id', '==', id)
      ))
      .get();
    studentsSnapshot.docs.forEach((doc: any) => {
      batch.update(doc.ref, { 
        classId: null, 
        class_id: null,
        updatedAt: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    });

    // 3. Delete the class itself
    batch.delete(docRef);

    await batch.commit();
    return json({ success: true });
  } catch (error: any) {
    if (error.code === 8 || error.message?.includes('Quota exceeded') || error.status === 429) {
      return json({ error: 'Límite de operaciones excedido. Por favor, inténtalo de nuevo mañana o mejora tu plan.' }, { status: 429 });
    }
    console.error('❌ Error in DELETE classes API:', error.message);
    return json({ error: 'Error al eliminar la clase: ' + error.message }, { status: 500 });
  }
};
