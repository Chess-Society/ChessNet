import type { PageServerLoad, Actions } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { studentSchema } from '$lib/schemas/student';
import { fail, redirect } from '@sveltejs/kit';
import { checkStudentLimit } from '$lib/server/plans';

export const load: PageServerLoad = async ({ locals }) => {
  const form = await superValidate(zod(studentSchema as any)) as any;
  
  if (!locals.user) {
    return { 
      form,
      user: null, 
      schools: [],
      classes: []
    };
  }

  const uid = locals.user.uid;

  try {
    const [schoolsSnap, classesSnap] = await Promise.all([
      adminDb.collection('schools').where('owner_id', '==', uid).orderBy('name', 'asc').get(),
      adminDb.collection('classes').where('owner_id', '==', uid).orderBy('name', 'asc').get()
    ]);

    return { 
      form,
      user: locals.user, 
      schools: serializeRecord(schoolsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }))),
      classes: serializeRecord(classesSnap.docs.map((d: any) => ({ id: d.id, ...d.data() })))
    };

  } catch (err: any) {
    console.error('❌ Error in students create page load:', err);
    return { 
      form,
      user: locals.user, 
      schools: [],
      classes: []
    };
  }
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    if (!locals.user) return fail(401);

    const form = await superValidate(request, zod(studentSchema as any)) as any;
    if (!form.valid) return message(form, 'Datos inválidos. Por favor revisa el formulario.', { status: 400 });

    try {
      const uid = locals.user.uid;

      // Enforce student limit for free plan
      const canCreate = await checkStudentLimit(uid);
      if (!canCreate) {
        return message(form, 'Has alcanzado el límite de 10 alumnos del plan gratuito. Mejora a Premium para alumnos ilimitados.', { status: 403 });
      }

      const { ...studentData } = form.data;
      const now = new Date().toISOString();

      // Add audit fields
      const studentToCreate = {
        ...studentData,
        name: `${studentData.firstName} ${studentData.lastName}`.trim(),
        owner_id: uid,
        ownerId: uid,
        school_id: studentData.schoolId || null,
        schoolId: studentData.schoolId || null,
        class_id: studentData.classId || null,
        classId: studentData.classId || null,
        createdAt: now,
        updatedAt: now,
        created_at: now,
        updated_at: now
      };

      const docRef = await adminDb.collection('students').add(studentToCreate);
      
      // Auto-enroll if classId is provided
      if (studentData.classId) {
        const enrollment = {
          studentId: docRef.id,
          student_id: docRef.id,
          classId: studentData.classId,
          class_id: studentData.classId,
          enrolledAt: now,
          enrolled_at: now,
          owner_id: uid,
          ownerId: uid
        };
        // Use class_students as it is the standard in the view pages
        await adminDb.collection('class_students').add(enrollment);
      }

      return message(form, '¡Estudiante creado con éxito!');
    } catch (err: any) {
      console.error('❌ Error creating student:', err);
      return message(form, err.message || 'Error desconocido al crear el estudiante', { status: 500 });
    }
  }
};
