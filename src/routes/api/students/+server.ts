import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const snapshot = await adminDb.collection("students")
      .where("owner_id", "==", locals.user.uid)
      .orderBy("createdAt", "desc")
      .get();
      
    const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return json({ students });
  } catch (error: any) {
    console.error('❌ Error in GET students API:', error.message);
    return json({ error: 'Error al obtener los alumnos' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    // 1. Verificar plan y límites
    const settingsDoc = await adminDb.collection("app_settings").doc(locals.user.uid).get();
    const settings = settingsDoc.exists ? settingsDoc.data()?.settings : { plan: 'free' };
    const plan = settings?.plan || 'free';

    // 2. Contar alumnos actuales
    const countSnapshot = await adminDb.collection("students")
      .where("owner_id", "==", locals.user.uid)
      .count()
      .get();
    
    const studentCount = countSnapshot.data().count;

    // 3. Aplicar gating (Límite: 12 alumnos para plan free)
    if (plan === 'free' && studentCount >= 12) {
      return json({ 
        error: 'Límite alcanzado', 
        message: 'Has alcanzado el límite de 12 alumnos del plan gratuito. ¡Pásate a Premium para gestionar alumnos ilimitados!',
        code: 'LIMIT_REACHED'
      }, { status: 403 });
    }

    const body = await request.json();
    const studentData = {
      ...body,
      owner_id: locals.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await adminDb.collection("students").add(studentData);
    return json({ success: true, student: { id: docRef.id, ...studentData } });
  } catch (error: any) {
    console.error('❌ Error in POST students API:', error.message);
    return json({ error: 'Error al crear el alumno' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    if (!id) return json({ error: 'ID requerido' }, { status: 400 });

    const docRef = adminDb.collection("students").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists || docSnap.data()?.owner_id !== locals.user.uid) {
      return json({ error: 'No autorizado' }, { status: 403 });
    }

    await docRef.delete();
    return json({ success: true });
  } catch (error: any) {
    console.error('❌ Error in DELETE students API:', error.message);
    return json({ error: 'Error al eliminar el alumno' }, { status: 500 });
  }
};
