import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { adminDb } from '$lib/firebase-admin';

export const load: PageServerLoad = async ({ locals, params }) => {
  const classId = params.classId;

  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  const isMock = locals.user.uid === 'chessnet-dev-uid';

  if (isMock) {
    return {
      user: locals.user,
      classData: serializeRecord({
        id: classId,
        name: "Clase de Prueba (MOCK)",
        level: "beginner",
        schedule: "Lunes 17:00",
        active: true,
        max_students: 15,
        studentCount: 2
      }),
      students: [],
      stats: {
        totalStudents: 2,
        capacity: 15,
        occupancyRate: 13,
        attendanceAverage: 100,
        skillProgress: 0,
        activeStudents: 2
      },
      skills: [],
      attendance: []
    };
  }

  try {
    const classSnap = await adminDb.collection("classes").doc(classId).get();

    if (!classSnap.exists || classSnap.data()?.owner_id !== locals.user.uid) {
      throw error(404, 'Class not found');
    }

    const classData = { id: classSnap.id, ...classSnap.data() };

    // Enrolled students
    const enrollmentsSnap = await adminDb.collection("class_students")
      .where("owner_id", "==", locals.user.uid)
      .where("class_id", "==", classId)
      .get();
      
    const studentIds = enrollmentsSnap.docs.map((doc: any) => doc.data().student_id);
    
    let students: any[] = [];
    if (studentIds.length > 0) {
      // Fetch students in chunks of 30 (Firebase Admin 'in' limit is higher than client, but let's use 10 for safety/consistency)
      for (let i = 0; i < studentIds.length; i += 30) {
        const chunk = studentIds.slice(i, i + 30);
        const studentsSnap = await adminDb.collection("students")
          .where("__name__", "in", chunk)
          .get();
        students = [...students, ...studentsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))];
      }
    }
    
    // Class skills
    const classSkillsSnap = await adminDb.collection("class_skills")
      .where("owner_id", "==", locals.user.uid)
      .where("class_id", "==", classId)
      .get();
      
    const skillIds = classSkillsSnap.docs.map((doc: any) => doc.data().skill_id);
    
    let skillsMap = new Map();
    if (skillIds.length > 0) {
      for (let i = 0; i < skillIds.length; i += 30) {
        const chunk = skillIds.slice(i, i + 30);
        const detailsSnap = await adminDb.collection("skills")
          .where("__name__", "in", chunk)
          .get();
        detailsSnap.docs.forEach((doc: any) => {
          skillsMap.set(doc.id, { id: doc.id, ...doc.data() });
        });
      }
    }

    const classSkills = classSkillsSnap.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        skill: skillsMap.get(data.skill_id) || { name: 'Skill deleted', description: '', difficulty: 0 }
      };
    }).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

    // Fetch attendance records for stats
    const attendanceSnap = await adminDb.collection("attendance")
      .where("owner_id", "==", locals.user.uid)
      .where("class_id", "==", classId)
      .get();

    // Attendance stats calculation
    const attendanceRecords = attendanceSnap.docs.map((doc: any) => doc.data());
    const sessionsByDate = attendanceRecords.reduce((acc: any, record: any) => {
      const date = record.date;
      if (!acc[date]) acc[date] = { total: 0, present: 0, late: 0 };
      acc[date].total++;
      if (record.status === 'present' || record.status === 'late') acc[date].present++;
      if (record.status === 'late') acc[date].late++;
      return acc;
    }, {});

    const dates = Object.keys(sessionsByDate).sort();
    const totalSessions = dates.length;
    
    let avgAttendance = 0;
    let avgPunctuality = 0;
    let mostAttended = '';
    let leastAttended = '';
    
    if (totalSessions > 0) {
      const rates = dates.map(d => (sessionsByDate[d].present / sessionsByDate[d].total) * 100);
      avgAttendance = Math.round(rates.reduce((a, b) => a + b, 0) / totalSessions);
      
      const punctualityRates = dates.map(d => {
        const attended = sessionsByDate[d].present;
        if (attended === 0) return 100;
        return ((attended - sessionsByDate[d].late) / attended) * 100;
      });
      avgPunctuality = Math.round(punctualityRates.reduce((a, b) => a + b, 0) / totalSessions);
      
      const maxRate = Math.max(...rates);
      const minRate = Math.min(...rates);
      mostAttended = dates[rates.indexOf(maxRate)] || '';
      leastAttended = dates[rates.indexOf(minRate)] || '';
    }

    const lastSession = dates[dates.length - 1] || null;

    let schoolData = null;
    if (classData.school_id) {
      const schoolSnap = await adminDb.collection("schools").doc(classData.school_id).get();
      if (schoolSnap.exists) {
        schoolData = { id: schoolSnap.id, ...schoolSnap.data() };
      }
    }
    
    return {
      user: locals.user,
      class: { ...classData, school: schoolData },
      students,
      classSkills,
      classStats: { 
        total_students: students.length, 
        active_students: students.filter(s => s.active).length,
        inactive_students: students.filter(s => !s.active).length,
        total_skills: classSkills.length, 
        occupancy_rate: (classData as any).max_students ? Math.round((students.length / (classData as any).max_students) * 100) : 0,
        skills_by_category: classSkills.reduce((acc: any, cs: any) => {
          const cat = cs.skill?.category || 'Uncategorized';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {}),
      },
      attendanceStats: { 
        total_sessions: totalSessions, 
        average_attendance_rate: avgAttendance, 
        average_punctuality_rate: avgPunctuality, 
        most_attended_date: mostAttended, 
        least_attended_date: leastAttended, 
        last_session_date: lastSession, 
        next_session_date: null // This would require schedule logic
      }
    };

  } catch (err: any) {
    console.error('❌ Error in class detail page:', err);
    if (err.status) throw err;
    throw error(500, 'Internal server error');
  }
};
