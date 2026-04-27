import { authenticate } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import { json } from '@sveltejs/kit';

// Maintenance cache to avoid frequent Firestore queries
const MAINTENANCE_CACHE_TTL_MS = 5_000;
let maintenanceCacheValue: boolean = false;
let maintenanceCacheExpiry: number = 0;

export const handle: Handle = async ({ event, resolve }) => {
    // 1. Populate event.locals with user info
    await authenticate(event);
    
    // 2. Check Maintenance Mode (Except for Assets and Auth routes)
    const isAsset = event.url.pathname.startsWith('/_app') || 
                    event.url.pathname.startsWith('/favicon') || 
                    event.url.pathname.includes('.');
    const isAdminRoute = event.url.pathname.startsWith('/admin');
    const isAuthRoute = event.url.pathname.startsWith('/login') || event.url.pathname.startsWith('/auth');
    
    if (!isAsset && !isAdminRoute && !isAuthRoute) {
        try {
            const now = Date.now();
            let isMaintenance: boolean;

            if (now < maintenanceCacheExpiry) {
                isMaintenance = maintenanceCacheValue;
            } else {
                const configRef = adminDb.collection("system").doc("config");
                const configSnap = await Promise.race([
                    configRef.get(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 2500))
                ]) as any;
                
                isMaintenance = configSnap.exists && configSnap.data()?.maintenanceMode === true;
                maintenanceCacheValue = isMaintenance;
                maintenanceCacheExpiry = now + MAINTENANCE_CACHE_TTL_MS;
            }
            
            if (isMaintenance && !event.locals.isAdmin) {
                if (event.request.headers.get('accept')?.includes('application/json')) {
                    return json({ error: 'Sistema en mantenimiento' }, { status: 503 });
                }
                
                return new Response(`
                    <!DOCTYPE html>
                    <html lang="es">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>ChessNet | En Mantenimiento</title>
                        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@800;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
                        <style>
                            :root {
                                --primary: #c084fc;
                                --primary-glow: rgba(192, 132, 252, 0.4);
                                --bg: #03060b;
                                --card-bg: rgba(255, 255, 255, 0.03);
                                --border: rgba(255, 255, 255, 0.08);
                            }
                            * { margin: 0; padding: 0; box-sizing: border-box; }
                            body { 
                                background: var(--bg); 
                                color: white; 
                                height: 100vh; 
                                font-family: 'Inter', sans-serif;
                                display: flex; align-items: center; justify-content: center; 
                                overflow: hidden;
                            }
                            .mesh-bg {
                                position: fixed; inset: 0; z-index: -1;
                                background: 
                                    radial-gradient(circle at 10% 10%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
                                    radial-gradient(circle at 90% 90%, rgba(79, 70, 229, 0.1) 0%, transparent 40%),
                                    radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 60%);
                            }
                            .glass-card {
                                width: 90%; max-width: 480px;
                                background: var(--card-bg);
                                border: 1px solid var(--border);
                                backdrop-filter: blur(40px);
                                border-radius: 48px;
                                padding: 60px 40px;
                                text-align: center;
                                box-shadow: 0 40px 100px -20px rgba(0,0,0,0.6);
                                animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                            }
                            .logo-section { margin-bottom: 40px; }
                            .icon-box {
                                width: 80px; height: 80px;
                                background: rgba(192, 132, 252, 0.1);
                                border: 1px solid rgba(192, 132, 252, 0.2);
                                border-radius: 24px;
                                display: flex; align-items: center; justify-content: center;
                                margin: 0 auto 20px;
                                color: var(--primary);
                                animation: float 6s infinite ease-in-out;
                            }
                            .brand {
                                font-family: 'Outfit', sans-serif;
                                font-size: 2.5rem; font-weight: 900; letter-spacing: -0.05em;
                                background: linear-gradient(to right, #fff, #c084fc);
                                -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                                text-transform: uppercase; font-style: italic;
                            }
                            h1 { 
                                font-family: 'Outfit', sans-serif;
                                font-size: 1.5rem; font-weight: 800; margin-bottom: 16px; 
                                text-transform: uppercase; tracking: -0.02em;
                            }
                            p { 
                                color: #94a3b8; font-size: 1rem; line-height: 1.6; 
                                margin-bottom: 40px; font-weight: 500;
                            }
                            .status-info {
                                background: rgba(0,0,0,0.4); border-radius: 24px; padding: 24px;
                                border: 1px solid var(--border);
                                display: flex; align-items: center; justify-content: space-around;
                                margin-bottom: 30px;
                            }
                            .status-item { display: flex; flex-direction: column; gap: 4px; }
                            .status-label { font-size: 0.7rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.1em; }
                            .status-value { font-size: 0.9rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px; }
                            .pulse-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 12px #10b981; animation: pulse 2s infinite; }
                            
                            .progress-container { width: 100%; height: 6px; background: rgba(255,255,255,0.03); border-radius: 10px; overflow: hidden; margin-top: 20px; }
                            .progress-fill { 
                                height: 100%; width: 70%; 
                                background: linear-gradient(90deg, #7c3aed, #c084fc);
                                border-radius: 10px; position: relative;
                                animation: fillAnim 3s infinite ease-in-out;
                            }
                            
                            @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
                            @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
                            @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                            @keyframes fillAnim { 0% { width: 60%; } 50% { width: 85%; } 100% { width: 60%; } }

                            @media (max-width: 480px) {
                                .glass-card { padding: 40px 24px; width: 85%; border-radius: 32px; }
                                .brand { font-size: 2rem; }
                                h1 { font-size: 1.2rem; }
                                p { font-size: 0.9rem; }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="mesh-bg"></div>
                        <div class="glass-card">
                            <div class="logo-section">
                                <div class="icon-box">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M12 2v10"/><path d="M18.4 4.6a9 9 0 1 1-12.8 0"/><path d="m12 12-4 10"/><path d="m12 12 4 10"/>
                                    </svg>
                                </div>
                                <div class="brand">ChessNet</div>
                            </div>
                            <h1>Actualizando ChessNet</h1>
                            <p>Estamos desplegando una evolución sistemática para elevar tu experiencia. Volveremos en unos instantes.</p>
                            
                            <div class="status-info">
                                <div class="status-item">
                                    <span class="status-label">Servidor</span>
                                    <span class="status-value"><div class="pulse-dot"></div> Activo</span>
                                </div>
                                <div class="status-item">
                                    <span class="status-label">Modo</span>
                                    <span class="status-value">Mantenimiento</span>
                                </div>
                            </div>

                            <div class="progress-container">
                                <div class="progress-fill"></div>
                            </div>
                            <div style="margin-top: 12px; font-size: 0.65rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.2em;">
                                Sincronizando datos
                            </div>
                        </div>
                    </body>
                    </html>
                `, {
                    headers: { 'Content-Type': 'text/html' },
                    status: 503
                });
            }
            
            if (isMaintenance) {
                const response = await resolve(event);
                response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                response.headers.set('Pragma', 'no-cache');
                response.headers.set('Expires', '0');
                return response;
            }
        } catch (error) {
            console.error('Error checking maintenance mode:', error);
        }
    }

    return await resolve(event);
};
