import { h as head, c as escape_html, i as attr, e as ensure_array_like, j as derived, s as store_get, u as unsubscribe_stores } from "../../../../chunks/renderer.js";
import { a as appStore } from "../../../../chunks/appStore.js";
import { D as Dollar_sign } from "../../../../chunks/dollar-sign.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { T as Trending_up } from "../../../../chunks/trending-up.js";
import { A as Arrow_up_right } from "../../../../chunks/arrow-up-right.js";
import { S as Search } from "../../../../chunks/search.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let searchQuery = "";
    let payments = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).payments || []);
    let students = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).students || []);
    const getStudentName = (id) => {
      return students().find((s) => s.id === id)?.name || "Desconocido";
    };
    const filteredPayments = derived(() => () => {
      return payments().filter((p) => getStudentName(p.studentId).toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => b.date.localeCompare(a.date));
    });
    const stats = derived(() => () => {
      const now = /* @__PURE__ */ new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const monthlyTotal = payments().filter((p) => {
        const d = new Date(p.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).reduce((acc, p) => acc + p.amount, 0);
      return { monthlyTotal };
    });
    ({
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    });
    head("1tl9uq8", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Sistema de Pagos - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6"><div class="space-y-4"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center text-teal-500">`);
    Dollar_sign($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-bold text-white tracking-tight">Finanzas y Pagos</h1> <p class="text-slate-400 text-sm">Gestiona los cobros de tus alumnos y el rendimiento de tu academia.</p></div></div></div> <button class="bg-teal-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-teal-500 transition-all shadow-lg shadow-teal-900/20 flex items-center gap-2">`);
    Plus($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Registrar Pago</button></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"><div class="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 relative overflow-hidden group"><div class="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">`);
    Trending_up($$renderer2, { class: "w-16 h-16 text-teal-500" });
    $$renderer2.push(`<!----></div> <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Ingresos este mes</p> <p class="text-3xl font-bold text-white">${escape_html(stats()().monthlyTotal)}€</p> <p class="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-bold">`);
    Arrow_up_right($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----> +15.2% vs mes anterior</p></div> <div class="bg-[#1e293b] p-6 rounded-3xl border border-slate-800"><p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Pagos Pendientes</p> <p class="text-3xl font-bold text-white">0</p> <p class="text-xs text-slate-500 mt-2">Todo al día</p></div> <div class="bg-gradient-to-br from-teal-900/30 to-slate-900/30 p-6 rounded-3xl border border-teal-500/20"><p class="text-teal-500 text-[10px] font-bold uppercase tracking-widest mb-1">Suscripción SaaS</p> <p class="text-xl font-bold text-white">Plan Maestro Premium</p> <p class="text-xs text-slate-400 mt-2 italic">Próxima renovación: 01 May 2026</p></div></div> <div class="relative group mb-6">`);
    Search($$renderer2, {
      class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-teal-500 transition-colors"
    });
    $$renderer2.push(`<!----> <input type="text" placeholder="Buscar por nombre de alumno..."${attr("value", searchQuery)} class="w-full bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-teal-500/50 outline-none transition-all backdrop-blur-xl"/></div> <div class="bg-[#1e293b]/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-900/50 border-b border-slate-800"><th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alumno</th><th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Concepto</th><th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fecha</th><th class="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Monto</th></tr></thead><tbody class="divide-y divide-slate-800/50">`);
    if (filteredPayments()().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<tr><td colspan="4" class="px-6 py-12 text-center text-slate-500 text-sm">No se han registrado pagos todavía.</td></tr>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(filteredPayments()());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let p = each_array[$$index];
        $$renderer2.push(`<tr class="hover:bg-slate-800/30 transition-colors group"><td class="px-6 py-4"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-teal-500">${escape_html(getStudentName(p.studentId)[0])}</div> <span class="text-sm font-bold text-white">${escape_html(getStudentName(p.studentId))}</span></div></td><td class="px-6 py-4"><span class="text-xs text-slate-400">${escape_html(p.concept)}</span></td><td class="px-6 py-4"><span class="text-xs text-slate-500">${escape_html(new Date(p.date).toLocaleDateString("es-ES"))}</span></td><td class="px-6 py-4 text-right"><span class="text-sm font-bold text-teal-400">${escape_html(p.amount)}€</span></td></tr>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
