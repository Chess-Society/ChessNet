import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals, params }) => {
  const schoolId = params.schoolId;
  
  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  const uid = locals.user.uid;

  const countries = [
    { code: 'ES', name: 'España' },
    { code: 'FR', name: 'Francia' },
    { code: 'PT', name: 'Portugal' },
    { code: 'IT', name: 'Italia' }
  ];

  const insuranceCompanies = [
    'Mapfre Seguros',
    'Allianz Seguros',
    'AXA Seguros'
  ];
    try {
      // Obtener centro usando Admin SDK
      const schoolSnap = await adminDb.collection("schools").doc(schoolId).get();
    
    let schoolData: any;

    if (!schoolSnap.exists) {
        throw error(404, 'Centro no encontrado');
    } else {
      schoolData = { id: schoolSnap.id, ...schoolSnap.data() };
      
      if (schoolData.owner_id !== uid) {
        throw error(403, 'No tienes permiso para editar este centro');
      }
    }

    return { 
      user: locals.user, 
      school: serializeRecord(schoolData), 
      countries, 
      insuranceCompanies 
    };

  } catch (err: any) {
    console.error('❌ Error in edit school page:', err);
    if (err.status) throw err;
    throw error(500, 'Error al cargar los datos del centro');
  }
};
