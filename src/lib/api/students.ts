import { supabase } from "$lib/supabase";
import type { Student, Attendance, CreateStudentForm } from "$lib/types";

export const studentsApi = {
  // Get all students for the current user
  async getMyStudents(): Promise<Student[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("students")
      .select(`
        *,
        classes:class_id(*)
      `)
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get students by class (using class_students bridge table)
  async getStudentsByClass(classId: string): Promise<Student[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("class_students")
      .select(`
        students:student_id(*)
      `)
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .eq("status", "active");

    if (error) throw error;
    return data?.map((item: any) => item.students).filter(Boolean) || [];
  },

  // Get a specific student
  async getStudent(id: string): Promise<Student> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("students")
      .select(`
        *,
        classes:class_id(*)
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new student
  async createStudent(studentData: CreateStudentForm): Promise<Student> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("students")
      .insert({
        user_id: user.id,
        name: studentData.name,
        class_id: studentData.class_id,
        first_name: studentData.first_name,
        last_name: studentData.last_name,
        date_of_birth: studentData.date_of_birth,
        grade: studentData.grade,
        parent_email: studentData.parent_email,
        parent_phone: studentData.parent_phone,
        notes: studentData.notes
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a student
  async updateStudent(id: string, updates: Partial<CreateStudentForm>): Promise<Student> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("students")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a student
  async deleteStudent(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
  },

  // Get student's classes (using class_students bridge table)
  async getStudentClasses(studentId: string): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("class_students")
      .select(`
        classes:class_id(*)
      `)
      .eq("owner_id", user.id)
      .eq("student_id", studentId)
      .eq("status", "active");

    if (error) throw error;
    return data?.map((item: any) => item.classes).filter(Boolean) || [];
  },

  // Get student attendance
  async getStudentAttendance(
    studentId: string,
    classId?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<Attendance[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    let query = supabase
      .from("attendance")
      .select("*")
      .eq("user_id", user.id)
      .eq("student_id", studentId)
      .order("date", { ascending: false });

    if (classId) {
      query = query.eq("class_id", classId);
    }

    if (startDate) {
      query = query.gte("date", startDate);
    }

    if (endDate) {
      query = query.lte("date", endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  // Get student attendance summary (using view)
  async getStudentAttendanceSummary(studentId: string): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("v_student_attendance")
      .select("*")
      .eq("user_id", user.id)
      .eq("student_id", studentId)
      .single();

    if (error) throw error;
    return data;
  },

  // Mark attendance
  async markAttendance(
    classId: string,
    studentId: string,
    date: string,
    status: "P" | "T" | "A",
    notes?: string,
  ): Promise<Attendance> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("attendance")
      .upsert({
        user_id: user.id,
        class_id: classId,
        student_id: studentId,
        date,
        status,
        notes,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mark attendance for multiple students
  async markMultipleAttendance(
    classId: string,
    attendanceRecords: Array<{
      student_id: string;
      date: string;
      status: "P" | "T" | "A";
      notes?: string;
    }>
  ): Promise<Attendance[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const recordsToInsert = attendanceRecords.map(record => ({
      user_id: user.id,
      class_id: classId,
      student_id: record.student_id,
      date: record.date,
      status: record.status,
      notes: record.notes,
      created_by: user.id
    }));

    const { data, error } = await supabase
      .from("attendance")
      .upsert(recordsToInsert)
      .select();

    if (error) throw error;
    return data || [];
  },

  // Delete attendance record
  async deleteAttendance(
    classId: string,
    studentId: string,
    date: string,
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("attendance")
      .delete()
      .eq("user_id", user.id)
      .eq("class_id", classId)
      .eq("student_id", studentId)
      .eq("date", date);

    if (error) throw error;
  },

  // Get student skills progress
  async getStudentSkills(studentId: string): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("student_skills")
      .select(`
        *,
        skills:skill_id(*)
      `)
      .eq("user_id", user.id)
      .eq("student_id", studentId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Update student skill progress
  async updateStudentSkill(
    studentId: string,
    skillId: string,
    level: number,
    mastered: boolean,
    notes?: string
  ): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("student_skills")
      .upsert({
        user_id: user.id,
        student_id: studentId,
        skill_id: skillId,
        level,
        mastered,
        notes,
        last_practiced: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get students with attendance summary
  async getStudentsWithAttendance(): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("students")
      .select(`
        *,
        v_student_attendance!inner(*)
      `)
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  }
};