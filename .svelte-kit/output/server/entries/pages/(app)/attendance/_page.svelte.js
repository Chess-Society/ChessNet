import { h as head, d as escape_html, e as ensure_array_like, o as attr_style, l as stringify, p as pop, k as push } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "clsx";
import "../../../../chunks/state.svelte.js";
import { A as Activity } from "../../../../chunks/activity.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { U as Users } from "../../../../chunks/users.js";
import { T as Trending_up } from "../../../../chunks/trending-up.js";
import { T as Triangle_alert } from "../../../../chunks/triangle-alert.js";
import { S as School } from "../../../../chunks/school.js";
import { E as Eye } from "../../../../chunks/eye.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
import { T as Timer } from "../../../../chunks/timer.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { C as Clipboard_check } from "../../../../chunks/clipboard-check.js";
import { C as Circle_check_big } from "../../../../chunks/circle-check-big.js";
import { C as Chart_column } from "../../../../chunks/chart-column.js";
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  const attendanceData = data.attendanceData || {
    todayStats: {
      totalClasses: 0,
      totalStudents: 0,
      presentStudents: 0,
      attendanceRate: 0,
      absentStudents: 0
    },
    centersWithClasses: [],
    upcomingClasses: [],
    recentAttendance: []
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
    $$payload2.title = `<title>Asistencia - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="space-y-10 animate-fade-in pb-20"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="space-y-4 text-center md:text-left"><div class="flex items-center justify-center md:justify-start gap-3"><div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400">`);
  Activity($$payload, { class: "w-6 h-6" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">Control de Asistencia</h1> <p class="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] mt-1">Seguimiento en tiempo real</p></div></div></div> <div class="bg-surface-950/50 border border-surface-900 px-6 py-4 rounded-3xl flex items-center gap-6 shadow-2xl backdrop-blur-xl"><div class="text-right"><p class="text-[8px] font-black text-surface-600 uppercase tracking-widest">Estado del Sistema</p> <div class="flex items-center gap-2 justify-end"><div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> <p class="text-xs font-black text-white uppercase tracking-tighter">OPERATIVO</p></div></div> <div class="w-px h-8 bg-surface-900"></div> <div class="text-right"><p class="text-[8px] font-black text-surface-600 uppercase tracking-widest">Hoy</p> <p class="text-xs font-black text-white uppercase tracking-tighter">${escape_html((/* @__PURE__ */ new Date()).toLocaleDateString("es-ES", { day: "numeric", month: "short" }))}</p></div></div></div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><div class="glass-panel p-6 border-t-4 border-primary-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  Calendar($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <div class="flex items-baseline justify-between mb-2"><h3 class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Clases Hoy</h3> <span class="text-[10px] font-black text-primary-400 bg-primary-400/10 px-2 py-0.5 rounded uppercase">On Air</span></div> <div class="flex items-end gap-3"><p class="text-4xl font-black text-white tracking-tighter">${escape_html(attendanceData.todayStats.totalClasses)}</p> <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">ACTIVA(S)</p></div></div> <div class="glass-panel p-6 border-t-4 border-blue-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  Users($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <div class="flex items-baseline justify-between mb-2"><h3 class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Alumnos</h3> <p class="text-[10px] font-black text-blue-400 uppercase">Presentes</p></div> <div class="flex items-end gap-3"><p class="text-4xl font-black text-white tracking-tighter">${escape_html(attendanceData.todayStats.presentStudents)}</p> <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">/ ${escape_html(attendanceData.todayStats.totalStudents)}</p></div></div> <div class="glass-panel p-6 border-t-4 border-purple-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  Trending_up($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <div class="flex items-baseline justify-between mb-2"><h3 class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Tasa Global</h3> `);
  Trending_up($$payload, { class: "w-3.5 h-3.5 text-purple-400" });
  $$payload.out.push(`<!----></div> <div class="flex items-end gap-3"><p class="text-4xl font-black text-white tracking-tighter">${escape_html(attendanceData.todayStats.attendanceRate)}%</p> <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">MEDIA</p></div></div> <div class="glass-panel p-6 border-t-4 border-red-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  Triangle_alert($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <div class="flex items-baseline justify-between mb-2"><h3 class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Ausencias</h3> <span class="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_red]"></span></div> <div class="flex items-end gap-3"><p class="text-4xl font-black text-white tracking-tighter">${escape_html(attendanceData.todayStats.absentStudents)}</p> <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">FALTAS</p></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-10"><div class="lg:col-span-2 space-y-10"><section class="space-y-6"><div class="flex items-center justify-between px-2"><h2 class="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">`);
  School($$payload, { class: "w-5 h-5 text-primary-400" });
  $$payload.out.push(`<!----> Actividad por Centro</h2></div> `);
  if (attendanceData.centersWithClasses.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="glass-panel p-16 text-center space-y-4"><div class="w-16 h-16 bg-surface-950 rounded-full border border-surface-900 flex items-center justify-center mx-auto text-surface-800">`);
    Calendar($$payload, { class: "w-8 h-8" });
    $$payload.out.push(`<!----></div> <p class="text-[10px] font-black text-surface-600 uppercase tracking-widest">Sin sesiones activas en este momento</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array = ensure_array_like(attendanceData.centersWithClasses);
    $$payload.out.push(`<div class="space-y-6"><!--[-->`);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let center = each_array[i];
      const each_array_1 = ensure_array_like(center.classes);
      $$payload.out.push(`<div class="glass-panel overflow-hidden border-l-4 border-primary-500"><div class="p-8"><div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-surface-900"><div class="flex items-center gap-5"><div class="w-14 h-14 bg-surface-950 border border-surface-800 rounded-2xl flex items-center justify-center text-primary-400 shadow-2xl">`);
      School($$payload, { class: "w-7 h-7" });
      $$payload.out.push(`<!----></div> <div><h3 class="text-xl font-black text-white uppercase tracking-tighter">${escape_html(center.name)}</h3> <p class="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]">${escape_html(center.city)} • ${escape_html(center.classes.length)} GRUPOS</p></div></div> <div class="flex items-center gap-8"><div class="text-right"><p class="text-[8px] font-black text-surface-600 uppercase tracking-widest mb-1">Rendimiento</p> <div class="flex items-center gap-3 justify-end text-lg font-black text-white">${escape_html(center.attendanceRate)}% <div class="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30"></div></div></div> <button class="p-3 bg-surface-950 border border-surface-900 rounded-xl text-surface-500 hover:text-primary-400 hover:border-primary-500/30 transition-all shadow-lg">`);
      Eye($$payload, { class: "w-5 h-5" });
      $$payload.out.push(`<!----></button></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let cls = each_array_1[$$index];
        $$payload.out.push(`<div class="p-5 bg-surface-950/40 border border-surface-900 rounded-2xl hover:border-primary-500/20 transition-all group"><div class="flex items-center justify-between mb-4"><div class="flex items-center gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary-500"></div> <h4 class="text-xs font-black text-white uppercase truncate">${escape_html(cls.name)}</h4></div> <span class="text-[9px] font-black text-surface-600 bg-surface-900 px-2 py-0.5 rounded uppercase tracking-tighter">${escape_html(cls.time)}</span></div> <div class="flex items-end justify-between"><div class="space-y-2"><div class="flex items-center gap-2"><span class="text-[10px] font-black text-white">${escape_html(cls.present)}</span> <span class="text-[10px] font-black text-surface-600">/ ${escape_html(cls.students)}</span></div> <div class="w-32 h-1.5 bg-surface-900 rounded-full overflow-hidden"><div class="h-full bg-primary-500 transition-all duration-1000"${attr_style(`width: ${stringify(cls.attendanceRate)}%`)}></div></div></div> <button class="flex items-center gap-2 text-[9px] font-black text-primary-400 uppercase tracking-widest hover:text-white transition-colors">Pasar Lista `);
        Chevron_right($$payload, { class: "w-3.5 h-3.5" });
        $$payload.out.push(`<!----></button></div></div>`);
      }
      $$payload.out.push(`<!--]--></div></div></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></section> `);
  if (attendanceData.upcomingClasses.length > 0) {
    $$payload.out.push("<!--[-->");
    const each_array_2 = ensure_array_like(attendanceData.upcomingClasses);
    $$payload.out.push(`<section class="space-y-6"><h2 class="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3 px-2">`);
    Timer($$payload, { class: "w-5 h-5 text-blue-400" });
    $$payload.out.push(`<!----> En Cola de Inicio</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let cls = each_array_2[$$index_2];
      $$payload.out.push(`<div class="glass-panel p-5 flex items-center justify-between group hover:border-blue-500/30 transition-all"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">`);
      Clock($$payload, { class: "w-6 h-6" });
      $$payload.out.push(`<!----></div> <div><h4 class="text-sm font-black text-white uppercase tracking-tight leading-tight">${escape_html(cls.name)}</h4> <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mt-0.5">${escape_html(cls.time)}</p></div></div> <button class="p-2.5 bg-surface-950 border border-surface-900 rounded-xl text-surface-600 hover:text-primary-400 hover:border-primary-500/30 transition-all shadow-xl" title="Abrir Control de Asistencia">`);
      Clipboard_check($$payload, { class: "w-5 h-5" });
      $$payload.out.push(`<!----></button></div>`);
    }
    $$payload.out.push(`<!--]--></div></section>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="space-y-10"><section class="glass-panel p-8 space-y-8"><h2 class="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">`);
  Circle_check_big($$payload, { class: "w-5 h-5 text-emerald-400" });
  $$payload.out.push(`<!----> Registros Recientes</h2> `);
  if (attendanceData.recentAttendance.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="text-center py-10"><p class="text-[10px] font-black text-surface-700 uppercase tracking-widest">Sin actividad reciente</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array_3 = ensure_array_like(attendanceData.recentAttendance);
    $$payload.out.push(`<div class="space-y-8"><!--[-->`);
    for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
      let rec = each_array_3[i];
      $$payload.out.push(`<div class="relative pl-8 border-l-2 border-surface-900 pb-2"><div class="absolute -left-[7px] top-0 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] border-2 border-surface-950"></div> <div class="flex items-center justify-between mb-2"><p class="text-[9px] font-black text-surface-600 uppercase tracking-widest">${escape_html(formatDate(rec.date))}</p> <span class="text-[10px] font-black text-emerald-400">${escape_html(rec.attendanceRate)}%</span></div> <h4 class="text-xs font-black text-white uppercase tracking-tighter mb-1">${escape_html(rec.className)}</h4> <p class="text-[9px] font-bold text-surface-400 uppercase tracking-widest truncate">${escape_html(rec.centerName)}</p> <div class="flex gap-2 mt-4"><span class="px-2 py-1 bg-surface-950 text-emerald-400 text-[8px] font-black rounded border border-surface-900 uppercase tracking-widest">${escape_html(rec.present)} Presente(s)</span> <span class="px-2 py-1 bg-surface-950 text-red-400 text-[8px] font-black rounded border border-surface-900 uppercase tracking-widest">${escape_html(rec.absent)} Falta(s)</span></div></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></section> <section class="space-y-4"><h3 class="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em] px-2 italic">Accesos Rápidos</h3> <div class="space-y-3"><button class="w-full glass-panel p-5 flex items-center justify-between group hover:border-primary-500/30 transition-all text-left"><div class="flex items-center gap-4"><div class="p-3 bg-surface-950 rounded-xl text-primary-400 border border-surface-900 group-hover:scale-110 transition-transform">`);
  Chart_column($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></div> <div><p class="text-[10px] font-black text-white uppercase">Informes Mensuales</p> <p class="text-[8px] font-black text-surface-600 uppercase tracking-widest">Analizar Tendencias</p></div></div> `);
  Chevron_right($$payload, { class: "w-4 h-4 text-surface-700" });
  $$payload.out.push(`<!----></button> <button class="w-full glass-panel p-5 flex items-center justify-between group hover:border-primary-500/30 transition-all text-left"><div class="flex items-center gap-4"><div class="p-3 bg-surface-950 rounded-xl text-blue-400 border border-surface-900 group-hover:scale-110 transition-transform">`);
  Users($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></div> <div><p class="text-[10px] font-black text-white uppercase">Todos los Grupos</p> <p class="text-[8px] font-black text-surface-600 uppercase tracking-widest">Gestión Académica</p></div></div> `);
  Chevron_right($$payload, { class: "w-4 h-4 text-surface-700" });
  $$payload.out.push(`<!----></button></div></section></div></div></div>`);
  pop();
}
export {
  _page as default
};
