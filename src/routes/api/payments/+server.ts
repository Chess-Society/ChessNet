import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
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
    let query = adminDb.collection('payments').where('ownerId', '==', uid);

    // Aplicar filtros básicos de Firestore si es posible
    const paymentType = url.searchParams.get('paymentType') || url.searchParams.get('paymentType');
    if (paymentType) query = query.where('paymentType', '==', paymentType);

    const status = url.searchParams.get('status');
    if (status) query = query.where('status', '==', status);

    const concept = url.searchParams.get('concept');
    if (concept) query = query.where('concept', '==', concept);

    const studentIdParam = url.searchParams.get('studentId') || url.searchParams.get('studentId');
    if (studentIdParam) query = query.where('studentId', '==', studentIdParam);

    const schoolIdParam = url.searchParams.get('schoolId') || url.searchParams.get('schoolId');
    if (schoolIdParam) query = query.where('schoolId', '==', schoolIdParam);

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    let payments = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return serializeRecord({ 
        id: doc.id, 
        ...data,
        studentId: data.studentId || data.studentId,
        schoolId: data.schoolId || data.schoolId,
        paymentType: data.paymentType || data.paymentType,
        periodStart: data.periodStart || data.periodStart,
        periodEnd: data.periodEnd || data.periodEnd,
        createdAt: data.createdAt || data.createdAt,
        updatedAt: data.updatedAt || data.updatedAt
      });
    });

    // Filtros adicionales en memoria (rangos de fechas/importes)
    const amountMin = url.searchParams.get('amountMin') || url.searchParams.get('amount_min');
    if (amountMin) payments = payments.filter((p: any) => p.amount >= parseFloat(amountMin));

    const amountMax = url.searchParams.get('amountMax') || url.searchParams.get('amount_max');
    if (amountMax) payments = payments.filter((p: any) => p.amount <= parseFloat(amountMax));

    const dateFrom = url.searchParams.get('dateFrom') || url.searchParams.get('date_from');
    if (dateFrom) payments = payments.filter((p: any) => p.createdAt >= dateFrom);

    const dateTo = url.searchParams.get('dateTo') || url.searchParams.get('date_to');
    if (dateTo) payments = payments.filter((p: any) => p.createdAt <= dateTo);

    return json({
      success: true,
      data: payments,
      message: `Encontrados ${payments.length} pagos`
    });

  } catch (error: any) {
    console.error('❌ API Error in GET /api/payments:', error);
    return json({ error: 'Error al obtener los pagos' }, { status: 500 });
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
    const periodStart = body.periodStart || body.periodStart;
    const periodEnd = body.periodEnd || body.periodEnd;
    if (periodStart && periodEnd) {
      if (new Date(periodStart) >= new Date(periodEnd)) {
        return json({ error: 'La fecha de inicio debe ser anterior a la fecha de fin' }, { status: 400 });
      }
    }

    // Standardize to camelCase for the database
    const paymentData = {
      ...body,
      ownerId: uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: body.status || 'pending',
      currency: body.currency || 'EUR'
    };

    // Support field mapping for incoming snake_case
    if (body.studentId && !body.studentId) paymentData.studentId = body.studentId;
    if (body.schoolId && !body.schoolId) paymentData.schoolId = body.schoolId;
    if (body.paymentType && !body.paymentType) paymentData.paymentType = body.paymentType;
    if (body.periodStart && !body.periodStart) paymentData.periodStart = body.periodStart;
    if (body.periodEnd && !body.periodEnd) paymentData.periodEnd = body.periodEnd;
    if (body.paidDate && !body.paidDate) paymentData.paidDate = body.paidDate;
    if (body.dueDate && !body.dueDate) paymentData.dueDate = body.dueDate;

    // Cleanup legacy fields from DB insert
    delete (paymentData as any).studentId;
    delete (paymentData as any).schoolId;
    delete (paymentData as any).paymentType;
    delete (paymentData as any).periodStart;
    delete (paymentData as any).periodEnd;
    delete (paymentData as any).paidDate;
    delete (paymentData as any).dueDate;
    delete (paymentData as any).createdAt;
    delete (paymentData as any).updatedAt;

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
    // Compatibilidad: documentos antiguos pueden usar 'userId' en lugar de 'ownerId'
    const docOwner = data.ownerId || data.userId || null;
    if (docOwner !== uid) {
      console.warn(`⚠️ [PUT /api/payments] User ${uid} tried to update payment ${paymentId} owned by ${docOwner}`);
      return json({ error: 'Pago no encontrado o no autorizado' }, { status: 403 });
    }

    const updates = await request.json();
    const cleanUpdates = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // Support field mapping for incoming snake_case
    if (updates.studentId && !updates.studentId) cleanUpdates.studentId = updates.studentId;
    if (updates.schoolId && !updates.schoolId) cleanUpdates.schoolId = updates.schoolId;
    if (updates.paymentType && !updates.paymentType) cleanUpdates.paymentType = updates.paymentType;
    if (updates.periodStart && !updates.periodStart) cleanUpdates.periodStart = updates.periodStart;
    if (updates.periodEnd && !updates.periodEnd) cleanUpdates.periodEnd = updates.periodEnd;
    if (updates.paidDate && !updates.paidDate) cleanUpdates.paidDate = updates.paidDate;
    if (updates.dueDate && !updates.dueDate) cleanUpdates.dueDate = updates.dueDate;

    // Evitar que el usuario cambie campos críticos por error
    delete cleanUpdates.id;
    delete cleanUpdates.ownerId;
    delete cleanUpdates.userId;
    delete cleanUpdates.createdAt;
    delete cleanUpdates.createdAt;
    delete cleanUpdates.updatedAt;
    
    // Cleanup legacy fields from update
    delete (cleanUpdates as any).studentId;
    delete (cleanUpdates as any).schoolId;
    delete (cleanUpdates as any).paymentType;
    delete (cleanUpdates as any).periodStart;
    delete (cleanUpdates as any).periodEnd;
    delete (cleanUpdates as any).paidDate;
    delete (cleanUpdates as any).dueDate;

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
    const docOwner = data.ownerId || data.userId || null;

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
      .where('ownerId', '==', uid)
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


