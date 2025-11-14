-- Add missing players_registered column to tournaments table
ALTER TABLE public.tournaments 
ADD COLUMN IF NOT EXISTS players_registered INTEGER DEFAULT 0;
