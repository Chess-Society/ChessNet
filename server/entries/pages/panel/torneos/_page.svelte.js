import { h as head, i as attr, e as ensure_array_like, c as escape_html, a as attr_class, b as stringify, j as derived, s as store_get, u as unsubscribe_stores } from "../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { a as appStore } from "../../../../chunks/appStore.js";
import { T as Trophy } from "../../../../chunks/trophy.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { S as Search } from "../../../../chunks/search.js";
import { S as Square_pen } from "../../../../chunks/square-pen.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { U as Users } from "../../../../chunks/users.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let searchQuery = "";
    let tournaments = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).tournaments || []);
    const filteredTournaments = derived(() => () => {
      return tournaments().filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    const getStatusColor = (status) => {
      switch (status) {
        case "Ongoing":
          return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        case "Completed":
          return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        case "Upcoming":
          return "bg-orange-500/10 text-orange-400 border-orange-500/20";
        default:
          return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      }
    };
    head("s1d4ac", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Gestión de Torneos - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6"><div class="space-y-4"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500">`);
    Trophy($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-bold text-white tracking-tight">Gestión de Torneos</h1> <p class="text-slate-400 text-sm">Organiza competiciones, controla los emparejamientos y registra resultados.</p></div></div></div> <button class="bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/20 flex items-center gap-2">`);
    Plus($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Crear Torneo</button></div> <div class="relative group mb-8">`);
    Search($$renderer2, {
      class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-500 transition-colors"
    });
    $$renderer2.push(`<!----> <input type="text" placeholder="Buscar torneo..."${attr("value", searchQuery)} class="w-full bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-orange-500/50 outline-none transition-all backdrop-blur-xl"/></div> `);
    if (filteredTournaments()().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-[#1e293b]/40 border border-slate-800 border-dashed rounded-3xl p-24 text-center space-y-6"><div class="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 text-slate-700">`);
      Trophy($$renderer2, { class: "w-10 h-10" });
      $$renderer2.push(`<!----></div> <div class="space-y-2"><h2 class="text-xl font-bold text-white">No hay torneos activos</h2> <p class="text-slate-500 text-sm">Organiza tu primer torneo para motivar a tus alumnos.</p></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
      const each_array = ensure_array_like(filteredTournaments()());
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let t = each_array[i];
        $$renderer2.push(`<div class="bg-[#1e293b]/60 border border-slate-800 rounded-3xl p-6 hover:border-orange-500/30 transition-all group relative overflow-hidden"><div class="flex items-center justify-between mb-6 relative z-10"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-orange-500 font-bold text-lg group-hover:scale-110 transition-all">${escape_html(t.name[0].toUpperCase())}</div> <div><h3 class="text-white font-bold leading-tight group-hover:text-orange-400 transition-colors">${escape_html(t.name)}</h3> <div class="flex items-center gap-2 mt-1"><div${attr_class(`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-widest ${stringify(getStatusColor(t.status))}`)}>${escape_html(t.status)}</div></div></div></div> <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all"><button class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-orange-400 hover:border-orange-500/30 transition-all">`);
        Square_pen($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button> <button class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all">`);
        Trash_2($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button></div></div> <div class="space-y-3 mb-6 relative z-10"><div class="flex items-center gap-2 text-xs text-slate-400">`);
        Calendar($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----> ${escape_html(t.date ? new Date(t.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : "Fecha no definida")}</div> <div class="flex items-center gap-2 text-xs text-slate-400">`);
        Users($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----> ${escape_html(t.participantsCount || 0)} Participantes</div></div> <div class="flex items-center justify-between pt-4 border-t border-slate-800/50 relative z-10"><button class="flex items-center gap-1 text-[10px] font-bold text-orange-500 uppercase tracking-wider hover:text-white transition-all group/btn">GESTIONAR TORNEO `);
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
