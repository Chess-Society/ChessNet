import { d as sanitize_props, f as spread_props, g as slot, ak as getContext, h as head, c as escape_html, i as attr, e as ensure_array_like, a as attr_class, j as derived, s as store_get, b as stringify, u as unsubscribe_stores } from "../../../../../chunks/renderer.js";
import "../../../../../chunks/state.svelte.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import { w as writable } from "../../../../../chunks/index.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import { a as appStore } from "../../../../../chunks/appStore.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
import { S as Settings } from "../../../../../chunks/settings.js";
import { C as Calendar } from "../../../../../chunks/calendar.js";
import { M as Medal } from "../../../../../chunks/medal.js";
import { M as Map_pin } from "../../../../../chunks/map-pin.js";
function Play($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "play" },
    $$sanitized_props,
    {
      /**
       * @component @name Play
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSA1YTIgMiAwIDAgMSAzLjAwOC0xLjcyOGwxMS45OTcgNi45OThhMiAyIDAgMCAxIC4wMDMgMy40NThsLTEyIDdBMiAyIDAgMCAxIDUgMTl6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/play
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
function create_updated_store() {
  const { set, subscribe } = writable(false);
  {
    return {
      subscribe,
      // eslint-disable-next-line @typescript-eslint/require-await
      check: async () => false
    };
  }
}
const stores = {
  updated: /* @__PURE__ */ create_updated_store()
};
({
  check: stores.updated.check
});
function context() {
  return getContext("__request__");
}
const page$1 = {
  get params() {
    return context().page.params;
  }
};
const page = page$1;
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const tournamentId = page.params.tournamentId;
    let tournament = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).tournaments.find((t) => t.id === tournamentId));
    let activeTab = "overview";
    const formatDate = (d) => new Date(d).toLocaleDateString();
    const getStatusLabel = (s) => {
      const map = {
        draft: "Borrador",
        upcoming: "Próximo",
        in_progress: "En Curso",
        completed: "Finalizado"
      };
      return map[s] || s;
    };
    head("d347zf", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(tournament()?.name || "Cargando...")} - ChessNet</title>`);
      });
    });
    if (!tournament()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="h-screen flex items-center justify-center text-slate-500">Torneo no encontrado...</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"><div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-8"><div class="flex items-center gap-4"><button class="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">`);
      Arrow_left($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></button> <div><div class="flex items-center gap-2 mb-1"><span class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">${escape_html(getStatusLabel(tournament().status))}</span></div> <h1 class="text-3xl font-black text-white tracking-tight">${escape_html(tournament().name)}</h1></div></div> <div class="flex items-center gap-3">`);
      if (tournament().status === "upcoming") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button${attr("disabled", (tournament().players?.length || 0) < 2, true)} class="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20">`);
        Play($$renderer2, { class: "w-5 h-5" });
        $$renderer2.push(`<!----> Iniciar Torneo</button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl font-bold border border-slate-700 transition-all">`);
      Settings($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></button></div></div> <div class="flex border-b border-slate-800 mb-8 overflow-x-auto no-scrollbar svelte-d347zf"><!--[-->`);
      const each_array = ensure_array_like(["overview", "players", "pairings", "standings"]);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tab = each_array[$$index];
        $$renderer2.push(`<button${attr_class(`px-6 py-4 text-sm font-bold capitalize transition-all border-b-2 ${stringify(activeTab === tab ? "border-amber-500 text-white" : "border-transparent text-slate-500 hover:text-slate-300")}`)}>${escape_html(tab === "overview" ? "Resumen" : tab === "players" ? "Participantes" : tab === "pairings" ? "Emparejamientos" : "Clasificación")}</button>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-8">`);
      {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="bg-[#1e293b] rounded-3xl p-8 border border-slate-800"><h3 class="text-white font-bold mb-6 flex items-center gap-2">`);
        Calendar($$renderer2, { class: "w-5 h-5 text-indigo-500" });
        $$renderer2.push(`<!----> Detalles del Evento</h3> <div class="grid grid-cols-2 md:grid-cols-3 gap-6"><div><p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Fecha de Inicio</p> <p class="text-sm text-white">${escape_html(formatDate(tournament().startDate))}</p></div> <div><p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Control de Tiempo</p> <p class="text-sm text-white">${escape_html(tournament().timeControl)}</p></div> <div><p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Formato</p> <p class="text-sm text-white capitalize">${escape_html(tournament().format)}</p></div></div> <div class="mt-8 pt-8 border-t border-slate-800"><p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Descripción</p> <p class="text-sm text-slate-400 leading-relaxed">${escape_html(tournament().description || "Sin descripción adicional.")}</p></div></div>`);
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="space-y-6"><div class="bg-gradient-to-br from-amber-600/20 to-orange-600/10 p-6 rounded-3xl border border-amber-500/20">`);
      Medal($$renderer2, { class: "w-8 h-8 text-amber-500 mb-4" });
      $$renderer2.push(`<!----> <h4 class="text-white font-black text-lg mb-1">Premios y Trofeos</h4> <p class="text-sm text-slate-400 mb-4">Total en premios: <span class="text-white font-bold">${escape_html(tournament().prizePool || 0)} €</span></p> <div class="space-y-2"><div class="flex justify-between text-xs text-slate-300"><span>1er Puesto</span> <span class="font-bold text-amber-400">Trofeo de Oro</span></div> <div class="flex justify-between text-xs text-slate-300"><span>2do Puesto</span> <span class="font-bold text-slate-300">Medalla de Plata</span></div></div></div> <div class="bg-[#1e293b] p-6 rounded-3xl border border-slate-800"><h4 class="text-white font-bold mb-4">Ubicación</h4> <div class="flex items-start gap-3">`);
      Map_pin($$renderer2, { class: "w-5 h-5 text-indigo-500 shrink-0 mt-0.5" });
      $$renderer2.push(`<!----> <p class="text-sm text-slate-400">${escape_html(tournament().location || "Consultar con el organizador.")}</p></div></div></div></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
