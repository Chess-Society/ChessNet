import { json } from "@sveltejs/kit";
import { d as db } from "../../../../chunks/firebase.js";
import { query, collection, where, getDocs, deleteDoc, serverTimestamp, addDoc } from "firebase/firestore";
const GET = async ({ url, locals }) => {
  console.log("👥 API Class-Students - Fetching enrollments...");
  if (!locals.user) {
    return json({ error: "Usuario no autenticado" }, { status: 401 });
  }
  const classId = url.searchParams.get("class_id");
  const studentId = url.searchParams.get("student_id");
  try {
    let q = query(
      collection(db, "class_students"),
      where("owner_id", "==", locals.user.id)
    );
    if (classId) {
      q = query(q, where("class_id", "==", classId));
    }
    if (studentId) {
      q = query(q, where("student_id", "==", studentId));
    }
    const snapshot = await getDocs(q);
    const classStudents = snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
    return json({ class_students: classStudents });
  } catch (error) {
    console.error("❌ Error in GET class-students API:", error.message);
    return json({ error: "Error al obtener las inscripciones" }, { status: 500 });
  }
};
const POST = async ({ request, locals }) => {
  console.log("👥 API Class-Students - Creating enrollment...");
  if (!locals.user) {
    return json({ error: "Usuario no autenticado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { class_id, student_id } = body;
    if (!class_id || !student_id) {
      return json({ error: "class_id and student_id are required" }, { status: 400 });
    }
    const q = query(
      collection(db, "class_students"),
      where("class_id", "==", class_id),
      where("student_id", "==", student_id),
      where("owner_id", "==", locals.user.id)
    );
    const existingSnap = await getDocs(q);
    if (!existingSnap.empty) {
      return json({ error: "Estudiante ya inscrito" }, { status: 409 });
    }
    const enrollmentData = {
      class_id,
      student_id,
      owner_id: locals.user.id,
      enrolled_at: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, "class_students"), enrollmentData);
    return json({ class_student: { id: docRef.id, ...enrollmentData } });
  } catch (error) {
    console.error("❌ Error in POST class-students API:", error.message);
    return json({ error: "Error al inscribir al estudiante" }, { status: 500 });
  }
};
const DELETE = async ({ url, locals }) => {
  console.log("🗑️ API Class-Students - Removing enrollment...");
  if (!locals.user) {
    return json({ error: "Usuario no autenticado" }, { status: 401 });
  }
  const classId = url.searchParams.get("class_id");
  const studentId = url.searchParams.get("student_id");
  if (!classId || !studentId) {
    return json({ error: "class_id and student_id are required" }, { status: 400 });
  }
  try {
    const q = query(
      collection(db, "class_students"),
      where("class_id", "==", classId),
      where("student_id", "==", studentId),
      where("owner_id", "==", locals.user.id)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return json({ error: "Inscripción no encontrada" }, { status: 404 });
    }
    const deletePromises = snapshot.docs.map((doc2) => deleteDoc(doc2.ref));
    await Promise.all(deletePromises);
    return json({ success: true, message: "Estudiante desinscrito correctamente" });
  } catch (error) {
    console.error("❌ Error in DELETE class-students API:", error.message);
    return json({ error: "Error al eliminar la inscripción" }, { status: 500 });
  }
};
export {
  DELETE,
  GET,
  POST
};
