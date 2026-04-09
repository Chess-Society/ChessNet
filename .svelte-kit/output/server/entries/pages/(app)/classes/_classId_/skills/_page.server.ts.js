import { c as classesApi } from "../../../../../../chunks/classes.js";
import { a as auth, d as db } from "../../../../../../chunks/firebase.js";
import { query, collection, where, orderBy, getDocs, getDoc, doc, writeBatch, deleteDoc, updateDoc, addDoc, limit } from "firebase/firestore";
const toData$1 = (doc2) => {
  return { id: doc2.id, ...doc2.data() };
};
const skillsApi = {
  // Get all skills for the specified user (or current user)
  async getMySkills(userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    const q = query(
      collection(db, "skills"),
      where("user_id", "==", uid),
      orderBy("order_index", "asc")
    );
    const querySnapshot = await getDocs(q);
    const skills = querySnapshot.docs.map((doc2) => toData$1(doc2));
    for (const skill of skills) {
      if (skill.category_id) {
        const catDoc = await getDoc(doc(db, "categories", skill.category_id));
        if (catDoc.exists()) {
          skill.categories = toData$1(catDoc);
        }
      }
    }
    return skills;
  },
  // Get skills by category
  async getSkillsByCategory(categoryId) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const q = query(
      collection(db, "skills"),
      where("user_id", "==", user.uid),
      where("category_id", "==", categoryId),
      orderBy("order_index", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc2) => toData$1(doc2));
  },
  // Get a specific skill
  async getSkill(id) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const docRef = doc(db, "skills", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data()?.user_id !== user.uid) {
      throw new Error("Skill not found or access denied");
    }
    const skill = toData$1(docSnap);
    if (skill.category_id) {
      const catDoc = await getDoc(doc(db, "categories", skill.category_id));
      if (catDoc.exists()) {
        skill.categories = toData$1(catDoc);
      }
    }
    return skill;
  },
  // Create a new skill
  async createSkill(skillData) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const docRef = await addDoc(collection(db, "skills"), {
      user_id: user.uid,
      name: skillData.name,
      category_id: skillData.category_id,
      description: skillData.description || "",
      icon: skillData.icon || "",
      resource_link: skillData.resource_link || "",
      level: skillData.level || 1,
      order_index: 0,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    const docSnap = await getDoc(docRef);
    return toData$1(docSnap);
  },
  // Update a skill
  async updateSkill(id, updates) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const docRef = doc(db, "skills", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data()?.user_id !== user.uid) {
      throw new Error("Skill not found or access denied");
    }
    await updateDoc(docRef, {
      ...updates,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    const updatedSnap = await getDoc(docRef);
    return toData$1(updatedSnap);
  },
  // Delete a skill
  async deleteSkill(id) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const docRef = doc(db, "skills", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists() || docSnap.data()?.user_id !== user.uid) {
      throw new Error("Skill not found or access denied");
    }
    await deleteDoc(docRef);
  },
  // Reorder skills
  async reorderSkills(skillIds) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const batch = writeBatch(db);
    const now = (/* @__PURE__ */ new Date()).toISOString();
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
  async getSkillsWithProgress(studentId) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const progressQuery = query(
      collection(db, "student_skills"),
      where("user_id", "==", user.uid),
      where("student_id", "==", studentId)
    );
    const progressSnap = await getDocs(progressQuery);
    const progressMap = /* @__PURE__ */ new Map();
    progressSnap.docs.forEach((d) => progressMap.set(d.data().skill_id, d.data()));
    const skills = await this.getMySkills();
    return skills.map((skill) => ({
      ...skill,
      progress: progressMap.get(skill.id) || null
    }));
  },
  // Get skills assigned to a class
  async getClassSkills(classId) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const q = query(
      collection(db, "class_skills"),
      where("owner_id", "==", user.uid),
      where("class_id", "==", classId),
      orderBy("order_index", "asc")
    );
    const querySnapshot = await getDocs(q);
    const skillIds = querySnapshot.docs.map((doc2) => doc2.data().skill_id);
    const skills = [];
    for (const sid of skillIds) {
      const skillDoc = await getDoc(doc(db, "skills", sid));
      if (skillDoc.exists()) {
        skills.push(toData$1(skillDoc));
      }
    }
    return skills;
  }
};
const toData = (doc2) => {
  return { id: doc2.id, ...doc2.data() };
};
const classSkillsApi = {
  // Get all skills assigned to a class
  async getClassSkills(classId, userId) {
    const uid = userId || auth.currentUser?.uid;
    if (!uid) throw new Error("User not authenticated");
    const q = query(
      collection(db, "class_skills"),
      where("owner_id", "==", uid),
      where("class_id", "==", classId),
      orderBy("order_index", "asc")
    );
    const querySnapshot = await getDocs(q);
    const classSkills = querySnapshot.docs.map((doc2) => toData(doc2));
    for (const cs of classSkills) {
      if (cs.skill_id) {
        const skillDoc = await getDoc(doc(db, "skills", cs.skill_id));
        if (skillDoc.exists()) {
          cs.skill = toData(skillDoc);
        }
      }
    }
    return classSkills;
  },
  // Get all classes where a skill is assigned
  async getSkillClasses(skillId) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const q = query(
      collection(db, "class_skills"),
      where("owner_id", "==", user.uid),
      where("skill_id", "==", skillId),
      orderBy("created_at", "desc")
    );
    const querySnapshot = await getDocs(q);
    const classSkills = querySnapshot.docs.map((doc2) => toData(doc2));
    for (const cs of classSkills) {
      if (cs.class_id) {
        const classDoc = await getDoc(doc(db, "classes", cs.class_id));
        if (classDoc.exists()) {
          cs.class = toData(classDoc);
        }
      }
    }
    return classSkills;
  },
  // Assign a skill to a class
  async assignSkillToClass(classId, skillId, orderIndex) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const q = query(
      collection(db, "class_skills"),
      where("owner_id", "==", user.uid),
      where("class_id", "==", classId),
      where("skill_id", "==", skillId)
    );
    const existingSnap = await getDocs(q);
    if (!existingSnap.empty) {
      throw new Error("Skill is already assigned to this class");
    }
    if (orderIndex === void 0) {
      const lastQ = query(
        collection(db, "class_skills"),
        where("owner_id", "==", user.uid),
        where("class_id", "==", classId),
        orderBy("order_index", "desc"),
        limit(1)
      );
      const lastSnap = await getDocs(lastQ);
      orderIndex = lastSnap.empty ? 1 : (lastSnap.docs[0].data().order_index || 0) + 1;
    }
    const docRef = await addDoc(collection(db, "class_skills"), {
      owner_id: user.uid,
      class_id: classId,
      skill_id: skillId,
      order_index: orderIndex,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    const docSnap = await getDoc(docRef);
    return toData(docSnap);
  },
  // Assign multiple skills to a class
  async assignSkillsToClass(classId, skillIds) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const lastQ = query(
      collection(db, "class_skills"),
      where("owner_id", "==", user.uid),
      where("class_id", "==", classId),
      orderBy("order_index", "desc"),
      limit(1)
    );
    const lastSnap = await getDocs(lastQ);
    let nextOrderIndex = lastSnap.empty ? 1 : (lastSnap.docs[0].data().order_index || 0) + 1;
    const batch = writeBatch(db);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newRefs = [];
    for (const skillId of skillIds) {
      const docRef = doc(collection(db, "class_skills"));
      batch.set(docRef, {
        owner_id: user.uid,
        class_id: classId,
        skill_id: skillId,
        order_index: nextOrderIndex++,
        created_at: now
      });
      newRefs.push(docRef);
    }
    await batch.commit();
    const result = [];
    for (const ref of newRefs) {
      const snap = await getDoc(ref);
      if (snap.exists()) result.push(toData(snap));
    }
    return result;
  },
  // Remove a skill from a class
  async removeSkillFromClass(classId, skillId) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const q = query(
      collection(db, "class_skills"),
      where("owner_id", "==", user.uid),
      where("class_id", "==", classId),
      where("skill_id", "==", skillId)
    );
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  },
  // Remove multiple skills from a class
  async removeSkillsFromClass(classId, skillIds) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    for (const skillId of skillIds) {
      await this.removeSkillFromClass(classId, skillId);
    }
  },
  // Reorder skills in a class
  async reorderClassSkills(classId, skillIds) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const batch = writeBatch(db);
    for (let i = 0; i < skillIds.length; i++) {
      const skillId = skillIds[i];
      const q = query(
        collection(db, "class_skills"),
        where("owner_id", "==", user.uid),
        where("class_id", "==", classId),
        where("skill_id", "==", skillId)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        batch.update(snap.docs[0].ref, { order_index: i });
      }
    }
    await batch.commit();
  },
  // Get class curriculum (skills with details)
  async getClassCurriculum(classId) {
    return this.getClassSkills(classId);
  },
  // Copy curriculum from one class to another
  async copyCurriculum(fromClassId, toClassId) {
    const sourceSkills = await this.getClassSkills(fromClassId);
    if (!sourceSkills || sourceSkills.length === 0) {
      return [];
    }
    const skillIds = sourceSkills.map((s) => s.skill_id);
    return this.assignSkillsToClass(toClassId, skillIds);
  }
};
const load = async ({ locals, params }) => {
  console.log("🎯 Class skills page server load - User:", locals.user?.email || "none");
  console.log("🎯 Class ID:", params.classId);
  if (!locals.user) {
    return {
      user: null,
      class: null,
      assignedSkills: [],
      availableSkillsByCategory: {},
      stats: { total_assigned: 0, total_available: 0, categories_count: 0 }
    };
  }
  try {
    const classId = params.classId;
    const [classData, assignedClassSkills, allSkills] = await Promise.all([
      classesApi.getClass(classId, locals.user.id),
      classSkillsApi.getClassSkills(classId, locals.user.id),
      skillsApi.getMySkills(locals.user.id)
    ]);
    if (!classData) {
      return {
        user: locals.user,
        class: null,
        assignedSkills: [],
        availableSkillsByCategory: {},
        stats: { total_assigned: 0, total_available: 0, categories_count: 0 }
      };
    }
    const assignedSkills = assignedClassSkills.map((cs) => ({
      ...cs.skill,
      assigned_at: cs.created_at,
      order: cs.order_index,
      assignment_id: cs.id
    }));
    const assignedSkillIds = assignedSkills.map((s) => s.id);
    const availableSkills = allSkills.filter((s) => !assignedSkillIds.includes(s.id));
    const availableSkillsByCategory = availableSkills.reduce((acc, skill) => {
      const categoryName = skill.categories?.name || "Sin categoría";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(skill);
      return acc;
    }, {});
    const stats = {
      total_assigned: assignedSkills.length,
      total_available: availableSkills.length,
      categories_count: Object.keys(availableSkillsByCategory).length
    };
    console.log("✅ Class skills data loaded successfully");
    return {
      user: locals.user,
      class: classData,
      assignedSkills,
      availableSkillsByCategory,
      stats
    };
  } catch (err) {
    console.error("❌ Error in class skills page load:", err);
    return {
      user: locals.user,
      class: null,
      assignedSkills: [],
      availableSkillsByCategory: {},
      stats: { total_assigned: 0, total_available: 0, categories_count: 0 }
    };
  }
};
export {
  load
};
