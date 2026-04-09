import { e as ensure_array_like, h as head, d as escape_html, i as attr, m as maybe_selected, f as attr_class, p as pop, k as push } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import { T as Target } from "../../../../chunks/target.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { B as Book_open } from "../../../../chunks/book-open.js";
import { Z as Zap } from "../../../../chunks/zap.js";
import { S as Star } from "../../../../chunks/star.js";
import { S as Search } from "../../../../chunks/search.js";
import { X } from "../../../../chunks/x.js";
import { T as Trophy } from "../../../../chunks/trophy.js";
import { S as Square_pen } from "../../../../chunks/square-pen.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  let skills = data.skills || [];
  let categories = data.categories || [];
  let stats = data.stats || { total: 0, beginner: 0, intermediate: 0, advanced: 0 };
  let searchQuery = "";
  let selectedCategory = "";
  let selectedDifficulty = "";
  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory;
    const matchesDifficulty = !selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  const difficultyThemes = {
    beginner: "bg-green-500/10 text-green-400 border-green-500/20",
    intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    advanced: "bg-red-500/10 text-red-400 border-red-500/20"
  };
  const difficultyLabels = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado"
  };
  const categoryIcons = {
    "Fundamentos": Book_open,
    "Táctica": Zap,
    "Finales": Star,
    "Aperturas": Trophy
  };
  const each_array = ensure_array_like(categories);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Habilidades - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="space-y-8 animate-fade-in"><div class="flex flex-col md:flex-row md:items-end justify-between gap-6"><div class="space-y-2 text-center md:text-left"><div class="flex items-center justify-center md:justify-start gap-3 text-primary-400 font-bold uppercase tracking-widest text-xs">`);
  Target($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> Curriculo &amp; Programa</div> <h1 class="text-4xl font-black text-white tracking-tight">Habilidades</h1> <p class="text-surface-400">Catálogo de competencias y objetivos de aprendizaje para tus estudiantes.</p></div> <div class="flex items-center justify-center gap-3"><button class="btn-primary">`);
  Plus($$payload, { class: "w-5 h-5 mr-2" });
  $$payload.out.push(`<!----> Nueva Habilidad</button></div></div> <div class="grid grid-cols-1 sm:grid-cols-4 gap-6"><div class="glass-card p-6 border-b-2 border-primary-500"><p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Total Skills</p> <div class="flex items-center justify-between"><p class="text-3xl font-black text-white">${escape_html(stats.total)}</p> <div class="p-2 bg-primary-500/10 rounded-xl text-primary-400">`);
  Target($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></div></div></div> <div class="glass-card p-6 border-b-2 border-green-500"><p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Principiante</p> <div class="flex items-center justify-between"><p class="text-3xl font-black text-green-400">${escape_html(stats.beginner)}</p> <div class="p-2 bg-green-500/10 rounded-xl text-green-400">`);
  Book_open($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></div></div></div> <div class="glass-card p-6 border-b-2 border-yellow-500"><p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Intermedio</p> <div class="flex items-center justify-between"><p class="text-3xl font-black text-yellow-400">${escape_html(stats.intermediate)}</p> <div class="p-2 bg-yellow-500/10 rounded-xl text-yellow-400">`);
  Zap($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></div></div></div> <div class="glass-card p-6 border-b-2 border-red-500"><p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Avanzado</p> <div class="flex items-center justify-between"><p class="text-3xl font-black text-red-400">${escape_html(stats.advanced)}</p> <div class="p-2 bg-red-500/10 rounded-xl text-red-400">`);
  Star($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></div></div></div></div> <div class="glass-panel p-6"><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div class="relative group">`);
  Search($$payload, {
    class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600 group-focus-within:text-primary-400 transition-colors"
  });
  $$payload.out.push(`<!----> <input type="text" placeholder="Filtrar por nombre..."${attr("value", searchQuery)} class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-primary-500/50 outline-none transition-all"/></div> <select class="bg-surface-950 border border-surface-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary-500/50 outline-none transition-all cursor-pointer">`);
  $$payload.select_value = selectedCategory;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>Todas las categorías</option><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let category = each_array[$$index];
    $$payload.out.push(`<option${attr("value", category.name)}${maybe_selected($$payload, category.name)}>${escape_html(category.name)} (${escape_html(category.count)})</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select> <select class="bg-surface-950 border border-surface-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary-500/50 outline-none transition-all cursor-pointer">`);
  $$payload.select_value = selectedDifficulty;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>Todas las dificultades</option><option value="beginner"${maybe_selected($$payload, "beginner")}>Principiante</option><option value="intermediate"${maybe_selected($$payload, "intermediate")}>Intermedio</option><option value="advanced"${maybe_selected($$payload, "advanced")}>Avanzado</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select> <button class="btn-ghost flex items-center justify-center gap-2 text-sm">`);
  X($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> Limpiar Filtros</button></div></div> `);
  if (filteredSkills.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="glass-panel p-20 text-center space-y-6"><div class="w-20 h-20 bg-surface-900 rounded-3xl flex items-center justify-center mx-auto border border-surface-800">`);
    Target($$payload, { class: "w-10 h-10 text-surface-700" });
    $$payload.out.push(`<!----></div> <div class="space-y-2"><h2 class="text-xl font-bold text-white">No hay habilidades que mostrar</h2> <p class="text-surface-500 text-sm max-w-xs mx-auto">Prueba a ajustar tus filtros de búsqueda para encontrar lo que necesitas.</p></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array_1 = ensure_array_like(filteredSkills);
    $$payload.out.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let skill = each_array_1[i];
      const IconComponent = categoryIcons[skill.category] || Target;
      $$payload.out.push(`<div class="glass-card group hover:bg-surface-900/40 transition-all duration-300 flex flex-col"><div class="p-6 space-y-6 flex-1 flex flex-col"><div class="flex items-start justify-between"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-surface-900 rounded-xl flex items-center justify-center border border-surface-800 text-primary-400 group-hover:scale-110 group-hover:bg-primary-500/10 transition-all"><!---->`);
      IconComponent($$payload, { class: "w-6 h-6" });
      $$payload.out.push(`<!----></div> <div><h3 class="font-bold text-white group-hover:text-primary-400 transition-colors">${escape_html(skill.name)}</h3> <p class="text-[10px] font-bold text-surface-500 uppercase tracking-widest">${escape_html(skill.category)}</p></div></div> <div class="flex gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-all"><button class="p-2 hover:bg-surface-800 rounded-lg text-surface-400 hover:text-white transition-colors">`);
      Square_pen($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----></button> <button class="p-2 hover:bg-red-500/10 rounded-lg text-surface-400 hover:text-red-400 transition-colors">`);
      Trash_2($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----></button></div></div> <p class="text-sm text-surface-400 leading-relaxed font-medium line-clamp-3">${escape_html(skill.description)}</p> <div class="mt-auto pt-6 flex items-center justify-between"><span${attr_class(`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter border ${difficultyThemes[skill.difficulty]}`)}>${escape_html(difficultyLabels[skill.difficulty])}</span> <div class="flex items-center gap-2 text-[10px] text-surface-600 font-bold uppercase tracking-wider">`);
      Calendar($$payload, { class: "w-3 h-3" });
      $$payload.out.push(`<!----> ${escape_html(new Date(skill.created_at).toLocaleDateString())}</div></div></div> <button class="w-full py-4 bg-surface-900/50 hover:bg-primary-500/10 text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 hover:text-primary-400 border-t border-surface-800/50 transition-all flex items-center justify-center gap-2">Detalles de Habilidad `);
      Chevron_right($$payload, { class: "w-3 h-3" });
      $$payload.out.push(`<!----></button></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></div>`);
  pop();
}
export {
  _page as default
};
