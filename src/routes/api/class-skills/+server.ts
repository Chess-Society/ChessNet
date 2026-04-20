import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });
  const uid = locals.user.uid;

  const classId = url.searchParams.get('class_id');
  const skillId = url.searchParams.get('skill_id');

  try {
    let query = adminDb.collection("class_skills").where("owner_id", "==", uid).where("active", "==", true);
    
    if (classId) query = query.where("class_id", "==", classId);
    if (skillId) query = query.where("skill_id", "==", skillId);

    const snap = await query.get();
    const data = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    
    return json({ class_skills: data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)) });
  } catch (err) {
    console.error('❌ Error fetching class skills:', err);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });
  const uid = locals.user.uid;

  try {
    const body = await request.json();
    const { class_id, skill_id, order_index } = body;

    if (!class_id || !skill_id) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify ownership of the class
    const classSnap = await adminDb.collection("classes").doc(class_id).get();
    if (!classSnap.exists || classSnap.data()?.owner_id !== uid) {
      return json({ error: 'Class not found or access denied' }, { status: 404 });
    }

    const newDoc = {
      class_id,
      skill_id,
      owner_id: uid,
      assigned_at: new Date().toISOString(),
      active: true,
      order_index: order_index || 0
    };

    const docRef = await adminDb.collection("class_skills").add(newDoc);
    return json({ class_skill: { id: docRef.id, ...newDoc } });

  } catch (err) {
    console.error('❌ Error in class-skills POST:', err);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });
  const uid = locals.user.uid;

  const classId = url.searchParams.get('class_id');
  const skillId = url.searchParams.get('skill_id');

  if (!classId || !skillId) {
    return json({ error: 'Missing class_id or skill_id' }, { status: 400 });
  }

  try {
    const snap = await adminDb.collection("class_skills")
      .where("owner_id", "==", uid)
      .where("class_id", "==", classId)
      .where("skill_id", "==", skillId)
      .where("active", "==", true)
      .limit(1)
      .get();

    if (snap.empty) {
      return json({ error: 'Skill assignment not found' }, { status: 404 });
    }

    await snap.docs[0].ref.update({ active: false, unassigned_at: new Date().toISOString() });
    return json({ success: true });
  } catch (err) {
    console.error('❌ Error in class-skills DELETE:', err);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });
  const uid = locals.user.uid;

  try {
    const { class_id, skills_order } = await request.json();

    if (!class_id || !Array.isArray(skills_order)) {
      return json({ error: 'Invalid request' }, { status: 400 });
    }

    const batch = adminDb.batch();
    const snap = await adminDb.collection("class_skills")
      .where("owner_id", "==", uid)
      .where("class_id", "==", class_id)
      .where("active", "==", true)
      .get();

    snap.docs.forEach((doc: any) => {
      const data = doc.data();
      const orderItem = skills_order.find((o: any) => o.skill_id === data.skill_id);
      if (orderItem) {
        batch.update(doc.ref, { order_index: orderItem.order });
      }
    });

    await batch.commit();
    return json({ success: true });
  } catch (err) {
    console.error('❌ Error in class-skills PUT:', err);
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
