import { z } from 'zod';

export const settingsSchema = z.object({
  teacherName: z.string().min(2, 'Name too short').max(50, 'Name too long'),
  teacherAvatar: z.string().url().optional().or(z.literal('')),
  teacherEmail: z.string().email().optional(),
  // Governance (optional, only for directors)
  schoolId: z.string().optional()
});

export type SettingsSchema = typeof settingsSchema;
