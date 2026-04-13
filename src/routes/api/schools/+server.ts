import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

import { authenticate } from '$lib/server/auth';

export const GET: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const uid = user.uid;

  try {
    const snapshot = await adminDb.collection("schools")
      .where("owner_id", "==", uid)
      .orderBy("created_at", "desc")
      .get();
    
    const schools = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return json({ schools });

  } catch (error: any) {
    console.error('❌ Error in GET schools API:', error.message);
    return json({ error: 'Error al obtener los centros' }, { status: 500 });
  }
};

export const POST: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { request } = event;
  const uid = user.uid;

  try {
    const body = await request.json();
    const { name, city } = body;

    if (!name || !name.trim()) {
      return json({ error: 'El nombre del centro es obligatorio' }, { status: 400 });
    }

    const schoolData = {
      name: name.trim(),
      city: city?.trim() || null,
      owner_id: uid,
      created_by: uid,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    };

    const docRef = await adminDb.collection("schools").add(schoolData);
    
    return json({ 
      success: true,
      school: { id: docRef.id, ...schoolData },
      message: 'Centro creado correctamente'
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error in POST schools API:', error.message);
    return json({ error: 'Error al crear el centro' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { request } = event;
  const uid = user.uid;

  try {
    const body = await request.json();
    const schoolId = body.id;

    if (!schoolId) {
      return json({ error: 'ID del centro requerido' }, { status: 400 });
    }

    const schoolRef = adminDb.collection("schools").doc(schoolId).get();
    const schoolSnap = await schoolRef;

    if (!schoolSnap.exists || schoolSnap.data()?.owner_id !== uid) {
      return json({ error: 'Centro no encontrado o acceso denegado' }, { status: 404 });
    }

    const updateData = {
      ...body,
      updated_at: FieldValue.serverTimestamp()
    };
    delete updateData.id;
    delete updateData.owner_id;
    delete updateData.created_at;

    await adminDb.collection("schools").doc(schoolId).update(updateData);

    return json({ 
      success: true,
      school: { id: schoolId, ...schoolSnap.data(), ...updateData }
    });

  } catch (error: any) {
    console.error('❌ Error in PUT schools API:', error.message);
    return json({ error: 'Error al actualizar el centro' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { request } = event;
  const uid = user.uid;

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return json({ error: 'ID del centro requerido' }, { status: 400 });
    }

    const schoolRef = adminDb.collection("schools").doc(id);
    const schoolSnap = await schoolRef.get();

    if (!schoolSnap.exists || schoolSnap.data()?.owner_id !== uid) {
      return json({ error: 'Centro no encontrado o acceso denegado' }, { status: 404 });
    }

    await schoolRef.delete();

    return json({ success: true, message: 'Centro eliminado correctamente' });

  } catch (error: any) {
    console.error('❌ Error in DELETE schools API:', error.message);
    return json({ error: 'Error al eliminar el centro' }, { status: 500 });
  }
};

