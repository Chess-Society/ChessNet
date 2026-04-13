import { db, toData, getUserPath } from "$lib/firebase";
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
  writeBatch
} from "firebase/firestore";
import type { Skill, CreateSkillForm } from "$lib/types";

export const skillsApi = {
  // Get all skills for the current user
  async getMySkills(userId?: string): Promise<Skill[]> {
    const userPath = getUserPath(userId);

    const q = query(
      collection(db, userPath, "skills"),
      orderBy("order_index", "asc")
    );

    const querySnapshot = await getDocs(q);
    const skills = querySnapshot.docs.map(doc => toData<Skill>(doc));

    // Fetch category info for each skill
    for (const skill of skills) {
      if (skill.category_id) {
        const catDoc = await getDoc(doc(db, userPath, "categories", skill.category_id));
        if (catDoc.exists()) {
          (skill as any).categories = toData<any>(catDoc);
        }
      }
    }

    return skills;
  },

  // Get skills by category
  async getSkillsByCategory(categoryId: string): Promise<Skill[]> {
    const userPath = getUserPath();

    const q = query(
      collection(db, userPath, "skills"),
      where("category_id", "==", categoryId),
      orderBy("order_index", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Skill>(doc));
  },

  // Get a specific skill
  async getSkill(id: string): Promise<Skill> {
    const userPath = getUserPath();

    const docRef = doc(db, userPath, "skills", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Skill not found or access denied");
    }

    const skill = toData<Skill>(docSnap);

    // Fetch category info
    if (skill.category_id) {
      const catDoc = await getDoc(doc(db, userPath, "categories", skill.category_id));
      if (catDoc.exists()) {
        (skill as any).categories = toData<any>(catDoc);
      }
    }

    return skill;
  },

  // Create a new skill
  async createSkill(skillData: CreateSkillForm): Promise<Skill> {
    const userPath = getUserPath();

    const docRef = await addDoc(collection(db, userPath, "skills"), {
      name: skillData.name,
      category_id: skillData.category_id,
      description: skillData.description || "",
      icon: skillData.icon || "",
      resource_link: skillData.resource_link || "",
      level: skillData.level || 1,
      order_index: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    const docSnap = await getDoc(docRef);
    return toData<Skill>(docSnap);
  },

  // Update a skill
  async updateSkill(id: string, updates: Partial<CreateSkillForm>): Promise<Skill> {
    const userPath = getUserPath();
    const docRef = doc(db, userPath, "skills", id);

    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    const updatedSnap = await getDoc(docRef);
    return toData<Skill>(updatedSnap);
  },

  // Delete a skill
  async deleteSkill(id: string): Promise<void> {
    const docRef = doc(db, getUserPath(), "skills", id);
    await deleteDoc(docRef);
  },

  // Reorder skills
  async reorderSkills(skillIds: string[]): Promise<void> {
    const userPath = getUserPath();
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    skillIds.forEach((id, index) => {
      const docRef = doc(db, userPath, "skills", id);
      batch.update(docRef, {
        order_index: index,
        updated_at: now
      });
    });

    await batch.commit();
  },

  // Get skills with progress for a specific student
  async getSkillsWithProgress(studentId: string): Promise<(Skill & { progress?: any })[]> {
    const userPath = getUserPath();

    // Fetch student skills first
    const progressQuery = query(
      collection(db, userPath, "student_skills"),
      where("student_id", "==", studentId)
    );
    const progressSnap = await getDocs(progressQuery);
    const progressMap = new Map();
    progressSnap.docs.forEach(d => progressMap.set(d.data().skill_id, d.data()));

    // Fetch all skills
    const skills = await this.getMySkills();
    
    // Attach progress
    return skills.map(skill => ({
      ...skill,
      progress: progressMap.get(skill.id) || null
    }));
  },

  // Get skills assigned to a class
  async getClassSkills(classId: string): Promise<Skill[]> {
    const userPath = getUserPath();

    const q = query(
      collection(db, userPath, "class_skills"),
      where("class_id", "==", classId),
      orderBy("order_index", "asc")
    );

    const querySnapshot = await getDocs(q);
    const skillIds = querySnapshot.docs.map(doc => doc.data().skill_id);

    const skills: Skill[] = [];
    for (const sid of skillIds) {
      const skillDoc = await getDoc(doc(db, userPath, "skills", sid));
      if (skillDoc.exists()) {
        skills.push(toData<Skill>(skillDoc));
      }
    }

    return skills;
  }
};
