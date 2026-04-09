import { json } from "@sveltejs/kit";
import { d as db } from "../../../../chunks/firebase.js";
import { query, collection, where, orderBy, getDocs, serverTimestamp, addDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
const GET = async ({ locals }) => {
  console.log("🎓 API Classes - Fetching classes...");
  if (!locals.user) {
    return json({ error: "Usuario no autenticado" }, { status: 401 });
  }
  try {
    const q = query(
      collection(db, "classes"),
      where("user_id", "==", locals.user.id),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    const classes = snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
    return json({ classes });
  } catch (error) {
    console.error("❌ Error in GET classes API:", error.message);
    return json({ error: "Error al obtener las clases" }, { status: 500 });
  }
};
const POST = async ({ request, locals }) => {
  console.log("🎓 API Classes - Creating new class...");
  if (!locals.user) {
    return json({ error: "Usuario no autenticado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, college_id } = body;
    const classData = {
      user_id: locals.user.id,
      name: name?.trim() || "Clase sin nombre",
      college_id: college_id?.trim() || null,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, "classes"), classData);
    return json({ class: { id: docRef.id, ...classData } });
  } catch (error) {
    console.error("❌ Error in POST classes API:", error.message);
    return json({ error: "Error al crear la clase" }, { status: 500 });
  }
};
const DELETE = async ({ request, locals }) => {
  console.log("🗑️ API Classes - Deleting class...");
  if (!locals.user) {
    return json({ error: "Usuario no autenticado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return json({ error: "ID de la clase requerido" }, { status: 400 });
    }
    const classRef = doc(db, "classes", id);
    const classSnap = await getDoc(classRef);
    if (!classSnap.exists() || classSnap.data().user_id !== locals.user.id) {
      return json({ error: "Clase no encontrada o acceso denegado" }, { status: 404 });
    }
    await deleteDoc(classRef);
    return json({ success: true, message: "Clase eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error in DELETE classes API:", error.message);
    return json({ error: "Error al eliminar la clase" }, { status: 500 });
  }
};
export {
  DELETE,
  GET,
  POST
};
