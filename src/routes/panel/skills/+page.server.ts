import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { adminDb } from '$lib/server/firebase-admin';
import { error } from '@sveltejs/kit';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

import { serializeRecord } from '$lib/server/serialize';
import { checkPlanGating } from '$lib/server/plans';
import { CHESS_SYLLABUS_PRESETS } from '$lib/constants/chess-presets';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let pdf: any;
try {
    pdf = require('pdf-parse');
} catch (e) {
    try {
        pdf = require('pdf-parse/lib/pdf-parse.js');
    } catch (e2) {
        console.error('❌ [ImportAI] Failed to require pdf-parse:', e2);
    }
}

let genAI: GoogleGenerativeAI | null = null;

export const actions: Actions = {
  delete: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const data = await request.formData();
    const id = data.get('id') as string;

    if (!id) return fail(400);

    try {
      const doc = await adminDb.collection('skills').doc(id).get();
      if (!doc.exists || doc.data()?.owner_id !== locals.user.uid) {
        return fail(403);
      }
      await adminDb.collection('skills').doc(id).delete();
      return { success: true };
    } catch (err) {
      console.error('Error deleting skill:', err);
      return fail(500);
    }
  },

  deleteMultiple: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const data = await request.formData();
    const ids = JSON.parse(data.get('ids') as string) as string[];

    if (!ids || ids.length === 0) return fail(400);

    try {
      const batch = adminDb.batch();
      for (const id of ids) {
        const docRef = adminDb.collection('skills').doc(id);
        const doc = await docRef.get();
        if (doc.exists && doc.data()?.owner_id === locals.user.uid) {
          batch.delete(docRef);
        }
      }
      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Error deleting multiple skills:', err);
      return fail(500);
    }
  },

  clearSyllabus: async ({ locals }) => {
    if (!locals.user) return fail(401);
    try {
      const uid = locals.user.uid;
      const snap = await adminDb.collection('skills').where('owner_id', '==', uid).get();
      const batch = adminDb.batch();
      snap.docs.forEach((doc: QueryDocumentSnapshot) => batch.delete(doc.ref));
      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Error clearing syllabus:', err);
      return fail(500);
    }
  },

  importCurriculum: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const data = await request.formData();
    const curriculumStr = data.get('curriculum') as string;
    const curriculum = curriculumStr ? JSON.parse(curriculumStr) : CHESS_SYLLABUS_PRESETS;

    try {
      const uid = locals.user.uid;
      const batch = adminDb.batch();
      curriculum.forEach((skill: any, index: number) => {
        const ref = adminDb.collection('skills').doc();
        batch.set(ref, {
          ...skill,
          owner_id: uid,
          created_at: new Date().toISOString(),
          order: index
        });
      });
      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Error importing curriculum:', err);
      return fail(500);
    }
  },

  reorder: async ({ request, locals }) => {
    if (!locals.user) return fail(401);
    const data = await request.formData();
    const reorderings = JSON.parse(data.get('reorderings') as string) as { id: string, order: number }[];

    try {
      const batch = adminDb.batch();
      for (const r of reorderings) {
        const ref = adminDb.collection('skills').doc(r.id);
        // We could add a check here, but for performance in bulk we'll assume valid IDs
        batch.update(ref, { order: r.order });
      }
      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Error reordering skills:', err);
      return fail(500);
    }
  },

  importAI: async ({ request, locals }) => {
    if (!locals.user) return fail(401);

    const apiKey = env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return fail(500, { message: 'Configuración de IA no disponible (API Key missing)' });
    }

    if (!genAI) {
      genAI = new GoogleGenerativeAI(apiKey);
    }

    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return fail(400, { message: 'No se subió ningún archivo' });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      let pdfText = '';
      try {
          let parse: any = null;
          if (typeof pdf === 'function') {
              parse = pdf;
          } else if (pdf && typeof pdf.default === 'function') {
              parse = pdf.default;
          } else if (pdf && typeof pdf === 'object') {
              parse = pdf.default || pdf;
              if (typeof parse !== 'function' && Object.keys(pdf).length > 0) {
                 const firstKey = Object.keys(pdf).find(k => typeof pdf[k] === 'function');
                 if (firstKey) parse = pdf[firstKey];
              }
          }

          if (typeof parse !== 'function') {
               throw new Error('PDF parsing library was not initialized correctly');
          }

          let pdfData: any;
          try {
              pdfData = await parse(buffer);
          } catch (e: any) {
              if (e.message?.includes("without 'new'") || e.message?.includes("is not a constructor")) {
                  pdfData = await (new parse(buffer));
              } else {
                  throw e;
              }
          }
          
          pdfText = pdfData.text;
      } catch (pdfError: any) {
          return fail(400, { message: 'No se pudo leer el PDF: ' + pdfError.message });
      }

      const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          generationConfig: {
              responseMimeType: "application/json"
          }
      });

      const systemPrompt = `
        Eres un experto coordinador académico de ajedrez. Tu tarea es extraer el temario de un documento PDF.
        
        Debes devolver un OBJETO JSON con la propiedad "skills" que sea un ARRAY de objetos.
        Cada objeto de "skills" debe tener:
        - name: Nombre de la lección
        - description: Descripción pedagógica breve.
        - category: Una de estas categorías exactas: "Táctica", "Estrategia", "Aperturas", "Finales", "Historia".
        - level: "beginner", "intermediate", o "advanced".
        - difficulty: Número del 1 al 5.
        - learningObjectives: Array de strings con objetivos.
        - resources: Array de strings con términos de búsqueda para recursos.
        
        IMPORTANTE:
        1. El idioma de salida debe ser el MISMO que el de entrada (Español predominante).
        2. No añadas Markdown. Solo el JSON puro.
      `;

      const userPrompt = `Texto extraído del PDF:\n\n${pdfText.substring(0, 30000)}`;

      const result = await model.generateContent([
          { text: systemPrompt },
          { text: userPrompt }
      ]);
      
      const response = await result.response;
      let cleanedJson = response.text().trim();
      if (cleanedJson.startsWith('```')) {
          cleanedJson = cleanedJson.replace(/```(json)?|```/g, '').trim();
      }

      const parsed = JSON.parse(cleanedJson);
      const rawSkills = Array.isArray(parsed.skills) ? parsed.skills : (Array.isArray(parsed) ? parsed : []);

      if (rawSkills.length === 0) {
          return fail(422, { message: 'No se detectaron lecciones de ajedrez en este PDF' });
      }

      const batch = adminDb.batch();
      const processedSkills = rawSkills.map((s: any, idx: number) => {
          const ref = adminDb.collection('skills').doc();
          const skillData = {
              name: s.name || 'Sin título',
              description: s.description || '',
              category: s.category || 'Táctica',
              level: s.level || 'beginner',
              difficulty: Number(s.difficulty) || 1,
              learningObjectives: Array.isArray(s.learningObjectives || s.learning_objectives) ? (s.learningObjectives || s.learning_objectives) : [],
              orderIndex: idx,
              resources: Array.isArray(s.resources) ? s.resources : [],
              owner_id: locals.user.uid,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              active: true
          };
          batch.set(ref, skillData);
          return { id: ref.id, ...skillData };
      });

      await batch.commit();
      return { success: true, count: processedSkills.length };

    } catch (error: any) {
      console.error('❌ [ImportAI] Error:', error);
      return fail(500, { message: error.message });
    }
  }
};

export const load: PageServerLoad = async (event) => {
  const { locals } = event;
  
  await checkPlanGating(event, 'premium');

  if (!locals.user) {
    throw error(401, 'User not authenticated');
  }

  try {
    let skillsSnap = await adminDb.collection("skills")
        .where("owner_id", "==", locals.user.uid)
        .get();

    const skills = (skillsSnap?.docs || []).map((doc: any) => {
      const data = doc.data() || {};
      
      // Map difficulty safely
      let difficulty = data.difficulty;
      if (typeof difficulty === 'number') {
        if (difficulty === 1) difficulty = 'beginner';
        else if (difficulty === 2) difficulty = 'intermediate';
        else if (difficulty === 3) difficulty = 'advanced';
      }
      
      // Robust date parsing
      let createdAt = new Date().toISOString();
      if (data.created_at) {
        try {
          if (typeof data.created_at.toDate === 'function') {
            createdAt = data.created_at.toDate().toISOString();
          } else {
            const d = new Date(data.created_at);
            if (!isNaN(d.getTime())) {
              createdAt = d.toISOString();
            }
          }
        } catch (e) {
          console.warn(`[Skills] Invalid date for skill ${doc.id}:`, data.created_at);
        }
      }

      return { 
        id: doc.id, 
        ...data,
        name: data.name || 'Untitled Skill',
        difficulty: difficulty || 'beginner',
        category: data.category || 'General',
        created_at: createdAt
      };
    });

    // Sort by creation date safely
    skills.sort((a: any, b: any) => {
      try {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } catch (e) {
        return 0;
      }
    });

    const stats = {
      total: skills.length,
      beginner: skills.filter((s: any) => s.difficulty === 'beginner').length,
      intermediate: skills.filter((s: any) => s.difficulty === 'intermediate').length,
      advanced: skills.filter((s: any) => s.difficulty === 'advanced').length
    };

    // Get unique categories
    const categoryCounts: Record<string, number> = {};
    skills.forEach((s: any) => {
      const cat = s.category || 'Uncategorized';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categories = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count
    }));

    // FINAL SERIALIZATION - One pass at the end
    return serializeRecord({
      user: locals.user,
      skills,
      categories,
      stats
    });

  } catch (err: any) {
    console.error('❌ Error fetching skills:', err);
    // Instead of throwing 500, return empty state to prevent page crash
    return {
      user: locals.user,
      skills: [],
      categories: [],
      stats: { total: 0, beginner: 0, intermediate: 0, advanced: 0 },
      error: 'Failed to load skills'
    };
  }
};
