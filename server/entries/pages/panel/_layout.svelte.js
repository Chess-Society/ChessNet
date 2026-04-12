import { d as sanitize_props, f as spread_props, g as slot, c as escape_html, i as attr, j as derived, s as store_get, u as unsubscribe_stores } from "../../../chunks/renderer.js";
import { p as page } from "../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { a as appStore } from "../../../chunks/appStore.js";
import { a as auth } from "../../../chunks/firebase.js";
import { S as Shield } from "../../../chunks/shield.js";
import { H as House } from "../../../chunks/house.js";
import { S as Settings } from "../../../chunks/settings.js";
import { I as Icon } from "../../../chunks/Icon.js";
function Key($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"
      }
    ],
    ["path", { "d": "m21 2-9.6 9.6" }],
    ["circle", { "cx": "7.5", "cy": "15.5", "r": "5.5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "key" },
    $$sanitized_props,
    {
      /**
       * @component @name Key
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUuNSA3LjUgMi4zIDIuM2ExIDEgMCAwIDAgMS40IDBsMi4xLTIuMWExIDEgMCAwIDAgMC0xLjRMMTkgNCIgLz4KICA8cGF0aCBkPSJtMjEgMi05LjYgOS42IiAvPgogIDxjaXJjbGUgY3g9IjcuNSIgY3k9IjE1LjUiIHI9IjUuNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/key
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
function Log_out($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m16 17 5-5-5-5" }],
    ["path", { "d": "M21 12H9" }],
    ["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]
  ];
  Icon($$renderer, spread_props([
    { name: "log-out" },
    $$sanitized_props,
    {
      /**
       * @component @name LogOut
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTcgNS01LTUtNSIgLz4KICA8cGF0aCBkPSJNMjEgMTJIOSIgLz4KICA8cGF0aCBkPSJNOSAyMUg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/log-out
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
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { children } = $$props;
    let teacherName = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).settings.teacherName || auth.currentUser?.displayName || "Profe de Ajedrez");
    let teacherAvatar = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).settings.teacherAvatar || auth.currentUser?.photoURL || null);
    let plan = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).settings.plan || "free");
    let email = derived(() => auth.currentUser?.email || "profesor@chessnet.com");
    let currentRoute = derived(() => store_get($$store_subs ??= {}, "$page", page).url.pathname);
    let breadcrumbName = derived(() => () => {
      let parts = currentRoute().replace("/panel", "").split("/").filter((e) => e);
      if (parts.length === 0) return "Resumen";
      const mappings = {
        "alumnos": "Mis Alumnos",
        "torneos": "Torneos",
        "pagos": "Finanzas",
        "clases": "Clases",
        "centros": "Centros",
        "habilidades": "Habilidades",
        "informes": "Informes",
        "configuracion": "Configuración",
        "logros": "Logros"
      };
      return mappings[parts[0]] || parts[0];
    });
    let initials = derived(() => teacherName().substring(0, 2).toUpperCase());
    $$renderer2.push(`<div class="min-h-screen bg-[#0f172a] text-slate-200 font-sans"><header class="bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50"><div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2"><div class="flex items-center gap-2 sm:gap-6 min-w-0 flex-1"><button class="flex items-center gap-2 cursor-pointer focus:outline-none group" type="button"><div class="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/50 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:border-emerald-500/50 transition-colors">`);
    Shield($$renderer2, { class: "w-6 h-6 text-emerald-500" });
    $$renderer2.push(`<!----></div> <span class="text-xl font-bold text-white tracking-tight hidden sm:block">ChessNet</span></button> <div class="hidden lg:flex h-6 w-px bg-slate-700"></div> <nav class="hidden lg:flex items-center gap-2 text-sm text-slate-500"><button class="hover:text-slate-300 transition-colors">`);
    House($$renderer2, { class: "w-4 h-4 text-slate-700" });
    $$renderer2.push(`<!----></button> `);
    if (breadcrumbName()()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<svg class="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"></path></svg> <span class="capitalize text-slate-300 font-medium">${escape_html(breadcrumbName()())}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></nav></div> <div class="flex items-center gap-2 sm:gap-4"><div class="flex items-center gap-1 sm:gap-2 bg-slate-900/50 rounded-lg py-1 px-3 border border-slate-700/50"><span class="text-[10px] uppercase font-bold text-slate-500 hidden sm:inline">Plan</span> <span class="text-xs text-white font-bold flex items-center gap-1.5">`);
    if (plan() === "premium") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> Maestro Premium`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="w-1.5 h-1.5 rounded-full bg-slate-500"></div> Ajedrecista (Gratis)`);
    }
    $$renderer2.push(`<!--]--></span></div> <div class="relative group"><button class="flex items-center gap-2 sm:gap-3 hover:bg-slate-800 py-1.5 px-1.5 sm:pr-3 rounded-full transition-all border border-transparent hover:border-slate-700"><div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-emerald-500/20 shadow-lg overflow-hidden relative">`);
    if (teacherAvatar()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<img${attr("src", teacherAvatar())} alt="Profile" class="w-full h-full object-cover"/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`${escape_html(initials())}`);
    }
    $$renderer2.push(`<!--]--></div> <div class="text-left hidden sm:block"><p class="text-sm font-medium text-white">${escape_html(teacherName())}</p> <p class="text-xs text-slate-400 capitalize">${escape_html(plan())}</p></div></button> <div class="absolute right-0 top-full mt-2 w-56 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50 translate-y-2 group-hover:translate-y-0"><div class="px-4 py-3 border-b border-slate-700/50 bg-slate-800/50 rounded-t-xl"><p class="text-sm text-white font-bold max-w-full truncate">${escape_html(teacherName())}</p> <p class="text-xs text-slate-400 truncate">${escape_html(email())}</p></div> <div class="py-1"><a href="/panel/configuracion" class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">`);
    Settings($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Configuración</a> `);
    if (email() === "andreslgumuzio@gmail.com") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<a href="/admin" class="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-amber-400 hover:bg-slate-800 hover:text-amber-300 transition-colors">`);
      Key($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Panel Admin</a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="py-1 border-t border-slate-700/50"><button class="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">`);
    Log_out($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Cerrar Sesión</button></div></div></div></div></div></header> <main class="py-6 min-h-[calc(100vh-64px)] overflow-x-hidden">`);
    children($$renderer2);
    $$renderer2.push(`<!----></main></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
