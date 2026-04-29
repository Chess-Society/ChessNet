import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { adminDb, Filter } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

interface ClassData {
    id?: string;
    name: string;
    ownerId: string;
    max_students?: number;
    level?: string;
    school_id?: string;
    [key: string]: any;
}

export const load: PageServerLoad = async ({ locals, params }) => {
  const classId = params.classId;

  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  try {
    const classSnap = await adminDb.collection("classes").doc(classId).get();
    const sc = serializeRecord<any>(classSnap.data());
    const isOwner = sc.ownerId === locals.user.uid;

    if (!classSnap.exists || !isOwner) {
      throw error(404, 'Class not found');
    }

    const classData = { ...sc, id: classSnap.id };


    // Enrolled students
    const enrollmentsSnap = await adminDb.collection("class_students")
      .where("ownerId", "==", locals.user.uid)
      .where("classId", "==", classId)
      .get();

      
    const studentIds = enrollmentsSnap.docs.map((doc: QueryDocumentSnapshot) => serializeRecord<any>(doc.data()).studentId);

    
    let students: (ClassData & { id: string })[] = [];
    if (studentIds.length > 0) {
      // Fetch students in chunks of 30
      for (let i = 0; i < studentIds.length; i += 30) {
        const chunk = studentIds.slice(i, i + 30);
        const studentsSnap = await adminDb.collection("students")
          .where("__name__", "in", chunk)
          .get();
        students = [...students, ...studentsSnap.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() as any }))];
      }
    }
    
    // Class skills
    const classSkillsSnap = await adminDb.collection("class_skills")
      .where("ownerId", "==", locals.user.uid)
      .where("classId", "==", classId)
      .get();

      
    const skillIds = classSkillsSnap.docs.map((doc: QueryDocumentSnapshot) => serializeRecord<any>(doc.data()).skillId);

    
    let skillsMap = new Map();
    if (skillIds.length > 0) {
      for (let i = 0; i < skillIds.length; i += 30) {
        const chunk = skillIds.slice(i, i + 30);
        const detailsSnap = await adminDb.collection("skills")
          .where("__name__", "in", chunk)
          .get();
        detailsSnap.docs.forEach((doc: QueryDocumentSnapshot) => {
          skillsMap.set(doc.id, { id: doc.id, ...doc.data() as any });
        });
      }
    }

    const classSkills = classSkillsSnap.docs.map((doc: QueryDocumentSnapshot) => {
      const data = serializeRecord<any>(doc.data());
      return {
        id: doc.id,
        ...data,
        skill: skillsMap.get(data.skillId) || { name: 'Skill deleted', description: '', difficulty: 0 }
      };
    }).sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));


    // Fetch attendance records for stats
    const attendanceSnap = await adminDb.collection("attendance")
      .where("ownerId", "==", locals.user.uid)
      .where("classId", "==", classId)
      .get();


    // Attendance stats calculation
    const attendanceRecords = attendanceSnap.docs.map((doc: QueryDocumentSnapshot) => serializeRecord<any>(doc.data()));

    const sessionsByDate = attendanceRecords.reduce((acc: Record<string, any>, record: any) => {
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
    if (classData.schoolId) {
      const schoolSnap = await adminDb.collection("schools").doc(classData.schoolId).get();
      if (schoolSnap.exists) {
        schoolData = serializeRecord({ id: schoolSnap.id, ...schoolSnap.data() });
      }
    }

    
    return serializeRecord({
      user: locals.user,
      class: { ...classData, school: schoolData },
      students,
      classSkills,
      classStats: { 
        totalStudents: students.length, 
        activeStudents: students.filter((s: any) => s.active).length,
        inactiveStudents: students.filter((s: any) => !s.active).length,
        totalSkills: classSkills.length, 
        occupancyRate: classData.maxStudents ? Math.round((students.length / classData.maxStudents) * 100) : 0,
        skillsByCategory: classSkills.reduce((acc: Record<string, number>, cs: any) => {
          const cat = (cs.skill?.category || 'Uncategorized').replace(/_/g, ' ');
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {}),
      },

      attendanceStats: { 
        totalSessions: totalSessions, 
        averageAttendanceRate: avgAttendance, 
        averagePunctualityRate: avgPunctuality, 
        mostAttendedDate: mostAttended, 
        leastAttendedDate: leastAttended, 
        lastSessionDate: lastSession, 
        nextSessionDate: null 
      }

    });

  } catch (err: any) {
    console.error('❌ Error in class detail page:', err);
    if (err.status) throw err;
    throw error(500, 'Internal server error');
  }
};
