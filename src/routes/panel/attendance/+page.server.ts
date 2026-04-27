import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { attendanceSchema } from '$lib/schemas/attendance';
import { adminDb, ownerFilter } from '$lib/server/firebase-admin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) throw redirect(303, '/login');
  const sessionUser = locals.user;

  const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
  const classId = url.searchParams.get('classId');

  // Load students and classes for the teacher using ownerFilter
  const [studentsSnap, classesSnap, attendanceSnap] = await Promise.all([
    adminDb.collection('students').where(ownerFilter(sessionUser.uid)).get(),
    adminDb.collection('classes').where(ownerFilter(sessionUser.uid)).get(),
    adminDb.collection('attendance').where(ownerFilter(sessionUser.uid)).get()
  ]);

  const students = studentsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  const classes = classesSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  const allAttendance = attendanceSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  
  const currentAttendance = allAttendance.filter((a: any) => 
    a.classId === classId && a.date === date
  );

  // Initialize form with existing records or defaults
  const initialRecords = classId ? students
    .filter((s: any) => s.classId === classId)
    .map((s: any) => {
      const existing = currentAttendance.find((r: any) => r.studentId === s.id);
      return {
        studentId: s.id,
        status: existing ? existing.status : 'unmarked'
      };
    }) : [];

  const form = await superValidate(
    { classId: classId || '', date, records: initialRecords },
    zod(attendanceSchema as any)
  );

  return {
    form,
    students,
    classes,
    allAttendance,
    selectedDate: date,
    selectedClassId: classId
  };
};

export const actions: Actions = {
  update: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const sessionUser = locals.user;

    const form = await superValidate(request, zod(attendanceSchema as any));
    if (!form.valid) return message(form, 'Revisa los errores de asistencia', { status: 400 });

    const { classId, date, records } = form.data as any;
    const batch = adminDb.batch();

    for (const record of records) {
      if (record.status === 'unmarked') continue;

      const attendanceId = `${record.studentId}_${classId}_${date}`;
      const docRef = adminDb.collection('attendance').doc(attendanceId);
      
      batch.set(docRef, {
        id: attendanceId,
        studentId: record.studentId,
        classId,
        date,
        status: record.status,
        owner_id: sessionUser.uid,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }


    await batch.commit();

    return message(form, 'Protocolo de asistencia sincronizado con éxito');
  }
};
