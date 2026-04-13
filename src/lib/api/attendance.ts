import { db, toData } from "$lib/firebase";
import { getOwnerId, getOwnedQuery } from "./base";
import { 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  setDoc,
  deleteDoc,
  writeBatch,
  collection
} from "firebase/firestore";
import type { 
  Attendance, 
  AttendanceWithDetails, 
  AttendanceStatus, 
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
    const ownerId = await getOwnerId();

    let q = query(
      getOwnedQuery('attendance'),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    let records = querySnapshot.docs.map(doc => toData<any>(doc));

    if (filters.class_id) {
      records = records.filter(r => r.class_id === filters.class_id);
    }
    if (filters.student_id) {
      records = records.filter(r => r.student_id === filters.student_id);
    }
    if (filters.date_from) {
      records = records.filter(r => r.date >= filters.date_from!);
    }
    if (filters.date_to) {
      records = records.filter(r => r.date <= filters.date_to!);
    }
    if (filters.status) {
      records = records.filter(r => r.status === filters.status);
    }

    // Fetch details (Manual Join)
    for (const record of records) {
      if (record.student_id) {
        const studentDoc = await getDoc(doc(db, "students", record.student_id));
        if (studentDoc.exists()) {
          record.student = { id: studentDoc.id, name: studentDoc.data().name, email: studentDoc.data().email };
        }
      }
      if (record.class_id) {
        const classDoc = await getDoc(doc(db, "classes", record.class_id));
        if (classDoc.exists()) {
          record.class = { id: classDoc.id, name: classDoc.data().name, schedule: classDoc.data().schedule };
        }
      }
    }

    return records as AttendanceWithDetails[];
  },

  /**
   * Get attendance for a specific class and date
   */
  async getByClassAndDate(classId: string, date: string) {
    const q = query(
      getOwnedQuery('attendance'),
      where('class_id', '==', classId),
      where('date', '==', date)
    );

    const querySnapshot = await getDocs(q);
    const records = querySnapshot.docs.map(doc => toData<any>(doc));

    // Fetch student details
    for (const record of records) {
      if (record.student_id) {
        const studentDoc = await getDoc(doc(db, "students", record.student_id));
        if (studentDoc.exists()) {
          record.student = { id: studentDoc.id, name: studentDoc.data().name, email: studentDoc.data().email };
        }
      }
    }

    return records.sort((a, b) => (a.student?.name || "").localeCompare(b.student?.name || "")) as AttendanceWithDetails[];
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
    const ownerId = await getOwnerId();

    const attendanceId = `${studentId}_${classId}_${date}`;
    const docRef = doc(db, "attendance", attendanceId);
    
    const attendanceData = {
      owner_id: ownerId,
      student_id: studentId,
      class_id: classId,
      date,
      status,
      notes: notes || "",
      updated_at: new Date().toISOString()
    };

    await setDoc(docRef, attendanceData, { merge: true });
    
    const docSnap = await getDoc(docRef);
    return toData<Attendance>(docSnap);
  },

  /**
   * Mark attendance for multiple students (bulk operation)
   */
  async markBulkAttendance(records: AttendanceRecord[], classId: string, date: string) {
    const ownerId = await getOwnerId();

    const batch = writeBatch(db);
    const now = new Date().toISOString();
    const result: string[] = [];

    for (const record of records) {
      const attendanceId = `${record.student_id}_${classId}_${date}`;
      const docRef = doc(db, "attendance", attendanceId);
      
      const data = {
        owner_id: ownerId,
        student_id: record.student_id,
        class_id: classId,
        date,
        status: record.status,
        notes: record.notes || "",
        updated_at: now
      };
      
      batch.set(docRef, data, { merge: true });
      result.push(attendanceId);
    }

    await batch.commit();

    // Fetching created records
    const updatedRecords: Attendance[] = [];
    for (const id of result) {
      const snap = await getDoc(doc(db, "attendance", id));
      if (snap.exists()) {
        updatedRecords.push(toData<Attendance>(snap));
      }
    }

    return updatedRecords;
  },

  /**
   * Delete attendance record
   */
  async delete(id: string) {
    const docRef = doc(db, "attendance", id);
    await deleteDoc(docRef);
  },

  // =====================
  // STATISTICS & REPORTS
  // =====================

  /**
   * Get attendance statistics for a student
   */
  async getStudentStats(studentId: string, classId?: string, dateFrom?: string, dateTo?: string): Promise<StudentAttendanceStats> {
    let q = query(
      getOwnedQuery('attendance'),
      where('student_id', '==', studentId)
    );

    const querySnapshot = await getDocs(q);
    let data = querySnapshot.docs.map(doc => toData<any>(doc));

    if (classId) {
      data = data.filter(r => r.class_id === classId);
    }
    if (dateFrom) {
      data = data.filter(r => r.date >= dateFrom);
    }
    if (dateTo) {
      data = data.filter(r => r.date <= dateTo);
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

    // Fetch student name
    const studentDoc = await getDoc(doc(db, "students", studentId));
    const studentName = studentDoc.exists() ? studentDoc.data().name : 'Unknown Student';

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
      student_name: studentName,
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
    const classDoc = await getDoc(doc(db, "classes", classId));
    if (!classDoc.exists()) throw new Error("Class not found");
    const classData = classDoc.data();

    // Get all attendance records for the class
    let q = query(
      getOwnedQuery('attendance'),
      where('class_id', '==', classId)
    );

    const querySnapshot = await getDocs(q);
    let data = querySnapshot.docs.map(doc => toData<any>(doc));

    if (dateFrom) {
      data = data.filter(r => r.date >= dateFrom);
    }
    if (dateTo) {
      data = data.filter(r => r.date <= dateTo);
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

    for (const [studentId, studentRecords] of Object.entries(studentGroups)) {
      const records = studentRecords as any[];
      const studentDoc = await getDoc(doc(db, "students", studentId));
      const studentName = studentDoc.exists() ? studentDoc.data().name : 'Unknown Student';

      const presentCount = records.filter(r => r.status === 'P').length;
      const lateCount = records.filter(r => r.status === 'T').length;
      const absentCount = records.filter(r => r.status === 'A').length;
      const totalSessions = records.length;

      const attendanceRate = totalSessions > 0 ? Math.round(((presentCount + lateCount) / totalSessions) * 100) : 0;
      const punctualityRate = (presentCount + lateCount) > 0 ? Math.round((presentCount / (presentCount + lateCount)) * 100) : 0;

      const lastAttendanceDate = records
        .filter(r => r.status !== 'A')
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date;

      students.push({
        student_id: studentId,
        student_name: studentName,
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

    for (const [date, stats] of Object.entries(dateGroups) as [string, { present: number; total: number }][]) {
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
    // Get all classes for user
    const classesQuery = query(
      getOwnedQuery('classes'),
      where('active', '==', true)
    );
    const classesSnap = await getDocs(classesQuery);
    const classes = classesSnap.docs.map(doc => toData<any>(doc));

    if (!classes || classes.length === 0) {
      return [];
    }

    // Get attendance data for the date range
    const attendanceQuery = getOwnedQuery('attendance');
    const attendanceSnap = await getDocs(attendanceQuery);
    let attendance = attendanceSnap.docs.map(doc => doc.data());
    
    attendance = attendance.filter((a: any) => a.date >= dateFrom && a.date <= dateTo);

    // Group attendance by class and date
    const attendanceMap = attendance.reduce((acc: any, record: any) => {
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
        const attendanceData = (attendanceMap as any)[key];

        if (attendanceData) {
          events.push({
            date: dateStr,
            class_id: classItem.id,
            class_name: classItem.name,
            schedule: classItem.schedule || '',
            attendance_taken: true,
            present_count: attendanceData.present,
            total_students: attendanceData.total
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return events.sort((a, b) => a.date.localeCompare(b.date));
  }
};
