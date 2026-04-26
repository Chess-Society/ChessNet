import { json } from '@sveltejs/kit';
import { adminAuth, adminDb } from '$lib/server/firebase-admin';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
  // Solo los administradores actuales (por claims) pueden ejecutar esta sincronización
  if (!locals.isAdmin) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { email: targetEmail } = await request.json().catch(() => ({}));
    const results = [];
    
    if (targetEmail) {
      // Sincronizar un email específico
      try {
        const userRecord = await adminAuth.getUserByEmail(targetEmail.toLowerCase().trim());
        await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true });
        results.push({ email: targetEmail, status: 'success', uid: userRecord.uid });
      } catch (e: any) {
        results.push({ email: targetEmail, status: 'error', message: e.message });
      }
    } else {
      // Sincronización masiva desde Firestore
      const adminsSnapshot = await adminDb.collection('users')
        .where('role', 'in', ['admin', 'director'])
        .get();

      for (const doc of adminsSnapshot.docs) {
        const userData = doc.data();
        const email = doc.id; // Suponiendo que el ID del documento es el email
        
        try {
          const userRecord = await adminAuth.getUserByEmail(email.toLowerCase().trim());
          await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true });
          results.push({ email, status: 'success', uid: userRecord.uid });
        } catch (e: any) {
          results.push({ email, status: 'error', message: e.message });
        }
      }
    }

    return json({ 
      success: true, 
      message: 'Sincronización de claims completada',
      results 
    });
  } catch (err: any) {
    console.error('❌ [Admin/SyncClaims] Error:', err);
    return json({ error: err.message }, { status: 500 });
  }
};
