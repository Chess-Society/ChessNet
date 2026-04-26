import { z } from 'zod';

export const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "El título es demasiado corto").max(100, "El título es demasiado largo"),
  content: z.string().min(10, "El contenido es demasiado corto"),
  type: z.enum(['GAME_ANALYSIS', 'EXERCISE', 'ACHIEVEMENT', 'SCHOOL_UPDATE']),
  category: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const challengeSchema = z.object({
  title: z.string().min(3, "El título es demasiado corto"),
  description: z.string().min(10),
  rewardNets: z.number().min(1).default(50),
  rewardXp: z.number().min(1).default(100),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']),
  expiresAt: z.string().optional()
});
