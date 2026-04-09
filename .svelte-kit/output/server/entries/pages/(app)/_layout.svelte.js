import { a as sanitize_props, b as spread_props, c as slot, q as store_get, e as ensure_array_like, i as attr, f as attr_class, l as stringify, d as escape_html, u as unsubscribe_stores, p as pop, k as push } from "../../../chunks/index.js";
import { p as page } from "../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "../../../chunks/state.svelte.js";
import { T as Trophy } from "../../../chunks/trophy.js";
import { U as User } from "../../../chunks/user.js";
import { S as Shield } from "../../../chunks/shield.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { S as Search } from "../../../chunks/search.js";
import { B as Bell, L as Layout_dashboard } from "../../../chunks/layout-dashboard.js";
import { S as Settings } from "../../../chunks/settings.js";
import { Z as Zap } from "../../../chunks/zap.js";
import { S as School } from "../../../chunks/school.js";
import { G as Graduation_cap } from "../../../chunks/graduation-cap.js";
import { U as Users } from "../../../chunks/users.js";
import { C as Circle_check_big } from "../../../chunks/circle-check-big.js";
import { D as Dollar_sign } from "../../../chunks/dollar-sign.js";
import { T as Target } from "../../../chunks/target.js";
function Log_out($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.542.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "m16 17 5-5-5-5" }],
    ["path", { "d": "M21 12H9" }],
    ["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]
  ];
  Icon($$payload, spread_props([
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
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Menu($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.542.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "M4 12h16" }],
    ["path", { "d": "M4 18h16" }],
    ["path", { "d": "M4 6h16" }]
  ];
  Icon($$payload, spread_props([
    { name: "menu" },
    $$sanitized_props,
    {
      /**
       * @component @name Menu
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxMmgxNiIgLz4KICA8cGF0aCBkPSJNNCAxOGgxNiIgLz4KICA8cGF0aCBkPSJNNCA2aDE2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/menu
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let { data, children } = $$props;
  let user = data.user;
  let currentRoute = store_get($$store_subs ??= {}, "$page", page).url.pathname;
  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Layout_dashboard
    },
    { href: "/schools", label: "Sedes Académicas", icon: School },
    { href: "/classes", label: "Programas", icon: Graduation_cap },
    { href: "/students", label: "Estudiantes", icon: Users },
    { href: "/attendance", label: "Asistencia", icon: Circle_check_big },
    { href: "/payments", label: "Finanzas", icon: Dollar_sign },
    { href: "/skills", label: "Habilidades", icon: Target },
    { href: "/tournaments", label: "Torneos", icon: Trophy },
    { href: "/reports", label: "Análisis", icon: Zap }
  ];
  const each_array = ensure_array_like(navItems);
  $$payload.out.push(`<div class="min-h-screen bg-surface-950 flex flex-col lg:flex-row selection:bg-primary-500/30"><aside class="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-surface-950 border-r border-surface-900 z-50"><div class="p-8"><div class="flex items-center gap-4"><div class="w-11 h-11 bg-primary-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">`);
  Trophy($$payload, { class: "text-black w-6 h-6" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-xl font-black text-white tracking-tighter uppercase leading-none">ChessNet</h1> <p class="text-[9px] text-primary-400 font-black uppercase tracking-[0.2em] mt-1.5 opacity-80">System Core</p></div></div></div> <nav class="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto no-scrollbar svelte-yan7o"><p class="px-4 text-[9px] font-black text-surface-600 uppercase tracking-[0.3em] mb-4">Administración</p> <!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    const Icon2 = item.icon;
    $$payload.out.push(`<a${attr("href", item.href)}${attr("aria-current", currentRoute.startsWith(item.href) ? "page" : void 0)}${attr_class(`flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group ${stringify(currentRoute.startsWith(item.href) ? "bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-lg shadow-primary-500/5" : "text-surface-500 hover:text-white hover:bg-surface-900 border border-transparent")}`)}><!---->`);
    Icon2($$payload, { class: "w-4 h-4 transition-transform group-hover:scale-110" });
    $$payload.out.push(`<!----> ${escape_html(item.label)} `);
    if (currentRoute.startsWith(item.href)) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="ml-auto w-1 h-1 bg-primary-500 rounded-full"></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></a>`);
  }
  $$payload.out.push(`<!--]--></nav> <div class="p-6 mt-auto border-t border-surface-900"><div class="glass-panel p-4 rounded-3xl flex items-center gap-4"><div class="relative"><div class="w-10 h-10 rounded-2xl bg-surface-950 border border-surface-800 flex items-center justify-center overflow-hidden">`);
  User($$payload, { class: "w-5 h-5 text-primary-400" });
  $$payload.out.push(`<!----></div> <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 border-2 border-surface-950 rounded-full flex items-center justify-center">`);
  Shield($$payload, { class: "w-2 h-2 text-black" });
  $$payload.out.push(`<!----></div></div> <div class="flex-1 min-w-0"><p class="text-[10px] font-black text-white truncate uppercase tracking-tight">${escape_html(user?.email?.split("@")[0] || "ADMINISTRADOR")}</p> <p class="text-[8px] text-surface-600 font-black uppercase tracking-widest mt-0.5">Licencia Premium</p></div> <button title="Cerrar Sesión" class="p-2 text-surface-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">`);
  Log_out($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----></button></div></div></aside> <header class="lg:hidden h-16 bg-surface-950/80 backdrop-blur-xl border-b border-surface-900 flex items-center justify-between px-6 sticky top-0 z-50"><div class="flex items-center gap-3"><div class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">`);
  Trophy($$payload, { class: "text-black w-4 h-4" });
  $$payload.out.push(`<!----></div> <span class="text-sm font-black text-white uppercase tracking-tighter">ChessNet</span></div> <button class="p-2 text-surface-400 hover:text-white transition-colors">`);
  {
    $$payload.out.push("<!--[!-->");
    Menu($$payload, { class: "w-6 h-6" });
  }
  $$payload.out.push(`<!--]--></button></header> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <main class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden"><header class="hidden lg:flex h-20 items-center justify-between px-10 bg-surface-950 border-b border-surface-900/50 z-10 transition-all"><div class="relative w-96 group">`);
  Search($$payload, {
    class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600 group-focus-within:text-primary-400 transition-colors"
  });
  $$payload.out.push(`<!----> <input type="text" placeholder="EXPLORAR SISTEMA..." class="bg-surface-950 border border-surface-900 rounded-2xl pl-12 pr-6 py-2.5 text-[10px] font-black uppercase tracking-widest w-full focus:border-primary-500/50 transition-all outline-none text-white placeholder:text-surface-800"/></div> <div class="flex items-center gap-8"><div class="flex items-center gap-6 pr-8 border-r border-surface-900"><button class="relative p-2.5 text-surface-500 hover:text-white transition-all hover:scale-110">`);
  Bell($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----> <span class="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-surface-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span></button> <button class="p-2.5 text-surface-500 hover:text-white transition-all hover:scale-110">`);
  Settings($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button></div> <div class="flex items-center gap-4"><div class="text-right hidden xl:block"><p class="text-[10px] font-black text-white uppercase leading-none">Status: Online</p> <p class="text-[8px] font-black text-primary-500 uppercase tracking-widest mt-1">HIVE NETWORK</p></div> <div class="w-10 h-10 bg-surface-900 border border-surface-800 rounded-xl flex items-center justify-center">`);
  Zap($$payload, { class: "w-5 h-5 text-yellow-400 fill-yellow-400/10" });
  $$payload.out.push(`<!----></div></div></div></header> <div class="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth no-scrollbar svelte-yan7o"><div class="max-w-screen-2xl mx-auto p-8 lg:p-12">`);
  children($$payload);
  $$payload.out.push(`<!----></div></div></main></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};
