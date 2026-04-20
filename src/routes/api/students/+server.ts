import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { authenticate } from '$lib/server/auth';
import { checkStudentLimit } from '$lib/server/plans';
import { serializeRecord } from '$lib/server/serialize';

export const GET: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const snapshot = await adminDb.collection("students")
      .where("owner_id", "==", user.uid)
      .orderBy("created_at", "desc")
      .get();
        
    const students = snapshot.docs.map((doc: any) => serializeRecord({ id: doc.id, ...doc.data() }));
    return json({ students });
  } catch (error: any) {
    console.error('❌ Error in GET students API:', error.message);
    return json({ error: 'Error al obtener los alumnos' }, { status: 500 });
  }
};

export const POST: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    // 1. Verificar plan y límites usando el helper centralizado
    const canAddStudent = await checkStudentLimit(user.uid);
    if (!canAddStudent) {
      return json({ 
        error: 'Límite alcanzado', 
        message: 'Has alcanzado el límite de 10 alumnos del plan gratuito. ¡Pásate a Premium para gestionar alumnos ilimitados!',
        code: 'LIMIT_REACHED'
      }, { status: 403 });
    }

    const { request } = event;
    const body = await request.json();
    const studentData = {
      ...body,
      owner_id: user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const docRef = await adminDb.collection("students").add(studentData);
    const studentId = docRef.id;

    // Sincronizar con class_students si se proporcionó una clase
    if (body.class_id) {
      const enrollmentData = {
        class_id: body.class_id,
        student_id: studentId,
        owner_id: user.uid,
        enrolled_at: new Date().toISOString()
      };
      await adminDb.collection("class_students").add(enrollmentData);
    }

    return json({ success: true, student: { id: studentId, ...studentData } });
  } catch (error: any) {
    console.error('❌ Error in POST students API:', error.message);
    return json({ error: 'Error al crear el alumno' }, { status: 500 });
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

    const docRef = adminDb.collection("students").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists || docSnap.data()?.owner_id !== user.uid) {
      return json({ error: 'No autorizado' }, { status: 403 });
    }

    const oldData = docSnap.data();
    const oldClassId = oldData?.class_id;

    const updateData = {
      ...body,
      updated_at: new Date().toISOString()
    };
    delete updateData.id;
    delete updateData.owner_id;
    delete updateData.created_at;

    await docRef.update(updateData);

    // Sincronizar con class_students si la clase cambió
    if (updateData.class_id !== undefined && updateData.class_id !== oldClassId) {
      // 1. Eliminar inscripciones anteriores (debería haber solo una, pero usamos batch por seguridad)
      const enrollmentsq = await adminDb.collection("class_students")
        .where("student_id", "==", id)
        .where("owner_id", "==", user.uid)
        .get();
      
      const batch = adminDb.batch();
      enrollmentsq.docs.forEach((doc: any) => batch.delete(doc.ref));
      await batch.commit();

      // 2. Crear nueva inscripción si hay un nuevo class_id
      if (updateData.class_id) {
        await adminDb.collection("class_students").add({
          class_id: updateData.class_id,
          student_id: id,
          owner_id: user.uid,
          enrolled_at: new Date().toISOString()
        });
      }
    }

    return json({ success: true, student: { id, ...oldData, ...updateData } });
  } catch (error: any) {
    console.error('❌ Error in PUT students API:', error.message);
    return json({ error: 'Error al actualizar el alumno' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const { request } = event;
    const { id } = await request.json();
    if (!id) return json({ error: 'ID requerido' }, { status: 400 });

    const docRef = adminDb.collection("students").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists || docSnap.data()?.owner_id !== user.uid) {
      return json({ error: 'No autorizado' }, { status: 403 });
    }

    // Eliminar también registros de inscripción
    const enrollmentsq = await adminDb.collection("class_students")
      .where("student_id", "==", id)
      .where("owner_id", "==", user.uid)
      .get();
    
    const batch = adminDb.batch();
    enrollmentsq.docs.forEach((doc: any) => batch.delete(doc.ref));
    batch.delete(docRef);
    await batch.commit();

    return json({ success: true });
  } catch (error: any) {
    console.error('❌ Error in DELETE students API:', error.message);
    return json({ error: 'Error al eliminar el alumno' }, { status: 500 });
  }
};
