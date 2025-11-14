import { i as head, e as escape_html, j as attr_class, o as attr_style, k as ensure_array_like, d as bind_props, p as pop, f as push } from "../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "clsx";
import "../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { G as Graduation_cap } from "../../../../../chunks/graduation-cap.js";
import { U as User_check } from "../../../../../chunks/user-check.js";
import { S as Settings } from "../../../../../chunks/settings.js";
import { C as Chart_column } from "../../../../../chunks/chart-column.js";
import { U as Users } from "../../../../../chunks/users.js";
import { T as Target } from "../../../../../chunks/target.js";
import { C as Calendar } from "../../../../../chunks/calendar.js";
import { C as Clock } from "../../../../../chunks/clock.js";
import { M as Map_pin } from "../../../../../chunks/map-pin.js";
import { D as Dollar_sign } from "../../../../../chunks/dollar-sign.js";
import { T as Trending_up } from "../../../../../chunks/trending-up.js";
import { U as User_plus } from "../../../../../chunks/user-plus.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let classData = data.class;
  let students = data.students || [];
  let classSkills = data.classSkills || [];
  let classStats = data.classStats;
  let attendanceStats = data.attendanceStats;
  const levelColors = {
    beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    advanced: "bg-red-500/20 text-red-400 border-red-500/30",
    mixed: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  };
  const levelLabels = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
    mixed: "Mixto"
  };
  const getOccupancyColor = (rate) => {
    if (rate >= 90) return "text-red-400";
    if (rate >= 75) return "text-yellow-400";
    return "text-green-400";
  };
  const getOccupancyBarColor = (rate) => {
    if (rate >= 90) return "bg-red-500";
    if (rate >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
  };
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html(classData?.name || "Clase")} - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="flex items-center space-x-3"><div class="p-2 bg-blue-500/20 rounded-lg">`);
  Graduation_cap($$payload, { class: "w-6 h-6 text-blue-500" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold">${escape_html(classData?.name)}</h1> <p class="text-sm text-slate-400">${escape_html(classData?.school?.name)} • ${escape_html(classData?.schedule)}</p></div></div></div> <div class="flex items-center space-x-3"><button class="btn-primary">`);
  User_check($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Pasar Lista</button> <button class="btn-secondary">`);
  Settings($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Configurar</button></div></div> <div class="mt-4"><div class="flex items-center space-x-1 bg-slate-700/50 rounded-lg p-1 w-fit"><button${attr_class(
    `px-4 py-2 rounded-md transition-colors ${"bg-blue-500 text-white"}`,
    "svelte-x773vi"
  )}>`);
  Chart_column($$payload, { class: "w-4 h-4 inline mr-2" });
  $$payload.out.push(`<!----> Resumen</button> <button${attr_class(
    `px-4 py-2 rounded-md transition-colors ${"text-slate-400 hover:text-white"}`,
    "svelte-x773vi"
  )}>`);
  Users($$payload, { class: "w-4 h-4 inline mr-2" });
  $$payload.out.push(`<!----> Estudiantes (${escape_html(students.length)})</button> <button${attr_class(
    `px-4 py-2 rounded-md transition-colors ${"text-slate-400 hover:text-white"}`,
    "svelte-x773vi"
  )}>`);
  Target($$payload, { class: "w-4 h-4 inline mr-2" });
  $$payload.out.push(`<!----> Temario (${escape_html(classSkills.length)})</button> <button${attr_class(
    `px-4 py-2 rounded-md transition-colors ${"text-slate-400 hover:text-white"}`,
    "svelte-x773vi"
  )}>`);
  Calendar($$payload, { class: "w-4 h-4 inline mr-2" });
  $$payload.out.push(`<!----> Asistencia</button></div></div></div></header> <main class="container mx-auto px-4 py-8">`);
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="space-y-8"><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6"><h2 class="text-xl font-semibold mb-6">Información de la Clase</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-4"><div class="flex items-center space-x-3">`);
    Clock($$payload, { class: "w-5 h-5 text-slate-500" });
    $$payload.out.push(`<!----> <div><p class="text-slate-300">${escape_html(classData?.schedule)}</p> <p class="text-slate-400 text-sm">Horario de clases</p></div></div> <div class="flex items-center space-x-3">`);
    Map_pin($$payload, { class: "w-5 h-5 text-slate-500" });
    $$payload.out.push(`<!----> <div><p class="text-slate-300">${escape_html(classData?.room)}</p> <p class="text-slate-400 text-sm">Aula asignada</p></div></div> <div class="flex items-center space-x-3">`);
    Users($$payload, { class: "w-5 h-5 text-slate-500" });
    $$payload.out.push(`<!----> <div><p class="text-slate-300">${escape_html(classStats.total_students)}/${escape_html(classData?.max_students)} estudiantes</p> <p class="text-slate-400 text-sm">Ocupación actual</p></div></div> `);
    if (classData?.price) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="flex items-center space-x-3">`);
      Dollar_sign($$payload, { class: "w-5 h-5 text-slate-500" });
      $$payload.out.push(`<!----> <div><p class="text-slate-300">${escape_html(formatCurrency(classData.price))}/mes</p> <p class="text-slate-400 text-sm">Precio mensual</p></div></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div> <div class="space-y-4"><div class="flex items-center space-x-3">`);
    Calendar($$payload, { class: "w-5 h-5 text-slate-500" });
    $$payload.out.push(`<!----> <div><p class="text-slate-300">${escape_html(new Date(classData?.start_date).toLocaleDateString("es-ES"))} - 
                      ${escape_html(new Date(classData?.end_date).toLocaleDateString("es-ES"))}</p> <p class="text-slate-400 text-sm">Duración del curso</p></div></div> <div class="flex items-center space-x-3">`);
    Target($$payload, { class: "w-5 h-5 text-slate-500" });
    $$payload.out.push(`<!----> <div><span${attr_class(`px-3 py-1 rounded-full text-sm font-medium border ${levelColors[classData?.level]}`, "svelte-x773vi")}>${escape_html(levelLabels[classData?.level])}</span> <p class="text-slate-400 text-sm mt-1">Nivel de la clase</p></div></div> <div class="flex items-center space-x-3">`);
    Trending_up($$payload, { class: "w-5 h-5 text-slate-500" });
    $$payload.out.push(`<!----> <div><p${attr_class(`text-slate-300 font-medium ${getOccupancyColor(classStats.occupancy_rate)}`, "svelte-x773vi")}>${escape_html(classStats.occupancy_rate)}% ocupación</p> <p class="text-slate-400 text-sm">Tasa de ocupación</p></div></div></div></div> `);
    if (classData?.description) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="mt-6 p-4 bg-slate-700/50 rounded-lg"><h3 class="font-medium text-slate-300 mb-2">Descripción</h3> <p class="text-slate-400 leading-relaxed">${escape_html(classData.description)}</p></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    if (classData?.instructor_notes) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"><h3 class="font-medium text-blue-300 mb-2">Notas del Instructor</h3> <p class="text-blue-200 leading-relaxed">${escape_html(classData.instructor_notes)}</p></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div> <div class="space-y-6"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h3 class="font-semibold mb-4">Ocupación de la Clase</h3> <div class="space-y-4"><div class="flex justify-between items-center"><span class="text-slate-400">Estudiantes activos</span> <span class="font-bold text-green-400">${escape_html(classStats.active_students)}</span></div> <div class="flex justify-between items-center"><span class="text-slate-400">Estudiantes inactivos</span> <span class="font-bold text-gray-400">${escape_html(classStats.inactive_students)}</span></div> <div class="flex justify-between items-center"><span class="text-slate-400">Plazas disponibles</span> <span class="font-bold text-blue-400">${escape_html(classData?.max_students - classStats.total_students)}</span></div></div> <div class="mt-4"><div class="flex justify-between text-sm mb-2"><span class="text-slate-400">Ocupación</span> <span${attr_class(`font-medium ${getOccupancyColor(classStats.occupancy_rate)}`, "svelte-x773vi")}>${escape_html(classStats.occupancy_rate)}%</span></div> <div class="w-full bg-slate-700 rounded-full h-3"><div${attr_class(`h-3 rounded-full transition-all duration-300 ${getOccupancyBarColor(classStats.occupancy_rate)}`, "svelte-x773vi")}${attr_style(`width: ${classStats.occupancy_rate}%`)}></div></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h3 class="font-semibold mb-4">Estadísticas de Asistencia</h3> <div class="space-y-3"><div class="flex justify-between items-center"><span class="text-slate-400">Sesiones totales</span> <span class="font-bold">${escape_html(attendanceStats.total_sessions)}</span></div> <div class="flex justify-between items-center"><span class="text-slate-400">Asistencia promedio</span> <span class="font-bold text-green-400">${escape_html(attendanceStats.average_attendance_rate)}%</span></div> <div class="flex justify-between items-center"><span class="text-slate-400">Puntualidad promedio</span> <span class="font-bold text-blue-400">${escape_html(attendanceStats.average_punctuality_rate)}%</span></div></div> <div class="mt-4 pt-4 border-t border-slate-700"><div class="text-sm space-y-2"><div class="flex justify-between"><span class="text-slate-400">Última sesión</span> <span class="text-slate-300">${escape_html(new Date(attendanceStats.last_session_date).toLocaleDateString("es-ES"))}</span></div> <div class="flex justify-between"><span class="text-slate-400">Próxima sesión</span> <span class="text-slate-300">${escape_html(new Date(attendanceStats.next_session_date).toLocaleDateString("es-ES"))}</span></div></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between mb-4"><h3 class="font-semibold">Temario</h3> <button class="text-purple-400 hover:text-purple-300 text-sm">Gestionar</button></div> <div class="space-y-2"><div class="flex justify-between items-center"><span class="text-slate-400">Skills asignadas</span> <span class="font-bold text-purple-400">${escape_html(classStats.total_skills)}</span></div> `);
    if (classStats.skills_by_category && typeof classStats.skills_by_category === "object") {
      $$payload.out.push("<!--[-->");
      const each_array = ensure_array_like(Object.entries(classStats.skills_by_category));
      $$payload.out.push(`<!--[-->`);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let [category, count] = each_array[$$index];
        $$payload.out.push(`<div class="flex justify-between items-center text-sm"><span class="text-slate-500">${escape_html(category)}</span> <span class="text-slate-400">${escape_html(count)}</span></div>`);
      }
      $$payload.out.push(`<!--]-->`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h2 class="text-xl font-semibold mb-6">Acciones Rápidas</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"><button class="p-4 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors text-left">`);
    User_check($$payload, { class: "w-8 h-8 text-green-400 mb-3" });
    $$payload.out.push(`<!----> <h3 class="font-medium text-green-300">Pasar Lista</h3> <p class="text-sm text-green-400/80">Marcar asistencia hoy</p></button> <button class="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20 transition-colors text-left">`);
    User_plus($$payload, { class: "w-8 h-8 text-cyan-400 mb-3" });
    $$payload.out.push(`<!----> <h3 class="font-medium text-cyan-300">Nuevo Estudiante</h3> <p class="text-sm text-cyan-400/80">Crear e inscribir</p></button> <button class="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors text-left">`);
    Users($$payload, { class: "w-8 h-8 text-blue-400 mb-3" });
    $$payload.out.push(`<!----> <h3 class="font-medium text-blue-300">Gestionar Estudiantes</h3> <p class="text-sm text-blue-400/80">Inscribir/desinscribir</p></button> <button class="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors text-left">`);
    Target($$payload, { class: "w-8 h-8 text-purple-400 mb-3" });
    $$payload.out.push(`<!----> <h3 class="font-medium text-purple-300">Gestionar Temario</h3> <p class="text-sm text-purple-400/80">Asignar skills</p></button> <button class="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-colors text-left">`);
    Settings($$payload, { class: "w-8 h-8 text-orange-400 mb-3" });
    $$payload.out.push(`<!----> <h3 class="font-medium text-orange-300">Configurar Clase</h3> <p class="text-sm text-orange-400/80">Editar información</p></button></div></div></div>`);
  }
  $$payload.out.push(`<!--]--></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
