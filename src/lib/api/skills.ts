import { db, auth, toData } from "$lib/firebase";
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
  async getMySkills(): Promise<Skill[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const q = query(
      collection(db, "skills"),
      where("ownerId", "==", user.uid),
      orderBy("orderIndex", "asc")
    );

    const querySnapshot = await getDocs(q);
    const skills = querySnapshot.docs.map(doc => toData<Skill>(doc));

    // Fetch category info for each skill
    for (const skill of skills) {
      if (skill.categoryId) {
        const catDoc = await getDoc(doc(db, "categories", skill.categoryId));
        if (catDoc.exists()) {
          (skill as any).categories = toData<any>(catDoc);
        }
      }
    }

    return skills;
  },

  // Get skills by category
  async getSkillsByCategory(categoryId: string): Promise<Skill[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const q = query(
      collection(db, "skills"),
      where("ownerId", "==", user.uid),
      where("categoryId", "==", categoryId),
      orderBy("orderIndex", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Skill>(doc));
  },

  // Get a specific skill
  async getSkill(id: string): Promise<Skill> {
    const docRef = doc(db, "skills", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Skill not found or access denied");
    }

    const skill = toData<Skill>(docSnap);

    // Fetch category info
    if (skill.categoryId) {
      const catDoc = await getDoc(doc(db, "categories", skill.categoryId));
      if (catDoc.exists()) {
        (skill as any).categories = toData<any>(catDoc);
      }
    }

    return skill;
  },

  // Create a new skill
  async createSkill(skillData: CreateSkillForm): Promise<Skill> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const docRef = await addDoc(collection(db, "skills"), {
      ownerId: user.uid,
      name: skillData.name,
      categoryId: skillData.categoryId,
      description: skillData.description || "",
      icon: skillData.icon || "",
      resourceLink: skillData.resourceLink || "",
      level: skillData.level || 1,
      orderIndex: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const docSnap = await getDoc(docRef);
    return toData<Skill>(docSnap);
  },

  // Update a skill
  async updateSkill(id: string, updates: Partial<CreateSkillForm>): Promise<Skill> {
    const docRef = doc(db, "skills", id);

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const updatedSnap = await getDoc(docRef);
    return toData<Skill>(updatedSnap);
  },

  // Delete a skill
  async deleteSkill(id: string): Promise<void> {
    const docRef = doc(db, "skills", id);
    await deleteDoc(docRef);
  },

  // Reorder skills
  async reorderSkills(skillIds: string[]): Promise<void> {
    const batch = writeBatch(db);
    const now = new Date().toISOString();

    skillIds.forEach((id, index) => {
      const docRef = doc(db, "skills", id);
      batch.update(docRef, {
        orderIndex: index,
        updatedAt: now
      });
    });

    await batch.commit();
  },

  // Get skills with progress for a specific student
  async getSkillsWithProgress(studentId: string): Promise<(Skill & { progress?: any })[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    // Fetch student skills first
    const progressQuery = query(
      collection(db, "student_skills"),
      where("ownerId", "==", user.uid),
      where("studentId", "==", studentId)
    );
    const progressSnap = await getDocs(progressQuery);
    const progressMap = new Map();
    progressSnap.docs.forEach(d => progressMap.set(d.data().skillId, d.data()));

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
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const q = query(
      collection(db, "class_skills"),
      where("ownerId", "==", user.uid),
      where("classId", "==", classId),
      orderBy("orderIndex", "asc")
    );

    const querySnapshot = await getDocs(q);
    const skillIds = querySnapshot.docs.map(doc => doc.data().skillId);

    const skills: Skill[] = [];
    for (const sid of skillIds) {
      const skillDoc = await getDoc(doc(db, "skills", sid));
      if (skillDoc.exists()) {
        skills.push(toData<Skill>(skillDoc));
      }
    }

    return skills;
  },

  // Import predefined syllabus
  async importPredefinedSyllabus(): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    // We import the constant dynamically to avoid circular dependencies if any
    const { PREDEFINED_SYLLABUS } = await import("$lib/constants/predefined-content");
    const { categoriesApi } = await import("./categories");

    for (const group of PREDEFINED_SYLLABUS) {
      // Create category if it doesn't exist (search by name)
      const existingCats = await categoriesApi.getCategories();
      let category = existingCats.find(c => c.name === group.category);
      
      if (!category) {
        category = await categoriesApi.createCategory(group.category, `Contenido de ${group.category}`);
      }

      // Add skills
      for (const item of group.items) {
        // Check if skill already exists in this category
        const existingSkills = await this.getSkillsByCategory(category.id);
        if (!existingSkills.some(s => s.name === item.name)) {
          await this.createSkill({
            name: item.name,
            description: item.description,
            categoryId: category.id,
            level: item.level as any,
            icon: "Book",
            resourceLink: ""
          });
        }
      }
    }
  }
};
