import { json } from "@sveltejs/kit";
let localSkills = [
  {
    id: "mock-skill-1",
    user_id: "550e8400-e29b-41d4-a716-446655440000",
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
    user_id: "550e8400-e29b-41d4-a716-446655440000",
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
    user_id: "550e8400-e29b-41d4-a716-446655440000",
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
    user_id: "550e8400-e29b-41d4-a716-446655440000",
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
    user_id: "550e8400-e29b-41d4-a716-446655440000",
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
    user_id: "550e8400-e29b-41d4-a716-446655440000",
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
const GET = async ({ locals, url }) => {
  if (!locals.user) {
    return json({ error: "User not authenticated" }, { status: 401 });
  }
  const categoryId = url.searchParams.get("category_id");
  const level = url.searchParams.get("level");
  let filteredSkills = localSkills.filter((skill) => skill.user_id === locals.user.id);
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
};
const POST = async ({ request, locals }) => {
  console.log("🎯 API Skills - Creating new skill...");
  if (!locals.user) {
    return json({ error: "User not authenticated" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, description, category_id, level, icon, resource_link, order_index } = body;
    const newSkill = {
      id: crypto.randomUUID(),
      user_id: locals.user.id,
      name: name?.trim() || "Habilidad sin nombre",
      description: description?.trim() || null,
      category_id: category_id || null,
      level: level || "beginner",
      icon: icon?.trim() || null,
      resource_link: resource_link?.trim() || null,
      order_index: order_index || 0,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    localSkills.push(newSkill);
    console.log("✅ Skill created successfully:", newSkill.name);
    return json({ skill: newSkill });
  } catch (error) {
    console.error("❌ Error in skills API POST:", error);
    return json({ error: "Error interno del servidor: " + error.message }, { status: 500 });
  }
};
const DELETE = async ({ request, locals }) => {
  console.log("🗑️ API Skills - Deleting skill...");
  if (!locals.user) {
    return json({ error: "User not authenticated" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return json({ error: "Skill ID is required" }, { status: 400 });
    }
    const initialLength = localSkills.length;
    localSkills = localSkills.filter((s) => s.id !== id || s.user_id !== locals.user.id);
    if (localSkills.length === initialLength) {
      return json({ error: "Skill not found" }, { status: 404 });
    }
    console.log("✅ Skill deleted from local storage");
    return json({ success: true, message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error in skills API DELETE:", error);
    return json({ error: "Error interno del servidor: " + error.message }, { status: 500 });
  }
};
export {
  DELETE,
  GET,
  POST
};
