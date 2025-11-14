import { supabase } from "$lib/supabase";
import type { ClassStudent, Student } from "$lib/types";

export const classStudentsApi = {
  // Get all students enrolled in a class
  async getClassStudents(classId: string): Promise<(ClassStudent & { student: Student })[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("class_students")
      .select(`
        *,
        students:student_id(*)
      `)
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .eq("status", "active")
      .order("enrolled_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get all classes where a student is enrolled
  async getStudentClasses(studentId: string): Promise<(ClassStudent & { class: any })[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("class_students")
      .select(`
        *,
        classes:class_id(*)
      `)
      .eq("owner_id", user.id)
      .eq("student_id", studentId)
      .eq("status", "active")
      .order("enrolled_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Enroll a student in a class
  async enrollStudent(classId: string, studentId: string): Promise<ClassStudent> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Check if already enrolled
    const { data: existing } = await supabase
      .from("class_students")
      .select("id, status")
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .eq("student_id", studentId)
      .single();

    if (existing) {
      if (existing.status === "active") {
        throw new Error("Student is already enrolled in this class");
      } else {
        // Reactivate enrollment
        return this.updateEnrollmentStatus(existing.id, "active");
      }
    }

    const { data, error } = await supabase
      .from("class_students")
      .insert({
        owner_id: user.id,
        class_id: classId,
        student_id: studentId,
        status: "active"
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Enroll multiple students in a class
  async enrollStudents(classId: string, studentIds: string[]): Promise<ClassStudent[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const enrollmentsToInsert = studentIds.map(studentId => ({
      owner_id: user.id,
      class_id: classId,
      student_id: studentId,
      status: "active" as const
    }));

    const { data, error } = await supabase
      .from("class_students")
      .insert(enrollmentsToInsert)
      .select();

    if (error) throw error;
    return data || [];
  },

  // Remove a student from a class (soft delete - change status)
  async unenrollStudent(classId: string, studentId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("class_students")
      .update({ status: "inactive" })
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .eq("student_id", studentId);

    if (error) throw error;
  },

  // Remove multiple students from a class
  async unenrollStudents(classId: string, studentIds: string[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("class_students")
      .update({ status: "inactive" })
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .in("student_id", studentIds);

    if (error) throw error;
  },

  // Update enrollment status
  async updateEnrollmentStatus(
    enrollmentId: string, 
    status: "active" | "inactive" | "suspended"
  ): Promise<ClassStudent> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("class_students")
      .update({ status })
      .eq("id", enrollmentId)
      .eq("owner_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get class occupancy (number of enrolled students)
  async getClassOccupancy(classId: string): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { count, error } = await supabase
      .from("class_students")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .eq("status", "active");

    if (error) throw error;
    return count || 0;
  },

  // Get all class occupancies for user
  async getAllClassOccupancies(): Promise<{ class_id: string; enrolled: number }[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("v_class_occupancy")
      .select("*")
      .eq("owner_id", user.id);

    if (error) throw error;
    return data || [];
  },

  // Get students not enrolled in a specific class
  async getAvailableStudents(classId: string): Promise<Student[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get all user's students
    const { data: allStudents, error: studentsError } = await supabase
      .from("students")
      .select("*")
      .eq("user_id", user.id);

    if (studentsError) throw studentsError;

    // Get enrolled student IDs
    const { data: enrolledStudents, error: enrolledError } = await supabase
      .from("class_students")
      .select("student_id")
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .eq("status", "active");

    if (enrolledError) throw enrolledError;

    const enrolledIds = new Set(enrolledStudents?.map(e => e.student_id) || []);
    
    // Filter out enrolled students
    return allStudents?.filter(student => !enrolledIds.has(student.id)) || [];
  },

  // Transfer students from one class to another
  async transferStudents(fromClassId: string, toClassId: string, studentIds: string[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Start transaction-like operations
    // 1. Unenroll from source class
    await this.unenrollStudents(fromClassId, studentIds);
    
    // 2. Enroll in target class
    await this.enrollStudents(toClassId, studentIds);
  },

  // Get enrollment history for a student
  async getStudentEnrollmentHistory(studentId: string): Promise<ClassStudent[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("class_students")
      .select(`
        *,
        classes:class_id(name, level)
      `)
      .eq("owner_id", user.id)
      .eq("student_id", studentId)
      .order("enrolled_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
