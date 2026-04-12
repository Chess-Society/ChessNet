import { d as sanitize_props, f as spread_props, g as slot, h as head, i as attr, a as attr_class, c as escape_html, j as derived } from "../../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/root.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { X } from "../../../../../../chunks/x.js";
import { S as Save } from "../../../../../../chunks/save.js";
import { I as Icon } from "../../../../../../chunks/Icon.js";
import { M as Map_pin } from "../../../../../../chunks/map-pin.js";
import { P as Phone } from "../../../../../../chunks/phone.js";
import { M as Mail } from "../../../../../../chunks/mail.js";
import { C as Check } from "../../../../../../chunks/check.js";
function Building($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
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
  Icon($$renderer, spread_props([
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
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Globe($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    [
      "path",
      { "d": "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }
    ],
    ["path", { "d": "M2 12h20" }]
  ];
  Icon($$renderer, spread_props([
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
    let { data } = $$props;
    const schoolData = derived(() => data.school);
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
    head("4o751b", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Editar ${escape_html(schoolData()?.name || "Centro")} - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="space-y-4"><button class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest">`);
    Arrow_left($$renderer2, {
      class: "w-4 h-4 transition-transform group-hover:-translate-x-1"
    });
    $$renderer2.push(`<!----> Regresar al Centro</button> <div class="flex items-center gap-6"><div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400">`);
    Edit($$renderer2, { class: "w-8 h-8" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-black text-white tracking-tighter uppercase">Configuración de Sede</h1> <p class="text-surface-500 text-sm font-medium">Personaliza los detalles y contacto de tu institución.</p></div></div></div> <div class="flex items-center gap-3"><button class="btn-ghost flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"${attr("disabled", isSubmitting, true)}>`);
    X($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Descartar</button> <button${attr("disabled", isSubmitting, true)} class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-3">`);
    {
      $$renderer2.push("<!--[-1-->");
      Save($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> <span>Guardar Cambios</span>`);
    }
    $$renderer2.push(`<!--]--></button></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-10"><div class="lg:col-span-2 space-y-8"><section class="glass-panel p-8 space-y-8 border-t-4 border-primary-500"><h2 class="text-white font-black uppercase tracking-tight flex items-center gap-3">`);
    Building($$renderer2, { class: "w-5 h-5 text-primary-400" });
    $$renderer2.push(`<!----> Información Básica</h2> <div class="space-y-6"><div class="space-y-2"><label for="name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre Oficial</label> <input id="name" type="text"${attr("value", formData.name)}${attr_class(`w-full bg-surface-950 border rounded-xl px-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all ${errors.name ? "border-red-500" : "border-surface-800"}`)} placeholder="Ej: Colegio San Ramón y San Antonio"/> `);
    if (errors.name) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-500 text-[10px] font-bold uppercase tracking-widest">${escape_html(errors.name)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label for="city" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Ciudad</label> <input id="city" type="text"${attr("value", formData.city)}${attr_class(`w-full bg-surface-950 border rounded-xl px-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all ${errors.city ? "border-red-500" : "border-surface-800"}`)} placeholder="Ej: Madrid"/></div> <div class="space-y-2"><label for="country" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">País</label> `);
    $$renderer2.select(
      {
        value: formData.country,
        class: "w-full bg-surface-950 border border-surface-800 rounded-xl px-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all cursor-pointer font-bold"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "ES" }, ($$renderer4) => {
          $$renderer4.push(`ESPAÑA`);
        });
        $$renderer3.option({ value: "MX" }, ($$renderer4) => {
          $$renderer4.push(`MÉXICO`);
        });
        $$renderer3.option({ value: "AR" }, ($$renderer4) => {
          $$renderer4.push(`ARGENTINA`);
        });
        $$renderer3.option({ value: "CO" }, ($$renderer4) => {
          $$renderer4.push(`COLOMBIA`);
        });
        $$renderer3.option({ value: "US" }, ($$renderer4) => {
          $$renderer4.push(`ESTADOS UNIDOS`);
        });
      }
    );
    $$renderer2.push(`</div></div> <div class="space-y-2"><label for="address" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Dirección Postal</label> <div class="relative group">`);
    Map_pin($$renderer2, {
      class: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-700 group-focus-within:text-primary-400 transition-colors"
    });
    $$renderer2.push(`<!----> <input id="address" type="text"${attr("value", formData.address)} class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all placeholder:text-surface-700" placeholder="Calle Fantasía 123, 28001"/></div></div></div></section> <section class="glass-panel p-8 space-y-8 border-t-4 border-blue-500"><h2 class="text-white font-black uppercase tracking-tight flex items-center gap-3">`);
    Globe($$renderer2, { class: "w-5 h-5 text-blue-400" });
    $$renderer2.push(`<!----> Canales de Contacto</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label for="phone" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Teléfono</label> <div class="relative group">`);
    Phone($$renderer2, {
      class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700"
    });
    $$renderer2.push(`<!----> <input id="phone" type="tel"${attr("value", formData.phone)} class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all" placeholder="+34 000 000 000"/></div></div> <div class="space-y-2"><label for="email" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Email Profesional</label> <div class="relative group">`);
    Mail($$renderer2, {
      class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700"
    });
    $$renderer2.push(`<!----> <input id="email" type="email"${attr("value", formData.email)}${attr_class(`w-full bg-surface-950 border rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all ${errors.email ? "border-red-500" : "border-surface-800"}`)} placeholder="hola@academia.com"/></div></div></div> <div class="space-y-2"><label for="website" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Sitio Web</label> <input id="website" type="url"${attr("value", formData.website)}${attr_class(`w-full bg-surface-950 border rounded-xl px-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all ${errors.website ? "border-red-500" : "border-surface-800"}`)} placeholder="https://www.tu-academia.com"/></div></section></div> <div class="space-y-8"><div class="glass-panel p-8 space-y-6"><div class="flex items-center gap-3 pb-4 border-b border-surface-900"><div class="p-2 bg-primary-500/10 rounded-xl text-primary-400">`);
    Check($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></div> <h3 class="text-xs font-black text-white uppercase tracking-widest">Estado de Perfil</h3></div> <div class="space-y-4"><div class="flex items-center justify-between"><span class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Identificador</span> <span class="text-[10px] font-bold text-white font-mono bg-surface-950 px-2 py-0.5 rounded border border-surface-900">${escape_html(schoolData()?.id.split("-")[0])}</span></div> <div class="flex items-center justify-between"><span class="text-[10px] font-black text-surface-500 uppercase tracking-widest">Actualizado</span> <span class="text-[10px] font-bold text-white uppercase tracking-widest">Hoy</span></div></div></div> <div class="p-8 border-2 border-primary-500/20 rounded-3xl bg-primary-500/5 space-y-4"><h3 class="text-xs font-black text-primary-400 uppercase tracking-widest">Nota Maestro</h3> <p class="text-xs text-surface-400 leading-relaxed font-bold">Mantener la información de contacto actualizada ayuda a que los reportes PDF automáticos se generen con el membrete correcto para cada centro.</p></div></div></div></div>`);
  });
}
export {
  _page as default
};
