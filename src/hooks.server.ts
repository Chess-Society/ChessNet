import { authenticate } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import { ADMIN_EMAILS } from '$lib/constants';
import { json } from '@sveltejs/kit';

// Cache de mantenimiento en memoria — evita consultar Firestore en cada request SSR
const MAINTENANCE_CACHE_TTL_MS = 60_000; // 60 segundos
let maintenanceCacheValue: boolean = false;
let maintenanceCacheExpiry: number = 0;

export const handle: Handle = async ({ event, resolve }) => {
    // 1. Poblar event.locals con la información del usuario desde la cookie __session
    await authenticate(event);
    
    // 2. Comprobar Modo Mantenimiento (Excepto para rutas de Assets y API de Admin/Auth)
    const isAsset = event.url.pathname.startsWith('/_app') || 
                    event.url.pathname.startsWith('/favicon') || 
                    event.url.pathname.includes('.');
    const isAdminRoute = event.url.pathname.startsWith('/admin');
    const isAuthRoute = event.url.pathname.startsWith('/login') || event.url.pathname.startsWith('/auth');
    
    const isDev = process.env.NODE_ENV === 'development';
    
    if (!isAsset && !isAdminRoute && !isAuthRoute && !isDev) {
        try {
            const now = Date.now();
            let isMaintenance: boolean;



            // Usar caché si aún es válido
            if (now < maintenanceCacheExpiry) {
                isMaintenance = maintenanceCacheValue;
            } else {
                // Refrescar caché desde Firestore con Timeout para evitar bloqueos
                const configRef = adminDb.collection("system").doc("config");
                const configSnap = await Promise.race([
                    configRef.get(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 2500))
                ]) as any;
                
                isMaintenance = configSnap.exists && configSnap.data()?.maintenanceMode === true;
                maintenanceCacheValue = isMaintenance;
                maintenanceCacheExpiry = now + MAINTENANCE_CACHE_TTL_MS;
            }
            
            if (isMaintenance) {
                if (!event.locals.isAdmin) {
                    // Si es una petición de datos (fetch), devolvemos error 503
                    if (event.request.headers.get('accept')?.includes('application/json')) {
                        return json({ error: 'Sistema en mantenimiento' }, { status: 503 });
                    }
                    
                    // Si es navegación, devolver página de mantenimiento
                    return new Response(`
                        <!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>ChessNet | Mantenimiento</title>
                            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
                            <style>
                                :root { --primary: #7c3aed; --bg: #09090b; }
                                body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; background: var(--bg); color: white; display: flex; align-items: center; justify-content: center; height: 100vh; overflow: hidden; }
                                .bg-mesh { position: fixed; inset: 0; z-index: -1; opacity: 0.15; pointer-events: none; background: 
                                    radial-gradient(circle at 0% 0%, var(--primary) 0%, transparent 50%),
                                    radial-gradient(circle at 100% 100%, #4f46e5 0%, transparent 50%);
                                }
                                .container { max-width: 600px; text-align: center; padding: 40px; }
                                .logo-box { position: relative; display: inline-block; padding: 25px; background: #18181b; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; margin-bottom: 40px; transform: rotate(3deg); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
                                h1 { font-family: 'Outfit', sans-serif; font-size: 3.5rem; letter-spacing: -0.05em; margin: 0; text-transform: uppercase; font-style: italic; }
                                .text-primary { color: var(--primary); }
                                p { color: #a1a1aa; font-size: 1.1rem; line-height: 1.6; max-width: 400px; margin: 20px auto 40px; }
                                .status-bar { display: grid; grid-template-cols: 1fr 1fr; gap: 15px; max-width: 320px; margin: 0 auto; }
                                .status-card { padding: 15px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; text-align: center; }
                                .label { display: block; font-size: 0.65rem; font-weight: 900; color: #52525b; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 4px; }
                                .value { font-size: 0.85rem; font-weight: 700; color: white; }
                                .pulse { color: var(--primary); }
                                .bottom-tag { margin-top: 60px; font-size: 0.65rem; font-weight: 800; color: #3f3f46; text-transform: uppercase; letter-spacing: 0.4em; display: flex; align-items: center; justify-content: center; gap: 10px; }
                                .dot { width: 6px; height: 6px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 10px var(--primary); animation: pulse 2s infinite; }
                                @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
                            </style>
                        </head>
                        <body>
                            <div class="bg-mesh"></div>
                            <div class="container">
                                <div class="logo-box">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary)"><path d="M14.5 9.5 22 2v20l-7.5-7.5L7 22V2l7.5 7.5Z"/></svg>
                                </div>
                                <h1>MEJORANDO <span class="text-primary">CHESSNET</span></h1>
                                <p>Estamos optimizando los motores del sistema para ofrecerte una experiencia más fluida y precisa.</p>
                                <div class="status-bar">
                                    <div class="status-card"><span class="label">ESTADO</span><span class="value pulse">ACTUALIZANDO</span></div>
                                    <div class="status-card"><span class="label">REGRESO</span><span class="value">MUY PRONTO</span></div>
                                </div>
                                <div class="bottom-tag">
                                    <div class="dot"></div>
                                    INTELLIGENCE SYSTEM ONLINE
                                </div>
                            </div>
                        </body>
                        </html>
                    `, {
                        headers: { 'Content-Type': 'text/html' },
                        status: 503
                    });
                }
            }
        } catch (error) {
            console.error('Error checking maintenance mode:', error);
            // Si falla la base de datos (ej: sin inicializar), permitimos la carga de la web
            // para que no sea un fallo crítico si no hay config.
        }
    }

    // Continuar con la petición
    const response = await resolve(event);
    return response;
};

