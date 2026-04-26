import { z } from 'zod';

export const challengeSchema = z.object({
  question: z.string().min(1, 'La pregunta es obligatoria'),
  description: z.string().optional().nullable().or(z.literal('')),
  endDate: z.string().min(1, 'La fecha de cierre es obligatoria'),
  mode: z.enum(['MANUAL', 'SYSTEM', 'LICHESS']),
  externalId: z.string().optional().nullable().or(z.literal('')),
});

export type ChallengeSchema = typeof challengeSchema;
