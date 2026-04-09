// @ts-nocheck
import type { PageServerLoad } from './$types';
import { db } from '$lib/firebase';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  if (!locals.user) {
    return { user: null, students: [], schools: [], classes: [] };
  }

  try {
    // Parallel fetch for students, schools, and classes
    const [studentsSnap, schoolsSnap, classesSnap] = await Promise.all([
      getDocs(query(collection(db, "students"), where("user_id", "==", locals.user.id), orderBy("first_name"))),
      getDocs(query(collection(db, "colleges"), where("user_id", "==", locals.user.id), orderBy("name"))),
      getDocs(query(collection(db, "classes"), where("user_id", "==", locals.user.id), where("active", "==", true), orderBy("name")))
    ]);

    return {
      user: locals.user,
      students: studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      schools: schoolsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      classes: classesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    };

  } catch (error: any) {
    console.error('❌ Error in create payment page:', error);
    return { user: locals.user, students: [], schools: [], classes: [] };
  }
};
