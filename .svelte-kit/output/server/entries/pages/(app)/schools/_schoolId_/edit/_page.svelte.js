import { a as sanitize_props, b as spread_props, c as slot, h as head, i as attr, f as attr_class, d as escape_html, m as maybe_selected, p as pop, k as push } from "../../../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { X } from "../../../../../../chunks/x.js";
import { S as Save } from "../../../../../../chunks/save.js";
import { I as Icon } from "../../../../../../chunks/Icon.js";
import { M as Map_pin } from "../../../../../../chunks/map-pin.js";
import { P as Phone } from "../../../../../../chunks/phone.js";
import { M as Mail } from "../../../../../../chunks/mail.js";
import { C as Check } from "../../../../../../chunks/check.js";
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
function Globe($$payload, $$props) {
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
    [
      "path",
      { "d": "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }
    ],
    ["path", { "d": "M2 12h20" }]
  ];
  Icon($$payload, spread_props([
    { name: "globe" },
    $$sanitized_props,
    {
      /**
       * @component @name Globe
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMmExNC41IDE0LjUgMCAwIDAgMCAyMCAxNC41IDE0LjUgMCAwIDAgMC0yMCIgLz4KICA8cGF0aCBkPSJNMiAxMmgyMCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/globe
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
  let { data } = $$props;
  const schoolData = data.school;
  let formData = {
    name: "",
    city: "",
    country: "ES",
    address: "",
    phone: "",
    email: "",
    website: ""
  };
  let isSubmitting = false;
  let errors = {};
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Editar ${escape_html(schoolData?.name || "Centro")} - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="space-y-4"><button class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest">`);
  Arrow_left($$payload, {
    class: "w-4 h-4 transition-transform group-hover:-translate-x-1"
  });
  $$payload.out.push(`<!----> Regresar al Centro</button> <div class="flex items-center gap-6"><div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400">`);
  Edit($$payload, { class: "w-8 h-8" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-3xl font-black text-white tracking-tighter uppercase">Configuración de Sede</h1> <p class="text-surface-500 text-sm font-medium">Personaliza los detalles y contacto de tu institución.</p></div></div></div> <div class="flex items-center gap-3"><button class="btn-ghost flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"${attr("disabled", isSubmitting, true)}>`);
  X($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> Descartar</button> <button${attr("disabled", isSubmitting, true)} class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-3">`);
  {
    $$payload.out.push("<!--[!-->");
    Save($$payload, { class: "w-4 h-4" });
    $$payload.out.push(`<!----> <span>Guardar Cambios</span>`);
  }
  $$payload.out.push(`<!--]--></button></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-10"><div class="lg:col-span-2 space-y-8"><section class="glass-panel p-8 space-y-8 border-t-4 border-primary-500"><h2 class="text-white font-black uppercase tracking-tight flex items-center gap-3">`);
  Building($$payload, { class: "w-5 h-5 text-primary-400" });
  $$payload.out.push(`<!----> Información Básica</h2> <div class="space-y-6"><div class="space-y-2"><label for="name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre Oficial</label> <input id="name" type="text"${attr("value", formData.name)}${attr_class(`w-full bg-surface-950 border rounded-xl px-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all ${errors.name ? "border-red-500" : "border-surface-800"}`)} placeholder="Ej: Colegio San Ramón y San Antonio"/> `);
  if (errors.name) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-500 text-[10px] font-bold uppercase tracking-widest">${escape_html(errors.name)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label for="city" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Ciudad</label> <input id="city" type="text"${attr("value", formData.city)}${attr_class(`w-full bg-surface-950 border rounded-xl px-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all ${errors.city ? "border-red-500" : "border-surface-800"}`)} placeholder="Ej: Madrid"/></div> <div class="space-y-2"><label for="country" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">País</label> <select class="w-full bg-surface-950 border border-surface-800 rounded-xl px-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all cursor-pointer font-bold">`);
  $$payload.select_value = formData.country;
  $$payload.out.push(`<option value="ES"${maybe_selected($$payload, "ES")}>ESPAÑA</option><option value="MX"${maybe_selected($$payload, "MX")}>MÉXICO</option><option value="AR"${maybe_selected($$payload, "AR")}>ARGENTINA</option><option value="CO"${maybe_selected($$payload, "CO")}>COLOMBIA</option><option value="US"${maybe_selected($$payload, "US")}>ESTADOS UNIDOS</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div></div> <div class="space-y-2"><label for="address" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Dirección Postal</label> <div class="relative group">`);
  Map_pin($$payload, {
    class: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-700 group-focus-within:text-primary-400 transition-colors"
  });
  $$payload.out.push(`<!----> <input id="address" type="text"${attr("value", formData.address)} class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all placeholder:text-surface-700" placeholder="Calle Fantasía 123, 28001"/></div></div></div></section> <section class="glass-panel p-8 space-y-8 border-t-4 border-blue-500"><h2 class="text-white font-black uppercase tracking-tight flex items-center gap-3">`);
  Globe($$payload, { class: "w-5 h-5 text-blue-400" });
  $$payload.out.push(`<!----> Canales de Contacto</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label for="phone" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Teléfono</label> <div class="relative group">`);
  Phone($$payload, {
    class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700"
  });
  $$payload.out.push(`<!----> <input id="phone" type="tel"${attr("value", formData.phone)} class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all" placeholder="+34 000 000 000"/></div></div> <div class="space-y-2"><label for="email" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Email Profesional</label> <div class="relative group">`);
  Mail($$payload, {
    class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700"
  });
  $$payload.out.push(`<!----> <input id="email" type="email"${attr("value", formData.email)}${attr_class(`w-full bg-surface-950 border rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all ${errors.email ? "border-red-500" : "border-surface-800"}`)} placeholder="hola@academia.com"/></div></div></div> <div class="space-y-2"><label for="website" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Sitio Web</label> <input id="website" type="url"${attr("value", formData.website)}${attr_class(`w-full bg-surface-950 border rounded-xl px-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all ${errors.website ? "border-red-500" : "border-surface-800"}`)} placeholder="https://www.tu-academia.com"/></div></section></div> <div class="space-y-8"><div class="glass-panel p-8 space-y-6"><div class="flex items-center gap-3 pb-4 border-b border-surface-900"><div class="p-2 bg-primary-500/10 rounded-xl text-primary-400">`);
  Check($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></div> <h3 class="text-xs font-black text-white uppercase tracking-widest">Estado de Perfil</h3></div> <div class="space-y-4"><div class="flex items-center justify-between"><span class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Identificador</span> <span class="text-[10px] font-bold text-white font-mono bg-surface-950 px-2 py-0.5 rounded border border-surface-900">${escape_html(schoolData?.id.split("-")[0])}</span></div> <div class="flex items-center justify-between"><span class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Actualizado</span> <span class="text-[10px] font-bold text-white uppercase tracking-widest">Hoy</span></div></div></div> <div class="p-8 border-2 border-primary-500/20 rounded-3xl bg-primary-500/5 space-y-4"><h3 class="text-xs font-black text-primary-400 uppercase tracking-widest">Nota Maestro</h3> <p class="text-xs text-surface-400 leading-relaxed font-bold">Mantener la información de contacto actualizada ayuda a que los reportes PDF automáticos se generen con el membrete correcto para cada centro.</p></div></div></div></div>`);
  pop();
}
export {
  _page as default
};
