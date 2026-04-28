import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
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
      .where("ownerId", "==", locals.user.uid)
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
      return message(form, 'Datos inválidos. Por favor revisa el formulario.', { status: 400 });
    }

    try {
      const skillData = {
        ...form.data,
        ownerId: locals.user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Legacy mapping
        category_id: (form.data as any).categoryId,
        estimated_hours: (form.data as any).estimatedHours,
        learning_objectives: ((form.data as any).learningObjectives as string[]).filter((v: string) => v.trim() !== ''),
        assessment_criteria: ((form.data as any).assessmentCriteria as string[]).filter((v: string) => v.trim() !== ''),
        order_index: (form.data as any).orderIndex,
        resource_link: (form.data as any).resourceLink,
        resources: ((form.data as any).resources as string[]).filter((v: string) => v.trim() !== '')
      };

      await adminDb.collection('skills').add(skillData);
      return message(form, '¡Habilidad creada con éxito!');
    } catch (error: any) {
      console.error('Error creating skill:', error);
      return message(form, error.message || 'Failed to create skill', { status: 500 });
    }
  }
};
