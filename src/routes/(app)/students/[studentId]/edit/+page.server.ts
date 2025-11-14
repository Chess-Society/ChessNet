import type { PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url, params, cookies }) => {
  console.log('✏️ Edit student page server load - User:', locals.user?.email || 'none');
  console.log('✏️ Student ID:', params.studentId);
  
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
    // Obtener el estudiante específico
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', params.studentId)
      .eq('user_id', locals.user.id)
      .single();

    if (studentError) {
      console.error('❌ Error fetching student for edit:', studentError);
      throw error(404, 'Estudiante no encontrado');
    }

    if (!student) {
      throw error(404, 'Estudiante no encontrado');
    }

    // Obtener centros disponibles
    const { data: schools, error: schoolsError } = await supabase
      .from('colleges')
      .select('id, name, city')
      .eq('user_id', locals.user.id);

    if (schoolsError) {
      console.error('❌ Error fetching schools:', schoolsError);
      // Continuar con array vacío si hay error
    }

    return {
      user: locals.user,
      student,
      schools: schools || []
    };

  } catch (err: any) {
    console.error('❌ Error in edit student page:', err);
    if (err.status) {
      throw err; // Re-throw SvelteKit errors
    }
    throw error(500, 'Error interno del servidor');
  }
};