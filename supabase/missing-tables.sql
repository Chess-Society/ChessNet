-- =====================
-- ChessNet: Tablas Faltantes
-- =====================

-- =====================
-- MEMBERSHIPS TABLE
-- =====================

-- Tabla de membresías (usuarios en centros)
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'teacher', 'assistant', 'viewer')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, user_id)
);

-- Índices para memberships
CREATE INDEX IF NOT EXISTS idx_memberships_school_id ON public.memberships(school_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_role ON public.memberships(role);

-- =====================
-- TOURNAMENTS TABLES
-- =====================

-- Tabla principal de torneos
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  format TEXT NOT NULL DEFAULT 'swiss' CHECK (format IN ('swiss', 'round_robin', 'elimination', 'mixed')),
  time_control TEXT DEFAULT '15+10',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  max_players INTEGER DEFAULT 32,
  entry_fee DECIMAL(10,2) DEFAULT 0.00,
  prize_pool DECIMAL(10,2) DEFAULT 0.00,
  location TEXT,
  organizer TEXT,
  notes TEXT,
  rules TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'cancelled')),
  current_round INTEGER DEFAULT 0,
  total_rounds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de participantes en torneos
CREATE TABLE IF NOT EXISTS public.tournament_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'active', 'eliminated', 'withdrawn')),
  initial_rating INTEGER DEFAULT 1200,
  current_rating INTEGER DEFAULT 1200,
  points DECIMAL(5,2) DEFAULT 0.00,
  games_played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tournament_id, student_id)
);

-- Tabla de partidas/emparejamientos en torneos
CREATE TABLE IF NOT EXISTS public.tournament_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  white_player_id UUID NOT NULL REFERENCES public.tournament_participants(id) ON DELETE CASCADE,
  black_player_id UUID NOT NULL REFERENCES public.tournament_participants(id) ON DELETE CASCADE,
  result TEXT CHECK (result IN ('1-0', '0-1', '1/2-1/2', 'pending')),
  game_date TIMESTAMP WITH TIME ZONE,
  time_control TEXT,
  moves TEXT, -- PGN format
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para torneos
CREATE INDEX IF NOT EXISTS idx_tournaments_user_id ON public.tournaments(user_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON public.tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_start_date ON public.tournaments(start_date);

-- Índices para participantes
CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament_id ON public.tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_student_id ON public.tournament_participants(student_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_status ON public.tournament_participants(status);

-- Índices para partidas
CREATE INDEX IF NOT EXISTS idx_tournament_matches_tournament_id ON public.tournament_matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_matches_round ON public.tournament_matches(tournament_id, round_number);
CREATE INDEX IF NOT EXISTS idx_tournament_matches_white_player ON public.tournament_matches(white_player_id);
CREATE INDEX IF NOT EXISTS idx_tournament_matches_black_player ON public.tournament_matches(black_player_id);

-- =====================
-- ROW LEVEL SECURITY (RLS)
-- =====================

-- Habilitar RLS en las nuevas tablas
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_matches ENABLE ROW LEVEL SECURITY;

-- Políticas para memberships
CREATE POLICY "Users can view memberships of their schools" ON public.memberships
  FOR SELECT USING (
    school_id IN (
      SELECT id FROM public.colleges WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage memberships of their schools" ON public.memberships
  FOR ALL USING (
    school_id IN (
      SELECT id FROM public.colleges WHERE user_id = auth.uid()
    )
  );

-- Políticas para tournaments
CREATE POLICY "Users can view their own tournaments" ON public.tournaments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own tournaments" ON public.tournaments
  FOR ALL USING (user_id = auth.uid());

-- Políticas para tournament_participants
CREATE POLICY "Users can view participants of their tournaments" ON public.tournament_participants
  FOR SELECT USING (
    tournament_id IN (
      SELECT id FROM public.tournaments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage participants of their tournaments" ON public.tournament_participants
  FOR ALL USING (
    tournament_id IN (
      SELECT id FROM public.tournaments WHERE user_id = auth.uid()
    )
  );

-- Políticas para tournament_matches
CREATE POLICY "Users can view matches of their tournaments" ON public.tournament_matches
  FOR SELECT USING (
    tournament_id IN (
      SELECT id FROM public.tournaments WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage matches of their tournaments" ON public.tournament_matches
  FOR ALL USING (
    tournament_id IN (
      SELECT id FROM public.tournaments WHERE user_id = auth.uid()
    )
  );

-- =====================
-- TRIGGERS PARA UPDATED_AT
-- =====================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON public.memberships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournament_participants_updated_at BEFORE UPDATE ON public.tournament_participants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournament_matches_updated_at BEFORE UPDATE ON public.tournament_matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
