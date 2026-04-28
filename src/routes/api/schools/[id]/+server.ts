import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/server/firebase-admin';

export const PUT: RequestHandler = async ({ request, locals, params }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const schoolId = params.id;
    const body = await request.json();
    
    if (!schoolId) {
      return json({ error: 'ID del centro requerido' }, { status: 400 });
    }

    const schoolRef = adminDb.collection("schools").doc(schoolId);
    const schoolSnap = await schoolRef.get();

    if (!schoolSnap.exists || schoolSnap.data()?.ownerId !== locals.user.uid) {
      return json({ error: 'Centro no encontrado o acceso denegado' }, { status: 404 });
    }

    const { id: _, ownerId: __, createdAt: ___, createdAt: ____, updatedAt: _____, ...updateData } = body;
    updateData.updatedAt = new Date().toISOString();

    await schoolRef.update(updateData);

    // Propagar sharedWith a clases y estudiantes si ha cambiado
    if ('sharedWith' in updateData) {
      const batch = adminDb.batch();
      
      const classesSnap = await adminDb.collection("classes").where("schoolId", "==", schoolId).get();
      classesSnap.docs.forEach((doc: any) => {
        batch.update(doc.ref, { sharedWith: updateData.sharedWith, updatedAt: updateData.updatedAt });
      });

      const studentsSnap = await adminDb.collection("students").where("schoolId", "==", schoolId).get();
      studentsSnap.docs.forEach((doc: any) => {
        batch.update(doc.ref, { sharedWith: updateData.sharedWith, updatedAt: updateData.updatedAt });
      });

      await batch.commit();
    }

    return json({ 
      success: true, 
      message: 'Centro actualizado correctamente'
    });

  } catch (error: any) {
    console.error('❌ Error in PUT schools [id] API:', error.message);
    return json({ error: 'Error al actualizar el centro' }, { status: 500 });
  }
};
