import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { authenticate } from '$lib/server/auth';
import { serializeRecord } from '$lib/server/serialize';

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
    let payments = snapshot.docs.map(doc => serializeRecord({ id: doc.id, ...doc.data() }));

    // Filtros adicionales en memoria (rangos de fechas/importes)
    const amountMin = url.searchParams.get('amount_min');
    if (amountMin) payments = payments.filter(p => p.amount >= parseFloat(amountMin));

    const amountMax = url.searchParams.get('amount_max');
    if (amountMax) payments = payments.filter(p => p.amount <= parseFloat(amountMax));

    const dateFrom = url.searchParams.get('date_from');
    if (dateFrom) payments = payments.filter(p => p.created_at >= dateFrom);

    const dateTo = url.searchParams.get('date_to');
    if (dateTo) payments = payments.filter(p => p.created_at <= dateTo);

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

    if (!paymentSnap.exists || paymentSnap.data()?.owner_id !== uid) {
      return json({ error: 'Pago no encontrado o no autorizado' }, { status: 403 });
    }

    const updates = await request.json();
    const cleanUpdates = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Evitar que el usuario cambie campos críticos por error
    delete cleanUpdates.id;
    delete cleanUpdates.owner_id;
    delete cleanUpdates.created_at;

    await paymentRef.update(cleanUpdates);

    return json({
      success: true,
      data: { id: paymentId, ...paymentSnap.data(), ...cleanUpdates },
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

  try {
    const paymentRef = adminDb.collection('payments').doc(paymentId);
    const paymentSnap = await paymentRef.get();

    if (!paymentSnap.exists || paymentSnap.data()?.owner_id !== uid) {
      return json({ error: 'Pago no encontrado o no autorizado' }, { status: 403 });
    }

    await paymentRef.delete();

    return json({
      success: true,
      message: 'Pago eliminado correctamente'
    });

  } catch (error: any) {
    console.error('❌ API Error in DELETE /api/payments:', error);
    return json({ error: 'Error al eliminar el pago' }, { status: 500 });
  }
};

