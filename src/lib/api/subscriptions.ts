import { db, auth, toData } from "$lib/firebase";
import { 
  doc, 
  getDoc, 
  setDoc,
  updateDoc
} from "firebase/firestore";
import type { 
  SubscriptionPlan, 
  UserSubscription, 
  UserPlanLimits, 
  SubscriptionUpgradeData 
} from '$lib/types';

// =====================
// CONFIGURACIÓN DE PLANES
// =====================

const PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-free',
    name: 'free',
    display_name: 'Ajedrecista',
    description: 'Perfecto para empezar o gestionar una pequeña escuela local.',
    price_annual: 0,
    currency: 'EUR',
    max_students: 12,
    max_classes: 2,
    max_schools: 1,
    max_tournaments: 0,
    max_storage_mb: 50,
    max_custom_skills: 0,
    features: [
      '1 Centro / Escuela',
      '2 Clases simultáneas',
      'Hasta 12 Alumnos totales',
      'Pase de lista y Asistencia'
    ],
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'plan-premium',
    name: 'premium',
    display_name: 'Maestro Premium',
    description: 'Todas las herramientas sin límites para un control profesional total.',
    price_monthly: 1,
    price_annual: 1,
    currency: 'EUR',
    max_students: -1,
    max_classes: -1,
    max_schools: -1,
    max_tournaments: -1,
    max_storage_mb: 2000,
    max_custom_skills: -1,
    features: [
      'Centros y Clases Ilimitados',
      'Alumnos Ilimitados',
      'Gestión de Torneos (Emparejamientos)',
      'Informes PDF y Diplomas',
      'Exportación de datos (Excel/PDF)'
    ],
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const DEFAULT_LIMITS: UserPlanLimits = {
  plan_name: 'free',
  display_name: 'Ajedrecista',
  status: 'active',
  max_students: 12,
  max_classes: 2,
  max_schools: 1,
  max_tournaments: 0,
  max_storage_mb: 50,
  max_custom_skills: 0,
  features: [
    '1 Centro / Escuela',
    '2 Clases simultáneas',
    'Hasta 12 Alumnos totales',
    'Pase de lista y Asistencia'
  ]
};

// =====================
// API FUNCTIONS
// =====================

/**
 * Obtiene todos los planes de suscripción disponibles
 */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  return PLANS;
};

/**
 * Obtiene el plan actual del usuario y sus límites desde Firestore
 */
export const getUserCurrentPlan = async (userId?: string): Promise<UserPlanLimits> => {
  const uid = userId || auth.currentUser?.uid;
  if (!uid) return DEFAULT_LIMITS;

  try {
    // Unified: Read from 'users' collection as per webhook logic
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const settings = userData.settings || {};
      const planName = settings.plan || 'free';
      const plan = PLANS.find(p => p.name === planName) || PLANS[0];
      
      return {
        ...DEFAULT_LIMITS,
        ...settings,
        plan_name: planName,
        display_name: plan.display_name,
        features: plan.features
      } as UserPlanLimits;
    }

    return DEFAULT_LIMITS;
  } catch (error) {
    console.error('❌ Error fetching user subscription from Firestore:', error);
    return DEFAULT_LIMITS;
  }
};

/**
 * Verifica si el usuario puede realizar una acción según su plan
 * Actualmente configurado para permitir todo (Acceso Completo) según requerimiento de UX
 */
export const checkUserLimit = async (
  limitType: 'max_students' | 'max_classes' | 'max_schools' | 'max_tournaments',
  currentCount: number = 0
): Promise<boolean> => {
  try {
    const userLimits = await getUserCurrentPlan();
    const limit = userLimits[limitType];
    
    // -1 significa ilimitado
    if (limit === -1) return true;
    
    return currentCount < limit;
  } catch (error) {
    console.error('❌ Error checking user limit:', error);
    return true; // En caso de duda, permitimos seguir operando pero logueamos el error
  }
};

/**
 * Obtiene datos completos para la página de upgrade
 */
export const getUpgradeData = async (): Promise<SubscriptionUpgradeData> => {
  try {
    const [plans, userLimits] = await Promise.all([
      getSubscriptionPlans(),
      getUserCurrentPlan()
    ]);

    const currentPlan = plans.find(plan => plan.name === userLimits.plan_name) || plans[0];

    const usageStats = {
      students_count: 0,
      classes_count: 0,
      schools_count: 0,
      tournaments_count: 0,
      storage_used_mb: 0,
      custom_skills_count: 0
    };

    return {
      current_plan: currentPlan,
      available_plans: plans,
      user_limits: userLimits,
      usage_stats: usageStats
    };
  } catch (error) {
    console.error('❌ Error fetching upgrade data:', error);
    return {
      current_plan: PLANS[0],
      available_plans: PLANS,
      user_limits: DEFAULT_LIMITS,
      usage_stats: {
        students_count: 0,
        classes_count: 0,
        schools_count: 0,
        tournaments_count: 0,
        storage_used_mb: 0,
        custom_skills_count: 0
      }
    };
  }
};

/**
 * Inicia el proceso de upgrade con Stripe
 */
export const initiateUpgrade = async (planName: string, uid?: string, email?: string): Promise<{ success: boolean; payment_url?: string; error?: string }> => {
  try {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan_name: planName === 'premium' ? 'Maestro Premium' : planName,
        price_id: 'price_1T6H9xRBnPDD6EfR0BmyYKYf', // ID para 1€/mes (Maestro Premium)
        uid: uid || auth.currentUser?.uid,
        user_email: email || auth.currentUser?.email
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('❌ Error initiating Stripe upgrade:', error);
    return {
      success: false,
      error: error.message || 'Error al iniciar el pago.'
    };
  }
};
