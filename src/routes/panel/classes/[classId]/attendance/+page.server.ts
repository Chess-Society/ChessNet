import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { error } from '@sveltejs/kit';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals, params }) => {
  const classId = params.classId;

  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const classSnap = await adminDb.collection("classes").doc(classId).get();

    const data = classSnap.data();
    const ownerId = data?.ownerId || data?.ownerId;
    if (!classSnap.exists || ownerId !== locals.user.uid) {
      throw error(404, 'Class not found');
    }

    const classData = { id: classSnap.id, ...classSnap.data() };

    // Fetch all enrollments for this class
    let enrollmentsSnap = await adminDb.collection("class_students")
      .where("classId", "==", classId)
      .get();
    
    if (enrollmentsSnap.empty) {
      enrollmentsSnap = await adminDb.collection("class_students")
        .where("classId", "==", classId)
        .get();
    }
    
    const enrolledIds = enrollmentsSnap.docs.map((doc: any) => doc.data().studentId || doc.data().studentId);
    
    // Fetch enrolled students details
    let students: any[] = [];
    if (enrolledIds.length > 0) {
      const studentsSnap = await adminDb.collection("students")
        .where("__name__", "in", enrolledIds)
        .get();
      students = studentsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    }

    // Fetch recent attendance for this class
    const attendanceSnap = await adminDb.collection("attendance")
      .where("classId", "==", classId) // Use snake_case as primary
      .where("ownerId", "==", locals.user.uid)
      .orderBy("date", "desc")
      .limit(30)
      .get();
    
    // Fallback if none found with snake_case (for legacy data)
    let rawAttendance = attendanceSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    if (rawAttendance.length === 0) {
      const legacySnap = await adminDb.collection("attendance")
        .where("classId", "==", classId)
        .where("ownerId", "==", locals.user.uid)
        .orderBy("date", "desc")
        .limit(30)
        .get();
      rawAttendance = legacySnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    }
    
    // Group by date for history view
    const historyMap = new Map();
    rawAttendance.forEach((rec: any) => {
      if (!historyMap.has(rec.date)) {
        historyMap.set(rec.date, { date: rec.date, records: [] });
      }
      historyMap.get(rec.date).records.push(rec);
    });
    
    const recentAttendance = Array.from(historyMap.values());

    // Calculate stats per student
    const statsMap = new Map();
    students.forEach(s => {
      statsMap.set(s.id, {
        studentId: s.id,
        studentName: s.name,
        presentCount: 0,
        lateCount: 0,
        absentCount: 0,
        totalCount: 0
      });
    });

    rawAttendance.forEach((rec: any) => {
      const sStats = statsMap.get(rec.studentId);
      if (sStats) {
        sStats.totalCount++;
        if (rec.status === 'P') sStats.presentCount++;
        else if (rec.status === 'T') sStats.lateCount++;
        else if (rec.status === 'A') sStats.absentCount++;
      }
    });

    const attendanceStats = Array.from(statsMap.values()).map((s: any) => ({
      ...s,
      attendanceRate: s.totalCount > 0 ? Math.round(((s.presentCount + s.lateCount) / s.totalCount) * 100) : 100,
      punctualityRate: (s.presentCount + s.lateCount) > 0 ? Math.round((s.presentCount / (s.presentCount + s.lateCount)) * 100) : 100
    }));
    
    return serializeRecord({
      user: locals.user,
      class: classData,
      students,
      recentAttendance,
      attendanceStats
    });

  } catch (err: any) {
    console.error('❌ Error in class attendance page load:', err);
    throw error(500, 'Internal Server Error');
  }
};

export const actions: Actions = {
  save: async ({ request, locals, params }) => {
    if (!locals.user) return fail(401);
    const classId = params.classId as string;
    const data = await request.formData();
    const date = data.get('date') as string;
    const records = JSON.parse(data.get('records') as string);

    if (!classId || !date || !Array.isArray(records)) {
      return fail(400);
    }

    try {
      const uid = locals.user.uid;
      
      // Get existing records for this date/class to update them
      let existingSnapshot = await adminDb.collection("attendance")
        .where("ownerId", "==", uid)
        .where("classId", "==", classId)
        .where("date", "==", date)
        .get();
        
      if (existingSnapshot.empty) {
        existingSnapshot = await adminDb.collection("attendance")
          .where("ownerId", "==", uid)
          .where("classId", "==", classId)
          .where("date", "==", date)
          .get();
      }
      
      const existingMap = new Map();
      existingSnapshot.docs.forEach((doc: any) => existingMap.set(doc.data().studentId, doc.id));

      const batch = adminDb.batch();

      for (const record of records) {
        const studentId = record.studentId;
        const attendanceData = {
          studentId,
          classId,
          date,
          status: record.status,
          notes: record.notes || null,
          ownerId: uid,
          updatedAt: new Date().toISOString()
        };

        const existingId = existingMap.get(studentId);
        if (existingId) {
          batch.update(adminDb.collection("attendance").doc(existingId), attendanceData);
        } else {
          const newRef = adminDb.collection("attendance").doc();
          batch.set(newRef, {
            ...attendanceData,
            createdAt: new Date().toISOString()
          });
        }
      }

      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Error saving attendance:', err);
      return fail(500);
    }
  }
};
