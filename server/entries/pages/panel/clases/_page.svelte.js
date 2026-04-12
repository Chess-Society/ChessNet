import { h as head, i as attr, e as ensure_array_like, c as escape_html, j as derived, s as store_get, u as unsubscribe_stores } from "../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { a as appStore } from "../../../../chunks/appStore.js";
import { G as Graduation_cap } from "../../../../chunks/graduation-cap.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { S as Search } from "../../../../chunks/search.js";
import { S as Square_pen } from "../../../../chunks/square-pen.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { U as Users } from "../../../../chunks/users.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let searchQuery = "";
    let classes = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).classes || []);
    let centers = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).centers || []);
    const filteredClasses = derived(() => () => {
      return classes().filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    const getCenterName = (id) => {
      return centers().find((c) => c.id === id)?.name || "Sin centro";
    };
    head("1ouzlwp", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Gestión de Clases - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6"><div class="space-y-4"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-500">`);
    Graduation_cap($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-bold text-white tracking-tight">Clases y Grupos</h1> <p class="text-slate-400 text-sm">Gestiona tus horarios y la organización de tus grupos de ajedrez.</p></div></div></div> <button class="bg-purple-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/20 flex items-center gap-2">`);
    Plus($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Nueva Clase</button></div> <div class="relative group mb-8">`);
    Search($$renderer2, {
      class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-500 transition-colors"
    });
    $$renderer2.push(`<!----> <input type="text" placeholder="Buscar clase por nombre..."${attr("value", searchQuery)} class="w-full bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-purple-500/50 outline-none transition-all backdrop-blur-xl"/></div> `);
    if (filteredClasses()().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-[#1e293b]/40 border border-slate-800 border-dashed rounded-3xl p-24 text-center space-y-6"><div class="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 text-slate-700">`);
      Graduation_cap($$renderer2, { class: "w-10 h-10" });
      $$renderer2.push(`<!----></div> <div class="space-y-2"><h2 class="text-xl font-bold text-white">No hay clases configuradas</h2> <p class="text-slate-500 text-sm">Crea tu primer grupo para empezar a pasar lista y gestionar alumnos.</p></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
      const each_array = ensure_array_like(filteredClasses()());
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let cls = each_array[i];
        $$renderer2.push(`<div class="bg-[#1e293b]/60 border border-slate-800 rounded-3xl p-6 hover:border-purple-500/30 transition-all group relative overflow-hidden"><div class="flex items-center justify-between mb-6 relative z-10"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-purple-500 font-bold text-lg group-hover:scale-110 transition-all">${escape_html(cls.name[0].toUpperCase())}</div> <div><h3 class="text-white font-bold leading-tight group-hover:text-purple-400 transition-colors">${escape_html(cls.name)}</h3> <p class="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">${escape_html(getCenterName(cls.centerId))}</p></div></div> <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all"><button class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-purple-400 hover:border-purple-500/30 transition-all">`);
        Square_pen($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button> <button class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all">`);
        Trash_2($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button></div></div> <div class="space-y-3 mb-6 relative z-10"><div class="flex items-center gap-2 text-xs text-slate-400">`);
        Clock($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----> ${escape_html(cls.schedule || "Horario no definido")}</div> <div class="flex items-center gap-2 text-xs text-slate-400">`);
        Users($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----> ${escape_html(cls.studentIds?.length || 0)} Alumnos inscritos</div></div> <div class="flex items-center justify-between pt-4 border-t border-slate-800/50 relative z-10"><button class="flex items-center gap-1 text-[10px] font-bold text-purple-500 uppercase tracking-wider hover:text-white transition-all group/btn">GESTIONAR CLASE `);
        Chevron_right($$renderer2, {
          class: "w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1"
        });
        $$renderer2.push(`<!----></button> <button class="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors">Pasar Lista</button></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
