import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals, params }) => {
  
  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  const uid = locals.user.uid;
  const classId = params.classId;

  const suggestedSchedules = {
    beginner: [
      'Lunes y Miércoles 10:00-11:00',
      'Martes y Jueves 16:00-17:00',
      'Viernes 17:00-18:00',
      'Sábados 10:00-11:30'
    ],
    intermediate: [
      'Lunes y Miércoles 17:00-18:30',
      'Martes y Jueves 17:00-18:30',
      'Viernes 18:00-19:30',
      'Sábados 11:30-13:00'
    ],
    advanced: [
      'Lunes y Miércoles 18:30-20:00',
      'Martes y Jueves 18:30-20:00',
      'Viernes 19:30-21:00',
      'Sábados 09:00-11:00'
    ],
    mixed: [
      'Miércoles 20:00-21:30',
      'Viernes 20:00-21:30',
      'Sábados 16:00-17:30',
      'Domingos 10:00-11:30'
    ]
  };

  const suggestedCapacities = {
    beginner: { min: 8, max: 15, recommended: 12 },
    intermediate: { min: 6, max: 12, recommended: 10 },
    advanced: { min: 4, max: 10, recommended: 8 },
    mixed: { min: 8, max: 20, recommended: 15 }
  };

  try {
    const [classSnap, schoolsSnap] = await Promise.all([
      adminDb.collection('classes').doc(classId).get(),
      adminDb.collection('schools').where('owner_id', '==', uid).orderBy('name', 'asc').get()
    ]);

    if (!classSnap.exists) {
      throw error(404, 'Clase no encontrada');
    }

    const classData = { id: classSnap.id, ...classSnap.data() } as any;
    if (classData.owner_id !== uid) {
      throw error(403, 'No tienes permiso para editar esta clase');
    }

    return {
      user: locals.user,
      class: serializeRecord(classData),
      schools: serializeRecord(schoolsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }))),
      suggestedSchedules,
      suggestedCapacities
    };

  } catch (err: any) {
    console.error('❌ Error in edit class page load:', err);
    if (err.status) throw err;
    throw error(500, 'Error al cargar los datos de la clase');
  }
};
