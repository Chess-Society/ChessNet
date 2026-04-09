import { e as ensure_array_like, h as head, d as escape_html, f as attr_class, m as maybe_selected, o as attr_style, p as pop, k as push } from "../../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "clsx";
import "../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { S as School } from "../../../../../chunks/school.js";
import { M as Map_pin } from "../../../../../chunks/map-pin.js";
import { A as Activity } from "../../../../../chunks/activity.js";
import { S as Square_pen } from "../../../../../chunks/square-pen.js";
import { P as Plus } from "../../../../../chunks/plus.js";
import { G as Graduation_cap } from "../../../../../chunks/graduation-cap.js";
import { U as Users } from "../../../../../chunks/users.js";
import { T as Target } from "../../../../../chunks/target.js";
import { T as Trending_up } from "../../../../../chunks/trending-up.js";
import { B as Book_open } from "../../../../../chunks/book-open.js";
import { S as Star } from "../../../../../chunks/star.js";
import { T as Trash_2 } from "../../../../../chunks/trash-2.js";
import { C as Chevron_right } from "../../../../../chunks/chevron-right.js";
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  let school = data.school;
  let classes = data.classes || [];
  let stats = data.stats || {
    totalClasses: 0,
    totalCapacity: 0,
    levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 }
  };
  let selectedLevel = "";
  let selectedStatus = "active";
  const filteredClasses = classes.filter((classItem) => {
    const matchesLevel = !selectedLevel;
    const matchesStatus = selectedStatus === "active";
    return matchesLevel && matchesStatus;
  });
  const levelLabels = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
    mixed: "Mixto"
  };
  const each_array = ensure_array_like(["active", "all"]);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html(school?.name || "Centro")} - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="space-y-10 animate-fade-in"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="space-y-4"><button class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest">`);
  Arrow_left($$payload, {
    class: "w-4 h-4 transition-transform group-hover:-translate-x-1"
  });
  $$payload.out.push(`<!----> Volver a Centros</button> <div class="flex items-center gap-6"><div class="w-20 h-20 bg-primary-500/10 border border-primary-500/20 rounded-[2.5rem] flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10 transform -rotate-3 hover:rotate-0 transition-transform duration-500">`);
  School($$payload, { class: "w-10 h-10" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-4xl font-black text-white tracking-tighter uppercase">${escape_html(school?.name)}</h1> <div class="flex flex-wrap items-center gap-4 mt-2">`);
  if (school?.city) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<span class="flex items-center gap-1.5 text-xs font-bold text-surface-500 uppercase tracking-widest bg-surface-900 px-3 py-1 rounded-full border border-surface-800">`);
    Map_pin($$payload, { class: "w-3.5 h-3.5 text-primary-500" });
    $$payload.out.push(`<!----> ${escape_html(school.city)}</span>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <span class="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">`);
  Activity($$payload, { class: "w-3.5 h-3.5" });
  $$payload.out.push(`<!----> Sede Activa</span></div></div></div></div> <div class="flex items-center gap-3"><button class="btn-ghost flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">`);
  Square_pen($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> Configurar Sede</button> <button class="bg-primary-500 text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2">`);
  Plus($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> Nueva Clase</button></div></div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><div class="glass-card p-6 border-b-2 border-primary-500 hover:translate-y-[-4px] transition-transform"><p class="text-[10px] font-black text-surface-600 uppercase tracking-widest mb-1">Clases Activas</p> <div class="flex items-end justify-between"><h3 class="text-3xl font-black text-white leading-none">${escape_html(stats.totalClasses)}</h3> `);
  Graduation_cap($$payload, { class: "w-6 h-6 text-primary-400" });
  $$payload.out.push(`<!----></div></div> <div class="glass-card p-6 border-b-2 border-blue-500 hover:translate-y-[-4px] transition-transform"><p class="text-[10px] font-black text-surface-600 uppercase tracking-widest mb-1">Capacidad Est.</p> <div class="flex items-end justify-between"><h3 class="text-3xl font-black text-white leading-none">${escape_html(stats.totalCapacity || 0)}</h3> `);
  Users($$payload, { class: "w-6 h-6 text-blue-400" });
  $$payload.out.push(`<!----></div></div> <div class="glass-card p-6 border-b-2 border-purple-500 hover:translate-y-[-4px] transition-transform"><p class="text-[10px] font-black text-surface-600 uppercase tracking-widest mb-1">Niveles Diferentes</p> <div class="flex items-end justify-between"><h3 class="text-3xl font-black text-white leading-none">${escape_html(Object.values(stats.levels).filter((v) => v > 0).length)}</h3> `);
  Target($$payload, { class: "w-6 h-6 text-purple-400" });
  $$payload.out.push(`<!----></div></div> <div class="glass-card p-6 border-b-2 border-yellow-500 hover:translate-y-[-4px] transition-transform"><p class="text-[10px] font-black text-surface-600 uppercase tracking-widest mb-1">Rendimiento Avg</p> <div class="flex items-end justify-between"><h3 class="text-3xl font-black text-white leading-none">88%</h3> `);
  Trending_up($$payload, { class: "w-6 h-6 text-yellow-400" });
  $$payload.out.push(`<!----></div></div></div> <div class="space-y-6"><div class="flex flex-col md:flex-row md:items-center justify-between gap-4"><h2 class="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">`);
  Book_open($$payload, { class: "w-5 h-5 text-primary-400" });
  $$payload.out.push(`<!----> Listado de Clases</h2> <div class="flex items-center gap-3"><div class="flex bg-surface-900 border border-surface-800 rounded-xl p-1"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let status = each_array[$$index];
    $$payload.out.push(`<button${attr_class(`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedStatus === status ? "bg-primary-500 text-black shadow-lg shadow-primary-500/20" : "text-surface-500 hover:text-white"}`)}>${escape_html(status === "active" ? "Disponibles" : "Histórico")}</button>`);
  }
  $$payload.out.push(`<!--]--></div> <select class="bg-surface-900 border border-surface-800 rounded-xl px-4 py-2.5 text-[10px] font-black text-white uppercase tracking-widest outline-none cursor-pointer hover:border-surface-700 transition-all">`);
  $$payload.select_value = selectedLevel;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>TODOS LOS NIVELES</option><option value="beginner"${maybe_selected($$payload, "beginner")}>PRINCIPIANTE</option><option value="intermediate"${maybe_selected($$payload, "intermediate")}>INTERMEDIO</option><option value="advanced"${maybe_selected($$payload, "advanced")}>AVANZADO</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div></div> `);
  if (filteredClasses.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="glass-panel py-24 text-center space-y-4 border-dashed"><div class="w-16 h-16 bg-surface-900 rounded-3xl flex items-center justify-center border border-surface-800 mx-auto text-surface-700 opacity-50">`);
    Star($$payload, { class: "w-8 h-8" });
    $$payload.out.push(`<!----></div> <div class="max-w-xs mx-auto space-y-2"><h3 class="text-sm font-black text-surface-400 uppercase tracking-widest">Sin clases configuradas</h3> <p class="text-xs text-surface-600">Empieza a organizar grupos de entrenamiento en este centro ahora.</p></div> <button class="btn-primary">Crear Clase Ahora</button></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array_1 = ensure_array_like(filteredClasses);
    $$payload.out.push(`<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"><!--[-->`);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let item = each_array_1[i];
      $$payload.out.push(`<div class="glass-panel p-6 group hover:translate-y-[-4px] transition-all duration-300 relative overflow-hidden"><div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">`);
      Graduation_cap($$payload, { class: "w-24 h-24" });
      $$payload.out.push(`<!----></div> <div class="flex items-start justify-between mb-6"><div class="space-y-1"><span${attr_class(`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border ${item.level === "beginner" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : item.level === "intermediate" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-purple-500/10 border-purple-500/20 text-purple-400"}`)}>${escape_html(levelLabels[item.level] || item.level)}</span> <h3 class="text-lg font-black text-white uppercase tracking-tight group-hover:text-primary-400 transition-colors">${escape_html(item.name)}</h3></div> <div class="flex items-center gap-2 translate-x-2"><button class="p-2 text-surface-600 hover:text-white transition-colors">`);
      Square_pen($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----></button> <button class="p-2 text-surface-600 hover:text-red-400 transition-colors">`);
      Trash_2($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----></button></div></div> <div class="space-y-3 mb-6 relative z-10"><div class="flex items-center justify-between text-[10px] font-bold text-surface-500 uppercase tracking-widest"><span class="flex items-center gap-1.5">`);
      Users($$payload, { class: "w-3.5 h-3.5" });
      $$payload.out.push(`<!----> Estudiantes</span> <span class="text-surface-300">${escape_html(item.students_count || 0)} / ${escape_html(item.max_students || "∞")}</span></div> <div class="h-1.5 bg-surface-950 rounded-full overflow-hidden"><div class="h-full bg-primary-500"${attr_style(`width: ${Math.min((item.students_count || 0) / (item.max_students || 10) * 100, 100)}%`)}></div></div></div> <button class="w-full py-3 bg-surface-900 border border-surface-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-surface-500 hover:text-white hover:border-surface-600 transition-all flex items-center justify-center gap-2 group/btn">Ver Panel Detallado `);
      Chevron_right($$payload, {
        class: "w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
      });
      $$payload.out.push(`<!----></button></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></div></div>`);
  pop();
}
export {
  _page as default
};
