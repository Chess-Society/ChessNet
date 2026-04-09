import { d as db } from "../../../../../chunks/firebase.js";
import { getDocs, query, collection, where, orderBy } from "firebase/firestore";
const load = async ({ locals }) => {
  if (!locals.user) {
    return { user: null, students: [], schools: [], classes: [] };
  }
  try {
    const [studentsSnap, schoolsSnap, classesSnap] = await Promise.all([
      getDocs(query(collection(db, "students"), where("user_id", "==", locals.user.id), orderBy("first_name"))),
      getDocs(query(collection(db, "colleges"), where("user_id", "==", locals.user.id), orderBy("name"))),
      getDocs(query(collection(db, "classes"), where("user_id", "==", locals.user.id), where("active", "==", true), orderBy("name")))
    ]);
    return {
      user: locals.user,
      students: studentsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      schools: schoolsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      classes: classesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    };
  } catch (error) {
    console.error("❌ Error in create payment page:", error);
    return { user: locals.user, students: [], schools: [], classes: [] };
  }
};
export {
  load
};
