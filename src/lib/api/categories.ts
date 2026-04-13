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
  deleteDoc
} from "firebase/firestore";
import type { Category } from "$lib/types";

export const categoriesApi = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const q = query(
      collection(db, "categories"),
      where("owner_id", "==", user.uid),
      orderBy("name", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => toData<Category>(doc));
  },

  // Get a specific category
  async getCategory(id: string): Promise<Category> {
    const docRef = doc(db, "categories", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Category not found");
    }

    return toData<Category>(docSnap);
  },

  // Create a new category
  async createCategory(
    name: string,
    description?: string,
    color?: string
  ): Promise<Category> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const docRef = await addDoc(collection(db, "categories"), {
      owner_id: user.uid,
      name,
      description: description || "",
      color: color || '#3b82f6',
      created_at: new Date().toISOString()
    });

    const docSnap = await getDoc(docRef);
    return toData<Category>(docSnap);
  },

  // Update a category
  async updateCategory(
    id: string, 
    updates: Partial<Pick<Category, 'name' | 'description' | 'color'>>
  ): Promise<Category> {
    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: new Date().toISOString()
    });

    const docSnap = await getDoc(docRef);
    return toData<Category>(docSnap);
  },

  // Delete a category
  async deleteCategory(id: string): Promise<void> {
    const docRef = doc(db, "categories", id);
    await deleteDoc(docRef);
  },

  // Get categories with skill count
  async getCategoriesWithSkillCount(): Promise<(Category & { skills_count: number })[]> {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const categories = await this.getCategories();
    const result = [];

    for (const category of categories) {
      const q = query(
        collection(db, "skills"),
        where("owner_id", "==", user.uid),
        where("category_id", "==", category.id)
      );
      const snap = await getDocs(q);
      result.push({
        ...category,
        skills_count: snap.size
      });
    }

    return result;
  }
};
