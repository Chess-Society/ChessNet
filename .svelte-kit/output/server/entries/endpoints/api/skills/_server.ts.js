import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../chunks/public.js";
import { json } from "@sveltejs/kit";
let localSkills = [
  {
    id: "mock-skill-1",
    user_id: "dev-user-123",
    name: "Movimiento de Peones",
    description: "Comprende cómo se mueven los peones y sus reglas especiales",
    category_id: "mock-category-1",
    level: "beginner",
    icon: "♟️",
    resource_link: null,
    order_index: 1,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1e3).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "mock-skill-2",
    user_id: "dev-user-123",
    name: "Enroque",
    description: "Domina la técnica del enroque corto y largo",
    category_id: "mock-category-1",
    level: "beginner",
    icon: "🏰",
    resource_link: null,
    order_index: 2,
    created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1e3).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "mock-skill-3",
    user_id: "dev-user-123",
    name: "Táctica: Clavada",
    description: "Identifica y ejecuta clavadas efectivas",
    category_id: "mock-category-2",
    level: "intermediate",
    icon: "📌",
    resource_link: null,
    order_index: 3,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1e3).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "mock-skill-4",
    user_id: "dev-user-123",
    name: "Táctica: Tenedor",
    description: "Reconoce y aplica tenedores en diferentes situaciones",
    category_id: "mock-category-2",
    level: "intermediate",
    icon: "🍴",
    resource_link: null,
    order_index: 4,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1e3).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "mock-skill-5",
    user_id: "dev-user-123",
    name: "Final: Rey y Torre vs Rey",
    description: "Domina el final básico más importante",
    category_id: "mock-category-3",
    level: "advanced",
    icon: "👑",
    resource_link: null,
    order_index: 5,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1e3).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "mock-skill-6",
    user_id: "dev-user-123",
    name: "Apertura: Italiana",
    description: "Aprende los principios de la apertura italiana",
    category_id: "mock-category-4",
    level: "advanced",
    icon: "🇮🇹",
    resource_link: null,
    order_index: 6,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1e3).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }
];
let localCategories = [
  {
    id: "mock-category-1",
    name: "Fundamentos",
    description: "Conceptos básicos del ajedrez",
    color: "#3b82f6",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1e3).toISOString()
  },
  {
    id: "mock-category-2",
    name: "Táctica",
    description: "Patrones tácticos y combinaciones",
    color: "#f59e0b",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1e3).toISOString()
  },
  {
    id: "mock-category-3",
    name: "Finales",
    description: "Finales básicos y avanzados",
    color: "#10b981",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1e3).toISOString()
  },
  {
    id: "mock-category-4",
    name: "Aperturas",
    description: "Aperturas y principios de desarrollo",
    color: "#8b5cf6",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1e3).toISOString()
  }
];
const GET = async ({ cookies, url }) => {
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: API /api/skills GET - Returning mock data");
    const categoryId = url.searchParams.get("category_id");
    const level = url.searchParams.get("level");
    let filteredSkills = localSkills.filter((skill) => skill.user_id === "dev-user-123");
    if (categoryId) {
      filteredSkills = filteredSkills.filter((skill) => skill.category_id === categoryId);
    }
    if (level) {
      filteredSkills = filteredSkills.filter((skill) => skill.level === level);
    }
    filteredSkills.sort((a, b) => a.order_index - b.order_index);
    return json({
      skills: filteredSkills,
      categories: localCategories
    });
  }
  try {
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("❌ API /api/skills GET - User not authenticated:", userError?.message);
      return json({ error: "User not authenticated" }, { status: 401 });
    }
    const categoryId = url.searchParams.get("category_id");
    const level = url.searchParams.get("level");
    let skillsQuery = supabase.from("skills").select(`
        *,
        categories:category_id(*)
      `).eq("user_id", user.id).order("order_index", { ascending: true });
    if (categoryId) {
      skillsQuery = skillsQuery.eq("category_id", categoryId);
    }
    if (level) {
      skillsQuery = skillsQuery.eq("level", level);
    }
    const { data: skills, error: skillsError } = await skillsQuery;
    if (skillsError) {
      console.error("❌ Error fetching skills:", skillsError);
      return json({ error: "Error al obtener las habilidades" }, { status: 500 });
    }
    const { data: categories, error: categoriesError } = await supabase.from("categories").select("*").order("name", { ascending: true });
    if (categoriesError) {
      console.error("❌ Error fetching categories:", categoriesError);
      return json({ error: "Error al obtener las categorías" }, { status: 500 });
    }
    return json({
      skills: skills || [],
      categories: categories || []
    });
  } catch (error) {
    console.error("Error in skills API:", error);
    return json({ error: "Error interno del servidor" }, { status: 500 });
  }
};
const POST = async ({ request, cookies, url }) => {
  console.log("🎯 API Skills - Creating new skill...");
  try {
    const body = await request.json();
    const { name, description, category_id, level, icon, resource_link, order_index } = body;
    console.log("🎯 API Skills - Request data:", { name, category_id, level });
    if (order_index && (order_index < 0 || order_index > 1e3)) {
      return json({ error: "El índice de orden debe estar entre 0 y 1000" }, { status: 400 });
    }
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("❌ API /api/skills POST - User not authenticated:", userError?.message);
      return json({ error: "User not authenticated" }, { status: 401 });
    }
    try {
      const { data: skillData, error: insertError } = await supabase.from("skills").insert({
        user_id: user.id,
        name: name?.trim() || "Habilidad sin nombre",
        description: description?.trim() || null,
        category_id: category_id || null,
        level: level || "beginner",
        icon: icon?.trim() || null,
        resource_link: resource_link?.trim() || null,
        order_index: order_index || 0
      }).select().single();
      if (insertError) {
        console.error("❌ Error creating skill:", insertError);
        return json({ error: "Error al crear la habilidad: " + insertError.message }, { status: 500 });
      }
      console.log("✅ Skill created successfully:", skillData.name);
      return json({ skill: skillData });
    } catch (insertError) {
      console.error("❌ Error in skill creation:", insertError);
      return json({ error: "Error al crear la habilidad" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in skills API POST:", error);
    return json({ error: "Error interno del servidor" }, { status: 500 });
  }
};
const DELETE = async ({ request, cookies, url }) => {
  console.log("🗑️ API Skills - Deleting skill...");
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return json({ error: "Skill ID is required" }, { status: 400 });
    }
    const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (isLocalDev) {
      console.log("🔧 DEV MODE: API /api/skills DELETE - Deleting from local storage");
      const initialLength = localSkills.length;
      localSkills = localSkills.filter((s) => s.id !== id);
      if (localSkills.length === initialLength) {
        return json({ error: "Skill not found" }, { status: 404 });
      }
      console.log("✅ DEV MODE: Skill deleted from local storage");
      return json({ success: true, message: "Skill deleted successfully" });
    }
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options)
      }
    });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("❌ API /api/skills DELETE - User not authenticated:", userError?.message);
      return json({ error: "User not authenticated" }, { status: 401 });
    }
    try {
      const { data: skillData, error: fetchError } = await supabase.from("skills").select("id, user_id").eq("id", id).eq("user_id", user.id).single();
      if (fetchError || !skillData) {
        console.error("❌ Skill not found or not owned by user:", fetchError);
        return json({ error: "Skill not found" }, { status: 404 });
      }
      const { error: deleteError } = await supabase.from("skills").delete().eq("id", id).eq("user_id", user.id);
      if (deleteError) {
        console.error("❌ Error deleting skill:", deleteError);
        return json({ error: "Error al eliminar la habilidad" }, { status: 500 });
      }
      console.log("✅ Skill deleted successfully:", id);
      return json({ success: true, message: "Skill deleted successfully" });
    } catch (deleteError) {
      console.error("❌ Error in skill deletion:", deleteError);
      return json({ error: "Error al eliminar la habilidad" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in skills API DELETE:", error);
    return json({ error: "Error interno del servidor" }, { status: 500 });
  }
};
export {
  DELETE,
  GET,
  POST
};
