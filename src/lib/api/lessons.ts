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
  writeBatch,
  limit
} from "firebase/firestore";
import type { CurriculumUnit, Lesson } from "$lib/types";

export const lessonsApi = {
  // Get curriculum units by school
  async getCurriculumUnits(schoolId: string): Promise<CurriculumUnit[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const q = query(
      collection(db, "curriculum_units"),
      where("owner_id", "==", user.uid),
      where("school_id", "==", schoolId),
      orderBy("order_index")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<CurriculumUnit>(doc));
  },

  // Get a specific curriculum unit
  async getCurriculumUnit(id: string): Promise<CurriculumUnit> {
    const docSnap = await getDoc(doc(db, "curriculum_units", id));
    if (!docSnap.exists()) throw new Error("Curriculum unit not found");
    return toData<CurriculumUnit>(docSnap);
  },

  // Create a new curriculum unit
  async createCurriculumUnit(
    schoolId: string,
    title: string,
    description?: string,
    level?: string,
    color?: string,
  ): Promise<CurriculumUnit> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    // Get the next order index
    const q = query(
      collection(db, "curriculum_units"),
      where("owner_id", "==", user.uid),
      where("school_id", "==", schoolId),
      orderBy("order_index", "desc"),
      limit(1)
    );
    const lastSnap = await getDocs(q);
    const nextOrderIndex = !lastSnap.empty ? (lastSnap.docs[0].data().order_index || 0) + 1 : 0;

    const unitData = {
      owner_id: user.uid,
      school_id: schoolId,
      title,
      description: description || null,
      level: level || null,
      color: color || null,
      order_index: nextOrderIndex,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "curriculum_units"), unitData);
    const docSnap = await getDoc(docRef);
    return toData<CurriculumUnit>(docSnap);
  },

  // Update a curriculum unit
  async updateCurriculumUnit(
    id: string,
    updates: Partial<CurriculumUnit>,
  ): Promise<CurriculumUnit> {
    const docRef = doc(db, "curriculum_units", id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    const docSnap = await getDoc(docRef);
    return toData<CurriculumUnit>(docSnap);
  },

  // Delete a curriculum unit
  async deleteCurriculumUnit(id: string): Promise<void> {
    await deleteDoc(doc(db, "curriculum_units", id));
  },

  // Reorder curriculum units
  async reorderCurriculumUnits(
    units: { id: string; order_index: number }[],
  ): Promise<void> {
    const batch = writeBatch(db);
    units.forEach(unit => {
      const docRef = doc(db, "curriculum_units", unit.id);
      batch.update(docRef, { order_index: unit.order_index });
    });
    await batch.commit();
  },

  // Get lessons by unit
  async getLessonsByUnit(unitId: string): Promise<Lesson[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const q = query(
      collection(db, "lessons"),
      where("owner_id", "==", user.uid),
      where("unit_id", "==", unitId),
      orderBy("order_index")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Lesson>(doc));
  },

  // Get a specific lesson
  async getLesson(id: string): Promise<Lesson> {
    const docSnap = await getDoc(doc(db, "lessons", id));
    if (!docSnap.exists()) throw new Error("Lesson not found");
    return toData<Lesson>(docSnap);
  },

  // Create a new lesson
  async createLesson(
    unitId: string,
    title: string,
    description?: string,
    content?: any,
    objectives?: string[],
    durationMinutes?: number,
    difficulty?: string,
  ): Promise<Lesson> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    // Get the next order index
    const q = query(
      collection(db, "lessons"),
      where("owner_id", "==", user.uid),
      where("unit_id", "==", unitId),
      orderBy("order_index", "desc"),
      limit(1)
    );
    const lastSnap = await getDocs(q);
    const nextOrderIndex = !lastSnap.empty ? (lastSnap.docs[0].data().order_index || 0) + 1 : 0;

    const lessonData = {
      owner_id: user.uid,
      unit_id: unitId,
      title,
      description: description || null,
      content: content || null,
      objectives: objectives || [],
      duration_minutes: durationMinutes || 60,
      difficulty: difficulty || null,
      order_index: nextOrderIndex,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "lessons"), lessonData);
    const docSnap = await getDoc(docRef);
    return toData<Lesson>(docSnap);
  },

  // Update a lesson
  async updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson> {
    const docRef = doc(db, "lessons", id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString(),
    });

    const docSnap = await getDoc(docRef);
    return toData<Lesson>(docSnap);
  },

  // Delete a lesson
  async deleteLesson(id: string): Promise<void> {
    await deleteDoc(doc(db, "lessons", id));
  },

  // Reorder lessons
  async reorderLessons(
    lessons: { id: string; order_index: number }[],
  ): Promise<void> {
    const batch = writeBatch(db);
    lessons.forEach(lesson => {
      const docRef = doc(db, "lessons", lesson.id);
      batch.update(docRef, { order_index: lesson.order_index });
    });
    await batch.commit();
  },

  // Get lesson resources
  async getLessonResources(lessonId: string): Promise<any[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const q = query(
      collection(db, "lesson_resources"),
      where("owner_id", "==", user.uid),
      where("lesson_id", "==", lessonId),
      orderBy("order_index")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<any>(doc));
  },

  // Add resource to lesson
  async addLessonResource(
    lessonId: string,
    title: string,
    type: "url" | "file" | "exercise" | "position",
    url?: string,
    filePath?: string,
    content?: any,
  ): Promise<any> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    // Get the next order index
    const q = query(
      collection(db, "lesson_resources"),
      where("owner_id", "==", user.uid),
      where("lesson_id", "==", lessonId),
      orderBy("order_index", "desc"),
      limit(1)
    );
    const lastSnap = await getDocs(q);
    const nextOrderIndex = !lastSnap.empty ? (lastSnap.docs[0].data().order_index || 0) + 1 : 0;

    const resourceData = {
      owner_id: user.uid,
      lesson_id: lessonId,
      title,
      type,
      url: url || null,
      file_path: filePath || null,
      content: content || null,
      order_index: nextOrderIndex,
      created_at: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "lesson_resources"), resourceData);
    const docSnap = await getDoc(docRef);
    return toData<any>(docSnap);
  },

  // Update lesson resource
  async updateLessonResource(id: string, updates: any): Promise<any> {
    const docRef = doc(db, "lesson_resources", id);
    await updateDoc(docRef, updates);
    const docSnap = await getDoc(docRef);
    return toData<any>(docSnap);
  },

  // Delete lesson resource
  async deleteLessonResource(id: string): Promise<void> {
    await deleteDoc(doc(db, "lesson_resources", id));
  },
};
