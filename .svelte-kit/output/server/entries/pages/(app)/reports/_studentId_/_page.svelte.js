import { i as head, e as escape_html, j as attr_class, h as stringify, k as ensure_array_like, d as bind_props, p as pop, f as push } from "../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "clsx";
import "../../../../../chunks/state.svelte.js";
import { T as Triangle_alert } from "../../../../../chunks/triangle-alert.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { U as User } from "../../../../../chunks/user.js";
import { M as Mail } from "../../../../../chunks/mail.js";
import { P as Phone } from "../../../../../chunks/phone.js";
import { C as Calendar } from "../../../../../chunks/calendar.js";
import { S as School } from "../../../../../chunks/school.js";
import { C as Circle_check_big } from "../../../../../chunks/circle-check-big.js";
import { C as Clock } from "../../../../../chunks/clock.js";
import { C as Circle_x } from "../../../../../chunks/circle-x.js";
function _page($$payload, $$props) {
  push();
  let report, student, progress;
  let data = $$props["data"];
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
  };
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };
  const calculateAge = (birthDate) => {
    const today = /* @__PURE__ */ new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birth.getDate()) {
      age--;
    }
    return age;
  };
  report = data.report;
  student = report?.student;
  progress = report?.progress_summary;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Informe de ${escape_html(student?.name || "Estudiante")} - ChessNet</title>`;
  });
  if (!report) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="min-h-screen bg-slate-900 flex items-center justify-center"><div class="text-center">`);
    Triangle_alert($$payload, { class: "w-12 h-12 text-red-400 mx-auto mb-4" });
    $$payload.out.push(`<!----> <h2 class="text-xl font-semibold text-white mb-2">Estudiante no encontrado</h2> <p class="text-slate-400 mb-4">No se pudo cargar el informe del estudiante</p> <button class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">Volver a Informes</button></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<div class="min-h-screen bg-slate-900"><div class="border-b border-slate-700/50 bg-slate-800/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between py-6"><div class="flex items-center space-x-4"><button class="p-2 text-slate-400 hover:text-white transition-colors" title="Volver a Informes">`);
    Arrow_left($$payload, { class: "w-5 h-5" });
    $$payload.out.push(`<!----></button> <div class="p-2 bg-teal-500/20 rounded-lg">`);
    User($$payload, { class: "w-8 h-8 text-teal-400" });
    $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold text-white">${escape_html(student.name)}</h1> <p class="text-slate-400">Informe de progreso detallado</p></div></div></div></div></div> <div class="bg-slate-800/50 border-b border-slate-700/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="space-y-4"><h3 class="font-semibold text-white">Información Personal</h3> <div class="space-y-2"><div class="flex items-center space-x-2">`);
    Mail($$payload, { class: "w-4 h-4 text-slate-400" });
    $$payload.out.push(`<!----> <span class="text-sm text-slate-300">${escape_html(student.email)}</span></div> <div class="flex items-center space-x-2">`);
    Phone($$payload, { class: "w-4 h-4 text-slate-400" });
    $$payload.out.push(`<!----> <span class="text-sm text-slate-300">${escape_html(student.phone)}</span></div> <div class="flex items-center space-x-2">`);
    Calendar($$payload, { class: "w-4 h-4 text-slate-400" });
    $$payload.out.push(`<!----> <span class="text-sm text-slate-300">${escape_html(calculateAge(student.date_of_birth))} años (${escape_html(formatDate(student.date_of_birth))})</span></div> <div class="flex items-center space-x-2">`);
    School($$payload, { class: "w-4 h-4 text-slate-400" });
    $$payload.out.push(`<!----> <span class="text-sm text-slate-300">${escape_html(report.college.name)}</span></div></div></div> <div class="space-y-4"><h3 class="font-semibold text-white">Métricas Clave</h3> <div class="grid grid-cols-2 gap-4"><div class="text-center"><div class="text-lg font-bold text-white">${escape_html(formatPercentage(progress.attendance_rate))}</div> <div class="text-xs text-slate-400">Asistencia</div></div> <div class="text-center"><div class="text-lg font-bold text-white">${escape_html(formatPercentage(progress.skill_completion_rate))}</div> <div class="text-xs text-slate-400">Skills</div></div> <div class="text-center"><div class="text-lg font-bold text-white">${escape_html(progress.current_rating)}</div> <div class="text-xs text-slate-400">Rating</div></div> <div class="text-center"><div${attr_class(`text-lg font-bold ${stringify(progress.overdue_payments > 0 ? "text-red-400" : "text-emerald-400")}`)}>${escape_html(progress.overdue_payments > 0 ? progress.overdue_payments : "✓")}</div> <div class="text-xs text-slate-400">Pagos</div></div></div></div> <div class="space-y-4"><h3 class="font-semibold text-white">Estado General</h3> <div class="space-y-2"><div class="flex items-center justify-between"><span class="text-sm text-slate-400">Inscrito desde:</span> <span class="text-sm text-white">${escape_html(formatDate(progress.enrollment_date))}</span></div> <div class="flex items-center justify-between"><span class="text-sm text-slate-400">Días activo:</span> <span class="text-sm text-white">${escape_html(progress.days_enrolled)}</span></div> <div class="flex items-center justify-between"><span class="text-sm text-slate-400">Última actividad:</span> <span class="text-sm text-white">${escape_html(formatDate(progress.last_activity_date))}</span></div> <div class="flex items-center justify-between"><span class="text-sm text-slate-400">Rating cambio:</span> <span${attr_class(`text-sm ${stringify(progress.rating_change >= 0 ? "text-emerald-400" : "text-red-400")}`)}>${escape_html(progress.rating_change >= 0 ? "+" : "")}${escape_html(progress.rating_change)}</span></div></div></div></div></div></div> <div class="border-b border-slate-700/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><nav class="flex space-x-12"><button${attr_class(`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${stringify(
      "border-teal-500 text-teal-400"
    )}`)}>Resumen</button> <button${attr_class(`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${stringify("border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300")}`)}>Asistencia</button> <button${attr_class(`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${stringify("border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300")}`)}>Habilidades</button> <button${attr_class(`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${stringify("border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300")}`)}>Pagos</button> <button${attr_class(`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${stringify("border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300")}`)}>Torneos</button> <button${attr_class(`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${stringify("border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300")}`)}>Cronología</button></nav></div></div> <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`);
    {
      $$payload.out.push("<!--[-->");
      const each_array = ensure_array_like(report.rating_history);
      const each_array_1 = ensure_array_like(report.classes);
      $$payload.out.push(`<div class="space-y-8"><div class="grid grid-cols-1 lg:grid-cols-2 gap-8"><div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h3 class="text-lg font-semibold text-white mb-4">Evolución del Rating</h3> <div class="space-y-4"><!--[-->`);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let entry = each_array[$$index];
        $$payload.out.push(`<div class="flex items-center justify-between"><div><div class="text-sm text-white">${escape_html(entry.event)}</div> <div class="text-xs text-slate-400">${escape_html(formatDate(entry.date))}</div></div> <div class="flex items-center space-x-3"><span class="text-sm font-medium text-white">${escape_html(entry.rating)}</span> <span${attr_class(`text-sm ${stringify(entry.change >= 0 ? "text-emerald-400" : "text-red-400")}`)}>${escape_html(entry.change >= 0 ? "+" : "")}${escape_html(entry.change)}</span></div></div>`);
      }
      $$payload.out.push(`<!--]--></div></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h3 class="text-lg font-semibold text-white mb-4">Distribución de Skills</h3> <div class="space-y-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-2">`);
      Circle_check_big($$payload, { class: "w-4 h-4 text-emerald-400" });
      $$payload.out.push(`<!----> <span class="text-sm text-slate-300">Completadas</span></div> <span class="text-sm font-medium text-white">${escape_html(progress.skills_mastered)}</span></div> <div class="flex items-center justify-between"><div class="flex items-center space-x-2">`);
      Clock($$payload, { class: "w-4 h-4 text-yellow-400" });
      $$payload.out.push(`<!----> <span class="text-sm text-slate-300">En progreso</span></div> <span class="text-sm font-medium text-white">${escape_html(progress.skills_in_progress)}</span></div> <div class="flex items-center justify-between"><div class="flex items-center space-x-2">`);
      Circle_x($$payload, { class: "w-4 h-4 text-slate-400" });
      $$payload.out.push(`<!----> <span class="text-sm text-slate-300">Sin comenzar</span></div> <span class="text-sm font-medium text-white">${escape_html(progress.total_skills_assigned - progress.skills_mastered - progress.skills_in_progress)}</span></div></div></div></div> `);
      if (student.instructor_notes) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h3 class="text-lg font-semibold text-white mb-4">Notas del Instructor</h3> <div class="p-4 bg-slate-700/30 rounded-lg"><p class="text-slate-300">${escape_html(student.instructor_notes)}</p></div></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h3 class="text-lg font-semibold text-white mb-4">Clases Inscritas</h3> <div class="space-y-4"><!--[-->`);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let cls = each_array_1[$$index_1];
        $$payload.out.push(`<div class="p-4 bg-slate-700/30 rounded-lg"><div class="flex items-center justify-between mb-2"><h4 class="font-medium text-white">${escape_html(cls.name)}</h4> <span class="text-sm text-emerald-400">${escape_html(formatCurrency(cls.price))}/mes</span></div> <div class="text-sm text-slate-400">${escape_html(cls.schedule)}</div> <div class="text-xs text-slate-500 mt-1">${escape_html(formatDate(cls.start_date))} - ${escape_html(formatDate(cls.end_date))}</div></div>`);
      }
      $$payload.out.push(`<!--]--></div></div></div>`);
    }
    $$payload.out.push(`<!--]--> `);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></main></div>`);
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
