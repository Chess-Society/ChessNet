const firstNames = ["Alejandro", "Lucía", "Mateo", "Sofía", "Daniel", "Valentina", "Pablo", "Martina", "Hugo", "Julia", "Leo", "Paula", "Diego", "Valeria", "Adrián", "Emma", "David", "Daniela", "Mario", "Carla"];
const lastNames = ["García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez"];
const cities = ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao"];
const schoolTypes = ["Colegio", "Escuela", "Instituto", "Club", "Academia"];
const schoolNames = ["San José", "Cervantes", "Europa", "Delicias", "Norte", "Sur", "Internacional", "Moderno", "Clásico", "Futuro"];
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
const generateMockSchools = (count = 10) => {
  return Array.from({ length: count }).map((_, i) => {
    const city = getRandomElement(cities);
    const type = getRandomElement(schoolTypes);
    const name = getRandomElement(schoolNames);
    return {
      id: `mock-school-${i + 1}`,
      name: `${type} ${name} de ${city}`,
      address: `C/ Ejemplo ${Math.floor(Math.random() * 100)}, ${city}`,
      city,
      country: "ES",
      email: `contacto@${name.toLowerCase()}${city.toLowerCase()}.com`.replace(/\s/g, ""),
      phone: `9${Math.floor(Math.random() * 1e8)}`,
      website: `www.${name.toLowerCase()}${city.toLowerCase()}.com`.replace(/\s/g, ""),
      active: true,
      created_at: getRandomDate(new Date(2023, 0, 1), /* @__PURE__ */ new Date())
    };
  });
};
const generateMockClasses = (schools) => {
  const classes = [];
  const levels = ["Iniciación", "Intermedio", "Avanzado", "Competición"];
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  schools.forEach((school) => {
    const numClasses = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numClasses; i++) {
      const level = getRandomElement(levels);
      const day = getRandomElement(days);
      const hour = Math.floor(Math.random() * 5) + 16;
      classes.push({
        id: `mock-class-${school.id}-${i + 1}`,
        school_id: school.id,
        name: `Ajedrez ${level} - ${day}`,
        day_of_week: day,
        start_time: `${hour}:00`,
        end_time: `${hour + 1}:00`,
        level,
        active: true,
        created_at: getRandomDate(new Date(2023, 0, 1), /* @__PURE__ */ new Date()),
        max_students: 15,
        description: `Clase de nivel ${level} los ${day}`,
        room: `Aula ${Math.floor(Math.random() * 5) + 1}`
      });
    }
  });
  return classes;
};
const generateMockStudents = (schools, countPerSchool = 15) => {
  const students = [];
  const grades = ["1º Primaria", "2º Primaria", "3º Primaria", "4º Primaria", "5º Primaria", "6º Primaria", "1º ESO", "2º ESO"];
  schools.forEach((school) => {
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
        parent_phone: `6${Math.floor(Math.random() * 1e8)}`,
        notes: Math.random() > 0.7 ? "Observaciones: Le gusta mucho el ajedrez táctico." : "",
        active: true,
        created_at: getRandomDate(new Date(2023, 0, 1), /* @__PURE__ */ new Date())
      });
    }
  });
  return students;
};
const generateMockPayments = (students, schools) => {
  const payments = [];
  const concepts = ["Mensualidad Octubre", "Mensualidad Noviembre", "Mensualidad Diciembre", "Material", "Torneo Navidad"];
  students.forEach((student) => {
    const numPayments = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < numPayments; i++) {
      const status = Math.random() > 0.2 ? "paid" : Math.random() > 0.5 ? "pending" : "overdue";
      const amount = Math.random() > 0.8 ? 45 : 30;
      payments.push({
        id: `mock-payment-${student.id}-${i}`,
        student_id: student.id,
        school_id: student.college_id,
        amount,
        status,
        concept: getRandomElement(concepts),
        date: getRandomDate(new Date(2023, 9, 1), /* @__PURE__ */ new Date()),
        payment_method: Math.random() > 0.5 ? "cash" : "transfer",
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  return payments;
};
const generateMockSkills = () => {
  return [
    { id: "skill-1", category: "Fundamentos", name: "Movimiento de Peones", description: "Reglas de movimiento y captura", difficulty: 1, created_at: (/* @__PURE__ */ new Date()).toISOString() },
    { id: "skill-2", category: "Fundamentos", name: "Movimiento de Torres", description: "Movimiento horizontal y vertical", difficulty: 1, created_at: (/* @__PURE__ */ new Date()).toISOString() },
    { id: "skill-3", category: "Táctica", name: "Clavada", description: "Pieza que no puede moverse", difficulty: 2, created_at: (/* @__PURE__ */ new Date()).toISOString() },
    { id: "skill-4", category: "Táctica", name: "Tenedor", description: "Ataque doble", difficulty: 2, created_at: (/* @__PURE__ */ new Date()).toISOString() },
    { id: "skill-5", category: "Finales", name: "Mate con Torre", description: "Mate básico K+R vs K", difficulty: 2, created_at: (/* @__PURE__ */ new Date()).toISOString() },
    { id: "skill-6", category: "Aperturas", name: "Apertura Italiana", description: "Principios básicos", difficulty: 3, created_at: (/* @__PURE__ */ new Date()).toISOString() }
  ];
};
const mockSchools = generateMockSchools(12);
const mockClasses = generateMockClasses(mockSchools);
const mockStudents = generateMockStudents(mockSchools);
const mockPayments = generateMockPayments(mockStudents);
generateMockSkills();
export {
  generateMockClasses,
  generateMockPayments,
  generateMockSchools,
  generateMockSkills,
  generateMockStudents,
  mockClasses,
  mockPayments,
  mockSchools,
  mockStudents
};
