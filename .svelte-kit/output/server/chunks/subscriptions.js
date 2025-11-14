const mockPlans = [
  {
    id: "plan-free",
    name: "free",
    display_name: "Profesor Individual",
    description: "Perfecto para empezar con ChessNet",
    price_annual: 0,
    currency: "EUR",
    max_students: 15,
    max_classes: 3,
    max_colleges: 1,
    max_tournaments: 2,
    max_storage_mb: 100,
    max_custom_skills: 5,
    features: [
      "Skills básicos incluidos",
      "Asistencia básica",
      "Informes simples",
      "Soporte por email"
    ],
    is_active: true,
    sort_order: 1,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "plan-professional",
    name: "professional",
    display_name: "Profesor Multi-Centro",
    description: "Para profesores que enseñan en varios centros",
    price_annual: 39,
    currency: "EUR",
    max_students: 80,
    max_classes: 12,
    max_colleges: 3,
    max_tournaments: 10,
    max_storage_mb: 1e3,
    max_custom_skills: 50,
    features: [
      "Todo del plan gratuito",
      "Informes detallados",
      "Sistema de pagos completo",
      "Torneos avanzados",
      "Exportar datos",
      "Soporte prioritario"
    ],
    is_active: true,
    sort_order: 2,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "plan-academy",
    name: "academy",
    display_name: "Academia de Ajedrez",
    description: "Para academias y organizaciones grandes",
    price_annual: 99,
    currency: "EUR",
    max_students: 200,
    max_classes: 30,
    max_colleges: 10,
    max_tournaments: -1,
    // ilimitado
    max_storage_mb: 5e3,
    max_custom_skills: -1,
    // ilimitado
    features: [
      "Todo del plan profesional",
      "Gestión multi-sede",
      "Dashboard de administrador",
      "Integraciones avanzadas",
      "Branding personalizado",
      "Soporte telefónico",
      "Análisis avanzados"
    ],
    is_active: true,
    sort_order: 3,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }
];
const mockUserLimits = {
  plan_name: "free",
  display_name: "Profesor Individual",
  status: "active",
  expires_at: void 0,
  max_students: 15,
  max_classes: 3,
  max_colleges: 1,
  max_tournaments: 2,
  max_storage_mb: 100,
  max_custom_skills: 5,
  features: [
    "Skills básicos incluidos",
    "Asistencia básica",
    "Informes simples",
    "Soporte por email"
  ]
};
const getSubscriptionPlans = async () => {
  try {
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      console.log("🔧 DEV MODE: Usando planes mock");
      return mockPlans;
    }
    const response = await fetch("/api/subscriptions/plans", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.plans || [];
  } catch (error) {
    console.error("❌ Error fetching subscription plans:", error);
    return mockPlans;
  }
};
const getUserCurrentPlan = async () => {
  try {
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      console.log("🔧 DEV MODE: Usando límites mock");
      return mockUserLimits;
    }
    const response = await fetch("/api/subscriptions/current", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data.user_plan || mockUserLimits;
  } catch (error) {
    console.error("❌ Error fetching user current plan:", error);
    return mockUserLimits;
  }
};
const getUpgradeData = async () => {
  try {
    const [plans, userLimits] = await Promise.all([
      getSubscriptionPlans(),
      getUserCurrentPlan()
    ]);
    const currentPlan = plans.find((plan) => plan.name === userLimits.plan_name) || plans[0];
    const usageStats = {
      students_count: 8,
      classes_count: 2,
      colleges_count: 1,
      tournaments_count: 1,
      storage_used_mb: 25,
      custom_skills_count: 3
    };
    return {
      current_plan: currentPlan,
      available_plans: plans,
      user_limits: userLimits,
      usage_stats: usageStats
    };
  } catch (error) {
    console.error("❌ Error fetching upgrade data:", error);
    return {
      current_plan: mockPlans[0],
      available_plans: mockPlans,
      user_limits: mockUserLimits,
      usage_stats: {
        students_count: 0,
        classes_count: 0,
        colleges_count: 0,
        tournaments_count: 0,
        storage_used_mb: 0,
        custom_skills_count: 0
      }
    };
  }
};
export {
  getUpgradeData as g
};
