import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/server/firebase-admin';

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  const endpoint = url.searchParams.get('endpoint') || 'plans';
  
  try {
    if (endpoint === 'plans') {
      const snapshot = await adminDb.collection("subscription_plans")
        .where("is_active", "==", true)
        .orderBy("sort_order")
        .get();
      const plans = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      return json({ success: true, plans });
    }
    
    if (endpoint === 'current') {
      const userDoc = await adminDb.collection("users").doc(locals.user.uid).get();
      const userData = userDoc.exists ? userDoc.data() : null;
      const plan = userData?.settings?.plan || 'free';
      
      // Enriquecer con límites teóricos (esto debería venir de DB, pero por ahora Hardcodeamos los del landing)
      const planLimits = plan === 'premium' ? {
        plan_name: 'premium',
        display_name: 'Maestro Premium',
        max_students: 9999,
        max_classes: 9999,
        max_schools: 9999
      } : {
        plan_name: 'free',
        display_name: 'Ajedrecista',
        max_students: 12,
        max_classes: 2,
        max_schools: 1
      };

      return json({ success: true, user_plan: planLimits });
    }

    return json({ error: 'Invalid endpoint' }, { status: 400 });
  } catch (error: any) {
    console.error('❌ Error in subscriptions API:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { action } = await request.json();
    
    if (action === 'check-limit') {
      const body = await request.json();
      const type = body.type || 'student';
      const uid = locals.user.uid;
      
      let can_proceed = false;
      
      if (type === 'student') {
        const { checkStudentLimit } = await import('$lib/server/plans');
        can_proceed = await checkStudentLimit(uid);
      } else if (type === 'school') {
        const { checkSchoolLimit } = await import('$lib/server/plans');
        can_proceed = await checkSchoolLimit(uid);
      } else if (type === 'class') {
        const { checkClassLimit } = await import('$lib/server/plans');
        can_proceed = await checkClassLimit(uid);
      }

      return json({ success: true, can_proceed });
    }
    
    return json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
