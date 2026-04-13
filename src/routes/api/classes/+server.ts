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
  orderBy,
  serverTimestamp,
  getDoc
} from "firebase/firestore";

export const GET: RequestHandler = async ({ locals }) => {
  console.log('🎓 API Classes - Fetching classes...');

  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const q = query(
      collection(db, "classes"), 
      where("owner_id", "==", locals.user.id),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    const classes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return json({ classes });

  } catch (error: any) {
    console.error('❌ Error in GET classes API:', error.message);
    return json({ error: 'Error al obtener las clases' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  console.log('🎓 API Classes - Creating new class...');

  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, school_id } = body;

    const classData = {
      owner_id: locals.user.id,
      name: name?.trim() || 'Clase sin nombre',
      school_id: school_id?.trim() || null,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "classes"), classData);
    
    return json({ class: { id: docRef.id, ...classData } });

  } catch (error: any) {
    console.error('❌ Error in POST classes API:', error.message);
    return json({ error: 'Error al crear la clase' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  console.log('🗑️ API Classes - Deleting class...');

  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return json({ error: 'ID de la clase requerido' }, { status: 400 });
    }

    const classRef = doc(db, "classes", id);
    const classSnap = await getDoc(classRef);

    if (!classSnap.exists() || classSnap.data().owner_id !== locals.user.id) {
      return json({ error: 'Clase no encontrada o acceso denegado' }, { status: 404 });
    }

    await deleteDoc(classRef);

    return json({ success: true, message: 'Clase eliminada correctamente' });

  } catch (error: any) {
    console.error('❌ Error in DELETE classes API:', error.message);
    return json({ error: 'Error al eliminar la clase' }, { status: 500 });
  }
};

