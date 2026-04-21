import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    const snapshot = await adminDb.collection("skills")
      .where("owner_id", "==", locals.user.uid)
      .orderBy("created_at", "desc")
      .get();
        
    const skills = snapshot.docs.map((doc: any) => serializeRecord({ id: doc.id, ...doc.data() }));
    return json({ skills });
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
    const body = await request.json();
    
    // Handle array of skills (Batch Import)
    if (Array.isArray(body)) {
      const batch = adminDb.batch();
      const results: string[] = [];
      
      body.forEach(skill => {
        const skillRef = adminDb.collection("skills").doc();
        const skillData = {
          ...skill,
          owner_id: locals.user.uid,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        batch.set(skillRef, skillData);
        results.push(skillRef.id);
      });
      
      await batch.commit();
      return json({ success: true, ids: results });
    }

    // Handle single skill
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
    return json({ error: 'Error al procesar la habilidad' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'User not authenticated' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) return json({ error: 'ID required' }, { status: 400 });

    const docRef = adminDb.collection("skills").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists || docSnap.data()?.owner_id !== locals.user.uid) {
      return json({ error: 'Unauthorized' }, { status: 403 });
    }

    await docRef.delete();
    return json({ success: true });
  } catch (error: any) {
    console.error('❌ Error in DELETE skills API:', error.message);
    return json({ error: 'Error deleting skill' }, { status: 500 });
  }
};
