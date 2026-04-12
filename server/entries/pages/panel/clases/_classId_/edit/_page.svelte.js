import { d as sanitize_props, f as spread_props, g as slot, h as head, c as escape_html, i as attr, a as attr_class, e as ensure_array_like, j as derived } from "../../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/root.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { I as Icon } from "../../../../../../chunks/Icon.js";
import { X } from "../../../../../../chunks/x.js";
import { S as Save } from "../../../../../../chunks/save.js";
import { B as Book_open } from "../../../../../../chunks/book-open.js";
import { C as Clock } from "../../../../../../chunks/clock.js";
import { U as Users } from "../../../../../../chunks/users.js";
import { T as Triangle_alert } from "../../../../../../chunks/triangle-alert.js";
import { R as Rotate_ccw } from "../../../../../../chunks/rotate-ccw.js";
function Pen_line($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M13 21h8" }],
    [
      "path",
      {
        "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "pen-line" },
    $$sanitized_props,
    {
      /**
       * @component @name PenLine
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTMgMjFoOCIgLz4KICA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/pen-line
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
    let classData = derived(() => data.class);
    let schools = derived(() => data.schools || []);
    let formData = {
      name: "",
      description: "",
      college_id: "",
      schedule: "",
      max_students: 12,
      level: "beginner"
    };
    let isSubmitting = false;
    let errors = {};
    const levelOptions = [
      { value: "beginner", label: "PRINCIPIANTE" },
      { value: "intermediate", label: "INTERMEDIO" },
      { value: "advanced", label: "AVANZADO" },
      { value: "mixed", label: "MIXTO" }
    ];
    head("ltty3s", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Editar ${escape_html(classData()?.name)} - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="space-y-4"><button class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest">`);
    Arrow_left($$renderer2, {
      class: "w-4 h-4 transition-transform group-hover:-translate-x-1"
    });
    $$renderer2.push(`<!----> Regresar a Clase</button> <div class="flex items-center gap-6"><div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">`);
    Pen_line($$renderer2, { class: "w-8 h-8" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-black text-white tracking-tighter uppercase">Editar Grupo</h1> <p class="text-surface-500 text-sm font-medium uppercase tracking-widest">Ajustando detalles de ${escape_html(classData()?.name)}</p></div></div></div> <div class="flex items-center gap-3"><button class="btn-ghost flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"${attr("disabled", isSubmitting, true)}>`);
    X($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Descartar</button> <button${attr("disabled", isSubmitting, true)} class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-3">`);
    {
      $$renderer2.push("<!--[-1-->");
      Save($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> <span>Guardar Cambios</span>`);
    }
    $$renderer2.push(`<!--]--></button></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-10"><div class="lg:col-span-2 space-y-8"><section class="glass-panel p-8 space-y-8 border-t-4 border-primary-500"><h2 class="text-white font-black uppercase tracking-tight flex items-center gap-3">`);
    Book_open($$renderer2, { class: "w-5 h-5 text-primary-400" });
    $$renderer2.push(`<!----> Información Curricular</h2> <div class="space-y-6"><div class="space-y-2"><label for="name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre del Grupo</label> <input id="name" type="text"${attr("value", formData.name)}${attr_class(`w-full bg-surface-950 border rounded-xl px-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all ${errors.name ? "border-red-500" : "border-surface-800"}`)}/></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label for="college" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Centro Educativo</label> `);
    $$renderer2.select(
      {
        id: "college",
        value: formData.college_id,
        class: "w-full bg-surface-950 border border-surface-800 rounded-xl px-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all cursor-pointer"
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(schools());
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let s = each_array[$$index];
          $$renderer3.option({ value: s.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(s.name.toUpperCase())}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div class="space-y-2"><label for="level" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nivel Recomendado</label> `);
    $$renderer2.select(
      {
        id: "level",
        value: formData.level,
        class: "w-full bg-surface-950 border border-surface-800 rounded-xl px-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all cursor-pointer"
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(levelOptions);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let opt = each_array_1[$$index_1];
          $$renderer3.option({ value: opt.value }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(opt.label)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div></div> <div class="space-y-2"><label for="desc" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Descripción del Enfoque</label> <textarea id="desc" rows="3" class="w-full bg-surface-950 border border-surface-800 rounded-xl px-5 py-4 text-white font-medium focus:border-primary-500/50 outline-none transition-all resize-none" placeholder="Ej: Orientado a la táctica básica y finales elementales...">`);
    const $$body = escape_html(formData.description);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div></div></section> <section class="glass-panel p-8 space-y-8 border-t-4 border-blue-500"><h2 class="text-white font-black uppercase tracking-tight flex items-center gap-3">`);
    Clock($$renderer2, { class: "w-5 h-5 text-blue-400" });
    $$renderer2.push(`<!----> Logística y Horarios</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div class="space-y-2"><label for="schedule" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Horario de Sesiones</label> <div class="relative group">`);
    Clock($$renderer2, {
      class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700"
    });
    $$renderer2.push(`<!----> <input id="schedule" type="text"${attr("value", formData.schedule)} class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all" placeholder="Ej: Martes 17:00 - 18:30"/></div></div> <div class="space-y-2"><label for="max" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Capacidad Máxima (Alumnos)</label> <div class="relative group">`);
    Users($$renderer2, {
      class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700"
    });
    $$renderer2.push(`<!----> <input id="max" type="number"${attr("value", formData.max_students)} class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all"/></div></div></div></section></div> <div class="space-y-8"><div class="glass-panel p-8 space-y-6"><h3 class="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">`);
    Triangle_alert($$renderer2, { class: "w-4 h-4 text-primary-400" });
    $$renderer2.push(`<!----> Consideraciones</h3> <ul class="space-y-4"><li class="flex gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></div> <p class="text-[10px] text-surface-400 font-bold uppercase tracking-wider leading-relaxed">Cambiar el nivel actualizará los objetivos sugeridos para el grupo.</p></li> <li class="flex gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></div> <p class="text-[10px] text-surface-400 font-bold uppercase tracking-wider leading-relaxed">La capacidad afecta al cálculo de ingresos estimados del centro.</p></li></ul></div> <div class="p-8 border-2 border-primary-500/20 rounded-3xl bg-primary-500/5 space-y-4"><div class="flex items-center gap-4 text-primary-400 mb-2">`);
    Rotate_ccw($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----> <h3 class="text-xs font-black uppercase tracking-widest">Historial</h3></div> <p class="text-[10px] text-surface-500 font-bold uppercase leading-relaxed">Puedes revertir cambios si no has guardado todavía. Una vez guardados, los reportes se generarán con la nueva información.</p></div></div></div></div>`);
  });
}
export {
  _page as default
};
