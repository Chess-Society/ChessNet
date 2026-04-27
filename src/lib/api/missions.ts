import { adminDb } from '$lib/server/firebase-admin';

export async function createMission(missionData: any) {
  const missionRef = adminDb.collection("missions").doc();
  const mission = {
    ...missionData,
    id: missionRef.id,
    createdAt: new Date().toISOString()
  };
  await missionRef.set(mission);
  return mission;
}

export async function assignMissionToStudent(missionId: string, studentId: string) {
  const assignmentRef = adminDb.collection("student_missions").doc(`${studentId}_${missionId}`);
  
  const missionSnap = await adminDb.collection("missions").doc(missionId).get();
  const mission = missionSnap.data();
  
  let startCount = 0;
  if (mission?.type === 'puzzles' || mission?.type === 'games') {
      const studentSnap = await adminDb.collection("students").doc(studentId).get();
      const student = studentSnap.data();
      if (student?.lichessUsername) {
          // Placeholder for initial count fetch
      }
  }

  await assignmentRef.set({
    student_id: studentId,
    mission_id: missionId,
    progress: 0,
    startCount: startCount,
    completed: false,
    lastChecked: new Date().toISOString(),
    assignedAt: new Date().toISOString()
  });
}

export async function checkLichessActivity(username: string) {
  try {
    const response = await fetch(`https://lichess.org/api/user/${username}/activity`);
    if (!response.ok) return [];
    const data = await response.json();
    return data;
  } catch (e) {
    console.error('Error fetching Lichess activity:', e);
    return [];
  }
}

export async function verifyMission(assignmentId: string) {
  const assignmentSnap = await adminDb.collection("student_missions").doc(assignmentId).get();
  if (!assignmentSnap.exists) return { success: false, error: 'Assignment not found' };

  const assignment = assignmentSnap.data() as any;
  const missionSnap = await adminDb.collection("missions").doc(assignment.mission_id).get();
  const mission = missionSnap.data() as any;
  const studentSnap = await adminDb.collection("students").doc(assignment.student_id).get();
  const student = studentSnap.data() as any;

  if (!mission || !student?.lichessUsername) return { success: false, error: 'Missing requirements' };

  if (mission.type === 'puzzles') {
      const activity = await checkLichessActivity(student.lichessUsername);
      const assignedTime = new Date(assignment.assignedAt).getTime();
      let totalPuzzles = 0;

      activity.forEach((item: any) => {
          if (item.interval?.end > assignedTime && item.puzzles) {
              totalPuzzles += item.puzzles.nb;
          }
      });

      const progress = Math.min(totalPuzzles, mission.target);
      const completed = progress >= mission.target;

      await adminDb.collection("student_missions").doc(assignmentId).update({
          progress,
          completed,
          lastChecked: new Date().toISOString()
      });

      if (completed && !assignment.completed) {
          await adminDb.collection("students").doc(assignment.student_id).update({
              experience: (student.experience || 0) + (mission.reward || 50)
          });
      }
      return { success: true, progress, completed };
  }

  if (mission.type === 'games') {
      const activity = await checkLichessActivity(student.lichessUsername);
      const assignedTime = new Date(assignment.assignedAt).getTime();
      let totalGames = 0;

      activity.forEach((item: any) => {
          if (item.interval?.end > assignedTime && item.games) {
              Object.values(item.games).forEach((gameType: any) => {
                  totalGames += (gameType.win || 0) + (gameType.loss || 0) + (gameType.draw || 0);
              });
          }
      });

      const progress = Math.min(totalGames, mission.target);
      const completed = progress >= mission.target;

      await adminDb.collection("student_missions").doc(assignmentId).update({
          progress,
          completed,
          lastChecked: new Date().toISOString()
      });

      if (completed && !assignment.completed) {
          await adminDb.collection("students").doc(assignment.student_id).update({
              experience: (student.experience || 0) + (mission.reward || 50)
          });
      }
      return { success: true, progress, completed };
  }

  if (mission.type === 'win_streak') {
      try {
          const assignedTime = new Date(assignment.assignedAt).getTime();
          // We fetch more games than the target to check for the streak
          const response = await fetch(`https://lichess.org/api/games/user/${student.lichessUsername}?max=20&since=${assignedTime}`);
          if (!response.ok) return { success: false, error: 'Lichess API Error' };
          
          const text = await response.text();
          const games = text.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
          
          let maxStreak = 0;
          let currentStreak = 0;

          // Games are returned from newest to oldest. We want to find the best streak.
          games.forEach((game: any) => {
              const isWinner = (game.players.white.user?.id.toLowerCase() === student.lichessUsername.toLowerCase() && game.winner === 'white') ||
                               (game.players.black.user?.id.toLowerCase() === student.lichessUsername.toLowerCase() && game.winner === 'black');
              
              if (isWinner) {
                  currentStreak++;
                  maxStreak = Math.max(maxStreak, currentStreak);
              } else {
                  currentStreak = 0;
              }
          });

          const progress = Math.min(maxStreak, mission.target);
          const completed = progress >= mission.target;

          await adminDb.collection("student_missions").doc(assignmentId).update({
              progress,
              completed,
              lastChecked: new Date().toISOString()
          });

          if (completed && !assignment.completed) {
              await adminDb.collection("students").doc(assignment.student_id).update({
                  experience: (student.experience || 0) + (mission.reward || 50)
              });
          }
          return { success: true, progress, completed };
      } catch (e) {
          console.error('Error verifying win streak:', e);
          return { success: false, error: 'Verification failed' };
      }
  }

  return { success: false, error: 'Mission type not supported for verification' };
}

