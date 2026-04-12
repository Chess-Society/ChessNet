import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";

export const load: PageServerLoad = async ({ locals, params }) => {
  const skillId = params.skillId;
  
  if (!locals.user) {
    throw error(401, 'Usuario no autenticado');
  }

  try {
    const skillRef = doc(db, "skills", skillId);
    const skillSnap = await getDoc(skillRef);

    if (!skillSnap.exists() || skillSnap.data().user_id !== locals.user.id) {
      throw error(404, 'Habilidad no encontrada');
    }

    const skill = { id: skillSnap.id, ...skillSnap.data() };

    // Categorías
    const qCategories = query(
      collection(db, "categories"),
      where("user_id", "==", locals.user.id),
      where("active", "==", true),
      orderBy("order_index")
    );
    const categoriesSnap = await getDocs(qCategories);
    const categories = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Prerrequisitos
    const qPrereqs = query(
      collection(db, "skills"),
      where("user_id", "==", locals.user.id),
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
    throw error(500, 'Error interno del servidor');
  }
};
