import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { classesApi } from '$lib/api/classes';

// ===== ALMACÉN TEMPORAL PARA DESARROLLO LOCAL =====
let localClasses: any[] = [
  {
    id: 'mock-class-1',
    user_id: 'dev-user-123',
    school_id: 'mock-school-1',
    name: 'Principiantes Mañana',
    description: 'Clase para estudiantes que están empezando con el ajedrez',
    schedule: 'Lunes y Miércoles 10:00-11:30',
    max_students: 12,
    level: 'beginner',
    active: true,
    room: 'Aula 1',
    instructor_notes: 'Enfoque en reglas básicas y movimientos fundamentales',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const GET: RequestHandler = async ({ cookies, url }) => {
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: API /api/classes GET - Returning mock data for localhost');
    
    return json({ classes: localClasses });
  }
  
  // ===== LÓGICA NORMAL PARA PRODUCCIÓN =====
  try {
    const classes = await classesApi.getMyClasses();
    return json({ classes: classes || [] });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return json({ error: 'Error al obtener las clases' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request, cookies, url }) => {
  console.log('🗑️ API Classes - Deleting class...');
  
  try {
    const body = await request.json();
    const { id } = body;
    
    if (!id) {
      return json({ error: 'Class ID is required' }, { status: 400 });
    }

    // ===== BYPASS PARA DESARROLLO LOCAL =====
    const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    
    if (isLocalDev) {
      console.log('🔧 DEV MODE: API /api/classes DELETE - Deleting from local storage');
      
      // Eliminar de localClasses
      const initialLength = localClasses.length;
      localClasses = localClasses.filter(c => c.id !== id);
      
      if (localClasses.length === initialLength) {
        return json({ error: 'Class not found' }, { status: 404 });
      }
      
      console.log('✅ DEV MODE: Class deleted from local storage');
      return json({ success: true, message: 'Class deleted successfully' });
    }
    
    // ===== LÓGICA NORMAL PARA PRODUCCIÓN =====
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options),
      },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('❌ API /api/classes DELETE - User not authenticated:', userError?.message);
      return json({ error: 'User not authenticated' }, { status: 401 });
    }

    try {
      // Verificar que la clase pertenece al usuario
      const { data: classData, error: fetchError } = await supabase
        .from('classes')
        .select('id, user_id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !classData) {
        console.error('❌ Class not found or access denied:', fetchError);
        return json({ error: 'Class not found or access denied' }, { status: 404 });
      }

      // Eliminar la clase
      const { error: deleteError } = await supabase
        .from('classes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('❌ Error deleting class:', deleteError);
        return json({ error: 'Failed to delete class' }, { status: 500 });
      }

      console.log('✅ API /api/classes DELETE - Class deleted successfully');
      return json({ success: true, message: 'Class deleted successfully' });

    } catch (error: any) {
      console.error('❌ API /api/classes DELETE - Error:', error.message);
      return json({ error: error.message }, { status: 500 });
    }
  } catch (error: any) {
    console.error('❌ API /api/classes DELETE - Request error:', error.message);
    return json({ error: 'Invalid request' }, { status: 400 });
  }
};

export const POST: RequestHandler = async ({ request, cookies, url }) => {
  console.log('🎓 API Classes - Creating new class...');
  
  try {
    const body = await request.json();
    const { name, description, college_id, schedule, max_students, level, active, settings } = body;
    
    console.log('🎓 API Classes - Request data:', { name, college_id, level });
    
    // Validaciones opcionales - solo validar formato si se proporciona
    if (max_students && (max_students < 1 || max_students > 100)) {
      return json({ error: 'El número máximo de estudiantes debe estar entre 1 y 100' }, { status: 400 });
    }


    // ===== LÓGICA NORMAL PARA PRODUCCIÓN =====
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options),
      },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('❌ API /api/classes POST - User not authenticated:', userError?.message);
      return json({ error: 'User not authenticated' }, { status: 401 });
    }

    try {
      const { data: classData, error: insertError } = await supabase
        .from('classes')
        .insert({
          user_id: user.id,
          name: name?.trim() || 'Clase sin nombre',
          college_id: college_id?.trim() || null
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creating class:', insertError);
        return json({ error: 'Error al crear la clase: ' + insertError.message }, { status: 500 });
      }

      console.log('✅ Class created successfully:', classData.name);
      return json({ class: classData });
    } catch (error: any) {
      console.error('❌ API /api/classes POST - Error:', error.message);
      return json({ error: 'Error al crear la clase: ' + error.message }, { status: 500 });
    }

  } catch (error) {
    console.error('Unexpected error in classes POST:', error);
    return json({ error: 'Error interno del servidor' }, { status: 500 });
  }
};
