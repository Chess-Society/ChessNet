import { h as head, i as attr, c as escape_html } from "../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import "../../../chunks/firebase.js";
import { S as School } from "../../../chunks/school.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let isSigningIn = false;
    head("1x05zx6", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Iniciar Sesión - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-[#0f172a] text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="absolute inset-0 z-0 opacity-20 pointer-events-none"><div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div> <div class="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div></div> <div class="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px] pointer-events-none animate-pulse"></div> <div class="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[128px] pointer-events-none"></div> <div class="w-full max-w-md relative z-10"><div class="text-center mb-8"><a href="/" class="inline-flex items-center gap-2 group mb-4 transition-transform hover:scale-105"><div class="relative"><div class="absolute -inset-2 bg-emerald-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div> <div class="relative bg-[#1e293b] p-3 rounded-xl border border-slate-700 shadow-xl">`);
    School($$renderer2, { class: "w-10 h-10 text-emerald-500" });
    $$renderer2.push(`<!----></div></div></a> <h1 class="text-3xl font-bold text-white tracking-tight">ChessNet</h1> <p class="text-slate-400 mt-2">Plataforma educativa de ajedrez</p></div> <div class="bg-[#1e293b]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl relative overflow-hidden"><div class="text-center mb-8"><h2 class="text-xl font-semibold text-white mb-2">Bienvenido</h2> <p class="text-slate-400 text-sm italic">"El ajedrez es un juego de caballeros."</p></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="space-y-4">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button${attr("disabled", isSigningIn, true)} class="w-full flex items-center justify-center gap-3 px-6 py-4 border border-slate-600/50 rounded-xl bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/80 hover:to-slate-500/80 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg> <span class="font-medium">Continuar con Google</span>`);
      }
      $$renderer2.push(`<!--]--></button> <div class="relative py-4"><div class="absolute inset-0 flex items-center"><span class="w-full border-t border-slate-700/50"></span></div> <div class="relative flex justify-center text-xs uppercase"><span class="bg-[#1e293b] px-2 text-slate-500">¿Problemas?</span></div></div> <button class="w-full text-slate-400 hover:text-white text-sm font-medium transition-colors">He olvidado mi contraseña</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="mt-8 pt-6 border-t border-slate-700/50 text-center"><p class="text-xs text-slate-500 leading-relaxed">Al continuar, confirmas que eres un profesor de ajedrez autorizado.</p></div></div> <p class="text-center text-xs text-slate-600 mt-8">© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} ChessNet. Todos los derechos reservados.</p></div></div>`);
  });
}
export {
  _page as default
};
