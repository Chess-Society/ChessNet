-- =====================
-- ChessNet: Complete Database Schema (Estructura Real)
-- =====================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================
-- AUTHENTICATION & PROFILES
-- =====================

-- User profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'teacher' CHECK (role IN ('admin', 'teacher', 'assistant', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- CATEGORIES & COLLEGES
-- =====================

-- Categories for skills
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Colleges/Centers (por usuario)
CREATE TABLE IF NOT EXISTS public.colleges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT,
  country TEXT DEFAULT 'ES',
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- MAIN TABLES (por usuario - user_id)
-- =====================

-- Classes/Groups (por usuario)
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  schedule TEXT,
  max_students INTEGER DEFAULT 20,
  active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students (por usuario)
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  grade TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  avatar TEXT,
  notes TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills (por usuario)
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  resource_link TEXT,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- BRIDGE TABLES (por owner - owner_id)
-- =====================

-- Class Skills (temario clase ↔ skill)
CREATE TABLE IF NOT EXISTS public.class_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (class_id, skill_id)
);

-- Class Students (inscripciones clase ↔ alumno)
CREATE TABLE IF NOT EXISTS public.class_students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (class_id, student_id)
);

-- Attendance (asistencia: P/T/A por alumno+clase+fecha)
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('P', 'T', 'A')), -- Presente, Tardanza, Ausente
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (student_id, class_id, date)
);

-- Payments (pagos y facturación)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Tipo de pago: 'student' (individual) o 'school' (centro completo)
  payment_type TEXT NOT NULL CHECK (payment_type IN ('student', 'school')),
  
  -- Referencias opcionales según el tipo
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  
  -- Información del pago
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  concept TEXT NOT NULL, -- 'monthly_fee', 'registration', 'tournament', 'material', etc.
  description TEXT,
  
  -- Período que cubre el pago
  period_start DATE,
  period_end DATE,
  
  -- Estado del pago
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled', 'refunded')),
  
  -- Fechas importantes
  due_date DATE NOT NULL,
  paid_date TIMESTAMP WITH TIME ZONE,
  
  -- Método de pago y referencia
  payment_method TEXT, -- 'cash', 'transfer', 'card', 'paypal', etc.
  payment_reference TEXT, -- Número de transferencia, recibo, etc.
  
  -- Facturación
  invoice_number TEXT,
  invoice_date DATE,
  
  -- Notas y observaciones
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Restricciones de integridad
  CONSTRAINT valid_payment_entity CHECK (
    (payment_type = 'student' AND student_id IS NOT NULL) OR
    (payment_type = 'school' AND school_id IS NOT NULL)
  )
);

-- =====================
-- TRACKING TABLES (por usuario - user_id)
-- =====================

-- Attendance (asistencia P/T/A)
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('P', 'T', 'A')), -- Presente, Tarde, Ausente
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (student_id, class_id, date)
);

-- Student Skills (progreso alumno por skill)
CREATE TABLE IF NOT EXISTS public.student_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 0 CHECK (level >= 0 AND level <= 100),
  mastered BOOLEAN DEFAULT FALSE,
  notes TEXT,
  last_practiced TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (student_id, skill_id)
);

-- =====================
-- DERIVED VIEWS (heredan RLS)
-- =====================

-- Class Occupancy View (inscritos por clase)
CREATE OR REPLACE VIEW public.v_class_occupancy AS
SELECT 
  cs.owner_id,
  cs.class_id,
  COUNT(cs.student_id) AS enrolled
FROM public.class_students cs
WHERE cs.status = 'active'
GROUP BY cs.owner_id, cs.class_id;

-- Student Attendance View (resumen P/T/A por alumno)
CREATE OR REPLACE VIEW public.v_student_attendance AS
SELECT 
  a.user_id,
  a.student_id,
  COUNT(*) FILTER (WHERE a.status = 'P') AS p_count,
  COUNT(*) FILTER (WHERE a.status = 'T') AS t_count,
  COUNT(*) FILTER (WHERE a.status = 'A') AS a_count,
  COUNT(*) AS marks,
  ROUND(
    COUNT(*) FILTER (WHERE a.status = 'P')::DECIMAL / NULLIF(COUNT(*), 0) * 100, 
    2
  ) AS attendance_rate,
  ROUND(
    COUNT(*) FILTER (WHERE a.status = 'T')::DECIMAL / NULLIF(COUNT(*), 0) * 100, 
    2
  ) AS punctuality_rate,
  MAX(a.date) AS last_date
FROM public.attendance a
GROUP BY a.user_id, a.student_id;

-- =====================
-- ADDITIONAL TABLES
-- =====================

-- Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('general', 'class', 'student', 'event')),
  target_type TEXT CHECK (target_type IN ('all', 'class', 'student')),
  target_id UUID,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- INDEXES FOR PERFORMANCE
-- =====================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Colleges
CREATE INDEX IF NOT EXISTS idx_colleges_user_id ON public.colleges(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON public.attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class_date ON public.attendance(class_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON public.attendance(student_id, date);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON public.payments(due_date);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON public.payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_school_id ON public.payments(school_id);
CREATE INDEX IF NOT EXISTS idx_payments_period ON public.payments(period_start, period_end);

-- Classes
CREATE INDEX IF NOT EXISTS idx_classes_user_id ON public.classes(user_id);
CREATE INDEX IF NOT EXISTS idx_classes_college_id ON public.classes(college_id);

-- Students
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON public.students(class_id);

-- Skills
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON public.skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_category_id ON public.skills(category_id);

-- Class Skills
CREATE INDEX IF NOT EXISTS idx_class_skills_owner_id ON public.class_skills(owner_id);
CREATE INDEX IF NOT EXISTS idx_class_skills_class_id ON public.class_skills(class_id);
CREATE INDEX IF NOT EXISTS idx_class_skills_skill_id ON public.class_skills(skill_id);

-- Class Students
CREATE INDEX IF NOT EXISTS idx_class_students_owner_id ON public.class_students(owner_id);
CREATE INDEX IF NOT EXISTS idx_class_students_class_id ON public.class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student_id ON public.class_students(student_id);

-- Attendance
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON public.attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class_id ON public.attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);

-- Student Skills
CREATE INDEX IF NOT EXISTS idx_student_skills_user_id ON public.student_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_student_id ON public.student_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_skill_id ON public.student_skills(skill_id);

-- Announcements
CREATE INDEX IF NOT EXISTS idx_announcements_college_id ON public.announcements(college_id);
CREATE INDEX IF NOT EXISTS idx_announcements_created_by ON public.announcements(created_by);
CREATE INDEX IF NOT EXISTS idx_announcements_is_published ON public.announcements(is_published);