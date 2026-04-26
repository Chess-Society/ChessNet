import { adminDb } from '$lib/server/firebase-admin';
import { communicationApi } from '$lib/api/communication';
import type { PageServerLoad, Actions } from './$types';
import { serializeRecord } from '$lib/server/serialize';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) throw redirect(302, '/login');

  const role = locals.role;
  const isAdmin = locals.isAdmin;

  // Teachers/Admins load all or owned
  const announcementsSnap = await adminDb.collection("announcements")
    .where("ownerId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .get();
  
  const announcements = announcementsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

  const classesSnap = await adminDb.collection("classes").where("owner_id", "==", user.uid).get();
  const classes = classesSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

  return {
    announcements: serializeRecord<any[]>(announcements),
    classes: serializeRecord<any[]>(classes),
    role,
    isAdmin
  };
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
    const priority = (data.get('priority') as "low" | "normal" | "high" | "urgent") || 'normal';
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
        targetType as any,
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
