import { db } from "$lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  increment,
  arrayUnion,
  arrayRemove,
  where,
  getDoc,
  type Unsubscribe
} from "firebase/firestore";
import type { SocialPost } from "$lib/types";

export const socialApi = {

  /**
   * Obtiene el perfil de un usuario.
   */
  async getUserProfile(userId: string): Promise<any> {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
  },

  /**
   * Crea una nueva publicación en el Faculty Stream.
   */
  async createPost(post: Omit<SocialPost, 'id' | 'createdAt' | 'reactions' | 'votes' | 'tipsTotal'>): Promise<string> {
    const postData = {
      ...post,
      reactions: {},
      votes: { up: [], down: [] },
      tipsTotal: 0,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "faculty_stream"), postData);
    return docRef.id;
  },

  /**
   * Escucha publicaciones en tiempo real.
   */
  subscribeToStream(callback: (posts: SocialPost[]) => void, maxPosts: number = 50): Unsubscribe {
    const q = query(
      collection(db, "faculty_stream"),
      orderBy("createdAt", "desc"),
      limit(maxPosts)
    );

    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as SocialPost[];
      callback(posts);
    });
  },

  /**
   * Escucha publicaciones de un usuario específico.
   */
  subscribeToUserPosts(userId: string, callback: (posts: SocialPost[]) => void): Unsubscribe {
    const q = query(
      collection(db, "faculty_stream"),
      where("authorId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as SocialPost[];
      callback(posts);
    });
  },

  /**
   * Elimina una publicación.
   */
  async deletePost(postId: string): Promise<void> {
    await deleteDoc(doc(db, "faculty_stream", postId));
  },

  /**
   * Gestiona los votos de una publicación.
   */
  async votePost(postId: string, userId: string, type: 'up' | 'down'): Promise<void> {
    const postRef = doc(db, "faculty_stream", postId);
    const opposite = type === 'up' ? 'down' : 'up';
    
    // Simplificado: En una app real usaríamos una transacción para evitar inconsistencias
    await updateDoc(postRef, {
      [`votes.${type}`]: arrayUnion(userId),
      [`votes.${opposite}`]: arrayRemove(userId)
    });
  },

  /**
   * Añade una reacción a una publicación.
   */
  async reactToPost(postId: string, userId: string, emoji: string): Promise<void> {
    const postRef = doc(db, "faculty_stream", postId);
    await updateDoc(postRef, {
      [`reactions.${emoji}`]: arrayUnion(userId)
    });
  },

  /**
   * Elimina una reacción de una publicación.
   */
  async unreactFromPost(postId: string, userId: string, emoji: string): Promise<void> {
    const postRef = doc(db, "faculty_stream", postId);
    await updateDoc(postRef, {
      [`reactions.${emoji}`]: arrayRemove(userId)
    });
  },

  /**
   * Destaca o quita el destacado de una publicación (Admin Only).
   */
  async toggleFeaturePost(postId: string, isFeatured: boolean): Promise<void> {
    const postRef = doc(db, "faculty_stream", postId);
    await updateDoc(postRef, {
      isFeatured: isFeatured
    });
  }
};
