import type { PageServerLoad } from './$types';
import { authenticate } from '$lib/server/auth';
import { adminDb } from '$lib/server/firebase-admin';
import { serializeRecord } from '$lib/server/serialize';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  const { user } = await authenticate(event);
  
  if (!user) {
    return { user: null };
  }

  const uid = user.uid;
  const role = event.locals.role;
  const isAdmin = event.locals.isAdmin;
  const cleanEmail = user.email?.toLowerCase();

  // 1. Check for linked students (Parent/Student Role Data)
  let parentData: any = null;
  try {
    const { Filter } = await import('$lib/server/firebase-admin');
    const childrenSnap = await adminDb.collection("students")
      .where(Filter.or(
        Filter.where("parentEmail", "==", cleanEmail),
        Filter.where("parentEmail", "==", cleanEmail),
        Filter.where("email", "==", cleanEmail),
        Filter.where("studentEmail", "==", cleanEmail)
      ))
      .get();
    
    if (!childrenSnap.empty) {
      const children = childrenSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      const schoolIds = [...new Set(children.map((c: any) => c.schoolId || c.schoolId).filter(Boolean))];
      const classIds = [...new Set(children.map((c: any) => c.classId || c.classId).filter(Boolean))];
      
      // Fetch relevant announcements
      let announcements: any[] = [];
      try {
        const announcementsSnap = await adminDb.collection("announcements")
          .where("isPublished", "==", true)
          .orderBy("createdAt", "desc")
          .limit(50)
          .get();
        
        const allAnnouncements = announcementsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        announcements = allAnnouncements.filter((a: any) => {
          // 1. Security: Exclude global/system and ensure association
          if (a.isGlobal || a.isSystem) return false;
          
          const isFromMyTeacher = children.some((c: any) => c.ownerId === a.ownerId);
          const isFromMySchool = a.schoolId && a.schoolId !== 'all' && schoolIds.includes(a.schoolId);
          
          if (!isFromMyTeacher && !isFromMySchool) return false;

          // 2. Targeting logic
          if (a.targetType === 'all') return true;
          if (a.targetType === 'school') {
            return !a.targetId || a.targetId === 'all' || schoolIds.includes(a.targetId);
          }
          if (a.targetType === 'class') {
            return classIds.includes(a.targetId);
          }
          if (a.targetType === 'student' || a.targetType === 'parent') {
            return children.some((c: any) => c.id === a.targetId);
          }
          
          return false;
        });
      } catch (queryErr) {
        // Fallback for missing index
        const announcementsSnap = await adminDb.collection("announcements").where("isPublished", "==", true).limit(100).get();
        announcements = announcementsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          .filter((a: any) => {
            if (a.isGlobal || a.isSystem) return false;
            
            const isFromMyTeacher = children.some((c: any) => c.ownerId === a.ownerId);
            const isFromMySchool = a.schoolId && a.schoolId !== 'all' && schoolIds.includes(a.schoolId);
            
            if (!isFromMyTeacher && !isFromMySchool) return false;

            if (a.targetType === 'all') return true;
            if (a.targetType === 'school') {
              return !a.targetId || a.targetId === 'all' || schoolIds.includes(a.targetId);
            }
            if (a.targetType === 'class') {
              return classIds.includes(a.targetId);
            }
            if (a.targetType === 'student' || a.targetType === 'parent') {
              return children.some((c: any) => c.id === a.targetId);
            }
            
            return false;
          })
          .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 20);
      }

      // Fetch relevant payments
      const studentIds = children.map((c: any) => c.id);
      let payments: any[] = [];
      if (studentIds.length > 0) {
        const paymentsSnap = await adminDb.collection("payments")
          .where("studentId", "in", studentIds.slice(0, 10))
          .orderBy("dueDate", "desc")
          .limit(20)
          .get();
        payments = paymentsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      }

      parentData = { children, announcements, payments };
    }
  } catch (err) {
    console.error('Error loading parent data:', err);
  }

  // 2. Check for Teacher/Admin data
  if (role === 'admin' || role === 'teacher') {
    try {
      const [schoolsSnap, studentsSnap, classesSnap, paymentsSnap, attendanceSnap] = await Promise.all([
        adminDb.collection("schools").where("ownerId", "==", uid).get(),
        adminDb.collection("students").where("ownerId", "==", uid).get(),
        adminDb.collection("classes").where("ownerId", "==", uid).get(),
        adminDb.collection("payments").where("ownerId", "==", uid).orderBy("paidDate", "desc").limit(100).get(),
        adminDb.collection("attendance").where("ownerId", "==", uid).orderBy("date", "desc").limit(100).get()
      ]);

      const schools = schoolsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      const students = studentsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      const classes = classesSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      const payments = paymentsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      const attendance = attendanceSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const monthlyPayments = payments.filter((p: any) => {
        const d = new Date(p.paidDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      const monthlyRevenue = monthlyPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

      const dashboardStats = {
        totalCenters: schools.length,
        totalStudents: students.length,
        totalClasses: classes.length,
        activeStudents: students.filter((s: any) => s.active !== false).length,
        monthlyRevenue,
        upcomingSessions: classes.filter((c: any) => c.active !== false).length 
      };

      const centersWithStats = schools.map((school: any) => {
        const schoolClasses = classes.filter((c: any) => c.schoolId === school.id);
        const schoolStudents = students.filter((s: any) => s.schoolId === school.id);
        const schoolAttendance = attendance.filter((a: any) => {
          const classObj = classes.find((c: any) => c.id === a.classId);
          return classObj && classObj.schoolId === school.id;
        });
        const presentCount = schoolAttendance.filter((a: any) => a.status === 'P').length;
        const totalAttendanceCount = schoolAttendance.length;

        return {
          id: school.id,
          name: school.name,
          city: school.city || 'Sin ciudad',
          totalClasses: schoolClasses.length,
          totalStudents: schoolStudents.length,
          occupancyRate: schoolClasses.length > 0 ? Math.round((schoolStudents.length / (schoolClasses.length * 15)) * 100) : 0,
          attendanceRate: totalAttendanceCount > 0 ? Math.round((presentCount / totalAttendanceCount) * 100) : 0,
          monthlyRevenue: monthlyPayments
            .filter((p: any) => {
               const student = students.find((s: any) => s.id === p.studentId);
               return student && student.schoolId === school.id;
            })
            .reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
          lastActivity: school.updatedAt || school.createdAt
        };
      });

      return serializeRecord({
        user,
        role,
        isAdmin,
        dashboardStats,
        centersWithStats,
        featuredClasses: classes.slice(0, 3),
        parentData
      });
    } catch (err) {
      console.error('Error loading teacher dashboard:', err);
      return serializeRecord({ user, role, isAdmin, parentData });
    }
  }

  // Default return for parent/student role
  return serializeRecord({
    user,
    role,
    isAdmin,
    ...parentData
  });
};

export const actions = {
  verifyMission: async (event: any) => {
    const { user } = await authenticate(event);
    if (!user) return { success: false, error: 'Unauthorized' };

    const formData = await event.request.formData();
    const assignmentId = formData.get('assignmentId') as string;

    if (!assignmentId) return { success: false, error: 'Missing assignment ID' };

    try {
      const { verifyMission } = await import('$lib/api/missions');
      const result = await verifyMission(assignmentId);
      return { ...result };
    } catch (err: any) {
      console.error('Error verifying mission:', err);
      return { success: false, error: err.message };
    }
  }
};
