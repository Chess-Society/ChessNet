import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { authenticate } from '$lib/server/auth';
import { checkClassLimit } from '$lib/server/plans';
import { serializeRecord } from '$lib/server/serialize';

export const GET: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const isMock = user.uid === 'chessnet-dev-uid';
    try {
      const snapshot = await adminDb.collection("classes")
        .where("owner_id", "==", user.uid)
        .orderBy("created_at", "desc")
        .get();
        
      const classes = snapshot.docs.map((doc: any) => serializeRecord({ id: doc.id, ...doc.data() }));
      return json({ classes });
    } catch (dbError) {
      if (isMock) {
        return json({ classes: [] });
      }
      throw dbError;
    }
  } catch (error: any) {
    console.error('❌ Error in GET classes API:', error.message);
    return json({ error: 'Error al obtener las clases' }, { status: 500 });
  }
};

export const POST: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const isMock = user.uid === 'chessnet-dev-uid';
    if (!isMock) {
      const canAddClass = await checkClassLimit(user.uid);
      if (!canAddClass) {
        return json({ 
          error: 'Límite alcanzado', 
          message: 'Has alcanzado el límite de 2 clases del plan gratuito. ¡Pásate a Premium para gestionar clases ilimitadas!',
          code: 'LIMIT_REACHED'
        }, { status: 403 });
      }
    }

    const { request } = event;
    const body = await request.json();
    const classData = {
      ...body,
      owner_id: user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const docRef = await adminDb.collection("classes").add(classData);
      return json({ class: { id: docRef.id, ...classData } });
    } catch (dbError) {
      if (isMock) {
        return json({ class: { id: 'mock-class-' + Date.now(), ...classData } });
      }
      throw dbError;
    }
  } catch (error: any) {
    console.error('❌ Error in POST classes API:', error.message);
    return json({ error: 'Error al crear la clase' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const { request } = event;
    const { id } = await request.json();
    if (!id) return json({ error: 'ID requerido' }, { status: 400 });

    const docRef = adminDb.collection("classes").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists || docSnap.data()?.owner_id !== user.uid) {
      return json({ error: 'No autorizado' }, { status: 403 });
    }

    await docRef.delete();
    return json({ success: true });
  } catch (error: any) {
    console.error('❌ Error in DELETE classes API:', error.message);
    return json({ error: 'Error al eliminar la clase' }, { status: 500 });
  }
};
