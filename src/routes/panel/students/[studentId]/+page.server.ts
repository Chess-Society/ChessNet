import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import { getUserPlan } from '$lib/server/plans';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { studentId } = params;

  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  const uid = locals.user.uid;


  try {
    let student: any = null;
    let studentSnap = await adminDb.collection("students").doc(studentId).get();
    
    // Reintentos si no existe (posible retardo en propagación tras creación)
    let attempts = 0;
    while (!studentSnap.exists && attempts < 5) {
      console.log(`🔄 Student ${studentId} not found, retrying attempt ${attempts + 1}...`);
      await new Promise(resolve => setTimeout(resolve, 500));
      studentSnap = await adminDb.collection("students").doc(studentId).get();
      attempts++;
    }

    if (!studentSnap.exists) {
      throw error(404, 'Student not found');
    }
    student = { id: studentSnap.id, ...studentSnap.data() };
    
    // Verificar propiedad (Profesor, Padre o Propio Alumno)
    const cleanUserEmail = locals.user.email?.toLowerCase();
    const isOwner = student.owner_id === uid;
    const isParent = student.parentEmail?.toLowerCase() === cleanUserEmail || student.parent_email?.toLowerCase() === cleanUserEmail;
    const isSelf = student.email?.toLowerCase() === cleanUserEmail || student.studentEmail?.toLowerCase() === cleanUserEmail;

    if (!isOwner && !isParent && !isSelf) {
      throw error(403, 'No tienes permiso para ver este alumno');
    }

    // 2. Cargar centro si está asignado
    let school = null;
    const sId = student.school_id || student.schoolId;
    if (sId) {
      const schoolSnap = await adminDb.collection("schools").doc(sId).get();
      if (schoolSnap.exists) {
        school = { id: schoolSnap.id, ...schoolSnap.data() };
      }
    }

    let enrolledClasses: any[] = [];
    
    const enrollmentsSnap = await adminDb.collection("class_students")
      .where("student_id", "==", studentId)
      .get();
      
    // Fallback if none found with student_id (for legacy data)
    let enrollments = enrollmentsSnap.docs.map((doc: any) => doc.data());
    if (enrollments.length === 0) {
      const legacySnap = await adminDb.collection("class_students")
        .where("studentId", "==", studentId)
        .get();
      enrollments = legacySnap.docs.map((doc: any) => doc.data());
    }
      
    const classIds = enrollments.map((data: any) => data.class_id || data.classId);
    
    if (classIds.length > 0) {
      // Obtenemos detalles de las clases
      const classesSnap = await adminDb.collection("classes")
        .where("__name__", "in", classIds)
        .get();
        
      enrolledClasses = classesSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    }

    let attendanceRate = 0;
    // Si es padre o el propio alumno, no filtramos por owner_id
    const attendanceQuery = isOwner 
      ? adminDb.collection("attendance").where("student_id", "==", studentId).where("owner_id", "==", uid)
      : adminDb.collection("attendance").where("student_id", "==", studentId);
    
    const attendanceSnap = await attendanceQuery.get();
    
    const totalSessions = attendanceSnap.size;
    const attendanceDocs = attendanceSnap.docs.map((doc: any) => doc.data());
    if (totalSessions > 0) {
      // En la base de datos guardamos 'P' para Presente, 'T' para Tarde
      const presentSessions = attendanceDocs.filter((d: any) => 
        ['P', 'present', 'T', 'late'].includes(d.status)
      ).length;
      attendanceRate = Math.round((presentSessions / totalSessions) * 100);
    } else {
      attendanceRate = 100;
    }

    let estimatedProgress = 0;
    const skillsQuery = isOwner 
      ? adminDb.collection("student_skills").where("student_id", "==", studentId).where("owner_id", "==", uid)
      : adminDb.collection("student_skills").where("student_id", "==", studentId);

    const skillsSnap = await skillsQuery.get();
    
    const masteredSkills = skillsSnap.docs.filter((doc: any) => doc.data().level >= 3).length;
    // Asumimos un máximo de 20 habilidades base para el cálculo de porcentaje
    estimatedProgress = Math.min(100, Math.round((masteredSkills / 20) * 100));

    // Removed achievements loading
    return {
      user: locals.user,
      role: locals.role,
      userPlan: await getUserPlan(locals.user.uid),
      student: serializeRecord(student),
      school: serializeRecord(school),
      enrolledClasses: serializeRecord(enrolledClasses),
      attendanceRate,
      estimatedProgress: estimatedProgress || 0
    };

  } catch (err: any) {
    console.error('❌ Error loading student details:', err);
    if (err.status) throw err;
    throw error(500, 'Error loading student details');
  }
};
