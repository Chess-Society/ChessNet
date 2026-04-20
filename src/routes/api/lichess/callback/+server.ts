import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb } from '$lib/firebase-admin';
import { env as privateEnv } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ url, cookies }) => {
    const errorParam = url.searchParams.get('error');
    const returnUrl = cookies.get('lichess_return_url') || '/panel/students';

    if (errorParam) {
        console.error('Lichess Auth Error:', errorParam);
        // Si el usuario cancela, volvemos a donde estábamos
        throw redirect(302, `${returnUrl}?error=lichess_auth_cancelled`);
    }

    const code = url.searchParams.get('code');
    const codeVerifier = cookies.get('lichess_code_verifier');
    const studentId = cookies.get('lichess_student_id');

    if (!code || !codeVerifier || !studentId) {
        console.error('Missing code, verifier or studentId');
        throw redirect(302, `${returnUrl}?error=missing_auth_params`);
    }

    const clientId = privateEnv.LICHESS_CLIENT_ID || 'chessnet-academias-local';
    const redirectUri = `${url.origin}/api/lichess/callback`;

    try {
        // 1. Obtener el Access Token canjeando el código
        const tokenResponse = await fetch('https://lichess.org/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                code_verifier: codeVerifier,
                redirect_uri: redirectUri,
                client_id: clientId,
            })
        });

        if (!tokenResponse.ok) {
            const errBody = await tokenResponse.text();
            console.error('Failed to exchange token:', errBody);
            throw new Error('Failed to exchange Lichess token');
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 2. Obtener el perfil del usuario de Lichess asociado a ese token
        const profileResponse = await fetch('https://lichess.org/api/account', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!profileResponse.ok) {
            throw new Error('Failed to fetch Lichess profile');
        }

        const profileData = await profileResponse.json();
        const lichessUsername = profileData.username;

        // 3. Guardar el token y el username en el estudiante correspondiente de Firebase
        // Actualizamos en modo admin (ya que esto ocurre en el servidor)
        console.log(`Vincular cuenta Lichess (${lichessUsername}) al estudiante: ${studentId}`);
        
        await adminDb.collection('students').doc(studentId).update({
            lichess_username: lichessUsername,
            lichess_access_token: accessToken,
            updated_at: new Date().toISOString()
        });

        // Limpiar cookies por seguridad
        cookies.delete('lichess_code_verifier', { path: '/' });
        cookies.delete('lichess_student_id', { path: '/' });
        cookies.delete('lichess_return_url', { path: '/' });

        // Redirigir de vuelta al panel mostrando mensaje de éxito
        throw redirect(302, `${returnUrl}?success=lichess_linked`);

    } catch (err) {
        console.error('Error during Lichess Callback:', err);
        throw redirect(302, `${returnUrl}?error=lichess_auth_failed`);
    }
};
