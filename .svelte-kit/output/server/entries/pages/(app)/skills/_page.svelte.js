import { k as ensure_array_like, i as head, e as escape_html, l as attr, m as maybe_selected, j as attr_class, d as bind_props, p as pop, f as push } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../chunks/arrow-left.js";
import { T as Target } from "../../../../chunks/target.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { B as Book_open } from "../../../../chunks/book-open.js";
import { Z as Zap } from "../../../../chunks/zap.js";
import { S as Star } from "../../../../chunks/star.js";
import { S as Search } from "../../../../chunks/search.js";
import { F as Funnel } from "../../../../chunks/funnel.js";
import { T as Trophy } from "../../../../chunks/trophy.js";
import { S as Square_pen } from "../../../../chunks/square-pen.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
function _page($$payload, $$props) {
  push();
  let filteredSkills;
  let data = $$props["data"];
  let skills = data.skills || [];
  let categories = data.categories || [];
  let stats = data.stats || { total: 0, beginner: 0, intermediate: 0, advanced: 0 };
  let searchQuery = "";
  let selectedCategory = "";
  let selectedDifficulty = "";
  const difficultyColors = {
    beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    advanced: "bg-red-500/20 text-red-400 border-red-500/30"
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
  filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory;
    const matchesDifficulty = !selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  const each_array = ensure_array_like(
    // Remover del array local
    categories
  );
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Habilidades - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="flex items-center space-x-3"><div class="p-2 bg-purple-500/20 rounded-lg">`);
  Target($$payload, { class: "w-6 h-6 text-purple-500" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold">Habilidades</h1> <p class="text-sm text-slate-400">Catálogo de skills y competencias</p></div></div></div> <button class="btn-primary">`);
  Plus($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Nueva Habilidad</button></div></div></header> <main class="container mx-auto px-4 py-8"><div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center space-x-3"><div class="p-2 bg-purple-500/20 rounded-lg">`);
  Target($$payload, { class: "w-5 h-5 text-purple-500" });
  $$payload.out.push(`<!----></div> <div><div class="text-2xl font-bold text-white">${escape_html(stats.total)}</div> <div class="text-sm text-slate-400">Total Skills</div></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center space-x-3"><div class="p-2 bg-green-500/20 rounded-lg">`);
  Book_open($$payload, { class: "w-5 h-5 text-green-500" });
  $$payload.out.push(`<!----></div> <div><div class="text-2xl font-bold text-white">${escape_html(stats.beginner)}</div> <div class="text-sm text-slate-400">Principiante</div></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center space-x-3"><div class="p-2 bg-yellow-500/20 rounded-lg">`);
  Zap($$payload, { class: "w-5 h-5 text-yellow-500" });
  $$payload.out.push(`<!----></div> <div><div class="text-2xl font-bold text-white">${escape_html(stats.intermediate)}</div> <div class="text-sm text-slate-400">Intermedio</div></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center space-x-3"><div class="p-2 bg-red-500/20 rounded-lg">`);
  Star($$payload, { class: "w-5 h-5 text-red-500" });
  $$payload.out.push(`<!----></div> <div><div class="text-2xl font-bold text-white">${escape_html(stats.advanced)}</div> <div class="text-sm text-slate-400">Avanzado</div></div></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8"><div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div class="relative">`);
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
  });
  $$payload.out.push(`<!----> <input type="text" placeholder="Buscar habilidades..."${attr("value", searchQuery)} class="input pl-10 w-full svelte-x773vi"/></div> <select class="input svelte-x773vi">`);
  $$payload.select_value = selectedCategory;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>Todas las categorías</option><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let category = each_array[$$index];
    $$payload.out.push(`<option${attr("value", category.name)}${maybe_selected($$payload, category.name)}>${escape_html(category.name)} (${escape_html(category.count)})</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select> <select class="input svelte-x773vi">`);
  $$payload.select_value = selectedDifficulty;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>Todas las dificultades</option><option value="beginner"${maybe_selected($$payload, "beginner")}>Principiante</option><option value="intermediate"${maybe_selected($$payload, "intermediate")}>Intermedio</option><option value="advanced"${maybe_selected($$payload, "advanced")}>Avanzado</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select> <button class="btn-secondary">`);
  Funnel($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Limpiar filtros</button></div></div> `);
  {
    $$payload.out.push("<!--[!-->");
    if (filteredSkills.length === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="text-center py-12">`);
      Target($$payload, { class: "w-16 h-16 text-slate-600 mx-auto mb-4" });
      $$payload.out.push(`<!----> <h3 class="text-xl font-semibold text-slate-400 mb-2">${escape_html("No hay habilidades registradas")}</h3> <p class="text-slate-500 mb-6">${escape_html("Comienza creando tu primera habilidad")}</p> `);
      {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<button class="btn-primary">`);
        Plus($$payload, { class: "w-4 h-4 mr-2" });
        $$payload.out.push(`<!----> Crear Primera Habilidad</button>`);
      }
      $$payload.out.push(`<!--]--></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      const each_array_1 = ensure_array_like(filteredSkills);
      $$payload.out.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let skill = each_array_1[$$index_1];
        $$payload.out.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors"><div class="flex items-start justify-between mb-4"><div class="flex items-center space-x-3">`);
        if (categoryIcons[skill.category]) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<div class="p-2 bg-purple-500/20 rounded-lg"><!---->`);
          categoryIcons[skill.category]?.($$payload, { class: "w-5 h-5 text-purple-500" });
          $$payload.out.push(`<!----></div>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--> <div><h3 class="font-semibold text-white">${escape_html(skill.name)}</h3> <p class="text-sm text-slate-400">${escape_html(skill.category)}</p></div></div> <div class="flex items-center space-x-2"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white">`);
        Square_pen($$payload, { class: "w-4 h-4" });
        $$payload.out.push(`<!----></button> <button class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400">`);
        Trash_2($$payload, { class: "w-4 h-4" });
        $$payload.out.push(`<!----></button></div></div> <p class="text-slate-300 mb-4 text-sm leading-relaxed">${escape_html(skill.description)}</p> <div class="flex items-center justify-between"><span${attr_class(`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[skill.difficulty]}`, "svelte-x773vi")}>${escape_html(difficultyLabels[skill.difficulty])}</span> <span class="text-xs text-slate-500">Creado: ${escape_html(new Date(skill.created_at).toLocaleDateString("es-ES"))}</span></div></div>`);
      }
      $$payload.out.push(`<!--]--></div>`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
