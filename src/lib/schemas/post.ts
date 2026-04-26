import { z } from 'zod';

export const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'El título es obligatorio'),
  content: z.string().min(1, 'El contenido es obligatorio'),
  type: z.enum(['GAME_ANALYSIS', 'EXERCISE', 'ACHIEVEMENT', 'SCHOOL_UPDATE']),
  fen: z.string().optional().nullable(),
  lichessUrl: z.string().url('URL de Lichess inválida').optional().nullable().or(z.literal('')),
});

export type PostSchema = typeof postSchema;
