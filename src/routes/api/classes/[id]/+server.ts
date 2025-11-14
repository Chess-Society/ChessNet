import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, params, cookies }) => {
  console.log('✏️ API Classes - Updating class...');
  
  try {
    const { id } = params;
    const body = await request.json();
    const { name, college_id } = body;
    
    if (!id) {
      return json({ error: 'Class ID is required' }, { status: 400 });
    }

    // Create Supabase client
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, { ...options, path: '/' }),
        remove: (key, options) => cookies.delete(key, { ...options, path: '/' })
      }
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('❌ API Classes PUT - User not authenticated:', userError);
      return json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Verificar que la clase pertenece al usuario
    const { data: existingClass, error: fetchError } = await supabase
      .from('classes')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingClass) {
      console.error('❌ API Classes PUT - Class not found or not owned by user:', fetchError);
      return json({ error: 'Class not found or not authorized' }, { status: 404 });
    }

    // Update class with available fields only
    const updateData: { [key: string]: any } = { updated_at: new Date().toISOString() };
    if (name !== undefined) updateData.name = name?.trim() || null;
    if (college_id !== undefined) updateData.college_id = college_id?.trim() || null;

    const { data, error } = await supabase
      .from('classes')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ API Classes PUT - Database error:', error);
      return json({ error: error.message }, { status: 500 });
    }

    console.log('✅ API Classes PUT - Class updated successfully:', data.id);
    return json({ success: true, class: data, message: 'Class updated successfully' });
  } catch (error: any) {
    console.error('❌ API Classes PUT - Error:', error.message);
    return json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
};

export const PATCH: RequestHandler = async ({ request, params, cookies }) => {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return json({ error: 'Class ID is required' }, { status: 400 });
    }

    // Create Supabase client
    const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get: (key) => cookies.get(key),
        set: (key, value, options) => cookies.set(key, value, { ...options, path: '/' }),
        remove: (key, options) => cookies.delete(key, { ...options, path: '/' })
      }
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update class
    const { data, error } = await supabase
      .from('classes')
      .update({
        active: body.active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating class:', error);
      return json({ error: 'Failed to update class' }, { status: 500 });
    }

    return json({ success: true, data });
  } catch (error) {
    console.error('❌ Error in PATCH /api/classes/[id]:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
