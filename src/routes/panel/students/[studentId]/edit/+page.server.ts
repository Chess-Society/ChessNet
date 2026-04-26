import type { PageServerLoad, Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { studentSchema } from '$lib/schemas/student';

export const load: PageServerLoad = async ({ locals, params }) => {
  const studentId = params.studentId;
  
  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  try {
    const uid = locals.user.uid;
    const [studentSnap, schoolsSnap, classesSnap] = await Promise.all([
      adminDb.collection('students').doc(studentId).get(),
      adminDb.collection('schools').where('owner_id', '==', uid).orderBy('name', 'asc').get(),
      adminDb.collection('classes').where('owner_id', '==', uid).orderBy('name', 'asc').get()
    ]);

    if (!studentSnap.exists) {
      throw error(404, 'Student not found');
    }

    const studentData = studentSnap.data();
    // Validate ownership
    if (studentData?.owner_id !== uid) {
      throw error(403, 'Unauthorized access to student');
    }

    const form = await superValidate(studentData, zod(studentSchema as any)) as any;

    return { 
      form,
      user: locals.user, 
      student: serializeRecord({ id: studentSnap.id, ...studentData }), 
      schools: serializeRecord(schoolsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }))),
      classes: serializeRecord(classesSnap.docs.map((d: any) => ({ id: d.id, ...d.data() })))
    };

  } catch (err: any) {
    console.error('❌ Error in edit student page:', err);
    if (err.status) throw err;
    throw error(404, 'Student not found or error loading data');
  }
};

export const actions: Actions = {
  update: async ({ request, locals, params }) => {
    if (!locals.user) return fail(401);
    const studentId = params.studentId;

    const form = await superValidate(request, zod(studentSchema as any)) as any;
    if (!form.valid) return fail(400, { form });

    try {
      const { ...studentData } = form.data;
      const uid = locals.user.uid;

      // Ensure ownership check before update
      const docRef = adminDb.collection('students').doc(studentId);
      const docSnap = await docRef.get();
      
      if (!docSnap.exists || docSnap.data()?.owner_id !== uid) {
        return fail(403, { form, error: 'Unauthorized' });
      }

      await docRef.update({
        ...studentData,
        name: `${studentData.firstName} ${studentData.lastName}`.trim(),
        updatedAt: new Date().toISOString()
      });

      return { form };
    } catch (err: any) {
      console.error('❌ Error updating student:', err);
      return fail(500, { form, error: err.message });
    }
  }
};
