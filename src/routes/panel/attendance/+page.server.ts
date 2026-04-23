import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals }) => {

  if (!locals.user) {
    return {
      user: null,
      attendanceData: {
        todayStats: { totalClasses: 0, classesWithAttendance: 0, totalStudents: 0, presentStudents: 0, absentStudents: 0, attendanceRate: 0 },
        centersWithClasses: [],
        recentAttendance: [],
        upcomingClasses: []
      }
    };
  }

  const uid = locals.user.uid;
  try {
    const [schoolsSnap, studentsSnap] = await Promise.all([
      adminDb.collection('schools').where('owner_id', '==', uid).get(),
      adminDb.collection('students').where('owner_id', '==', uid).get()
    ]);

    const schools = schoolsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    const allStudents = studentsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    const centersWithClasses = await Promise.all(schools.map(async (school: any) => {
      const classesSnap = await adminDb.collection('classes')
        .where('owner_id', '==', uid)
        .where('school_id', '==', school.id)
        .get();
      
      const classes = classesSnap.docs.map((d: any) => ({
        id: d.id,
        name: d.data().name,
        time: d.data().schedule || 'Sin horario',
        students: allStudents.filter((s: any) => s.class_id === d.id).length,
        present: 0,
        absent: 0,
        attendanceRate: 0,
        attendanceTaken: false,
        lastAttendance: null
      }));

      const schoolStudents = allStudents.filter((s: any) => s.school_id === school.id);

      return {
        id: school.id,
        name: school.name,
        city: school.city,
        totalClasses: classes.length,
        classesToday: 0,
        totalStudents: schoolStudents.length,
        attendanceRate: 0,
        nextClass: null,
        classes
      };
    }));

    const attendanceData = {
      todayStats: {
        totalClasses: centersWithClasses.reduce((sum: number, s: any) => sum + s.totalClasses, 0),
        classesWithAttendance: 0,
        totalStudents: allStudents.length,
        presentStudents: 0,
        absentStudents: 0,
        attendanceRate: 0
      },
      centersWithClasses: serializeRecord(centersWithClasses),
      recentAttendance: [],
      upcomingClasses: []
    };

    return {
      user: locals.user,
      attendanceData
    };

  } catch (err: any) {
    console.error('❌ Error loading attendance data:', err);
    return {
      user: locals.user,
      attendanceData: {
        todayStats: { totalClasses: 0, classesWithAttendance: 0, totalStudents: 0, presentStudents: 0, absentStudents: 0, attendanceRate: 0 },
        centersWithClasses: [],
        recentAttendance: [],
        upcomingClasses: []
      }
    };
  }
};
