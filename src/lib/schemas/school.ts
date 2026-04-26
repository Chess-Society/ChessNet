import { z } from 'zod';

export const schoolSchema = z.object({
  name: z.string().min(1, 'El nombre de la escuela es obligatorio'),
  city: z.string().optional().default(''),
  country: z.string().optional().default(''),
  address: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  email: z.string().email('Email no válido').optional().or(z.literal('')).default(''),
  website: z.string().url('Web no válida').optional().or(z.literal('')).default(''),
  location: z.string().optional().default(''),
  sharedWith: z.array(z.string()).default([]),
});

export type SchoolSchema = typeof schoolSchema;
