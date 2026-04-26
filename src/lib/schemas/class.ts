import { z } from 'zod';

export const classSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre de la clase es obligatorio'),
  schoolId: z.string().min(1, 'Debes seleccionar una escuela'),
  description: z.string().optional().default(''),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'mixed']).default('beginner'),
  schedule: z.string().optional().default(''),
  maxStudents: z.number().min(1, 'El número de alumnos debe ser al menos 1').default(20),
  active: z.boolean().default(true),
  price: z.number().min(0, 'El precio no puede ser negativo').default(0)
});

export type ClassSchema = typeof classSchema;
