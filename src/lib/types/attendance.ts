import type { Student, Class } from './school';

export type AttendanceStatus = 'P' | 'T' | 'A'; // Presente, Tardanza, Ausente

export interface Attendance {
  id: string;
  owner_id: string;
  student_id: string;
  class_id: string;
  date: string; // YYYY-MM-DD format
  status: AttendanceStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceWithDetails extends Attendance {
  student?: Student;
  class?: Class;
}

export interface AttendanceRecord {
  student_id: string;
  student_name: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface ClassAttendance {
  class_id: string;
  class_name: string;
  date: string;
  records: AttendanceRecord[];
  total_students: number;
  present_count: number;
  late_count: number;
  absent_count: number;
}

export interface StudentAttendanceStats {
  student_id: string;
  student_name: string;
  total_sessions: number;
  present_count: number;
  late_count: number;
  absent_count: number;
  attendance_rate: number; // percentage
  punctuality_rate: number; // percentage (present / (present + late))
  last_attendance_date?: string;
}

export interface ClassAttendanceStats {
  class_id: string;
  class_name: string;
  total_sessions: number;
  average_attendance_rate: number;
  average_punctuality_rate: number;
  most_attended_date?: string;
  least_attended_date?: string;
  students: StudentAttendanceStats[];
}

export interface AttendanceFilters {
  class_id?: string;
  student_id?: string;
  date_from?: string;
  date_to?: string;
  status?: AttendanceStatus;
}

export interface AttendanceCalendarEvent {
  date: string;
  class_id: string;
  class_name: string;
  schedule: string;
  attendance_taken: boolean;
  present_count?: number;
  total_students?: number;
}

export interface AttendanceForm {
  class_id: string;
  student_id: string;
  date: string;
  status: "P" | "T" | "A";
  notes?: string;
}

export interface StudentAttendance {
  owner_id: string;
  student_id: string;
  marks: number;
  p_count: number;
  t_count: number;
  a_count: number;
  attendance_rate: number;
  punctuality_rate: number;
  last_date: string;
}
