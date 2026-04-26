import type { PageServerLoad, Actions } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import { fail, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const uid = locals.user.uid;
  const classId = params.classId;

  try {
    const [classSnap, allSkillsSnap, assignedSnap] = await Promise.all([
      adminDb.collection('classes').doc(classId).get(),
      adminDb.collection('skills').where('owner_id', '==', uid).get(),
      adminDb.collection('class_skills')
        .where('owner_id', '==', uid)
        .where('classId', '==', classId)
        .where('active', '==', true)
        .get()
    ]);

    if (!classSnap.exists) {
      throw error(404, 'Class not found');
    }

    const classData = { id: classSnap.id, ...classSnap.data() };
    const allSkills = allSkillsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    const assignedDocs = assignedSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    const assignedSkillIds = new Set(assignedDocs.map((ad: any) => ad.skillId));
    
    // Assigned skills with their details
    const assignedSkills = assignedDocs
      .map((ad: any) => {
        const skillDetail = allSkills.find((s: any) => s.id === ad.skillId);
        return {
          ...skillDetail,
          ...ad,
          assigned_at: ad.assignedAt || ad.assigned_at
        };
      })
      .sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));

    // Available skills grouped by category
    const availableSkills = allSkills.filter((s: any) => !assignedSkillIds.has(s.id));
    const availableSkillsByCategory = availableSkills.reduce((acc: any, skill: any) => {
      const categoryName = skill.category || 'General';
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(skill);
      return acc;
    }, {} as Record<string, any[]>);

    const stats = {
      assigned: assignedSkills.length,
      available: availableSkills.length,
      byCategory: assignedSkills.reduce((acc: any, s: any) => {
        acc[s.category] = (acc[s.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    return {
      user: locals.user,
      class: serializeRecord(classData),
      assignedSkills: serializeRecord(assignedSkills),
      availableSkillsByCategory: serializeRecord(availableSkillsByCategory),
      stats: serializeRecord(stats)
    };

  } catch (err: any) {
    console.error('❌ Error in class skills page load:', err);
    throw error(500, 'Internal Server Error');
  }
};

export const actions: Actions = {
  assign: async ({ request, locals, params }) => {
    if (!locals.user) return fail(401);
    const uid = locals.user.uid;
    const classId = params.classId;
    const formData = await request.formData();
    const skillId = formData.get('skillId') as string;

    if (!skillId) return fail(400);

    try {
      const newDoc = {
        classId,
        skillId,
        owner_id: uid,
        assignedAt: new Date().toISOString(),
        active: true,
        orderIndex: 0 // Will be handled by reorder or default
      };

      await adminDb.collection("class_skills").add(newDoc);
      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500);
    }
  },

  unassign: async ({ request, locals, params }) => {
    if (!locals.user) return fail(401);
    const uid = locals.user.uid;
    const classId = params.classId;
    const formData = await request.formData();
    const skillId = formData.get('skillId') as string;

    if (!skillId) return fail(400);

    try {
      const snap = await adminDb.collection("class_skills")
        .where("owner_id", "==", uid)
        .where("classId", "==", classId)
        .where("skillId", "==", skillId)
        .where("active", "==", true)
        .get();

      if (snap.empty) return fail(404);

      const batch = adminDb.batch();
      snap.docs.forEach((doc: any) => {
        batch.update(doc.ref, { active: false, unassignedAt: new Date().toISOString() });
      });
      await batch.commit();
      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500);
    }
  },

  reorder: async ({ request, locals, params }) => {
    if (!locals.user) return fail(401);
    const uid = locals.user.uid;
    const classId = params.classId;
    const formData = await request.formData();
    const reorderings = JSON.parse(formData.get('reorderings') as string) as { skillId: string, order: number }[];

    try {
      const snap = await adminDb.collection("class_skills")
        .where("owner_id", "==", uid)
        .where("classId", "==", classId)
        .where("active", "==", true)
        .get();

      const batch = adminDb.batch();
      snap.docs.forEach((doc: any) => {
        const data = doc.data();
        const r = reorderings.find(o => o.skillId === data.skillId);
        if (r) {
          batch.update(doc.ref, { orderIndex: r.order });
        }
      });

      await batch.commit();
      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500);
    }
  }
};
