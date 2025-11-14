import { w as store_get, i as head, e as escape_html, l as attr, j as attr_class, x as unsubscribe_stores, d as bind_props, p as pop, f as push } from "../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "../../../../../chunks/state.svelte.js";
import { p as page } from "../../../../../chunks/stores.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { U as Users } from "../../../../../chunks/users.js";
import { X } from "../../../../../chunks/x.js";
import { S as Save } from "../../../../../chunks/save.js";
import { U as User } from "../../../../../chunks/user.js";
import { F as File_text } from "../../../../../chunks/file-text.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let classId, isFromClass;
  let data = $$props["data"];
  let formData = { first_name: "", last_name: "", notes: "" };
  let isSubmitting = false;
  let errors = {};
  classId = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("class_id");
  store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("college_id");
  store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("return_to");
  isFromClass = !!classId;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Nuevo Estudiante - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="flex items-center space-x-3"><div class="p-2 bg-green-500/20 rounded-lg">`);
  Users($$payload, { class: "w-6 h-6 text-green-500" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold">${escape_html(isFromClass ? "Nuevo Estudiante para Clase" : "Nuevo Estudiante")}</h1> `);
  if (isFromClass) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-slate-400 text-sm">El estudiante se inscribirá automáticamente en la clase</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <p class="text-sm text-slate-400">${escape_html(isFromClass ? "Crear e inscribir estudiante en la clase" : "Registrar un nuevo alumno")}</p></div></div></div> <div class="flex items-center space-x-3"><button class="btn-secondary">`);
  X($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Cancelar</button> <button${attr("disabled", isSubmitting, true)} class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">`);
  {
    $$payload.out.push("<!--[!-->");
    Save($$payload, { class: "w-4 h-4 mr-2" });
    $$payload.out.push(`<!----> Crear Estudiante`);
  }
  $$payload.out.push(`<!--]--></button></div></div></div></header> <main class="container mx-auto px-4 py-8 max-w-4xl"><div class="bg-slate-800 border border-slate-700 rounded-xl p-8"><form class="space-y-8">`);
  if (isFromClass) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"><div class="flex items-center"><div class="w-2 h-2 bg-blue-400 rounded-full mr-3"></div> <p class="text-blue-300 text-sm"><strong>Inscripción automática:</strong> Este estudiante se inscribirá automáticamente en la clase desde donde se está creando.</p></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div><h2 class="text-xl font-semibold text-white mb-6 flex items-center">`);
  User($$payload, { class: "w-5 h-5 mr-2" });
  $$payload.out.push(`<!----> Información Personal</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label for="first_name" class="block text-sm font-medium text-slate-300 mb-2">Nombre</label> <input id="first_name" type="text"${attr("value", formData.first_name)} placeholder="Nombre del estudiante"${attr_class("input w-full svelte-1vhlwa4", void 0, { "border-red-500": errors.first_name })}/> `);
  if (errors.first_name) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.first_name)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div><label for="last_name" class="block text-sm font-medium text-slate-300 mb-2">Apellidos</label> <input id="last_name" type="text"${attr("value", formData.last_name)} placeholder="Apellidos del estudiante"${attr_class("input w-full svelte-1vhlwa4", void 0, { "border-red-500": errors.last_name })}/> `);
  if (errors.last_name) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.last_name)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div></div> <div><h2 class="text-xl font-semibold text-white mb-6 flex items-center">`);
  File_text($$payload, { class: "w-5 h-5 mr-2" });
  $$payload.out.push(`<!----> Información Adicional</h2> <div class="grid grid-cols-1 gap-6"><div><label for="notes" class="block text-sm font-medium text-slate-300 mb-2">`);
  File_text($$payload, { class: "w-4 h-4 inline mr-1" });
  $$payload.out.push(`<!----> Notas adicionales</label> <textarea id="notes" placeholder="Información adicional sobre el estudiante, nivel, características especiales..." rows="3" class="input w-full resize-none svelte-1vhlwa4">`);
  const $$body = escape_html(formData.notes);
  if ($$body) {
    $$payload.out.push(`${$$body}`);
  }
  $$payload.out.push(`</textarea></div></div></div> <div class="bg-slate-700/50 rounded-lg p-4"><h3 class="text-sm font-medium text-slate-300 mb-2">💡 Consejos para registrar estudiantes</h3> <ul class="text-sm text-slate-400 space-y-1"><li>• Todos los campos son opcionales - puedes completar la información más tarde</li> <li>• El nombre y apellidos se combinarán automáticamente para el nombre completo</li> <li>• Las notas te ayudarán a recordar características especiales del estudiante</li></ul></div> <div class="text-xs text-slate-500 text-center">Presiona <kbd class="px-2 py-1 bg-slate-700 rounded text-slate-300 svelte-1vhlwa4">Ctrl + Enter</kbd> para crear rápidamente</div></form></div></main></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
