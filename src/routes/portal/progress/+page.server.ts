import { adminDb } from '$lib/server/firebase-admin';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const parentEmail = event.locals.user?.email?.toLowerCase();
    const studentId = event.url.searchParams.get('studentId');

    if (!parentEmail) throw error(401, 'No autorizado');

    // 1. Fetch Students to verify access and for the switcher
    const studentsSnapshot = await adminDb.collection('students')
        .where('parentEmail', '==', parentEmail)
        .get();

    const students = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    if (students.length === 0) {
        return { students: [], currentStudent: null, skills: [], attendance: [] };
    }

    // 2. Select current student
    const currentStudent = studentId 
        ? students.find(s => s.id === studentId) 
        : students[0];

    if (!currentStudent) {
        throw error(404, 'Alumno no encontrado o sin acceso');
    }

    // 3. Fetch Student Skills (Habilidades)
    const skillsSnapshot = await adminDb.collection('student_skills')
        .where('studentId', '==', currentStudent.id)
        .get();

    const studentSkills = skillsSnapshot.docs.map(doc => doc.data());

    // Fetch Skill definitions to get names/categories
    const skillIds = studentSkills.map(s => s.skillId);
    let skillDefinitions = [];
    if (skillIds.length > 0) {
        // Firestore limit for 'in' query is 30, but let's assume it's small for now
        // If more than 30, we would need to chunk it.
        const skillDefsSnapshot = await adminDb.collection('skills')
            .where('__name__', 'in', skillIds.slice(0, 30))
            .get();
        skillDefinitions = skillDefsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    const skillsWithData = studentSkills.map(ss => {
        const def = skillDefinitions.find(d => d.id === ss.skillId);
        return {
            ...ss,
            name: def?.name || 'Habilidad desconocida',
            category: def?.categoryId || 'General'
        };
    });

    // 4. Fetch Attendance (Asistencia)
    const attendanceSnapshot = await adminDb.collection('attendance')
        .where('studentId', '==', currentStudent.id)
        .orderBy('date', 'desc')
        .limit(20)
        .get();

    const attendance = attendanceSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    return {
        students,
        currentStudent,
        skills: skillsWithData,
        attendance
    };
};
