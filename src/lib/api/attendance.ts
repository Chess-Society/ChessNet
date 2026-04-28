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
    const q = query(
      getOwnedQuery('attendance'),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    let records = querySnapshot.docs.map(doc => toData<any>(doc));

    if (filters.classId) {
      records = records.filter(r => r.classId === filters.classId);
    }
    if (filters.studentId) {
      records = records.filter(r => r.studentId === filters.studentId);
    }
    if (filters.dateFrom) {
      records = records.filter(r => r.date >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      records = records.filter(r => r.date <= filters.dateTo!);
    }
    if (filters.status) {
      records = records.filter(r => r.status === filters.status);
    }

    // Fetch details (Manual Join)
    for (const record of records) {
      if (record.studentId) {
        const studentDoc = await getDoc(doc(db, "students", record.studentId));
        if (studentDoc.exists()) {
          record.student = { id: studentDoc.id, name: studentDoc.data().name, email: studentDoc.data().email };
        }
      }
      if (record.classId) {
        const classDoc = await getDoc(doc(db, "classes", record.classId));
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
      where('classId', '==', classId),
      where('date', '==', date)
    );

    const querySnapshot = await getDocs(q);
    const records = querySnapshot.docs.map(doc => toData<any>(doc));

    // Fetch student details
    for (const record of records) {
      if (record.studentId) {
        const studentDoc = await getDoc(doc(db, "students", record.studentId));
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
      ownerId: ownerId,
      studentId,
      classId,
      date,
      status,
      notes: notes || "",
      updatedAt: new Date().toISOString()
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
      const attendanceId = `${record.studentId}_${classId}_${date}`;
      const docRef = doc(db, "attendance", attendanceId);
      
      const data = {
        ownerId: ownerId,
        studentId: record.studentId,
        classId,
        date,
        status: record.status,
        notes: record.notes || "",
        updatedAt: now
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
    const q = query(
      getOwnedQuery('attendance'),
      where('studentId', '==', studentId)
    );

    const querySnapshot = await getDocs(q);
    let data = querySnapshot.docs.map(doc => toData<any>(doc));

    if (classId) {
      data = data.filter(r => r.classId === classId);
    }
    if (dateFrom) {
      data = data.filter(r => r.date >= dateFrom);
    }
    if (dateTo) {
      data = data.filter(r => r.date <= dateTo);
    }

    if (!data || data.length === 0) {
      return {
        studentId,
        studentName: 'Unknown Student',
        totalSessions: 0,
        presentCount: 0,
        lateCount: 0,
        absentCount: 0,
        attendanceRate: 0,
        punctualityRate: 0
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
      studentId,
      studentName,
      totalSessions,
      presentCount,
      lateCount,
      absentCount,
      attendanceRate,
      punctualityRate,
      lastAttendanceDate
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
    const q = query(
      getOwnedQuery('attendance'),
      where('classId', '==', classId)
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
        classId,
        className: classData?.name || 'Unknown Class',
        totalSessions: 0,
        averageAttendanceRate: 0,
        averagePunctualityRate: 0,
        students: []
      };
    }

    // Group by student
    const studentGroups = data.reduce((acc, record) => {
      if (!acc[record.studentId]) {
        acc[record.studentId] = [];
      }
      acc[record.studentId].push(record);
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
        studentId,
        studentName,
        totalSessions,
        presentCount,
        lateCount,
        absentCount,
        attendanceRate,
        punctualityRate,
        lastAttendanceDate
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
      classId,
      className: classData?.name || 'Unknown Class',
      totalSessions: Object.keys(dateGroups).length,
      averageAttendanceRate,
      averagePunctualityRate,
      mostAttendedDate,
      leastAttendedDate,
      students: students.sort((a, b) => b.attendanceRate - a.attendanceRate)
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
      const key = `${record.classId}-${record.date}`;
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
            classId: classItem.id,
            className: classItem.name,
            schedule: classItem.schedule || '',
            attendanceTaken: true,
            presentCount: attendanceData.present,
            totalStudents: attendanceData.total
          });
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return events.sort((a, b) => a.date.localeCompare(b.date));
  }
};
