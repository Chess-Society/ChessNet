import { h as head, i as attr, d as escape_html, e as ensure_array_like, p as pop, k as push, l as stringify } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import { S as School } from "../../../../chunks/school.js";
import { R as Refresh_cw } from "../../../../chunks/refresh-cw.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { B as Book_open } from "../../../../chunks/book-open.js";
import { U as Users } from "../../../../chunks/users.js";
import { S as Search } from "../../../../chunks/search.js";
import { S as Square_pen } from "../../../../chunks/square-pen.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { M as Map_pin } from "../../../../chunks/map-pin.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { E as Eye } from "../../../../chunks/eye.js";
const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  let schools = data.schools || [];
  let isLoading = false;
  let deletingId = null;
  let searchQuery = "";
  const filteredSchools = schools.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.city && s.city.toLowerCase().includes(searchQuery.toLowerCase()));
  const getTotalClasses = () => schools.length * 2;
  const getTotalStudents = () => schools.length * 15;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Mis Centros - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="space-y-8 animate-fade-in svelte-buqx27"><div class="flex flex-col md:flex-row md:items-end justify-between gap-6"><div class="space-y-2 text-center md:text-left"><div class="flex items-center justify-center md:justify-start gap-3 text-primary-400 font-bold uppercase tracking-widest text-xs">`);
  School($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> Gestión de Centros</div> <h1 class="text-4xl font-black text-white tracking-tight">Mis Centros</h1> <p class="text-surface-400">Administra tus centros educativos y organiza tus programas de ajedrez.</p></div> <div class="flex items-center justify-center gap-3"><button${attr("disabled", isLoading, true)} class="group p-3 rounded-2xl bg-surface-900 border border-surface-800 text-surface-400 hover:text-white transition-all" title="Sincronizar">`);
  Refresh_cw($$payload, {
    class: `w-5 h-5 ${stringify("group-hover:rotate-180 transition-transform duration-500")}`
  });
  $$payload.out.push(`<!----></button> <button class="btn-primary">`);
  Plus($$payload, { class: "w-5 h-5 mr-2" });
  $$payload.out.push(`<!----> Nuevo Centro</button></div></div> <div class="grid grid-cols-1 sm:grid-cols-3 gap-6"><div class="glass-card p-6 flex items-center gap-4 border-l-4 border-l-primary-500"><div class="w-12 h-12 rounded-2xl bg-primary-500/20 text-primary-400 flex items-center justify-center">`);
  School($$payload, { class: "w-6 h-6" });
  $$payload.out.push(`<!----></div> <div><p class="text-xs font-bold text-surface-500 uppercase tracking-wider">Total Centros</p> <p class="text-2xl font-black text-white">${escape_html(schools.length)}</p></div></div> <div class="glass-card p-6 flex items-center gap-4 border-l-4 border-l-blue-500"><div class="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">`);
  Book_open($$payload, { class: "w-6 h-6" });
  $$payload.out.push(`<!----></div> <div><p class="text-xs font-bold text-surface-500 uppercase tracking-wider">Clases Estimadas</p> <p class="text-2xl font-black text-white">${escape_html(getTotalClasses())}</p></div></div> <div class="glass-card p-6 flex items-center gap-4 border-l-4 border-l-accent-500"><div class="w-12 h-12 rounded-2xl bg-accent-500/20 text-accent-400 flex items-center justify-center">`);
  Users($$payload, { class: "w-6 h-6" });
  $$payload.out.push(`<!----></div> <div><p class="text-xs font-bold text-surface-500 uppercase tracking-wider">Estudiantes</p> <p class="text-2xl font-black text-white">${escape_html(getTotalStudents())}</p></div></div></div> <div class="relative group">`);
  Search($$payload, {
    class: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-600 group-focus-within:text-primary-400 transition-colors"
  });
  $$payload.out.push(`<!----> <input type="text"${attr("value", searchQuery)} placeholder="Filtrar por nombre o ciudad..." class="bg-surface-900/50 border border-surface-800 rounded-2xl pl-12 pr-4 py-4 text-sm w-full focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 transition-all outline-none text-white shadow-xl shadow-black/20"/></div> `);
  {
    $$payload.out.push("<!--[!-->");
    if (filteredSchools.length === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="glass-panel p-20 text-center space-y-6"><div class="w-24 h-24 bg-surface-900 rounded-3xl flex items-center justify-center mx-auto ring-1 ring-surface-800">`);
      School($$payload, { class: "w-12 h-12 text-surface-700" });
      $$payload.out.push(`<!----></div> <div class="space-y-2"><h2 class="text-2xl font-bold text-white">No se encontraron centros</h2> <p class="text-surface-500 max-w-xs mx-auto">${escape_html("Aún no has agregado ningún centro educativo a tu red.")}</p></div> `);
      {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<button class="btn-primary">`);
        Plus($$payload, { class: "w-5 h-5 mr-2" });
        $$payload.out.push(`<!----> Crear Primer Centro</button>`);
      }
      $$payload.out.push(`<!--]--></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      const each_array_1 = ensure_array_like(filteredSchools);
      $$payload.out.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><!--[-->`);
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        let school = each_array_1[i];
        $$payload.out.push(`<div class="glass-card group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"><div class="absolute -top-12 -right-12 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-all"></div> <div class="p-6 space-y-6 relative z-10"><div class="flex items-start justify-between"><div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">`);
        School($$payload, { class: "w-8 h-8 text-white" });
        $$payload.out.push(`<!----></div> <div class="flex gap-2"><button class="p-2.5 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-400 hover:text-white hover:bg-surface-700 transition-all" title="Editar">`);
        Square_pen($$payload, { class: "w-4 h-4" });
        $$payload.out.push(`<!----></button> <button${attr("disabled", deletingId === school.id, true)} class="p-2.5 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 hover:text-white hover:bg-red-500 transition-all disabled:opacity-50" title="Eliminar">`);
        if (deletingId === school.id) {
          $$payload.out.push("<!--[-->");
          Refresh_cw($$payload, { class: "w-4 h-4 animate-spin" });
        } else {
          $$payload.out.push("<!--[!-->");
          Trash_2($$payload, { class: "w-4 h-4" });
        }
        $$payload.out.push(`<!--]--></button></div></div> <div><h3 class="text-xl font-black text-white group-hover:text-primary-400 transition-colors truncate">${escape_html(school.name)}</h3> `);
        if (school.city) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<div class="flex items-center text-sm text-surface-500 mt-2 font-medium">`);
          Map_pin($$payload, { class: "w-3.5 h-3.5 mr-1.5 text-primary-500/50" });
          $$payload.out.push(`<!----> ${escape_html(school.city)}</div>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--></div> <div class="grid grid-cols-2 gap-4 py-4 border-y border-surface-800/50"><div class="space-y-1"><p class="text-[10px] font-bold text-surface-600 uppercase tracking-widest">Clases</p> <div class="flex items-center gap-2 text-white font-bold">`);
        Book_open($$payload, { class: "w-3.5 h-3.5 text-blue-400" });
        $$payload.out.push(`<!----> ~2</div></div> <div class="space-y-1"><p class="text-[10px] font-bold text-surface-600 uppercase tracking-widest">Estudiantes</p> <div class="flex items-center gap-2 text-white font-bold">`);
        Users($$payload, { class: "w-3.5 h-3.5 text-accent-400" });
        $$payload.out.push(`<!----> ~15</div></div></div> <div class="flex items-center justify-between"><div class="flex items-center gap-2 text-[10px] text-surface-600 font-bold uppercase tracking-wider">`);
        Calendar($$payload, { class: "w-3 h-3" });
        $$payload.out.push(`<!----> ${escape_html(formatDate(school.updated_at || school.created_at))}</div> <div class="h-2 w-2 rounded-full bg-primary-500 shadow-glow animate-pulse"></div></div> <div class="flex gap-3 pt-2"><button class="flex-1 px-4 py-3 rounded-xl bg-surface-800 text-white text-xs font-bold hover:bg-surface-700 transition-all border border-surface-700 flex items-center justify-center gap-2">`);
        Eye($$payload, { class: "w-4 h-4 text-primary-400" });
        $$payload.out.push(`<!----> Detalles</button> <button class="flex-1 px-4 py-3 rounded-xl bg-primary-500 text-white text-xs font-extrabold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2">`);
        Plus($$payload, { class: "w-4 h-4" });
        $$payload.out.push(`<!----> Nueva Clase</button></div></div></div>`);
      }
      $$payload.out.push(`<!--]--></div>`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></div>`);
  pop();
}
export {
  _page as default
};
