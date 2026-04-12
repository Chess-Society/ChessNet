import { h as head, i as attr, e as ensure_array_like, c as escape_html, j as derived, s as store_get, u as unsubscribe_stores } from "../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { a as appStore } from "../../../../chunks/appStore.js";
import { S as School } from "../../../../chunks/school.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { S as Search } from "../../../../chunks/search.js";
import { M as Map_pin } from "../../../../chunks/map-pin.js";
import { S as Square_pen } from "../../../../chunks/square-pen.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { U as Users } from "../../../../chunks/users.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let searchQuery = "";
    let centers = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).centers || []);
    let students = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).students || []);
    const filteredCenters = derived(() => () => {
      return centers().filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    const getStudentCount = (centerId) => {
      return students().filter((s) => s.centerId === centerId).length;
    };
    head("zy0yp4", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Centros Educativos - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6"><div class="space-y-4"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">`);
    School($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-bold text-white tracking-tight">Centros Educativos</h1> <p class="text-slate-400 text-sm">Organiza las instituciones donde impartes tus lecciones.</p></div></div></div> <button class="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2">`);
    Plus($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Añadir Centro</button></div> <div class="relative group mb-8">`);
    Search($$renderer2, {
      class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors"
    });
    $$renderer2.push(`<!----> <input type="text" placeholder="Buscar centro por nombre..."${attr("value", searchQuery)} class="w-full bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all backdrop-blur-xl"/></div> `);
    if (filteredCenters()().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-[#1e293b]/40 border border-slate-800 border-dashed rounded-3xl p-24 text-center space-y-6"><div class="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 text-slate-700">`);
      School($$renderer2, { class: "w-10 h-10" });
      $$renderer2.push(`<!----></div> <div class="space-y-2"><h2 class="text-xl font-bold text-white">No hay centros registrados</h2> <p class="text-slate-500 text-sm">Empieza añadiendo el primer colegio o club donde enseñas.</p></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
      const each_array = ensure_array_like(filteredCenters()());
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let center = each_array[i];
        $$renderer2.push(`<div class="bg-[#1e293b]/60 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden"><div class="flex items-center justify-between mb-6 relative z-10"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-blue-500 font-bold text-lg group-hover:scale-110 transition-all">${escape_html(center.name[0].toUpperCase())}</div> <div><h3 class="text-white font-bold leading-tight group-hover:text-blue-400 transition-colors">${escape_html(center.name)}</h3> <div class="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5 uppercase tracking-wide">`);
        Map_pin($$renderer2, { class: "w-3 h-3" });
        $$renderer2.push(`<!----> ${escape_html(center.location || "Ubicación no definida")}</div></div></div> <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all"><button class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all">`);
        Square_pen($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button> <button class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all">`);
        Trash_2($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button></div></div> <div class="flex items-center justify-between pt-4 border-t border-slate-800/50 relative z-10"><div class="flex items-center gap-4"><div class="flex items-center gap-1.5">`);
        Users($$renderer2, { class: "w-4 h-4 text-slate-500" });
        $$renderer2.push(`<!----> <span class="text-xs font-bold text-white">${escape_html(getStudentCount(center.id))} Alumnos</span></div></div> <button class="flex items-center gap-1 text-[10px] font-bold text-blue-500 uppercase tracking-wider hover:text-white transition-all group/btn">GESTIONAR `);
        Chevron_right($$renderer2, {
          class: "w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1"
        });
        $$renderer2.push(`<!----></button></div></div>`);
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
