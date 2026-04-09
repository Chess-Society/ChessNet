import { e as ensure_array_like, h as head, d as escape_html, i as attr, m as maybe_selected, o as attr_style, f as attr_class, l as stringify, p as pop, k as push } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import { A as Activity } from "../../../../chunks/activity.js";
import { S as Sparkles } from "../../../../chunks/sparkles.js";
import { D as Download } from "../../../../chunks/download.js";
import { U as Users } from "../../../../chunks/users.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { A as Award } from "../../../../chunks/award.js";
import { S as Search } from "../../../../chunks/search.js";
import { S as School } from "../../../../chunks/school.js";
import { E as Eye } from "../../../../chunks/eye.js";
import { C as Chart_column } from "../../../../chunks/chart-column.js";
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  let searchTerm = "";
  let collegeFilter = "all";
  const filteredStudents = data.studentsReports?.filter((report) => {
    report.student.name || "";
    report.student.email || "";
    report.college?.name || "";
    const matchesSearch = !searchTerm;
    const matchesCollege = collegeFilter === "all";
    return matchesSearch && matchesCollege;
  }) || [];
  const colleges = [
    ...new Set((data.studentsReports || []).map((r) => ({ id: r.student.college_id, name: r.college.name })) || [])
  ];
  const getStatusTheme = (report) => {
    if (report.progress_summary.overdue_payments > 0) return "text-red-400 border-red-500/20 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
    if (report.progress_summary.attendance_rate < 70) return "text-orange-400 border-orange-500/20 bg-orange-500/10";
    if (report.progress_summary.attendance_rate >= 90) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
    return "text-blue-400 border-blue-500/20 bg-blue-500/10";
  };
  const getStatusLabel = (report) => {
    if (report.progress_summary.overdue_payments > 0) return "AVISO PAGO";
    if (report.progress_summary.attendance_rate < 70) return "BAJA ASIST.";
    if (report.progress_summary.attendance_rate >= 90) return "EXCEPCIONAL";
    return "ESTÁNDAR";
  };
  const each_array = ensure_array_like(colleges);
  const each_array_1 = ensure_array_like(filteredStudents);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Análisis y Reportes - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="space-y-10 animate-fade-in pb-20"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="space-y-4"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400 shadow-2xl">`);
  Activity($$payload, { class: "w-6 h-6" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">Centro Analítico</h1> <p class="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] mt-1">Métricas de Rendimiento Académico</p></div></div></div> <div class="flex items-center gap-4"><button class="bg-surface-950/50 border border-surface-900 px-6 py-3 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:border-primary-500/30 transition-all flex items-center gap-2 backdrop-blur-xl group">`);
  Sparkles($$payload, { class: "w-4 h-4 text-primary-400 group-hover:animate-pulse" });
  $$payload.out.push(`<!----> IA Insights</button> <button class="bg-primary-500 text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg flex items-center gap-2">`);
  Download($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> Exportar CSV</button></div></div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><div class="glass-panel p-8 border-t-4 border-primary-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  Users($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Población Total</p> <div class="flex items-end gap-3"><p class="text-4xl font-black text-white tracking-tighter">${escape_html(data.generalStats?.total_students || 0)}</p> <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">Alumnos</p></div></div> <div class="glass-panel p-8 border-t-4 border-blue-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  Activity($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Actividad Semanal</p> <div class="flex items-end gap-3"><p class="text-4xl font-black text-white tracking-tighter">${escape_html(data.generalStats?.active_students || 0)}</p> <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">Activos</p></div></div> <div class="glass-panel p-8 border-t-4 border-emerald-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  Calendar($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Asistencia Media</p> <div class="flex items-end gap-3"><p class="text-4xl font-black text-white tracking-tighter">${escape_html(data.generalStats?.average_attendance_rate.toFixed(1))}%</p> <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">Global</p></div></div> <div class="glass-panel p-8 border-t-4 border-purple-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  Award($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Progreso Skills</p> <div class="flex items-end gap-3"><p class="text-4xl font-black text-white tracking-tighter">${escape_html(data.generalStats?.average_skill_completion.toFixed(1))}%</p> <p class="text-[10px] font-bold text-surface-600 uppercase mb-2">Completitud</p></div></div></div> <div class="flex flex-col md:flex-row gap-4"><div class="flex-grow relative group">`);
  Search($$payload, {
    class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600 group-focus-within:text-primary-400 transition-colors"
  });
  $$payload.out.push(`<!----> <input type="text" placeholder="BUSCAR ESTUDIANTE, EMAIL O CENTRO..."${attr("value", searchTerm)} class="w-full bg-surface-950/50 border border-surface-900 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all backdrop-blur-xl"/></div> <div class="relative group min-w-[240px]">`);
  School($$payload, {
    class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600"
  });
  $$payload.out.push(`<!----> <select class="w-full bg-surface-950/50 border border-surface-900 rounded-2xl pl-12 pr-10 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl">`);
  $$payload.select_value = collegeFilter;
  $$payload.out.push(`<option value="all"${maybe_selected($$payload, "all")}>TODOS LOS CENTROS</option><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let col = each_array[$$index];
    $$payload.out.push(`<option${attr("value", col.id)}${maybe_selected($$payload, col.id)}>${escape_html(col.name.toUpperCase())}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <button class="bg-surface-900/50 border border-surface-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-800 transition-all backdrop-blur-xl">RESETEAR</button></div> <div class="glass-panel overflow-hidden border-t-4 border-primary-500 shadow-2xl"><div class="overflow-x-auto"><table class="w-full text-left"><thead><tr class="bg-surface-950/80 border-b border-surface-900 backdrop-blur-xl"><th class="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-surface-500">Estudiante / Sede</th><th class="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-surface-500 text-center">Rendimiento</th><th class="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-surface-500 text-center">Elo Actual</th><th class="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-surface-500 text-center">Estatus</th><th class="px-8 py-5"></th></tr></thead><tbody class="divide-y divide-surface-900/50"><!--[-->`);
  for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
    let report = each_array_1[i];
    $$payload.out.push(`<tr class="hover:bg-primary-500/[0.02] transition-colors group"><td class="px-8 py-6"><div class="flex items-center gap-5"><div class="w-12 h-12 bg-surface-950 border border-surface-800 rounded-2xl flex items-center justify-center text-primary-400 group-hover:border-primary-500/30 transition-all shadow-xl font-black">${escape_html(report.student.name.charAt(0))}</div> <div><h3 class="text-sm font-black text-white uppercase tracking-tight leading-none group-hover:text-primary-400 transition-colors">${escape_html(report.student.name)}</h3> <p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mt-1.5 flex items-center gap-2">`);
    School($$payload, { class: "w-3 h-3" });
    $$payload.out.push(`<!----> ${escape_html(report.college.name)}</p></div></div></td><td class="px-8 py-6"><div class="flex flex-col items-center gap-2.5"><div class="flex items-center gap-6"><div class="text-center"><p class="text-[10px] font-black text-white">${escape_html(report.progress_summary.attendance_rate.toFixed(0))}%</p> <p class="text-[7px] font-black text-surface-600 uppercase tracking-widest">ASIST.</p></div> <div class="text-center"><p class="text-[10px] font-black text-white">${escape_html(report.progress_summary.skill_completion_rate.toFixed(0))}%</p> <p class="text-[7px] font-black text-surface-600 uppercase tracking-widest">SKILLS</p></div></div> <div class="w-24 h-1.5 bg-surface-950 rounded-full border border-surface-900 overflow-hidden"><div class="h-full bg-primary-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"${attr_style(`width: ${stringify((report.progress_summary.attendance_rate + report.progress_summary.skill_completion_rate) / 2)}%`)}></div></div></div></td><td class="px-8 py-6 text-center"><div class="inline-block px-4 py-2 bg-surface-950 border border-surface-900 rounded-xl"><p class="text-lg font-black text-white leading-none">${escape_html(report.progress_summary.current_rating)}</p> <p class="text-[8px] font-black text-primary-400 uppercase tracking-widest mt-1">ELO RATING</p></div></td><td class="px-8 py-6 text-center"><span${attr_class(`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${getStatusTheme(report)}`)}>${escape_html(getStatusLabel(report))}</span></td><td class="px-8 py-6 text-right"><button class="p-3 bg-surface-950 border border-surface-800 rounded-2xl text-surface-500 hover:text-primary-400 hover:border-primary-500/30 transition-all shadow-xl group/btn">`);
    Eye($$payload, {
      class: "w-5 h-5 transition-transform group-hover/btn:scale-110"
    });
    $$payload.out.push(`<!----></button></td></tr>`);
  }
  $$payload.out.push(`<!--]--></tbody></table></div> `);
  if (filteredStudents.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="p-24 text-center space-y-6"><div class="w-20 h-20 bg-surface-950 border border-surface-900 rounded-3xl flex items-center justify-center mx-auto text-surface-800">`);
    Chart_column($$payload, { class: "w-10 h-10" });
    $$payload.out.push(`<!----></div> <p class="text-[10px] font-black text-surface-600 uppercase tracking-[0.3em]">No hay registros para este filtro</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div>`);
  pop();
}
export {
  _page as default
};
