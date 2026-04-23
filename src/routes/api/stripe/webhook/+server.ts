import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { adminDb } from '$lib/server/firebase-admin'; 

const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16' as any,
});

/**
 * Registra un log en la base de datos para auditoría
 */
async function logSystemEvent(data: { type: string, userId?: string, status: 'success' | 'error', details: any }) {
    try {
        await adminDb.collection('system_logs').add({
            ...data,
            category: 'payments',
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('❌ Falló el guardado del log:', err);
    }
}

export const POST = async ({ request }) => {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        return json({ error: 'Falta la firma de Stripe' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
        console.error('⚠️ Error verificando webhook:', err.message);
        return json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }


    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.client_reference_id; 
                
                if (userId) {
                    try {
                        await adminDb.collection('users').doc(userId).update({
                            'settings.plan': 'premium',
                            'settings.stripeCustomerId': session.customer,
                            'settings.status': 'active',
                            'updatedAt': new Date().toISOString()
                        });
                    } catch (err) {
                        await adminDb.collection('users').doc(userId).set({
                            settings: {
                                plan: 'premium',
                                stripeCustomerId: session.customer,
                                status: 'active'
                            },
                            updatedAt: new Date().toISOString()
                        });
                    }

                    await logSystemEvent({
                        type: 'paymentCompleted',
                        userId,
                        status: 'success',
                        details: { sessionId: session.id, customer: session.customer }
                    });

                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const snapshot = await adminDb.collection('users').where('settings.stripeCustomerId', '==', customerId).get();

                if (!snapshot.empty) {
                    const userDoc = snapshot.docs[0];
                    await userDoc.ref.update({
                        'settings.plan': 'free',
                        'settings.status': 'canceled',
                        updatedAt: new Date().toISOString()
                    });

                    await logSystemEvent({
                        type: 'subscriptionCanceled',
                        userId: userDoc.id,
                        status: 'success',
                        details: { subscriptionId: subscription.id, customer: customerId }
                    });

                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                const customerId = invoice.customer as string;
                
                const snapshot = await adminDb.collection('users').where('settings.stripeCustomerId', '==', customerId).get();
                if (!snapshot.empty) {
                    await logSystemEvent({
                        type: 'paymentFailed',
                        userId: snapshot.docs[0].id,
                        status: 'error',
                        details: { invoiceId: invoice.id, amount: invoice.amount_due }
                    });
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const snapshot = await adminDb.collection('users').where('settings.stripeCustomerId', '==', customerId).get();

                if (!snapshot.empty) {
                    const userDoc = snapshot.docs[0];
                    // Sincronizar estado real de la suscripción de Stripe
                    const isActive = subscription.status === 'active' || subscription.status === 'trialing';
                    await userDoc.ref.update({
                        'settings.plan': isActive ? 'premium' : 'free',
                        'settings.status': subscription.status,
                        'settings.subscriptionId': subscription.id,
                        updatedAt: new Date().toISOString()
                    });

                    await logSystemEvent({
                        type: 'subscriptionUpdated',
                        userId: userDoc.id,
                        status: 'success',
                        details: { subscriptionId: subscription.id, stripeStatus: subscription.status, plan: isActive ? 'premium' : 'free' }
                    });
                }
                break;
            }

            default:
        }

        return json({ received: true });

    } catch (error: any) {
        console.error('❌ Error en el procesamiento del webhook:', error);
        
        await logSystemEvent({
            type: 'webhookError',
            status: 'error',
            details: { message: error.message, eventType: event.type }
        });

        return json({ error: 'Error interno del servidor' }, { status: 500 });
    }
};
