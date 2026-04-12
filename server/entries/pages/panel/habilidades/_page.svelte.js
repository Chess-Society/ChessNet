import { d as sanitize_props, f as spread_props, g as slot, h as head, i as attr, e as ensure_array_like, c as escape_html, j as derived, s as store_get, u as unsubscribe_stores } from "../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { a as appStore } from "../../../../chunks/appStore.js";
import { T as Target } from "../../../../chunks/target.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { S as Search } from "../../../../chunks/search.js";
import { S as Square_pen } from "../../../../chunks/square-pen.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
function Layers($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
      }
    ],
    [
      "path",
      {
        "d": "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"
      }
    ],
    [
      "path",
      {
        "d": "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "layers" },
    $$sanitized_props,
    {
      /**
       * @component @name Layers
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIuODMgMi4xOGEyIDIgMCAwIDAtMS42NiAwTDIuNiA2LjA4YTEgMSAwIDAgMCAwIDEuODNsOC41OCAzLjkxYTIgMiAwIDAgMCAxLjY2IDBsOC41OC0zLjlhMSAxIDAgMCAwIDAtMS44M3oiIC8+CiAgPHBhdGggZD0iTTIgMTJhMSAxIDAgMCAwIC41OC45MWw4LjYgMy45MWEyIDIgMCAwIDAgMS42NSAwbDguNTgtMy45QTEgMSAwIDAgMCAyMiAxMiIgLz4KICA8cGF0aCBkPSJNMiAxN2ExIDEgMCAwIDAgLjU4LjkxbDguNiAzLjkxYTIgMiAwIDAgMCAxLjY1IDBsOC41OC0zLjlBMSAxIDAgMCAwIDIyIDE3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/layers
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let searchQuery = "";
    let skills = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).skills || []);
    const filteredSkills = derived(() => () => {
      return skills().filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    head("feuc70", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Temarios y Habilidades - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6"><div class="space-y-4"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-500">`);
    Target($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-bold text-white tracking-tight">Temarios y Habilidades</h1> <p class="text-slate-400 text-sm">Define las competencias y el progreso curricular de tus alumnos.</p></div></div></div> <button class="bg-yellow-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-900/20 flex items-center gap-2">`);
    Plus($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Nueva Habilidad</button></div> <div class="relative group mb-8">`);
    Search($$renderer2, {
      class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-yellow-500 transition-colors"
    });
    $$renderer2.push(`<!----> <input type="text" placeholder="Buscar tema o habilidad..."${attr("value", searchQuery)} class="w-full bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-yellow-500/50 outline-none transition-all backdrop-blur-xl"/></div> `);
    if (filteredSkills()().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-[#1e293b]/40 border border-slate-800 border-dashed rounded-3xl p-24 text-center space-y-6"><div class="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 text-slate-700">`);
      Target($$renderer2, { class: "w-10 h-10" });
      $$renderer2.push(`<!----></div> <div class="space-y-2"><h2 class="text-xl font-bold text-white">No hay habilidades configuradas</h2> <p class="text-slate-500 text-sm">Define los temas (aperturas, finales, táctica) para llevar el control de tus clases.</p></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
      const each_array = ensure_array_like(filteredSkills()());
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let skill = each_array[i];
        $$renderer2.push(`<div class="bg-[#1e293b]/60 border border-slate-800 rounded-3xl p-6 hover:border-yellow-500/30 transition-all group relative overflow-hidden"><div class="flex items-center justify-between mb-6 relative z-10"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-yellow-500 font-bold text-lg group-hover:scale-110 transition-all">${escape_html(skill.name[0].toUpperCase())}</div> <div><h3 class="text-white font-bold leading-tight group-hover:text-yellow-400 transition-colors">${escape_html(skill.name)}</h3> <p class="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">${escape_html(skill.category || "General")}</p></div></div> <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all"><button class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-yellow-400 hover:border-yellow-500/30 transition-all">`);
        Square_pen($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button> <button class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all">`);
        Trash_2($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button></div></div> <div class="space-y-3 mb-6 relative z-10"><div class="flex items-center gap-2 text-xs text-slate-400">`);
        Layers($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----> Nivel: ${escape_html(skill.level || "Básico")}</div> `);
        if (skill.description) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">${escape_html(skill.description)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="flex items-center justify-between pt-4 border-t border-slate-800/50 relative z-10"><button class="flex items-center gap-1 text-[10px] font-bold text-yellow-500 uppercase tracking-wider hover:text-white transition-all group/btn">DETALLES DEL TEMA `);
        Chevron_right($$renderer2, {
          class: "w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1"
        });
        $$renderer2.push(`<!----></button></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
