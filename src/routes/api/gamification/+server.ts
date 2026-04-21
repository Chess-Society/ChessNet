import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { adminDb, adminAuth } from '$lib/firebase-admin';
import { authenticate } from '$lib/server/auth';
import { serializeRecord } from '$lib/server/serialize';

export const POST: RequestHandler = async (event) => {
  const { user } = await authenticate(event);
  if (!user) return json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await event.request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'createBadge':
        return await createBadge(user.uid, params);
      case 'updateBadge':
        return await updateBadge(user.uid, params);
      case 'deleteBadge':
        return await deleteBadge(user.uid, params);
      case 'awardBadge':
        return await awardBadge(user.uid, params);
      case 'removeBadge':
        return await removeBadge(user.uid, params);
      case 'updateStudentStats':
        return await updateStudentStats(user.uid, params);
      case 'addPoints':
        return await addPoints(user.uid, params);
      case 'logActivity':
        return await logActivity(user.uid, params);
      case 'checkAndAwardBadges':
        return await checkAndAwardBadges(user.uid, params);
      default:
        return json({ error: 'Acción no válida' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('❌ [API /gamification POST]', error);
    return json({ error: error.message || 'Error en gamificación' }, { status: 500 });
  }
};

async function createBadge(uid: string, params: any) {
  const { schoolId, name, description, icon, color, criteria } = params;
  
  // Validar propiedad de la escuela
  const schoolDoc = await adminDb.collection('schools').doc(schoolId).get();
  if (!schoolDoc.exists || schoolDoc.data()?.owner_id !== uid) {
    return json({ error: 'No tienes permiso para crear insignias en esta escuela' }, { status: 403 });
  }

  const badgeData = {
    owner_id: uid,
    schoolId,
    name,
    description,
    icon,
    color: color || '#3b82f6',
    criteria: criteria || {},
    isActive: true,
    createdAt: new Date().toISOString()
  };

  const docRef = await adminDb.collection('badges').add(badgeData);
  return json({ success: true, id: docRef.id, badge: { id: docRef.id, ...badgeData } });
}

async function updateBadge(uid: string, params: any) {
  const { id, updates } = params;
  const badgeRef = adminDb.collection('badges').doc(id);
  const badgeDoc = await badgeRef.get();

  if (!badgeDoc.exists) return json({ error: 'Insignia no encontrada' }, { status: 404 });
  if (badgeDoc.data()?.owner_id !== uid) return json({ error: 'No autorizado' }, { status: 403 });

  // No permitir cambiar owner_id o schoolId
  const { owner_id, schoolId, ...safeUpdates } = updates;
  await badgeRef.update({
    ...safeUpdates,
    updatedAt: new Date().toISOString()
  });

  return json({ success: true });
}

async function deleteBadge(uid: string, params: any) {
  const { id } = params;
  const badgeRef = adminDb.collection('badges').doc(id);
  const badgeDoc = await badgeRef.get();

  if (!badgeDoc.exists) return json({ error: 'Insignia no encontrada' }, { status: 404 });
  if (badgeDoc.data()?.owner_id !== uid) return json({ error: 'No autorizado' }, { status: 403 });

  await badgeRef.delete();
  return json({ success: true });
}

async function awardBadge(uid: string, params: any) {
  const { studentId, badgeId } = params;

  // Validar que el estudiante pertenece al usuario
  const studentDoc = await adminDb.collection('students').doc(studentId).get();
  if (!studentDoc.exists || studentDoc.data()?.owner_id !== uid) {
    return json({ error: 'No autorizado para este estudiante' }, { status: 403 });
  }

  // Validar la insignia
  const badgeDoc = await adminDb.collection('badges').doc(badgeId).get();
  if (!badgeDoc.exists) return json({ error: 'Insignia no encontrada' }, { status: 404 });

  const sbData = {
    owner_id: uid,
    studentId,
    badgeId,
    earnedAt: new Date().toISOString()
  };

  await adminDb.collection('student_badges').add(sbData);
  return json({ success: true });
}

async function removeBadge(uid: string, params: any) {
  const { studentId, badgeId } = params;

  const snapshot = await adminDb.collection('student_badges')
    .where('owner_id', '==', uid)
    .where('studentId', '==', studentId)
    .where('badgeId', '==', badgeId)
    .get();

  if (snapshot.empty) return json({ success: true });

  const batch = adminDb.batch();
  snapshot.docs.forEach((doc: any) => batch.delete(doc.ref));
  await batch.commit();

  return json({ success: true });
}

async function updateStudentStats(uid: string, params: any) {
  const { studentId, updates } = params;
  
  const studentDoc = await adminDb.collection('students').doc(studentId).get();
  if (!studentDoc.exists || studentDoc.data()?.owner_id !== uid) {
    return json({ error: 'No autorizado' }, { status: 403 });
  }

  const statsRef = adminDb.collection('student_stats').doc(studentId);
  const data = {
    ...updates,
    owner_id: uid,
    studentId,
    lastActivity: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await statsRef.set(data, { merge: true });
  return json({ success: true });
}

async function addPoints(uid: string, params: any) {
  const { studentId, points, reason } = params;

  const statsRef = adminDb.collection('student_stats').doc(studentId);
  const statsDoc = await statsRef.get();
  const currentStats = statsDoc.exists ? statsDoc.data() : {};

  const newPoints = (currentStats?.points || 0) + points;
  const newLevel = Math.floor(newPoints / 100) + 1;

  const updates = {
    points: newPoints,
    level: newLevel,
    owner_id: uid,
    studentId,
    lastActivity: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await statsRef.set(updates, { merge: true });

  // Log activity
  await adminDb.collection('activity_logs').add({
    owner_id: uid,
    studentId,
    activityType: 'points_earned',
    activityData: { points, reason, totalPoints: newPoints },
    createdAt: new Date().toISOString()
  });

  return json({ success: true, points: newPoints, level: newLevel });
}

async function logActivity(uid: string, params: any) {
  const { studentId, activityType, activityData } = params;

  await adminDb.collection('activity_logs').add({
    owner_id: uid,
    studentId,
    activityType,
    activityData: activityData || null,
    createdAt: new Date().toISOString()
  });

  return json({ success: true });
}

async function checkAndAwardBadges(uid: string, params: any) {
  const { studentId } = params;

  // 1. Obtener stats
  const statsDoc = await adminDb.collection('student_stats').doc(studentId).get();
  const studentStats = statsDoc.exists ? statsDoc.data() : null;

  // 2. Obtener insignias ya ganadas
  const earnedSnapshot = await adminDb.collection('student_badges')
    .where('owner_id', '==', uid)
    .where('studentId', '==', studentId)
    .get();
  const earnedBadgeIds = earnedSnapshot.docs.map((doc: any) => doc.data().badgeId);

  // 3. Obtener escuela del estudiante
  const studentDoc = await adminDb.collection('students').doc(studentId).get();
  if (!studentDoc.exists) return json({ error: 'Estudiante no encontrado' }, { status: 404 });
  const schoolId = studentDoc.data()?.schoolId;

  // 4. Obtener insignias de la escuela
  const badgesSnapshot = await adminDb.collection('badges')
    .where('owner_id', '==', uid)
    .where('schoolId', '==', schoolId)
    .where('isActive', '==', true)
    .get();

  const newBadges = [];
  const batch = adminDb.batch();

  for (const doc of badgesSnapshot.docs) {
    const badge = { id: doc.id, ...doc.data() as any };
    if (earnedBadgeIds.includes(badge.id)) continue;

    const criteria = badge.criteria;
    let shouldAward = false;

    if (criteria.lessonsCompleted && (studentStats?.lessonsCompleted || 0) >= criteria.lessonsCompleted) shouldAward = true;
    else if (criteria.exercisesCompleted && (studentStats?.exercisesCompleted || 0) >= criteria.exercisesCompleted) shouldAward = true;
    else if (criteria.tournamentsParticipated && (studentStats?.tournamentsParticipated || 0) >= criteria.tournamentsParticipated) shouldAward = true;
    else if (criteria.streakDays && (studentStats?.streakDays || 0) >= criteria.streakDays) shouldAward = true;
    else if (criteria.points && (studentStats?.points || 0) >= criteria.points) shouldAward = true;
    else if (criteria.level && (studentStats?.level || 0) >= criteria.level) shouldAward = true;

    if (shouldAward) {
      const sbRef = adminDb.collection('student_badges').doc();
      batch.set(sbRef, {
        owner_id: uid,
        studentId,
        badgeId: badge.id,
        earnedAt: new Date().toISOString()
      });
      newBadges.push(badge);
    }
  }

  if (newBadges.length > 0) {
    await batch.commit();
  }

  return json({ success: true, newBadges: newBadges.map(b => serializeRecord(b)) });
}
