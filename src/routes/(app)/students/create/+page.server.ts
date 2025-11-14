import type { PageServerLoad } from './$types';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load: PageServerLoad = async ({ locals, url, cookies }) => {
  console.log('👥 Students create page server load - User:', locals.user?.email || 'none');
  
  if (!locals.user) {
    console.log('❌ No user found, redirecting to login');
    return {
      user: null,
      schools: []
    };
  }
  
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (name: string) => cookies.get(name),
      set: (name: string, value: string, options: any) => cookies.set(name, value, options),
      remove: (name: string, options: any) => cookies.delete(name, options)
    }
  });
  
  try {
    const { data: schools, error: schoolsError } = await supabase
      .from('colleges')
      .select('id, name, city')
      .eq('user_id', locals.user.id)
      .order('created_at', { ascending: false });
    
    if (schoolsError) {
      console.error('❌ Error fetching schools:', schoolsError);
      return {
        user: locals.user,
        schools: []
      };
    }
    
    console.log('✅ Schools loaded successfully:', schools?.length || 0);
    return {
      user: locals.user,
      schools: schools || []
    };
  } catch (err: any) {
    console.error('❌ Error in students create page load:', err);
    return {
      user: locals.user,
      schools: []
    };
  }
};
