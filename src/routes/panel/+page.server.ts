import type { PageServerLoad } from './$types';
import { authenticate } from '$lib/server/auth';
import { adminDb } from '$lib/firebase-admin';

export const load: PageServerLoad = async (event) => {
  const { user } = await authenticate(event);
  
  if (!user) {
    return { user: null };
  }

  const uid = user.uid;

  try {
    const [schoolsSnap, studentsSnap, classesSnap] = await Promise.all([
      adminDb.collection("schools").where("owner_id", "==", uid).get(),
      adminDb.collection("students").where("owner_id", "==", uid).get(),
      adminDb.collection("classes").where("owner_id", "==", uid).get()
    ]);

    const schools = schoolsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const classes = classesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const dashboardStats = {
      totalCenters: schools.length,
      totalStudents: students.length,
      totalClasses: classes.length,
      activeStudents: students.filter(s => (s as any).active !== false).length,
      monthlyRevenue: 0,
      upcomingSessions: classes.filter(c => (c as any).active !== false).length 
    };

    const centersWithStats = schools.map(school => {
      const schoolClasses = classes.filter(c => (c as any).school_id === school.id);
      const schoolStudents = students.filter(s => (s as any).school_id === school.id);

      return {
        id: school.id,
        name: (school as any).name,
        city: (school as any).city || 'Sin ciudad',
        totalClasses: schoolClasses.length,
        totalStudents: schoolStudents.length,
        occupancyRate: schoolClasses.length > 0 ? Math.round((schoolStudents.length / (schoolClasses.length * 15)) * 100) : 0,
        attendanceRate: 0,
        monthlyRevenue: 0,
        lastActivity: (school as any).updated_at || (school as any).created_at
      };
    });

    return {
      user,
      dashboardStats,
      centersWithStats,
      featuredClasses: classes.slice(0, 3),
      recentActivity: [],
      upcomingSessionsToday: classes.slice(0, 4)
    };

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
