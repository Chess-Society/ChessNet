import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { authenticate } from '$lib/server/auth';
import { serializeRecord } from '$lib/server/serialize';

// GET — Listar logros del usuario autenticado
export const GET: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) return json({ error: 'No autorizado' }, { status: 401 });

  try {
    const snapshot = await adminDb
      .collection('achievements')
      .where('owner_id', '==', user.uid)
      .orderBy('unlockedAt', 'desc')
      .get();

    const achievements = snapshot.docs.map(doc =>
      serializeRecord({ id: doc.id, ...doc.data() })
    );

    return json({ success: true, achievements });
  } catch (error: any) {
    console.error('❌ [API /achievements GET]', error);
    return json({ error: 'Error al obtener logros' }, { status: 500 });
  }
};

// POST — Desbloquear un logro para el usuario autenticado
// Usa adminDb para bypassear las Firestore rules (solo admin puede escribir en /achievements)
export const POST: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) return json({ error: 'No autorizado' }, { status: 401 });

  // Bloquear modo dev-uid en producción
  if (user.uid === 'chessnet-dev-uid' && process.env.NODE_ENV !== 'development') {
    return json({ error: 'No permitido' }, { status: 403 });
  }

  try {
    const body = await event.request.json();
    const { achievementId } = body;

    if (!achievementId || typeof achievementId !== 'string') {
      return json({ error: 'achievementId requerido' }, { status: 400 });
    }

    // Verificar si ya existe para evitar duplicados
    const existing = await adminDb
      .collection('achievements')
      .where('owner_id', '==', user.uid)
      .where('id', '==', achievementId)
      .limit(1)
      .get();

    if (!existing.empty) {
      return json({ success: true, alreadyUnlocked: true });
    }

    // Escribir con adminDb (bypassa las rules de Firestore)
    const docRef = await adminDb.collection('achievements').add({
      id: achievementId,
      owner_id: user.uid,
      unlockedAt: new Date().toISOString(),
      notified: false
    });

    return json({ success: true, id: docRef.id }, { status: 201 });
  } catch (error: any) {
    console.error('❌ [API /achievements POST]', error);
    return json({ error: 'Error al desbloquear logro' }, { status: 500 });
  }
};

// PATCH — Marcar un logro como notificado
export const PATCH: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) return json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await event.request.json();
    const { achievementId } = body;

    if (!achievementId || typeof achievementId !== 'string') {
      return json({ error: 'achievementId requerido' }, { status: 400 });
    }

    const snapshot = await adminDb
      .collection('achievements')
      .where('owner_id', '==', user.uid)
      .where('id', '==', achievementId)
      .where('notified', '==', false)
      .get();

    if (snapshot.empty) {
      return json({ success: true, message: 'Nada que actualizar' });
    }

    const batch = adminDb.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { notified: true });
    });
    await batch.commit();

    return json({ success: true });
  } catch (error: any) {
    console.error('❌ [API /achievements PATCH]', error);
    return json({ error: 'Error al marcar logro como notificado' }, { status: 500 });
  }
};
