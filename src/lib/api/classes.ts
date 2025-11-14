import { supabase } from "$lib/supabase";
import type { Class, Student, ClassStudent, CreateClassForm } from "$lib/types";

export const classesApi = {
  // Get all classes for the current user
  async getMyClasses(): Promise<Class[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("classes")
      .select(`
        *,
        colleges:college_id(*)
      `)
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get classes with occupancy info
  async getClassesWithOccupancy(): Promise<(Class & { enrolled?: number })[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("classes")
      .select(`
        *,
        colleges:college_id(*),
        v_class_occupancy!left(enrolled)
      `)
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    if (error) throw error;
    return data?.map(cls => ({
      ...cls,
      enrolled: cls.v_class_occupancy?.[0]?.enrolled || 0
    })) || [];
  },

  // Get a specific class
  async getClass(id: string): Promise<Class> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("classes")
      .select(`
        *,
        colleges:college_id(*)
      `)
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new class
  async createClass(classData: CreateClassForm): Promise<Class> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("classes")
      .insert({
        user_id: user.id,
        name: classData.name,
        college_id: classData.college_id,
        description: classData.description,
        level: classData.level,
        schedule: classData.schedule,
        max_students: classData.max_students || 20,
        active: classData.active !== false // Por defecto true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a class
  async updateClass(id: string, updates: Partial<CreateClassForm>): Promise<Class> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("classes")
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

  // Delete a class
  async deleteClass(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("classes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
  },

  // Get students in a class (using class_students bridge table)
  async getClassStudents(classId: string): Promise<Student[]> {
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

  // Get all enrollments for a class (using class_students bridge table)
  async getClassEnrollments(classId: string): Promise<ClassStudent[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("class_students")
      .select(`
        *,
        students:student_id(*)
      `)
      .eq("owner_id", user.id)
      .eq("class_id", classId);

    if (error) throw error;
    return data || [];
  },

  // Get class skills (temario)
  async getClassSkills(classId: string): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("class_skills")
      .select(`
        *,
        skills:skill_id(*)
      `)
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Get class occupancy (number of enrolled students)
  async getClassOccupancy(classId: string): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("v_class_occupancy")
      .select("enrolled")
      .eq("owner_id", user.id)
      .eq("class_id", classId)
      .single();

    if (error) return 0;
    return data?.enrolled || 0;
  },

  // Get class attendance for a specific date
  async getClassAttendance(classId: string, date: string): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("attendance")
      .select(`
        *,
        students:student_id(*)
      `)
      .eq("user_id", user.id)
      .eq("class_id", classId)
      .eq("date", date);

    if (error) throw error;
    return data || [];
  },

  // Get class attendance summary
  async getClassAttendanceSummary(classId: string, startDate?: string, endDate?: string): Promise<any[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    let query = supabase
      .from("attendance")
      .select(`
        student_id,
        students:student_id(name),
        status
      `)
      .eq("user_id", user.id)
      .eq("class_id", classId);

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

  // Duplicate a class (copy structure)
  async duplicateClass(classId: string, newName: string): Promise<Class> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get original class
    const originalClass = await this.getClass(classId);
    
    // Create new class
    const newClass = await this.createClass({
      name: newName,
      college_id: originalClass.college_id,
      description: originalClass.description,
      level: originalClass.level,
      schedule: originalClass.schedule,
      max_students: originalClass.max_students
    });

    // Copy skills (temario)
    const { data: skills, error: skillsError } = await supabase
      .from("class_skills")
      .select("skill_id, order_index")
      .eq("owner_id", user.id)
      .eq("class_id", classId);

    if (skillsError) throw skillsError;

    if (skills && skills.length > 0) {
      const skillsToInsert = skills.map(skill => ({
        owner_id: user.id,
        class_id: newClass.id,
        skill_id: skill.skill_id,
        order_index: skill.order_index
      }));

      const { error: insertError } = await supabase
        .from("class_skills")
        .insert(skillsToInsert);

      if (insertError) throw insertError;
    }

    return newClass;
  },

  // Get class analytics
  async getClassAnalytics(classId: string): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Get basic class info
    const classInfo = await this.getClass(classId);
    
    // Get occupancy
    const occupancy = await this.getClassOccupancy(classId);
    
    // Get skills count
    const { count: skillsCount, error: skillsError } = await supabase
      .from("class_skills")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", user.id)
      .eq("class_id", classId);

    if (skillsError) throw skillsError;

    // Get recent attendance
    const { data: recentAttendance, error: attendanceError } = await supabase
      .from("attendance")
      .select("status")
      .eq("user_id", user.id)
      .eq("class_id", classId)
      .gte("date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    if (attendanceError) throw attendanceError;

    const totalAttendanceRecords = recentAttendance?.length || 0;
    const presentRecords = recentAttendance?.filter(a => a.status === 'P').length || 0;
    const attendanceRate = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;

    return {
      class: classInfo,
      enrolled_students: occupancy,
      skills_count: skillsCount || 0,
      attendance_rate: Math.round(attendanceRate * 100) / 100
    };
  }
};