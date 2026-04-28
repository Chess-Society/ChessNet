import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminDb, Filter } from '$lib/server/firebase-admin';
import { error } from '@sveltejs/kit';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

import { serializeRecord } from '$lib/server/serialize';
import { checkPlanGating, getUserPlan } from '$lib/server/plans';
import { CHESS_SYLLABUS_PRESETS } from '$lib/constants/chess-presets';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const data = await request.formData();
    const id = data.get('id') as string;

    if (!id) return fail(400);

    try {
      const doc = await adminDb.collection('skills').doc(id).get();
      if (!doc.exists || doc.data()?.ownerId !== locals.user.uid) {
        return fail(403);
      }
      await adminDb.collection('skills').doc(id).delete();
      return { success: true };
    } catch (err) {
      console.error('Error deleting skill:', err);
      return fail(500);
    }
  },

  deleteMultiple: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const data = await request.formData();
    const ids = JSON.parse(data.get('ids') as string) as string[];

    if (!ids || ids.length === 0) return fail(400);

    try {
      const batch = adminDb.batch();
      for (const id of ids) {
        const docRef = adminDb.collection('skills').doc(id);
        const doc = await docRef.get();
        if (doc.exists && doc.data()?.ownerId === locals.user.uid) {
          batch.delete(docRef);
        }
      }
      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Error deleting multiple skills:', err);
      return fail(500);
    }
  },

  clearSyllabus: async ({ locals }) => {
    if (!locals.user) return fail(401);
    try {
      const uid = locals.user.uid;
      const snap = await adminDb.collection('skills')
        .where('ownerId', '==', uid)
        .get();
      
      const batch = adminDb.batch();
      snap.docs.forEach((doc: QueryDocumentSnapshot) => batch.delete(doc.ref));
      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Error clearing syllabus:', err);
      return fail(500);
    }
  },

  importCurriculum: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const data = await request.formData();
    const curriculumStr = data.get('curriculum') as string;
    const curriculum = curriculumStr ? JSON.parse(curriculumStr) : CHESS_SYLLABUS_PRESETS;

    try {
      const uid = locals.user.uid;
      const batch = adminDb.batch();
      curriculum.forEach((skill: any, index: number) => {
        const ref = adminDb.collection('skills').doc();
        batch.set(ref, {
          ...skill,
          ownerId: uid,
          createdAt: new Date().toISOString(),
          order: index
        });
      });
      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Error importing curriculum:', err);
      return fail(500);
    }
  },

  reorder: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const data = await request.formData();
    const reorderings = JSON.parse(data.get('reorderings') as string) as { id: string, order: number }[];

    try {
      const batch = adminDb.batch();
      for (const r of reorderings) {
        const ref = adminDb.collection('skills').doc(r.id);
        batch.update(ref, { order: r.order });
      }
      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Error reordering skills:', err);
      return fail(500);
    }
  }
};

export const load: PageServerLoad = async (event) => {
  const { locals } = event;
  
  await checkPlanGating(event, 'premium');

  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  try {
    let skillsSnap = await adminDb.collection("skills")
        .where("ownerId", "==", locals.user.uid)
        .get();

    const skills = (skillsSnap?.docs || []).map((doc: any) => {
      const data = doc.data() || {};
      
      // Map difficulty safely
      let difficulty = data.difficulty || 1;
      
      // Robust date parsing
      let createdAt = new Date().toISOString();
      if (data.createdAt) {
        try {
          if (typeof data.createdAt.toDate === 'function') {
            createdAt = data.createdAt.toDate().toISOString();
          } else {
            const d = new Date(data.createdAt);
            if (!isNaN(d.getTime())) {
              createdAt = d.toISOString();
            }
          }
        } catch (e) {
          console.warn(`[Skills] Invalid date for skill ${doc.id}:`, data.createdAt);
        }
      }

      return { 
        id: doc.id, 
        ...data,
        name: data.name || 'Untitled Skill',
        difficulty: difficulty,
        category: data.category || 'General',
        createdAt: createdAt
      };
    });

    // Sort by creation date safely
    skills.sort((a: any, b: any) => {
      try {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } catch (e) {
        return 0;
      }
    });

    const stats = {
      total: skills.length,
      beginner: skills.filter((s: any) => (s.difficulty || 0) <= 2).length,
      intermediate: skills.filter((s: any) => (s.difficulty || 0) === 3).length,
      advanced: skills.filter((s: any) => (s.difficulty || 0) >= 4).length
    };

    // Get unique categories
    const categoryCounts: Record<string, number> = {};
    skills.forEach((s: any) => {
      const cat = s.category || 'Uncategorized';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categories = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count
    }));

    // FINAL SERIALIZATION - One pass at the end
    return serializeRecord({
      user: locals.user,
      skills,
      categories,
      stats
    });

  } catch (err: any) {
    console.error('❌ Error fetching skills:', err);
    // Instead of throwing 500, return empty state to prevent page crash
    return {
      user: locals.user,
      skills: [],
      categories: [],
      stats: { total: 0, beginner: 0, intermediate: 0, advanced: 0 },
      error: 'Failed to load skills'
    };
  }
};
