import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

// Configuración de planes espejo de src/lib/api/subscriptions.ts
const PLANS = [
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
    ]
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
    ]
  }
];

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    return {
      user: null,
      upgradeData: null
    };
  }

  const uid = locals.user.uid;

  try {
    const userSnap = await adminDb.collection('users').doc(uid).get();
    const userData = userSnap.exists ? userSnap.data() : {};
    const settings = (userData as any)?.settings || {};
    const planName = settings.plan || 'free';
    
    const currentPlan = PLANS.find(p => p.name === planName) || PLANS[0];
    
    // Simplificamos usage statistics para el servidor (pueden cargarse en modo hidratación si es necesario,
    // o consultarse aquí si hay impacto crítico en SEO/UX inicial)
    const usageStats = {
      students_count: 0,
      classes_count: 0,
      schools_count: 0,
      tournaments_count: 0,
      storage_used_mb: 0,
      custom_skills_count: 0
    };

    return {
      user: locals.user,
      upgradeData: serializeRecord({
        current_plan: currentPlan,
        available_plans: PLANS,
        user_limits: {
          ...currentPlan,
          plan_name: planName,
          status: 'active'
        },
        usage_stats: usageStats
      })
    };
  } catch (error) {
    console.error('❌ Error loading upgrade data in server:', error);
    return {
      user: locals.user,
      upgradeData: null
    };
  }
};
