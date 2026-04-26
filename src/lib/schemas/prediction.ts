import { z } from 'zod';

export const predictionMarketSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(5, "La pregunta es demasiado corta"),
  description: z.string().optional(),
  category: z.enum(['Torneos', 'Mejoras', 'Docencia', 'Academia']),
  endDate: z.string().min(1, "La fecha de cierre es obligatoria"),
  oracleType: z.enum(['MANUAL', 'LICHESS', 'SYSTEM']),
  externalId: z.string().optional(),
  schoolId: z.string().optional()
});

export type PredictionMarketSchema = typeof predictionMarketSchema;
