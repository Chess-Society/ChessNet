import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { studentId } = params;

  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  const uid = locals.user.uid;

  try {
    // 1. Fetch Student
    const studentSnap = await adminDb.collection("students").doc(studentId).get();
    if (!studentSnap.exists || studentSnap.data()?.ownerId !== uid) {
      throw error(404, 'Student not found');
    }
    const student = { id: studentSnap.id, ...studentSnap.data() };

    // 2. Fetch School
    let school = { id: 'independent', name: 'Independent', city: '' };
    if (student.schoolId) {
      const schoolSnap = await adminDb.collection("schools").doc(student.schoolId).get();
      if (schoolSnap.exists) {
        school = { id: schoolSnap.id, ...schoolSnap.data() };
      }
    }

    // 3. Fetch Classes (via class_students)
    const enrollmentsSnap = await adminDb.collection("class_students")
      .where("ownerId", "==", uid)
      .where("studentId", "==", studentId)
      .get();
    
    const classIds = enrollmentsSnap.docs.map((doc: any) => doc.data().classId);
    let classes: any[] = [];
    if (classIds.length > 0) {
      for (let i = 0; i < classIds.length; i += 30) {
        const chunk = classIds.slice(i, i + 30);
        const classesSnap = await adminDb.collection("classes")
          .where("__name__", "in", chunk)
          .get();
        classes = [...classes, ...classesSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))];
      }
    }

    // 4. Fetch Attendance
    const attendanceSnap = await adminDb.collection("attendance")
      .where("ownerId", "==", uid)
      .where("studentId", "==", studentId)
      .orderBy("date", "desc")
      .get();
    
    const attendanceRecords = attendanceSnap.docs.map((doc: any) => doc.data());
    const totalSessions = attendanceRecords.length;
    const attended = attendanceRecords.filter((r: any) => 
      ['present', 'late', 'P', 'T'].includes(r.status)
    ).length;
    const late = attendanceRecords.filter((r: any) => 
      ['late', 'T'].includes(r.status)
    ).length;
    const absent = attendanceRecords.filter((r: any) => 
      ['absent', 'A'].includes(r.status)
    ).length;

    // 5. Fetch Payments
    const paymentsSnap = await adminDb.collection("payments")
      .where("ownerId", "==", uid)
      .where("studentId", "==", studentId)
      .orderBy("date", "desc")
      .get();
    
    const payments = paymentsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    // 6. Metrics Calculation
    const attendanceRate = totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 0;
    const punctualityRate = attended > 0 ? Math.round(((attended - late) / attended) * 100) : 0;
    
    const paidPayments = payments.filter((p: any) => p.status === 'paid').length;
    const paymentCompliance = payments.length > 0 ? Math.round((paidPayments / payments.length) * 100) : 0;

    const report = {
      student,
      school,
      classes,
      progress_summary: {
        enrollment_date: student.createdAt ? student.createdAt.split('T')[0] : 'N/A',
        days_enrolled: student.createdAt ? Math.floor((Date.now() - new Date(student.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0,
        total_sessions: totalSessions,
        attended_sessions: attended,
        late_sessions: late,
        absent_sessions: absent,
        attendance_rate: attendanceRate,
        punctuality_rate: punctualityRate,
        skills_mastered: 0, // Placeholder as mastery is not yet in DB
        skills_in_progress: 0,
        total_skills_assigned: 0,
        skill_completion_rate: 0,
        total_payments: payments.length,
        paid_payments: paidPayments,
        pending_payments: payments.filter((p: any) => p.status === 'pending').length,
        overdue_payments: payments.filter((p: any) => p.status === 'overdue').length,
        payment_compliance: paymentCompliance,
        tournaments_participated: 0,
        tournament_wins: 0,
        current_rating: 1200,
        last_activity_date: attendanceRecords[0]?.date || student.updatedAt || student.createdAt
      },
      attendance_history: attendanceRecords.slice(0, 10), // Last 10
      skills_progress: [],
      payment_history: payments.slice(0, 10),
      tournament_history: [],
      rating_history: [],
      activity_timeline: attendanceRecords.slice(0, 5).map((r: any) => ({
        date: r.date,
        type: 'attendance',
        title: `Clase: ${r.status}`,
        description: r.notes || 'Registro de asistencia',
        status: r.status === 'present' ? 'success' : r.status === 'late' ? 'warning' : 'error'
      }))
    };

    return {
      user: locals.user,
      studentId,
      report: JSON.parse(JSON.stringify(report)) // Simple serialization
    };

  } catch (err: any) {
    console.error('❌ Error generating report:', err);
    throw error(500, 'Error generating student report');
  }
};

