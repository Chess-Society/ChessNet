import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../../../chunks/public.js";
const load = async ({ locals, url, params, cookies }) => {
  console.log("🎯 Class skills page server load - User:", locals.user?.email || "none");
  console.log("🎯 Class ID:", params.classId);
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: Class skills page - Providing mock data");
    const classId = params.classId;
    const mockClasses = [
      {
        id: "mock-class-1",
        name: "Principiantes Mañana",
        description: "Grupo de iniciación para niños de 6-9 años",
        schedule: "Lunes y Miércoles 10:00-11:00",
        level: "beginner",
        room: "Aula 1"
      },
      {
        id: "mock-class-2",
        name: "Intermedios Tarde",
        description: "Grupo intermedio para estudiantes con conocimientos básicos",
        schedule: "Martes y Jueves 17:00-18:30",
        level: "intermediate",
        room: "Aula 2"
      },
      {
        id: "mock-class-3",
        name: "Avanzados Fin de Semana",
        description: "Grupo avanzado para preparación de torneos",
        schedule: "Sábados 09:00-11:00",
        level: "advanced",
        room: "Sala Principal"
      },
      {
        id: "mock-class-4",
        name: "Pequeños Ajedrecistas",
        description: "Iniciación para los más pequeños (4-6 años)",
        schedule: "Viernes 16:00-17:00",
        level: "beginner",
        room: "Sala Infantil"
      },
      {
        id: "mock-class-5",
        name: "Jóvenes Talentos",
        description: "Grupo para jóvenes con potencial competitivo",
        schedule: "Martes y Viernes 18:00-19:30",
        level: "intermediate",
        room: "Sala de Competición"
      }
    ];
    const mockSkills = [
      {
        id: "mock-skill-1",
        name: "Movimiento de Peones",
        description: "Comprende cómo se mueven los peones y sus reglas especiales",
        category: "Fundamentos",
        difficulty: "beginner"
      },
      {
        id: "mock-skill-2",
        name: "Enroque",
        description: "Domina la técnica del enroque corto y largo",
        category: "Fundamentos",
        difficulty: "beginner"
      },
      {
        id: "mock-skill-3",
        name: "Táctica: Clavada",
        description: "Identifica y ejecuta clavadas efectivas",
        category: "Táctica",
        difficulty: "intermediate"
      },
      {
        id: "mock-skill-4",
        name: "Táctica: Tenedor",
        description: "Reconoce y aplica tenedores en diferentes situaciones",
        category: "Táctica",
        difficulty: "intermediate"
      },
      {
        id: "mock-skill-5",
        name: "Final: Rey y Torre vs Rey",
        description: "Técnica básica de mate con rey y torre",
        category: "Finales",
        difficulty: "intermediate"
      },
      {
        id: "mock-skill-6",
        name: "Apertura: Italiana",
        description: "Principios y variantes de la apertura italiana",
        category: "Aperturas",
        difficulty: "advanced"
      }
    ];
    const mockClassSkills = [
      // Principiantes Mañana (mock-class-1)
      { id: "csk-1", class_id: "mock-class-1", skill_id: "mock-skill-1", assigned_at: "2024-01-15T10:00:00Z", active: true, order: 1 },
      { id: "csk-2", class_id: "mock-class-1", skill_id: "mock-skill-2", assigned_at: "2024-01-20T10:00:00Z", active: true, order: 2 },
      // Intermedios Tarde (mock-class-2)
      { id: "csk-3", class_id: "mock-class-2", skill_id: "mock-skill-2", assigned_at: "2024-01-10T17:00:00Z", active: true, order: 1 },
      { id: "csk-4", class_id: "mock-class-2", skill_id: "mock-skill-3", assigned_at: "2024-01-15T17:00:00Z", active: true, order: 2 },
      { id: "csk-5", class_id: "mock-class-2", skill_id: "mock-skill-4", assigned_at: "2024-01-20T17:00:00Z", active: true, order: 3 },
      // Avanzados Fin de Semana (mock-class-3)
      { id: "csk-6", class_id: "mock-class-3", skill_id: "mock-skill-4", assigned_at: "2024-01-05T09:00:00Z", active: true, order: 1 },
      { id: "csk-7", class_id: "mock-class-3", skill_id: "mock-skill-5", assigned_at: "2024-01-10T09:00:00Z", active: true, order: 2 },
      { id: "csk-8", class_id: "mock-class-3", skill_id: "mock-skill-6", assigned_at: "2024-01-15T09:00:00Z", active: true, order: 3 },
      // Pequeños Ajedrecistas (mock-class-4)
      { id: "csk-9", class_id: "mock-class-4", skill_id: "mock-skill-1", assigned_at: "2024-02-10T16:00:00Z", active: true, order: 1 },
      // Jóvenes Talentos (mock-class-5)
      { id: "csk-10", class_id: "mock-class-5", skill_id: "mock-skill-3", assigned_at: "2024-02-05T18:00:00Z", active: true, order: 1 },
      { id: "csk-11", class_id: "mock-class-5", skill_id: "mock-skill-4", assigned_at: "2024-02-08T18:00:00Z", active: true, order: 2 },
      { id: "csk-12", class_id: "mock-class-5", skill_id: "mock-skill-5", assigned_at: "2024-02-12T18:00:00Z", active: true, order: 3 }
    ];
    const currentClass = mockClasses.find((c) => c.id === classId);
    if (!currentClass) {
      console.log("❌ Class not found in mock data:", classId);
      return {
        user: locals.user,
        class: null,
        assignedSkills: [],
        availableSkillsByCategory: {},
        stats: { total_assigned: 0, total_available: 0, categories_count: 0 }
      };
    }
    const classSkillAssignments = mockClassSkills.filter((cs) => cs.class_id === classId && cs.active).sort((a, b) => a.order - b.order);
    const assignedSkillIds = classSkillAssignments.map((cs) => cs.skill_id);
    const assignedSkills = classSkillAssignments.map((assignment) => {
      const skill = mockSkills.find((s) => s.id === assignment.skill_id);
      return {
        ...skill,
        assigned_at: assignment.assigned_at,
        order: assignment.order,
        assignment_id: assignment.id
      };
    }).filter((skill) => skill.id);
    const availableSkills = mockSkills.filter((skill) => {
      if (assignedSkillIds.includes(skill.id)) return false;
      const classLevel = currentClass.level;
      if (classLevel === "beginner") {
        return skill.difficulty === "beginner";
      } else if (classLevel === "intermediate") {
        return ["beginner", "intermediate"].includes(skill.difficulty);
      } else if (classLevel === "advanced") {
        return ["beginner", "intermediate", "advanced"].includes(skill.difficulty);
      }
      return true;
    });
    const availableSkillsByCategory = availableSkills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});
    const stats = {
      assigned: assignedSkills.length,
      available: availableSkills.length,
      byCategory: assignedSkills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = 0;
        }
        acc[skill.category]++;
        return acc;
      }, {})
    };
    return {
      user: locals.user,
      class: currentClass,
      assignedSkills,
      availableSkillsByCategory,
      stats
    };
  }
  console.log("🌐 PRODUCTION MODE: Class skills page - Fetching data from Supabase");
  if (!locals.user) {
    console.log("❌ No user found, redirecting to login");
    return {
      user: null,
      class: null,
      assignedSkills: [],
      availableSkillsByCategory: {},
      stats: { total_assigned: 0, total_available: 0, categories_count: 0 }
    };
  }
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (name) => cookies.get(name),
      set: (name, value, options) => cookies.set(name, value, options),
      remove: (name, options) => cookies.delete(name, options)
    }
  });
  try {
    const classId = params.classId;
    const { data: classData, error: classError } = await supabase.from("classes").select("*").eq("id", classId).eq("user_id", locals.user.id).single();
    if (classError || !classData) {
      console.error("❌ Error fetching class:", classError);
      return {
        user: locals.user,
        class: null,
        assignedSkills: [],
        availableSkillsByCategory: {},
        stats: { total_assigned: 0, total_available: 0, categories_count: 0 }
      };
    }
    const { data: assignedSkills, error: assignedError } = await supabase.from("class_skills").select(`
        *,
        skills (
          id,
          name,
          description,
          difficulty,
          order_index,
          categories (
            id,
            name,
            color
          )
        )
      `).eq("class_id", classId).eq("active", true).order("order_index");
    if (assignedError) {
      console.error("❌ Error fetching assigned skills:", assignedError);
    }
    const { data: allSkills, error: skillsError } = await supabase.from("skills").select(`
        *,
        categories (
          id,
          name,
          color
        )
      `).eq("user_id", locals.user.id).eq("active", true).order("order_index");
    if (skillsError) {
      console.error("❌ Error fetching all skills:", skillsError);
    }
    const assignedSkillIds = assignedSkills?.map((s) => s.skill_id) || [];
    const availableSkills = allSkills?.filter((s) => !assignedSkillIds.includes(s.id)) || [];
    const availableSkillsByCategory = availableSkills.reduce((acc, skill) => {
      const categoryName = skill.categories?.name || "Sin categoría";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(skill);
      return acc;
    }, {});
    const stats = {
      total_assigned: assignedSkills?.length || 0,
      total_available: availableSkills.length,
      categories_count: Object.keys(availableSkillsByCategory).length
    };
    console.log("✅ Class skills data loaded successfully");
    return {
      user: locals.user,
      class: classData,
      assignedSkills: assignedSkills || [],
      availableSkillsByCategory,
      stats
    };
  } catch (err) {
    console.error("❌ Error in class skills page load:", err);
    return {
      user: locals.user,
      class: null,
      assignedSkills: [],
      availableSkillsByCategory: {},
      stats: { total_assigned: 0, total_available: 0, categories_count: 0 }
    };
  }
};
export {
  load
};
