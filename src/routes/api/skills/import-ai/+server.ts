import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PDFParse } from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '$env/dynamic/private';

// Initialize Gemini
// Note: GOOGLE_AI_API_KEY must be in .env
const genAI = env.GOOGLE_AI_API_KEY ? new GoogleGenerativeAI(env.GOOGLE_AI_API_KEY) : null;

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'User not authenticated' }, { status: 401 });
  }

  if (!genAI) {
      // For development/demo if key is missing
      console.warn('⚠️ GOOGLE_AI_API_KEY missing in .env. Using mock response.');
      return json({ error: 'Google AI API Key not configured' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    let pdfText = '';
    try {
        const parser = new PDFParse({ data: uint8Array });
        const pdfData = await parser.getText();
        pdfText = pdfData.text;
    } catch (pdfError: any) {
        console.error('PDF Parse Error:', pdfError);
        return json({ error: 'Could not parse PDF file' }, { status: 400 });
    }

    if (!pdfText || pdfText.trim().length < 10) {
      return json({ error: 'Extracted text is too short or empty' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert Chess Coach and Academic Coordinator for ChessNet. 
      Analyze the following school syllabus or chess program program text and extract a list of chess skills, lessons or modules.
      
      The output MUST be a valid JSON array of objects.
      Each object MUST follow this TypeScript-compatible structure:
      {
        "name": String (Lesson title),
        "description": String (Brief overview),
        "category": String (One of: Táctica, Estrategia, Aperturas, Finales, Historia),
        "level": String ("beginner", "intermediate", or "advanced"),
        "difficulty": Number (1 to 5),
        "learning_objectives": Array of Strings (What the student will learn),
        "order_index": Number (Sequential order),
        "resources": Array of Strings (Search terms for relevant videos or articles)
      }

      Context from PDF:
      ---
      ${pdfText.substring(0, 20000)}
      ---

      Guidelines:
      1. Use the SAME language as the input text (Spanish if input is Spanish, English if English).
      2. If you find dates, ignore them unless they define a sequence.
      3. Return ONLY the raw JSON array. Do not include markdown blocks or extra text.
      4. Ensure the JSON is perfectly valid.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean potential markdown or extra formatting more robustly
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
        text = jsonMatch[0];
    } else {
        text = text.replace(/```json|```/g, '').trim();
    }
    
    let extractedSkills = [];
    try {
        extractedSkills = JSON.parse(text);
    } catch (parseError) {
        console.error('AI Response Parse Error. Raw text:', text);
        // Fallback or retry logic could go here, but for now we error
        return json({ error: 'AI generated malformed JSON' }, { status: 500 });
    }

    // Add required metadata for our app
    const processedSkills = extractedSkills.map((s: any, index: number) => ({
        ...s,
        id: `ai-${Date.now()}-${index}`,
        owner_id: locals.user.uid,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        active: true
    }));

    return json({ skills: processedSkills });

  } catch (error: any) {
    console.error('❌ Error in Import AI API:', error.message);
    return json({ error: 'Internal server error during AI processing' }, { status: 500 });
  }
};
