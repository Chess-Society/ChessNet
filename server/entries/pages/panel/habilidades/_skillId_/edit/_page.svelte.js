import { d as sanitize_props, f as spread_props, g as slot, h as head, c as escape_html, i as attr, a as attr_class, e as ensure_array_like, aj as bind_props } from "../../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/root.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { T as Target } from "../../../../../../chunks/target.js";
import { R as Rotate_ccw } from "../../../../../../chunks/rotate-ccw.js";
import { E as Eye } from "../../../../../../chunks/eye.js";
import { S as Save } from "../../../../../../chunks/save.js";
import { P as Plus } from "../../../../../../chunks/plus.js";
import { I as Icon } from "../../../../../../chunks/Icon.js";
import { T as Trash_2 } from "../../../../../../chunks/trash-2.js";
import { A as Award } from "../../../../../../chunks/award.js";
import { S as Star } from "../../../../../../chunks/star.js";
import { B as Book_open } from "../../../../../../chunks/book-open.js";
import { C as Clock } from "../../../../../../chunks/clock.js";
function Lightbulb($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
      }
    ],
    ["path", { "d": "M9 18h6" }],
    ["path", { "d": "M10 22h4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "lightbulb" },
    $$sanitized_props,
    {
      /**
       * @component @name Lightbulb
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMTRjLjItMSAuNy0xLjcgMS41LTIuNSAxLS45IDEuNS0yLjIgMS41LTMuNUE2IDYgMCAwIDAgNiA4YzAgMSAuMiAyLjIgMS41IDMuNS43LjcgMS4zIDEuNSAxLjUgMi41IiAvPgogIDxwYXRoIGQ9Ik05IDE4aDYiIC8+CiAgPHBhdGggZD0iTTEwIDIyaDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/lightbulb
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
function Link($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
      }
    ],
    [
      "path",
      {
        "d": "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "link" },
    $$sanitized_props,
    {
      /**
       * @component @name Link
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTNhNSA1IDAgMCAwIDcuNTQuNTRsMy0zYTUgNSAwIDAgMC03LjA3LTcuMDdsLTEuNzIgMS43MSIgLz4KICA8cGF0aCBkPSJNMTQgMTFhNSA1IDAgMCAwLTcuNTQtLjU0bC0zIDNhNSA1IDAgMCAwIDcuMDcgNy4wN2wxLjcxLTEuNzEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/link
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
    let data = $$props["data"];
    let skillData = data.skill;
    let categories = data.categories || [];
    let availablePrerequisites = data.availablePrerequisites || [];
    let formData = {
      name: skillData?.name || "",
      description: skillData?.description || "",
      category_id: skillData?.category_id || "",
      difficulty: skillData?.difficulty || 1,
      estimated_hours: skillData?.estimated_hours || 1,
      prerequisites: skillData?.prerequisites || [],
      learning_objectives: skillData?.learning_objectives || [""],
      assessment_criteria: skillData?.assessment_criteria || [""],
      resources: skillData?.resources || [""],
      order_index: skillData?.order_index || 1,
      active: skillData?.active ?? true
    };
    let errors = {};
    const difficultyLevels = [
      {
        value: 1,
        label: "Muy Fácil",
        color: "text-green-400",
        description: "Conceptos básicos"
      },
      {
        value: 2,
        label: "Fácil",
        color: "text-lime-400",
        description: "Fundamentos"
      },
      {
        value: 3,
        label: "Intermedio",
        color: "text-yellow-400",
        description: "Aplicación práctica"
      },
      {
        value: 4,
        label: "Difícil",
        color: "text-orange-400",
        description: "Conceptos avanzados"
      },
      {
        value: 5,
        label: "Muy Difícil",
        color: "text-red-400",
        description: "Maestría"
      }
    ];
    const hasChanges = () => {
      return JSON.stringify(formData) !== JSON.stringify({
        name: skillData?.name || "",
        description: skillData?.description || "",
        category_id: skillData?.category_id || "",
        difficulty: skillData?.difficulty || 1,
        estimated_hours: skillData?.estimated_hours || 1,
        prerequisites: skillData?.prerequisites || [],
        learning_objectives: skillData?.learning_objectives || [""],
        assessment_criteria: skillData?.assessment_criteria || [""],
        resources: skillData?.resources || [""],
        order_index: skillData?.order_index || 1,
        active: skillData?.active ?? true
      });
    };
    const getDifficultyInfo = () => {
      return difficultyLevels.find((level) => level.value === formData.difficulty) || difficultyLevels[0];
    };
    const getDifficultyStars = (difficulty) => {
      return Array.from({ length: 5 }, (_, i) => i < difficulty);
    };
    head("1xcpxvk", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Editar Skill - ${escape_html(skillData?.name || "Habilidad")} - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
    Arrow_left($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></button> <div class="flex items-center space-x-3"><div class="p-2 bg-purple-500/20 rounded-lg">`);
    Target($$renderer2, { class: "w-6 h-6 text-purple-500" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-2xl font-bold">Editar Habilidad</h1> <p class="text-sm text-slate-400">${escape_html(skillData?.name)}</p></div></div></div> <div class="flex items-center space-x-3">`);
    if (hasChanges()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="btn-secondary svelte-1xcpxvk">`);
      Rotate_ccw($$renderer2, { class: "w-4 h-4 mr-2" });
      $$renderer2.push(`<!----> Descartar Cambios</button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button class="btn-secondary svelte-1xcpxvk">`);
    Eye($$renderer2, { class: "w-4 h-4 mr-2" });
    $$renderer2.push(`<!----> ${escape_html("Vista Previa")}</button> <button${attr("disabled", !hasChanges(), true)} class="btn-primary svelte-1xcpxvk">`);
    {
      $$renderer2.push("<!--[-1-->");
      Save($$renderer2, { class: "w-4 h-4 mr-2" });
      $$renderer2.push(`<!----> Guardar Cambios`);
    }
    $$renderer2.push(`<!--]--></button></div></div></div></header> <main class="container mx-auto px-4 py-8"><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-8"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h2 class="text-xl font-semibold mb-6">Información Básica</h2> <div class="space-y-6"><div><label for="name" class="block text-sm font-medium text-slate-300 mb-2">Nombre de la Habilidad *</label> <input id="name" type="text"${attr("value", formData.name)}${attr_class(`input w-full ${errors.name ? "border-red-500" : ""}`, "svelte-1xcpxvk")} placeholder="Ej: Movimiento de Peones"/> `);
    if (errors.name) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.name)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="description" class="block text-sm font-medium text-slate-300 mb-2">Descripción Detallada *</label> <textarea id="description"${attr_class(`input w-full h-24 resize-none ${errors.description ? "border-red-500" : ""}`, "svelte-1xcpxvk")} placeholder="Describe qué aprenderá el estudiante con esta habilidad...">`);
    const $$body = escape_html(formData.description);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> `);
    if (errors.description) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.description)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="category_id" class="block text-sm font-medium text-slate-300 mb-2">Categoría *</label> `);
    $$renderer2.select(
      {
        id: "category_id",
        value: formData.category_id,
        class: `input w-full ${errors.category_id ? "border-red-500" : ""}`
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Seleccionar categoría`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(categories);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let category = each_array[$$index];
          $$renderer3.option({ value: category.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(category.name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-1xcpxvk"
    );
    $$renderer2.push(` `);
    if (errors.category_id) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.category_id)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="difficulty" class="block text-sm font-medium text-slate-300 mb-2">Nivel de Dificultad *</label> `);
    $$renderer2.select(
      {
        id: "difficulty",
        value: formData.difficulty,
        class: `input w-full ${errors.difficulty ? "border-red-500" : ""}`
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(difficultyLevels);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let level = each_array_1[$$index_1];
          $$renderer3.option({ value: level.value }, ($$renderer4) => {
            $$renderer4.push(`${escape_html("⭐".repeat(level.value))} ${escape_html(level.label)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-1xcpxvk"
    );
    $$renderer2.push(` <p class="text-xs text-slate-400 mt-1">${escape_html(getDifficultyInfo().description)}</p> `);
    if (errors.difficulty) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.difficulty)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="estimated_hours" class="block text-sm font-medium text-slate-300 mb-2">Horas Estimadas</label> <input id="estimated_hours" type="number"${attr("value", formData.estimated_hours)}${attr_class(`input w-full ${errors.estimated_hours ? "border-red-500" : ""}`, "svelte-1xcpxvk")} min="0.5" max="20" step="0.5"/> `);
    if (errors.estimated_hours) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.estimated_hours)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="order_index" class="block text-sm font-medium text-slate-300 mb-2">Orden en la Categoría</label> <input id="order_index" type="number"${attr("value", formData.order_index)} class="input w-full svelte-1xcpxvk" min="1"/></div></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-semibold">Objetivos de Aprendizaje</h2> <button class="btn-secondary text-sm svelte-1xcpxvk">`);
    Plus($$renderer2, { class: "w-4 h-4 mr-1" });
    $$renderer2.push(`<!----> Añadir Objetivo</button></div> <div class="space-y-4"><!--[-->`);
    const each_array_2 = ensure_array_like(formData.learning_objectives);
    for (let index = 0, $$length = each_array_2.length; index < $$length; index++) {
      each_array_2[index];
      $$renderer2.push(`<div class="flex items-start space-x-3"><div class="p-2 bg-green-500/20 rounded-lg mt-1">`);
      Lightbulb($$renderer2, { class: "w-4 h-4 text-green-400" });
      $$renderer2.push(`<!----></div> <div class="flex-1"><textarea class="input w-full h-16 resize-none svelte-1xcpxvk" placeholder="Describe qué debe lograr el estudiante...">`);
      const $$body_1 = escape_html(formData.learning_objectives[index]);
      if ($$body_1) {
        $$renderer2.push(`${$$body_1}`);
      }
      $$renderer2.push(`</textarea></div> `);
      if (formData.learning_objectives.length > 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">`);
        Trash_2($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (errors.learning_objectives) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm">${escape_html(errors.learning_objectives)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-semibold">Criterios de Evaluación</h2> <button class="btn-secondary text-sm svelte-1xcpxvk">`);
    Plus($$renderer2, { class: "w-4 h-4 mr-1" });
    $$renderer2.push(`<!----> Añadir Criterio</button></div> <div class="space-y-4"><!--[-->`);
    const each_array_3 = ensure_array_like(formData.assessment_criteria);
    for (let index = 0, $$length = each_array_3.length; index < $$length; index++) {
      each_array_3[index];
      $$renderer2.push(`<div class="flex items-start space-x-3"><div class="p-2 bg-blue-500/20 rounded-lg mt-1">`);
      Award($$renderer2, { class: "w-4 h-4 text-blue-400" });
      $$renderer2.push(`<!----></div> <div class="flex-1"><textarea class="input w-full h-16 resize-none svelte-1xcpxvk" placeholder="¿Cómo sabrás que el estudiante ha dominado esta habilidad?">`);
      const $$body_2 = escape_html(formData.assessment_criteria[index]);
      if ($$body_2) {
        $$renderer2.push(`${$$body_2}`);
      }
      $$renderer2.push(`</textarea></div> `);
      if (formData.assessment_criteria.length > 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">`);
        Trash_2($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (errors.assessment_criteria) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm">${escape_html(errors.assessment_criteria)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h2 class="text-xl font-semibold mb-6">Habilidades Prerequisito</h2> `);
    if (availablePrerequisites.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-slate-400 text-center py-4">No hay otras habilidades disponibles como prerequisitos</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-3"><!--[-->`);
      const each_array_4 = ensure_array_like(availablePrerequisites);
      for (let $$index_5 = 0, $$length = each_array_4.length; $$index_5 < $$length; $$index_5++) {
        let skill = each_array_4[$$index_5];
        $$renderer2.push(`<label class="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors cursor-pointer"><input type="checkbox"${attr("checked", formData.prerequisites.includes(skill.id), true)} class="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"/> <div class="flex-1"><p class="text-slate-300 font-medium">${escape_html(skill.name)}</p> <div class="flex items-center space-x-2 mt-1"><div class="flex items-center space-x-1"><!--[-->`);
        const each_array_5 = ensure_array_like(getDifficultyStars(skill.difficulty));
        for (let $$index_4 = 0, $$length2 = each_array_5.length; $$index_4 < $$length2; $$index_4++) {
          let filled = each_array_5[$$index_4];
          Star($$renderer2, {
            class: `w-3 h-3 ${filled ? "text-yellow-400 fill-current" : "text-slate-600"}`
          });
        }
        $$renderer2.push(`<!--]--></div> <span class="text-xs text-slate-500">Nivel ${escape_html(skill.difficulty)}</span></div></div></label>`);
      }
      $$renderer2.push(`<!--]--></div> <p class="text-xs text-slate-400 mt-3">Los estudiantes deben dominar estas habilidades antes de empezar con esta</p>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-semibold">Recursos Educativos</h2> <button class="btn-secondary text-sm svelte-1xcpxvk">`);
    Plus($$renderer2, { class: "w-4 h-4 mr-1" });
    $$renderer2.push(`<!----> Añadir Recurso</button></div> <div class="space-y-4"><!--[-->`);
    const each_array_6 = ensure_array_like(formData.resources);
    for (let index = 0, $$length = each_array_6.length; index < $$length; index++) {
      each_array_6[index];
      $$renderer2.push(`<div class="flex items-center space-x-3"><div class="p-2 bg-orange-500/20 rounded-lg">`);
      Book_open($$renderer2, { class: "w-4 h-4 text-orange-400" });
      $$renderer2.push(`<!----></div> <div class="flex-1"><input${attr("value", formData.resources[index])} class="input w-full svelte-1xcpxvk" placeholder="Ej: Tablero de ajedrez físico, software educativo..."/></div> <button class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400">`);
      Trash_2($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></button></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="space-y-6">`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h3 class="font-semibold mb-4">Consejos Pedagógicos</h3> <div class="space-y-3 text-sm text-slate-400"><div class="flex items-start space-x-2">`);
    Lightbulb($$renderer2, { class: "w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" });
    $$renderer2.push(`<!----> <p>Los objetivos deben ser específicos y medibles para evaluar el progreso.</p></div> <div class="flex items-start space-x-2">`);
    Award($$renderer2, { class: "w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" });
    $$renderer2.push(`<!----> <p>Los criterios de evaluación ayudan a mantener estándares consistentes.</p></div> <div class="flex items-start space-x-2">`);
    Link($$renderer2, { class: "w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" });
    $$renderer2.push(`<!----> <p>Los prerequisitos crean una progresión lógica del aprendizaje.</p></div> <div class="flex items-start space-x-2">`);
    Clock($$renderer2, { class: "w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" });
    $$renderer2.push(`<!----> <p>Las horas estimadas ayudan a planificar las clases efectivamente.</p></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h3 class="font-semibold mb-4">Configuración</h3> <div class="space-y-4"><label class="flex items-center space-x-3"><input type="checkbox"${attr("checked", formData.active, true)} class="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"/> <span class="text-slate-300">Habilidad activa</span></label> <p class="text-xs text-slate-400">Las habilidades inactivas no aparecen en las listas de asignación</p> <div class="pt-4 border-t border-slate-700"><div class="text-sm text-slate-400 space-y-1"><p><strong>Objetivos:</strong> ${escape_html(formData.learning_objectives.filter((obj) => obj.trim()).length)}</p> <p><strong>Criterios:</strong> ${escape_html(formData.assessment_criteria.filter((c) => c.trim()).length)}</p> <p><strong>Recursos:</strong> ${escape_html(formData.resources.filter((r) => r.trim()).length)}</p> <p><strong>Prerequisitos:</strong> ${escape_html(formData.prerequisites.length)}</p></div></div></div></div></div></div></main></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
