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
  const isMock = uid === 'chessnet-dev-uid';

  try {
    // 1. Obtener datos del torneo
    let tournament: any = null;
    if (isMock) {
      tournament = {
        id: tournamentId,
        name: 'Torneo Escolar de Primavera',
        description: 'Torneo anual para todos los niveles.',
        format: 'swiss',
        time_control: '10+5',
        status: 'active',
        current_round: 2,
        owner_id: uid
      };
    } else {
      const tourneySnap = await adminDb.collection("local_tournaments").doc(tournamentId).get();
      if (!tourneySnap.exists) {
        throw error(404, 'Tournament not found');
      }
      tournament = { id: tourneySnap.id, ...tourneySnap.data() };
      
      if (tournament.owner_id !== uid) {
        throw error(403, 'No tienes permiso para ver este torneo');
      }
    }

    // 2. Obtener participantes y sus datos de alumno
    let participants: any[] = [];
    if (isMock) {
      participants = [
        { id: 'p1', student_id: 'mock-s1', score: 2, tiebreak_score: 4, rating: 1250, students: { name: 'Marc Ramos' } },
        { id: 'p2', student_id: 'mock-s2', score: 1.5, tiebreak_score: 3, rating: 1180, students: { name: 'Lucía Sanz' } }
      ];
    } else {
      const partSnap = await adminDb.collection("local_tournament_players")
        .where("tournament_id", "==", tournamentId)
        .where("owner_id", "==", uid)
        .get();
        
      participants = await Promise.all(partSnap.docs.map(async (doc: any) => {
        const p = { id: doc.id, ...doc.data() };
        if (p.student_id) {
          const sSnap = await adminDb.collection("students").doc(p.student_id).get();
          if (sSnap.exists) {
            const sData = sSnap.data() || {};
            p.students = {
              ...sData,
              name: sData.name || `${sData.first_name || ''} ${sData.last_name || ''}`.trim() || 'Unknown student'
            };
          }
        }
        return p;
      }));
    }

    // 3. Obtener emparejamientos
    let pairings: any[] = [];
    if (isMock) {
      pairings = [
        { id: 'm1', round: 1, board_number: 1, player1_id: 'mock-s1', player2_id: 'mock-s2', result: '1-0', player1: { name: 'Marc Ramos' }, player2: { name: 'Lucía Sanz' } }
      ];
    } else {
      const matchSnap = await adminDb.collection("local_tournament_pairings")
        .where("tournament_id", "==", tournamentId)
        .where("owner_id", "==", uid)
        .get();
        
      pairings = await Promise.all(matchSnap.docs.map(async (doc: any) => {
        const m = { id: doc.id, ...doc.data() };
        if (m.player1_id) {
          const s1Snap = await adminDb.collection("students").doc(m.player1_id).get();
          if (s1Snap.exists) {
            const s1Data = s1Snap.data() || {};
            m.player1 = {
              ...s1Data,
              name: s1Data.name || `${s1Data.first_name || ''} ${s1Data.last_name || ''}`.trim() || 'White'
            };
          }
        }
        if (m.player2_id) {
          const s2Snap = await adminDb.collection("students").doc(m.player2_id).get();
          if (s2Snap.exists) {
            const s2Data = s2Snap.data() || {};
            m.player2 = {
              ...s2Data,
              name: s2Data.name || `${s2Data.first_name || ''} ${s2Data.last_name || ''}`.trim() || 'Black'
            };
          }
        }
        return m;
      }));
    }

    // 4. Obtener todos los alumnos del profesor para el buscador de registro
    let allStudents: any[] = [];
    if (!isMock) {
      const allStudentsSnap = await adminDb.collection("students")
        .where("owner_id", "==", uid)
        .get();
      allStudents = allStudentsSnap.docs.map((doc: any) => {
        const sData = doc.data() || {};
        return { 
          id: doc.id, 
          ...sData,
          name: sData.name || `${sData.first_name || ''} ${sData.last_name || ''}`.trim() || 'Unknown' 
        };
      });
    }

    // Format logical blocks for UI
    const registeredPlayers = participants.map(p => {
      // Robust date parsing for created_at
      let regDate = new Date().toISOString();
      if (p.created_at) {
        try {
          if (typeof p.created_at.toDate === 'function') regDate = p.created_at.toDate().toISOString();
          else regDate = new Date(p.created_at).toISOString();
        } catch (e) {}
      }

      return {
        id: p.id,
        tournament_id: tournamentId,
        student_id: p.student_id,
        student_name: p.students?.name || 'Unknown',
        student_rating: p.rating || 1200,
        registration_date: regDate,
        status: 'confirmed'
      };
    });

    const roundNumbers = [...new Set(pairings.map(p => p.round))].sort((a, b) => a - b);
    const rounds = roundNumbers.map(r => ({
      id: `round-${r}`,
      tournament_id: tournamentId,
      round_number: r,
      status: r < (tournament.current_round || 0) ? 'completed' : (r === (tournament.current_round || 0) ? 'in_progress' : 'not_started')
    }));

    const formattedPairings = pairings.map(p => ({
      id: p.id,
      round_number: p.round,
      board_number: p.board_number,
      white_player_id: p.player1_id,
      black_player_id: p.player2_id,
      result: p.result || '*',
      white_player_name: p.player1?.name || 'White',
      black_player_name: p.player2?.name || 'Black'
    }));

    const standings = participants
      .sort((a, b) => (b.score || 0) - (a.score || 0) || (b.tiebreak_score || 0) - (a.tiebreak_score || 0))
      .map((p, index) => ({
        position: index + 1,
        student_id: p.student_id,
        student_name: p.students?.name || 'Unknown',
        rating: p.rating || 1200,
        points: p.score || 0,
        games_played: pairings.filter(m => (m.player1_id === p.student_id || m.player2_id === p.student_id) && m.result && m.result !== '*').length,
        buchholz: p.tiebreak_score || 0
      }));

    const registeredStudentIds = participants.map(p => p.student_id);
    const availableStudents = allStudents
      .filter(s => !registeredStudentIds.includes(s.id))
      .map(s => ({
        id: s.id,
        name: s.name,
        rating: 1200,
        school_name: s.school_name || 'No school'
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

