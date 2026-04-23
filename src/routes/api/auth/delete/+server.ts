import { json } from '@sveltejs/kit';
import { adminAuth, adminDb } from '$lib/server/firebase-admin';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
  const user = locals.user;
  if (!user?.uid) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const uid = user.uid;

  try {
    const collections = [
      'schools',
      'students',
      'classes',
      'skills',
      'achievements',
      'local_tournaments',
      'local_tournament_players',
      'local_tournament_rounds',
      'local_tournament_pairings',
      'attendance',
      // 'payments', // MED-04: Excluido de borrado para auditoría financiera
      'leads',
      'lobby_reports',
      'community_messages',
      'prediction_bets'
    ];

    const deletePromises = collections.map(async (collName) => {
      // Handle both snake_case and camelCase owner fields
      const snapshot1 = await adminDb.collection(collName).where('owner_id', '==', uid).get();
      const snapshot2 = await adminDb.collection(collName).where('ownerId', '==', uid).get();
      
      const batch = adminDb.batch();
      snapshot1.docs.forEach((doc: any) => batch.delete(doc.ref));
      snapshot2.docs.forEach((doc: any) => batch.delete(doc.ref));
      
      if (snapshot1.size > 0 || snapshot2.size > 0) {
        await batch.commit();
      }
    });

    await Promise.all(deletePromises);

    // MED-04: Anonimizar registros de pagos en lugar de borrarlos (Audit Compliance)
    const paymentSnap = await adminDb.collection('payments')
      .where('owner_id', '==', uid)
      .get();
    
    if (!paymentSnap.empty) {
      const batch = adminDb.batch();
      paymentSnap.docs.forEach((doc: any) => {
        batch.update(doc.ref, {
          owner_id: 'deleted_user',
          anonymizedAt: new Date().toISOString(),
          // Mantener amount, status, y stripeId para contabilidad
        });
      });
      await batch.commit();
    }

    // Also delete the user document
    await adminDb.collection('users').doc(uid).delete();

    // Finally delete from Firebase Auth
    await adminAuth.deleteUser(uid);

    return json({ success: true });
  } catch (err: any) {
    console.error('❌ [Auth/Delete] Error:', err);
    return json({ error: err.message }, { status: 500 });
  }
};
