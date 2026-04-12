import { d as sanitize_props, f as spread_props, g as slot, h as head, c as escape_html, a as attr_class, i as attr, e as ensure_array_like, j as derived } from "../../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/root.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { U as User_check } from "../../../../../../chunks/user-check.js";
import { Z as Zap } from "../../../../../../chunks/zap.js";
import { I as Icon } from "../../../../../../chunks/Icon.js";
import { C as Chart_column } from "../../../../../../chunks/chart-column.js";
import { C as Calendar } from "../../../../../../chunks/calendar.js";
import { C as Circle_check_big } from "../../../../../../chunks/circle-check-big.js";
import { S as Save } from "../../../../../../chunks/save.js";
import { C as Circle_x } from "../../../../../../chunks/circle-x.js";
import { C as Clock } from "../../../../../../chunks/clock.js";
function History($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }
    ],
    ["path", { "d": "M3 3v5h5" }],
    ["path", { "d": "M12 7v5l4 2" }]
  ];
  Icon($$renderer, spread_props([
    { name: "history" },
    $$sanitized_props,
    {
      /**
       * @component @name History
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAxIDAgOS05IDkuNzUgOS43NSAwIDAgMC02Ljc0IDIuNzRMMyA4IiAvPgogIDxwYXRoIGQ9Ik0zIDN2NWg1IiAvPgogIDxwYXRoIGQ9Ik0xMiA3djVsNCAyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/history
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
    const classData = derived(() => data.class);
    const students = derived(() => data.students || []);
    let selectedDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    let currentAttendance = {};
    let isSubmitting = false;
    const statusThemes = {
      P: {
        icon: Circle_check_big,
        label: "PRESENTE",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
      },
      T: {
        icon: Clock,
        label: "TARDE",
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20"
      },
      A: {
        icon: Circle_x,
        label: "AUSENTE",
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20"
      }
    };
    head("9b3y7", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Asistencia - ${escape_html(classData()?.name)} - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-10 animate-fade-in pb-20"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="space-y-4"><button class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest">`);
    Arrow_left($$renderer2, {
      class: "w-4 h-4 transition-transform group-hover:-translate-x-1"
    });
    $$renderer2.push(`<!----> Regresar a Clase</button> <div class="flex items-center gap-6"><div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">`);
    User_check($$renderer2, { class: "w-8 h-8" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-black text-white tracking-tighter uppercase">Asistencia</h1> <p class="text-surface-500 text-sm font-medium uppercase tracking-widest">${escape_html(classData()?.name)} • ${escape_html(classData()?.schedule)}</p></div></div></div> <div class="flex items-center gap-1 bg-surface-950/50 p-1.5 rounded-2xl border border-surface-900 w-fit backdrop-blur-xl"><button${attr_class(`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${"bg-primary-500 text-black shadow-lg shadow-primary-500/20"}`)}>`);
    Zap($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----> Pasar Lista</button> <button${attr_class(`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${"text-surface-500 hover:text-white"}`)}>`);
    History($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----> Historial</button> <button${attr_class(`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${"text-surface-500 hover:text-white"}`)}>`);
    Chart_column($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----> Estadísticas</button></div></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="space-y-8"><div class="glass-panel p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t-4 border-primary-500 shadow-2xl"><div class="flex items-center gap-4"><div class="p-3 bg-surface-950 rounded-2xl border border-surface-900">`);
      Calendar($$renderer2, { class: "w-5 h-5 text-primary-400" });
      $$renderer2.push(`<!----></div> <div><p class="text-[10px] font-black text-surface-500 uppercase tracking-widest mb-1">Fecha de Sesión</p> <input type="date"${attr("value", selectedDate)} class="bg-transparent text-white font-black uppercase tracking-tighter outline-none cursor-pointer"/></div></div> <div class="flex items-center gap-3"><button class="bg-surface-950 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-surface-800 hover:border-emerald-500/50 transition-all flex items-center gap-2">`);
      Circle_check_big($$renderer2, { class: "w-4 h-4 text-emerald-400" });
      $$renderer2.push(`<!----> Todo OK</button> <button${attr("disabled", isSubmitting, true)} class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg flex items-center gap-3">`);
      {
        $$renderer2.push("<!--[-1-->");
        Save($$renderer2, { class: "w-4 h-4" });
      }
      $$renderer2.push(`<!--]--> Finalizar Registro</button></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><!--[-->`);
      const each_array = ensure_array_like(students());
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let student = each_array[$$index_1];
        $$renderer2.push(`<div class="glass-panel p-6 flex items-center justify-between group hover:border-surface-700 transition-all relative overflow-hidden"><div class="flex items-center gap-5 relative z-10"><div class="w-14 h-14 bg-surface-950 rounded-2xl border border-surface-800 flex items-center justify-center text-primary-400 font-black text-lg group-hover:border-primary-500/50 transition-colors">${escape_html(student.name.charAt(0))}</div> <div><h3 class="text-white font-black uppercase text-sm leading-tight group-hover:text-primary-400 transition-colors">${escape_html(student.name)}</h3> <div class="flex items-center gap-2 mt-1"><span class="text-[9px] font-black text-surface-600 uppercase tracking-widest">${escape_html(student.age)} años</span> <span class="w-1 h-1 rounded-full bg-surface-800"></span> <span class="text-[9px] font-black text-surface-600 uppercase tracking-widest">${escape_html(student.level)}</span></div></div></div> <div class="flex items-center gap-3 relative z-10"><div class="flex bg-surface-950 p-1.5 rounded-2xl border border-surface-900 gap-1"><!--[-->`);
        const each_array_1 = ensure_array_like(Object.entries(statusThemes));
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let [status, theme] = each_array_1[$$index];
          $$renderer2.push(`<button${attr_class(`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${currentAttendance[student.id]?.status === status ? `${theme.bg} ${theme.color} ${theme.border} shadow-lg scale-110` : "text-surface-700 hover:text-surface-400"}`)}${attr("title", theme.label)}>`);
          if (theme.icon) {
            $$renderer2.push("<!--[-->");
            theme.icon($$renderer2, { class: "w-5 h-5" });
            $$renderer2.push("<!--]-->");
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push("<!--]-->");
          }
          $$renderer2.push(`</button>`);
        }
        $$renderer2.push(`<!--]--></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
