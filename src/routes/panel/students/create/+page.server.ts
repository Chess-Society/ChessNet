import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals }) => {
  
  if (!locals.user) {
    return { 
      user: null, 
      schools: [],
      classes: []
    };
  }

  const uid = locals.user.uid;
  const isMock = uid === 'chessnet-dev-uid';

  if (isMock) {
    return {
      user: locals.user,
      schools: [{ id: 'mock-school-1', name: 'Mock Academy', city: 'Localhost' }],
      classes: [{ id: 'mock-class-1', name: 'Grupo Principiantes', school_id: 'mock-school-1' }]
    };
  }

  try {
    const [schoolsSnap, classesSnap] = await Promise.all([
      adminDb.collection('schools').where('owner_id', '==', uid).orderBy('name', 'asc').get(),
      adminDb.collection('classes').where('owner_id', '==', uid).orderBy('name', 'asc').get()
    ]);

    return { 
      user: locals.user, 
      schools: serializeRecord(schoolsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }))),
      classes: serializeRecord(classesSnap.docs.map((d: any) => ({ id: d.id, ...d.data() })))
    };

  } catch (err: any) {
    console.error('❌ Error in students create page load:', err);
    return { 
      user: locals.user, 
      schools: [],
      classes: []
    };
  }
};
