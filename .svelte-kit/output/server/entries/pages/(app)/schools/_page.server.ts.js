import { s as schoolsApi } from "../../../../chunks/schools.js";
import { d as db } from "../../../../chunks/firebase.js";
import { query, collection, where, getDocs } from "firebase/firestore";
const load = async ({ locals }) => {
  console.log("📚 Schools page server load - User:", locals.user?.email || "none");
  if (!locals.user) {
    return {
      user: null,
      schools: []
    };
  }
  try {
    const schools = await schoolsApi.getMySchools(locals.user.id);
    const enrichedSchools = await Promise.all(schools.map(async (school) => {
      const qClasses = query(
        collection(db, "classes"),
        where("college_id", "==", school.id)
      );
      const snapClasses = await getDocs(qClasses);
      const qStudents = query(
        collection(db, "students"),
        where("college_id", "==", school.id)
      );
      const snapStudents = await getDocs(qStudents);
      return {
        ...school,
        classes_count: snapClasses.size,
        students_count: snapStudents.size
      };
    }));
    return {
      user: locals.user,
      schools: enrichedSchools
    };
  } catch (err) {
    console.error("❌ Error in schools page load:", err);
    return {
      user: locals.user,
      schools: []
    };
  }
};
export {
  load
};
