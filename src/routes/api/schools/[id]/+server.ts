import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';

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

    if (!schoolSnap.exists || schoolSnap.data()?.owner_id !== locals.user.uid) {
      return json({ error: 'Centro no encontrado o acceso denegado' }, { status: 404 });
    }

    const { id: _, owner_id: __, created_at: ___, createdAt: ____, updated_at: _____, ...updateData } = body;
    updateData.updatedAt = new Date().toISOString();

    await schoolRef.update(updateData);

    return json({ 
      success: true, 
      message: 'Centro actualizado correctamente'
    });

  } catch (error: any) {
    console.error('❌ Error in PUT schools [id] API:', error.message);
    return json({ error: 'Error al actualizar el centro' }, { status: 500 });
  }
};
