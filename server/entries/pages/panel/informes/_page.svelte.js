import { d as sanitize_props, f as spread_props, g as slot, h as head, e as ensure_array_like, c as escape_html, al as attr_style, b as stringify, j as derived, s as store_get, u as unsubscribe_stores } from "../../../../chunks/renderer.js";
import { a as appStore } from "../../../../chunks/appStore.js";
import { C as Chart_column } from "../../../../chunks/chart-column.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { T as Trending_up } from "../../../../chunks/trending-up.js";
import { A as Arrow_up_right } from "../../../../chunks/arrow-up-right.js";
import { U as Users } from "../../../../chunks/users.js";
function Chart_pie($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"
      }
    ],
    ["path", { "d": "M21.21 15.89A10 10 0 1 1 8 2.83" }]
  ];
  Icon($$renderer, spread_props([
    { name: "chart-pie" },
    $$sanitized_props,
    {
      /**
       * @component @name ChartPie
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTJjLjU1MiAwIDEuMDA1LS40NDkuOTUtLjk5OGExMCAxMCAwIDAgMC04Ljk1My04Ljk1MWMtLjU1LS4wNTUtLjk5OC4zOTgtLjk5OC45NXY4YTEgMSAwIDAgMCAxIDF6IiAvPgogIDxwYXRoIGQ9Ik0yMS4yMSAxNS44OUExMCAxMCAwIDEgMSA4IDIuODMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/chart-pie
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
    let students = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).students || []);
    let centers = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).centers || []);
    const stats = derived(() => () => {
      const totalStudents = students().length;
      const totalCenters = centers().length;
      const levels = {};
      students().forEach((s) => {
        const level = s.level || "Sin nivel";
        levels[level] = (levels[level] || 0) + 1;
      });
      return { totalStudents, totalCenters, levels };
    });
    const studentsPerCenter = derived(() => () => {
      return centers().map((c) => ({
        name: c.name,
        count: students().filter((s) => s.centerId === c.id).length
      })).sort((a, b) => b.count - a.count);
    });
    head("lk79vj", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Informes y Estadísticas - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6"><div class="space-y-4"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-500">`);
    Chart_column($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-bold text-white tracking-tight">Informes Avanzados</h1> <p class="text-slate-400 text-sm">Analiza el crecimiento y el rendimiento métrico de tu comunidad.</p></div></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10"><div class="lg:col-span-1 space-y-6"><div class="bg-[#1e293b] p-6 rounded-3xl border border-slate-800"><h3 class="text-white font-bold mb-6 flex items-center gap-2">`);
    Chart_pie($$renderer2, { class: "w-5 h-5 text-cyan-500" });
    $$renderer2.push(`<!----> Distribución por Nivel</h3> <div class="space-y-4"><!--[-->`);
    const each_array = ensure_array_like(Object.entries(stats()().levels));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let [level, count] = each_array[$$index];
      $$renderer2.push(`<div class="space-y-1.5"><div class="flex justify-between text-xs font-bold uppercase tracking-widest"><span class="text-slate-400">${escape_html(level)}</span> <span class="text-white">${escape_html(count)} (${escape_html(Math.round(count / stats()().totalStudents * 100))}%)</span></div> <div class="h-2 bg-slate-900 rounded-full overflow-hidden"><div class="h-full bg-cyan-500 transition-all duration-1000"${attr_style(`width: ${stringify(count / stats()().totalStudents * 100)}%`)}></div></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (Object.keys(stats()().levels).length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-center text-slate-500 text-sm py-4">Sin datos de niveles.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 p-8 rounded-3xl border border-cyan-500/20 text-center">`);
    Trending_up($$renderer2, { class: "w-12 h-12 text-cyan-400 mx-auto mb-4" });
    $$renderer2.push(`<!----> <h4 class="text-white font-black text-xl mb-1">Crecimiento Mensual</h4> <p class="text-cyan-200 text-sm mb-6">Tu academia ha crecido un 8% respecto al trimestre anterior.</p> <div class="flex items-center justify-center gap-2 text-2xl font-black text-white">`);
    Arrow_up_right($$renderer2, { class: "w-6 h-6 text-emerald-500" });
    $$renderer2.push(`<!----> +${escape_html(Math.round(stats()().totalStudents * 0.08))} Alumnos</div></div></div> <div class="lg:col-span-2 bg-[#1e293b] p-8 rounded-3xl border border-slate-800"><div class="flex justify-between items-center mb-8"><h3 class="text-white font-bold flex items-center gap-2 text-lg">`);
    Users($$renderer2, { class: "w-6 h-6 text-indigo-500" });
    $$renderer2.push(`<!----> Alumnos por Centro</h3></div> <div class="space-y-8">`);
    if (studentsPerCenter()().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="h-64 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-500 italic">No hay datos suficientes para generar el desglose.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<!--[-->`);
      const each_array_1 = ensure_array_like(studentsPerCenter()());
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let center = each_array_1[$$index_1];
        $$renderer2.push(`<div class="group"><div class="flex justify-between items-end mb-2"><div><p class="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">${escape_html(center.name)}</p> <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">${escape_html(center.count)} Alumnos activos</p></div> <span class="text-xl font-black text-slate-800 group-hover:text-indigo-900/40 transition-colors">${escape_html(Math.round(center.count / stats()().totalStudents * 100))}%</span></div> <div class="h-4 bg-slate-900 rounded-xl overflow-hidden p-1"><div class="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg transition-all duration-1000 shadow-lg shadow-indigo-500/20"${attr_style(`width: ${stringify(center.count / stats()().totalStudents * 100)}%`)}></div></div></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> <div class="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 gap-8"><div><p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Promedio Asistencia</p> <p class="text-3xl font-black text-white">92%</p></div> <div><p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Satisfacción (NPS)</p> <p class="text-3xl font-black text-emerald-400">4.9/5</p></div></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
