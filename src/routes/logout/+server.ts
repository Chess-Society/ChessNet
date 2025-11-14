import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, locals, url }) => {
  console.log('🚪 Logout POST - Starting logout process');
  
  // ===== BYPASS PARA DESARROLLO LOCAL =====
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    console.log('🔧 DEV MODE: Local logout - Clearing session');
    
    // En modo local, solo limpiamos locals ya que no hay cookies reales de Supabase
    locals.user = null;
    
    console.log('✅ Local logout completed');
    return json({ success: true });
  }
  
  // ===== PRODUCCIÓN CON SUPABASE =====
  console.log('🌐 PROD MODE: Supabase logout - Clearing cookies and session');
  
  // Limpiar todas las cookies de Supabase
  const allCookies = cookies.getAll();
  const supabaseCookies = allCookies.filter(cookie => cookie.name.startsWith('sb-'));
  
  console.log('🚪 Logout - Clearing cookies:', supabaseCookies.map(c => c.name));
  
  // Eliminar cookies de Supabase
  supabaseCookies.forEach(cookie => {
    cookies.delete(cookie.name, { path: '/' });
  });
  
  // También limpiar cualquier cookie de sesión personalizada
  cookies.delete('session', { path: '/' });
  cookies.delete('auth-token', { path: '/' });
  
  // Limpiar locals
  locals.user = null;
  
  console.log('✅ Production logout completed');
  
  return json({ success: true });
};

// También manejamos GET para redirección directa
export const GET: RequestHandler = async ({ cookies, locals, url }) => {
  console.log('🚪 Logout GET - Direct logout redirect');
  
  const isLocalDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  
  if (isLocalDev) {
    locals.user = null;
  } else {
    // Limpiar cookies en producción
    const allCookies = cookies.getAll();
    const supabaseCookies = allCookies.filter(cookie => cookie.name.startsWith('sb-'));
    
    supabaseCookies.forEach(cookie => {
      cookies.delete(cookie.name, { path: '/' });
    });
    
    cookies.delete('session', { path: '/' });
    cookies.delete('auth-token', { path: '/' });
    locals.user = null;
  }
  
  console.log('✅ Logout redirect completed');
  
  // Redirigir a login
  throw redirect(302, '/login');
};
