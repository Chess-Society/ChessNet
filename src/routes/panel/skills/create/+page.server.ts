import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals }) => {
  let availablePrerequisites = [];

  if (locals.user?.uid) {
    try {
      const skillsSnap = await adminDb.collection("skills")
        .where("owner_id", "==", locals.user.uid)
        .get();
      
      availablePrerequisites = (skillsSnap?.docs || []).map((doc: any) => serializeRecord({
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
