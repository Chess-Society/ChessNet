import type { Student, Class } from './school';

export type AttendanceStatus = 'P' | 'T' | 'A'; // Presente, Tardanza, Ausente

export interface Attendance {
  id: string;
  owner_id: string;
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD format
  status: AttendanceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceWithDetails extends Attendance {
  student?: Student;
  class?: Class;
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface ClassAttendance {
  classId: string;
  className: string;
  date: string;
  records: AttendanceRecord[];
  totalStudents: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
}

export interface StudentAttendanceStats {
  studentId: string;
  studentName: string;
  totalSessions: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  attendanceRate: number; // percentage
  punctualityRate: number; // percentage (present / (present + late))
  lastAttendanceDate?: string;
}

export interface ClassAttendanceStats {
  classId: string;
  className: string;
  totalSessions: number;
  averageAttendanceRate: number;
  averagePunctualityRate: number;
  mostAttendedDate?: string;
  leastAttendedDate?: string;
  students: StudentAttendanceStats[];
}

export interface AttendanceFilters {
  classId?: string;
  studentId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: AttendanceStatus;
}

export interface AttendanceCalendarEvent {
  date: string;
  classId: string;
  className: string;
  schedule: string;
  attendanceTaken: boolean;
  presentCount?: number;
  totalStudents?: number;
}

export interface AttendanceForm {
  classId: string;
  studentId: string;
  date: string;
  status: "P" | "T" | "A";
  notes?: string;
}

export interface StudentAttendance {
  owner_id: string;
  studentId: string;
  marks: number;
  pCount: number;
  tCount: number;
  aCount: number;
  attendanceRate: number;
  punctualityRate: number;
  lastDate: string;
}
