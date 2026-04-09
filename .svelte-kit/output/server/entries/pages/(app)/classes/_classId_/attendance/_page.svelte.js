import { h as head, d as escape_html, f as attr_class, e as ensure_array_like, i as attr, p as pop, k as push } from "../../../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { U as User_check } from "../../../../../../chunks/user-check.js";
import { Z as Zap } from "../../../../../../chunks/zap.js";
import { H as History } from "../../../../../../chunks/history.js";
import { C as Chart_column } from "../../../../../../chunks/chart-column.js";
import { C as Calendar } from "../../../../../../chunks/calendar.js";
import { C as Circle_check_big } from "../../../../../../chunks/circle-check-big.js";
import { S as Save } from "../../../../../../chunks/save.js";
import { C as Circle_x } from "../../../../../../chunks/circle-x.js";
import { C as Clock } from "../../../../../../chunks/clock.js";
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  const classData = data.class;
  const students = data.students || [];
  data.recentAttendance || [];
  data.attendanceStats || [];
  let selectedDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  let currentAttendance = {};
  let isSubmitting = false;
  const statusThemes = {
    P: {
      icon: Circle_check_big,
      label: "PRESENTE",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    },
    T: {
      icon: Clock,
      label: "TARDE",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20"
    },
    A: {
      icon: Circle_x,
      label: "AUSENTE",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20"
    }
  };
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Asistencia - ${escape_html(classData?.name)} - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="space-y-10 animate-fade-in pb-20"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="space-y-4"><button class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest">`);
  Arrow_left($$payload, {
    class: "w-4 h-4 transition-transform group-hover:-translate-x-1"
  });
  $$payload.out.push(`<!----> Regresar a Clase</button> <div class="flex items-center gap-6"><div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">`);
  User_check($$payload, { class: "w-8 h-8" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-3xl font-black text-white tracking-tighter uppercase">Asistencia</h1> <p class="text-surface-500 text-sm font-medium uppercase tracking-widest">${escape_html(classData?.name)} • ${escape_html(classData?.schedule)}</p></div></div></div> <div class="flex items-center gap-1 bg-surface-950/50 p-1.5 rounded-2xl border border-surface-900 w-fit backdrop-blur-xl"><button${attr_class(`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${"bg-primary-500 text-black shadow-lg shadow-primary-500/20"}`)}>`);
  Zap($$payload, { class: "w-3.5 h-3.5" });
  $$payload.out.push(`<!----> Pasar Lista</button> <button${attr_class(`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${"text-surface-500 hover:text-white"}`)}>`);
  History($$payload, { class: "w-3.5 h-3.5" });
  $$payload.out.push(`<!----> Historial</button> <button${attr_class(`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${"text-surface-500 hover:text-white"}`)}>`);
  Chart_column($$payload, { class: "w-3.5 h-3.5" });
  $$payload.out.push(`<!----> Estadísticas</button></div></div> `);
  {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(students);
    $$payload.out.push(`<div class="space-y-8"><div class="glass-panel p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t-4 border-primary-500 shadow-2xl"><div class="flex items-center gap-4"><div class="p-3 bg-surface-950 rounded-2xl border border-surface-900">`);
    Calendar($$payload, { class: "w-5 h-5 text-primary-400" });
    $$payload.out.push(`<!----></div> <div><p class="text-[10px] font-black text-surface-500 uppercase tracking-widest mb-1">Fecha de Sesión</p> <input type="date"${attr("value", selectedDate)} class="bg-transparent text-white font-black uppercase tracking-tighter outline-none cursor-pointer"/></div></div> <div class="flex items-center gap-3"><button class="bg-surface-950 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-surface-800 hover:border-emerald-500/50 transition-all flex items-center gap-2">`);
    Circle_check_big($$payload, { class: "w-4 h-4 text-emerald-400" });
    $$payload.out.push(`<!----> Todo OK</button> <button${attr("disabled", isSubmitting, true)} class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg flex items-center gap-3">`);
    {
      $$payload.out.push("<!--[!-->");
      Save($$payload, { class: "w-4 h-4" });
    }
    $$payload.out.push(`<!--]--> Finalizar Registro</button></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><!--[-->`);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let student = each_array[$$index_1];
      const each_array_1 = ensure_array_like(Object.entries(statusThemes));
      $$payload.out.push(`<div class="glass-panel p-6 flex items-center justify-between group hover:border-surface-700 transition-all relative overflow-hidden"><div class="flex items-center gap-5 relative z-10"><div class="w-14 h-14 bg-surface-950 rounded-2xl border border-surface-800 flex items-center justify-center text-primary-400 font-black text-lg group-hover:border-primary-500/50 transition-colors">${escape_html(student.name.charAt(0))}</div> <div><h3 class="text-white font-black uppercase text-sm leading-tight group-hover:text-primary-400 transition-colors">${escape_html(student.name)}</h3> <div class="flex items-center gap-2 mt-1"><span class="text-[9px] font-black text-surface-600 uppercase tracking-widest">${escape_html(student.age)} años</span> <span class="w-1 h-1 rounded-full bg-surface-800"></span> <span class="text-[9px] font-black text-surface-600 uppercase tracking-widest">${escape_html(student.level)}</span></div></div></div> <div class="flex items-center gap-3 relative z-10"><div class="flex bg-surface-950 p-1.5 rounded-2xl border border-surface-900 gap-1"><!--[-->`);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let [status, theme] = each_array_1[$$index];
        $$payload.out.push(`<button${attr_class(`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentAttendance[student.id]?.status === status ? `${theme.bg} ${theme.color} ${theme.border} shadow-lg scale-110` : "text-surface-700 hover:text-surface-400"}`)}${attr("title", theme.label)}><!---->`);
        theme.icon($$payload, { class: "w-5 h-5" });
        $$payload.out.push(`<!----></button>`);
      }
      $$payload.out.push(`<!--]--></div></div></div>`);
    }
    $$payload.out.push(`<!--]--></div></div>`);
  }
  $$payload.out.push(`<!--]--></div>`);
  pop();
}
export {
  _page as default
};
