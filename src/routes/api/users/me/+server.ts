import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb, adminAuth } from '$lib/server/firebase-admin';
import { authenticate } from '$lib/server/auth';

// DELETE — Eliminar cuenta de usuario y TODOS sus datos asociados
// Borra en batch: schools, students, classes, skills, attendance, payments,
// local_tournaments, local_tournament_players, local_tournament_pairings,
// local_tournament_rounds, achievements, badges, student_badges, student_stats,
// activity_logs, class_students, class_skills, app_settings, user_subscriptions
// y finalmente el perfil /users/{uid} y la cuenta de Firebase Auth.
export const DELETE: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) return json({ error: 'No autorizado' }, { status: 401 });

  const uid = user.uid;

  try {
    console.log(`🗑️ [DELETE /api/users/me] Iniciando borrado completo para uid: ${uid}`);

    // Colecciones con campo ownerId
    const ownerCollections = [
      'schools',
      'classes',
      'students',
      'skills',
      'attendance',
      'payments',
      'local_tournaments',
      'local_tournament_players',
      'local_tournament_pairings',
      'local_tournament_rounds',
      'achievements',
      'badges',
      'student_badges',
      'student_stats',
      'activity_logs',
      'class_students',
      'class_skills',
      'curriculum_units',
      'lessons',
      'lesson_resources',
      'chess_exercises',
      'exercise_attempts',
      'parent_messages',
      'lobby_suggestions',
      'lobby_reports'
    ];

    // Borrar todas las colecciones con ownerId en batches de 500
    for (const collectionName of ownerCollections) {
      try {
        let query = adminDb.collection(collectionName).where('ownerId', '==', uid);
        let hasMore = true;

        while (hasMore) {
          const snapshot = await query.limit(400).get();
          if (snapshot.empty) { hasMore = false; break; }

          const batch = adminDb.batch();
          snapshot.docs.forEach((doc: any) => batch.delete(doc.ref));
          await batch.commit();

          if (snapshot.docs.length < 400) hasMore = false;
        }
        console.log(`  ✅ Colección limpiada: ${collectionName}`);
      } catch (err) {
        // Silenciar errores de colecciones que no existen o no tienen datos
        console.warn(`  ⚠️  Error limpiando ${collectionName}:`, err);
      }
    }

    // Borrar documentos con uid como clave (app_settings, user_subscriptions, users)
    const uidKeyedDocs = [
      adminDb.collection('app_settings').doc(uid),
      adminDb.collection('user_subscriptions').doc(uid),
      adminDb.collection('users').doc(uid)
    ];

    const uidBatch = adminDb.batch();
    for (const docRef of uidKeyedDocs) {
      uidBatch.delete(docRef);
    }
    await uidBatch.commit();
    console.log('  ✅ Documentos de usuario eliminados');

    // Borrar la cuenta de Firebase Auth (último paso)
    await adminAuth.deleteUser(uid);
    console.log(`  ✅ Cuenta de Auth eliminada para uid: ${uid}`);

    // Limpiar la cookie de sesión
    event.cookies.delete('__session', { path: '/' });

    return json({ success: true, message: 'Cuenta eliminada correctamente' });
  } catch (error: any) {
    console.error('❌ [DELETE /api/users/me] Error:', error);
    return json({ error: 'Error al eliminar la cuenta', details: error.message }, { status: 500 });
  }
};
