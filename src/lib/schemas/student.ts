import { z } from 'zod';

export const studentSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'Los apellidos son obligatorios'),
  notes: z.string().optional().default(''),
  schoolId: z.string().min(1, 'La escuela es obligatoria'),
  classId: z.string().min(1, 'La clase es obligatoria'),
  lichessUsername: z.string().optional().default(''),
  chessComUsername: z.string().optional().default(''),
  elo: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
  avatar: z.string().optional().default(''),
  parentEmail: z.string().email('Email del tutor no válido').optional().or(z.literal('')),
  parentName: z.string().optional().default('')
});

export type StudentSchema = typeof studentSchema;
