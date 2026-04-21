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
  const classId = url.searchParams.get('classId') || url.searchParams.get('class_id');
  const studentId = url.searchParams.get('studentId') || url.searchParams.get('student_id');
  const date = url.searchParams.get('date');
  const dateFrom = url.searchParams.get('dateFrom') || url.searchParams.get('date_from');
  const dateTo = url.searchParams.get('dateTo') || url.searchParams.get('date_to');

  try {
    let query = adminDb.collection("attendance").where("owner_id", "==", uid);

    if (classId) {
      query = query.where("classId", "==", classId);
    }

    if (studentId) {
      query = query.where("studentId", "==", studentId);
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
    const attendance = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return serializeRecord({ 
          id: doc.id, 
          ...data 
      });
    });

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
    const studentId = body.studentId || body.student_id;
    const classId = body.classId || body.class_id;
    const { date, status, notes } = body;

    if (!studentId || !classId || !date || !status) {
      return json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Verificar si ya existe un registro para este alumno, clase y fecha
    const existingSnapshot = await adminDb.collection("attendance")
      .where("owner_id", "==", uid)
      .where("studentId", "==", studentId)
      .where("classId", "==", classId)
      .where("date", "==", date)
      .limit(1)
      .get();

    // Standardize to camelCase for the database
    const attendanceData = {
      studentId: studentId,
      classId: classId,
      date,
      status,
      notes: notes || null,
      owner_id: uid,
      updatedAt: new Date().toISOString()
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
        createdAt: new Date().toISOString()
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
    const classId = body.classId || body.class_id;
    const { date, records } = body;

    if (!classId || !date || !Array.isArray(records)) {
      return json({ error: 'Formato de datos inválido' }, { status: 400 });
    }

    // 1. Obtener todos los registros existentes para esta clase y fecha en una sola consulta
    const existingSnapshot = await adminDb.collection("attendance")
      .where("owner_id", "==", uid)
      .where("classId", "==", classId)
      .where("date", "==", date)
      .get();
    
    // 2. Crear un mapa de studentId -> docId para búsqueda rápida
    const existingMap = new Map();
    existingSnapshot.docs.forEach((doc: any) => {
      existingMap.set(doc.data().studentId, doc.id);
    });

    const batch = adminDb.batch();
    const results = [];

    // 3. Procesar récords usando el mapa en memoria
    for (const record of records) {
      const studentId = record.studentId || record.student_id;
      const { status, notes } = record;
      
      const data = {
        studentId,
        classId,
        date,
        status,
        notes: notes || null,
        owner_id: uid,
        updatedAt: new Date().toISOString()
      };

      const existingId = existingMap.get(studentId);

      if (existingId) {
        batch.update(adminDb.collection("attendance").doc(existingId), data);
      } else {
        const newDocRef = adminDb.collection("attendance").doc();
        batch.set(newDocRef, {
          ...data,
          createdAt: new Date().toISOString()
        });
      }
      results.push({ id: existingId || 'new', ...data });
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

