import { h as head, i as attr, a as attr_class, c as escape_html, e as ensure_array_like, aj as bind_props } from "../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import "../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { T as Target } from "../../../../../chunks/target.js";
import { X } from "../../../../../chunks/x.js";
import { S as Save } from "../../../../../chunks/save.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
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
    head("9qpx5d", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Nueva Habilidad - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
    Arrow_left($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></button> <div class="flex items-center space-x-3"><div class="p-2 bg-purple-500/20 rounded-lg">`);
    Target($$renderer2, { class: "w-6 h-6 text-purple-500" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-2xl font-bold">Nueva Habilidad</h1> <p class="text-sm text-slate-400">Crear una nueva skill o competencia</p></div></div></div> <div class="flex items-center space-x-3"><button class="btn-secondary">`);
    X($$renderer2, { class: "w-4 h-4 mr-2" });
    $$renderer2.push(`<!----> Cancelar</button> <button${attr("disabled", isSubmitting, true)} class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">`);
    {
      $$renderer2.push("<!--[-1-->");
      Save($$renderer2, { class: "w-4 h-4 mr-2" });
      $$renderer2.push(`<!----> Crear Habilidad`);
    }
    $$renderer2.push(`<!--]--></button></div></div></div></header> <main class="container mx-auto px-4 py-8 max-w-2xl"><div class="bg-slate-800 border border-slate-700 rounded-xl p-8"><form class="space-y-6"><div><label for="name" class="block text-sm font-medium text-slate-300 mb-2">Nombre de la habilidad</label> <input id="name" type="text"${attr("value", formData.name)} placeholder="Ej: Movimiento de peones, Táctica de clavada..."${attr_class("input w-full svelte-9qpx5d", void 0, { "border-red-500": errors.name })}/> `);
    if (errors.name) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.name)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="description" class="block text-sm font-medium text-slate-300 mb-2">Descripción</label> <textarea id="description" placeholder="Describe qué aprenderá el estudiante con esta habilidad..." rows="4"${attr_class("input w-full resize-none svelte-9qpx5d", void 0, { "border-red-500": errors.description })}>`);
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
    $$renderer2.push(`<!--]--></div> <div><label for="category_id" class="block text-sm font-medium text-slate-300 mb-2">Categoría</label> `);
    $$renderer2.select(
      {
        id: "category_id",
        value: formData.category_id,
        class: "input w-full"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Selecciona una categoría`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(categories);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let category = each_array[$$index];
          $$renderer3.option({ value: category }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(category)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-9qpx5d",
      { "border-red-500": errors.category_id }
    );
    $$renderer2.push(` `);
    if (errors.category_id) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.category_id)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="level" class="block text-sm font-medium text-slate-300 mb-2">Nivel</label> `);
    $$renderer2.select(
      { id: "level", value: formData.level, class: "input w-full" },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(levels);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let level = each_array_1[$$index_1];
          $$renderer3.option({ value: level.value }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(level.label)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-9qpx5d"
    );
    $$renderer2.push(`</div> <div><label for="icon" class="block text-sm font-medium text-slate-300 mb-2">Icono (opcional)</label> <input id="icon" type="text"${attr("value", formData.icon)} placeholder="Ej: ♟️, 🏰, ⚔️" class="input w-full svelte-9qpx5d"/></div> <div><label for="resource_link" class="block text-sm font-medium text-slate-300 mb-2">Enlace de recurso (opcional)</label> <input id="resource_link" type="url"${attr("value", formData.resource_link)} placeholder="https://ejemplo.com/recurso" class="input w-full svelte-9qpx5d"/></div> <div><label for="order_index" class="block text-sm font-medium text-slate-300 mb-2">Orden de aparición</label> <input id="order_index" type="number" min="0"${attr("value", formData.order_index)} class="input w-full svelte-9qpx5d"/> <p class="text-xs text-slate-400 mt-1">Número para ordenar las habilidades (0 = primero)</p></div> <div class="bg-slate-700/50 rounded-lg p-4"><h3 class="text-sm font-medium text-slate-300 mb-2">💡 Consejos para crear habilidades</h3> <ul class="text-sm text-slate-400 space-y-1"><li>• Sé específico en el nombre (ej: "Enroque corto" vs "Enroque")</li> <li>• La descripción debe explicar qué aprenderá el estudiante</li> <li>• Organiza por categorías para facilitar la búsqueda</li> <li>• Ajusta la dificultad según el nivel requerido</li></ul></div> <div class="text-xs text-slate-500 text-center">Presiona <kbd class="px-2 py-1 bg-slate-700 rounded text-slate-300 svelte-9qpx5d">Ctrl + Enter</kbd> para crear rápidamente</div></form></div></main></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
