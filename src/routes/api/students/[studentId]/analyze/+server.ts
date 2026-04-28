import { json, error } from '@sveltejs/kit';
import { adminDb } from '$lib/server/firebase-admin';
import { getUserPlan } from '$lib/server/plans';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    const plan = await getUserPlan(locals.user.uid);
    if (plan !== 'premium' && !locals.isAdmin) {
        throw error(403, 'Premium plan required for analysis');
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

        let lichessInfo: any = {};
        if (userRes.ok) {
            lichessInfo = await userRes.json();
        }

        let ratingHistory: any[] = [];
        if (historyRes.ok) {
            ratingHistory = await historyRes.json();
        }

        // --- LOCAL REPORT GENERATOR (Non-AI) ---
        // This replaces the third-party AI dependency with a local analysis of the data.
        
        const perfs = lichessInfo.perfs || {};
        const blitz = perfs.blitz?.rating || 'N/A';
        const rapid = perfs.rapid?.rating || 'N/A';
        const puzzle = perfs.puzzle?.rating || 'N/A';
        
        // Calculate recent trend (last 30 days roughly)
        let trendMsg = "Estable";
        if (ratingHistory.length > 0) {
          const rapidHistory = ratingHistory.find((h: any) => h.name === 'Rapid');
          if (rapidHistory && rapidHistory.points.length > 2) {
            const last = rapidHistory.points[rapidHistory.points.length - 1][3];
            const prev = rapidHistory.points[rapidHistory.points.length - 2][3];
            const diff = last - prev;
            if (diff > 0) trendMsg = `Creciente (+${diff} puntos)`;
            else if (diff < 0) trendMsg = `Decreciente (${diff} puntos)`;
          }
        }

        const report = `
### 📊 Resumen de Rendimiento: ${studentData.firstName} ${studentData.lastName}
*Actualizado el ${new Date().toLocaleDateString('es-ES')}*

**Niveles Actuales (Lichess):**
- **Blitz:** ${blitz}
- **Rapid:** ${rapid}
- **Tácticas (Puzzles):** ${puzzle}
- **Tendencia:** ${trendMsg}

**Análisis de Actividad:**
El alumno ha completado un total de **${lichessInfo.count?.all || 0}** partidas. 
Su ratio de victorias actual se sitúa en torno al **${lichessInfo.count?.win || 0}** partidas ganadas.

**Recomendación del Sistema:**
${Number(puzzle) < Number(rapid) ? 
  "⚠️ El nivel de táctica es inferior al de juego real. Se recomienda priorizar el entrenamiento de patrones tácticos." : 
  "✅ Buen equilibrio entre táctica y juego posicional. Se recomienda empezar a estudiar aperturas específicas."}

---
*Este informe ha sido generado automáticamente por el motor interno de ChessNet.*
        `;

        return json({ analysis: report.trim() });

    } catch (err: any) {
        console.error('❌ Error in student analysis:', err);
        return json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
};
