// @ts-nocheck
import type { PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, url, params, cookies }: Parameters<PageServerLoad>[0]) => {
  console.log('✏️ Edit school page server load - User:', locals.user?.email || 'none');
  console.log('✏️ School ID:', params.schoolId);
  
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Edit school page - Providing mock data');
    
    const schoolId = params.schoolId;
    
    // Mock de centros existentes
    const mockSchools = [
      {
        id: 'mock-school-1',
        user_id: 'dev-user-123',
        name: 'Escuela de Ajedrez Madrid Centro',
        city: 'Madrid',
        address: 'Calle Gran Vía, 28',
        postal_code: '28013',
        phone: '+34 91 123 4567',
        email: 'info@ajedrezmadrid.es',
        website: 'https://ajedrezmadrid.es',
        description: 'Escuela de ajedrez especializada en la enseñanza infantil y juvenil. Con más de 15 años de experiencia formando jóvenes ajedrecistas en el centro de Madrid.',
        director_name: 'Carlos Mendoza García',
        director_phone: '+34 666 123 456',
        director_email: 'carlos.mendoza@ajedrezmadrid.es',
        opening_hours: 'Lunes a Viernes: 16:00-21:00, Sábados: 10:00-14:00',
        facilities: 'Aulas climatizadas, tableros digitales, biblioteca de ajedrez, cafetería',
        max_capacity: 120,
        established_year: 2008,
        license_number: 'CAM-AJ-2008-001',
        insurance_company: 'Mapfre Seguros',
        insurance_policy: 'POL-123456789',
        emergency_contact: 'Servicios de Emergencia Madrid: 112',
        parking_available: true,
        wheelchair_accessible: true,
        public_transport: 'Metro: Gran Vía (L1, L5), Autobuses: 1, 2, 46, 74',
        social_media: {
          facebook: 'https://facebook.com/ajedrezmadrid',
          instagram: '@ajedrezmadrid',
          twitter: '@chess_madrid'
        },
        active: true,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'mock-school-2',
        user_id: 'dev-user-123',
        name: 'Club Ajedrez Infantil Retiro',
        city: 'Madrid',
        address: 'Parque del Retiro, s/n',
        postal_code: '28009',
        phone: '+34 91 987 6543',
        email: 'retiro@ajedrezinfantil.es',
        website: 'https://ajedrezretiro.es',
        description: 'Club de ajedrez ubicado en el emblemático Parque del Retiro, enfocado en la formación de niños y jóvenes en un ambiente natural y relajado.',
        director_name: 'Ana Rodríguez López',
        director_phone: '+34 666 987 654',
        director_email: 'ana.rodriguez@ajedrezretiro.es',
        opening_hours: 'Martes a Domingo: 10:00-18:00',
        facilities: 'Aulas al aire libre, zona de juegos, merendero',
        max_capacity: 60,
        established_year: 2015,
        license_number: 'CAM-AJ-2015-007',
        insurance_company: 'Allianz Seguros',
        insurance_policy: 'POL-987654321',
        emergency_contact: 'Guardia del Parque: +34 91 574 0001',
        parking_available: false,
        wheelchair_accessible: false,
        public_transport: 'Metro: Retiro (L2), Ibiza (L9), Autobuses: 15, 20, 26',
        social_media: {
          facebook: 'https://facebook.com/ajedrezretiro',
          instagram: '@retiro_chess',
          twitter: ''
        },
        active: true,
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Encontrar el centro a editar
    const currentSchool = mockSchools.find(s => s.id === schoolId);
    if (!currentSchool) {
      throw new Error('School not found');
    }

    // Países disponibles
    const countries = [
      { code: 'ES', name: 'España' },
      { code: 'FR', name: 'Francia' },
      { code: 'PT', name: 'Portugal' },
      { code: 'IT', name: 'Italia' },
      { code: 'DE', name: 'Alemania' },
      { code: 'UK', name: 'Reino Unido' },
      { code: 'US', name: 'Estados Unidos' },
      { code: 'MX', name: 'México' },
      { code: 'AR', name: 'Argentina' },
      { code: 'CL', name: 'Chile' },
      { code: 'CO', name: 'Colombia' },
      { code: 'PE', name: 'Perú' }
    ];

    // Compañías de seguros comunes
    const insuranceCompanies = [
      'Mapfre Seguros',
      'Allianz Seguros',
      'AXA Seguros',
      'Zurich Seguros',
      'Generali Seguros',
      'Santalucía Seguros',
      'DKV Seguros',
      'Pelayo Seguros',
      'Línea Directa',
      'Mutua Madrileña'
    ];

    return {
      user: locals.user,
      school: currentSchool,
      countries,
      insuranceCompanies
    };
  }
  
  // ===== LÓGICA PARA PRODUCCIÓN =====
  console.log('🌐 PRODUCTION MODE: Edit school page - Fetching from Supabase');
  
  if (!locals.user) {
    throw error(401, 'Usuario no autenticado');
  }

  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, options),
      remove: (key, options) => cookies.delete(key, options),
    },
  });

  try {
    // Obtener el colegio específico
    const { data: school, error: schoolError } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', params.schoolId)
      .eq('user_id', locals.user.id)
      .single();

    if (schoolError) {
      console.error('❌ Error fetching school for edit:', schoolError);
      throw error(404, 'Centro no encontrado');
    }

    if (!school) {
      throw error(404, 'Centro no encontrado');
    }

    // Países disponibles
    const countries = [
      { code: 'ES', name: 'España' },
      { code: 'FR', name: 'Francia' },
      { code: 'PT', name: 'Portugal' },
      { code: 'IT', name: 'Italia' },
      { code: 'DE', name: 'Alemania' },
      { code: 'UK', name: 'Reino Unido' },
      { code: 'US', name: 'Estados Unidos' },
      { code: 'MX', name: 'México' },
      { code: 'AR', name: 'Argentina' },
      { code: 'CL', name: 'Chile' },
      { code: 'CO', name: 'Colombia' },
      { code: 'PE', name: 'Perú' }
    ];

    // Compañías de seguros comunes
    const insuranceCompanies = [
      'Mapfre Seguros',
      'Allianz Seguros',
      'AXA Seguros',
      'Zurich Seguros',
      'Generali Seguros',
      'Santalucía Seguros',
      'DKV Seguros',
      'Pelayo Seguros',
      'Línea Directa',
      'Mutua Madrileña'
    ];

    return {
      user: locals.user,
      school,
      countries,
      insuranceCompanies
    };

  } catch (err: any) {
    console.error('❌ Error in edit school page:', err);
    if (err.status) {
      throw err; // Re-throw SvelteKit errors
    }
    throw error(500, 'Error interno del servidor');
  }
};
