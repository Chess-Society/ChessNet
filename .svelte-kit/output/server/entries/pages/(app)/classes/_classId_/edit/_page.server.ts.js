import { createServerClient } from "@supabase/ssr";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "../../../../../../chunks/public.js";
import { error } from "@sveltejs/kit";
const load = async ({ locals, url, params, cookies }) => {
  console.log("✏️ Edit class page server load - User:", locals.user?.email || "none");
  console.log("✏️ Class ID:", params.classId);
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (isLocalDev) {
    console.log("🔧 DEV MODE: Edit class page - Providing mock data");
    const classId = params.classId;
    const mockClasses = [
      {
        id: "mock-class-1",
        user_id: "dev-user-123",
        school_id: "mock-school-1",
        name: "Principiantes Mañana",
        description: "Grupo de iniciación para niños de 6-9 años. Enfoque en movimientos básicos, reglas fundamentales y primeros conceptos tácticos.",
        schedule: "Lunes y Miércoles 10:00-11:00",
        max_students: 12,
        level: "beginner",
        active: true,
        room: "Aula 1",
        instructor_notes: "Grupo muy participativo, necesitan refuerzo en movimientos básicos. Usar mucho material visual y juegos.",
        start_date: "2024-01-08",
        end_date: "2024-06-30",
        price: 45,
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3).toISOString()
      },
      {
        id: "mock-class-2",
        user_id: "dev-user-123",
        school_id: "mock-school-1",
        name: "Intermedios Tarde",
        description: "Grupo intermedio para estudiantes con conocimientos básicos. Trabajo en táctica, estrategia básica y preparación para competición.",
        schedule: "Martes y Jueves 17:00-18:30",
        max_students: 10,
        level: "intermediate",
        active: true,
        room: "Aula 2",
        instructor_notes: "Trabajan bien las tácticas, empezar con estrategia básica. Algunos pueden participar en torneos escolares.",
        start_date: "2024-01-09",
        end_date: "2024-06-30",
        price: 55,
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString()
      },
      {
        id: "mock-class-3",
        user_id: "dev-user-123",
        school_id: "mock-school-1",
        name: "Avanzados Fin de Semana",
        description: "Grupo avanzado para preparación de torneos. Análisis de partidas, estrategia avanzada y preparación psicológica.",
        schedule: "Sábados 09:00-11:00",
        max_students: 8,
        level: "advanced",
        active: true,
        room: "Sala Principal",
        instructor_notes: "Preparación específica para competición, análisis de partidas. Enfoque en apertura y final de partida.",
        start_date: "2024-01-13",
        end_date: "2024-06-30",
        price: 65,
        created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1e3).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    const mockSchools = [
      {
        id: "mock-school-1",
        name: "Escuela de Ajedrez Madrid Centro",
        city: "Madrid",
        address: "Calle Gran Vía, 28"
      },
      {
        id: "mock-school-2",
        name: "Club Ajedrez Infantil Retiro",
        city: "Madrid",
        address: "Parque del Retiro, s/n"
      }
    ];
    const currentClass = mockClasses.find((c) => c.id === classId);
    if (!currentClass) {
      console.log("❌ Class not found in mock data:", classId);
      console.log("📋 Available mock classes:", mockClasses.map((c) => c.id));
      throw error(404, "Clase no encontrada");
    }
    const suggestedSchedules = {
      beginner: [
        "Lunes y Miércoles 10:00-11:00",
        "Martes y Jueves 16:00-17:00",
        "Viernes 17:00-18:00",
        "Sábados 10:00-11:30"
      ],
      intermediate: [
        "Lunes y Miércoles 17:00-18:30",
        "Martes y Jueves 17:00-18:30",
        "Viernes 18:00-19:30",
        "Sábados 11:30-13:00"
      ],
      advanced: [
        "Lunes y Miércoles 18:30-20:00",
        "Martes y Jueves 18:30-20:00",
        "Viernes 19:30-21:00",
        "Sábados 09:00-11:00"
      ],
      mixed: [
        "Miércoles 20:00-21:30",
        "Viernes 20:00-21:30",
        "Sábados 16:00-17:30",
        "Domingos 10:00-11:30"
      ]
    };
    const suggestedCapacities = {
      beginner: { min: 8, max: 15, recommended: 12 },
      intermediate: { min: 6, max: 12, recommended: 10 },
      advanced: { min: 4, max: 10, recommended: 8 },
      mixed: { min: 8, max: 20, recommended: 15 }
    };
    return {
      user: locals.user,
      class: currentClass,
      schools: mockSchools,
      suggestedSchedules,
      suggestedCapacities
    };
  }
  console.log("🌐 PRODUCTION MODE: Edit class page - Fetching from Supabase");
  if (!locals.user) {
    throw error(401, "Usuario no autenticado");
  }
  const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => cookies.get(key),
      set: (key, value, options) => cookies.set(key, value, options),
      remove: (key, options) => cookies.delete(key, options)
    }
  });
  try {
    console.log("🔍 Searching for class with ID:", params.classId);
    console.log("🔍 User ID:", locals.user.id);
    const { data: classData, error: classError } = await supabase.from("classes").select("*").eq("id", params.classId).eq("user_id", locals.user.id).single();
    console.log("🔍 Class query result:", { classData, classError });
    if (classError) {
      console.error("❌ Error fetching class for edit:", classError);
      throw error(404, "Clase no encontrada");
    }
    if (!classData) {
      console.log("❌ No class data returned for ID:", params.classId);
      throw error(404, "Clase no encontrada");
    }
    const { data: schools, error: schoolsError } = await supabase.from("colleges").select("id, name, city, address").eq("user_id", locals.user.id);
    if (schoolsError) {
      console.error("❌ Error fetching schools:", schoolsError);
    }
    const suggestedSchedules = {
      beginner: [
        "Lunes y Miércoles 10:00-11:00",
        "Martes y Jueves 16:00-17:00",
        "Viernes 17:00-18:00",
        "Sábados 10:00-11:30"
      ],
      intermediate: [
        "Lunes y Miércoles 17:00-18:30",
        "Martes y Jueves 17:00-18:30",
        "Viernes 18:00-19:30",
        "Sábados 11:30-13:00"
      ],
      advanced: [
        "Lunes y Miércoles 18:30-20:00",
        "Martes y Jueves 18:30-20:00",
        "Viernes 19:30-21:00",
        "Sábados 09:00-11:00"
      ],
      mixed: [
        "Miércoles 20:00-21:30",
        "Viernes 20:00-21:30",
        "Sábados 16:00-17:30",
        "Domingos 10:00-11:30"
      ]
    };
    const suggestedCapacities = {
      beginner: { min: 8, max: 15, recommended: 12 },
      intermediate: { min: 6, max: 12, recommended: 10 },
      advanced: { min: 4, max: 10, recommended: 8 },
      mixed: { min: 8, max: 20, recommended: 15 }
    };
    return {
      user: locals.user,
      class: classData,
      schools: schools || [],
      suggestedSchedules,
      suggestedCapacities
    };
  } catch (err) {
    console.error("❌ Error in edit class page:", err);
    if (err.status) {
      throw err;
    }
    throw error(500, "Error interno del servidor");
  }
};
export {
  load
};
