import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals }) => {
  
  if (!locals.user) {
    return {
      user: null,
      availableStudents: [],
      schools: []
    };
  }

  const uid = locals.user.uid;

  try {
    const [studentsSnap, schoolsSnap] = await Promise.all([
      adminDb.collection('students').where('owner_id', '==', uid).get(),
      adminDb.collection('schools').where('owner_id', '==', uid).orderBy('name', 'asc').get()
    ]);

    const schools = schoolsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    const students = studentsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    const availableStudents = students.map((s: any) => {
      const school = schools.find((sc: any) => sc.id === s.school_id);
      return {
        id: s.id,
        name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || s.name || 'Sin nombre',
        rating: s.rating || 1200,
        school_name: school?.name || 'Sin centro',
        email: s.parent_email || s.email || ''
      };
    });

    const availableLocations = [
      ...schools.map((s: any) => s.name),
      'Online - ChessNet Platform'
    ];

    return {
      user: locals.user,
      availableStudents: serializeRecord(availableStudents),
      schools: serializeRecord(schools)
    };

  } catch (err: any) {
    console.error('❌ Error in tournament create page server load:', err);
    return {
      user: locals.user,
      availableStudents: [],
      schools: []
    };
  }
};
