import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { error } from '@sveltejs/kit';

import { serializeRecord } from '$lib/server/serialize';
import { checkPlanGating } from '$lib/server/plans';

export const load: PageServerLoad = async (event) => {
  const { locals } = event;
  
  await checkPlanGating(event, 'premium');

  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  try {
    let skillsSnap = await adminDb.collection("skills")
        .where("owner_id", "==", locals.user.uid)
        .get();

    const skills = (skillsSnap?.docs || []).map((doc: any) => {
      const data = doc.data() || {};
      
      // Map difficulty safely
      let difficulty = data.difficulty;
      if (typeof difficulty === 'number') {
        if (difficulty === 1) difficulty = 'beginner';
        else if (difficulty === 2) difficulty = 'intermediate';
        else if (difficulty === 3) difficulty = 'advanced';
      }
      
      // Robust date parsing
      let createdAt = new Date().toISOString();
      if (data.created_at) {
        try {
          if (typeof data.created_at.toDate === 'function') {
            createdAt = data.created_at.toDate().toISOString();
          } else {
            const d = new Date(data.created_at);
            if (!isNaN(d.getTime())) {
              createdAt = d.toISOString();
            }
          }
        } catch (e) {
          console.warn(`[Skills] Invalid date for skill ${doc.id}:`, data.created_at);
        }
      }

      return { 
        id: doc.id, 
        ...data,
        name: data.name || 'Untitled Skill',
        difficulty: difficulty || 'beginner',
        category: data.category || 'General',
        created_at: createdAt
      };
    });

    // Sort by creation date safely
    skills.sort((a: any, b: any) => {
      try {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } catch (e) {
        return 0;
      }
    });

    const stats = {
      total: skills.length,
      beginner: skills.filter((s: any) => s.difficulty === 'beginner').length,
      intermediate: skills.filter((s: any) => s.difficulty === 'intermediate').length,
      advanced: skills.filter((s: any) => s.difficulty === 'advanced').length
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
