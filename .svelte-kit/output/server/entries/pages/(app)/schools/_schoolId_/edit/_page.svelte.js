import { a as sanitize_props, b as spread_props, c as slot, i as head, l as attr, e as escape_html, j as attr_class, m as maybe_selected, d as bind_props, p as pop, f as push } from "../../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { S as School } from "../../../../../../chunks/school.js";
import { X } from "../../../../../../chunks/x.js";
import { S as Save } from "../../../../../../chunks/save.js";
import { I as Icon } from "../../../../../../chunks/Icon.js";
import { M as Map_pin } from "../../../../../../chunks/map-pin.js";
import { P as Phone } from "../../../../../../chunks/phone.js";
import { M as Mail } from "../../../../../../chunks/mail.js";
import { G as Globe } from "../../../../../../chunks/globe.js";
function Building($$payload, $$props) {
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
    ["path", { "d": "M12 10h.01" }],
    ["path", { "d": "M12 14h.01" }],
    ["path", { "d": "M12 6h.01" }],
    ["path", { "d": "M16 10h.01" }],
    ["path", { "d": "M16 14h.01" }],
    ["path", { "d": "M16 6h.01" }],
    ["path", { "d": "M8 10h.01" }],
    ["path", { "d": "M8 14h.01" }],
    ["path", { "d": "M8 6h.01" }],
    ["path", { "d": "M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" }],
    [
      "rect",
      { "x": "4", "y": "2", "width": "16", "height": "20", "rx": "2" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "building" },
    $$sanitized_props,
    {
      /**
       * @component @name Building
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTBoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xMiAxNGguMDEiIC8+CiAgPHBhdGggZD0iTTEyIDZoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xNiAxMGguMDEiIC8+CiAgPHBhdGggZD0iTTE2IDE0aC4wMSIgLz4KICA8cGF0aCBkPSJNMTYgNmguMDEiIC8+CiAgPHBhdGggZD0iTTggMTBoLjAxIiAvPgogIDxwYXRoIGQ9Ik04IDE0aC4wMSIgLz4KICA8cGF0aCBkPSJNOCA2aC4wMSIgLz4KICA8cGF0aCBkPSJNOSAyMnYtM2ExIDEgMCAwIDEgMS0xaDRhMSAxIDAgMCAxIDEgMXYzIiAvPgogIDxyZWN0IHg9IjQiIHk9IjIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIyMCIgcng9IjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/building
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
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let schoolData = data.school;
  let formData = {
    name: schoolData?.name || "",
    city: schoolData?.city || "",
    country: schoolData?.country || "ES",
    address: schoolData?.address || "",
    phone: schoolData?.phone || "",
    email: schoolData?.email || "",
    website: schoolData?.website || ""
  };
  let isSubmitting = false;
  let errors = {};
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Editar Centro - ${escape_html(schoolData?.name || "Centro")} | ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-slate-900 text-white"><div class="bg-slate-800 border-b border-slate-700"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between h-16"><div class="flex items-center space-x-4"><button class="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----> <span>Volver</span></button> <div class="h-6 w-px bg-slate-600"></div> <div class="flex items-center space-x-3">`);
  School($$payload, { class: "w-6 h-6 text-blue-400" });
  $$payload.out.push(`<!----> <div><h1 class="text-xl font-semibold">Editar Centro</h1> <p class="text-sm text-slate-400">Actualizar información del centro</p></div></div></div> <div class="flex items-center space-x-3"><button class="px-4 py-2 text-slate-300 hover:text-white transition-colors">`);
  X($$payload, { class: "w-4 h-4 mr-2 inline" });
  $$payload.out.push(`<!----> Cancelar</button> <button${attr("disabled", isSubmitting, true)} class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg transition-colors flex items-center space-x-2">`);
  Save($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> <span>${escape_html("Guardar Cambios")}</span></button></div></div></div></div> <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h2 class="text-xl font-semibold mb-6 flex items-center">`);
  Building($$payload, { class: "w-5 h-5 mr-2 text-blue-400" });
  $$payload.out.push(`<!----> Información del Centro</h2> <div class="space-y-6"><div><label for="name" class="block text-sm font-medium text-slate-300 mb-2">Nombre del Centro *</label> <input id="name" type="text"${attr("value", formData.name)}${attr_class(`input w-full ${errors.name ? "border-red-500" : ""}`, "svelte-1m545a")} placeholder="Ej: Escuela de Ajedrez Madrid Centro"/> `);
  if (errors.name) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.name)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="city" class="block text-sm font-medium text-slate-300 mb-2">Ciudad *</label> <input id="city" type="text"${attr("value", formData.city)}${attr_class(`input w-full ${errors.city ? "border-red-500" : ""}`, "svelte-1m545a")} placeholder="Ej: Madrid"/> `);
  if (errors.city) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.city)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div><label for="country" class="block text-sm font-medium text-slate-300 mb-2">País</label> <select id="country" class="input w-full svelte-1m545a">`);
  $$payload.select_value = formData.country;
  $$payload.out.push(`<option value="ES"${maybe_selected($$payload, "ES")}>España</option><option value="FR"${maybe_selected($$payload, "FR")}>Francia</option><option value="IT"${maybe_selected($$payload, "IT")}>Italia</option><option value="PT"${maybe_selected($$payload, "PT")}>Portugal</option><option value="DE"${maybe_selected($$payload, "DE")}>Alemania</option><option value="GB"${maybe_selected($$payload, "GB")}>Reino Unido</option><option value="US"${maybe_selected($$payload, "US")}>Estados Unidos</option><option value="MX"${maybe_selected($$payload, "MX")}>México</option><option value="AR"${maybe_selected($$payload, "AR")}>Argentina</option><option value="CO"${maybe_selected($$payload, "CO")}>Colombia</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div></div> <div><label for="address" class="block text-sm font-medium text-slate-300 mb-2">`);
  Map_pin($$payload, { class: "w-4 h-4 inline mr-1" });
  $$payload.out.push(`<!----> Dirección</label> <input id="address" type="text"${attr("value", formData.address)} class="input w-full svelte-1m545a" placeholder="Calle, número, piso, código postal"/></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="phone" class="block text-sm font-medium text-slate-300 mb-2">`);
  Phone($$payload, { class: "w-4 h-4 inline mr-1" });
  $$payload.out.push(`<!----> Teléfono</label> <input id="phone" type="tel"${attr("value", formData.phone)} class="input w-full svelte-1m545a" placeholder="Ej: +34 91 123 45 67"/></div> <div><label for="email" class="block text-sm font-medium text-slate-300 mb-2">`);
  Mail($$payload, { class: "w-4 h-4 inline mr-1" });
  $$payload.out.push(`<!----> Email</label> <input id="email" type="email"${attr("value", formData.email)}${attr_class(`input w-full ${errors.email ? "border-red-500" : ""}`, "svelte-1m545a")} placeholder="Ej: info@centro.com"/> `);
  if (errors.email) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.email)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div> <div><label for="website" class="block text-sm font-medium text-slate-300 mb-2">`);
  Globe($$payload, { class: "w-4 h-4 inline mr-1" });
  $$payload.out.push(`<!----> Sitio Web</label> <input id="website" type="url"${attr("value", formData.website)}${attr_class(`input w-full ${errors.website ? "border-red-500" : ""}`, "svelte-1m545a")} placeholder="https://www.tu-centro.com"/> `);
  if (errors.website) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.website)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div></div></div></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
