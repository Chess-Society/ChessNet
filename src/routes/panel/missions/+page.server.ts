import { adminDb, ownerFilter } from '$lib/server/firebase-admin';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase-admin/firestore';
import type { PageServerLoad, Actions } from './$types';
import { serializeRecord } from '$lib/server/serialize';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) throw error(401);

  try {
    const missionsSnap = await adminDb.collection("missions")
      .where(ownerFilter(user.uid))
      .get();
    
    const missions = missionsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    const assignmentsSnap = await adminDb.collection("student_missions")
      .where(ownerFilter(user.uid))
      .orderBy("assignedAt", "desc")
      .limit(50)
      .get();
    
    const assignedMissions = assignmentsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    const schoolsSnap = await adminDb.collection("schools")
      .where(ownerFilter(user.uid))
      .get();
    const schools = schoolsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    const classesSnap = await adminDb.collection("classes")
      .where(ownerFilter(user.uid))
      .get();
    const classes = classesSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    const studentsSnap = await adminDb.collection("students")
      .where(ownerFilter(user.uid))
      .get();
    const students = studentsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    return {
      missions: serializeRecord<any[]>(missions),
      assignedMissions: serializeRecord<any[]>(assignedMissions),
      schools: serializeRecord<any[]>(schools),
      classes: serializeRecord<any[]>(classes),
      students: serializeRecord<any[]>(students)
    };
  } catch (e: any) {
    console.error('Error loading missions:', e);
    return { missions: [], assignedMissions: [], schools: [], classes: [], students: [] };
  }
};

export const actions: Actions = {
  verifyAll: async ({ locals }) => {
    const user = locals.user;
    if (!user) throw error(401);

    try {
      const { verifyMission } = await import('$lib/api/missions');
      const assignmentsSnap = await adminDb.collection("student_missions")
        .where(ownerFilter(user.uid))
        .where("completed", "==", false)
        .get();

      const results = [];
      const newlyCompleted: string[] = [];

      for (const doc of assignmentsSnap.docs as QueryDocumentSnapshot<DocumentData>[]) {
        try {
          const oldData = doc.data();
          const res = await verifyMission(doc.id);
          
          if (res.success && res.completed && !oldData.completed) {
            newlyCompleted.push(doc.id);
          }
          
          results.push(res);
        } catch (err) {
          console.error(`Error verifying mission ${doc.id}:`, err);
        }
      }

      return { 
        success: true, 
        count: results.length, 
        newlyCompleted // This will trigger the confetti in the frontend
      };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },
  deleteMission: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) throw error(401);

    const data = await request.formData();
    const id = data.get('id') as string;

    try {
      // Also delete all active assignments for this mission
      const assignments = await adminDb.collection("student_missions")
        .where("mission_id", "==", id)
        .get();
      
      const batch = adminDb.batch();
      assignments.forEach((doc: any) => batch.delete(doc.ref));
      batch.delete(adminDb.collection("missions").doc(id));
      
      await batch.commit();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },
  deleteAssignment: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) throw error(401);

    const data = await request.formData();
    const id = data.get('id') as string;

    try {
      await adminDb.collection("student_missions").doc(id).delete();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },
  createMission: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) throw error(401);

    const data = await request.formData();
    const title = data.get('title') as string;
    const description = data.get('description') as string;
    const type = data.get('type') as string;
    const target = parseInt(data.get('target') as string);
    const reward = parseInt(data.get('reward') as string);

    try {
      const missionRef = await adminDb.collection("missions").add({
        title,
        description,
        type,
        target,
        reward,
        owner_id: user.uid,
        createdAt: new Date().toISOString()
      });
      return { success: true, id: missionRef.id };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  assignMission: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) throw error(401);

    const data = await request.formData();
    const missionId = data.get('missionId') as string;
    const targetType = data.get('targetType') as string; // 'student', 'class', 'school'
    const targetId = data.get('targetId') as string;

    try {
      let studentIds: string[] = [];

      if (targetType === 'student') {
        studentIds = [targetId];
      } else if (targetType === 'class') {
        const snap = await adminDb.collection("students").where("class_id", "==", targetId).get();
        studentIds = snap.docs.map((d: any) => d.id);
      } else if (targetType === 'school') {
        const snap = await adminDb.collection("students").where("school_id", "==", targetId).get();
        studentIds = snap.docs.map((d: any) => d.id);
      }

      const batch = adminDb.batch();
      const now = new Date().toISOString();

      studentIds.forEach(sid => {
        const ref = adminDb.collection("student_missions").doc();
        batch.set(ref, {
          student_id: sid,
          mission_id: missionId,
          progress: 0,
          completed: false,
          assignedAt: now,
          owner_id: user.uid
        });
      });

      await batch.commit();
      return { success: true, count: studentIds.length };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
};
