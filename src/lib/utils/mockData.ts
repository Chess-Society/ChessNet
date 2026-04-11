// import { v4 as uuidv4 } from 'uuid'; // Removed to avoid dependency issues

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Tipos auxiliares (simplificados para no depender de tipos del proyecto si no es necesario)
interface MockSchool {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    email: string;
    phone: string;
    website: string;
    active: boolean;
    created_at: string;
}

interface MockClass {
    id: string;
    school_id: string;
    name: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    level: string;
    active: boolean;
    created_at: string;
    max_students?: number;
    description?: string;
    room?: string;
}

interface MockCategory {
    id: string;
    name: string;
    color: string;
}

interface MockSkill {
    id: string;
    category: string;
    category_id?: string;
    name: string;
    description: string;
    difficulty: number;
    created_at: string;
}

interface MockStudent {
    id: string;
    college_id: string; // Usamos college_id para mantener consistencia con la BD
    name: string;
    first_name: string;
    last_name: string;
    date_of_birth: string | null;
    grade: string;
    parent_email: string;
    parent_phone: string;
    notes: string;
    active: boolean;
    created_at: string;
}

// Generadores de datos aleatorios
const firstNames = ['Alejandro', 'Lucía', 'Mateo', 'Sofía', 'Daniel', 'Valentina', 'Pablo', 'Martina', 'Hugo', 'Julia', 'Leo', 'Paula', 'Diego', 'Valeria', 'Adrián', 'Emma', 'David', 'Daniela', 'Mario', 'Carla'];
const lastNames = ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Muñoz', 'Álvarez', 'Romero', 'Alonso', 'Gutiérrez'];
const cities = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'];
const schoolTypes = ['Colegio', 'Escuela', 'Instituto', 'Club', 'Academia'];
const schoolNames = ['San José', 'Cervantes', 'Europa', 'Delicias', 'Norte', 'Sur', 'Internacional', 'Moderno', 'Clásico', 'Futuro'];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();

// Generar Colegios
export const generateMockSchools = (count: number = 10): MockSchool[] => {
    return Array.from({ length: count }).map((_, i) => {
        const city = getRandomElement(cities);
        const type = getRandomElement(schoolTypes);
        const name = getRandomElement(schoolNames);

        return {
            id: `mock-school-${i + 1}`,
            name: `${type} ${name} de ${city}`,
            address: `C/ Ejemplo ${Math.floor(Math.random() * 100)}, ${city}`,
            city: city,
            country: 'ES',
            email: `contacto@${name.toLowerCase()}${city.toLowerCase()}.com`.replace(/\s/g, ''),
            phone: `9${Math.floor(Math.random() * 100000000)}`,
            website: `www.${name.toLowerCase()}${city.toLowerCase()}.com`.replace(/\s/g, ''),
            active: true,
            created_at: getRandomDate(new Date(2023, 0, 1), new Date())
        };
    });
};

// Generar Clases para los colegios
export const generateMockClasses = (schools: MockSchool[]): MockClass[] => {
    const classes: MockClass[] = [];
    const levels = ['Iniciación', 'Intermedio', 'Avanzado', 'Competición'];
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    schools.forEach(school => {
        // 2 a 4 clases por colegio
        const numClasses = Math.floor(Math.random() * 3) + 2;

        for (let i = 0; i < numClasses; i++) {
            const level = getRandomElement(levels);
            const day = getRandomElement(days);
            const hour = Math.floor(Math.random() * 5) + 16; // 16:00 a 20:00

            classes.push({
                id: `mock-class-${school.id}-${i + 1}`,
                school_id: school.id,
                name: `Ajedrez ${level} - ${day}`,
                day_of_week: day,
                start_time: `${hour}:00`,
                end_time: `${hour + 1}:00`,
                level: level,
                active: true,
                created_at: getRandomDate(new Date(2023, 0, 1), new Date()),
                max_students: 15,
                description: `Clase de nivel ${level} los ${day}`,
                room: `Aula ${Math.floor(Math.random() * 5) + 1}`
            });
        }
    });

    return classes;
};

// Generar Estudiantes
export const generateMockStudents = (schools: MockSchool[], countPerSchool: number = 15): MockStudent[] => {
    const students: MockStudent[] = [];
    const grades = ['1º Primaria', '2º Primaria', '3º Primaria', '4º Primaria', '5º Primaria', '6º Primaria', '1º ESO', '2º ESO'];

    schools.forEach(school => {
        // Variación aleatoria en el número de estudiantes
        const numStudents = countPerSchool + Math.floor(Math.random() * 10) - 5;

        for (let i = 0; i < numStudents; i++) {
            const firstName = getRandomElement(firstNames);
            const lastName1 = getRandomElement(lastNames);
            const lastName2 = getRandomElement(lastNames);

            students.push({
                id: `mock-student-${school.id}-${i + 1}`,
                college_id: school.id,
                name: `${firstName} ${lastName1} ${lastName2}`,
                first_name: firstName,
                last_name: `${lastName1} ${lastName2}`,
                date_of_birth: getRandomDate(new Date(2010, 0, 1), new Date(2018, 0, 1)),
                grade: getRandomElement(grades),
                parent_email: `padres.${firstName.toLowerCase()}.${lastName1.toLowerCase()}@email.com`,
                parent_phone: `6${Math.floor(Math.random() * 100000000)}`,
                notes: Math.random() > 0.7 ? 'Observaciones: Le gusta mucho el ajedrez táctico.' : '',
                active: true,
                created_at: getRandomDate(new Date(2023, 0, 1), new Date())
            });
        }
    });

    return students;
};

// Generar Pagos
export const generateMockPayments = (students: MockStudent[], schools: MockSchool[]) => {
    const payments: any[] = [];
    const statuses = ['paid', 'pending', 'overdue'];
    const concepts = ['Mensualidad Octubre', 'Mensualidad Noviembre', 'Mensualidad Diciembre', 'Material', 'Torneo Navidad'];

    // Pagos de estudiantes
    students.forEach(student => {
        // 1 a 5 pagos por estudiante
        const numPayments = Math.floor(Math.random() * 5) + 1;

        for (let i = 0; i < numPayments; i++) {
            const status = Math.random() > 0.2 ? 'paid' : (Math.random() > 0.5 ? 'pending' : 'overdue');
            const amount = Math.random() > 0.8 ? 45 : 30;

            payments.push({
                id: `mock-payment-${student.id}-${i}`,
                student_id: student.id,
                school_id: student.college_id,
                amount: amount,
                status: status,
                concept: getRandomElement(concepts),
                date: getRandomDate(new Date(2023, 9, 1), new Date()),
                payment_method: Math.random() > 0.5 ? 'cash' : 'transfer',
                created_at: new Date().toISOString()
            });
        }
    });

    return payments;
};

// Generar Skills
export const generateMockSkills = (): MockSkill[] => {
    return [
        { id: 'skill-1', category: 'Fundamentos', name: 'Movimiento de Peones', description: 'Reglas de movimiento y captura', difficulty: 1, created_at: new Date().toISOString() },
        { id: 'skill-2', category: 'Fundamentos', name: 'Movimiento de Torres', description: 'Movimiento horizontal y vertical', difficulty: 1, created_at: new Date().toISOString() },
        { id: 'skill-3', category: 'Táctica', name: 'Clavada', description: 'Pieza que no puede moverse', difficulty: 2, created_at: new Date().toISOString() },
        { id: 'skill-4', category: 'Táctica', name: 'Tenedor', description: 'Ataque doble', difficulty: 2, created_at: new Date().toISOString() },
        { id: 'skill-5', category: 'Finales', name: 'Mate con Torre', description: 'Mate básico K+R vs K', difficulty: 2, created_at: new Date().toISOString() },
        { id: 'skill-6', category: 'Aperturas', name: 'Apertura Italiana', description: 'Principios básicos', difficulty: 3, created_at: new Date().toISOString() },
    ];
};

// Instancias estáticas para usar en toda la app
export const mockSchools = generateMockSchools(12);
export const mockClasses = generateMockClasses(mockSchools);
export const mockStudents = generateMockStudents(mockSchools);
export const mockPayments = generateMockPayments(mockStudents, mockSchools);
export const mockSkills = generateMockSkills();

// Helpers para obtener datos relacionados
export const getMockSchoolClasses = (schoolId: string) => mockClasses.filter(c => c.school_id === schoolId);
export const getMockSchoolStudents = (schoolId: string) => mockStudents.filter(s => s.college_id === schoolId);
export const getMockClassStudents = (classId: string) => {
    // Simulación: asignamos aleatoriamente estudiantes de ese colegio a la clase
    const schoolId = mockClasses.find(c => c.id === classId)?.school_id;
    if (!schoolId) return [];
    const schoolStudents = getMockSchoolStudents(schoolId);
    return schoolStudents.filter(() => Math.random() > 0.7); // 30% de los estudiantes del colegio van a esta clase
};
