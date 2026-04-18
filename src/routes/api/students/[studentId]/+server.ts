import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const studentId = params.studentId;
    if (!studentId) {
      return json({ error: 'ID del estudiante requerido' }, { status: 400 });
    }

    const body = await request.json();
    const studentRef = adminDb.collection("students").doc(studentId);
    const studentSnap = await studentRef.get();

    if (!studentSnap.exists || studentSnap.data()?.owner_id !== locals.user.uid) {
      return json({ error: 'Estudiante no encontrado o acceso denegado' }, { status: 404 });
    }

    const updateData = {
      ...body,
      updated_at: new Date().toISOString()
    };
    
    // Cleanup body fields to avoid overwriting sensitive data
    delete (updateData as any).id;
    delete (updateData as any).owner_id;
    delete (updateData as any).created_at;

    await studentRef.update(updateData);

    return json({ 
      success: true, 
      student: { id: studentId, ...studentSnap.data(), ...updateData }, 
      message: 'Estudiante actualizado correctamente' 
    });

  } catch (error: any) {
    console.error('❌ Error in PUT student API:', error.message);
    return json({ error: 'Error interno del servidor: ' + error.message }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  try {
    const studentId = params.studentId;
    if (!studentId) {
      return json({ error: 'ID del estudiante requerido' }, { status: 400 });
    }

    const studentRef = adminDb.collection("students").doc(studentId);
    const studentSnap = await studentRef.get();

    if (!studentSnap.exists || studentSnap.data()?.owner_id !== locals.user.uid) {
      return json({ error: 'Estudiante no encontrado o acceso denegado' }, { status: 404 });
    }

    await studentRef.delete();

    return json({ success: true, message: 'Estudiante eliminado correctamente' });

  } catch (error: any) {
    console.error('❌ Error in DELETE student API:', error.message);
    return json({ error: 'Error interno del servidor: ' + error.message }, { status: 500 });
  }
};
