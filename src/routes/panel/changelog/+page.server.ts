import { adminDb } from '$lib/server/firebase-admin';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const snapshot = await adminDb.collection('changelog').orderBy('date', 'desc').get();
  const entries = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

  return {
    entries
  };
};
