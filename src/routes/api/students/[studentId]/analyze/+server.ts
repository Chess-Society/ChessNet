import { json, error } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import { getUserPlan } from '$lib/server/plans';
import { askDeepSeek } from '$lib/server/deepseek';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    const plan = await getUserPlan(locals.user.uid);
    if (plan !== 'premium' && !locals.isAdmin) {
        throw error(403, 'Premium plan required for AI analysis');
    }

    const { studentId } = params;

    try {
        const studentDoc = await adminDb.collection('students').doc(studentId).get();
        if (!studentDoc.exists) {
            throw error(404, 'Student not found');
        }

        const studentData = studentDoc.data();
        if (!studentData?.lichessUsername) {
            return json({ error: 'No Lichess username provided for this student' }, { status: 400 });
        }

        // Fetch Lichess data server-side
        const [userRes, historyRes] = await Promise.all([
            fetch(`https://lichess.org/api/user/${studentData.lichessUsername}`),
            fetch(`https://lichess.org/api/user/${studentData.lichessUsername}/rating-history`)
        ]);

        let lichessInfo = {};
        if (userRes.ok) {
            lichessInfo = await userRes.json();
        }

        let ratingHistory = [];
        if (historyRes.ok) {
            ratingHistory = await historyRes.json();
        }

        // Prepare prompt for DeepSeek
        const prompt = `
            Analiza el progreso de este estudiante de ajedrez basándote en sus datos de Lichess.
            
            Nombre: ${studentData.firstName} ${studentData.lastName}
            Username Lichess: ${studentData.lichessUsername}
            
            Datos de Perfil:
            ${JSON.stringify(lichessInfo, null, 2)}
            
            Historial de Rating (últimos meses):
            ${JSON.stringify(ratingHistory, null, 2).substring(0, 3000)} ... (truncado para brevedad)
            
            Por favor, proporciona:
            1. Un resumen del nivel actual.
            2. Fortalezas detectadas (basado en ritmos de juego y regularidad).
            3. Áreas de mejora.
            4. Una recomendación de entrenamiento personalizada.
            
            Responde en español, con un tono profesional pero motivador para un profesor de ajedrez.
            Usa formato Markdown.
        `;

        const analysis = await askDeepSeek(prompt, "Eres un gran maestro de ajedrez y un experto pedagogo que ayuda a profesores a analizar el progreso de sus alumnos.");

        return json({ analysis });

    } catch (err: any) {
        console.error('❌ Error analyzing student with DeepSeek:', err);
        return json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
};
