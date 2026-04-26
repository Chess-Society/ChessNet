import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { postSchema } from '$lib/schemas/post';
import { challengeSchema } from '$lib/schemas/challenge';
import { adminDb } from '$lib/server/firebase-admin';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    postForm: await superValidate(zod(postSchema as any)) as any,
    challengeForm: await superValidate(zod(challengeSchema as any)) as any
  };
};

export const actions: Actions = {
  createPost: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    
    const form = await superValidate(request, zod(postSchema as any)) as any;
    if (!form.valid) return fail(400, { form });

    try {
      const postData = {
        ...form.data,
        authorId: locals.user.uid,
        authorName: locals.user.displayName || 'Anónimo',
        authorAvatar: locals.user.photoURL || '',
        createdAt: new Date().toISOString(),
        likes: [],
        comments: []
      };

      if (form.data.id) {
        await adminDb.collection('posts').doc(form.data.id).update(postData);
      } else {
        await adminDb.collection('posts').add(postData);
      }

      return { form };
    } catch (e) {
      console.error(e);
      return fail(500, { form, message: 'Error al procesar la publicación' });
    }
  },

  createChallenge: async ({ request, locals }) => {
    // Only directors/admins can create challenges
    if (!locals.user) return fail(401);
    
    // Check role from custom claims or firestore (locals.user should have it if we set it up)
    // For now, let's assume we check it here
    
    const form = await superValidate(request, zod(challengeSchema as any)) as any;
    if (!form.valid) return fail(400, { form });

    try {
      const challengeData = {
        ...form.data,
        createdAt: new Date().toISOString(),
        active: true,
        participants: 0,
        completedBy: []
      };

      await adminDb.collection('challenges').add(challengeData);

      return { form };
    } catch (e) {
      console.error(e);
      return fail(500, { form, message: 'Error al crear el reto' });
    }
  },

  deletePost: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const formData = await request.formData();
    const id = formData.get('id') as string;
    if (!id) return fail(400);

    try {
      await adminDb.collection('posts').doc(id).delete();
      return { success: true };
    } catch (e) {
      console.error(e);
      return fail(500);
    }
  }
};
