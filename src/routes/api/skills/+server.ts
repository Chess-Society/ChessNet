import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const snapshot = await adminDb.collection("skills")
      .where("owner_id", "==", locals.user.uid)
      .orderBy("created_at", "desc")
      .get();
      
    const skills = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return json({ skills });
  } catch (error: any) {
    console.error('❌ Error in GET skills API:', error.message);
    return json({ error: 'Error al obtener las habilidades' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const skillData = {
      ...body,
      owner_id: locals.user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const docRef = await adminDb.collection("skills").add(skillData);
    return json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error('❌ Error in POST skills API:', error.message);
    return json({ error: 'Error al crear la habilidad' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) return json({ error: 'ID requerido' }, { status: 400 });

    const docRef = adminDb.collection("skills").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists || docSnap.data()?.owner_id !== locals.user.uid) {
      return json({ error: 'No autorizado' }, { status: 403 });
    }

    await docRef.delete();
    return json({ success: true });
  } catch (error: any) {
    console.error('❌ Error in DELETE skills API:', error.message);
    return json({ error: 'Error al eliminar la habilidad' }, { status: 500 });
  }
};
