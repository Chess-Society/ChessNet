import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

import { authenticate } from '$lib/server/auth';

export const POST: RequestHandler = async (event) => {
  const { request, url, locals } = event;
  await authenticate(event);
  
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY || '');
  try {
    const { planName, priceId } = await request.json();
    const uid = locals.user.uid;
    const userEmail = locals.user.email;

    if (!priceId) {
      return json({ success: false, error: 'Falta el ID de precio' }, { status: 400 });
    }

    // Crear sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${url.origin}/panel/upgrade?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${url.origin}/panel/upgrade?status=cancel`,
      client_reference_id: uid,
      customer_email: userEmail || undefined,
      metadata: {
        planName: planName || 'Maestro Premium',
        uid: uid
      },
      subscription_data: {
        metadata: {
          uid: uid
        }
      }
    });

    return json({ success: true, paymentUrl: session.url });
  } catch (error: any) {
    console.error('❌ Error creating Stripe session:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};
