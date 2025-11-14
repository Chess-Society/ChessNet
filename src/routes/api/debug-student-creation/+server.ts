import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  console.log('🔍 DEBUG: Student Creation Test');
  
  try {
    const body = await request.json();
    console.log('📝 Request body:', body);
    
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options),
      },
    });

    // Verificar autenticación
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log('👤 User auth result:', { user: user?.id, error: userError?.message });

    if (userError || !user) {
      return json({ 
        error: 'Usuario no autenticado', 
        details: userError?.message,
        step: 'authentication'
      }, { status: 401 });
    }

    // Verificar estructura de la tabla students
    const { data: tableInfo, error: tableError } = await supabase
      .from('students')
      .select('*')
      .limit(0);
    
    console.log('📊 Table structure check:', { tableError: tableError?.message });

    // Intentar crear el estudiante con datos mínimos
    const testData = {
      user_id: user.id,
      name: `${body.first_name || 'Test'} ${body.last_name || 'Student'}`,
      first_name: body.first_name || 'Test',
      last_name: body.last_name || 'Student',
      parent_email: body.email || null,
      parent_phone: body.phone || null,
      notes: body.notes || null
    };

    console.log('📝 Test data to insert:', testData);

    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert(testData)
      .select()
      .single();

    if (studentError) {
      console.error('❌ Student creation error:', studentError);
      return json({ 
        error: 'Error al crear el estudiante', 
        details: studentError.message,
        code: studentError.code,
        hint: studentError.hint,
        step: 'insert'
      }, { status: 500 });
    }

    console.log('✅ Student created successfully:', student.id);
    return json({ 
      success: true, 
      student,
      step: 'success'
    });

  } catch (error: any) {
    console.error('❌ Debug error:', error);
    return json({ 
      error: 'Error en debug', 
      details: error.message,
      step: 'catch'
    }, { status: 500 });
  }
};
