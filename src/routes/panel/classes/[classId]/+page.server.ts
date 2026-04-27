import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { adminDb, Filter } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

interface ClassData {
    id?: string;
    name: string;
    owner_id: string;
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
    const classRaw = classSnap.data();
    const isOwner = classRaw?.owner_id === locals.user.uid || classRaw?.ownerId === locals.user.uid;

    if (!classSnap.exists || !isOwner) {
      throw error(404, 'Class not found');
    }

    const classData = { ...(classRaw as ClassData), id: classSnap.id };

    // Enrolled students
    const enrollmentsSnap = await adminDb.collection("class_students")
      .where(Filter.or(
        Filter.where('owner_id', '==', locals.user.uid),
        Filter.where('ownerId', '==', locals.user.uid)
      ))
      .where(Filter.or(
        Filter.where('class_id', '==', classId),
        Filter.where('classId', '==', classId)
      ))
      .get();
      
    const studentIds = enrollmentsSnap.docs.map((doc: QueryDocumentSnapshot) => doc.data().student_id || doc.data().studentId);
    
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
      .where(Filter.or(
        Filter.where('owner_id', '==', locals.user.uid),
        Filter.where('ownerId', '==', locals.user.uid)
      ))
      .where(Filter.or(
        Filter.where('class_id', '==', classId),
        Filter.where('classId', '==', classId)
      ))
      .get();
      
    const skillIds = classSkillsSnap.docs.map((doc: QueryDocumentSnapshot) => doc.data().skill_id || doc.data().skillId);
    
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
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        skill: skillsMap.get(data.skill_id || data.skillId) || { name: 'Skill deleted', description: '', difficulty: 0 }
      };
    }).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

    // Fetch attendance records for stats
    const attendanceSnap = await adminDb.collection("attendance")
      .where(Filter.or(
        Filter.where('owner_id', '==', locals.user.uid),
        Filter.where('ownerId', '==', locals.user.uid)
      ))
      .where(Filter.or(
        Filter.where('class_id', '==', classId),
        Filter.where('classId', '==', classId)
      ))
      .get();

    // Attendance stats calculation
    const attendanceRecords = attendanceSnap.docs.map((doc: QueryDocumentSnapshot) => doc.data());
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
    if (classData.school_id) {
      const schoolSnap = await adminDb.collection("schools").doc(classData.school_id).get();
      if (schoolSnap.exists) {
        schoolData = { id: schoolSnap.id, ...schoolSnap.data() };
      }
    }
    
    return serializeRecord({
      user: locals.user,
      class: { ...classData, school: schoolData },
      students,
      classSkills,
      classStats: { 
        total_students: students.length, 
        active_students: students.filter(s => s.active).length,
        inactive_students: students.filter(s => !s.active).length,
        total_skills: classSkills.length, 
        occupancy_rate: classData.max_students ? Math.round((students.length / classData.max_students) * 100) : 0,
        skills_by_category: classSkills.reduce((acc: Record<string, number>, cs: any) => {
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
        next_session_date: null 
      }
    });

  } catch (err: any) {
    console.error('❌ Error in class detail page:', err);
    if (err.status) throw err;
    throw error(500, 'Internal server error');
  }
};
