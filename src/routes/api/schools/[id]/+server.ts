import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";

export const PUT: RequestHandler = async ({ request, locals, params }) => {
  console.log('🏫 API Schools [id] - Updating school (Firestore)...');
  
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const schoolId = params.id;
    
    if (!schoolId) {
      return json({ error: 'ID del centro requerido' }, { status: 400 });
    }

    const schoolRef = doc(db, "colleges", schoolId);
    const schoolSnap = await getDoc(schoolRef);

    if (!schoolSnap.exists() || schoolSnap.data().user_id !== locals.user.id) {
      return json({ error: 'Centro no encontrado o acceso denegado' }, { status: 404 });
    }

    const updateData = {
      ...body,
      updated_at: serverTimestamp()
    };

    // Remove immutable fields if present in body
    delete updateData.id;
    delete updateData.user_id;
    delete updateData.created_at;

    await updateDoc(schoolRef, updateData);

    const updatedSnap = await getDoc(schoolRef);
    return json({ 
      success: true, 
      school: { id: updatedSnap.id, ...updatedSnap.data() },
      message: 'Centro actualizado correctamente'
    });

  } catch (error: any) {
    console.error('❌ Error in PUT schools [id] API:', error.message);
    return json({ error: 'Error al actualizar el centro' }, { status: 500 });
  }
};
