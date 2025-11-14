import type { 
  SubscriptionPlan, 
  UserSubscription, 
  UserPlanLimits, 
  SubscriptionUpgradeData 
} from '$lib/types';

// =====================
// MOCK DATA PARA DESARROLLO LOCAL
// =====================

const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-free',
    name: 'free',
    display_name: 'Profesor Individual',
    description: 'Perfecto para empezar con ChessNet',
    price_annual: 0,
    currency: 'EUR',
    max_students: 15,
    max_classes: 3,
    max_colleges: 1,
    max_tournaments: 2,
    max_storage_mb: 100,
    max_custom_skills: 5,
    features: [
      'Skills básicos incluidos',
      'Asistencia básica',
      'Informes simples',
      'Soporte por email'
    ],
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'plan-professional',
    name: 'professional',
    display_name: 'Profesor Multi-Centro',
    description: 'Para profesores que enseñan en varios centros',
    price_annual: 39,
    currency: 'EUR',
    max_students: 80,
    max_classes: 12,
    max_colleges: 3,
    max_tournaments: 10,
    max_storage_mb: 1000,
    max_custom_skills: 50,
    features: [
      'Todo del plan gratuito',
      'Informes detallados',
      'Sistema de pagos completo',
      'Torneos avanzados',
      'Exportar datos',
      'Soporte prioritario'
    ],
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'plan-academy',
    name: 'academy',
    display_name: 'Academia de Ajedrez',
    description: 'Para academias y organizaciones grandes',
    price_annual: 99,
    currency: 'EUR',
    max_students: 200,
    max_classes: 30,
    max_colleges: 10,
    max_tournaments: -1, // ilimitado
    max_storage_mb: 5000,
    max_custom_skills: -1, // ilimitado
    features: [
      'Todo del plan profesional',
      'Gestión multi-sede',
      'Dashboard de administrador',
      'Integraciones avanzadas',
      'Branding personalizado',
      'Soporte telefónico',
      'Análisis avanzados'
    ],
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockUserLimits: UserPlanLimits = {
  plan_name: 'free',
  display_name: 'Profesor Individual',
  status: 'active',
  expires_at: undefined,
  max_students: 15,
  max_classes: 3,
  max_colleges: 1,
  max_tournaments: 2,
  max_storage_mb: 100,
  max_custom_skills: 5,
  features: [
    'Skills básicos incluidos',
    'Asistencia básica',
    'Informes simples',
    'Soporte por email'
  ]
};

// =====================
// API FUNCTIONS
// =====================

/**
 * Obtiene todos los planes de suscripción disponibles
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    // En desarrollo local, usar datos mock
    if (typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      console.log('🔧 DEV MODE: Usando planes mock');
      return mockPlans;
    }

    // En producción, hacer fetch a Supabase
    const response = await fetch('/api/subscriptions/plans', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.plans || [];
  } catch (error) {
    console.error('❌ Error fetching subscription plans:', error);
    // Fallback a mock data en caso de error
    return mockPlans;
  }
};

/**
 * Obtiene el plan actual del usuario y sus límites
 */
export const getUserCurrentPlan = async (): Promise<UserPlanLimits> => {
  try {
    // En desarrollo local, usar datos mock
    if (typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      console.log('🔧 DEV MODE: Usando límites mock');
      return mockUserLimits;
    }

    // En producción, hacer fetch a Supabase
    const response = await fetch('/api/subscriptions/current', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.user_plan || mockUserLimits;
  } catch (error) {
    console.error('❌ Error fetching user current plan:', error);
    // Fallback a plan gratuito
    return mockUserLimits;
  }
};

/**
 * Verifica si el usuario puede realizar una acción según su plan
 */
export const checkUserLimit = async (
  limitType: 'students' | 'classes' | 'colleges' | 'tournaments' | 'storage_mb' | 'custom_skills',
  currentCount: number = 0
): Promise<boolean> => {
  // 🚀 ACCESO COMPLETO: Todos los usuarios tienen acceso ilimitado
  console.log(`✅ ACCESO COMPLETO: Permitido ${limitType} (${currentCount} actuales)`);
  return true;
};

/**
 * Obtiene datos completos para la página de upgrade
 */
export const getUpgradeData = async (): Promise<SubscriptionUpgradeData> => {
  try {
    // Obtener planes y límites en paralelo
    const [plans, userLimits] = await Promise.all([
      getSubscriptionPlans(),
      getUserCurrentPlan()
    ]);

    // Encontrar el plan actual
    const currentPlan = plans.find(plan => plan.name === userLimits.plan_name) || plans[0];

    // Mock de estadísticas de uso (en producción vendría de la API)
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
    console.error('❌ Error fetching upgrade data:', error);
    
    // Fallback con datos mock
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

/**
 * Inicia el proceso de upgrade con PayPal
 */
export const initiateUpgrade = async (planName: string): Promise<{ success: boolean; payment_url?: string; error?: string }> => {
  try {
    console.log(`🚀 Iniciando upgrade a plan: ${planName}`);

    // En desarrollo local, simular éxito
    if (typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      console.log('🔧 DEV MODE: Simulando upgrade exitoso');
      
      // Simular redirección a PayPal (en real sería la URL real)
      return {
        success: true,
        payment_url: `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_xclick&business=chessnetappweb@gmail.com&item_name=ChessNet%20${planName}&amount=${planName === 'professional' ? '39.00' : '99.00'}&currency_code=EUR`
      };
    }

    // En producción, crear sesión de pago real
    const response = await fetch('/api/subscriptions/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        plan_name: planName
      })
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error initiating upgrade:', error);
    return {
      success: false,
      error: 'Error al iniciar el proceso de upgrade. Por favor, intenta nuevamente.'
    };
  }
};
