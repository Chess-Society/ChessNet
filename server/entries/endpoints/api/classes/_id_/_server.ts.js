import { json } from "@sveltejs/kit";
import { d as db } from "../../../../../chunks/firebase.js";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
const PUT = async ({ request, params, locals }) => {
  console.log("✏️ API Classes - Updating class...");
  if (!locals.user) {
    return json({ error: "Usuario no autenticado" }, { status: 401 });
  }
  try {
    const { id } = params;
    const body = await request.json();
    const { name, college_id } = body;
    if (!id) {
      return json({ error: "ID de la clase requerido" }, { status: 400 });
    }
    const classRef = doc(db, "classes", id);
    const classSnap = await getDoc(classRef);
    if (!classSnap.exists() || classSnap.data().user_id !== locals.user.id) {
      return json({ error: "Clase no encontrada o acceso denegado" }, { status: 404 });
    }
    const updateData = {
      updated_at: serverTimestamp()
    };
    if (name !== void 0) updateData.name = name.trim();
    if (college_id !== void 0) updateData.college_id = college_id;
    await updateDoc(classRef, updateData);
    return json({
      success: true,
      class: { id, ...classSnap.data(), ...updateData },
      message: "Clase actualizada correctamente"
    });
  } catch (error) {
    console.error("❌ Error in PUT classes/[id] API:", error.message);
    return json({ error: "Error al actualizar la clase" }, { status: 500 });
  }
};
const PATCH = async ({ request, params, locals }) => {
  console.log("🩹 API Classes - Patching class...");
  if (!locals.user) {
    return json({ error: "Usuario no autenticado" }, { status: 401 });
  }
  try {
    const { id } = params;
    const body = await request.json();
    if (!id) {
      return json({ error: "ID de la clase requerido" }, { status: 400 });
    }
    const classRef = doc(db, "classes", id);
    const classSnap = await getDoc(classRef);
    if (!classSnap.exists() || classSnap.data().user_id !== locals.user.id) {
      return json({ error: "Clase no encontrada o acceso denegado" }, { status: 404 });
    }
    await updateDoc(classRef, {
      ...body,
      updated_at: serverTimestamp()
    });
    return json({ success: true });
  } catch (error) {
    console.error("❌ Error in PATCH classes/[id] API:", error.message);
    return json({ error: "Error al actualizar la clase" }, { status: 500 });
  }
};
export {
  PATCH,
  PUT
};
