import { k as ensure_array_like, i as head, l as attr, j as attr_class, e as escape_html, m as maybe_selected, d as bind_props, p as pop, f as push } from "../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { T as Target } from "../../../../../chunks/target.js";
import { X } from "../../../../../chunks/x.js";
import { S as Save } from "../../../../../chunks/save.js";
function _page($$payload, $$props) {
  push();
  const data = {};
  let formData = {
    name: "",
    description: "",
    category_id: "",
    icon: "",
    resource_link: "",
    level: "beginner",
    order_index: 0
  };
  let isSubmitting = false;
  let errors = {};
  const categories = [
    "Fundamentos",
    "Táctica",
    "Finales",
    "Aperturas",
    "Estrategia",
    "Psicología"
  ];
  const levels = [
    { value: "beginner", label: "Principiante" },
    { value: "intermediate", label: "Intermedio" },
    { value: "advanced", label: "Avanzado" }
  ];
  const each_array = ensure_array_like(categories);
  const each_array_1 = ensure_array_like(levels);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Nueva Habilidad - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="flex items-center space-x-3"><div class="p-2 bg-purple-500/20 rounded-lg">`);
  Target($$payload, { class: "w-6 h-6 text-purple-500" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold">Nueva Habilidad</h1> <p class="text-sm text-slate-400">Crear una nueva skill o competencia</p></div></div></div> <div class="flex items-center space-x-3"><button class="btn-secondary">`);
  X($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Cancelar</button> <button${attr("disabled", isSubmitting, true)} class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">`);
  {
    $$payload.out.push("<!--[!-->");
    Save($$payload, { class: "w-4 h-4 mr-2" });
    $$payload.out.push(`<!----> Crear Habilidad`);
  }
  $$payload.out.push(`<!--]--></button></div></div></div></header> <main class="container mx-auto px-4 py-8 max-w-2xl"><div class="bg-slate-800 border border-slate-700 rounded-xl p-8"><form class="space-y-6"><div><label for="name" class="block text-sm font-medium text-slate-300 mb-2">Nombre de la habilidad</label> <input id="name" type="text"${attr("value", formData.name)} placeholder="Ej: Movimiento de peones, Táctica de clavada..."${attr_class("input w-full svelte-1vhlwa4", void 0, { "border-red-500": errors.name })}/> `);
  if (errors.name) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.name)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div><label for="description" class="block text-sm font-medium text-slate-300 mb-2">Descripción</label> <textarea id="description" placeholder="Describe qué aprenderá el estudiante con esta habilidad..." rows="4"${attr_class("input w-full resize-none svelte-1vhlwa4", void 0, { "border-red-500": errors.description })}>`);
  const $$body = escape_html(formData.description);
  if ($$body) {
    $$payload.out.push(`${$$body}`);
  }
  $$payload.out.push(`</textarea> `);
  if (errors.description) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.description)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div><label for="category_id" class="block text-sm font-medium text-slate-300 mb-2">Categoría</label> <select id="category_id"${attr_class("input w-full svelte-1vhlwa4", void 0, { "border-red-500": errors.category_id })}>`);
  $$payload.select_value = formData.category_id;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>Selecciona una categoría</option><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let category = each_array[$$index];
    $$payload.out.push(`<option${attr("value", category)}${maybe_selected($$payload, category)}>${escape_html(category)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select> `);
  if (errors.category_id) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.category_id)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div><label for="level" class="block text-sm font-medium text-slate-300 mb-2">Nivel</label> <select id="level" class="input w-full svelte-1vhlwa4">`);
  $$payload.select_value = formData.level;
  $$payload.out.push(`<!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let level = each_array_1[$$index_1];
    $$payload.out.push(`<option${attr("value", level.value)}${maybe_selected($$payload, level.value)}>${escape_html(level.label)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <div><label for="icon" class="block text-sm font-medium text-slate-300 mb-2">Icono (opcional)</label> <input id="icon" type="text"${attr("value", formData.icon)} placeholder="Ej: ♟️, 🏰, ⚔️" class="input w-full svelte-1vhlwa4"/></div> <div><label for="resource_link" class="block text-sm font-medium text-slate-300 mb-2">Enlace de recurso (opcional)</label> <input id="resource_link" type="url"${attr("value", formData.resource_link)} placeholder="https://ejemplo.com/recurso" class="input w-full svelte-1vhlwa4"/></div> <div><label for="order_index" class="block text-sm font-medium text-slate-300 mb-2">Orden de aparición</label> <input id="order_index" type="number" min="0"${attr("value", formData.order_index)} class="input w-full svelte-1vhlwa4"/> <p class="text-xs text-slate-400 mt-1">Número para ordenar las habilidades (0 = primero)</p></div> <div class="bg-slate-700/50 rounded-lg p-4"><h3 class="text-sm font-medium text-slate-300 mb-2">💡 Consejos para crear habilidades</h3> <ul class="text-sm text-slate-400 space-y-1"><li>• Sé específico en el nombre (ej: "Enroque corto" vs "Enroque")</li> <li>• La descripción debe explicar qué aprenderá el estudiante</li> <li>• Organiza por categorías para facilitar la búsqueda</li> <li>• Ajusta la dificultad según el nivel requerido</li></ul></div> <div class="text-xs text-slate-500 text-center">Presiona <kbd class="px-2 py-1 bg-slate-700 rounded text-slate-300 svelte-1vhlwa4">Ctrl + Enter</kbd> para crear rápidamente</div></form></div></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
