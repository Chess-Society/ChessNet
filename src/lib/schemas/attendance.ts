import { z } from 'zod';

export const attendanceSchema = z.object({
  classId: z.string().min(1, 'Select a class'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  records: z.array(z.object({
    studentId: z.string(),
    status: z.enum(['P', 'A', 'T', 'unmarked'])
  }))
});

export type AttendanceSchema = typeof attendanceSchema;
