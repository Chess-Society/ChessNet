import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals }) => {
  
  if (!locals.user) {
    return {
      user: null,
      schools: []
    };
  }
  
  const uid = locals.user.uid;
  const isMock = uid === 'chessnet-dev-uid';

  if (isMock) {
    return {
      user: locals.user,
      schools: [{ id: 'mock-school-1', name: 'Mock Academy', city: 'Localhost' }]
    };
  }

  try {
    const snapshot = await adminDb.collection('schools')
      .where('owner_id', '==', uid)
      .orderBy('name', 'asc')
      .get();
    
    const schools = snapshot.docs.map((doc: any) => serializeRecord({ id: doc.id, ...doc.data() }));
    
    return {
      user: locals.user,
      schools
    };
  } catch (err: any) {
    console.error('❌ Error in classes create page load:', err);
    return {
      user: locals.user,
      schools: []
    };
  }
};
