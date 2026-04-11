import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp
} from "firebase/firestore";

export const GET: RequestHandler = async ({ locals }) => {
  console.log('👥 API Students - Fetching students (Firestore)...');

  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const q = query(
      collection(db, "students"), 
      where("user_id", "==", locals.user.id),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return json({ students });

  } catch (error: any) {
    console.error('❌ Error in GET students API:', error.message);
    return json({ error: 'Error al obtener los estudiantes' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals, url }) => {
  console.log('👥 API Students - Creating student (Firestore)...');

  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      first_name,
      last_name,
      date_of_birth,
      grade,
      parent_email,
      parent_phone,
      avatar,
      notes,
      settings,
      college_id
    } = body;

    const studentData = {
      user_id: locals.user.id,
      name: name?.trim() || 'Estudiante sin nombre',
      first_name: first_name?.trim() || null,
      last_name: last_name?.trim() || null,
      date_of_birth: date_of_birth || null,
      grade: grade?.trim() || null,
      parent_email: parent_email?.trim() || null,
      parent_phone: parent_phone?.trim() || null,
      avatar: avatar?.trim() || null,
      notes: notes?.trim() || null,
      college_id: college_id?.trim() || null,
      settings: settings || {},
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "students"), studentData);
    
    return json({ 
      student: { id: docRef.id, ...studentData } 
    });

  } catch (error: any) {
    console.error('❌ Error in POST students API:', error.message);
    return json({ error: 'Error al crear el estudiante' }, { status: 500 });
  }
};
