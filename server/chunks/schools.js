import { a as auth, d as db } from "./firebase.js";
import { query, collection, where, getDocs, deleteDoc, doc, updateDoc, getDoc, addDoc } from "firebase/firestore";
const toData = (doc2) => {
  return { id: doc2.id, ...doc2.data() };
};
const schoolsApi = {
  // Get all schools for the current user (where they are a member)
  async getMySchools(userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    const membershipsQuery = query(
      collection(db, "memberships"),
      where("user_id", "==", uid)
    );
    const membershipsSnapshot = await getDocs(membershipsQuery);
    const schoolIds = membershipsSnapshot.docs.map((doc2) => doc2.data().school_id);
    if (schoolIds.length === 0) return [];
    const schoolsQuery = query(
      collection(db, "colleges"),
      where("__name__", "in", schoolIds)
    );
    const schoolsSnapshot = await getDocs(schoolsQuery);
    return schoolsSnapshot.docs.map((doc2) => toData(doc2));
  },
  // Get a specific school
  async getSchool(id, userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    const docRef = doc(db, "colleges", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error("School not found");
    const q = query(
      collection(db, "memberships"),
      where("school_id", "==", id),
      where("user_id", "==", uid)
    );
    const membershipSnap = await getDocs(q);
    if (membershipSnap.empty) {
      throw new Error("Access denied: Not a member of this school");
    }
    return toData(docSnap);
  },
  // Create a new school
  async createSchool(name, city) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const schoolData = {
      name,
      city: city || null,
      owner_id: user.uid,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const docRef = await addDoc(collection(db, "colleges"), schoolData);
    await this.addMember(docRef.id, user.uid, "owner");
    const docSnap = await getDoc(docRef);
    return toData(docSnap);
  },
  // Update a school
  async updateSchool(id, updates) {
    const docRef = doc(db, "colleges", id);
    await updateDoc(docRef, {
      ...updates,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    const docSnap = await getDoc(docRef);
    return toData(docSnap);
  },
  // Delete a school
  async deleteSchool(id) {
    await deleteDoc(doc(db, "colleges", id));
  },
  // Get school members
  async getSchoolMembers(schoolId) {
    const q = query(
      collection(db, "memberships"),
      where("school_id", "==", schoolId)
    );
    const querySnapshot = await getDocs(q);
    const memberships = querySnapshot.docs.map((doc2) => toData(doc2));
    for (const membership of memberships) {
      const profileSnap = await getDoc(doc(db, "profiles", membership.user_id));
      if (profileSnap.exists()) {
        membership.profiles = toData(profileSnap);
      }
    }
    return memberships;
  },
  // Add a member to a school
  async addMember(schoolId, userId, role) {
    const membershipData = {
      school_id: schoolId,
      user_id: userId,
      role,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const docRef = await addDoc(collection(db, "memberships"), membershipData);
    const docSnap = await getDoc(docRef);
    return toData(docSnap);
  },
  // Update member role
  async updateMemberRole(membershipId, role) {
    const docRef = doc(db, "memberships", membershipId);
    await updateDoc(docRef, { role });
    const docSnap = await getDoc(docRef);
    return toData(docSnap);
  },
  // Remove a member from a school
  async removeMember(membershipId) {
    await deleteDoc(doc(db, "memberships", membershipId));
  },
  // Check if user is member of school
  async isMember(schoolId) {
    const user = auth.currentUser;
    if (!user) return false;
    const q = query(
      collection(db, "memberships"),
      where("school_id", "==", schoolId),
      where("user_id", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  },
  // Get user's role in school
  async getUserRole(schoolId) {
    const user = auth.currentUser;
    if (!user) return null;
    const q = query(
      collection(db, "memberships"),
      where("school_id", "==", schoolId),
      where("user_id", "==", user.uid)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return snapshot.docs[0].data().role;
  }
};
export {
  schoolsApi as s
};
