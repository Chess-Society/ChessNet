import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { studentsApi } from '$lib/api/students';
import { schoolsApi } from '$lib/api/schools';
import { classesApi } from '$lib/api/classes';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { studentId } = params;

  try {
    const student = await studentsApi.getStudent(studentId);
    if (!student) {
      throw error(404, 'Alumno no encontrado');
    }

    // Load school if assigned
    let school = null;
    if (student.school_id) {
      school = await schoolsApi.getSchool(student.school_id);
    }

    // Load classes where student is enrolled
    const classesList = await classesApi.getMyClasses();
    const enrolledClasses = classesList.filter(c => 
      c.studentIds?.includes(studentId)
    );

    return {
      student,
      school,
      enrolledClasses
    };
  } catch (err) {
    console.error('Error loading student details:', err);
    throw error(500, 'Error al cargar los detalles del alumno');
  }
};
