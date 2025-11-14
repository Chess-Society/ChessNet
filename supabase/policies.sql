-- =====================
-- ChessNet: Row Level Security Policies (Estructura Real)
-- =====================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- =====================
-- PROFILES POLICIES
-- =====================

-- Users can view and update their own profile
DROP POLICY IF EXISTS "profiles_self_select" ON public.profiles;
CREATE POLICY "profiles_self_select"
ON public.profiles FOR SELECT
USING (id = auth.uid());

DROP POLICY IF EXISTS "profiles_self_update" ON public.profiles;
CREATE POLICY "profiles_self_update"
ON public.profiles FOR UPDATE
USING (id = auth.uid());

DROP POLICY IF EXISTS "profiles_self_insert" ON public.profiles;
CREATE POLICY "profiles_self_insert"
ON public.profiles FOR INSERT
WITH CHECK (id = auth.uid());

-- =====================
-- CATEGORIES POLICIES (Public read, admin write)
-- =====================

-- All authenticated users can read categories
DROP POLICY IF EXISTS "categories_read_authenticated" ON public.categories;
CREATE POLICY "categories_read_authenticated"
ON public.categories FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage categories (placeholder - adjust based on your admin logic)
DROP POLICY IF EXISTS "categories_admin_write" ON public.categories;
CREATE POLICY "categories_admin_write"
ON public.categories FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- =====================
-- COLLEGES POLICIES (por usuario - user_id)
-- =====================

-- Users can only access their own colleges
DROP POLICY IF EXISTS "colleges_user_access" ON public.colleges;
CREATE POLICY "colleges_user_access"
ON public.colleges FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- =====================
-- MAIN TABLES POLICIES (por usuario - user_id)
-- =====================

-- CLASSES: Users can only access their own classes
DROP POLICY IF EXISTS "classes_user_access" ON public.classes;
CREATE POLICY "classes_user_access"
ON public.classes FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- STUDENTS: Users can only access their own students
DROP POLICY IF EXISTS "students_user_access" ON public.students;
CREATE POLICY "students_user_access"
ON public.students FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- SKILLS: Users can only access their own skills
DROP POLICY IF EXISTS "skills_user_access" ON public.skills;
CREATE POLICY "skills_user_access"
ON public.skills FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ATTENDANCE: Users can only access their own attendance records
DROP POLICY IF EXISTS "attendance_user_access" ON public.attendance;
CREATE POLICY "attendance_user_access"
ON public.attendance FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- PAYMENTS: Users can only access their own payment records
DROP POLICY IF EXISTS "payments_user_access" ON public.payments;
CREATE POLICY "payments_user_access"
ON public.payments FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- =====================
-- BRIDGE TABLES POLICIES (por owner - owner_id)
-- =====================

-- CLASS_SKILLS: Users can only access their own class-skill relationships
DROP POLICY IF EXISTS "class_skills_owner_access" ON public.class_skills;
CREATE POLICY "class_skills_owner_access"
ON public.class_skills FOR ALL
USING (owner_id = auth.uid())
WITH CHECK (
  owner_id = auth.uid() AND
  EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.user_id = auth.uid()) AND
  EXISTS (SELECT 1 FROM public.skills s WHERE s.id = skill_id AND s.user_id = auth.uid())
);

-- CLASS_STUDENTS: Users can only access their own class-student relationships
DROP POLICY IF EXISTS "class_students_owner_access" ON public.class_students;
CREATE POLICY "class_students_owner_access"
ON public.class_students FOR ALL
USING (owner_id = auth.uid())
WITH CHECK (
  owner_id = auth.uid() AND
  EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.user_id = auth.uid()) AND
  EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid())
);

-- =====================
-- TRACKING TABLES POLICIES (por usuario - user_id)
-- =====================

-- ATTENDANCE: Users can only access their own attendance records
DROP POLICY IF EXISTS "attendance_user_access" ON public.attendance;
CREATE POLICY "attendance_user_access"
ON public.attendance FOR ALL
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.user_id = auth.uid()) AND
  EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid())
);

-- STUDENT_SKILLS: Users can only access their own student skills records
DROP POLICY IF EXISTS "student_skills_user_access" ON public.student_skills;
CREATE POLICY "student_skills_user_access"
ON public.student_skills FOR ALL
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.user_id = auth.uid()) AND
  EXISTS (SELECT 1 FROM public.skills sk WHERE sk.id = skill_id AND sk.user_id = auth.uid())
);

-- =====================
-- ANNOUNCEMENTS POLICIES
-- =====================

-- Users can read announcements from colleges they have classes in
DROP POLICY IF EXISTS "announcements_read_user_colleges" ON public.announcements;
CREATE POLICY "announcements_read_user_colleges"
ON public.announcements FOR SELECT
USING (
  is_published = true AND
  (
    -- Public announcements
    target_type = 'all' OR
    -- Announcements for colleges where user has classes
    EXISTS (
      SELECT 1 FROM public.classes c 
      WHERE c.user_id = auth.uid() AND c.college_id = announcements.college_id
    )
  )
);

-- Only admins can manage announcements
DROP POLICY IF EXISTS "announcements_admin_write" ON public.announcements;
CREATE POLICY "announcements_admin_write"
ON public.announcements FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

-- =====================
-- VIEW POLICIES (inherit from base tables)
-- =====================

-- Views inherit RLS from their base tables automatically
-- v_class_occupancy: Inherits from class_students (owner_id = auth.uid())
-- v_student_attendance: Inherits from attendance (user_id = auth.uid())

-- =====================
-- HELPER FUNCTIONS FOR VALIDATION
-- =====================

-- Function to validate class ownership
CREATE OR REPLACE FUNCTION public.user_owns_class(class_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = class_uuid AND c.user_id = auth.uid()
  );
$$;

-- Function to validate student ownership
CREATE OR REPLACE FUNCTION public.user_owns_student(student_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = student_uuid AND s.user_id = auth.uid()
  );
$$;

-- Function to validate skill ownership
CREATE OR REPLACE FUNCTION public.user_owns_skill(skill_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.skills s
    WHERE s.id = skill_uuid AND s.user_id = auth.uid()
  );
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.user_is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  );
$$;

-- =====================
-- ADDITIONAL SECURITY
-- =====================

-- Prevent users from accessing other users' data through foreign key relationships
-- This is already handled by the main policies, but adding extra validation

-- Ensure class_skills can only reference user's own classes and skills
ALTER TABLE public.class_skills 
ADD CONSTRAINT class_skills_user_class_check 
CHECK (public.user_owns_class(class_id));

ALTER TABLE public.class_skills 
ADD CONSTRAINT class_skills_user_skill_check 
CHECK (public.user_owns_skill(skill_id));

-- Ensure class_students can only reference user's own classes and students
ALTER TABLE public.class_students 
ADD CONSTRAINT class_students_user_class_check 
CHECK (public.user_owns_class(class_id));

ALTER TABLE public.class_students 
ADD CONSTRAINT class_students_user_student_check 
CHECK (public.user_owns_student(student_id));

-- Ensure attendance can only reference user's own classes and students
ALTER TABLE public.attendance 
ADD CONSTRAINT attendance_user_class_check 
CHECK (public.user_owns_class(class_id));

ALTER TABLE public.attendance 
ADD CONSTRAINT attendance_user_student_check 
CHECK (public.user_owns_student(student_id));

-- Ensure student_skills can only reference user's own students and skills
ALTER TABLE public.student_skills 
ADD CONSTRAINT student_skills_user_student_check 
CHECK (public.user_owns_student(student_id));

ALTER TABLE public.student_skills 
ADD CONSTRAINT student_skills_user_skill_check 
CHECK (public.user_owns_skill(skill_id));

-- =====================
-- GRANTS AND PERMISSIONS
-- =====================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions for views
GRANT SELECT ON public.v_class_occupancy TO authenticated;
GRANT SELECT ON public.v_student_attendance TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.user_owns_class(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_owns_student(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_owns_skill(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_is_admin() TO authenticated;