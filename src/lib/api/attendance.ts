import { supabase } from '$lib/supabase';
import type { 
  Attendance, 
  AttendanceWithDetails, 
  AttendanceStatus, 
  ClassAttendance,
  AttendanceRecord,
  StudentAttendanceStats,
  ClassAttendanceStats,
  AttendanceFilters,
  AttendanceCalendarEvent
} from '$lib/types';

export const attendanceApi = {
  // =====================
  // CRUD OPERATIONS
  // =====================

  /**
   * Get attendance records with optional filters
   */
  async get(filters: AttendanceFilters = {}) {
    let query = supabase
      .from('attendance')
      .select(`
        *,
        student:students(id, name, email),
        class:classes(id, name, schedule)
      `)
      .order('date', { ascending: false });

    if (filters.class_id) {
      query = query.eq('class_id', filters.class_id);
    }

    if (filters.student_id) {
      query = query.eq('student_id', filters.student_id);
    }

    if (filters.date_from) {
      query = query.gte('date', filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte('date', filters.date_to);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }

    return data as AttendanceWithDetails[];
  },

  /**
   * Get attendance for a specific class and date
   */
  async getByClassAndDate(classId: string, date: string) {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        student:students(id, name, email)
      `)
      .eq('class_id', classId)
      .eq('date', date)
      .order('student.name');

    if (error) {
      console.error('Error fetching class attendance:', error);
      throw error;
    }

    return data as AttendanceWithDetails[];
  },

  /**
   * Mark attendance for a student
   */
  async markAttendance(
    studentId: string, 
    classId: string, 
    date: string, 
    status: AttendanceStatus, 
    notes?: string
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const attendanceData = {
      user_id: user.id,
      student_id: studentId,
      class_id: classId,
      date,
      status,
      notes,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('attendance')
      .upsert(attendanceData, {
        onConflict: 'student_id,class_id,date'
      })
      .select()
      .single();

    if (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }

    return data as Attendance;
  },

  /**
   * Mark attendance for multiple students (bulk operation)
   */
  async markBulkAttendance(records: AttendanceRecord[], classId: string, date: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const attendanceData = records.map(record => ({
      user_id: user.id,
      student_id: record.student_id,
      class_id: classId,
      date,
      status: record.status,
      notes: record.notes,
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('attendance')
      .upsert(attendanceData, {
        onConflict: 'student_id,class_id,date'
      })
      .select();

    if (error) {
      console.error('Error marking bulk attendance:', error);
      throw error;
    }

    return data as Attendance[];
  },

  /**
   * Delete attendance record
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting attendance:', error);
      throw error;
    }
  },

  // =====================
  // STATISTICS & REPORTS
  // =====================

  /**
   * Get attendance statistics for a student
   */
  async getStudentStats(studentId: string, classId?: string, dateFrom?: string, dateTo?: string): Promise<StudentAttendanceStats> {
    let query = supabase
      .from('attendance')
      .select('status, date, student:students(name)')
      .eq('student_id', studentId);

    if (classId) {
      query = query.eq('class_id', classId);
    }

    if (dateFrom) {
      query = query.gte('date', dateFrom);
    }

    if (dateTo) {
      query = query.lte('date', dateTo);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching student stats:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return {
        student_id: studentId,
        student_name: 'Unknown Student',
        total_sessions: 0,
        present_count: 0,
        late_count: 0,
        absent_count: 0,
        attendance_rate: 0,
        punctuality_rate: 0
      };
    }

    const presentCount = data.filter(r => r.status === 'P').length;
    const lateCount = data.filter(r => r.status === 'T').length;
    const absentCount = data.filter(r => r.status === 'A').length;
    const totalSessions = data.length;

    const attendanceRate = totalSessions > 0 ? Math.round(((presentCount + lateCount) / totalSessions) * 100) : 0;
    const punctualityRate = (presentCount + lateCount) > 0 ? Math.round((presentCount / (presentCount + lateCount)) * 100) : 0;

    const lastAttendanceDate = data
      .filter(r => r.status !== 'A')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date;

    return {
      student_id: studentId,
      student_name: data[0]?.student?.name || 'Unknown Student',
      total_sessions: totalSessions,
      present_count: presentCount,
      late_count: lateCount,
      absent_count: absentCount,
      attendance_rate: attendanceRate,
      punctuality_rate: punctualityRate,
      last_attendance_date: lastAttendanceDate
    };
  },

  /**
   * Get attendance statistics for a class
   */
  async getClassStats(classId: string, dateFrom?: string, dateTo?: string): Promise<ClassAttendanceStats> {
    // Get class info
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('name')
      .eq('id', classId)
      .single();

    if (classError) {
      console.error('Error fetching class:', classError);
      throw classError;
    }

    // Get all attendance records for the class
    let query = supabase
      .from('attendance')
      .select(`
        status, 
        date, 
        student_id,
        student:students(name)
      `)
      .eq('class_id', classId);

    if (dateFrom) {
      query = query.gte('date', dateFrom);
    }

    if (dateTo) {
      query = query.lte('date', dateTo);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching class stats:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return {
        class_id: classId,
        class_name: classData?.name || 'Unknown Class',
        total_sessions: 0,
        average_attendance_rate: 0,
        average_punctuality_rate: 0,
        students: []
      };
    }

    // Group by student
    const studentGroups = data.reduce((acc, record) => {
      if (!acc[record.student_id]) {
        acc[record.student_id] = [];
      }
      acc[record.student_id].push(record);
      return acc;
    }, {} as Record<string, any[]>);

    // Calculate stats for each student
    const students: StudentAttendanceStats[] = [];
    let totalAttendanceRate = 0;
    let totalPunctualityRate = 0;

    for (const [studentId, records] of Object.entries(studentGroups || {})) {
      const presentCount = records.filter(r => r.status === 'P').length;
      const lateCount = records.filter(r => r.status === 'T').length;
      const absentCount = records.filter(r => r.status === 'A').length;
      const totalSessions = records.length;

      const attendanceRate = totalSessions > 0 ? Math.round(((presentCount + lateCount) / totalSessions) * 100) : 0;
      const punctualityRate = (presentCount + lateCount) > 0 ? Math.round((presentCount / (presentCount + lateCount)) * 100) : 0;

      const lastAttendanceDate = records
        .filter(r => r.status !== 'A')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date;

      students.push({
        student_id: studentId,
        student_name: records[0]?.student?.name || 'Unknown Student',
        total_sessions: totalSessions,
        present_count: presentCount,
        late_count: lateCount,
        absent_count: absentCount,
        attendance_rate: attendanceRate,
        punctuality_rate: punctualityRate,
        last_attendance_date: lastAttendanceDate
      });

      totalAttendanceRate += attendanceRate;
      totalPunctualityRate += punctualityRate;
    }

    // Calculate class averages
    const studentCount = students.length;
    const averageAttendanceRate = studentCount > 0 ? Math.round(totalAttendanceRate / studentCount) : 0;
    const averagePunctualityRate = studentCount > 0 ? Math.round(totalPunctualityRate / studentCount) : 0;

    // Find best/worst attendance dates
    const dateGroups = data.reduce((acc, record) => {
      if (!acc[record.date]) {
        acc[record.date] = { present: 0, total: 0 };
      }
      acc[record.date].total++;
      if (record.status === 'P' || record.status === 'T') {
        acc[record.date].present++;
      }
      return acc;
    }, {} as Record<string, { present: number; total: number }>);

    let mostAttendedDate: string | undefined;
    let leastAttendedDate: string | undefined;
    let highestRate = -1;
    let lowestRate = 101;

    for (const [date, stats] of Object.entries(dateGroups || {})) {
      const rate = (stats.present / stats.total) * 100;
      if (rate > highestRate) {
        highestRate = rate;
        mostAttendedDate = date;
      }
      if (rate < lowestRate) {
        lowestRate = rate;
        leastAttendedDate = date;
      }
    }

    return {
      class_id: classId,
      class_name: classData?.name || 'Unknown Class',
      total_sessions: Object.keys(dateGroups).length,
      average_attendance_rate: averageAttendanceRate,
      average_punctuality_rate: averagePunctualityRate,
      most_attended_date: mostAttendedDate,
      least_attended_date: leastAttendedDate,
      students: students.sort((a, b) => b.attendance_rate - a.attendance_rate)
    };
  },

  /**
   * Get attendance overview for a specific date range
   */
  async getCalendarEvents(dateFrom: string, dateTo: string): Promise<AttendanceCalendarEvent[]> {
    // Get all classes with their schedules
    const { data: classes, error: classError } = await supabase
      .from('classes')
      .select('id, name, schedule')
      .eq('active', true);

    if (classError) {
      console.error('Error fetching classes:', classError);
      throw classError;
    }

    if (!classes || classes.length === 0) {
      return [];
    }

    // Get attendance data for the date range
    const { data: attendance, error: attendanceError } = await supabase
      .from('attendance')
      .select('class_id, date, status')
      .gte('date', dateFrom)
      .lte('date', dateTo);

    if (attendanceError) {
      console.error('Error fetching attendance calendar:', attendanceError);
      throw attendanceError;
    }

    // Group attendance by class and date
    const attendanceMap = (attendance || []).reduce((acc, record) => {
      const key = `${record.class_id}-${record.date}`;
      if (!acc[key]) {
        acc[key] = { present: 0, total: 0 };
      }
      acc[key].total++;
      if (record.status === 'P' || record.status === 'T') {
        acc[key].present++;
      }
      return acc;
    }, {} as Record<string, { present: number; total: number }>);

    // Generate calendar events
    const events: AttendanceCalendarEvent[] = [];
    const currentDate = new Date(dateFrom);
    const endDate = new Date(dateTo);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];

      for (const classItem of classes) {
        const key = `${classItem.id}-${dateStr}`;
        const attendanceData = attendanceMap[key];

        events.push({
          date: dateStr,
          class_id: classItem.id,
          class_name: classItem.name,
          schedule: classItem.schedule || '',
          attendance_taken: !!attendanceData,
          present_count: attendanceData?.present || 0,
          total_students: attendanceData?.total || 0
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return events.sort((a, b) => a.date.localeCompare(b.date));
  }
};
