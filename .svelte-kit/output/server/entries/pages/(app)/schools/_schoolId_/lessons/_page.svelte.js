import { i as head, e as escape_html, d as bind_props, p as pop, f as push } from "../../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "clsx";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { B as Book_open } from "../../../../../../chunks/book-open.js";
import { P as Plus } from "../../../../../../chunks/plus.js";
import { S as Settings } from "../../../../../../chunks/settings.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Lecciones - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-slate-900"><header class="bg-slate-800 border-b border-slate-700"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="text-slate-400 hover:text-white transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="flex items-center space-x-3">`);
  Book_open($$payload, { class: "w-6 h-6 text-primary-500" });
  $$payload.out.push(`<!----> <div><h1 class="text-xl font-bold text-white">Lecciones y Ejercicios</h1> <p class="text-sm text-slate-400">Centro ID: ${escape_html(data.schoolId)}</p></div></div></div> <div class="flex items-center space-x-2"><button class="btn-secondary">`);
  Plus($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Ejercicio</button> <button class="btn-secondary">`);
  Plus($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Lección</button> <button class="btn-primary">`);
  Plus($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Unidad</button></div></div></div></header> <main class="container mx-auto px-4 py-8"><div class="mb-8"><div class="bg-slate-800 rounded-2xl p-6 border border-slate-700"><div class="flex items-center space-x-3 mb-4"><div class="p-2 bg-blue-500/20 rounded-lg">`);
  Settings($$payload, { class: "w-6 h-6 text-blue-500" });
  $$payload.out.push(`<!----></div> <div><h3 class="text-lg font-semibold">Módulo de Lecciones en Configuración</h3> <p class="text-slate-400">El sistema de lecciones está siendo configurado</p></div></div> <p class="text-slate-300 mb-4">Esta sección permitirá crear y gestionar unidades de contenido, lecciones y ejercicios de ajedrez para tus estudiantes.</p> <div class="flex space-x-3"><button class="btn-primary">`);
  Plus($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Crear primera unidad</button> <button class="btn-secondary">`);
  Book_open($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Ver documentación</button></div></div></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><div class="card hover:bg-slate-700 transition-colors"><div class="flex items-center space-x-4"><div class="p-3 bg-primary-500/20 rounded-xl">`);
  Book_open($$payload, { class: "w-6 h-6 text-primary-500" });
  $$payload.out.push(`<!----></div> <div><h3 class="font-semibold">Unidades de Contenido</h3> <p class="text-sm text-slate-400">Organiza lecciones por temas</p></div></div></div> <div class="card hover:bg-slate-700 transition-colors"><div class="flex items-center space-x-4"><div class="p-3 bg-green-500/20 rounded-xl">`);
  Plus($$payload, { class: "w-6 h-6 text-green-500" });
  $$payload.out.push(`<!----></div> <div><h3 class="font-semibold">Lecciones Interactivas</h3> <p class="text-sm text-slate-400">Crea contenido educativo</p></div></div></div> <div class="card hover:bg-slate-700 transition-colors"><div class="flex items-center space-x-4"><div class="p-3 bg-yellow-500/20 rounded-xl">`);
  Settings($$payload, { class: "w-6 h-6 text-yellow-500" });
  $$payload.out.push(`<!----></div> <div><h3 class="font-semibold">Ejercicios de Práctica</h3> <p class="text-sm text-slate-400">Táctica, estrategia y finales</p></div></div></div></div> <div class="mt-8"><div class="bg-green-900/20 border border-green-500/30 rounded-lg p-4"><div class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div> <p class="text-green-300 text-sm">✅ Módulo de lecciones funcionando correctamente. Listo para configurar contenido.</p></div></div></div></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
