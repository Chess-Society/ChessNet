import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  documentId
} from "firebase/firestore";

export const load: PageServerLoad = async ({ locals, params }) => {
  const classId = params.classId;

  if (!locals.user) {
    throw error(401, 'Usuario no autenticado');
  }

  try {
    const classRef = doc(db, "classes", classId);
    const classSnap = await getDoc(classRef);

    if (!classSnap.exists() || classSnap.data().owner_id !== locals.user.id) {
      throw error(404, 'Clase no encontrada');
    }

    const classData = { id: classSnap.id, ...classSnap.data() };

    // Estudiantes inscritos
    const qEnrollments = query(
      collection(db, "class_students"),
      where("owner_id", "==", locals.user.id),
      where("class_id", "==", classId)
    );
    const enrollmentsSnap = await getDocs(qEnrollments);
    const studentIds = enrollmentsSnap.docs.map(doc => doc.data().student_id);
    
    let students: any[] = [];
    if (studentIds.length > 0) {
      // Fetch students in chunks of 10 (Firestore 'in' limit)
      for (let i = 0; i < studentIds.length; i += 10) {
        const chunk = studentIds.slice(i, i + 10);
        const qStudents = query(
          collection(db, "students"),
          where(documentId(), "in", chunk)
        );
        const studentsSnap = await getDocs(qStudents);
        students = [...students, ...studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))];
      }
    }
    
    // Skill de la clase
    const qClassSkills = query(
      collection(db, "class_skills"),
      where("owner_id", "==", locals.user.id),
      where("class_id", "==", classId)
    );
    const classSkillsSnap = await getDocs(qClassSkills);
    const skillIds = classSkillsSnap.docs.map(doc => doc.data().skill_id);
    
    let skillsMap = new Map();
    if (skillIds.length > 0) {
      for (let i = 0; i < skillIds.length; i += 10) {
        const chunk = skillIds.slice(i, i + 10);
        const qDetailedSkills = query(
          collection(db, "skills"),
          where(documentId(), "in", chunk)
        );
        const detailsSnap = await getDocs(qDetailedSkills);
        detailsSnap.docs.forEach(doc => {
          skillsMap.set(doc.id, { id: doc.id, ...doc.data() });
        });
      }
    }

    const classSkills = classSkillsSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        skill: skillsMap.get(data.skill_id) || { name: 'Skill eliminada', description: '', difficulty: 0 }
      };
    }).sort((a: any, b: any) => (a.order_index || 0) - (b.order_index || 0));

    // Attendance stats (placeholder logic for now, using Firestore)
    const qAttendance = query(
      collection(db, "attendance"),
      where("owner_id", "==", locals.user.id),
      where("class_id", "==", classId)
    );
    const attendanceSnap = await getDocs(qAttendance);
    const sessions = new Set(attendanceSnap.docs.map(doc => doc.data().date)).size;

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
          const cat = cs.skill?.category || 'Sin categoría';
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
    throw error(500, 'Error interno del servidor');
  }
};
