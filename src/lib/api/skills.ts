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
      where("owner_id", "==", user.uid),
      orderBy("order_index", "asc")
    );

    const querySnapshot = await getDocs(q);
    const skills = querySnapshot.docs.map(doc => toData<Skill>(doc));

    // Fetch category info for each skill
    for (const skill of skills) {
      if (skill.category_id) {
        const catDoc = await getDoc(doc(db, "categories", skill.category_id));
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
      where("owner_id", "==", user.uid),
      where("category_id", "==", categoryId),
      orderBy("order_index", "asc")
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
    if (skill.category_id) {
      const catDoc = await getDoc(doc(db, "categories", skill.category_id));
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
      owner_id: user.uid,
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
    const docRef = doc(db, "skills", id);

    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
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
        order_index: index,
        updated_at: now
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
      where("owner_id", "==", user.uid),
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
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const q = query(
      collection(db, "class_skills"),
      where("owner_id", "==", user.uid),
      where("class_id", "==", classId),
      orderBy("order_index", "asc")
    );

    const querySnapshot = await getDocs(q);
    const skillIds = querySnapshot.docs.map(doc => doc.data().skill_id);

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
            category_id: category.id,
            level: item.level as any,
            icon: "Book",
            resource_link: ""
          });
        }
      }
    }
  }
};
