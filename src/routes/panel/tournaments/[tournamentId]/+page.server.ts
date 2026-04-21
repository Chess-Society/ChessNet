import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { adminDb } from '$lib/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ params, locals }) => {
  const { tournamentId } = params;
  
  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  const uid = locals.user.uid;


  try {
    // 1. Obtener datos del torneo
    let tournament: any = null;
    const tourneySnap = await adminDb.collection("local_tournaments").doc(tournamentId).get();
    if (!tourneySnap.exists) {
      throw error(404, 'Tournament not found');
    }
    tournament = { id: tourneySnap.id, ...tourneySnap.data() };
    
    if (tournament.ownerId !== uid && tournament.owner_id !== uid) {
      throw error(403, 'No tienes permiso para ver este torneo');
    }

    // 2. Obtener participantes y sus datos de alumno
    let participants: any[] = [];
    const partSnap = await adminDb.collection("local_tournament_players")
      .where("tournament_id", "==", tournamentId)
      .where("owner_id", "==", uid)
      .get();
      
    participants = await Promise.all(partSnap.docs.map(async (doc: any) => {
      const p = { id: doc.id, ...doc.data() };
      const studentId = p.studentId || p.student_id;
      if (studentId) {
        const sSnap = await adminDb.collection("students").doc(studentId).get();
        if (sSnap.exists) {
          const sData = sSnap.data() || {};
          p.student = {
            ...sData,
            firstName: sData.firstName || sData.first_name || '',
            lastName: sData.lastName || sData.last_name || '',
            name: sData.name || `${sData.firstName || sData.first_name || ''} ${sData.lastName || sData.last_name || ''}`.trim() || 'Unknown student'
          };
        }
      }
      return p;
    }));

    // 3. Obtener emparejamientos
    let pairings: any[] = [];
    const matchSnap = await adminDb.collection("local_tournament_pairings")
      .where("tournament_id", "==", tournamentId)
      .where("owner_id", "==", uid)
      .get();
      
    pairings = await Promise.all(matchSnap.docs.map(async (doc: any) => {
      const m = { id: doc.id, ...doc.data() };
      const p1Id = m.whiteStudentId || m.white_student_id;
      const p2Id = m.blackStudentId || m.black_student_id;
      
      if (p1Id) {
        const s1Snap = await adminDb.collection("students").doc(p1Id).get();
        if (s1Snap.exists) {
          const s1Data = s1Snap.data() || {};
          m.player1 = {
            ...s1Data,
            name: s1Data.name || `${s1Data.firstName || s1Data.first_name || ''} ${s1Data.lastName || s1Data.last_name || ''}`.trim() || 'White'
          };
        }
      }
      if (p2Id) {
        const s2Snap = await adminDb.collection("students").doc(p2Id).get();
        if (s2Snap.exists) {
          const s2Data = s2Snap.data() || {};
          m.player2 = {
            ...s2Data,
            name: s2Data.name || `${s2Data.firstName || s2Data.first_name || ''} ${s2Data.lastName || s2Data.last_name || ''}`.trim() || 'Black'
          };
        }
      }
      return m;
    }));

    // 4. Obtener todos los alumnos del profesor para el buscador de registro
    let allStudents: any[] = [];
    const allStudentsSnap = await adminDb.collection("students")
      .where("owner_id", "==", uid)
      .get();
    allStudents = allStudentsSnap.docs.map((doc: any) => {
      const sData = doc.data() || {};
      const firstName = sData.firstName || sData.first_name || '';
      const lastName = sData.lastName || sData.last_name || '';
      return { 
        id: doc.id, 
        ...sData,
        firstName,
        lastName,
        name: sData.name || `${firstName} ${lastName}`.trim() || 'Unknown' 
      };
    });

    // Format logical blocks for UI
    const registeredPlayers = participants.map(p => {
      let regDate = new Date().toISOString();
      if (p.createdAt || p.created_at) {
        try {
          regDate = new Date(p.createdAt || p.created_at).toISOString();
        } catch (e) {}
      }

      return {
        id: p.id,
        tournamentId: tournamentId,
        studentId: p.studentId || p.student_id,
        studentName: p.student?.name || 'Unknown',
        studentRating: p.rating || 1200,
        registrationDate: regDate,
        status: 'confirmed'
      };
    });

    const roundNumbers = [...new Set(pairings.map(p => p.round_no))].filter(Boolean).sort((a, b) => (a as any) - (b as any));
    const rounds = roundNumbers.map(r => ({
      id: `round-${r}`,
      tournament_id: tournamentId,
      round_number: r,
      status: r < (tournament.currentRound || 0) ? 'completed' : (r === (tournament.currentRound || 0) ? 'in_progress' : 'not_started')
    }));

    const formattedPairings = pairings.map(p => ({
      id: p.id,
      roundNo: p.roundNo || p.round_no,
      board: p.board,
      whiteStudentId: p.whiteStudentId || p.white_student_id,
      blackStudentId: p.blackStudentId || p.black_student_id,
      result: p.result || '*',
      whiteName: p.whiteName || p.white_name || p.player1?.name || 'White',
      blackName: p.blackName || p.black_name || p.player2?.name || 'Black'
    }));

    const standings = participants
      .sort((a, b) => (b.score || 0) - (a.score || 0) || (b.tiebreakScore || b.tiebreak_score || 0) - (a.tiebreakScore || a.tiebreak_score || 0))
      .map((p, index) => ({
        position: index + 1,
        studentId: p.studentId || p.student_id,
        studentName: p.student?.name || 'Unknown',
        rating: p.rating || 1200,
        points: p.score || 0,
        gamesPlayed: pairings.filter(m => {
          const wId = m.whiteStudentId || m.white_student_id;
          const bId = m.blackStudentId || m.black_student_id;
          const pId = p.studentId || p.student_id;
          return (wId === pId || bId === pId) && m.result && m.result !== '*';
        }).length,
        buchholz: p.tiebreakScore || p.tiebreak_score || 0
      }));

    const registeredStudentIds = participants.map(p => p.studentId || p.student_id);
    const availableStudents = allStudents
      .filter(s => !registeredStudentIds.includes(s.id))
      .map(s => ({
        id: s.id,
        name: s.name,
        rating: 1200,
        schoolName: s.schoolName || s.school_name || 'No school'
      }));

    return serializeRecord({
      user: locals.user,
      tournamentId,
      tournament,
      registeredPlayers,
      rounds,
      pairings: formattedPairings,
      standings,
      availableStudents
    });

  } catch (err: any) {
    console.error('❌ Error in tournament detail page:', err);
    if (err.status) throw err;
    throw error(500, 'Internal server error');
  }
};

