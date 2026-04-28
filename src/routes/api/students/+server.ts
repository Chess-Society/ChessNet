import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb, Filter } from '$lib/server/firebase-admin';
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
      .where("ownerId", "==", user.uid)
      .get();
        
    const students = snapshot.docs.map((doc: any) => serializeRecord({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (b.createdAt || '').localeCompare(a.createdAt || ''));

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
      ownerId: user.uid,
      schoolId: body.schoolId || null,
      classId: body.classId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Cleanup legacy fields if they leaked into body
    delete (studentData as any).ownerId;
    delete (studentData as any).schoolId;
    delete (studentData as any).classId;
    delete (studentData as any).createdAt;
    delete (studentData as any).updatedAt;


    const docRef = await adminDb.collection("students").add(studentData);
    const studentId = docRef.id;

    // Sincronizar con classStudents si se proporcionó una clase
    if (studentData.classId) {
      const enrollmentData = {
        classId: studentData.classId,
        studentId,
        ownerId: user.uid,
        enrolledAt: new Date().toISOString()
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

    if (!docSnap.exists) {
      return json({ error: 'Alumno no encontrado' }, { status: 404 });
    }

    const currentOwner = docSnap.data()?.ownerId || docSnap.data()?.ownerId;
    if (currentOwner !== user.uid) {
      return json({ error: 'No autorizado' }, { status: 403 });
    }

    const oldData = serializeRecord<any>(docSnap.data());
    const oldClassId = oldData.classId;

    const updateData = {
      ...body,
      schoolId: body.schoolId || oldData.schoolId,
      classId: body.classId || oldData.classId,
      updatedAt: new Date().toISOString()
    };
    delete updateData.id;
    delete updateData.ownerId;
    delete updateData.ownerId;
    delete updateData.createdAt;
    delete updateData.createdAt;
    delete updateData.updatedAt;


    await docRef.update(updateData);

    // Sincronizar con class_students si la clase cambió
    const newClassId = updateData.classId || updateData.classId;
    if (newClassId !== undefined && newClassId !== oldClassId) {
      // 1. Eliminar inscripciones anteriores
      const enrollmentsq = await adminDb.collection("class_students")
        .where("studentId", "==", id)
        .where("ownerId", "==", user.uid)
        .get();

      
      const batch = adminDb.batch();
      enrollmentsq.docs.forEach((doc: any) => batch.delete(doc.ref));
      await batch.commit();

      // 2. Crear nueva inscripción si hay un nuevo classId
      if (newClassId) {
        await adminDb.collection("class_students").add({
          classId: newClassId,
          studentId: id,
          ownerId: user.uid,
          enrolledAt: new Date().toISOString()
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

    if (!docSnap.exists) {
        return json({ error: 'Alumno no encontrado' }, { status: 404 });
    }

    const currentOwner = docSnap.data()?.ownerId || docSnap.data()?.ownerId;
    if (currentOwner !== user.uid) {
      return json({ error: 'No autorizado' }, { status: 403 });
    }

    // Eliminar también registros de inscripción
    const enrollmentsq = await adminDb.collection("class_students")
      .where("studentId", "==", id)
      .where("ownerId", "==", user.uid)
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
