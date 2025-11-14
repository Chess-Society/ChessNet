-- Agregar campo 'active' a la tabla classes
-- Este campo determina si la clase está activa o inactiva

ALTER TABLE public.classes 
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Crear índice para mejorar el rendimiento de consultas por estado activo
CREATE INDEX IF NOT EXISTS idx_classes_active ON public.classes(active);

-- Comentario para documentar el campo
COMMENT ON COLUMN public.classes.active IS 'Indica si la clase está activa (true) o inactiva (false). Por defecto true.';
