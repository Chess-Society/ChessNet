import { h as head, c as escape_html, i as attr, e as ensure_array_like, j as derived, s as store_get, u as unsubscribe_stores } from "../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { a as appStore } from "../../../../chunks/appStore.js";
import { U as Users } from "../../../../chunks/users.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { S as Search } from "../../../../chunks/search.js";
import { S as School } from "../../../../chunks/school.js";
import { S as Square_pen } from "../../../../chunks/square-pen.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let searchQuery = "";
    let selectedCenter = "";
    let students = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).students || []);
    let centers = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).centers || []);
    const filteredStudents = derived(() => () => {
      return students().filter((s) => {
        const nameMatch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
        const centerMatch = !selectedCenter;
        return nameMatch && centerMatch;
      });
    });
    const getCenterName = (id) => {
      return centers().find((c) => c.id === id)?.name || "Sin centro";
    };
    const getInitials = (name) => {
      return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
    };
    head("1qlk4gb", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Mis Alumnos - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6"><div class="space-y-4"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">`);
    Users($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-bold text-white tracking-tight">Comunidad Estudiantil</h1> <p class="text-slate-400 text-sm">Gestión y seguimiento de tus alumnos registrados.</p></div></div></div> <div class="flex items-center gap-4"><div class="bg-[#1e293b]/50 border border-slate-800 px-5 py-2.5 rounded-2xl flex items-center gap-4 backdrop-blur-xl"><div class="text-right"><p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Registrados</p> <p class="text-sm font-bold text-white uppercase">${escape_html(students().length)} ALUMNOS</p></div> <div class="w-px h-6 bg-slate-800"></div> <div class="text-right"><p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Activos</p> <p class="text-sm font-bold text-white uppercase">${escape_html(students().length)}</p></div></div> <button class="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2">`);
    Plus($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Matricular</button></div></div> <div class="flex flex-col md:flex-row gap-4 mb-8"><div class="flex-grow relative group">`);
    Search($$renderer2, {
      class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors"
    });
    $$renderer2.push(`<!----> <input type="text" placeholder="Buscar por nombre..."${attr("value", searchQuery)} class="w-full bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all backdrop-blur-xl"/></div> <div class="relative group min-w-[240px]">`);
    School($$renderer2, {
      class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
    });
    $$renderer2.push(`<!----> `);
    $$renderer2.select(
      {
        value: selectedCenter,
        class: "w-full bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-10 py-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Todos los centros`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(centers());
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let center = each_array[$$index];
          $$renderer3.option({ value: center.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(center.name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <button class="bg-slate-800/50 border border-slate-700 text-white px-6 py-4 rounded-2xl text-sm font-bold hover:bg-slate-700 transition-all backdrop-blur-xl">Resetear</button></div> `);
    if (filteredStudents()().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-[#1e293b]/40 border border-slate-800 border-dashed rounded-3xl p-24 text-center space-y-6"><div class="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 text-slate-700">`);
      Users($$renderer2, { class: "w-10 h-10" });
      $$renderer2.push(`<!----></div> <div class="space-y-2"><h2 class="text-xl font-bold text-white">No se encuentran alumnos</h2> <p class="text-slate-500 text-sm">Ajusta los filtros o matricula un nuevo alumno.</p></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
      const each_array_1 = ensure_array_like(filteredStudents()());
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        let student = each_array_1[i];
        $$renderer2.push(`<div class="bg-[#1e293b]/60 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/30 transition-all group relative overflow-hidden"><div class="flex items-center justify-between mb-6 relative z-10"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-emerald-500 font-bold text-lg group-hover:scale-110 group-hover:border-emerald-500/30 transition-all">${escape_html(getInitials(student.name))}</div> <div><h3 class="text-white font-bold leading-tight group-hover:text-emerald-400 transition-colors">${escape_html(student.name)}</h3> <p class="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">${escape_html(getCenterName(student.centerId))}</p></div></div> <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all"><button class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">`);
        Square_pen($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button> <button class="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-all">`);
        Trash_2($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button></div></div> <div class="flex items-center justify-between pt-4 border-t border-slate-800/50 relative z-10"><div class="flex items-center gap-2"><span class="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[9px] font-bold text-slate-500 uppercase tracking-widest">ALUMNO</span> `);
        if (student.level) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-bold text-emerald-400 uppercase tracking-widest">${escape_html(student.level)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <button class="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-wider hover:text-white transition-all group/btn">VER PERFIL `);
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
