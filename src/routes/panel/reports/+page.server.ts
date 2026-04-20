import type { PageServerLoad } from './$types';
import { checkPlanGating } from '$lib/server/plans';

export const load: PageServerLoad = async (event) => {
  const { locals, url } = event;
  await checkPlanGating(event, 'premium');

  const uid = locals.user.uid;

  try {
    const studentsSnap = await adminDb.collection("students")
      .where("owner_id", "==", uid)
      .limit(10)
      .get();

    const studentsReports = studentsSnap.docs.map(doc => {
      const data = doc.data();
      return {
        student: {
          id: doc.id,
          name: `${data.first_name} ${data.last_name}`,
          email: data.email,
          phone: data.phone || 'N/A',
          level: data.level || 'beginner'
        },
        progress_summary: {
          attendance_rate: 100, // Placeholder for aggregation logic
          skills_mastered: 0,
          total_payments: 0
        }
      };
    });

    const generalStats = {
      total_students: studentsReports.length,
      active_students: studentsReports.length
    };

    return {
      user: locals.user,
      studentsReports,
      generalStats
    };
  } catch (err) {
    console.error('Error loading reports:', err);
    return {
      user: locals.user,
      studentsReports: [],
      generalStats: {}
    };
  }

};
