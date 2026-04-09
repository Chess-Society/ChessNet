import { h as head, d as escape_html, p as pop, k as push } from "../../../chunks/index.js";
function _page($$payload, $$props) {
  push();
  let debugInfo = "Iniciando diagnóstico...";
  let cookieAnalysis = "";
  let timingInfo = "";
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Debug - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-slate-900 p-8"><div class="max-w-4xl mx-auto"><h1 class="text-3xl font-bold text-white mb-8">🔍 Debug de Cookies</h1> <div class="bg-slate-800 rounded-lg p-6 mb-6"><h2 class="text-xl font-semibold text-white mb-4">Información General</h2> <pre class="text-green-400 text-sm whitespace-pre-wrap">${escape_html(debugInfo)}</pre></div> <div class="bg-slate-800 rounded-lg p-6 mb-6"><h2 class="text-xl font-semibold text-white mb-4">Análisis de Timing</h2> <pre class="text-yellow-400 text-sm whitespace-pre-wrap">${escape_html(timingInfo)}</pre></div> <div class="bg-slate-800 rounded-lg p-6 mb-6"><h2 class="text-xl font-semibold text-white mb-4">Cookies Detalladas</h2> <pre class="text-blue-400 text-sm whitespace-pre-wrap">${escape_html(cookieAnalysis)}</pre></div> <div class="bg-slate-800 rounded-lg p-6"><h2 class="text-xl font-semibold text-white mb-4">Instrucciones</h2> <ol class="text-slate-300 space-y-2"><li>1. Abre DevTools → Console</li> <li>2. Recarga esta página</li> <li>3. Copia todos los logs que empiecen con 🍪</li> <li>4. Envíame esos logs para análisis</li></ol></div></div></div>`);
  pop();
}
export {
  _page as default
};
