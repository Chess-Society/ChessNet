import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../../../chunks/public.js";
import { error } from "@sveltejs/kit";
const load = async ({ locals, url, params, cookies }) => {
  console.log("✏️ Edit skill page server load - User:", locals.user?.email || "none");
  console.log("✏️ Skill ID:", params.skillId);
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: Edit skill page - Providing mock data");
    const skillId = params.skillId;
    const mockSkills = [
      {
        id: "skill-001",
        user_id: "dev-user-123",
        category_id: "cat-001",
        name: "Movimiento de Peones",
        description: 'Aprender cómo se mueven los peones, incluyendo el movimiento inicial de dos casillas, la captura en diagonal y el movimiento especial "en passant".',
        difficulty: 1,
        estimated_hours: 2,
        prerequisites: [],
        learning_objectives: [
          "Identificar el movimiento básico del peón",
          "Comprender la captura diagonal",
          'Aplicar la regla del "en passant"'
        ],
        assessment_criteria: [
          "Mueve correctamente los peones en situaciones básicas",
          "Identifica oportunidades de captura diagonal",
          'Reconoce situaciones de "en passant"'
        ],
        resources: [
          "Tablero de ajedrez físico",
          "Diagrams de movimientos",
          "Ejercicios prácticos"
        ],
        order_index: 1,
        active: true,
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1e3).toISOString()
      },
      {
        id: "skill-002",
        user_id: "dev-user-123",
        category_id: "cat-001",
        name: "Movimiento de Torres",
        description: "Dominar el movimiento de las torres: horizontal y vertical, sin límite de casillas mientras no haya obstáculos.",
        difficulty: 1,
        estimated_hours: 1.5,
        prerequisites: ["skill-001"],
        learning_objectives: [
          "Identificar el movimiento horizontal y vertical de la torre",
          "Comprender las limitaciones por piezas propias y enemigas",
          "Aplicar la torre en situaciones tácticas básicas"
        ],
        assessment_criteria: [
          "Mueve las torres correctamente en línea recta",
          "Identifica casillas bloqueadas",
          "Usa la torre para atacar y defender"
        ],
        resources: [
          "Tablero de demostración",
          "Ejercicios de movimiento",
          "Problemas tácticos simples"
        ],
        order_index: 2,
        active: true,
        created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1e3).toISOString()
      },
      {
        id: "skill-003",
        user_id: "dev-user-123",
        category_id: "cat-002",
        name: "Jaque y Jaque Mate",
        description: "Entender los conceptos fundamentales de jaque (amenaza al rey) y jaque mate (rey sin escape), base de la victoria en ajedrez.",
        difficulty: 2,
        estimated_hours: 3,
        prerequisites: ["skill-001", "skill-002"],
        learning_objectives: [
          "Definir qué es el jaque",
          "Identificar todas las formas de salir del jaque",
          "Reconocer el jaque mate",
          "Ejecutar jaque mates básicos"
        ],
        assessment_criteria: [
          "Identifica correctamente situaciones de jaque",
          "Encuentra todas las salidas al jaque",
          "Reconoce el jaque mate inmediatamente",
          "Ejecuta mate con dama y torre"
        ],
        resources: [
          "Posiciones de jaque mate famosas",
          "Ejercicios progresivos",
          "Software de ajedrez educativo"
        ],
        order_index: 1,
        active: true,
        created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3).toISOString()
      }
    ];
    const mockCategories = [
      {
        id: "cat-001",
        user_id: "dev-user-123",
        name: "Movimientos Básicos",
        description: "Fundamentos del movimiento de las piezas",
        color: "#10B981",
        order_index: 1,
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1e3).toISOString()
      },
      {
        id: "cat-002",
        user_id: "dev-user-123",
        name: "Reglas Fundamentales",
        description: "Reglas esenciales del juego",
        color: "#F59E0B",
        order_index: 2,
        created_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1e3).toISOString()
      },
      {
        id: "cat-003",
        user_id: "dev-user-123",
        name: "Táctica Básica",
        description: "Primeros conceptos tácticos",
        color: "#EF4444",
        order_index: 3,
        created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1e3).toISOString()
      }
    ];
    const currentSkill = mockSkills.find((s) => s.id === skillId);
    if (!currentSkill) {
      throw new Error("Skill not found");
    }
    const currentCategory = mockCategories.find((c) => c.id === currentSkill.category_id);
    const availablePrerequisites = mockSkills.filter((s) => s.id !== skillId);
    return {
      user: locals.user,
      skill: {
        ...currentSkill,
        category: currentCategory
      },
      categories: mockCategories,
      availablePrerequisites
    };
  }
  console.log("🌐 PRODUCTION MODE: Edit skill page - Fetching from Supabase");
  if (!locals.user) {
    throw error(401, "Usuario no autenticado");
  }
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, options),
      remove: (key, options) => cookies.delete(key, options)
    }
  });
  try {
    const { data: skill, error: skillError } = await supabase.from("skills").select("*").eq("id", params.skillId).eq("user_id", locals.user.id).single();
    if (skillError) {
      console.error("❌ Error fetching skill for edit:", skillError);
      throw error(404, "Habilidad no encontrada");
    }
    if (!skill) {
      throw error(404, "Habilidad no encontrada");
    }
    const { data: categories, error: categoriesError } = await supabase.from("categories").select("*").eq("user_id", locals.user.id).eq("active", true).order("order_index");
    if (categoriesError) {
      console.error("❌ Error fetching categories:", categoriesError);
    }
    const { data: availablePrerequisites, error: prerequisitesError } = await supabase.from("skills").select("id, name, difficulty").eq("user_id", locals.user.id).neq("id", params.skillId).eq("active", true).order("difficulty");
    if (prerequisitesError) {
      console.error("❌ Error fetching prerequisites:", prerequisitesError);
    }
    const currentCategory = categories?.find((c) => c.id === skill.category_id);
    return {
      user: locals.user,
      skill: {
        ...skill,
        category: currentCategory
      },
      categories: categories || [],
      availablePrerequisites: availablePrerequisites || []
    };
  } catch (err) {
    console.error("❌ Error in edit skill page:", err);
    if (err.status) {
      throw err;
    }
    throw error(500, "Error interno del servidor");
  }
};
export {
  load
};
