import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals, params }) => {
  
  if (!locals.user) {
    return {
      user: null,
      class: null,
      assignedSkills: [],
      availableSkillsByCategory: {},
      stats: { total_assigned: 0, total_available: 0, categories_count: 0 }
    };
  }

  const uid = locals.user.uid;
  const classId = params.classId;
  const isMock = uid === 'chessnet-dev-uid';

  if (isMock) {
    return {
      user: locals.user,
      class: { id: classId, name: 'Clase Mock', level: 'beginner', owner_id: uid },
      assignedSkills: [],
      availableSkillsByCategory: {},
      stats: { total_assigned: 0, total_available: 0, categories_count: 0 }
    };
  }

  try {
    const [classSnap, skillsSnap] = await Promise.all([
      adminDb.collection('classes').doc(classId).get(),
      adminDb.collection('skills').where('owner_id', '==', uid).get()
    ]);

    if (!classSnap.exists) {
      return {
        user: locals.user,
        class: null,
        assignedSkills: [],
        availableSkillsByCategory: {},
        stats: { total_assigned: 0, total_available: 0, categories_count: 0 }
      };
    }

    const classData = serializeRecord({ id: classSnap.id, ...classSnap.data() });
    const allSkills = skillsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    // Agrupar skills disponibles por categoría
    const availableSkillsByCategory = allSkills.reduce((acc: any, skill: any) => {
      const categoryName = skill.category || skill.categories?.name || 'Sin categoría';
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(skill);
      return acc;
    }, {} as Record<string, any[]>);

    const stats = {
      total_assigned: 0,
      total_available: allSkills.length,
      categories_count: Object.keys(availableSkillsByCategory).length
    };

    return {
      user: locals.user,
      class: classData,
      assignedSkills: [],
      availableSkillsByCategory: serializeRecord(availableSkillsByCategory),
      stats
    };

  } catch (err: any) {
    console.error('❌ Error in class skills page load:', err);
    return {
      user: locals.user,
      class: null,
      assignedSkills: [],
      availableSkillsByCategory: {},
      stats: { total_assigned: 0, total_available: 0, categories_count: 0 }
    };
  }
};
