import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { studentsApi } from '$lib/api/students';
import { schoolsApi } from '$lib/api/schools';
import { classesApi } from '$lib/api/classes';

export const load: PageServerLoad = async ({ locals, params }) => {
  const studentId = params.studentId;
  
  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  try {
    const [student, schools, classes] = await Promise.all([
      studentsApi.getStudent(studentId),
      schoolsApi.getMySchools(),
      classesApi.getMyClasses()
    ]);

    return { 
      user: locals.user, 
      student, 
      schools,
      classes
    };

  } catch (err: any) {
    console.error('❌ Error in edit student page:', err);
    if (err.status) throw err;
    throw error(404, 'Student not found or error loading data');
  }
};
