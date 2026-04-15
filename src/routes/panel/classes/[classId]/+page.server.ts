import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { adminDb } from '$lib/firebase-admin';

export const load: PageServerLoad = async ({ locals, params }) => {
  const classId = params.classId;

  if (!locals.user) {
    throw error(401, 'User not authenticated');
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

    // Attendance stats
    const attendanceSnap = await adminDb.collection("attendance")
      .where("owner_id", "==", locals.user.uid)
      .where("class_id", "==", classId)
      .get();
    const sessions = new Set(attendanceSnap.docs.map((doc: any) => doc.data().date)).size;

    return {
      user: locals.user,
      class: classData,
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
        total_sessions: sessions, 
        average_attendance_rate: 0, 
        average_punctuality_rate: 0, 
        most_attended_date: '', 
        least_attended_date: '', 
        last_session_date: new Date().toISOString(), 
        next_session_date: new Date().toISOString() 
      }
    };

  } catch (err: any) {
    console.error('❌ Error in class detail page:', err);
    if (err.status) throw err;
    throw error(500, 'Internal server error');
  }
};
