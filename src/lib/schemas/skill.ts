import { z } from 'zod';

export const skillSchema = z.object({
  name: z.string().min(1, 'Required'),
  description: z.string().optional().default(''),
  categoryId: z.string().min(1, 'Required'),
  difficulty: z.number().min(1).max(5).default(1),
  estimatedHours: z.number().min(0).default(1),
  prerequisites: z.array(z.string()).default([]),
  learningObjectives: z.array(z.string()).default([]),
  assessmentCriteria: z.array(z.string()).default([]),
  resources: z.array(z.string()).default([]),
  icon: z.string().default('🎯'),
  resourceLink: z.string().optional().default(''),
  orderIndex: z.number().int().min(0).default(0),
  active: z.boolean().default(true)
});

export type SkillSchema = typeof skillSchema;
