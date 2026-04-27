import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb, Filter } from '$lib/server/firebase-admin';

import { authenticate } from '$lib/server/auth';
import { checkSchoolLimit } from '$lib/server/plans';
import { serializeRecord } from '$lib/server/serialize';

export const GET: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const uid = user.uid;

  try {
    const snapshot = await adminDb.collection("schools")
      .where(Filter.or(
        Filter.where('owner_id', '==', uid),
        Filter.where('ownerId', '==', uid)
      ))
      .get();
    
    // Standardize response fields and sort in-memory
    const schools = snapshot.docs.map((doc: any) => {
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
    }).map((s: any) => serializeRecord(s));
    return json({ schools });
  } catch (error: any) {
    console.error('❌ Error in GET schools API:', error.message);
    return json({ error: 'Error al obtener los centros', details: error.message }, { status: 500 });
  }
};

export const POST: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { request } = event;
  const uid = user.uid;

  try {
    const canAddSchool = await checkSchoolLimit(uid);
    if (!canAddSchool) {
      return json({ 
        error: 'Límite alcanzado', 
        message: 'Has alcanzado el límite de 1 centro del plan gratuito. ¡Pásate a Premium para gestionar centros ilimitados!',
        code: 'LIMIT_REACHED'
      }, { status: 403 });
    }

    const body = await request.json();
    const { name, city } = body;

    if (!name || !name.trim()) {
      return json({ error: 'El nombre del centro es obligatorio' }, { status: 400 });
    }

    const schoolData = {
      name: name.trim(),
      city: city?.trim() || null,
      owner_id: uid,
      createdBy: uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Support legacy field names in outgoing data for a graceful transition
    if ((schoolData as any).created_at) delete (schoolData as any).created_at;
    if ((schoolData as any).updated_at) delete (schoolData as any).updated_at;

    const docRef = await adminDb.collection("schools").add(schoolData);
    return json({ 
      success: true,
      school: { id: docRef.id, ...schoolData },
      message: 'Centro creado correctamente'
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error in POST schools API:', error.message);
    return json({ error: 'Error al crear el centro' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { request } = event;
  const uid = user.uid;

  try {
    const body = await request.json();
    const schoolId = body.id;

    if (!schoolId) {
      return json({ error: 'ID del centro requerido' }, { status: 400 });
    }

    const schoolRef = adminDb.collection("schools").doc(schoolId);
    const schoolSnap = await schoolRef.get();

    if (!schoolSnap.exists) {
      return json({ error: 'Centro no encontrado' }, { status: 404 });
    }

    const currentOwner = schoolSnap.data()?.owner_id || schoolSnap.data()?.ownerId;
    if (currentOwner !== uid) {
      return json({ error: 'Acceso denegado' }, { status: 403 });
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

    await schoolRef.update(updateData);

    return json({ 
      success: true,
      school: { id: schoolId, ...schoolSnap.data(), ...updateData }
    });

  } catch (error: any) {
    console.error('❌ Error in PUT schools API:', error.message);
    return json({ error: 'Error al actualizar el centro' }, { status: 500 });
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

    if (!id) {
      return json({ error: 'ID del centro requerido' }, { status: 400 });
    }

    const schoolRef = adminDb.collection("schools").doc(id);
    const schoolSnap = await schoolRef.get();

    if (!schoolSnap.exists) {
      return json({ error: 'Centro no encontrado' }, { status: 404 });
    }

    const currentOwner = schoolSnap.data()?.owner_id || schoolSnap.data()?.ownerId;
    if (currentOwner !== user.uid) {
      return json({ error: 'Acceso denegado' }, { status: 403 });
    }

    await schoolRef.delete();
    return json({ success: true, message: 'Centro eliminado correctamente' });

  } catch (error: any) {
    console.error('❌ Error in DELETE schools API:', error.message);
    return json({ error: 'Error al eliminar el centro' }, { status: 500 });
  }
};
