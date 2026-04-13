import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/firebase';
import { 
  updateDoc,
  doc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";

export const PUT: RequestHandler = async ({ request, params, locals }) => {
  console.log('✏️ API Classes - Updating class...');
  
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { name, school_id } = body;
    
    if (!id) {
      return json({ error: 'ID de la clase requerido' }, { status: 400 });
    }

    const classRef = doc(db, "classes", id);
    const classSnap = await getDoc(classRef);

    if (!classSnap.exists() || classSnap.data().user_id !== locals.user.id) {
      return json({ error: 'Clase no encontrada o acceso denegado' }, { status: 404 });
    }

    const updateData: any = {
      updated_at: serverTimestamp()
    };
    if (name !== undefined) updateData.name = name.trim();
    if (school_id !== undefined) updateData.school_id = school_id;

    await updateDoc(classRef, updateData);

    return json({ 
      success: true, 
      class: { id, ...classSnap.data(), ...updateData },
      message: 'Clase actualizada correctamente'
    });

  } catch (error: any) {
    console.error('❌ Error in PUT classes/[id] API:', error.message);
    return json({ error: 'Error al actualizar la clase' }, { status: 500 });
  }
};

export const PATCH: RequestHandler = async ({ request, params, locals }) => {
  console.log('🩹 API Classes - Patching class...');

  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return json({ error: 'ID de la clase requerido' }, { status: 400 });
    }

    const classRef = doc(db, "classes", id);
    const classSnap = await getDoc(classRef);

    if (!classSnap.exists() || classSnap.data().user_id !== locals.user.id) {
      return json({ error: 'Clase no encontrada o acceso denegado' }, { status: 404 });
    }

    await updateDoc(classRef, {
      ...body,
      updated_at: serverTimestamp()
    });

    return json({ success: true });

  } catch (error: any) {
    console.error('❌ Error in PATCH classes/[id] API:', error.message);
    return json({ error: 'Error al actualizar la clase' }, { status: 500 });
  }
};
