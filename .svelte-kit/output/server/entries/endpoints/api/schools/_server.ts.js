import { json } from "@sveltejs/kit";
import { d as db } from "../../../../chunks/firebase.js";
import { query, collection, where, orderBy, getDocs, serverTimestamp, addDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
const GET = async ({ locals }) => {
  console.log("🏫 API Schools - Fetching schools...");
  if (!locals.user) {
    return json({ error: "Usuario no autenticado" }, { status: 401 });
  }
  try {
    const q = query(
      collection(db, "colleges"),
      where("user_id", "==", locals.user.id),
      orderBy("created_at", "desc")
    );
    const snapshot = await getDocs(q);
    const schools = snapshot.docs.map((doc2) => ({ id: doc2.id, ...doc2.data() }));
    return json({ schools });
  } catch (error) {
    console.error("❌ Error in GET schools API:", error.message);
    return json({ error: "Error al obtener los centros" }, { status: 500 });
  }
};
const POST = async ({ request, locals }) => {
  console.log("🏫 API Schools - Creating school...");
  if (!locals.user) {
    return json({ error: "Usuario no autenticado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, city } = body;
    if (!name || !name.trim()) {
      return json({ error: "El nombre del centro es obligatorio" }, { status: 400 });
    }
    const schoolData = {
      name: name.trim(),
      city: city?.trim() || null,
      user_id: locals.user.id,
      created_by: locals.user.id,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, "colleges"), schoolData);
    return json({
      success: true,
      school: { id: docRef.id, ...schoolData },
      message: "Centro creado correctamente"
    }, { status: 201 });
  } catch (error) {
    console.error("❌ Error in POST schools API:", error.message);
    return json({ error: "Error al crear el centro" }, { status: 500 });
  }
};
const PUT = async ({ request, locals, params }) => {
  console.log("🏫 API Schools - Updating school...");
  if (!locals.user) {
    return json({ error: "Usuario no autenticado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const schoolId = body.id;
    if (!schoolId) {
      return json({ error: "ID del centro requerido" }, { status: 400 });
    }
    const schoolRef = doc(db, "colleges", schoolId);
    const schoolSnap = await getDoc(schoolRef);
    if (!schoolSnap.exists() || schoolSnap.data().user_id !== locals.user.id) {
      return json({ error: "Centro no encontrado o acceso denegado" }, { status: 404 });
    }
    const updateData = {
      ...body,
      updated_at: serverTimestamp()
    };
    delete updateData.id;
    delete updateData.user_id;
    delete updateData.created_at;
    await updateDoc(schoolRef, updateData);
    return json({
      success: true,
      school: { id: schoolId, ...schoolSnap.data(), ...updateData }
    });
  } catch (error) {
    console.error("❌ Error in PUT schools API:", error.message);
    return json({ error: "Error al actualizar el centro" }, { status: 500 });
  }
};
const DELETE = async ({ request, locals }) => {
  console.log("🗑️ API Schools - Deleting school...");
  if (!locals.user) {
    return json({ error: "Usuario no autenticado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return json({ error: "ID del centro requerido" }, { status: 400 });
    }
    const schoolRef = doc(db, "colleges", id);
    const schoolSnap = await getDoc(schoolRef);
    if (!schoolSnap.exists() || schoolSnap.data().user_id !== locals.user.id) {
      return json({ error: "Centro no encontrado o acceso denegado" }, { status: 404 });
    }
    await deleteDoc(schoolRef);
    return json({ success: true, message: "Centro eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error in DELETE schools API:", error.message);
    return json({ error: "Error al eliminar el centro" }, { status: 500 });
  }
};
export {
  DELETE,
  GET,
  POST,
  PUT
};
