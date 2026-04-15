import type { PageServerLoad } from './$types';
import { classesApi } from '$lib/api/classes';
import { skillsApi } from '$lib/api/skills';
import { classSkillsApi } from '$lib/api/class-skills';

export const load: PageServerLoad = async ({ locals, params }) => {
  console.log('🎯 Class skills page server load - User:', locals.user?.email || 'none');
  console.log('🎯 Class ID:', params.classId);
  
  if (!locals.user) {
    return {
      user: null,
      class: null,
      assignedSkills: [],
      availableSkillsByCategory: {},
      stats: { total_assigned: 0, total_available: 0, categories_count: 0 }
    };
  }
  
  try {
    const classId = params.classId;
    
    // Obtener la clase, skills asignadas y todas las skills del usuario en paralelo
    const [classData, assignedClassSkills, allSkills] = await Promise.all([
      classesApi.getClass(classId),
      classSkillsApi.getClassSkills(classId),
      skillsApi.getMySkills()
    ]);
    
    if (!classData) {
      return {
        user: locals.user,
        class: null,
        assignedSkills: [],
        availableSkillsByCategory: {},
        stats: { total_assigned: 0, total_available: 0, categories_count: 0 }
      };
    }
    
    // Preparar las skills asignadas con formato compatible con la UI
    const assignedSkills = assignedClassSkills.map(cs => ({
      ...cs.skill,
      assigned_at: cs.created_at,
      order: cs.order_index,
      assignment_id: cs.id
    }));
    
    // Filtrar skills no asignadas
    const assignedSkillIds = assignedSkills.map(s => s.id);
    const availableSkills = allSkills.filter(s => !assignedSkillIds.includes(s.id));
    
    // Agrupar skills disponibles por categoría
    // Nota: El script original de Supabase buscaba el nombre en 'categories.name'
    // En las skills de Firebase, ya adjuntamos 'categories' en getMySkills
    const availableSkillsByCategory = availableSkills.reduce((acc, skill: any) => {
      const categoryName = skill.categories?.name || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(skill);
      return acc;
    }, {} as Record<string, any[]>);
    
    const stats = {
      total_assigned: assignedSkills.length,
      total_available: availableSkills.length,
      categories_count: Object.keys(availableSkillsByCategory).length
    };
    
    console.log('✅ Class skills data loaded successfully');
    return {
      user: locals.user,
      class: classData,
      assignedSkills,
      availableSkillsByCategory,
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
