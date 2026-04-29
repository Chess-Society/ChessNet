import { z } from 'zod';

export const changelogItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().default('Sparkle')
});

export const changelogEntrySchema = z.object({
  version: z.string().min(1, 'Version is required'),
  date: z.string().min(1, 'Date is required'),
  title: z.string().min(1, 'Main title is required'),
  icon: z.string().default('RocketLaunch'),
  color: z.string().default('text-violet-400'),
  bgColor: z.string().default('bg-violet-500/10'),
  items: z.array(changelogItemSchema).min(1, 'At least one item is required')
});

export type ChangelogEntry = z.infer<typeof changelogEntrySchema>;
