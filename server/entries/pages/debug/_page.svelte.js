import { h as head, c as escape_html } from "../../../chunks/renderer.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let debugInfo = "Iniciando diagnóstico...";
    let cookieAnalysis = "";
    let timingInfo = "";
    head("1cmtigg", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Debug - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-slate-900 p-8"><div class="max-w-4xl mx-auto"><h1 class="text-3xl font-bold text-white mb-8">🔍 Debug de Cookies</h1> <div class="bg-slate-800 rounded-lg p-6 mb-6"><h2 class="text-xl font-semibold text-white mb-4">Información General</h2> <pre class="text-green-400 text-sm whitespace-pre-wrap">${escape_html(debugInfo)}</pre></div> <div class="bg-slate-800 rounded-lg p-6 mb-6"><h2 class="text-xl font-semibold text-white mb-4">Análisis de Timing</h2> <pre class="text-yellow-400 text-sm whitespace-pre-wrap">${escape_html(timingInfo)}</pre></div> <div class="bg-slate-800 rounded-lg p-6 mb-6"><h2 class="text-xl font-semibold text-white mb-4">Cookies Detalladas</h2> <pre class="text-blue-400 text-sm whitespace-pre-wrap">${escape_html(cookieAnalysis)}</pre></div> <div class="bg-slate-800 rounded-lg p-6"><h2 class="text-xl font-semibold text-white mb-4">Instrucciones</h2> <ol class="text-slate-300 space-y-2"><li>1. Abre DevTools → Console</li> <li>2. Recarga esta página</li> <li>3. Copia todos los logs que empiecen con 🍪</li> <li>4. Envíame esos logs para análisis</li></ol></div></div></div>`);
  });
}
export {
  _page as default
};
