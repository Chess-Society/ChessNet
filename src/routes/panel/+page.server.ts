import type { PageServerLoad } from './$types';
import { authenticate } from '$lib/server/auth';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async (event) => {
  const { user } = await authenticate(event);
  
  if (!user) {
    return { user: null };
  }

  const uid = user.uid;

  const isMock = uid === 'chessnet-dev-uid';
  
  if (isMock) {
    return serializeRecord({
      user,
      dashboardStats: {
        totalCenters: 1,
        totalStudents: 2,
        totalClasses: 1,
        activeStudents: 2,
        monthlyRevenue: 0,
        upcomingSessions: 1
      },
      centersWithStats: [{
        id: 'mock-school-1',
        name: 'Mock Academy',
        city: 'Localhost',
        totalClasses: 1,
        totalStudents: 2,
        occupancyRate: 50,
        attendanceRate: 90,
        monthlyRevenue: 0,
        lastActivity: new Date().toISOString()
      }],
      featuredClasses: [],
      recentActivity: [],
      upcomingSessionsToday: []
    });
  }

  try {
    const [schoolsSnap, studentsSnap, classesSnap, paymentsSnap, attendanceSnap] = await Promise.all([
      adminDb.collection("schools").where("owner_id", "==", uid).get(),
      adminDb.collection("students").where("owner_id", "==", uid).get(),
      adminDb.collection("classes").where("owner_id", "==", uid).get(),
      adminDb.collection("payments").where("owner_id", "==", uid).orderBy("paid_date", "desc").limit(100).get(),
      adminDb.collection("attendance").where("owner_id", "==", uid).orderBy("date", "desc").limit(100).get()
    ]);


    const schools = schoolsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    const students = studentsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    const classes = classesSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    const payments = paymentsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    const attendance = attendanceSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyPayments = payments.filter((p: any) => {
      const d = new Date(p.paid_date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const monthlyRevenue = monthlyPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);


    const dashboardStats = {
      totalCenters: schools.length,
      totalStudents: students.length,
      totalClasses: classes.length,
      activeStudents: students.filter((s: any) => s.active !== false).length,
      monthlyRevenue,
      upcomingSessions: classes.filter((c: any) => c.active !== false).length 
    };


    const centersWithStats = schools.map((school: any) => {
      const schoolClasses = classes.filter((c: any) => c.school_id === school.id);
      const schoolStudents = students.filter((s: any) => s.school_id === school.id);

      const schoolAttendance = attendance.filter((a: any) => {
        const classObj = classes.find((c: any) => c.id === a.class_id);
        return classObj && classObj.school_id === school.id;
      });

      const presentCount = schoolAttendance.filter((a: any) => a.status === 'P').length;
      const totalAttendanceCount = schoolAttendance.length;

      return {
        id: school.id,
        name: school.name,
        city: school.city || 'Sin ciudad',
        totalClasses: schoolClasses.length,
        totalStudents: schoolStudents.length,
        occupancyRate: schoolClasses.length > 0 ? Math.round((schoolStudents.length / (schoolClasses.length * 15)) * 100) : 0,
        attendanceRate: totalAttendanceCount > 0 ? Math.round((presentCount / totalAttendanceCount) * 100) : 0,
        monthlyRevenue: monthlyPayments
          .filter((p: any) => {
             const student = students.find((s: any) => s.id === p.student_id);
             return student && student.school_id === school.id;
          })
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
        lastActivity: school.updated_at || school.created_at
      };
    });


    return serializeRecord({
      user,
      dashboardStats,
      centersWithStats,
      featuredClasses: classes.slice(0, 3),
      recentActivity: [],
      upcomingSessionsToday: classes.slice(0, 4)
    });

  } catch (err: any) {
    console.error('❌ Error in dashboard load:', err);
    return {
      user,
      dashboardStats: {
        totalCenters: 0,
        totalStudents: 0,
        totalClasses: 0,
        activeStudents: 0,
        monthlyRevenue: 0,
        upcomingSessions: 0
      },
      centersWithStats: [],
      featuredClasses: [],
      recentActivity: [],
      upcomingSessionsToday: []
    };
  }
};
