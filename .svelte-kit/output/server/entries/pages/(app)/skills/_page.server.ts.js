import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
const load = async ({ locals, url, cookies }) => {
  console.log("🎯 Skills page server load - User:", locals.user?.email || "none");
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: Skills page - Providing mock data");
    const mockSkills = [
      {
        id: "mock-skill-1",
        user_id: "dev-user-123",
        name: "Movimiento de Peones",
        description: "Comprende cómo se mueven los peones y sus reglas especiales",
        category: "Fundamentos",
        difficulty: "beginner",
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "mock-skill-2",
        user_id: "dev-user-123",
        name: "Enroque",
        description: "Domina la técnica del enroque corto y largo",
        category: "Fundamentos",
        difficulty: "beginner",
        created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "mock-skill-3",
        user_id: "dev-user-123",
        name: "Táctica: Clavada",
        description: "Identifica y ejecuta clavadas efectivas",
        category: "Táctica",
        difficulty: "intermediate",
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "mock-skill-4",
        user_id: "dev-user-123",
        name: "Táctica: Tenedor",
        description: "Reconoce y aplica tenedores en diferentes situaciones",
        category: "Táctica",
        difficulty: "intermediate",
        created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "mock-skill-5",
        user_id: "dev-user-123",
        name: "Final: Rey y Torre vs Rey",
        description: "Técnica básica de mate con rey y torre",
        category: "Finales",
        difficulty: "intermediate",
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      },
      {
        id: "mock-skill-6",
        user_id: "dev-user-123",
        name: "Apertura: Italiana",
        description: "Principios y variantes de la apertura italiana",
        category: "Aperturas",
        difficulty: "advanced",
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    const mockCategories = [
      { name: "Fundamentos", count: 2 },
      { name: "Táctica", count: 2 },
      { name: "Finales", count: 1 },
      { name: "Aperturas", count: 1 }
    ];
    const mockStats = {
      total: 6,
      beginner: 2,
      intermediate: 3,
      advanced: 1
    };
    return {
      user: locals.user,
      skills: mockSkills,
      categories: mockCategories,
      stats: mockStats
    };
  }
  console.log("🌐 PRODUCTION MODE: Skills page - Fetching from Supabase");
  if (!locals.user) {
    return {
      user: null,
      skills: [],
      categories: [],
      stats: { total: 0, beginner: 0, intermediate: 0, advanced: 0 }
    };
  }
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, options),
      remove: (key, options) => cookies.delete(key, options)
    }
  });
  try {
    const { data: skills, error: skillsError } = await supabase.from("skills").select("*").eq("user_id", locals.user.id).eq("active", true).order("created_at", { ascending: false });
    if (skillsError) {
      console.error("❌ Error fetching skills:", skillsError);
      return {
        user: locals.user,
        skills: [],
        categories: [],
        stats: { total: 0, beginner: 0, intermediate: 0, advanced: 0 }
      };
    }
    const { data: categories, error: categoriesError } = await supabase.from("categories").select("*").eq("user_id", locals.user.id).eq("active", true).order("order_index");
    if (categoriesError) {
      console.error("❌ Error fetching categories:", categoriesError);
    }
    const stats = {
      total: skills?.length || 0,
      beginner: skills?.filter((s) => s.difficulty === 1).length || 0,
      intermediate: skills?.filter((s) => s.difficulty === 2).length || 0,
      advanced: skills?.filter((s) => s.difficulty === 3).length || 0
    };
    return {
      user: locals.user,
      skills: skills || [],
      categories: categories || [],
      stats
    };
  } catch (err) {
    console.error("❌ Error in skills production mode:", err);
    return {
      user: locals.user,
      skills: [],
      categories: [],
      stats: { total: 0, beginner: 0, intermediate: 0, advanced: 0 }
    };
  }
};
export {
  load
};
