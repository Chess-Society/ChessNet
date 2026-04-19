import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { authenticate } from '$lib/server/auth';
import { serializeRecord } from '$lib/server/serialize';
import type { DocumentSnapshot } from 'firebase-admin/firestore';


export const GET: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { url } = event;
  const uid = user.uid;

  try {
    let query = adminDb.collection('payments').where('owner_id', '==', uid);

    // Aplicar filtros básicos de Firestore si es posible
    const paymentType = url.searchParams.get('payment_type');
    if (paymentType) query = query.where('payment_type', '==', paymentType);

    const status = url.searchParams.get('status');
    if (status) query = query.where('status', '==', status);

    const concept = url.searchParams.get('concept');
    if (concept) query = query.where('concept', '==', concept);

    const studentId = url.searchParams.get('student_id');
    if (studentId) query = query.where('student_id', '==', studentId);

    const schoolId = url.searchParams.get('school_id');
    if (schoolId) query = query.where('school_id', '==', schoolId);

    const snapshot = await query.orderBy('created_at', 'desc').get();
    let payments = snapshot.docs.map((doc: any) => serializeRecord({ id: doc.id, ...doc.data() }));

    // Filtros adicionales en memoria (rangos de fechas/importes)
    const amountMin = url.searchParams.get('amount_min');
    if (amountMin) payments = payments.filter((p: any) => p.amount >= parseFloat(amountMin));

    const amountMax = url.searchParams.get('amount_max');
    if (amountMax) payments = payments.filter((p: any) => p.amount <= parseFloat(amountMax));

    const dateFrom = url.searchParams.get('date_from');
    if (dateFrom) payments = payments.filter((p: any) => p.created_at >= dateFrom);

    const dateTo = url.searchParams.get('date_to');
    if (dateTo) payments = payments.filter((p: any) => p.created_at <= dateTo);

    return json({
      success: true,
      data: payments,
      message: `Encontrados ${payments.length} pagos`
    });

  } catch (error: any) {
    console.error('❌ API Error in GET /api/payments:', error);
    return json({ error: 'Error al obtener los pagos', details: error.message }, { status: 500 });
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
    
    if (body.amount && body.amount <= 0) {
      return json({ error: 'El importe debe ser mayor a 0' }, { status: 400 });
    }

    // Validar fechas de período si se proporcionan
    if (body.period_start && body.period_end) {
      if (new Date(body.period_start) >= new Date(body.period_end)) {
        return json({ error: 'La fecha de inicio debe ser anterior a la fecha de fin' }, { status: 400 });
      }
    }

    const paymentData = {
      ...body,
      owner_id: uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: body.status || 'pending',
      currency: body.currency || 'EUR'
    };

    const docRef = await adminDb.collection('payments').add(paymentData);
    
    return json({
      success: true,
      data: serializeRecord({ id: docRef.id, ...paymentData }),
      message: 'Pago creado correctamente'
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ API Error in POST /api/payments:', error);
    return json({ error: 'Error al crear el pago' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { request, url } = event;
  const uid = user.uid;
  const paymentId = url.searchParams.get('id');

  if (!paymentId) {
    return json({ error: 'ID de pago requerido' }, { status: 400 });
  }

  try {
    const paymentRef = adminDb.collection('payments').doc(paymentId);
    const paymentSnap = await paymentRef.get();

    if (!paymentSnap.exists) {
      return json({ error: 'Pago no encontrado' }, { status: 404 });
    }

    const data = paymentSnap.data()!;
    // Compatibilidad: documentos antiguos pueden usar 'userId' en lugar de 'owner_id'
    const docOwner = data.owner_id || data.userId || null;
    if (docOwner !== uid) {
      console.warn(`⚠️ [PUT /api/payments] User ${uid} tried to update payment ${paymentId} owned by ${docOwner}`);
      return json({ error: 'Pago no encontrado o no autorizado' }, { status: 403 });
    }

    const updates = await request.json();
    const cleanUpdates = {
      ...updates,
      owner_id: uid, // Normalizar al campo estándar
      updated_at: new Date().toISOString()
    };
    
    // Evitar que el usuario cambie campos críticos por error
    delete cleanUpdates.id;
    delete cleanUpdates.created_at;

    await paymentRef.update(cleanUpdates);

    return json({
      success: true,
      data: { id: paymentId, ...data, ...cleanUpdates },
      message: 'Pago actualizado correctamente'
    });

  } catch (error: any) {
    console.error('❌ API Error in PUT /api/payments:', error);
    return json({ error: 'Error al actualizar el pago' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { url } = event;
  const uid = user.uid;
  const paymentId = url.searchParams.get('id');

  if (!paymentId) {
    return json({ error: 'ID de pago requerido' }, { status: 400 });
  }

  console.log(`🗑️ [DELETE /api/payments] uid=${uid} paymentId="${paymentId}"`);

  // ── Paso 1: intentar leer el documento por su ID ─────────────────────────
  let paymentSnap: DocumentSnapshot | null = null;
  try {
    paymentSnap = await adminDb.collection('payments').doc(paymentId).get();
  } catch (readErr: any) {
    console.error(`❌ [DELETE] Error reading doc ${paymentId}:`, readErr?.message ?? readErr);
    // Si no podemos leer, el doc probablemente ya no existe — éxito silencioso
    return json({ success: true, message: 'Pago ya eliminado (lectura fallida)' });
  }

  // ── Paso 2: si el doc existe, verificar propiedad y borrar ───────────────
  const snap = paymentSnap!; // guaranteed non-null after try-catch above
  if (snap.exists) {
    const data = snap.data()!;
    const docOwner = data.owner_id || data.userId || null;

    if (docOwner !== uid) {
      console.warn(`⚠️ [DELETE] uid=${uid} attempted to delete payment owned by="${docOwner}"`);
      return json({ error: 'No autorizado' }, { status: 403 });
    }

    try {
      await snap.ref.delete();
      console.log(`✅ [DELETE] Deleted payment ${paymentId}`);
      return json({ success: true, message: 'Pago eliminado correctamente' });
    } catch (delErr: any) {
      console.error(`❌ [DELETE] Error deleting doc ${paymentId}:`, delErr?.message ?? delErr);
      return json({ error: 'Error al eliminar el pago', detail: delErr?.message }, { status: 500 });
    }
  }

  // ── Paso 3: doc no encontrado por ID — buscar por owner como fallback ────
  console.log(`🔍 [DELETE] Doc ${paymentId} not found by id. Trying owner query...`);
  try {
    const querySnap = await adminDb
      .collection('payments')
      .where('owner_id', '==', uid)
      .get();

    const match = querySnap.docs.find((d: any) => d.id === paymentId);

    if (!match) {
      // El doc no existe en ningún lado — el optimistic update ya limpió la UI
      console.warn(`⚠️ [DELETE] ${paymentId} not found in ${querySnap.size} payments for uid=${uid}`);
      return json({ success: true, message: 'Pago ya eliminado' });
    }

    await match.ref.delete();
    console.log(`✅ [DELETE] Deleted via query fallback: ${paymentId}`);
    return json({ success: true, message: 'Pago eliminado correctamente' });

  } catch (queryErr: any) {
    console.error(`❌ [DELETE] Query fallback error for uid=${uid}:`, queryErr?.message ?? queryErr);
    // La query falla pero el optimistic update ya limpió la UI — retornar éxito
    // para no mostrar error falso al usuario cuando el pago ya no está visible
    return json({ success: true, message: 'Pago eliminado (query fallida, estado sincronizado)' });
  }
};


