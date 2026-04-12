import { d as db } from "../../../../chunks/firebase.js";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
import { error } from "@sveltejs/kit";
const load = async ({ locals }) => {
  console.log("🎯 Skills page server load - User:", locals.user?.id);
  if (!locals.user) {
    throw error(401, "Usuario no autenticado");
  }
  try {
    const q = query(
      collection(db, "skills"),
      where("user_id", "==", locals.user.id),
      orderBy("created_at", "desc")
    );
    const skillsSnap = await getDocs(q);
    const skills = skillsSnap.docs.map((doc) => {
      const data = doc.data();
      let difficulty = data.difficulty;
      if (typeof difficulty === "number") {
        if (difficulty === 1) difficulty = "beginner";
        else if (difficulty === 2) difficulty = "intermediate";
        else if (difficulty === 3) difficulty = "advanced";
      }
      return {
        id: doc.id,
        ...data,
        difficulty: difficulty || "beginner",
        category: data.category || "Sin categoría"
      };
    });
    const stats = {
      total: skills.length,
      beginner: skills.filter((s) => s.difficulty === "beginner").length,
      intermediate: skills.filter((s) => s.difficulty === "intermediate").length,
      advanced: skills.filter((s) => s.difficulty === "advanced").length
    };
    const categoryCounts = {};
    skills.forEach((s) => {
      const cat = s.category || "Sin categoría";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const categories = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count
    }));
    return {
      user: locals.user,
      skills,
      categories,
      stats
    };
  } catch (err) {
    console.error("❌ Error fetching skills:", err);
    throw error(500, "Error al cargar las habilidades");
  }
};
export {
  load
};
