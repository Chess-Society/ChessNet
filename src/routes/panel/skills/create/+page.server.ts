import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { skillSchema } from '$lib/schemas/skill';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) throw redirect(303, '/login');

  const form = await superValidate(zod(skillSchema as any));
  let availablePrerequisites = [];

  try {
    const skillsSnap = await adminDb.collection("skills")
      .where("owner_id", "==", locals.user.uid)
      .get();
    
    availablePrerequisites = (skillsSnap?.docs || []).map((doc: any) => serializeRecord({
      id: doc.id,
      name: doc.data().name,
      difficulty: doc.data().difficulty
    }));
  } catch (e) {
    console.error("Error loading prerequisites for create page:", e);
  }

  return {
    form,
    availablePrerequisites,
    user: locals.user
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) throw redirect(303, '/login');

    const form = await superValidate(request, zod(skillSchema as any));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const skillData = {
        ...form.data,
        owner_id: locals.user.uid,
        created_at: new Date(),
        updated_at: new Date(),
        // Legacy mapping
        category_id: form.data.categoryId,
        estimated_hours: form.data.estimatedHours,
        learning_objectives: form.data.learningObjectives.filter(v => v.trim() !== ''),
        assessment_criteria: form.data.assessmentCriteria.filter(v => v.trim() !== ''),
        order_index: form.data.orderIndex,
        resource_link: form.data.resourceLink,
        resources: form.data.resources.filter(v => v.trim() !== '')
      };

      await adminDb.collection('skills').add(skillData);
    } catch (error) {
      console.error('Error creating skill:', error);
      return fail(500, { form, error: 'Failed to create skill' });
    }

    throw redirect(303, '/panel/skills');
  }
};
