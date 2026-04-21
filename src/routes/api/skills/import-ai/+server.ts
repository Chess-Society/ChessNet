import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// Most robust way to load pdf-parse in various Node/ESM/Vite combined environments
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

// Initialize Gemini (lazy init inside handler to ensure env is ready)
let genAI: GoogleGenerativeAI | null = null;

export const POST: RequestHandler = async ({ request, locals }) => {
  // 1. Gating
  if (!locals.user) {
    console.error('❌ [ImportAI] Unauthorized - No user in locals');
    return json({ error: 'Usuario no autenticado' }, { status: 401 });
  }

  const apiKey = env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    console.error('❌ [ImportAI] GOOGLE_AI_API_KEY missing in dynamic/private env');
    return json({ error: 'Configuración de IA no disponible (API Key missing)' }, { status: 500 });
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }

  try {
    // 2. Extract file
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('❌ [ImportAI] No file in FormData');
      return json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    console.log(`📄 [ImportAI] PDF received: ${file.name} (${file.size} bytes) by user: ${locals.user.uid}`);

    // 3. Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let pdfText = '';
    try {
        console.log('🔍 [ImportAI] Debug - pdf value:', typeof pdf, pdf ? 'exists' : 'null');
        
        // Robust detection of the parse function
        let parse: any = null;
        if (typeof pdf === 'function') {
            parse = pdf;
        } else if (pdf && typeof pdf.default === 'function') {
            parse = pdf.default;
        } else if (pdf && typeof pdf === 'object') {
            // Check common CJS/ESM interop keys
            parse = pdf.default || pdf;
            if (typeof parse !== 'function' && Object.keys(pdf).length > 0) {
               // Try to find ANY function inside the exported object
               const firstKey = Object.keys(pdf).find(k => typeof pdf[k] === 'function');
               if (firstKey) parse = pdf[firstKey];
            }
        }

        if (typeof parse !== 'function') {
             console.error('❌ [ImportAI] pdf-parse detection failed. Type:', typeof pdf, 'Keys:', Object.keys(pdf || {}));
             throw new Error('PDF parsing library was not initialized correctly (not a function)');
        }

        let pdfData: any;
        try {
            // Try as a standard function first
            pdfData = await parse(buffer);
        } catch (e: any) {
            // Fallback for libraries that export a class constructor instead of a simple function
            if (e.message?.includes("without 'new'") || e.message?.includes("is not a constructor")) {
                console.log('🔄 [ImportAI] Retrying with "new" constructor...');
                pdfData = await (new parse(buffer));
            } else {
                throw e;
            }
        }
        
        pdfText = pdfData.text;
        
        if (!pdfText || pdfText.trim().length < 5) {
           console.warn('⚠️ [ImportAI] PDF extracted text is surprisingly short');
           // No fallar todavía, tal vez es un PDF raro
        } else {
           console.log(`✅ [ImportAI] PDF parsed. Length: ${pdfText.length} chars`);
        }
    } catch (pdfError: any) {
        console.error('❌ [ImportAI] PDF Parse Error:', pdfError.message);
        return json({ error: 'No se pudo leer el PDF: ' + pdfError.message }, { status: 400 });
    }

    // 4. Contact Gemini
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
      - name: Nombre de la lección (ej: "Mates Básicos")
      - description: Descripción pedagógica breve.
      - category: Una de estas categorías exactas: "Táctica", "Estrategia", "Aperturas", "Finales", "Historia".
      - level: "beginner", "intermediate", o "advanced".
      - difficulty: Número del 1 al 5.
      - learning_objectives: Array de strings con objetivos.
      - resources: Array de strings con términos de búsqueda para recursos.
      
      IMPORTANTE:
      1. El idioma de salida debe ser el MISMO que el de entrada (Español predominante).
      2. No añadas Markdown (bloques code). Solo el JSON puro.
      3. Extrae como máximo 15 lecciones si el documento es muy largo.
    `;

    const userPrompt = `Texto extraído del PDF:\n\n${pdfText.substring(0, 30000)}`;

    console.log('🤖 [ImportAI] Requesting Gemini extraction...');
    
    try {
        const result = await model.generateContent([
            { text: systemPrompt },
            { text: userPrompt }
        ]);
        
        const response = await result.response;
        const resultText = response.text();
        
        console.log('✅ [ImportAI] Gemini responded');

        // Robust parsing
        let cleanedJson = resultText.trim();
        // Remove potential markdown wrappers just in case configuration failed
        if (cleanedJson.startsWith('```')) {
            cleanedJson = cleanedJson.replace(/```(json)?|```/g, '').trim();
        }

        const parsed = JSON.parse(cleanedJson);
        const rawSkills = Array.isArray(parsed.skills) ? parsed.skills : (Array.isArray(parsed) ? parsed : []);

        if (rawSkills.length === 0) {
            console.warn('⚠️ [ImportAI] AI found no skills in text');
            return json({ error: 'No se detectaron lecciones de ajedrez en este PDF' }, { status: 422 });
        }

        // 5. Build final payload
        const processedSkills = rawSkills.map((s: any, idx: number) => ({
            name: s.name || 'Sin título',
            description: s.description || '',
            category: s.category || 'Táctica',
            level: s.level || 'beginner',
            difficulty: Number(s.difficulty) || 1,
            learning_objectives: Array.isArray(s.learning_objectives) ? s.learning_objectives : [],
            order_index: idx,
            resources: Array.isArray(s.resources) ? s.resources : [],
            id: `ai-${Date.now()}-${idx}`,
            owner_id: locals.user.uid,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            active: true
        }));

        console.log(`✨ [ImportAI] Success! Extracted ${processedSkills.length} skills`);
        return json({ skills: processedSkills });

    } catch (aiErr: any) {
        console.error('❌ [ImportAI] AI Processing Error:', aiErr.message);
        return json({ 
            error: 'Error en el procesamiento de IA', 
            details: aiErr.message,
            stack: dev ? aiErr.stack : undefined 
        }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ [ImportAI] Fatal Error:', error);
    return json({ 
        error: 'Error interno del servidor', 
        details: error.message,
        stack: dev ? error.stack : undefined
    }, { status: 500 });
  }
};
