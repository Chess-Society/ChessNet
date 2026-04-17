import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals }) => {
  const isMock = locals.user?.uid === 'chessnet-dev-uid';
  
  let availablePrerequisites = [];

  if (!isMock && locals.user?.uid) {
    try {
      const skillsSnap = await adminDb.collection("skills")
        .where("owner_id", "==", locals.user.uid)
        .get();
      
      availablePrerequisites = (skillsSnap?.docs || []).map(doc => serializeRecord({
        id: doc.id,
        name: doc.data().name,
        difficulty: doc.data().difficulty
      }));
    } catch (e) {
      console.error("Error loading prerequisites for create page:", e);
    }
  }

  return {
    user: locals.user,
    availablePrerequisites
  };
};
