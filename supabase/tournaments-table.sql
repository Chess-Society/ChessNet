-- Tournaments table
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  format TEXT NOT NULL CHECK (format IN ('swiss', 'round_robin', 'knockout', 'single_elimination')),
  time_control TEXT DEFAULT '10+5',
  max_players INTEGER DEFAULT 16,
  entry_fee DECIMAL(10,2) DEFAULT 0.00,
  prize_pool DECIMAL(10,2) DEFAULT 0.00,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed', 'active', 'completed', 'cancelled')),
  current_round INTEGER DEFAULT 0,
  total_rounds INTEGER DEFAULT 0,
  location TEXT,
  organizer TEXT,
  notes TEXT,
  rules TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tournament participants table
CREATE TABLE IF NOT EXISTS public.tournament_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  rating INTEGER DEFAULT 1200,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'active', 'eliminated', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (tournament_id, student_id)
);

-- Tournament matches table
CREATE TABLE IF NOT EXISTS public.tournament_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  white_player_id UUID REFERENCES public.tournament_participants(id) ON DELETE SET NULL,
  black_player_id UUID REFERENCES public.tournament_participants(id) ON DELETE SET NULL,
  result TEXT CHECK (result IN ('1-0', '0-1', '1/2-1/2', 'pending')),
  pgn TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tournaments
CREATE POLICY "Users can view their own tournaments" ON public.tournaments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tournaments" ON public.tournaments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tournaments" ON public.tournaments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tournaments" ON public.tournaments
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tournament_participants
CREATE POLICY "Users can view their own tournament participants" ON public.tournament_participants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tournament participants" ON public.tournament_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tournament participants" ON public.tournament_participants
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tournament participants" ON public.tournament_participants
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for tournament_matches
CREATE POLICY "Users can view their own tournament matches" ON public.tournament_matches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tournament matches" ON public.tournament_matches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tournament matches" ON public.tournament_matches
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tournament matches" ON public.tournament_matches
  FOR DELETE USING (auth.uid() = user_id);
