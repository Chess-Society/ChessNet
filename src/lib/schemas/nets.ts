import { z } from 'zod';

export const claimTierSchema = z.object({
  tierId: z.number()
});

export const buyItemSchema = z.object({
  itemId: z.string()
});

export const claimChallengeSchema = z.object({
  challengeId: z.string(),
  challengeType: z.enum(['daily', 'weekly'])
});

export const equipItemSchema = z.object({
  type: z.enum(['frame', 'color', 'font', 'badge', 'emote']),
  value: z.string()
});

export const openCrateSchema = z.object({
  crateType: z.enum(['basic', 'premium', 'legendary'])
});
