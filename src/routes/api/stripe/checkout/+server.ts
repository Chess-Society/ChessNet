import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    const { plan_name, price_id, uid, user_email } = await request.json();

    if (!price_id || !uid) {
      return json({ success: false, error: 'Faltan parámetros obligatorios (price_id, uid)' }, { status: 400 });
    }

    // Crear sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${url.origin}/panel/upgrade?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${url.origin}/panel/upgrade?status=cancel`,
      client_reference_id: uid,
      customer_email: user_email || undefined,
      metadata: {
        plan_name: plan_name || 'Maestro Premium',
        uid: uid
      },
      subscription_data: {
        metadata: {
          uid: uid
        }
      }
    });

    return json({ success: true, payment_url: session.url });
  } catch (error: any) {
    console.error('❌ Error creating Stripe session:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};
