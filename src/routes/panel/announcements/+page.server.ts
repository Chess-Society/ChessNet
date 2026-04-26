import { adminDb } from '$lib/server/firebase-admin';
import { communicationApi } from '$lib/api/communication';
import type { PageServerLoad, Actions } from './$types';
import { serializeRecord } from '$lib/server/serialize';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) throw redirect(302, '/login');

  const role = locals.role;
  const isAdmin = locals.isAdmin;

  let announcements: any[] = [];
  let classes: any[] = [];

  if (role === 'parent') {
    // 1. Fetch children to know which announcements are relevant
    const childrenSnap = await adminDb.collection("students")
      .where("parentEmail", "==", user.email?.toLowerCase())
      .get();
    
    const children = childrenSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    const schoolIds = [...new Set(children.map((c: any) => c.school_id || c.schoolId).filter(Boolean))];
    const classIds = [...new Set(children.map((c: any) => c.class_id || c.classId).filter(Boolean))];

    const announcementsSnap = await adminDb.collection("announcements")
      .where("isPublished", "==", true)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();
    
    const allAnnouncements = announcementsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    
    announcements = allAnnouncements.filter((a: any) => {
      if (a.targetType === 'all') return true;
      if (a.targetType === 'school' && schoolIds.includes(a.targetId)) return true;
      if (a.targetType === 'class' && classIds.includes(a.targetId)) return true;
      if (a.targetType === 'student' && children.some(c => c.id === a.targetId)) return true;
      return false;
    });
  } else {
    // Teachers/Admins load all or owned
    const announcementsSnap = await adminDb.collection("announcements")
      .where("ownerId", "==", user.uid)
      .orderBy("createdAt", "desc")
      .get();
    
    announcements = announcementsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const classesSnap = await adminDb.collection("classes").where("owner_id", "==", user.uid).get();
    classes = classesSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  }

  return serializeRecord({
    announcements,
    classes,
    role,
    isAdmin
  });
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) throw error(401);

    const data = await request.formData();
    const title = data.get('title') as string;
    const content = data.get('content') as string;
    const targetType = data.get('targetType') as string || 'school';
    const schoolId = data.get('schoolId') as string || 'all';
    let targetId = data.get('classId') as string || undefined;
    const priority = data.get('priority') as string || 'normal';
    const isPublished = data.get('isPublished') === 'true';
    
    // Si el destino es escuela, el targetId es el schoolId (si no es 'all')
    if (targetType === 'school') {
      targetId = schoolId !== 'all' ? schoolId : undefined;
    }

    try {
      await communicationApi.createAnnouncement(
        schoolId,
        title,
        content,
        targetType === 'class' ? 'class' : 'general',
        targetType,
        targetId,
        priority,
        isPublished,
        user.uid
      );
      return { success: true };
    } catch (e: any) {
      console.error('❌ Error creating announcement:', e);
      return { success: false, message: e.message };
    }
  },

  delete: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) throw error(401);

    const data = await request.formData();
    const id = data.get('id') as string;

    try {
      await communicationApi.deleteAnnouncement(id);
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  publish: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) throw error(401);

    const data = await request.formData();
    const id = data.get('id') as string;

    try {
      await communicationApi.publishAnnouncement(id);
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};
