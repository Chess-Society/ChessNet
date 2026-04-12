import { h as head, c as escape_html, aj as bind_props } from "../../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/root.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { T as Trophy } from "../../../../../../chunks/trophy.js";
import { P as Plus } from "../../../../../../chunks/plus.js";
import { S as Settings } from "../../../../../../chunks/settings.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    head("14i8exp", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Torneos - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-slate-900"><header class="bg-slate-800 border-b border-slate-700"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="text-slate-400 hover:text-white transition-colors">`);
    Arrow_left($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></button> <div class="flex items-center space-x-3">`);
    Trophy($$renderer2, { class: "w-6 h-6 text-primary-500" });
    $$renderer2.push(`<!----> <div><h1 class="text-xl font-bold text-white">Torneos y Competiciones</h1> <p class="text-sm text-slate-400">Centro ID: ${escape_html(data.schoolId)}</p></div></div></div> <button class="btn-primary">`);
    Plus($$renderer2, { class: "w-4 h-4 mr-2" });
    $$renderer2.push(`<!----> Nuevo torneo</button></div></div></header> <main class="container mx-auto px-4 py-8"><div class="mb-8"><div class="bg-slate-800 rounded-2xl p-6 border border-slate-700"><div class="flex items-center space-x-3 mb-4"><div class="p-2 bg-blue-500/20 rounded-lg">`);
    Settings($$renderer2, { class: "w-6 h-6 text-blue-500" });
    $$renderer2.push(`<!----></div> <div><h3 class="text-lg font-semibold">Módulo de Torneos en Configuración</h3> <p class="text-slate-400">El sistema de torneos está siendo configurado</p></div></div> <p class="text-slate-300 mb-4">Esta sección permitirá crear y gestionar torneos de ajedrez, competiciones y eventos para tus estudiantes.</p> <div class="flex space-x-3"><button class="btn-primary">`);
    Plus($$renderer2, { class: "w-4 h-4 mr-2" });
    $$renderer2.push(`<!----> Crear mi primer torneo</button> <button class="btn-secondary">`);
    Trophy($$renderer2, { class: "w-4 h-4 mr-2" });
    $$renderer2.push(`<!----> Ver documentación</button></div></div></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><div class="card hover:bg-slate-700 transition-colors"><div class="flex items-center space-x-4"><div class="p-3 bg-primary-500/20 rounded-xl">`);
    Trophy($$renderer2, { class: "w-6 h-6 text-primary-500" });
    $$renderer2.push(`<!----></div> <div><h3 class="font-semibold">Torneos Suizos</h3> <p class="text-sm text-slate-400">Sistema de emparejamiento automático</p></div></div></div> <div class="card hover:bg-slate-700 transition-colors"><div class="flex items-center space-x-4"><div class="p-3 bg-green-500/20 rounded-xl">`);
    Plus($$renderer2, { class: "w-6 h-6 text-green-500" });
    $$renderer2.push(`<!----></div> <div><h3 class="font-semibold">Torneos por Eliminación</h3> <p class="text-sm text-slate-400">Competiciones directas</p></div></div></div> <div class="card hover:bg-slate-700 transition-colors"><div class="flex items-center space-x-4"><div class="p-3 bg-yellow-500/20 rounded-xl">`);
    Settings($$renderer2, { class: "w-6 h-6 text-yellow-500" });
    $$renderer2.push(`<!----></div> <div><h3 class="font-semibold">Torneos por Equipos</h3> <p class="text-sm text-slate-400">Competiciones grupales</p></div></div></div></div> <div class="mt-8"><div class="bg-green-900/20 border border-green-500/30 rounded-lg p-4"><div class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div> <p class="text-green-300 text-sm">✅ Módulo de torneos funcionando correctamente. Listo para configurar competiciones.</p></div></div></div></main></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
