import type { PageServerLoad } from './$types';
import { classesApi } from '$lib/api/classes';
import { schoolsApi } from '$lib/api/schools';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
  console.log('✏️ Edit class page server load - User:', locals.user?.email || 'none');
  console.log('✏️ Class ID:', params.classId);
  
  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  try {
    // Get class and available schools from Firebase
    const [classData, schools] = await Promise.all([
      classesApi.getClass(params.classId),
      schoolsApi.getMySchools()
    ]);

    if (!classData) {
      throw error(404, 'Class not found');
    }

    // Suggested schedules by level
    const suggestedSchedules = {
      beginner: [
        'Monday and Wednesday 10:00-11:00',
        'Tuesday and Thursday 16:00-17:00',
        'Friday 17:00-18:00',
        'Saturdays 10:00-11:30'
      ],
      intermediate: [
        'Monday and Wednesday 17:00-18:30',
        'Tuesday and Thursday 17:00-18:30',
        'Friday 18:00-19:30',
        'Saturdays 11:30-13:00'
      ],
      advanced: [
        'Monday and Wednesday 18:30-20:00',
        'Tuesday and Thursday 18:30-20:00',
        'Friday 19:30-21:00',
        'Saturdays 09:00-11:00'
      ],
      mixed: [
        'Wednesday 20:00-21:30',
        'Friday 20:00-21:30',
        'Saturdays 16:00-17:30',
        'Sundays 10:00-11:30'
      ]
    };

    // Suggested capacities by level
    const suggestedCapacities = {
      beginner: { min: 8, max: 15, recommended: 12 },
      intermediate: { min: 6, max: 12, recommended: 10 },
      advanced: { min: 4, max: 10, recommended: 8 },
      mixed: { min: 8, max: 20, recommended: 15 }
    };

    return {
      user: locals.user,
      class: classData,
      schools: schools || [],
      suggestedSchedules,
      suggestedCapacities
    };

  } catch (err: any) {
    console.error('❌ Error in edit class page load:', err);
    if (err.status) {
      throw err;
    }
    throw error(500, 'Internal server error');
  }
};
