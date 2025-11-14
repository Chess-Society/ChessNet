-- =====================
-- ChessNet: Seed Data
-- =====================

-- Insert default skills for chess education
INSERT INTO public.skills (school_id, name, description, category, level, order_index) VALUES
-- These will be created for each school when they're set up
-- Basic Movement Skills
('00000000-0000-0000-0000-000000000000', 'Movimientos de Peón', 'Conoce cómo se mueven los peones y las reglas especiales', 'general', 'beginner', 1),
('00000000-0000-0000-0000-000000000000', 'Movimientos de Torre', 'Domina el movimiento de la torre en todas las direcciones', 'general', 'beginner', 2),
('00000000-0000-0000-0000-000000000000', 'Movimientos de Alfil', 'Entiende el movimiento diagonal del alfil', 'general', 'beginner', 3),
('00000000-0000-0000-0000-000000000000', 'Movimientos de Caballo', 'Aprende el movimiento en L del caballo', 'general', 'beginner', 4),
('00000000-0000-0000-0000-000000000000', 'Movimientos de Dama', 'Combina torre y alfil con la dama', 'general', 'beginner', 5),
('00000000-0000-0000-0000-000000000000', 'Movimientos de Rey', 'Conoce el movimiento del rey y el concepto de jaque', 'general', 'beginner', 6),

-- Basic Tactics
('00000000-0000-0000-0000-000000000000', 'Ataque Doble', 'Identifica y ejecuta ataques dobles', 'tactics', 'beginner', 7),
('00000000-0000-0000-0000-000000000000', 'La Clavada', 'Reconoce y utiliza clavadas', 'tactics', 'beginner', 8),
('00000000-0000-0000-0000-000000000000', 'El Tenedor', 'Ejecuta tenedores para ganar material', 'tactics', 'beginner', 9),
('00000000-0000-0000-0000-000000000000', 'La Desviación', 'Desvía piezas para crear amenazas', 'tactics', 'intermediate', 10),

-- Basic Endgames
('00000000-0000-0000-0000-000000000000', 'Mate de Rey y Torre', 'Ejecuta el mate básico con rey y torre', 'endgame', 'beginner', 11),
('00000000-0000-0000-0000-000000000000', 'Mate de Rey y Dama', 'Realiza el mate con rey y dama', 'endgame', 'beginner', 12),
('00000000-0000-0000-0000-000000000000', 'Coronación de Peón', 'Promociona peones correctamente', 'endgame', 'beginner', 13),

-- Basic Strategy
('00000000-0000-0000-0000-000000000000', 'Control del Centro', 'Entiende la importancia del centro', 'strategy', 'beginner', 14),
('00000000-0000-0000-0000-000000000000', 'Desarrollo de Piezas', 'Desarrolla piezas de forma eficiente', 'strategy', 'beginner', 15),
('00000000-0000-0000-0000-000000000000', 'El Enroque', 'Protege el rey con el enroque', 'strategy', 'beginner', 16),

-- Value of Pieces
('00000000-0000-0000-0000-000000000000', 'Valor de Piezas', 'Conoce el valor relativo de las piezas', 'general', 'beginner', 17),
('00000000-0000-0000-0000-000000000000', 'Intercambios', 'Realiza intercambios ventajosos', 'strategy', 'intermediate', 18),

-- Advanced Tactics
('00000000-0000-0000-0000-000000000000', 'Sacrificio', 'Identifica sacrificios tácticos', 'tactics', 'advanced', 19),
('00000000-0000-0000-0000-000000000000', 'Combinación', 'Ejecuta combinaciones complejas', 'tactics', 'advanced', 20),
('00000000-0000-0000-0000-000000000000', 'Defensa', 'Defiende posiciones difíciles', 'tactics', 'advanced', 21);

-- Insert default badges
INSERT INTO public.badges (school_id, name, description, icon, color, criteria) VALUES
-- These will be created for each school when they're set up
('00000000-0000-0000-0000-000000000000', 'Primer Movimiento', 'Completó su primera lección', '🎯', '#10b981', '{"lessons_completed": 1}'),
('00000000-0000-0000-0000-000000000000', 'Aprendiz', 'Completó 5 lecciones', '📚', '#3b82f6', '{"lessons_completed": 5}'),
('00000000-0000-0000-0000-000000000000', 'Estudiante', 'Completó 10 lecciones', '🎓', '#8b5cf6', '{"lessons_completed": 10}'),
('00000000-0000-0000-0000-000000000000', 'Táctico', 'Resolvió 20 ejercicios tácticos', '⚔️', '#f59e0b', '{"tactics_exercises": 20}'),
('00000000-0000-0000-0000-000000000000', 'Estratega', 'Completó 15 lecciones de estrategia', '♟️', '#ef4444', '{"strategy_lessons": 15}'),
('00000000-0000-0000-0000-000000000000', 'Finalista', 'Dominó 10 finales básicos', '🏁', '#06b6d4', '{"endgame_skills": 10}'),
('00000000-0000-0000-0000-000000000000', 'Competidor', 'Participó en su primer torneo', '🏆', '#f97316', '{"tournaments_participated": 1}'),
('00000000-0000-0000-0000-000000000000', 'Campeón', 'Ganó un torneo', '👑', '#eab308', '{"tournaments_won": 1}'),
('00000000-0000-0000-0000-000000000000', 'Constante', 'Practicó 7 días seguidos', '🔥', '#dc2626', '{"streak_days": 7}'),
('00000000-0000-0000-0000-000000000000', 'Maestro', 'Completó todas las habilidades básicas', '🎖️', '#7c3aed', '{"all_basic_skills": true}');

-- Insert sample curriculum units
INSERT INTO public.curriculum_units (school_id, title, description, level, order_index, color) VALUES
-- These will be created for each school when they're set up
('00000000-0000-0000-0000-000000000000', 'Introducción al Ajedrez', 'Conceptos básicos y reglas fundamentales', 'beginner', 1, '#3b82f6'),
('00000000-0000-0000-0000-000000000000', 'Movimientos y Capturas', 'Cómo se mueven y capturan las piezas', 'beginner', 2, '#10b981'),
('00000000-0000-0000-0000-000000000000', 'Jaque y Jaque Mate', 'Conceptos de jaque, jaque mate y ahogado', 'beginner', 3, '#ef4444'),
('00000000-0000-0000-0000-000000000000', 'Táctica Básica', 'Primeros pasos en la táctica de ajedrez', 'beginner', 4, '#f59e0b'),
('00000000-0000-0000-0000-000000000000', 'Estrategia Básica', 'Principios estratégicos fundamentales', 'intermediate', 5, '#8b5cf6'),
('00000000-0000-0000-0000-000000000000', 'Finales Básicos', 'Finales elementales que todo jugador debe conocer', 'intermediate', 6, '#06b6d4'),
('00000000-0000-0000-0000-000000000000', 'Aperturas Principales', 'Introducción a las aperturas más populares', 'intermediate', 7, '#84cc16'),
('00000000-0000-0000-0000-000000000000', 'Táctica Avanzada', 'Combinaciones y sacrificios', 'advanced', 8, '#f97316'),
('00000000-0000-0000-0000-000000000000', 'Estrategia Avanzada', 'Planes complejos y estructuras de peones', 'advanced', 9, '#ec4899'),
('00000000-0000-0000-0000-000000000000', 'Finales Avanzados', 'Finales complejos y técnica de finales', 'advanced', 10, '#6366f1');

-- Insert sample lessons for the first unit
INSERT INTO public.lessons (unit_id, title, description, objectives, duration_minutes, difficulty, order_index) VALUES
-- These will be created for each school when they're set up
-- Unit 1: Introducción al Ajedrez
('00000000-0000-0000-0000-000000000001', '¿Qué es el Ajedrez?', 'Introducción al juego de ajedrez y su historia', ARRAY['Conocer la historia del ajedrez', 'Identificar el tablero y las piezas', 'Entender el objetivo del juego'], 45, 'easy', 1),
('00000000-0000-0000-0000-000000000001', 'El Tablero de Ajedrez', 'Aprender sobre el tablero y su notación', ARRAY['Identificar las casillas del tablero', 'Conocer la notación algebraica', 'Entender filas, columnas y diagonales'], 45, 'easy', 2),
('00000000-0000-0000-0000-000000000001', 'Las Piezas del Ajedrez', 'Conocer todas las piezas y sus símbolos', ARRAY['Identificar cada pieza', 'Conocer el valor de las piezas', 'Entender la disposición inicial'], 45, 'easy', 3),

-- Unit 2: Movimientos y Capturas
('00000000-0000-0000-0000-000000000002', 'Movimiento del Peón', 'Cómo se mueven y capturan los peones', ARRAY['Mover peones correctamente', 'Entender la captura al paso', 'Conocer la promoción'], 60, 'easy', 1),
('00000000-0000-0000-0000-000000000002', 'Movimiento de la Torre', 'Movimiento horizontal y vertical de la torre', ARRAY['Mover torres en filas y columnas', 'Entender el concepto de línea abierta'], 45, 'easy', 2),
('00000000-0000-0000-0000-000000000002', 'Movimiento del Alfil', 'Movimiento diagonal del alfil', ARRAY['Mover alfiles por diagonales', 'Entender alfiles de casillas blancas y negras'], 45, 'easy', 3),
('00000000-0000-0000-0000-000000000002', 'Movimiento del Caballo', 'El movimiento en L del caballo', ARRAY['Mover caballos correctamente', 'Entender que el caballo puede saltar'], 45, 'easy', 4),
('00000000-0000-0000-0000-000000000002', 'Movimiento de la Dama', 'La pieza más poderosa del ajedrez', ARRAY['Combinar movimientos de torre y alfil', 'Entender el poder de la dama'], 45, 'easy', 5),
('00000000-0000-0000-0000-000000000002', 'Movimiento del Rey', 'El rey y el concepto de jaque', ARRAY['Mover el rey correctamente', 'Entender qué es el jaque'], 45, 'easy', 6);

-- Insert sample chess exercises
INSERT INTO public.chess_exercises (school_id, title, description, position_fen, solution_moves, category, difficulty, hints, explanation) VALUES
-- These will be created for each school when they're set up
-- Basic Tactics
('00000000-0000-0000-0000-000000000000', 'Ataque Doble Básico', 'Encuentra el ataque doble que gana material', 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4', ARRAY['Bxf7+'], 'tactics', 'beginner', ARRAY['Busca una pieza que pueda atacar dos piezas a la vez', 'El alfil en c4 puede atacar el rey y otra pieza'], 'El alfil captura en f7 dando jaque y atacando la torre en a2. El rey debe moverse y perdemos la torre.'),

('00000000-0000-0000-0000-000000000000', 'Clavada Simple', 'Identifica la clavada que gana material', 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4', ARRAY['Bxf7+'], 'tactics', 'beginner', ARRAY['Busca una pieza que esté clavada', 'La torre en f8 está clavada por el alfil'], 'El alfil captura en f7. La torre en f8 no puede moverse porque dejaría al rey en jaque.'),

('00000000-0000-0000-0000-000000000000', 'Tenedor de Caballo', 'Encuentra el tenedor que gana material', 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4', ARRAY['Nd5'], 'tactics', 'beginner', ARRAY['El caballo puede atacar dos piezas', 'Busca una casilla donde el caballo ataque rey y dama'], 'El caballo se mueve a d5 atacando tanto el rey como la dama. El rey debe moverse y perdemos la dama.'),

-- Basic Endgames
('00000000-0000-0000-0000-000000000000', 'Mate de Rey y Torre', 'Aprende a dar mate con rey y torre', '7k/7R/8/8/8/8/8/6K1 w - - 0 1', ARRAY['Rh8#'], 'endgame', 'beginner', ARRAY['La torre debe controlar la fila', 'El rey debe ayudar a la torre'], 'La torre da mate en h8. El rey negro no puede moverse y está en jaque.'),

('00000000-0000-0000-0000-000000000000', 'Mate de Rey y Dama', 'Dale mate con rey y dama', '7k/8/8/8/8/8/8/5QK1 w - - 0 1', ARRAY['Qf8#'], 'endgame', 'beginner', ARRAY['La dama debe controlar las casillas de escape', 'Acerca el rey para ayudar'], 'La dama da mate en f8 controlando todas las casillas de escape del rey.'),

-- Basic Strategy
('00000000-0000-0000-0000-000000000000', 'Control del Centro', 'Ocupa el centro del tablero', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', ARRAY['e4'], 'strategy', 'beginner', ARRAY['Ocupa el centro con peones', 'e4 es una de las mejores aperturas'], 'e4 ocupa el centro y libera el alfil y la dama. Es una de las aperturas más populares.');

-- Create a function to initialize default data for a new school
CREATE OR REPLACE FUNCTION public.initialize_school_data(school_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Copy default skills for the school
  INSERT INTO public.skills (school_id, name, description, category, level, order_index)
  SELECT school_uuid, name, description, category, level, order_index
  FROM public.skills
  WHERE school_id = '00000000-0000-0000-0000-000000000000';

  -- Copy default badges for the school
  INSERT INTO public.badges (school_id, name, description, icon, color, criteria)
  SELECT school_uuid, name, description, icon, color, criteria
  FROM public.badges
  WHERE school_id = '00000000-0000-0000-0000-000000000000';

  -- Copy default curriculum units for the school
  INSERT INTO public.curriculum_units (school_id, title, description, level, order_index, color)
  SELECT school_uuid, title, description, level, order_index, color
  FROM public.curriculum_units
  WHERE school_id = '00000000-0000-0000-0000-000000000000';

  -- Copy default lessons for the school
  INSERT INTO public.lessons (unit_id, title, description, objectives, duration_minutes, difficulty, order_index)
  SELECT 
    (SELECT id FROM public.curriculum_units WHERE school_id = school_uuid AND title = cu.title LIMIT 1),
    l.title, l.description, l.objectives, l.duration_minutes, l.difficulty, l.order_index
  FROM public.lessons l
  JOIN public.curriculum_units cu ON cu.id = l.unit_id
  WHERE cu.school_id = '00000000-0000-0000-0000-000000000000';

  -- Copy default chess exercises for the school
  INSERT INTO public.chess_exercises (school_id, title, description, position_fen, solution_moves, category, difficulty, hints, explanation)
  SELECT school_uuid, title, description, position_fen, solution_moves, category, difficulty, hints, explanation
  FROM public.chess_exercises
  WHERE school_id = '00000000-0000-0000-0000-000000000000';
END;
$$;
