import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { db } from '$lib/firebase';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

export const POST: RequestHandler = async ({ request }) => {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY || '');
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig || !env.STRIPE_WEBHOOK_SECRET || env.STRIPE_WEBHOOK_SECRET === 'whsec_...') {
    console.warn('⚠️ Webhook recibido sin secreto de firma configurado. Saltando verificación (solo para desarrollo inicial).');
  }

  let event;

  try {
    if (sig && env.STRIPE_WEBHOOK_SECRET && env.STRIPE_WEBHOOK_SECRET !== 'whsec_...') {
      event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`❌ Error de firma de Webhook: ${err.message}`);
    return json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Manejar el evento
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const uid = session.client_reference_id;
      
      if (uid) {
        console.log(`✅ Pago completado para el usuario: ${uid}`);
        
        try {
          const userRef = doc(db, 'users', uid);
          const settingsRef = doc(db, 'users', uid, 'config', 'settings');
          
          // Actualizar el plan del usuario
          // Usamos una estructura estándar para ChessNet
          await setDoc(settingsRef, {
            subscription: {
              plan: 'premium',
              status: 'active',
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              updated_at: new Date().toISOString()
            }
          }, { merge: true });

          console.log(`🚀 Plan actualizado en Firestore para: ${uid}`);
        } catch (dbError) {
          console.error('❌ Error actualizando Firestore:', dbError);
        }
      }
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      // TODO: Buscar el usuario por stripe_customer_id y degradar su plan
      console.log(`ℹ️ Suscripción cancelada para el cliente: ${customerId}`);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return json({ received: true });
};
