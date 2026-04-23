import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

// Configuración de planes espejo de src/lib/api/subscriptions.ts
const PLANS = [
  {
    id: 'plan-free',
    name: 'free',
    display_name: 'Ajedrecista',
    description: 'Perfecto para clases particulares o grupos pequeños.',
    price_annual: 0,
    currency: 'EUR',
    max_students: 10,
    max_classes: 1,
    max_schools: 1,
    max_tournaments: 0,
    max_storage_mb: 50,
    max_custom_skills: 0,
    features: [
      '1 Centro / Escuela',
      '1 Clase o grupo',
      'Hasta 10 Alumnos totales',
      'Control de asistencia'
    ]
  },
  {
    id: 'plan-premium',
    name: 'premium',
    display_name: 'Maestro Premium',
    description: 'Control total sin límites para tu academia profesional.',
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
      'Gestión de Torneos Pro',
      'Importación IA e Informes',
      'Lobby y Comunidad Premium'
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
    
    // Fetch real usage statistics for the user
    const [schoolsSnap, classesSnap, studentsSnap, tournamentsSnap] = await Promise.all([
      adminDb.collection('schools').where('createdBy', '==', uid).count().get(),
      adminDb.collection('classes').where('createdBy', '==', uid).count().get(),
      adminDb.collection('students').where('createdBy', '==', uid).count().get(),
      adminDb.collection('tournaments').where('createdBy', '==', uid).count().get()
    ]);

    const usageStats = {
      students_count: studentsSnap.data().count,
      classes_count: classesSnap.data().count,
      schools_count: schoolsSnap.data().count,
      tournaments_count: tournamentsSnap.data().count,
      storage_used_mb: 0, // Simplified for now
      custom_skills_count: 0 // Simplified for now
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
