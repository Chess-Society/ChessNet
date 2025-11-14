-- =====================
-- ChessNet: Sistema de Suscripciones Anuales
-- =====================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- TABLA DE PLANES
-- =====================

-- Planes de suscripción disponibles
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  price_annual DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  
  -- Límites del plan
  max_students INTEGER DEFAULT -1, -- -1 = ilimitado
  max_classes INTEGER DEFAULT -1,
  max_colleges INTEGER DEFAULT -1, 
  max_tournaments INTEGER DEFAULT -1,
  max_storage_mb INTEGER DEFAULT -1,
  max_custom_skills INTEGER DEFAULT -1,
  
  -- Características incluidas
  features JSONB DEFAULT '[]',
  
  -- Estado y orden
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- TABLA DE SUSCRIPCIONES DE USUARIOS
-- =====================

-- Suscripciones activas de cada usuario
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  
  -- Estado de la suscripción
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending', 'failed')),
  
  -- Fechas importantes
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  -- Información de pago
  payment_method TEXT CHECK (payment_method IN ('paypal', 'stripe', 'manual')),
  payment_reference TEXT, -- ID de transacción de PayPal/Stripe
  payment_email TEXT, -- Email usado en el pago
  
  -- Facturación
  amount_paid DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  
  -- Renovación automática
  auto_renew BOOLEAN DEFAULT false,
  
  -- Metadatos
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Un usuario solo puede tener una suscripción activa
  UNIQUE(user_id, status) DEFERRABLE INITIALLY DEFERRED
);

-- =====================
-- TABLA DE HISTORIAL DE PAGOS
-- =====================

-- Historial completo de todos los pagos
CREATE TABLE IF NOT EXISTS public.subscription_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  
  -- Detalles del pago
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('paypal', 'stripe', 'manual')),
  
  -- Referencias externas
  payment_reference TEXT, -- Transaction ID de PayPal/Stripe
  payment_email TEXT, -- Email del pagador
  
  -- Estado del pago
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  
  -- Fechas
  paid_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata adicional
  gateway_response JSONB DEFAULT '{}',
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- INSERTAR PLANES POR DEFECTO
-- =====================

INSERT INTO public.subscription_plans (name, display_name, description, price_annual, max_students, max_classes, max_colleges, max_tournaments, max_storage_mb, max_custom_skills, features, sort_order) VALUES
-- Plan Gratuito
('free', 'Profesor Individual', 'Perfecto para empezar con ChessNet', 0.00, 15, 3, 1, 2, 100, 5, 
 '["Skills básicos incluidos", "Asistencia básica", "Informes simples", "Soporte por email"]', 1),

-- Plan Profesional  
('professional', 'Profesor Multi-Centro', 'Para profesores que enseñan en varios centros', 39.00, 80, 12, 3, 10, 1000, 50,
 '["Todo del plan gratuito", "Informes detallados", "Sistema de pagos completo", "Torneos avanzados", "Exportar datos", "Soporte prioritario"]', 2),

-- Plan Academia
('academy', 'Academia de Ajedrez', 'Para academias y organizaciones grandes', 99.00, 200, 30, 10, -1, 5000, -1,
 '["Todo del plan profesional", "Gestión multi-sede", "Dashboard de administrador", "Integraciones avanzadas", "Branding personalizado", "Soporte telefónico", "Análisis avanzados"]', 3)

ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  price_annual = EXCLUDED.price_annual,
  max_students = EXCLUDED.max_students,
  max_classes = EXCLUDED.max_classes,
  max_colleges = EXCLUDED.max_colleges,
  max_tournaments = EXCLUDED.max_tournaments,
  max_storage_mb = EXCLUDED.max_storage_mb,
  max_custom_skills = EXCLUDED.max_custom_skills,
  features = EXCLUDED.features,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- =====================
-- FUNCIONES ÚTILES
-- =====================

-- Función para obtener el plan actual de un usuario
CREATE OR REPLACE FUNCTION public.get_user_current_plan(target_user_id UUID)
RETURNS TABLE (
  plan_name TEXT,
  display_name TEXT,
  status TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  max_students INTEGER,
  max_classes INTEGER,
  max_colleges INTEGER,
  max_tournaments INTEGER,
  max_storage_mb INTEGER,
  max_custom_skills INTEGER,
  features JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.name,
    sp.display_name,
    COALESCE(us.status, 'free') as status,
    us.expires_at,
    sp.max_students,
    sp.max_classes,
    sp.max_colleges,
    sp.max_tournaments,
    sp.max_storage_mb,
    sp.max_custom_skills,
    sp.features
  FROM public.subscription_plans sp
  LEFT JOIN public.user_subscriptions us ON (
    us.plan_id = sp.id 
    AND us.user_id = target_user_id 
    AND us.status = 'active' 
    AND us.expires_at > NOW()
  )
  WHERE sp.name = COALESCE(
    (SELECT p.name FROM public.subscription_plans p 
     JOIN public.user_subscriptions s ON s.plan_id = p.id 
     WHERE s.user_id = target_user_id AND s.status = 'active' AND s.expires_at > NOW() 
     LIMIT 1), 
    'free'
  )
  LIMIT 1;
END;
$$;

-- Función para verificar si un usuario puede realizar una acción
CREATE OR REPLACE FUNCTION public.check_user_limit(
  target_user_id UUID,
  limit_type TEXT, -- 'students', 'classes', 'colleges', 'tournaments', 'storage_mb', 'custom_skills'
  current_count INTEGER DEFAULT 0
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_plan RECORD;
  limit_value INTEGER;
BEGIN
  -- Obtener plan actual del usuario
  SELECT * INTO user_plan FROM public.get_user_current_plan(target_user_id) LIMIT 1;
  
  -- Obtener el límite específico
  CASE limit_type
    WHEN 'students' THEN limit_value := user_plan.max_students;
    WHEN 'classes' THEN limit_value := user_plan.max_classes;
    WHEN 'colleges' THEN limit_value := user_plan.max_colleges;
    WHEN 'tournaments' THEN limit_value := user_plan.max_tournaments;
    WHEN 'storage_mb' THEN limit_value := user_plan.max_storage_mb;
    WHEN 'custom_skills' THEN limit_value := user_plan.max_custom_skills;
    ELSE RETURN false;
  END CASE;
  
  -- -1 significa ilimitado
  IF limit_value = -1 THEN
    RETURN true;
  END IF;
  
  -- Verificar si está dentro del límite
  RETURN current_count < limit_value;
END;
$$;

-- Función para crear suscripción después de pago exitoso
CREATE OR REPLACE FUNCTION public.create_subscription_after_payment(
  target_user_id UUID,
  plan_name TEXT,
  payment_ref TEXT,
  payment_email TEXT,
  amount_paid DECIMAL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  plan_record RECORD;
  subscription_id UUID;
  payment_id UUID;
  expires_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Obtener información del plan
  SELECT * INTO plan_record FROM public.subscription_plans WHERE name = plan_name AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Plan % no encontrado', plan_name;
  END IF;
  
  -- Calcular fecha de expiración (1 año desde ahora)
  expires_date := NOW() + INTERVAL '1 year';
  
  -- Cancelar suscripción activa anterior si existe
  UPDATE public.user_subscriptions 
  SET status = 'cancelled', cancelled_at = NOW(), updated_at = NOW()
  WHERE user_id = target_user_id AND status = 'active';
  
  -- Crear nueva suscripción
  INSERT INTO public.user_subscriptions (
    user_id, plan_id, status, expires_at, 
    payment_method, payment_reference, payment_email, amount_paid
  ) VALUES (
    target_user_id, plan_record.id, 'active', expires_date,
    'paypal', payment_ref, payment_email, amount_paid
  ) RETURNING id INTO subscription_id;
  
  -- Registrar el pago
  INSERT INTO public.subscription_payments (
    user_id, subscription_id, plan_id, amount, payment_method,
    payment_reference, payment_email, status, paid_at
  ) VALUES (
    target_user_id, subscription_id, plan_record.id, amount_paid, 'paypal',
    payment_ref, payment_email, 'completed', NOW()
  ) RETURNING id INTO payment_id;
  
  RAISE NOTICE 'Suscripción creada: % para usuario %', subscription_id, target_user_id;
  
  RETURN subscription_id;
END;
$$;

-- =====================
-- ÍNDICES PARA RENDIMIENTO
-- =====================

CREATE INDEX IF NOT EXISTS idx_subscription_plans_name ON public.subscription_plans(name);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON public.subscription_plans(is_active, sort_order);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_expires ON public.user_subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_active ON public.user_subscriptions(user_id, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_subscription_payments_user_id ON public.subscription_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_status ON public.subscription_payments(status);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_reference ON public.subscription_payments(payment_reference);

-- =====================
-- ROW LEVEL SECURITY
-- =====================

-- Habilitar RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

-- Políticas para subscription_plans (públicas para lectura)
DROP POLICY IF EXISTS "subscription_plans_read_all" ON public.subscription_plans;
CREATE POLICY "subscription_plans_read_all"
ON public.subscription_plans FOR SELECT
TO authenticated
USING (is_active = true);

-- Políticas para user_subscriptions (solo propias)
DROP POLICY IF EXISTS "user_subscriptions_own_access" ON public.user_subscriptions;
CREATE POLICY "user_subscriptions_own_access"
ON public.user_subscriptions FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Políticas para subscription_payments (solo propias)
DROP POLICY IF EXISTS "subscription_payments_own_access" ON public.subscription_payments;
CREATE POLICY "subscription_payments_own_access"
ON public.subscription_payments FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- =====================
-- TRIGGERS PARA UPDATED_AT
-- =====================

-- Función genérica para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers para todas las tablas
DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON public.subscription_plans;
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON public.user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscription_payments_updated_at ON public.subscription_payments;
CREATE TRIGGER update_subscription_payments_updated_at
  BEFORE UPDATE ON public.subscription_payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================
-- VISTA PARA ESTADÍSTICAS
-- =====================

CREATE OR REPLACE VIEW public.subscription_stats AS
SELECT 
  sp.name as plan_name,
  sp.display_name,
  sp.price_annual,
  COUNT(us.id) as active_subscriptions,
  SUM(CASE WHEN us.status = 'active' THEN sp.price_annual ELSE 0 END) as monthly_revenue,
  AVG(EXTRACT(EPOCH FROM (us.expires_at - us.started_at))/86400) as avg_subscription_days
FROM public.subscription_plans sp
LEFT JOIN public.user_subscriptions us ON (
  us.plan_id = sp.id 
  AND us.status = 'active' 
  AND us.expires_at > NOW()
)
WHERE sp.is_active = true
GROUP BY sp.id, sp.name, sp.display_name, sp.price_annual, sp.sort_order
ORDER BY sp.sort_order;

-- Comentarios para documentación
COMMENT ON TABLE public.subscription_plans IS 'Planes de suscripción disponibles con límites y características';
COMMENT ON TABLE public.user_subscriptions IS 'Suscripciones activas de cada usuario';
COMMENT ON TABLE public.subscription_payments IS 'Historial completo de pagos y transacciones';
COMMENT ON FUNCTION public.get_user_current_plan(UUID) IS 'Obtiene el plan actual y límites de un usuario';
COMMENT ON FUNCTION public.check_user_limit(UUID, TEXT, INTEGER) IS 'Verifica si un usuario puede realizar una acción según su plan';
COMMENT ON FUNCTION public.create_subscription_after_payment(UUID, TEXT, TEXT, TEXT, DECIMAL) IS 'Crea suscripción después de pago exitoso de PayPal';
