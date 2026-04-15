import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { studentsApi } from '$lib/api/students';
import { schoolsApi } from '$lib/api/schools';

export const load: PageServerLoad = async ({ locals, params }) => {
  const studentId = params.studentId;
  
  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  try {
    // Get student data and user's schools from Firebase API
    const [student, schools] = await Promise.all([
      studentsApi.getStudent(studentId),
      schoolsApi.getMySchools()
    ]);

    return { 
      user: locals.user, 
      student, 
      schools 
    };

  } catch (err: any) {
    console.error('❌ Error in edit student page:', err);
    if (err.status) throw err;
    throw error(404, 'Student not found or error loading data');
  }
};
