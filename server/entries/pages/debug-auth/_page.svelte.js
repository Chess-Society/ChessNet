import { h as head, c as escape_html, e as ensure_array_like } from "../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let debugInfo = {};
    let cookies = [];
    let sessionInfo = {};
    head("11suzs1", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Debug Auth - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-slate-900 text-white p-8"><div class="max-w-4xl mx-auto"><h1 class="text-3xl font-bold mb-8">🔍 Debug de Autenticación</h1> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="bg-slate-800 rounded-lg p-6"><h2 class="text-xl font-semibold mb-4">📊 Información del Servidor</h2> <pre class="text-sm bg-slate-900 p-4 rounded overflow-auto">${escape_html(JSON.stringify(debugInfo, null, 2))}</pre></div> <div class="bg-slate-800 rounded-lg p-6"><h2 class="text-xl font-semibold mb-4">🍪 Cookies del Cliente</h2> <div class="space-y-2"><!--[-->`);
    const each_array = ensure_array_like(cookies);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let cookie = each_array[$$index];
      $$renderer2.push(`<div class="text-sm bg-slate-900 p-2 rounded"><strong>${escape_html(cookie.name)}:</strong> ${escape_html(cookie.value)}</div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="bg-slate-800 rounded-lg p-6"><h2 class="text-xl font-semibold mb-4">🌐 Información de la Sesión</h2> <pre class="text-sm bg-slate-900 p-4 rounded overflow-auto">${escape_html(JSON.stringify(sessionInfo, null, 2))}</pre></div> <div class="bg-slate-800 rounded-lg p-6"><h2 class="text-xl font-semibold mb-4">⚡ Acciones</h2> <div class="space-y-3"><button class="w-full btn-primary">Ir a Login</button> <button class="w-full btn-secondary">Ir a Dashboard</button> <button class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Limpiar Cookies</button> <button class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Recargar Página</button></div></div></div></div></div>`);
  });
}
export {
  _page as default
};
