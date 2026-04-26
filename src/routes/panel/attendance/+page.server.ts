import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { attendanceSchema } from '$lib/schemas/attendance';
import { adminDb } from '$lib/server/firebase-admin';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = await locals.auth();
  if (!session?.user) throw redirect(303, '/auth/login');

  const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
  const classId = url.searchParams.get('classId');

  // Load students and classes for the teacher
  const [studentsSnap, classesSnap, attendanceSnap] = await Promise.all([
    adminDb.collection('students').where('teacherId', '==', session.user.id).get(),
    adminDb.collection('classes').where('teacherId', '==', session.user.id).get(),
    adminDb.collection('attendance').where('owner_id', '==', session.user.id).get()
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
    const session = await locals.auth();
    if (!session?.user) return fail(401);

    const form = await superValidate(request, zod(attendanceSchema as any));
    if (!form.valid) return fail(400, { form });

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
        owner_id: session.user.id,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    // Reward teacher for taking attendance (consistent with legacy logic)
    // We add a transaction record for the teacher
    const netsRef = adminDb.collection('nets_transactions').doc();
    batch.set(netsRef, {
      userId: session.user.id,
      amount: 10,
      type: 'EARN',
      reason: `Asistencia: ${date} (${classId})`,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    await batch.commit();

    return { form };
  }
};
