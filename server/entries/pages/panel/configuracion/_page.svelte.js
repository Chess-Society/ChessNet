import { d as sanitize_props, f as spread_props, g as slot, s as store_get, h as head, i as attr, c as escape_html, u as unsubscribe_stores } from "../../../../chunks/renderer.js";
import { a as appStore } from "../../../../chunks/appStore.js";
import { a as auth } from "../../../../chunks/firebase.js";
import { S as Settings } from "../../../../chunks/settings.js";
import { U as User } from "../../../../chunks/user.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { S as Shield } from "../../../../chunks/shield.js";
import { S as Save } from "../../../../chunks/save.js";
function Camera($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"
      }
    ],
    ["circle", { "cx": "12", "cy": "13", "r": "3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "camera" },
    $$sanitized_props,
    {
      /**
       * @component @name Camera
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTMuOTk3IDRhMiAyIDAgMCAxIDEuNzYgMS4wNWwuNDg2LjlBMiAyIDAgMCAwIDE4LjAwMyA3SDIwYTIgMiAwIDAgMSAyIDJ2OWEyIDIgMCAwIDEtMiAySDRhMiAyIDAgMCAxLTItMlY5YTIgMiAwIDAgMSAyLTJoMS45OTdhMiAyIDAgMCAwIDEuNzU5LTEuMDQ4bC40ODktLjkwNEEyIDIgMCAwIDEgMTAuMDA0IDR6IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTMiIHI9IjMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/camera
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
function Credit_card($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      { "width": "20", "height": "14", "x": "2", "y": "5", "rx": "2" }
    ],
    ["line", { "x1": "2", "x2": "22", "y1": "10", "y2": "10" }]
  ];
  Icon($$renderer, spread_props([
    { name: "credit-card" },
    $$sanitized_props,
    {
      /**
       * @component @name CreditCard
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTQiIHg9IjIiIHk9IjUiIHJ4PSIyIiAvPgogIDxsaW5lIHgxPSIyIiB4Mj0iMjIiIHkxPSIxMCIgeTI9IjEwIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/credit-card
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
    let config = {
      teacherName: store_get($$store_subs ??= {}, "$appStore", appStore).settings.teacherName || auth.currentUser?.displayName || "",
      teacherAvatar: store_get($$store_subs ??= {}, "$appStore", appStore).settings.teacherAvatar || auth.currentUser?.photoURL || ""
    };
    head("y0dm7r", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Configuración - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"><div class="flex items-center gap-3 mb-10 pt-6"><div class="w-12 h-12 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-slate-400">`);
    Settings($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-bold text-white tracking-tight">Configuración</h1> <p class="text-slate-400 text-sm">Personaliza tu perfil de profesor y ajusta tus preferencias.</p></div></div> <div class="space-y-6"><div class="bg-[#1e293b] border border-slate-800 rounded-3xl p-8 shadow-xl"><h2 class="text-lg font-bold text-white mb-8 flex items-center gap-2">`);
    User($$renderer2, { class: "w-5 h-5 text-indigo-500" });
    $$renderer2.push(`<!----> Perfil del Profesor</h2> <div class="flex flex-col md:flex-row gap-10 items-start"><div class="relative group"><div class="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-500 overflow-hidden relative">`);
    if (config.teacherAvatar) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<img${attr("src", config.teacherAvatar)} alt="Avatar" class="w-full h-full object-cover"/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      User($$renderer2, { class: "w-10 h-10" });
    }
    $$renderer2.push(`<!--]--> <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">`);
    Camera($$renderer2, { class: "w-6 h-6 text-white" });
    $$renderer2.push(`<!----></div></div></div> <div class="flex-grow space-y-6 w-full"><div class="space-y-2"><label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre Público</label> <input type="text"${attr("value", config.teacherName)} placeholder="Ej. Maestro Magnus" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none transition-all"/></div> <div class="space-y-2"><label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Correo Electrónico</label> <input type="email"${attr("value", auth.currentUser?.email)} disabled="" class="w-full bg-slate-900/50 border border-slate-800/50 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed"/> <p class="text-[10px] text-slate-600 mt-1 italic">El correo no puede ser modificado por seguridad.</p></div></div></div></div> <div class="bg-[#1e293b] border border-slate-800 rounded-3xl p-8 shadow-xl"><h2 class="text-lg font-bold text-white mb-6 flex items-center gap-2">`);
    Credit_card($$renderer2, { class: "w-5 h-5 text-emerald-500" });
    $$renderer2.push(`<!----> Suscripción y Plan</h2> <div class="flex items-center justify-between p-6 bg-slate-900/50 border border-slate-800 rounded-2xl"><div><p class="text-white font-bold">Plan Actual: <span class="text-indigo-400 capitalize">${escape_html(store_get($$store_subs ??= {}, "$appStore", appStore).settings.plan || "Gratis")}</span></p> <p class="text-xs text-slate-500 mt-1">Siguiente fecha de cobro: 01 de Mayo, 2026</p></div> <button class="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-indigo-500/20">Gestionar Plan</button></div></div> <div class="bg-[#1e293b] border border-slate-800 rounded-3xl p-8 shadow-xl"><h2 class="text-lg font-bold text-white mb-6 flex items-center gap-2">`);
    Shield($$renderer2, { class: "w-5 h-5 text-red-500" });
    $$renderer2.push(`<!----> Privacidad y Seguridad</h2> <div class="space-y-4"><div class="flex items-center justify-between p-4 bg-slate-900/30 rounded-xl"><div><p class="text-sm font-bold text-white">Sincronización en la Nube</p> <p class="text-[11px] text-slate-500">Tus datos se guardan automáticamente en Firebase cada 2 segundos tras cambios.</p></div> <div class="w-10 h-6 bg-emerald-500 rounded-full relative"><div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div></div></div></div> <div class="sticky bottom-6 flex justify-center z-50"><button class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95">`);
    {
      $$renderer2.push("<!--[-1-->");
      Save($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----> Guardar Cambios`);
    }
    $$renderer2.push(`<!--]--></button></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
