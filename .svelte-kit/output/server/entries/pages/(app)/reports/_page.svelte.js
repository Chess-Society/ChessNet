import { k as ensure_array_like, i as head, e as escape_html, l as attr, j as attr_class, h as stringify, d as bind_props, p as pop, f as push } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../chunks/arrow-left.js";
import { C as Chart_column } from "../../../../chunks/chart-column.js";
import { U as Users } from "../../../../chunks/users.js";
import { A as Activity } from "../../../../chunks/activity.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { T as Trending_up } from "../../../../chunks/trending-up.js";
import { T as Trending_down } from "../../../../chunks/trending-down.js";
import { T as Target } from "../../../../chunks/target.js";
import { S as Search } from "../../../../chunks/search.js";
import { F as Funnel } from "../../../../chunks/funnel.js";
import { C as Chevron_down } from "../../../../chunks/chevron-down.js";
import { S as School } from "../../../../chunks/school.js";
import { E as Eye } from "../../../../chunks/eye.js";
import { T as Trophy } from "../../../../chunks/trophy.js";
import { D as Dollar_sign } from "../../../../chunks/dollar-sign.js";
import { B as Book_open } from "../../../../chunks/book-open.js";
function _page($$payload, $$props) {
  push();
  let filteredStudents;
  let data = $$props["data"];
  let searchTerm = "";
  let collegeFilter = "all";
  let statusFilter = "all";
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };
  const getStudentStatus = (report) => {
    const lastActivity = new Date(report.progress_summary.last_activity_date);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3);
    if (report.progress_summary.overdue_payments > 0) {
      return {
        status: "overdue",
        label: "Pagos pendientes",
        class: "bg-red-500/20 text-red-400 border-red-500/30"
      };
    }
    if (report.progress_summary.attendance_rate < 70) {
      return {
        status: "low_attendance",
        label: "Asistencia baja",
        class: "bg-orange-500/20 text-orange-400 border-orange-500/30"
      };
    }
    if (lastActivity <= weekAgo) {
      return {
        status: "inactive",
        label: "Inactivo",
        class: "bg-gray-500/20 text-gray-400 border-gray-500/30"
      };
    }
    if (report.progress_summary.attendance_rate >= 90 && report.progress_summary.skill_completion_rate >= 75) {
      return {
        status: "excellent",
        label: "Excelente",
        class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      };
    }
    return {
      status: "active",
      label: "Activo",
      class: "bg-blue-500/20 text-blue-400 border-blue-500/30"
    };
  };
  const getActivityIcon = (type) => {
    switch (type) {
      case "attendance":
        return Calendar;
      case "skill":
        return Book_open;
      case "payment":
        return Dollar_sign;
      case "tournament":
        return Trophy;
      default:
        return Activity;
    }
  };
  const getActivityColor = (status) => {
    switch (status) {
      case "positive":
        return "text-emerald-400";
      case "negative":
        return "text-red-400";
      case "warning":
        return "text-yellow-400";
      default:
        return "text-slate-400";
    }
  };
  filteredStudents = data.studentsReports?.filter((report) => {
    const matchesSearch = !searchTerm;
    const matchesCollege = collegeFilter === "all";
    const matchesStatus = statusFilter === "all";
    return matchesSearch && matchesCollege && matchesStatus;
  }) || [];
  [
    ...new Set(data.studentsReports?.map((r) => ({ id: r.student.college_id, name: r.college.name })) || [])
  ];
  const each_array_1 = ensure_array_like(filteredStudents);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Informes de Progreso - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-slate-900"><div class="border-b border-slate-700/50 bg-slate-800/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-6"><div class="flex items-center space-x-4"><button class="p-2 text-slate-400 hover:text-white transition-colors" title="Volver al Dashboard">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="p-2 bg-teal-500/20 rounded-lg">`);
  Chart_column($$payload, { class: "w-8 h-8 text-teal-400" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold text-white">Informes de Progreso</h1> <p class="text-slate-400">Reportes y análisis por estudiante</p></div></div></div></div></div> <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"><div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><div class="flex items-center justify-between mb-4"><div class="p-2 bg-blue-500/20 rounded-lg">`);
  Users($$payload, { class: "w-6 h-6 text-blue-400" });
  $$payload.out.push(`<!----></div></div> <h3 class="text-2xl font-bold text-white mb-1">${escape_html(data.generalStats?.total_students || 0)}</h3> <p class="text-slate-400 text-sm">Total estudiantes</p></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><div class="flex items-center justify-between mb-4"><div class="p-2 bg-emerald-500/20 rounded-lg">`);
  Activity($$payload, { class: "w-6 h-6 text-emerald-400" });
  $$payload.out.push(`<!----></div> <span class="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">${escape_html(data.generalStats?.active_students || 0)}</span></div> <h3 class="text-2xl font-bold text-white mb-1">Activos</h3> <p class="text-slate-400 text-sm">Última semana</p></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><div class="flex items-center justify-between mb-4"><div class="p-2 bg-purple-500/20 rounded-lg">`);
  Calendar($$payload, { class: "w-6 h-6 text-purple-400" });
  $$payload.out.push(`<!----></div> `);
  if ((data.generalStats?.average_attendance_rate || 0) >= 85) {
    $$payload.out.push("<!--[-->");
    Trending_up($$payload, { class: "w-4 h-4 text-emerald-400" });
  } else {
    $$payload.out.push("<!--[!-->");
    Trending_down($$payload, { class: "w-4 h-4 text-red-400" });
  }
  $$payload.out.push(`<!--]--></div> <h3 class="text-2xl font-bold text-white mb-1">${escape_html(formatPercentage(data.generalStats?.average_attendance_rate || 0))}</h3> <p class="text-slate-400 text-sm">Asistencia promedio</p></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><div class="flex items-center justify-between mb-4"><div class="p-2 bg-yellow-500/20 rounded-lg">`);
  Target($$payload, { class: "w-6 h-6 text-yellow-400" });
  $$payload.out.push(`<!----></div></div> <h3 class="text-2xl font-bold text-white mb-1">${escape_html(formatPercentage(data.generalStats?.average_skill_completion || 0))}</h3> <p class="text-slate-400 text-sm">Skills completadas</p></div></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-8"><div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"><div class="relative">`);
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
  });
  $$payload.out.push(`<!----> <input type="text" placeholder="Buscar estudiantes..."${attr("value", searchTerm)} class="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 w-full lg:w-80"/></div> <div class="flex items-center space-x-3"><button class="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors">`);
  Funnel($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> <span>Filtros</span> `);
  Chevron_down($$payload, {
    class: `w-4 h-4 transition-transform ${stringify("")}`
  });
  $$payload.out.push(`<!----></button></div></div> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="space-y-6"><!--[-->`);
  for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
    let report = each_array_1[$$index_2];
    const studentStatus = getStudentStatus(report);
    const each_array_2 = ensure_array_like(report.recent_activity.slice(0, 3));
    $$payload.out.push(`<div class="bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-700/30 transition-all duration-200"><div class="p-6"><div class="flex items-center justify-between mb-4"><div class="flex items-center space-x-4"><div class="p-3 bg-slate-600/50 rounded-lg">`);
    Users($$payload, { class: "w-6 h-6 text-slate-400" });
    $$payload.out.push(`<!----></div> <div><h3 class="text-lg font-semibold text-white">${escape_html(report.student.name)}</h3> <p class="text-slate-400">${escape_html(report.student.email)}</p> <div class="flex items-center space-x-4 mt-1"><div class="flex items-center space-x-1">`);
    School($$payload, { class: "w-3 h-3 text-slate-500" });
    $$payload.out.push(`<!----> <span class="text-xs text-slate-500">${escape_html(report.college.name)}</span></div> <div class="flex items-center space-x-1">`);
    Calendar($$payload, { class: "w-3 h-3 text-slate-500" });
    $$payload.out.push(`<!----> <span class="text-xs text-slate-500">Inscrito: ${escape_html(formatDate(report.progress_summary.enrollment_date))}</span></div></div></div></div> <div class="flex items-center space-x-4"><span${attr_class(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stringify(studentStatus.class)}`)}>${escape_html(studentStatus.label)}</span> <button class="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">`);
    Eye($$payload, { class: "w-4 h-4" });
    $$payload.out.push(`<!----> <span>Ver Informe</span></button></div></div> <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"><div class="text-center"><div class="text-lg font-semibold text-white">${escape_html(formatPercentage(report.progress_summary.attendance_rate))}</div> <div class="text-xs text-slate-400">Asistencia</div></div> <div class="text-center"><div class="text-lg font-semibold text-white">${escape_html(formatPercentage(report.progress_summary.skill_completion_rate))}</div> <div class="text-xs text-slate-400">Skills</div></div> <div class="text-center"><div class="text-lg font-semibold text-white">${escape_html(report.progress_summary.current_rating)}</div> <div class="text-xs text-slate-400">Rating</div></div> <div class="text-center"><div${attr_class(`text-lg font-semibold ${stringify(report.progress_summary.overdue_payments > 0 ? "text-red-400" : "text-emerald-400")}`)}>${escape_html(report.progress_summary.overdue_payments > 0 ? report.progress_summary.overdue_payments : "✓")}</div> <div class="text-xs text-slate-400">Pagos</div></div></div> <div class="border-t border-slate-700/50 pt-4"><h4 class="text-sm font-medium text-slate-300 mb-3">Actividad Reciente</h4> <div class="space-y-2"><!--[-->`);
    for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
      let activity = each_array_2[$$index_1];
      const IconComponent = getActivityIcon(activity.type);
      $$payload.out.push(`<div class="flex items-center space-x-3"><div class="p-1 bg-slate-600/50 rounded">`);
      IconComponent($$payload, {
        class: `w-3 h-3 ${stringify(getActivityColor(activity.status))}`
      });
      $$payload.out.push(`<!----></div> <div class="flex-1"><span class="text-sm text-white">${escape_html(activity.description)}</span> <span class="text-xs text-slate-400 ml-2">${escape_html(formatDate(activity.date))}</span></div></div>`);
    }
    $$payload.out.push(`<!--]--></div></div></div></div>`);
  }
  $$payload.out.push(`<!--]--> `);
  if (filteredStudents.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="text-center py-12">`);
    Chart_column($$payload, { class: "w-12 h-12 text-slate-600 mx-auto mb-4" });
    $$payload.out.push(`<!----> <p class="text-slate-400">No se encontraron estudiantes</p> `);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
