import { db, auth } from "$lib/firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  writeBatch,
  limit,
  type DocumentData
} from "firebase/firestore";
import type { ClassSkill, Skill } from "$lib/types";

// Helper to convert Firestore document to data with ID
const toData = <T>(doc: any): T => {
  return { id: doc.id, ...doc.data() } as T;
};

export const classSkillsApi = {
  // Get all skills assigned to a class
  async getClassSkills(classId: string, userId?: string): Promise<(ClassSkill & { skill: Skill })[]> {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");

    const q = query(
      collection(db, "class_skills"),
      where("owner_id", "==", uid),
      where("classId", "==", classId),
      orderBy("orderIndex", "asc")
    );

    const querySnapshot = await getDocs(q);
    const classSkills = querySnapshot.docs.map(doc => toData<any>(doc));

    for (const cs of classSkills) {
      if (cs.skillId) {
        const skillDoc = await getDoc(doc(db, "skills", cs.skillId));
        if (skillDoc.exists()) {
          cs.skill = toData<Skill>(skillDoc);
        }
      }
    }

    return classSkills;
  },

  // Get all classes where a skill is assigned
  async getSkillClasses(skillId: string): Promise<(ClassSkill & { class: any })[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "class_skills"),
      where("owner_id", "==", user.uid),
      where("skillId", "==", skillId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const classSkills = querySnapshot.docs.map(doc => toData<any>(doc));

    for (const cs of classSkills) {
      if (cs.classId) {
        const classDoc = await getDoc(doc(db, "classes", cs.classId));
        if (classDoc.exists()) {
          cs.class = toData<any>(classDoc);
        }
      }
    }

    return classSkills;
  },

  // Assign a skill to a class
  async assignSkillToClass(classId: string, skillId: string, orderIndex?: number): Promise<ClassSkill> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    // Check if already assigned
    const q = query(
      collection(db, "class_skills"),
      where("owner_id", "==", user.uid),
      where("classId", "==", classId),
      where("skillId", "==", skillId)
    );
    const existingSnap = await getDocs(q);
    if (!existingSnap.empty) {
      throw new Error("Skill is already assigned to this class");
    }

    // Get next order index if not provided
    if (orderIndex === undefined) {
      const lastQ = query(
        collection(db, "class_skills"),
        where("owner_id", "==", user.uid),
        where("classId", "==", classId),
        orderBy("orderIndex", "desc"),
        limit(1)
      );
      const lastSnap = await getDocs(lastQ);
      orderIndex = lastSnap.empty ? 1 : (lastSnap.docs[0].data().orderIndex || 0) + 1;
    }

    const docRef = await addDoc(collection(db, "class_skills"), {
      owner_id: user.uid,
      classId,
      skillId,
      orderIndex,
      createdAt: new Date().toISOString()
    });

    const docSnap = await getDoc(docRef);
    return toData<ClassSkill>(docSnap);
  },

  // Assign multiple skills to a class
  async assignSkillsToClass(classId: string, skillIds: string[]): Promise<ClassSkill[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    // Get current max order index
    const lastQ = query(
      collection(db, "class_skills"),
      where("owner_id", "==", user.uid),
      where("classId", "==", classId),
      orderBy("orderIndex", "desc"),
      limit(1)
    );
    const lastSnap = await getDocs(lastQ);
    let nextOrderIndex = lastSnap.empty ? 1 : (lastSnap.docs[0].data().orderIndex || 0) + 1;

    const batch = writeBatch(db);
    const now = new Date().toISOString();
    const newRefs: any[] = [];

    for (const skillId of skillIds) {
      const docRef = doc(collection(db, "class_skills"));
      batch.set(docRef, {
        owner_id: user.uid,
        classId,
        skillId,
        orderIndex: nextOrderIndex++,
        createdAt: now
      });
      newRefs.push(docRef);
    }

    await batch.commit();

    const result: ClassSkill[] = [];
    for (const ref of newRefs) {
      const snap = await getDoc(ref);
      if (snap.exists()) result.push(toData<ClassSkill>(snap));
    }
    return result;
  },

  // Remove a skill from a class
  async removeSkillFromClass(classId: string, skillId: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "class_skills"),
      where("owner_id", "==", user.uid),
      where("classId", "==", classId),
      where("skillId", "==", skillId)
    );
    const snap = await getDocs(q);
    
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  },

  // Remove multiple skills from a class
  async removeSkillsFromClass(classId: string, skillIds: string[]): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    for (const skillId of skillIds) {
      await this.removeSkillFromClass(classId, skillId);
    }
  },

  // Reorder skills in a class
  async reorderClassSkills(classId: string, skillIds: string[]): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const batch = writeBatch(db);
    
    for (let i = 0; i < skillIds.length; i++) {
        const skillId = skillIds[i];
        const q = query(
            collection(db, "class_skills"),
            where("owner_id", "==", user.uid),
            where("classId", "==", classId),
            where("skillId", "==", skillId)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
            batch.update(snap.docs[0].ref, { orderIndex: i });
        }
    }

    await batch.commit();
  },

  // Get class curriculum (skills with details)
  async getClassCurriculum(classId: string): Promise<any[]> {
    return this.getClassSkills(classId);
  },

  // Copy curriculum from one class to another
  async copyCurriculum(fromClassId: string, toClassId: string): Promise<ClassSkill[]> {
    const sourceSkills = await this.getClassSkills(fromClassId);
    if (!sourceSkills || sourceSkills.length === 0) {
      return [];
    }

    const skillIds = sourceSkills.map(s => s.skillId);
    return this.assignSkillsToClass(toClassId, skillIds);
  }
};
