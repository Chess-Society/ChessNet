-- =====================
-- ChessNet: Seed Data (Actualizado para el esquema real)
-- =====================

-- Insertar categorías por defecto (públicas para todos los usuarios)
INSERT INTO public.categories (name, description, color) VALUES
('Movimientos Básicos', 'Fundamentos de cómo se mueven las piezas', '#3b82f6'),
('Táctica', 'Combinaciones y maniobras tácticas', '#ef4444'),
('Estrategia', 'Planificación y conceptos estratégicos', '#10b981'),
('Finales', 'Técnica de finales y mates básicos', '#f59e0b'),
('Aperturas', 'Principios y sistemas de apertura', '#8b5cf6'),
('Reglas Especiales', 'Enroque, captura al paso, promoción', '#06b6d4'),
('Psicología', 'Gestión del tiempo y control emocional', '#ec4899'),
('Competición', 'Preparación para torneos', '#f97316')
ON CONFLICT (name) DO NOTHING;

-- Nota: Los skills, students, classes, etc. se crean por usuario
-- No insertamos datos por defecto para estas tablas ya que son específicas por usuario

-- Función para inicializar skills básicos para un nuevo usuario
CREATE OR REPLACE FUNCTION public.initialize_user_skills(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cat_movimientos UUID;
  cat_tactica UUID;
  cat_estrategia UUID;
  cat_finales UUID;
BEGIN
  -- Obtener IDs de categorías
  SELECT id INTO cat_movimientos FROM public.categories WHERE name = 'Movimientos Básicos' LIMIT 1;
  SELECT id INTO cat_tactica FROM public.categories WHERE name = 'Táctica' LIMIT 1;
  SELECT id INTO cat_estrategia FROM public.categories WHERE name = 'Estrategia' LIMIT 1;
  SELECT id INTO cat_finales FROM public.categories WHERE name = 'Finales' LIMIT 1;

  -- Insertar skills básicos para el usuario
  INSERT INTO public.skills (user_id, category_id, name, description, level, order_index) VALUES
  -- Movimientos Básicos
  (target_user_id, cat_movimientos, 'Movimiento del Peón', 'Cómo se mueven los peones, captura al paso y promoción', 'beginner', 1),
  (target_user_id, cat_movimientos, 'Movimiento de la Torre', 'Movimiento horizontal y vertical', 'beginner', 2),
  (target_user_id, cat_movimientos, 'Movimiento del Alfil', 'Movimiento diagonal', 'beginner', 3),
  (target_user_id, cat_movimientos, 'Movimiento del Caballo', 'Movimiento en L', 'beginner', 4),
  (target_user_id, cat_movimientos, 'Movimiento de la Dama', 'Combina torre y alfil', 'beginner', 5),
  (target_user_id, cat_movimientos, 'Movimiento del Rey', 'Movimiento básico y enroque', 'beginner', 6),
  
  -- Táctica Básica
  (target_user_id, cat_tactica, 'Ataque Doble', 'Atacar dos piezas simultáneamente', 'beginner', 7),
  (target_user_id, cat_tactica, 'Clavada', 'Inmovilizar una pieza', 'beginner', 8),
  (target_user_id, cat_tactica, 'Tenedor', 'Ataque múltiple con caballo', 'beginner', 9),
  (target_user_id, cat_tactica, 'Desviación', 'Apartar una pieza defensora', 'intermediate', 10),
  
  -- Estrategia Básica
  (target_user_id, cat_estrategia, 'Control del Centro', 'Dominar las casillas centrales', 'beginner', 11),
  (target_user_id, cat_estrategia, 'Desarrollo', 'Activar las piezas eficientemente', 'beginner', 12),
  (target_user_id, cat_estrategia, 'Seguridad del Rey', 'Proteger el rey con enroque', 'beginner', 13),
  
  -- Finales Básicos
  (target_user_id, cat_finales, 'Mate de Rey y Torre', 'Técnica básica de mate', 'beginner', 14),
  (target_user_id, cat_finales, 'Mate de Rey y Dama', 'Mate con la dama', 'beginner', 15),
  (target_user_id, cat_finales, 'Promoción de Peón', 'Llevar el peón a coronación', 'beginner', 16);

  RAISE NOTICE 'Skills básicos inicializados para usuario %', target_user_id;
END;
$$;

-- Función para crear un perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Crear perfil para el nuevo usuario
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'teacher'
  );
  
  -- Inicializar skills básicos
  PERFORM public.initialize_user_skills(NEW.id);
  
  RETURN NEW;
END;
$$;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función de limpieza para eliminar datos de usuario
CREATE OR REPLACE FUNCTION public.cleanup_user_data(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Eliminar en orden por dependencias
  DELETE FROM public.attendance WHERE user_id = target_user_id;
  DELETE FROM public.payments WHERE user_id = target_user_id;
  DELETE FROM public.class_skills WHERE owner_id = target_user_id;
  DELETE FROM public.class_students WHERE owner_id = target_user_id;
  DELETE FROM public.student_skills WHERE user_id = target_user_id;
  DELETE FROM public.skills WHERE user_id = target_user_id;
  DELETE FROM public.students WHERE user_id = target_user_id;
  DELETE FROM public.classes WHERE user_id = target_user_id;
  DELETE FROM public.colleges WHERE user_id = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;
  
  RAISE NOTICE 'Datos limpiados para usuario %', target_user_id;
END;
$$;
