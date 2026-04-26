import type { PageServerLoad, Actions } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import { fail, error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const uid = locals.user.uid;
  const classId = params.classId;

  try {
    const [classSnap, allStudentsSnap, enrolledSnap] = await Promise.all([
      adminDb.collection('classes').doc(classId).get(),
      adminDb.collection('students').where('owner_id', '==', uid).get(),
      adminDb.collection('class_students')
        .where('owner_id', '==', uid)
        .where('classId', '==', classId)
        .get()
    ]);

    if (!classSnap.exists) {
      throw error(404, 'Class not found');
    }

    const classData = { id: classSnap.id, ...classSnap.data() };
    const allStudents = allStudentsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    const enrolledDocs = enrolledSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    const enrolledStudentIds = new Set(enrolledDocs.map((ed: any) => ed.studentId || ed.student_id));
    
    // Students already in this class
    const enrolledStudents = enrolledDocs.map((ed: any) => {
      const sId = ed.studentId || ed.student_id;
      const studentDetail = allStudents.find((s: any) => s.id === sId);
      return {
        ...studentDetail,
        ...ed,
        enrolledAt: ed.enrolledAt || ed.enrolled_at
      };
    }).filter((s: any) => s.id); // Ensure we found the student detail

    // Available students in the same school (or just all owner's students if no schoolId)
    const schoolId = (classData as any).schoolId || (classData as any).school_id;
    const availableStudents = allStudents.filter((s: any) => {
      const isEnrolled = enrolledStudentIds.has(s.id);
      const sameSchool = schoolId ? ((s as any).schoolId || (s as any).school_id) === schoolId : true;
      return !isEnrolled && sameSchool;
    });

    const capacity = (classData as any).capacity || (classData as any).max_students || 20;
    const enrolledCount = enrolledStudents.length;

    const stats = {
      enrolled: enrolledCount,
      available: capacity - enrolledCount,
      capacity: capacity,
      occupancyRate: Math.round((enrolledCount / capacity) * 100)
    };

    return {
      user: locals.user,
      class: serializeRecord(classData),
      enrolledStudents: serializeRecord(enrolledStudents),
      availableStudents: serializeRecord(availableStudents),
      stats: serializeRecord(stats)
    };

  } catch (err: any) {
    if (err.status) throw err;
    console.error('❌ Error in class students page load:', err);
    throw error(500, 'Internal Server Error');
  }
};

export const actions: Actions = {
  enroll: async ({ request, locals, params }) => {
    if (!locals.user) return fail(401);
    const uid = locals.user.uid;
    const classId = params.classId;
    const formData = await request.formData();
    const studentId = formData.get('studentId') as string;

    if (!studentId) return fail(400);

    try {
      const existingSnap = await adminDb.collection("class_students")
        .where("classId", "==", classId)
        .where("studentId", "==", studentId)
        .where("owner_id", "==", uid)
        .get();
        
      if (!existingSnap.empty) return fail(409, { message: 'Already enrolled' });

      const batch = adminDb.batch();
      
      const enrollmentData = {
        classId,
        studentId,
        owner_id: uid,
        enrolledAt: new Date().toISOString()
      };

      const enrollmentRef = adminDb.collection("class_students").doc();
      batch.set(enrollmentRef, enrollmentData);
      
      // Sync to student record
      batch.update(adminDb.collection("students").doc(studentId), {
        classId: classId,
        updatedAt: new Date().toISOString()
      });

      await batch.commit();
      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500);
    }
  },

  unenroll: async ({ request, locals, params }) => {
    if (!locals.user) return fail(401);
    const uid = locals.user.uid;
    const classId = params.classId;
    const formData = await request.formData();
    const studentId = formData.get('studentId') as string;

    if (!studentId) return fail(400);

    try {
      const snapshot = await adminDb.collection("class_students")
        .where("classId", "==", classId)
        .where("studentId", "==", studentId)
        .where("owner_id", "==", uid)
        .get();
        
      if (snapshot.empty) return fail(404);

      const batch = adminDb.batch();
      snapshot.docs.forEach((doc: any) => batch.delete(doc.ref));
      
      // Update student record
      const studentRef = adminDb.collection("students").doc(studentId);
      const studentSnap = await studentRef.get();
      const studentData = studentSnap.data();
      
      if (studentSnap.exists && (studentData?.classId === classId)) {
        batch.update(studentRef, { 
          classId: null,
          updatedAt: new Date().toISOString()
        });
      }

      await batch.commit();
      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500);
    }
  }
};
