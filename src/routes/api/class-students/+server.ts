import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const classId = url.searchParams.get('classId') || url.searchParams.get('class_id');
  const studentId = url.searchParams.get('studentId') || url.searchParams.get('student_id');

  try {
    let query = adminDb.collection("class_students").where("owner_id", "==", locals.user.uid);

    if (classId) {
      query = query.where("classId", "==", classId);
    }

    if (studentId) {
      query = query.where("studentId", "==", studentId);
    }

    const snapshot = await query.get();
    const classStudents = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return serializeRecord({ 
        id: doc.id, 
        ...data,
        enrolledAt: data.enrolledAt || data.enrolled_at,
        classId: data.classId || data.class_id,
        studentId: data.studentId || data.student_id
      });
    });

    return json({ classStudents });

  } catch (error: any) {
    console.error('❌ Error in GET class-students API:', error.message);
    return json({ error: 'Error al obtener las inscripciones' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const classId = body.classId || body.class_id;
    const studentId = body.studentId || body.student_id;

    if (!classId || !studentId) {
      return json({ error: 'classId and studentId are required' }, { status: 400 });
    }

    // Comprobar si ya está inscrito
    const existingSnap = await adminDb.collection("class_students")
      .where("classId", "==", classId)
      .where("studentId", "==", studentId)
      .where("owner_id", "==", locals.user.uid)
      .get();
      
    if (!existingSnap.empty) {
      return json({ error: 'Estudiante ya inscrito' }, { status: 409 });
    }

    const enrollmentData = {
      classId,
      studentId,
      owner_id: locals.user.uid,
      enrolledAt: new Date().toISOString()
    };

    const docRef = await adminDb.collection("class_students").add(enrollmentData);
    
    // Sincronizar hacia el registro de estudiante
    await adminDb.collection("students").doc(studentId).update({
      classId: classId,
      updatedAt: new Date().toISOString()
    });
    
    return json({ classStudent: { id: docRef.id, ...enrollmentData } });

  } catch (error: any) {
    console.error('❌ Error in POST class-students API:', error.message);
    return json({ error: 'Error al inscribir al estudiante' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const classId = url.searchParams.get('classId') || url.searchParams.get('class_id');
  const studentId = url.searchParams.get('studentId') || url.searchParams.get('student_id');

  if (!classId || !studentId) {
    return json({ error: 'classId and studentId are required' }, { status: 400 });
  }

  try {
    const snapshot = await adminDb.collection("class_students")
      .where("classId", "==", classId)
      .where("studentId", "==", studentId)
      .where("owner_id", "==", locals.user.uid)
      .get();
      
    if (snapshot.empty) {
      return json({ error: 'Inscripción no encontrada' }, { status: 404 });
    }

    const batch = adminDb.batch();
    snapshot.docs.forEach((doc: any) => batch.delete(doc.ref));
    
    // Sincronizar hacia el registro de estudiante (quitar classId si coincide con esta clase)
    const studentRef = adminDb.collection("students").doc(studentId);
    const studentSnap = await studentRef.get();
    const studentData = studentSnap.data();
    if (studentSnap.exists && (studentData?.classId === classId || studentData?.class_id === classId)) {
      batch.update(studentRef, { 
        classId: null,
        updatedAt: new Date().toISOString()
      });
    }

    await batch.commit();

    return json({ success: true, message: 'Estudiante desinscrito correctamente' });

  } catch (error: any) {
    console.error('❌ Error in DELETE class-students API:', error.message);
    return json({ error: 'Error al eliminar la inscripción' }, { status: 500 });
  }
};
