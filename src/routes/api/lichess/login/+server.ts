import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env as privateEnv } from '$env/dynamic/private';

function base64URLEncode(buffer: ArrayBuffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

async function sha256(plain: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return hash;
}

export const GET: RequestHandler = async ({ url, cookies }) => {
    // 1. Recibir a qué estudiante vamos a vincular
    const studentId = url.searchParams.get('studentId');
    const returnUrl = url.searchParams.get('returnUrl') || '/panel/students'; // A dónde volver después

    if (!studentId) {
        return new Response('Missing studentId', { status: 400 });
    }

    // 2. Generar PKCE Code Verifier
    const array = new Uint32Array(56 / 2);
    crypto.getRandomValues(array);
    const codeVerifier = Array.from(array, dec => ('0' + dec.toString(16)).substring(-2)).join('') || 'fallbacks-if-something-fails-random-string1234567890';
    // Better random verifier:
    const verifierBytes = new Uint8Array(32);
    crypto.getRandomValues(verifierBytes);
    const verifierUrlSafe = base64URLEncode(verifierBytes.buffer);

    // 3. Guardar contexto y verifier en cookies seguras (maximo 10 mins para hacer el login)
    cookies.set('lichess_code_verifier', verifierUrlSafe, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 600 
    });
    
    cookies.set('lichess_student_id', studentId, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 600
    });

    cookies.set('lichess_return_url', returnUrl, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 600
    });

    // 4. Generar Code Challenge para Lichess
    const hashed = await sha256(verifierUrlSafe);
    const codeChallenge = base64URLEncode(hashed);

    // 5. Preparar URL de Autorización en Lichess
    const redirectUri = `${url.origin}/api/lichess/callback`;
    const clientId = privateEnv.LICHESS_CLIENT_ID || 'chessnet-academias-local';
    
    // Pedimos leer email (por seguridad visual), puzzles, equipos y torneos
    const scope = 'email:read puzzle:read team:write tournament:write';
    
    const lichessAuthUrl = new URL('https://lichess.org/oauth');
    lichessAuthUrl.searchParams.set('response_type', 'code');
    lichessAuthUrl.searchParams.set('client_id', clientId);
    lichessAuthUrl.searchParams.set('redirect_uri', redirectUri);
    lichessAuthUrl.searchParams.set('scope', scope);
    lichessAuthUrl.searchParams.set('code_challenge_method', 'S256');
    lichessAuthUrl.searchParams.set('code_challenge', codeChallenge);

    throw redirect(302, lichessAuthUrl.toString());
};
