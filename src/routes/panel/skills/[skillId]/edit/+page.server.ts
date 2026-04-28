import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { skillSchema } from '$lib/schemas/skill';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.user) throw redirect(303, '/login');

  const { skillId } = params;

  try {
    const skillSnap = await adminDb.collection("skills").doc(skillId).get();

    if (!skillSnap.exists || skillSnap.data()?.ownerId !== locals.user.uid) {
      throw error(404, 'Skill not found');
    }

    const data = skillSnap.data();
    
    // Map DB to Schema
    const initialData = {
      name: data?.name || '',
      description: data?.description || '',
      categoryId: data?.category_id || data?.categoryId || '',
      difficulty: data?.difficulty || 1,
      estimatedHours: data?.estimated_hours || data?.estimatedHours || 1,
      prerequisites: data?.prerequisites || [],
      learningObjectives: data?.learning_objectives || data?.learningObjectives || [],
      assessmentCriteria: data?.assessment_criteria || data?.assessmentCriteria || [],
      resources: data?.resources || [],
      icon: data?.icon || '🎯',
      resourceLink: data?.resource_link || data?.resourceLink || '',
      orderIndex: data?.order_index !== undefined ? data?.order_index : (data?.orderIndex || 0),
      active: data?.active !== undefined ? data?.active : true
    };

    const form = await superValidate(initialData, zod(skillSchema as any)) as any;

    // Load available prerequisites
    const skillsSnap = await adminDb.collection("skills")
      .where("ownerId", "==", locals.user.uid)
      .get();
    
    const availablePrerequisites = (skillsSnap?.docs || [])
      .map((doc: any) => serializeRecord({
        id: doc.id,
        name: doc.data().name,
        difficulty: doc.data().difficulty
      }))
      .filter((s: any) => s.id !== skillId);

    return {
      form,
      availablePrerequisites,
      skillId,
      user: locals.user
    };
  } catch (e: any) {
    console.error("Error loading skill for edit:", e);
    if (e.status) throw e;
    throw error(500, 'Internal Server Error');
  }
};

export const actions: Actions = {
  update: async ({ request, locals, params }) => {
    if (!locals.user) throw redirect(303, '/login');
    const { skillId } = params;

    const form = await superValidate(request, zod(skillSchema as any)) as any;

    if (!form.valid) {
      return message(form, 'Revisa los errores del formulario', { status: 400 });
    }

    try {
      const skillRef = adminDb.collection('skills').doc(skillId);
      const skillSnap = await skillRef.get();

      if (!skillSnap.exists || skillSnap.data()?.ownerId !== locals.user.uid) {
        return message(form, 'Habilidad no encontrada o sin permisos', { status: 403 });
      }

      const updateData = {
        ...form.data,
        updatedAt: new Date(),
        // Legacy mapping for backward compatibility
        category_id: form.data.categoryId,
        estimated_hours: form.data.estimatedHours,
        learning_objectives: form.data.learningObjectives.filter((v: string) => v.trim() !== ''),
        assessment_criteria: form.data.assessmentCriteria.filter((v: string) => v.trim() !== ''),
        order_index: form.data.orderIndex,
        resource_link: form.data.resourceLink,
        resources: form.data.resources.filter((v: string) => v.trim() !== '')
      };

      await skillRef.update(updateData);
    } catch (err: any) {
      console.error('Error updating skill:', err);
      return message(form, 'Error al actualizar la habilidad: ' + err.message, { status: 500 });
    }

    throw redirect(303, '/panel/skills');
  },

  delete: async ({ locals, params }) => {
    if (!locals.user) throw redirect(303, '/login');
    const { skillId } = params;

    try {
      const skillRef = adminDb.collection('skills').doc(skillId);
      const skillSnap = await skillRef.get();

      if (!skillSnap.exists || skillSnap.data()?.ownerId !== locals.user.uid) {
        throw error(403, 'Unauthorized');
      }

      await skillRef.delete();
    } catch (err: any) {
      console.error('Error deleting skill:', err);
      throw error(500, 'Failed to delete skill');
    }

    throw redirect(303, '/panel/skills');
  }
};
