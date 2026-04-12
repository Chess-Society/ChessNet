import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc,
  deleteDoc,
  doc,
  query, 
  where, 
  serverTimestamp,
  getDoc,
  updateDoc
} from "firebase/firestore";

export const GET: RequestHandler = async ({ url, locals }) => {
  console.log('👥 API Class-Students - Fetching enrollments...');

  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const classId = url.searchParams.get('class_id');
  const studentId = url.searchParams.get('student_id');

  try {
    let q = query(
      collection(db, "class_students"), 
      where("owner_id", "==", locals.user.id)
    );

    if (classId) {
      q = query(q, where("class_id", "==", classId));
    }

    if (studentId) {
      q = query(q, where("student_id", "==", studentId));
    }

    const snapshot = await getDocs(q);
    const classStudents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return json({ class_students: classStudents });

  } catch (error: any) {
    console.error('❌ Error in GET class-students API:', error.message);
    return json({ error: 'Error al obtener las inscripciones' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  console.log('👥 API Class-Students - Creating enrollment...');

  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { class_id, student_id } = body;

    if (!class_id || !student_id) {
      return json({ error: 'class_id and student_id are required' }, { status: 400 });
    }

    // Check for existing enrollment first to prevent duplicates
    const q = query(
      collection(db, "class_students"),
      where("class_id", "==", class_id),
      where("student_id", "==", student_id),
      where("owner_id", "==", locals.user.id)
    );
    const existingSnap = await getDocs(q);
    if (!existingSnap.empty) {
      return json({ error: 'Estudiante ya inscrito' }, { status: 409 });
    }

    const enrollmentData = {
      class_id,
      student_id,
      owner_id: locals.user!.id,
      enrolled_at: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "class_students"), enrollmentData);
    
    return json({ class_student: { id: docRef.id, ...enrollmentData } });

  } catch (error: any) {
    console.error('❌ Error in POST class-students API:', error.message);
    return json({ error: 'Error al inscribir al estudiante' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ url, locals }) => {
  console.log('🗑️ API Class-Students - Removing enrollment...');

  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const classId = url.searchParams.get('class_id');
  const studentId = url.searchParams.get('student_id');

  if (!classId || !studentId) {
    return json({ error: 'class_id and student_id are required' }, { status: 400 });
  }

  try {
    const q = query(
      collection(db, "class_students"),
      where("class_id", "==", classId),
      where("student_id", "==", studentId),
      where("owner_id", "==", locals.user!.id)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return json({ error: 'Inscripción no encontrada' }, { status: 404 });
    }

    // Eliminar el documento (o documentos si hay duplicados por error)
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    return json({ success: true, message: 'Estudiante desinscrito correctamente' });

  } catch (error: any) {
    console.error('❌ Error in DELETE class-students API:', error.message);
    return json({ error: 'Error al eliminar la inscripción' }, { status: 500 });
  }
};

