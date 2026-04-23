import { json } from '@sveltejs/kit';
import { adminAuth } from '$lib/server/firebase-admin';
import { ADMIN_EMAILS } from '$lib/constants';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
  // Solo los administradores actuales (por email) pueden ejecutar esta sincronización
  if (!locals.isAdmin) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = [];
    
    for (const email of ADMIN_EMAILS) {
      try {
        const userRecord = await adminAuth.getUserByEmail(email.toLowerCase().trim());
        await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true });
        results.push({ email, status: 'success', uid: userRecord.uid });
      } catch (e: any) {
        results.push({ email, status: 'error', message: e.message });
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
