import { json, error as skError } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';

// Mock data as fallback for dev user
let mockClassSkills = [
  { id: 'csk-1', class_id: 'mock-class-1', skill_id: 'mock-skill-1', owner_id: 'chessnet-dev-uid', assigned_at: '2024-01-15T10:00:00Z', active: true, order: 1 },
  { id: 'csk-2', class_id: 'mock-class-1', skill_id: 'mock-skill-2', owner_id: 'chessnet-dev-uid', assigned_at: '2024-01-20T10:00:00Z', active: true, order: 2 },
];

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });
  const uid = locals.user.uid;
  const isMock = uid === 'chessnet-dev-uid';

  const classId = url.searchParams.get('class_id');
  const skillId = url.searchParams.get('skill_id');

  if (isMock) {
    let filteredData = mockClassSkills.filter(cs => cs.owner_id === uid && cs.active);
    if (classId) filteredData = filteredData.filter(cs => cs.class_id === classId);
    if (skillId) filteredData = filteredData.filter(cs => cs.skill_id === skillId);
    return json({ class_skills: filteredData.sort((a, b) => a.order - b.order) });
  }

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
  const isMock = uid === 'chessnet-dev-uid';

  try {
    const body = await request.json();
    const { class_id, skill_id, order_index } = body;

    if (!class_id || !skill_id) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (isMock) {
      const newSkill = {
        id: `csk-${Date.now()}`,
        class_id, skill_id, owner_id: uid,
        assigned_at: new Date().toISOString(),
        active: true, order: order_index || 0
      };
      mockClassSkills.push(newSkill);
      return json({ class_skill: newSkill });
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
  const isMock = uid === 'chessnet-dev-uid';

  const classId = url.searchParams.get('class_id');
  const skillId = url.searchParams.get('skill_id');

  if (!classId || !skillId) {
    return json({ error: 'Missing class_id or skill_id' }, { status: 400 });
  }

  if (isMock) {
    const idx = mockClassSkills.findIndex(cs => cs.class_id === classId && cs.skill_id === skillId && cs.active);
    if (idx !== -1) mockClassSkills[idx].active = false;
    return json({ success: true });
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
  const isMock = uid === 'chessnet-dev-uid';

  try {
    const { class_id, skills_order } = await request.json();

    if (!class_id || !Array.isArray(skills_order)) {
      return json({ error: 'Invalid request' }, { status: 400 });
    }

    if (isMock) {
      skills_order.forEach(({ skill_id, order }) => {
        const idx = mockClassSkills.findIndex(cs => cs.class_id === class_id && cs.skill_id === skill_id && cs.active);
        if (idx !== -1) mockClassSkills[idx].order = order;
      });
      return json({ success: true });
    }

    const batch = adminDb.batch();
    const snap = await adminDb.collection("class_skills")
      .where("owner_id", "==", uid)
      .where("class_id", "==", class_id)
      .where("active", "==", true)
      .get();

    snap.docs.forEach((doc: any) => {
      const data = doc.data();
      const orderItem = skills_order.find(o => o.skill_id === data.skill_id);
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
