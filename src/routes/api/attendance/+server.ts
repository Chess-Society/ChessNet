import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { authenticate } from '$lib/server/auth';
import { serializeRecord } from '$lib/server/serialize';

export const GET: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) {
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const { url } = event;
  const uid = user.uid;
  const classId = url.searchParams.get('class_id');
  const studentId = url.searchParams.get('student_id');
  const date = url.searchParams.get('date');
  const dateFrom = url.searchParams.get('date_from');
  const dateTo = url.searchParams.get('date_to');

  try {
    let query = adminDb.collection("attendance").where("owner_id", "==", uid);

    if (classId) {
      query = query.where("class_id", "==", classId);
    }

    if (studentId) {
      query = query.where("student_id", "==", studentId);
    }

    if (date) {
      query = query.where("date", "==", date);
    }

    if (dateFrom) {
      query = query.where("date", ">=", dateFrom);
    }

    if (dateTo) {
      query = query.where("date", "<=", dateTo);
    }

    const snapshot = await query.orderBy("date", "desc").get();
    const attendance = snapshot.docs.map((doc: any) => serializeRecord({ id: doc.id, ...doc.data() }));

    return json({ 
      success: true, 
      data: attendance 
    });

  } catch (error: any) {
    console.error('❌ Error in GET attendance API:', error.message);
    return json({ error: 'Error al obtener la asistencia' }, { status: 500 });
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
    const { student_id, class_id, date, status, notes } = body;

    if (!student_id || !class_id || !date || !status) {
      return json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Verificar si ya existe un registro para este alumno, clase y fecha
    const existingSnapshot = await adminDb.collection("attendance")
      .where("owner_id", "==", uid)
      .where("student_id", "==", student_id)
      .where("class_id", "==", class_id)
      .where("date", "==", date)
      .limit(1)
      .get();

    const attendanceData = {
      student_id,
      class_id,
      date,
      status,
      notes: notes || null,
      owner_id: uid,
      updated_at: new Date().toISOString()
    };

    if (!existingSnapshot.empty) {
      // Actualizar existente
      const docId = existingSnapshot.docs[0].id;
      await adminDb.collection("attendance").doc(docId).update(attendanceData);
      return json({ 
        success: true, 
        message: 'Asistencia actualizada correctamente',
        data: { id: docId, ...attendanceData }
      });
    } else {
      // Crear nuevo
      const dataWithCreated = {
        ...attendanceData,
        created_at: new Date().toISOString()
      };
      const docRef = await adminDb.collection("attendance").add(dataWithCreated);
      return json({ 
        success: true, 
        message: 'Asistencia registrada correctamente',
        data: { id: docRef.id, ...dataWithCreated }
      }, { status: 201 });
    }

  } catch (error: any) {
    console.error('❌ Error in POST attendance API:', error.message);
    return json({ error: 'Error al registrar la asistencia' }, { status: 500 });
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
    const { class_id, date, records } = body;

    if (!class_id || !date || !Array.isArray(records)) {
      return json({ error: 'Formato de datos inválido' }, { status: 400 });
    }

    const batch = adminDb.batch();
    const results = [];

    for (const record of records) {
      const { student_id, status, notes } = record;
      
      const attendanceRef = adminDb.collection("attendance")
        .where("owner_id", "==", uid)
        .where("student_id", "==", student_id)
        .where("class_id", "==", class_id)
        .where("date", "==", date)
        .limit(1);
      
      const existingSnap = await attendanceRef.get();
      
      const data = {
        student_id,
        class_id,
        date,
        status,
        notes: notes || null,
        owner_id: uid,
        updated_at: new Date().toISOString()
      };

      if (!existingSnap.empty) {
        batch.update(adminDb.collection("attendance").doc(existingSnap.docs[0].id), data);
      } else {
        const newDocRef = adminDb.collection("attendance").doc();
        batch.set(newDocRef, {
          ...data,
          created_at: new Date().toISOString()
        });
      }
      results.push(data);
    }

    await batch.commit();

    return json({ 
      success: true, 
      message: `Procesados ${records.length} registros de asistencia`,
      data: results
    });

  } catch (error: any) {
    console.error('❌ Error in bulk PUT attendance API:', error.message);
    return json({ error: 'Error al procesar la asistencia en lote' }, { status: 500 });
  }
};

