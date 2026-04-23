import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/server/firebase-admin';

export const PUT: RequestHandler = async ({ request, params, locals }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return json({ error: 'ID de la clase requerido' }, { status: 400 });
    }

    const classRef = adminDb.collection("classes").doc(id);
    const classSnap = await classRef.get();

    if (!classSnap.exists || classSnap.data()?.owner_id !== locals.user.uid) {
      return json({ error: 'Clase no encontrada o acceso denegado' }, { status: 404 });
    }

    const { id: _, owner_id: __, created_at: ___, createdAt: ____, updated_at: _____, ...updateData } = body;
    updateData.updatedAt = new Date().toISOString();

    await classRef.update(updateData);

    return json({ 
      success: true, 
      message: 'Clase actualizada correctamente'
    });

  } catch (error: any) {
    console.error('❌ Error in PUT classes/[id] API:', error.message);
    return json({ error: 'Error al actualizar la clase' }, { status: 500 });
  }
};

export const PATCH: RequestHandler = async ({ request, params, locals }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return json({ error: 'ID de la clase requerido' }, { status: 400 });
    }

    const classRef = adminDb.collection("classes").doc(id);
    const classSnap = await classRef.get();

    if (!classSnap.exists || classSnap.data()?.owner_id !== locals.user.uid) {
      return json({ error: 'Clase no encontrada o acceso denegado' }, { status: 404 });
    }

    await classRef.update({
      ...body,
      updatedAt: new Date().toISOString()
    });

    return json({ success: true });

  } catch (error: any) {
    console.error('❌ Error in PATCH classes/[id] API:', error.message);
    return json({ error: 'Error al actualizar la clase' }, { status: 500 });
  }
};
