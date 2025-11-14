import { a as sanitize_props, b as spread_props, c as slot, k as ensure_array_like, w as store_get, j as attr_class, h as stringify, e as escape_html, x as unsubscribe_stores, p as pop, f as push } from "../../chunks/index2.js";
import { w as writable } from "../../chunks/index.js";
import { X } from "../../chunks/x.js";
import { I as Icon } from "../../chunks/Icon.js";
import { T as Triangle_alert } from "../../chunks/triangle-alert.js";
import { C as Circle_x } from "../../chunks/circle-x.js";
import { C as Circle_check_big } from "../../chunks/circle-check-big.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "../../chunks/state.svelte.js";
const toasts = writable([]);
function Info($$payload, $$props) {
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
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "M12 16v-4" }],
    ["path", { "d": "M12 8h.01" }]
  ];
  Icon($$payload, spread_props([
    { name: "info" },
    $$sanitized_props,
    {
      /**
       * @component @name Info
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMTZ2LTQiIC8+CiAgPHBhdGggZD0iTTEyIDhoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/info
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
function Toast($$payload, $$props) {
  push();
  var $$store_subs;
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return Circle_check_big;
      case "error":
        return Circle_x;
      case "warning":
        return Triangle_alert;
      case "info":
        return Info;
      default:
        return Info;
    }
  };
  const getColorClasses = (type) => {
    switch (type) {
      case "success":
        return "bg-green-600 border-green-500";
      case "error":
        return "bg-red-600 border-red-500";
      case "warning":
        return "bg-yellow-600 border-yellow-500";
      case "info":
        return "bg-blue-600 border-blue-500";
      default:
        return "bg-slate-600 border-slate-500";
    }
  };
  const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts));
  $$payload.out.push(`<div class="fixed top-4 right-4 z-50 space-y-2"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let toast = each_array[$$index];
    $$payload.out.push(`<div${attr_class(`flex items-center gap-3 p-4 rounded-lg border shadow-lg text-white min-w-80 max-w-96 transform transition-all duration-300 ease-in-out ${stringify(getColorClasses(toast.type))}`)} role="alert" aria-live="polite"><!---->`);
    getIcon(toast.type)?.($$payload, { class: "w-5 h-5 flex-shrink-0" });
    $$payload.out.push(`<!----> <span class="flex-1 text-sm font-medium">${escape_html(toast.message)}</span> <button class="flex-shrink-0 p-1 rounded-full hover:bg-black/20 transition-colors" aria-label="Cerrar notificación">`);
    X($$payload, { class: "w-4 h-4" });
    $$payload.out.push(`<!----></button></div>`);
  }
  $$payload.out.push(`<!--]--></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function CookieBanner($$payload, $$props) {
  push();
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  pop();
}
function _layout($$payload, $$props) {
  console.log("🔄 Layout mounted - Auth store DISABLED, using server-side auth only");
  $$payload.out.push(`<main class="min-h-screen bg-slate-900 text-slate-100"><!---->`);
  slot($$payload, $$props, "default", {});
  $$payload.out.push(`<!----> `);
  Toast($$payload);
  $$payload.out.push(`<!----> `);
  CookieBanner($$payload);
  $$payload.out.push(`<!----> `);
  $$payload.out.push(`<!----></main>`);
}
export {
  _layout as default
};
