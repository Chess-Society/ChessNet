import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) return json({ error: 'Usuario no autenticado' }, { status: 401 });
  const uid = locals.user.uid;

  const classId = url.searchParams.get('classId') || url.searchParams.get('classId');
  const skillId = url.searchParams.get('skillId') || url.searchParams.get('skill_id');

  try {
    let query = adminDb.collection("class_skills").where("ownerId", "==", uid).where("active", "==", true);
    
    if (classId) query = query.where("classId", "==", classId);
    if (skillId) query = query.where("skillId", "==", skillId);

    const snap = await query.get();
    const data = snap.docs.map((doc: any) => serializeRecord({ id: doc.id, ...doc.data() }));
    
    return json({ classSkills: data.sort((a: any, b: any) => (a.orderIndex || a.order_index || 0) - (b.orderIndex || b.order_index || 0)) });
  } catch (err) {
    console.error('❌ Error fetching class skills:', err);
    return json({ error: 'Error interno del servidor' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Usuario no autenticado' }, { status: 401 });
  const uid = locals.user.uid;

  try {
    const body = await request.json();
    const classId = body.classId || body.classId;
    const skillId = body.skillId || body.skill_id;
    const orderIndex = body.orderIndex || body.order_index;

    if (!classId || !skillId) {
      return json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Verify ownership of the class
    const classSnap = await adminDb.collection("classes").doc(classId).get();
    if (!classSnap.exists || classSnap.data()?.ownerId !== uid) {
      return json({ error: 'Clase no encontrada o acceso denegado' }, { status: 404 });
    }

    const newDoc = {
      classId,
      skillId,
      ownerId: uid,
      assignedAt: new Date().toISOString(),
      active: true,
      orderIndex: orderIndex || 0
    };

    const docRef = await adminDb.collection("class_skills").add(newDoc);
    return json({ classSkill: { id: docRef.id, ...newDoc } });

  } catch (err) {
    console.error('❌ Error in class-skills POST:', err);
    return json({ error: 'Error interno del servidor' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) return json({ error: 'Usuario no autenticado' }, { status: 401 });
  const uid = locals.user.uid;

  const classId = url.searchParams.get('classId') || url.searchParams.get('classId');
  const skillId = url.searchParams.get('skillId') || url.searchParams.get('skill_id');

  if (!classId || !skillId) {
    return json({ error: 'Faltan classId o skillId' }, { status: 400 });
  }

  try {
    const snap = await adminDb.collection("class_skills")
      .where("ownerId", "==", uid)
      .where("classId", "==", classId)
      .where("skillId", "==", skillId)
      .where("active", "==", true)
      .limit(1)
      .get();

    if (snap.empty) {
      return json({ error: 'Asignación de habilidad no encontrada' }, { status: 404 });
    }

    await snap.docs[0].ref.update({ active: false, unassignedAt: new Date().toISOString() });
    return json({ success: true });
  } catch (err) {
    console.error('❌ Error in class-skills DELETE:', err);
    return json({ error: 'Error interno del servidor' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Usuario no autenticado' }, { status: 401 });
  const uid = locals.user.uid;

  try {
    const body = await request.json();
    const classId = body.classId || body.classId;
    const skillsOrder = body.skillsOrder || body.skills_order;

    if (!classId || !Array.isArray(skillsOrder)) {
      return json({ error: 'Solicitud inválida' }, { status: 400 });
    }

    const batch = adminDb.batch();
    const snap = await adminDb.collection("class_skills")
      .where("ownerId", "==", uid)
      .where("classId", "==", classId)
      .where("active", "==", true)
      .get();

    snap.docs.forEach((doc: any) => {
      const data = doc.data();
      const currentSkillId = data.skillId || data.skill_id;
      const orderItem = skillsOrder.find((o: any) => (o.skillId || o.skill_id) === currentSkillId);
      if (orderItem) {
        batch.update(doc.ref, { orderIndex: orderItem.order || orderItem.orderIndex });
      }
    });

    await batch.commit();
    return json({ success: true });
  } catch (err) {
    console.error('❌ Error in class-skills PUT:', err);
    return json({ error: 'Error interno del servidor' }, { status: 500 });
  }
};
