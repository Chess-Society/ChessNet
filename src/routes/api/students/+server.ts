import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { authenticate } from '$lib/server/auth';
import { checkStudentLimit } from '$lib/server/plans';
import { serializeRecord } from '$lib/server/serialize';

export const GET: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const isMock = user.uid === 'chessnet-dev-uid';
    try {
      const snapshot = await adminDb.collection("students")
        .where("owner_id", "==", user.uid)
        .orderBy("createdAt", "desc")
        .get();
        
      const students = snapshot.docs.map((doc: any) => serializeRecord({ id: doc.id, ...doc.data() }));
      return json({ students });
    } catch (dbError) {
      if (isMock) {
        return json({ 
          students: [
            { id: 'mock-s1', name: 'Magnus Carlsen', rating: 2850, owner_id: 'chessnet-dev-uid', createdAt: new Date().toISOString() },
            { id: 'mock-s2', name: 'Hikaru Nakamura', rating: 2800, owner_id: 'chessnet-dev-uid', createdAt: new Date().toISOString() },
            { id: 'mock-s3', name: 'Fabiano Caruana', rating: 2790, owner_id: 'chessnet-dev-uid', createdAt: new Date().toISOString() },
            { id: 'mock-s4', name: 'Alireza Firouzja', rating: 2770, owner_id: 'chessnet-dev-uid', createdAt: new Date().toISOString() },
            { id: 'mock-s5', name: 'Anish Giri', rating: 2760, owner_id: 'chessnet-dev-uid', createdAt: new Date().toISOString() }
          ] 
        });
      }
      throw dbError;
    }
  } catch (error: any) {
    console.error('❌ Error in GET students API:', error.message);
    return json({ error: 'Error al obtener los alumnos' }, { status: 500 });
  }
};

export const POST: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const isMock = user.uid === 'chessnet-dev-uid';
    
    // 1. Verificar plan y límites usando el helper centralizado
    if (!isMock) {
      const canAddStudent = await checkStudentLimit(user.uid);
      if (!canAddStudent) {
        return json({ 
          error: 'Límite alcanzado', 
          message: 'Has alcanzado el límite de 12 alumnos del plan gratuito. ¡Pásate a Premium para gestionar alumnos ilimitados!',
          code: 'LIMIT_REACHED'
        }, { status: 403 });
      }
    }

    const { request } = event;
    const body = await request.json();
    const studentData = {
      ...body,
      owner_id: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const docRef = await adminDb.collection("students").add(studentData);
      return json({ success: true, student: { id: docRef.id, ...studentData } });
    } catch (dbError) {
      if (isMock) {
        return json({ success: true, student: { id: 'mock-student-' + Date.now(), ...studentData } });
      }
      throw dbError;
    }
  } catch (error: any) {
    console.error('❌ Error in POST students API:', error.message);
    return json({ error: 'Error al crear el alumno' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const { request } = event;
    const { id } = await request.json();
    if (!id) return json({ error: 'ID requerido' }, { status: 400 });

    const docRef = adminDb.collection("students").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists || docSnap.data()?.owner_id !== user.uid) {
      return json({ error: 'No autorizado' }, { status: 403 });
    }

    await docRef.delete();
    return json({ success: true });
  } catch (error: any) {
    console.error('❌ Error in DELETE students API:', error.message);
    return json({ error: 'Error al eliminar el alumno' }, { status: 500 });
  }
};
