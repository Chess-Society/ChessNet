import { z } from 'zod';

export const tournamentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  startAt: z.string().min(1, 'Start date is required'),
  endAt: z.string().optional().default(''),
  registrationDeadline: z.string().optional().default(''),
  timeControl: z.string().default('15 + 10'),
  location: z.string().optional().default(''),
  schoolId: z.string().optional().default(''),
  format: z.enum(['swiss', 'round_robin', 'knockout']).default('swiss'),
  maxPlayers: z.number().min(2).default(16),
  entryFee: z.number().min(0).default(0),
  prizePool: z.number().min(0).default(0),
  description: z.string().optional().default(''),
  organizer: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  rules: z.string().optional().default(''),
  sharedWith: z.array(z.string()).default([]),
  // Fields for the database
  ownerId: z.string().optional(),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'canceled', 'draft', 'in_progress']).default('upcoming'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type TournamentSchema = typeof tournamentSchema;
