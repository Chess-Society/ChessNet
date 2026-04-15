import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";

export const load: PageServerLoad = async ({ locals, params }) => {
  const skillId = params.skillId;
  
  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  try {
    const skillRef = doc(db, "skills", skillId);
    const skillSnap = await getDoc(skillRef);

    if (!skillSnap.exists() || skillSnap.data().owner_id !== locals.user.uid) {
      throw error(404, 'Skill not found');
    }

    const skill = { id: skillSnap.id, ...skillSnap.data() };

    // Categories
    const qCategories = query(
      collection(db, "categories"),
      where("owner_id", "==", locals.user.uid),
      where("active", "==", true),
      orderBy("order_index")
    );
    const categoriesSnap = await getDocs(qCategories);
    const categories = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Prerequisites
    const qPrereqs = query(
      collection(db, "skills"),
      where("owner_id", "==", locals.user.uid),
      where("active", "==", true)
    );
    const prereqsSnap = await getDocs(qPrereqs);
    const availablePrerequisites = prereqsSnap.docs
      .map(doc => ({ id: doc.id, name: (doc.data() as any).name, difficulty: (doc.data() as any).difficulty }))
      .filter(s => s.id !== skillId);

    return {
      user: locals.user,
      skill,
      categories,
      availablePrerequisites
    };

  } catch (err: any) {
    console.error('❌ Error in edit skill page:', err);
    if (err.status) throw err;
    throw error(500, 'Internal server error');
  }
};
