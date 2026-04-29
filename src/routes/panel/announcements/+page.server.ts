import { adminDb, ownerFilter, Filter } from '$lib/server/firebase-admin';
import { serverCommunicationApi } from '$lib/server/communication';
import type { PageServerLoad, Actions } from './$types';
import { serializeRecord } from '$lib/server/serialize';
import { error, redirect } from '@sveltejs/kit';
import { checkAnnouncementAccess } from '$lib/server/plans';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) throw redirect(302, '/login');

  const role = locals.role;
  const isAdmin = locals.isAdmin;
  const cleanEmail = user.email?.toLowerCase();

  const planAccess = await checkAnnouncementAccess(user.uid, isAdmin);

  try {
    // 1. Fetch SENT announcements
    let sentAnnouncements: any[] = [];
    try {
      let announcementsQuery;
      if (isAdmin) {
        announcementsQuery = adminDb.collection("announcements")
          .where(ownerFilter(user.uid));
      } else {
        announcementsQuery = adminDb.collection("announcements")
          .where(ownerFilter(user.uid));
      }

      const announcementsSnap = await announcementsQuery
        .orderBy("createdAt", "desc")
        .get();
      sentAnnouncements = announcementsSnap.docs.map((d: any) => ({ id: d.id, ...d.data(), _type: 'sent' }));
    } catch (queryErr: any) {
      console.warn('⚠️ Announcements history: Query failed, falling back.');
      const announcementsSnap = await adminDb.collection("announcements").get();
      sentAnnouncements = announcementsSnap.docs
        .map((d: any) => ({ id: d.id, ...d.data(), _type: 'sent' }))
        .filter((a: any) => {
          return a.ownerId === user.uid || a.ownerId === user.uid;
        })
        .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    // 2. Fetch RECEIVED announcements (if parent/student)
    let receivedAnnouncements: any[] = [];
    const childrenSnap = await adminDb.collection("students")
      .where(Filter.or(
        Filter.where("parentEmail", "==", cleanEmail),
        Filter.where("parentEmail", "==", cleanEmail),
        Filter.where("email", "==", cleanEmail),
        Filter.where("studentEmail", "==", cleanEmail)
      ))
      .get();
    
    if (!childrenSnap.empty) {
      const children = childrenSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      const schoolIds = [...new Set(children.map((c: any) => c.schoolId || c.schoolId).filter(Boolean))];
      const classIds = [...new Set(children.map((c: any) => c.classId || c.classId).filter(Boolean))];
      
      const allAnnouncementsSnap = await adminDb.collection("announcements")
        .where("isPublished", "==", true)
        .limit(200)
        .get();
      
      receivedAnnouncements = allAnnouncementsSnap.docs
        .map((doc: any) => ({ id: doc.id, ...doc.data(), _type: 'received' }))
        .filter((a: any) => {
          // 1. Security: Exclude global/system and ensure association
          if (a.isGlobal || a.isSystem) return false;
          
          const isFromMyTeacher = children.some((c: any) => c.ownerId === a.ownerId);
          const isFromMySchool = a.schoolId && a.schoolId !== 'all' && schoolIds.includes(a.schoolId);
          
          // If not from my teacher or school, it's not for me
          if (!isFromMyTeacher && !isFromMySchool) return false;

          // 2. Targeting logic
          if (a.targetType === 'all') return true;
          if (a.targetType === 'school') {
            return !a.targetId || a.targetId === 'all' || schoolIds.includes(a.targetId);
          }
          if (a.targetType === 'class') {
            return classIds.includes(a.targetId);
          }
          if (a.targetType === 'student' || a.targetType === 'parent') {
            return children.some((c: any) => c.id === a.targetId);
          }
          
          return false;
        });
    }

    // Combine and sort
    // Deduplicate if something is both sent and received (e.g. testing)
    const combined = [...sentAnnouncements];
    receivedAnnouncements.forEach(ra => {
      if (!combined.some(sa => sa.id === ra.id)) {
        combined.push(ra);
      }
    });

    const sorted = combined.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    const classesSnap = await adminDb.collection("classes")
      .where(ownerFilter(user.uid))
      .get();
    const classes = classesSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    return {
      announcements: serializeRecord<any[]>(sorted),
      classes: serializeRecord<any[]>(classes),
      role,
      isAdmin,
      planAccess
    };
  } catch (e: any) {
    console.error('❌ [Announcements] Load error:', e);
    return {
      announcements: [],
      classes: [],
      role,
      isAdmin,
      planAccess,
      error: e.message
    };
  }
};

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) throw error(401);

    const planAccess = await checkAnnouncementAccess(user.uid, locals.isAdmin);
    if (!planAccess.allowed) {
      return { success: false, message: planAccess.reason };
    }

    const data = await request.formData();
    const title = data.get('title') as string;
    const content = data.get('content') as string;
    const targetType = data.get('targetType') as string || 'school';
    const schoolId = data.get('schoolId') as string || 'all';
    let targetId = data.get('classId') as string || undefined;
    const priority = (data.get('priority') as "low" | "normal" | "high" | "urgent") || 'normal';
    const isPublished = data.get('isPublished') === 'true';
    
    let finalTargetType = targetType as any;
    
    if (targetType === 'school') {
      if (schoolId === 'all') {
        finalTargetType = 'all';
        targetId = undefined;
      } else {
        targetId = schoolId;
      }
    }

    try {
      await serverCommunicationApi.createAnnouncement(
        user.uid,
        schoolId,
        title,
        content,
        targetType === 'class' ? 'class' : 'general',
        finalTargetType,
        targetId,
        priority,
        isPublished
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
      await serverCommunicationApi.deleteAnnouncement(id, user.uid);
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
      await serverCommunicationApi.publishAnnouncement(id, user.uid);
      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};
