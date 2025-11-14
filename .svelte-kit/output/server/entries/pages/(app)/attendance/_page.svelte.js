import { i as head, e as escape_html, j as attr_class, k as ensure_array_like, d as bind_props, p as pop, f as push } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "clsx";
import "../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../chunks/arrow-left.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { U as Users } from "../../../../chunks/users.js";
import { C as Chart_column } from "../../../../chunks/chart-column.js";
import { T as Triangle_alert } from "../../../../chunks/triangle-alert.js";
import { S as School } from "../../../../chunks/school.js";
import { E as Eye } from "../../../../chunks/eye.js";
import { U as User_check } from "../../../../chunks/user-check.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { C as Circle_check_big } from "../../../../chunks/circle-check-big.js";
import { T as Target } from "../../../../chunks/target.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  data.user;
  let attendanceData = data.attendanceData;
  const getAttendanceColor = (rate) => {
    if (rate >= 90) return "text-green-400";
    if (rate >= 75) return "text-yellow-400";
    return "text-red-400";
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Control de Asistencia - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-slate-900"><header class="bg-slate-800 border-b border-slate-700"><div class="container mx-auto px-4 py-6"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5 text-slate-400" });
  $$payload.out.push(`<!----></button> <div><h1 class="text-2xl font-bold text-white">Control de Asistencia</h1> <p class="text-slate-400">Gestiona las asistencias de todos tus centros</p></div></div> <div class="flex items-center space-x-4"><div class="text-right"><p class="text-sm text-slate-400">Hoy</p> <p class="font-semibold text-white">${escape_html((/* @__PURE__ */ new Date()).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }))}</p></div></div></div></div></header> <main class="container mx-auto px-4 py-8"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between"><div><p class="text-slate-400 text-sm">Clases Hoy</p> <p class="text-3xl font-bold text-white">${escape_html(attendanceData.todayStats.totalClasses)}</p> <p class="text-xs text-slate-400 mt-1">${escape_html(attendanceData.todayStats.classesWithAttendance)} con lista pasada</p></div> <div class="p-3 bg-blue-500/20 rounded-lg">`);
  Calendar($$payload, { class: "w-6 h-6 text-blue-500" });
  $$payload.out.push(`<!----></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between"><div><p class="text-slate-400 text-sm">Estudiantes</p> <p class="text-3xl font-bold text-white">${escape_html(attendanceData.todayStats.totalStudents)}</p> <p class="text-xs text-slate-400 mt-1">${escape_html(attendanceData.todayStats.presentStudents)} presentes</p></div> <div class="p-3 bg-green-500/20 rounded-lg">`);
  Users($$payload, { class: "w-6 h-6 text-green-500" });
  $$payload.out.push(`<!----></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between"><div><p class="text-slate-400 text-sm">Asistencia</p> <p${attr_class(`text-3xl font-bold ${getAttendanceColor(attendanceData.todayStats.attendanceRate)}`)}>${escape_html(attendanceData.todayStats.attendanceRate)}%</p> <p class="text-xs text-slate-400 mt-1">${escape_html(attendanceData.todayStats.absentStudents)} ausentes</p></div> <div class="p-3 bg-purple-500/20 rounded-lg">`);
  Chart_column($$payload, { class: "w-6 h-6 text-purple-500" });
  $$payload.out.push(`<!----></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between"><div><p class="text-slate-400 text-sm">Ausencias</p> <p class="text-3xl font-bold text-red-400">${escape_html(attendanceData.todayStats.absentStudents)}</p> <p class="text-xs text-slate-400 mt-1">${escape_html(attendanceData.todayStats.totalStudents - attendanceData.todayStats.absentStudents)} presentes</p></div> <div class="p-3 bg-red-500/20 rounded-lg">`);
  Triangle_alert($$payload, { class: "w-6 h-6 text-red-500" });
  $$payload.out.push(`<!----></div></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-6"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-semibold text-white">Centros y Clases</h2> <div class="flex items-center space-x-2">`);
  School($$payload, { class: "w-4 h-4 text-slate-400" });
  $$payload.out.push(`<!----> <span class="text-sm text-slate-400">${escape_html(attendanceData.centersWithClasses.length)} centros</span></div></div> `);
  if (attendanceData.centersWithClasses.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="text-center py-8">`);
    School($$payload, { class: "w-12 h-12 text-slate-600 mx-auto mb-3" });
    $$payload.out.push(`<!----> <p class="text-slate-400">No hay centros con clases programadas</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array = ensure_array_like(attendanceData.centersWithClasses);
    $$payload.out.push(`<div class="space-y-4"><!--[-->`);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let center = each_array[$$index_1];
      $$payload.out.push(`<div class="bg-slate-700/50 rounded-lg p-4"><div class="flex items-center justify-between mb-4"><div class="flex items-center space-x-3"><div class="p-2 bg-blue-500/20 rounded-lg">`);
      School($$payload, { class: "w-5 h-5 text-blue-400" });
      $$payload.out.push(`<!----></div> <div><h3 class="font-medium text-white">${escape_html(center.name)}</h3> <p class="text-sm text-slate-400">${escape_html(center.city)}</p></div></div> <button class="p-2 hover:bg-slate-600 rounded-lg transition-colors">`);
      Eye($$payload, { class: "w-4 h-4 text-slate-400" });
      $$payload.out.push(`<!----></button></div> <div class="grid grid-cols-3 gap-4 mb-4 text-sm"><div><span class="text-slate-400">Clases:</span> <span class="text-white ml-1">${escape_html(center.classesToday)}/${escape_html(center.totalClasses)}</span></div> <div><span class="text-slate-400">Estudiantes:</span> <span class="text-white ml-1">${escape_html(center.totalStudents)}</span></div> <div><span class="text-slate-400">Asistencia:</span> <span${attr_class(`ml-1 ${getAttendanceColor(center.attendanceRate)}`)}>${escape_html(center.attendanceRate)}%</span></div></div> `);
      if (center.classes.length > 0) {
        $$payload.out.push("<!--[-->");
        const each_array_1 = ensure_array_like(center.classes);
        $$payload.out.push(`<div class="space-y-2"><!--[-->`);
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let classItem = each_array_1[$$index];
          $$payload.out.push(`<div class="flex items-center justify-between p-3 bg-slate-600/50 rounded-lg"><div class="flex items-center space-x-3"><div class="p-1.5 bg-green-500/20 rounded-lg">`);
          User_check($$payload, { class: "w-4 h-4 text-green-400" });
          $$payload.out.push(`<!----></div> <div><h4 class="font-medium text-white">${escape_html(classItem.name)}</h4> <p class="text-sm text-slate-400">${escape_html(classItem.time)} • ${escape_html(classItem.present)}/${escape_html(classItem.students)} estudiantes</p></div></div> <div class="flex items-center space-x-2"><span${attr_class(`text-sm font-medium ${getAttendanceColor(classItem.attendanceRate)}`)}>${escape_html(classItem.attendanceRate)}%</span> <button class="p-1.5 hover:bg-slate-500 rounded-lg transition-colors" title="Ver detalles de asistencia">`);
          Chevron_right($$payload, { class: "w-4 h-4 text-slate-400" });
          $$payload.out.push(`<!----></button></div></div>`);
        }
        $$payload.out.push(`<!--]--></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></div> `);
  if (attendanceData.upcomingClasses.length > 0) {
    $$payload.out.push("<!--[-->");
    const each_array_2 = ensure_array_like(attendanceData.upcomingClasses);
    $$payload.out.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-semibold text-white">Próximas Clases</h2> <div class="flex items-center space-x-2">`);
    Clock($$payload, { class: "w-4 h-4 text-slate-400" });
    $$payload.out.push(`<!----> <span class="text-sm text-slate-400">${escape_html(attendanceData.upcomingClasses.length)} programadas</span></div></div> <div class="space-y-3"><!--[-->`);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let classItem = each_array_2[$$index_2];
      $$payload.out.push(`<div class="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"><div class="flex items-center space-x-3"><div class="p-2 bg-orange-500/20 rounded-lg">`);
      Clock($$payload, { class: "w-5 h-5 text-orange-400" });
      $$payload.out.push(`<!----></div> <div><h3 class="font-medium text-white">${escape_html(classItem.name)}</h3> <p class="text-sm text-slate-400">${escape_html(classItem.centerName)} • ${escape_html(classItem.time)}</p></div></div> <div class="flex items-center space-x-2"><span class="text-sm text-slate-400">${escape_html(classItem.students)} estudiantes</span> <button class="btn-primary text-sm">`);
      User_check($$payload, { class: "w-4 h-4 mr-1" });
      $$payload.out.push(`<!----> Pasar Lista</button></div></div>`);
    }
    $$payload.out.push(`<!--]--></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="space-y-6"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-semibold text-white">Asistencias Recientes</h2> <div class="flex items-center space-x-2">`);
  Circle_check_big($$payload, { class: "w-4 h-4 text-slate-400" });
  $$payload.out.push(`<!----> <span class="text-sm text-slate-400">${escape_html(attendanceData.recentAttendance.length)}</span></div></div> `);
  if (attendanceData.recentAttendance.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="text-center py-6">`);
    Circle_check_big($$payload, { class: "w-8 h-8 text-slate-600 mx-auto mb-2" });
    $$payload.out.push(`<!----> <p class="text-slate-400 text-sm">No hay asistencias recientes</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array_3 = ensure_array_like(attendanceData.recentAttendance);
    $$payload.out.push(`<div class="space-y-3"><!--[-->`);
    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
      let attendance = each_array_3[$$index_3];
      $$payload.out.push(`<div class="p-3 bg-slate-700/50 rounded-lg"><div class="flex items-center justify-between mb-2"><h4 class="font-medium text-white text-sm">${escape_html(attendance.className)}</h4> <span${attr_class(`text-xs font-medium ${getAttendanceColor(attendance.attendanceRate)}`)}>${escape_html(attendance.attendanceRate)}%</span></div> <p class="text-xs text-slate-400 mb-1">${escape_html(attendance.centerName)}</p> <p class="text-xs text-slate-500">${escape_html(formatDate(attendance.date))}</p> <div class="flex items-center justify-between mt-2 text-xs"><span class="text-green-400">${escape_html(attendance.present)} presentes</span> <span class="text-red-400">${escape_html(attendance.absent)} ausentes</span></div></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h2 class="text-xl font-semibold text-white mb-6">Acciones Rápidas</h2> <div class="space-y-3"><button class="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"><div class="flex items-center space-x-3"><div class="p-1.5 bg-blue-500/20 rounded-lg">`);
  Target($$payload, { class: "w-4 h-4 text-blue-400" });
  $$payload.out.push(`<!----></div> <span class="text-white">Ver Todas las Clases</span></div> `);
  Chevron_right($$payload, { class: "w-4 h-4 text-slate-400" });
  $$payload.out.push(`<!----></button> <button class="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"><div class="flex items-center space-x-3"><div class="p-1.5 bg-green-500/20 rounded-lg">`);
  Users($$payload, { class: "w-4 h-4 text-green-400" });
  $$payload.out.push(`<!----></div> <span class="text-white">Gestionar Estudiantes</span></div> `);
  Chevron_right($$payload, { class: "w-4 h-4 text-slate-400" });
  $$payload.out.push(`<!----></button> <button class="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"><div class="flex items-center space-x-3"><div class="p-1.5 bg-purple-500/20 rounded-lg">`);
  Chart_column($$payload, { class: "w-4 h-4 text-purple-400" });
  $$payload.out.push(`<!----></div> <span class="text-white">Ver Informes</span></div> `);
  Chevron_right($$payload, { class: "w-4 h-4 text-slate-400" });
  $$payload.out.push(`<!----></button></div></div></div></div></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
