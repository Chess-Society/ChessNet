import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    const isMock = locals.user.uid === 'chessnet-dev-uid';
    
    // Si es mock, intentamos llamar a firestore pero si falla devolvemos lista vacía en lugar de 500
    try {
      const snapshot = await adminDb.collection("skills")
        .where("owner_id", "==", locals.user.uid)
        .orderBy("created_at", "desc")
        .get();
        
      const skills = snapshot.docs.map((doc: any) => serializeRecord({ id: doc.id, ...doc.data() }));
      return json({ skills });
    } catch (dbError: any) {
      if (isMock) {
        return json({ skills: [] });
      }
      throw dbError;
    }
  } catch (error: any) {
    console.error('❌ Error in GET skills API:', error.message);
    return json({ error: 'Error al obtener las habilidades', details: error.message }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    const isMock = locals.user.uid === 'chessnet-dev-uid';
    const body = await request.json();
    const skillData = {
      ...body,
      owner_id: locals.user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const docRef = await adminDb.collection("skills").add(skillData);
      return json({ success: true, id: docRef.id });
    } catch (dbError) {
      if (isMock) {
        return json({ success: true, id: 'mock-skill-' + Date.now() });
      }
      throw dbError;
    }
  } catch (error: any) {
    console.error('❌ Error in POST skills API:', error.message);
    return json({ error: 'Error al crear la habilidad' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    const isMock = locals.user.uid === 'chessnet-dev-uid';
    const { id } = await request.json();
    if (!id) return json({ error: 'ID required' }, { status: 400 });

    try {
      const docRef = adminDb.collection("skills").doc(id);
      const docSnap = await docRef.get();

      if (!docSnap.exists || docSnap.data()?.owner_id !== locals.user.uid) {
        if (isMock) return json({ success: true });
        return json({ error: 'Unauthorized' }, { status: 403 });
      }

      await docRef.delete();
      return json({ success: true });
    } catch (dbError) {
      if (isMock) {
        return json({ success: true });
      }
      throw dbError;
    }
  } catch (error: any) {
    console.error('❌ Error in DELETE skills API:', error.message);
    return json({ error: 'Error deleting skill' }, { status: 500 });
  }
};
