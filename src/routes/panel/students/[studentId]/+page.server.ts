import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { studentId } = params;

  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  const uid = locals.user.uid;
  const isMock = uid === 'chessnet-dev-uid';

  try {
    // 1. Obtener datos del alumno
    let student: any = null;
    
    if (isMock) {
      student = {
        id: studentId,
        name: 'Alumno de Prueba',
        first_name: 'Alumno',
        last_name: 'de Prueba',
        school_id: 'mock-school-1',
        notes: 'Este es un alumno generado para pruebas locales.',
        owner_id: uid
      };
    } else {
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
      
      // Verificar propiedad
      if (student.owner_id !== uid) {
        throw error(403, 'No tienes permiso para ver este alumno');
      }
    }

    // 2. Cargar centro si está asignado
    let school = null;
    if (student.school_id) {
       if (isMock && student.school_id === 'mock-school-1') {
         school = { id: 'mock-school-1', name: 'Escuela de Ajedrez Central' };
       } else {
         const schoolSnap = await adminDb.collection("schools").doc(student.school_id).get();
         if (schoolSnap.exists) {
           school = { id: schoolSnap.id, ...schoolSnap.data() };
         }
       }
    }

    // 3. Cargar clases donde está matriculado
    // Buscamos en class_students
    let enrolledClasses: any[] = [];
    
    if (isMock) {
      enrolledClasses = [
        { id: 'mock-class-1', name: 'Principiantes Mañana', school_name: 'Escuela de Ajedrez Central' }
      ];
    } else {
      const enrollmentsSnap = await adminDb.collection("class_students")
        .where("owner_id", "==", uid)
        .where("student_id", "==", studentId)
        .get();
        
      const classIds = enrollmentsSnap.docs.map((doc: any) => doc.data().class_id);
      
      if (classIds.length > 0) {
        // Obtenemos detalles de las clases
        const classesSnap = await adminDb.collection("classes")
          .where("__name__", "in", classIds)
          .get();
          
        enrolledClasses = classesSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      }
    }

    // 4. Calcular métricas reales (Asistencia)
    let attendanceRate = 0;
    if (isMock) {
      attendanceRate = 92;
    } else {
      const attendanceSnap = await adminDb.collection("attendance")
        .where("student_id", "==", studentId)
        .where("owner_id", "==", uid)
        .get();
      
      const totalSessions = attendanceSnap.size;
      const attendanceDocs = attendanceSnap.docs.map(doc => doc.data());
      if (totalSessions > 0) {
        // En la base de datos guardamos 'P' para Presente
        const presentSessions = attendanceDocs.filter(d => d.status === 'P' || d.status === 'present').length;
        attendanceRate = Math.round((presentSessions / totalSessions) * 100);
      } else {
        attendanceRate = 100;
      }

    }

    // 5. Calcular progreso de habilidades (Skills)
    let estimatedProgress = 0;
    if (isMock) {
      estimatedProgress = 74;
    } else {
      const skillsSnap = await adminDb.collection("student_skills")
        .where("student_id", "==", studentId)
        .where("owner_id", "==", uid)
        .get();
      
      const masteredSkills = skillsSnap.docs.filter(doc => doc.data().level >= 3).length;
      // Asumimos un máximo de 20 habilidades base para el cálculo de porcentaje
      estimatedProgress = Math.min(100, Math.round((masteredSkills / 20) * 100));
    }


    return {
      user: locals.user,
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
