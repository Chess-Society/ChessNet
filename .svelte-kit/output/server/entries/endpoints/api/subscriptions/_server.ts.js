import { json } from "@sveltejs/kit";
const GET = async ({ url, locals }) => {
  console.log("📡 API Subscriptions GET - Getting subscription plans");
  const endpoint = url.searchParams.get("endpoint") || "plans";
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: Returning mock subscription data");
    if (endpoint === "plans") {
      return json({
        success: true,
        plans: [
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
            sort_order: 1
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
            sort_order: 2
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
            max_storage_mb: 5e3,
            max_custom_skills: -1,
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
            sort_order: 3
          }
        ]
      });
    }
    if (endpoint === "current") {
      return json({
        success: true,
        user_plan: {
          plan_name: "free",
          display_name: "Profesor Individual",
          status: "active",
          expires_at: null,
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
        }
      });
    }
  }
  try {
    console.log("🌐 PROD MODE: Fetching from Supabase");
    if (!locals.user) {
      return json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    return json({
      success: false,
      error: "Production API not implemented yet"
    }, { status: 501 });
  } catch (error) {
    console.error("❌ Error in subscriptions API:", error);
    return json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
};
const POST = async ({ request, url, locals }) => {
  console.log("📡 API Subscriptions POST - Processing subscription action");
  const { action, ...data } = await request.json();
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: Simulating subscription action:", action);
    if (action === "check-limit") {
      const { limit_type, current_count } = data;
      console.log(`✅ ACCESO COMPLETO: Permitido ${limit_type} (${current_count} actuales)`);
      return json({
        success: true,
        can_proceed: true,
        // Siempre true
        current_limit: -1,
        // Ilimitado
        current_count
      });
    }
    if (action === "create-payment") {
      const { plan_name } = data;
      const amounts = {
        professional: "39.00",
        academy: "99.00"
      };
      const amount = amounts[plan_name] || "0.00";
      return json({
        success: true,
        payment_url: `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_xclick&business=chessnetappweb@gmail.com&item_name=ChessNet%20${plan_name}&amount=${amount}&currency_code=EUR&return=http://localhost:5174/upgrade/success&cancel_return=http://localhost:5174/upgrade/cancel`
      });
    }
  }
  try {
    console.log("🌐 PROD MODE: Processing with Supabase");
    if (!locals.user) {
      return json({ success: false, error: "Not authenticated" }, { status: 401 });
    }
    return json({
      success: false,
      error: "Production API not implemented yet"
    }, { status: 501 });
  } catch (error) {
    console.error("❌ Error in subscriptions POST:", error);
    return json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
};
export {
  GET,
  POST
};
