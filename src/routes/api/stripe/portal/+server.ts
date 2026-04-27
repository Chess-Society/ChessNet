import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { authenticate } from '$lib/server/auth';
import { adminDb } from '$lib/server/firebase-admin';

export const POST: RequestHandler = async (event) => {
  const { url, locals } = event;
  await authenticate(event);
  
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY || env.STRIPE_SECRET_KEY || '');
  
  try {
    const uid = locals.user.uid;
    
    // Obtener el stripeCustomerId del perfil del usuario en Firestore
    const userDoc = await adminDb.collection('users').doc(uid).get();
    const userData = userDoc.data();
    const stripeCustomerId = userData?.settings?.stripeCustomerId;

    if (!stripeCustomerId) {
      return json({ 
        success: false, 
        error: 'No se encontró una suscripción activa vinculada a tu cuenta.' 
      }, { status: 404 });
    }

    // Crear sesión del Portal de Facturación de Stripe
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${url.origin}/panel/settings`,
    });

    return json({ success: true, url: session.url });
  } catch (error: any) {
    console.error('❌ Error creating Stripe Portal session:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};
