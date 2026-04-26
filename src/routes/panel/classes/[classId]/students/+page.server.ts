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
      adminDb.collection('students').get(), // Fetching all for filtering later (could be optimized)
      adminDb.collection('class_students')
        .where('classId', '==', classId)
        .get()
    ]);

    if (!classSnap.exists) {
      throw error(404, 'Class not found');
    }

    const classData = { id: classSnap.id, ...classSnap.data() };
    const schoolId = (classData as any).schoolId || (classData as any).school_id;
    
    // Filter students by owner OR school
    const filteredStudents = allStudentsSnap.docs
      .map((d: any) => ({ id: d.id, ...d.data() }))
      .filter((s: any) => {
        const isOwner = s.owner_id === uid || s.ownerId === uid;
        const inSchool = schoolId && (s.school_id === schoolId || s.schoolId === schoolId);
        return isOwner || inSchool;
      });

    const enrolledDocs = enrolledSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    const enrolledStudentIds = new Set(enrolledDocs.map((ed: any) => ed.studentId || ed.student_id));
    
    // Students already in this class
    const enrolledStudents = enrolledDocs.map((ed: any) => {
      const sId = ed.studentId || ed.student_id;
      const studentDetail = filteredStudents.find((s: any) => s.id === sId);
      return {
        ...studentDetail,
        ...ed,
        enrolledAt: ed.enrolledAt || ed.enrolled_at
      };
    }).filter((s: any) => s.id);

    // Available students
    const availableStudents = filteredStudents.filter((s: any) => {
      const isEnrolled = enrolledStudentIds.has(s.id);
      return !isEnrolled;
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
      // Check if already enrolled in this class (regardless of owner_id to avoid duplicates)
      const existingSnap = await adminDb.collection("class_students")
        .where("classId", "==", classId)
        .where("studentId", "==", studentId)
        .get();
        
      if (!existingSnap.empty) return fail(409, { message: 'Already enrolled' });

      // Check snake_case version just in case
      const existingSnapSnake = await adminDb.collection("class_students")
        .where("class_id", "==", classId)
        .where("student_id", "==", studentId)
        .get();

      if (!existingSnapSnake.empty) return fail(409, { message: 'Already enrolled' });

      const batch = adminDb.batch();
      
      const enrollmentData = {
        classId,
        studentId,
        owner_id: uid,
        enrolledAt: new Date().toISOString()
      };

      const enrollmentRef = adminDb.collection("class_students").doc();
      batch.set(enrollmentRef, enrollmentData);
      
      // Sync to student record (Handle both studentId and student_id)
      const studentRef = adminDb.collection("students").doc(studentId);
      const studentSnap = await studentRef.get();
      
      if (!studentSnap.exists) {
        throw new Error(`Student ${studentId} not found`);
      }

      batch.update(studentRef, {
        classId: classId,
        class_id: classId, // Update both for compatibility
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
