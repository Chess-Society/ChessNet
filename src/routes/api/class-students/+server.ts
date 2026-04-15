import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const classId = url.searchParams.get('class_id');
  const studentId = url.searchParams.get('student_id');

  try {
    let query = adminDb.collection("class_students").where("owner_id", "==", locals.user.uid);

    if (classId) {
      query = query.where("class_id", "==", classId);
    }

    if (studentId) {
      query = query.where("student_id", "==", studentId);
    }

    const snapshot = await query.get();
    const classStudents = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    return json({ class_students: classStudents });

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
    const { class_id, student_id } = body;

    if (!class_id || !student_id) {
      return json({ error: 'class_id and student_id are required' }, { status: 400 });
    }

    // Comprobar si ya está inscrito
    const existingSnap = await adminDb.collection("class_students")
      .where("class_id", "==", class_id)
      .where("student_id", "==", student_id)
      .where("owner_id", "==", locals.user.uid)
      .get();
      
    if (!existingSnap.empty) {
      return json({ error: 'Estudiante ya inscrito' }, { status: 409 });
    }

    const enrollmentData = {
      class_id,
      student_id,
      owner_id: locals.user.uid,
      enrolled_at: new Date().toISOString()
    };

    const docRef = await adminDb.collection("class_students").add(enrollmentData);
    
    return json({ class_student: { id: docRef.id, ...enrollmentData } });

  } catch (error: any) {
    console.error('❌ Error in POST class-students API:', error.message);
    return json({ error: 'Error al inscribir al estudiante' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const classId = url.searchParams.get('class_id');
  const studentId = url.searchParams.get('student_id');

  if (!classId || !studentId) {
    return json({ error: 'class_id and student_id are required' }, { status: 400 });
  }

  try {
    const snapshot = await adminDb.collection("class_students")
      .where("class_id", "==", classId)
      .where("student_id", "==", studentId)
      .where("owner_id", "==", locals.user.uid)
      .get();
      
    if (snapshot.empty) {
      return json({ error: 'Inscripción no encontrada' }, { status: 404 });
    }

    const batch = adminDb.batch();
    snapshot.docs.forEach((doc: any) => batch.delete(doc.ref));
    await batch.commit();

    return json({ success: true, message: 'Estudiante desinscrito correctamente' });

  } catch (error: any) {
    console.error('❌ Error in DELETE class-students API:', error.message);
    return json({ error: 'Error al eliminar la inscripción' }, { status: 500 });
  }
};
