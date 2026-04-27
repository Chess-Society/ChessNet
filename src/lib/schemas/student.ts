import { z } from 'zod';

export const studentSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  schoolId: z.string().optional().default(''),
  classId: z.string().optional().default(''),
  lichessUsername: z.string().optional().default(''),
  chessComUsername: z.string().optional().default(''),
  elo: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
  avatar: z.string().optional().default(''),
  parentEmail: z.string().email('Email del tutor no válido').optional().or(z.literal('')),
  parentName: z.string().optional().default(''),
  studentEmail: z.string().email('Email del alumno no válido').optional().or(z.literal(''))
});

export type StudentSchema = typeof studentSchema;
