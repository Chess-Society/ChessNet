import { d as sanitize_props, f as spread_props, g as slot, h as head, c as escape_html, e as ensure_array_like, i as attr, a as attr_class, aj as bind_props } from "../../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/root.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { T as Target } from "../../../../../../chunks/target.js";
import { C as Clock } from "../../../../../../chunks/clock.js";
import { M as Map_pin } from "../../../../../../chunks/map-pin.js";
import { G as Graduation_cap } from "../../../../../../chunks/graduation-cap.js";
import { P as Plus } from "../../../../../../chunks/plus.js";
import { I as Icon } from "../../../../../../chunks/Icon.js";
import { T as Trophy } from "../../../../../../chunks/trophy.js";
import { S as Star } from "../../../../../../chunks/star.js";
import { Z as Zap } from "../../../../../../chunks/zap.js";
import { B as Book_open } from "../../../../../../chunks/book-open.js";
import { S as Search } from "../../../../../../chunks/search.js";
function Chevron_down($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m6 9 6 6 6-6" }]];
  Icon($$renderer, spread_props([
    { name: "chevron-down" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronDown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNiA5IDYgNiA2LTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/chevron-down
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Chevron_up($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m18 15-6-6-6 6" }]];
  Icon($$renderer, spread_props([
    { name: "chevron-up" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronUp
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTggMTUtNi02LTYgNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevron-up
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Minus($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "M5 12h14" }]];
  Icon($$renderer, spread_props([
    { name: "minus" },
    $$sanitized_props,
    {
      /**
       * @component @name Minus
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/minus
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let filteredAvailableSkills;
    let data = $$props["data"];
    const getDifficultyStars = (difficulty) => Array.from({ length: 5 }, (_, i) => i < difficulty);
    let classData = data.class;
    let assignedSkills = data.assignedSkills || [];
    let availableSkillsByCategory = data.availableSkillsByCategory || {};
    let stats = data.stats || { assigned: 0, available: 0, byCategory: {} };
    let searchQuery = "";
    let isAssigning = false;
    let expandedCategories = {};
    const difficultyColors = {
      beginner: "text-green-400 bg-green-500/20 border-green-500/30",
      intermediate: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
      advanced: "text-red-400 bg-red-500/20 border-red-500/30"
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
    const categoryColors = {
      "Fundamentos": "text-blue-400 bg-blue-500/20",
      "Táctica": "text-yellow-400 bg-yellow-500/20",
      "Finales": "text-purple-400 bg-purple-500/20",
      "Aperturas": "text-green-400 bg-green-500/20"
    };
    filteredAvailableSkills = Object.entries(availableSkillsByCategory || {}).reduce(
      (acc, [category, skills]) => {
        const filtered = skills.filter((skill) => skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || skill.description.toLowerCase().includes(searchQuery.toLowerCase()));
        if (filtered.length > 0) {
          acc[category] = filtered;
        }
        return acc;
      },
      {}
    );
    head("11zncyq", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Temario - ${escape_html(classData?.name || "Clase")} - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
    Arrow_left($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></button> <div class="flex items-center space-x-3"><div class="p-2 bg-purple-500/20 rounded-lg">`);
    Target($$renderer2, { class: "w-6 h-6 text-purple-500" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-2xl font-bold">${escape_html(classData?.name)}</h1> <p class="text-sm text-slate-400">Temario y habilidades</p></div></div></div></div></div></header> <main class="container mx-auto px-4 py-8"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8"><div class="grid grid-cols-1 md:grid-cols-4 gap-6"><div class="space-y-2"><div class="flex items-center space-x-2 text-sm">`);
    Clock($$renderer2, { class: "w-4 h-4 text-slate-500" });
    $$renderer2.push(`<!----> <span class="text-slate-300">${escape_html(classData?.schedule)}</span></div> `);
    if (classData?.room) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex items-center space-x-2 text-sm">`);
      Map_pin($$renderer2, { class: "w-4 h-4 text-slate-500" });
      $$renderer2.push(`<!----> <span class="text-slate-300">${escape_html(classData.room)}</span></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="space-y-2"><div class="flex items-center space-x-2 text-sm">`);
    Graduation_cap($$renderer2, { class: "w-4 h-4 text-slate-500" });
    $$renderer2.push(`<!----> <span class="text-slate-300">${escape_html(classData && difficultyLabels[classData.level] || classData?.level || "Nivel")}</span></div> <div class="flex items-center space-x-2 text-sm">`);
    Target($$renderer2, { class: "w-4 h-4 text-slate-500" });
    $$renderer2.push(`<!----> <span class="text-purple-400 font-medium">${escape_html(stats.assigned || 0)} skills asignadas</span></div></div> <div class="space-y-2"><p class="text-sm text-slate-400">Por categoría</p> <div class="space-y-1">`);
    if (stats.byCategory && typeof stats.byCategory === "object") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(Object.entries(stats.byCategory));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let [category, count] = each_array[$$index];
        $$renderer2.push(`<div class="flex items-center justify-between text-sm"><span class="text-slate-300">${escape_html(category)}</span> <span class="text-slate-400">${escape_html(count)}</span></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="space-y-2"><p class="text-sm text-slate-400">Skills disponibles</p> <div class="flex items-center space-x-2">`);
    Plus($$renderer2, { class: "w-4 h-4 text-slate-500" });
    $$renderer2.push(`<!----> <span class="text-lg font-bold text-green-400">${escape_html(stats.available || 0)}</span></div></div></div> `);
    if (classData?.description) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-4 pt-4 border-t border-slate-700"><p class="text-slate-300 text-sm">${escape_html(classData.description)}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8"><div class="space-y-6"><div class="flex items-center justify-between"><h2 class="text-xl font-semibold text-white flex items-center">`);
    Target($$renderer2, { class: "w-5 h-5 mr-2" });
    $$renderer2.push(`<!----> Temario Actual (${escape_html(assignedSkills.length)})</h2></div> `);
    if (assignedSkills.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">`);
      Target($$renderer2, { class: "w-12 h-12 text-slate-600 mx-auto mb-3" });
      $$renderer2.push(`<!----> <h3 class="text-lg font-semibold text-slate-400 mb-2">No hay skills asignadas</h3> <p class="text-slate-500">Asigna habilidades desde la lista de disponibles</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array_1 = ensure_array_like(assignedSkills);
      for (let index = 0, $$length = each_array_1.length; index < $$length; index++) {
        let skill = each_array_1[index];
        $$renderer2.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors"><div class="flex items-start justify-between"><div class="flex items-start space-x-3 flex-1"><div class="flex flex-col items-center space-y-1 mt-1"><span class="text-xs text-slate-500 font-mono bg-slate-700 px-2 py-1 rounded">${escape_html(skill.order)}</span> <div class="flex flex-col space-y-1"><button${attr("disabled", index === 0, true)} class="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed" title="Subir en el orden">`);
        Chevron_up($$renderer2, { class: "w-3 h-3" });
        $$renderer2.push(`<!----></button> <button${attr("disabled", index === assignedSkills.length - 1, true)} class="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed" title="Bajar en el orden">`);
        Chevron_down($$renderer2, { class: "w-3 h-3" });
        $$renderer2.push(`<!----></button></div></div> <div class="flex-1"><div class="flex items-center space-x-3 mb-2">`);
        if (categoryIcons[skill.category]) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div${attr_class(`p-1 rounded ${categoryColors[skill.category] || "bg-slate-500/20"}`, "svelte-11zncyq")}>`);
          if (categoryIcons[skill.category]) {
            $$renderer2.push("<!--[-->");
            categoryIcons[skill.category]($$renderer2, { class: "w-4 h-4" });
            $$renderer2.push("<!--]-->");
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push("<!--]-->");
          }
          $$renderer2.push(`</div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <h3 class="font-semibold text-white">${escape_html(skill.name)}</h3></div> <p class="text-slate-300 text-sm mb-3 leading-relaxed">${escape_html(skill.description)}</p> <div class="flex items-center justify-between"><div class="flex items-center space-x-3"><span class="text-xs text-slate-500">${escape_html(skill.category)}</span> <span${attr_class(`px-2 py-1 rounded-full text-xs font-medium border ${difficultyColors[skill.difficulty]}`, "svelte-11zncyq")}>${escape_html(difficultyLabels[skill.difficulty])}</span></div> <span class="text-xs text-slate-500">Añadida: ${escape_html(skill.assigned_at ? new Date(skill.assigned_at).toLocaleDateString("es-ES") : "N/A")}</span></div></div></div> <button class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400 ml-3" title="Quitar del temario">`);
        Minus($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="space-y-6"><div class="flex items-center justify-between"><h2 class="text-xl font-semibold text-white flex items-center">`);
    Plus($$renderer2, { class: "w-5 h-5 mr-2" });
    $$renderer2.push(`<!----> Skills Disponibles (${escape_html(stats.available)})</h2></div> <div class="relative">`);
    Search($$renderer2, {
      class: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
    });
    $$renderer2.push(`<!----> <input type="text" placeholder="Buscar skills disponibles..."${attr("value", searchQuery)} class="input pl-10 w-full svelte-11zncyq"/></div> `);
    if (Object.keys(filteredAvailableSkills).length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">`);
      Target($$renderer2, { class: "w-12 h-12 text-slate-600 mx-auto mb-3" });
      $$renderer2.push(`<!----> <h3 class="text-lg font-semibold text-slate-400 mb-2">${escape_html("No hay skills disponibles")}</h3> <p class="text-slate-500">${escape_html("Todas las skills apropiadas para este nivel ya están asignadas")}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-4"><!--[-->`);
      const each_array_2 = ensure_array_like(Object.entries(filteredAvailableSkills || {}));
      for (let $$index_4 = 0, $$length = each_array_2.length; $$index_4 < $$length; $$index_4++) {
        let [category, skills] = each_array_2[$$index_4];
        $$renderer2.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"><button class="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"><div class="flex items-center space-x-3">`);
        if (categoryIcons[category]) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div${attr_class(`p-2 rounded-lg ${categoryColors[category] || "bg-slate-500/20"}`, "svelte-11zncyq")}>`);
          if (categoryIcons[category]) {
            $$renderer2.push("<!--[-->");
            categoryIcons[category]($$renderer2, { class: "w-5 h-5" });
            $$renderer2.push("<!--]-->");
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push("<!--]-->");
          }
          $$renderer2.push(`</div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="text-left"><h3 class="font-semibold text-white">${escape_html(category)}</h3> <p class="text-sm text-slate-400">${escape_html(skills.length)} skills disponibles</p></div></div> `);
        if (expandedCategories[category]) {
          $$renderer2.push("<!--[0-->");
          Chevron_up($$renderer2, { class: "w-5 h-5 text-slate-400" });
        } else {
          $$renderer2.push("<!--[-1-->");
          Chevron_down($$renderer2, { class: "w-5 h-5 text-slate-400" });
        }
        $$renderer2.push(`<!--]--></button> `);
        if (expandedCategories[category]) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="border-t border-slate-700"><!--[-->`);
          const each_array_3 = ensure_array_like(skills);
          for (let $$index_3 = 0, $$length2 = each_array_3.length; $$index_3 < $$length2; $$index_3++) {
            let skill = each_array_3[$$index_3];
            $$renderer2.push(`<div class="p-4 border-b border-slate-700 last:border-b-0 hover:bg-slate-700/30 transition-colors"><div class="flex items-start justify-between"><div class="flex-1"><h4 class="font-semibold text-white mb-2">${escape_html(skill.name)}</h4> <p class="text-slate-300 text-sm mb-3 leading-relaxed">${escape_html(skill.description)}</p> <div class="flex items-center space-x-3"><!--[-->`);
            const each_array_4 = ensure_array_like(getDifficultyStars(skill.skill?.difficulty || skill.difficulty || 0));
            for (let $$index_2 = 0, $$length3 = each_array_4.length; $$index_2 < $$length3; $$index_2++) {
              let filled = each_array_4[$$index_2];
              Star($$renderer2, {
                class: `w-4 h-4 ${filled ? "text-yellow-400 fill-current" : "text-slate-600"}`
              });
            }
            $$renderer2.push(`<!--]--></div></div> <button${attr("disabled", isAssigning, true)} class="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-slate-400 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed ml-3" title="Añadir al temario">`);
            {
              $$renderer2.push("<!--[-1-->");
              Plus($$renderer2, { class: "w-4 h-4" });
            }
            $$renderer2.push(`<!--]--></button></div></div>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></main></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
