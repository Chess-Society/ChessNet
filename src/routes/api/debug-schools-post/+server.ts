import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
  try {
    console.log('🔍 Debug Schools POST - Starting...');
    
    // Verificar locals.user
    console.log('🔍 Debug Schools POST - locals.user:', locals.user);
    
    // Verificar cookies
    const allCookies = cookies.getAll();
    const supabaseCookies = allCookies.filter(c => c.name.includes('supabase'));
    console.log('🔍 Debug Schools POST - Cookies:', {
      total: allCookies.length,
      supabase: supabaseCookies.length,
      names: supabaseCookies.map(c => c.name)
    });
    
    // Verificar body de la request
    const body = await request.json();
    console.log('🔍 Debug Schools POST - Request body:', body);
    
    return json({
      success: true,
      debug: {
        hasUser: !!locals.user,
        userEmail: locals.user?.email || null,
        userId: locals.user?.id || null,
        cookies: {
          total: allCookies.length,
          supabase: supabaseCookies.length,
          names: supabaseCookies.map(c => c.name)
        },
        requestBody: body
      }
    });

  } catch (error: any) {
    console.error('❌ Debug Schools POST - Error:', error);
    return json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
};
