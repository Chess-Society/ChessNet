import { e as ensure_array_like, h as head, d as escape_html, i as attr, m as maybe_selected, f as attr_class, p as pop, k as push } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import { T as Trophy } from "../../../../chunks/trophy.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { T as Timer } from "../../../../chunks/timer.js";
import { U as Users } from "../../../../chunks/users.js";
import { A as Award } from "../../../../chunks/award.js";
import { S as Search } from "../../../../chunks/search.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { M as Map_pin } from "../../../../chunks/map-pin.js";
import { Z as Zap } from "../../../../chunks/zap.js";
import { E as Eye } from "../../../../chunks/eye.js";
import { S as Settings } from "../../../../chunks/settings.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  let searchTerm = "";
  let statusFilter = "all";
  let formatFilter = "all";
  const filteredTournaments = data.tournaments?.filter((tournament) => {
    const matchesSearch = !searchTerm;
    const matchesStatus = statusFilter === "all";
    const matchesFormat = formatFilter === "all";
    return matchesSearch && matchesStatus && matchesFormat;
  }) || [];
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
  };
  const statusThemes = {
    draft: "text-surface-500 border-surface-800 bg-surface-950",
    upcoming: "text-blue-400 border-blue-500/20 bg-blue-500/10",
    in_progress: "text-primary-400 border-primary-500/20 bg-primary-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    completed: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    cancelled: "text-red-400 border-red-500/20 bg-red-500/10"
  };
  const statusLabels = {
    draft: "BORRADOR",
    upcoming: "PRÓXIMO",
    in_progress: "EN CURSO",
    completed: "FINALIZADO",
    cancelled: "CANCELADO"
  };
  const formatLabels = {
    swiss: "SUIZO",
    round_robin: "ROUND ROBIN",
    knockout: "ELIMINATORIO",
    single_elimination: "ELIMINACIÓN SIMPLE"
  };
  const each_array = ensure_array_like(filteredTournaments);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Torneos y Competiciones - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="space-y-10 animate-fade-in pb-20"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="space-y-4"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400 shadow-2xl">`);
  Trophy($$payload, { class: "w-6 h-6" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">Tour Arena</h1> <p class="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] mt-1">Gestión de Competiciones y Rating</p></div></div></div> <button class="bg-primary-500 text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg flex items-center justify-center gap-3 group">`);
  Plus($$payload, { class: "w-5 h-5 transition-transform group-hover:rotate-90" });
  $$payload.out.push(`<!----> CREAR TORNEO</button></div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><div class="glass-panel p-8 border-t-4 border-primary-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  Trophy($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Total Eventos</p> <div class="flex items-end gap-3"><p class="text-4xl font-black text-white tracking-tighter leading-none">${escape_html(data.tournamentStats?.total_tournaments || 0)}</p> <p class="text-[10px] font-bold text-surface-600 uppercase mb-0.5">REGISTRADOS</p></div></div> <div class="glass-panel p-8 border-t-4 border-blue-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  Timer($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Competiciones Activas</p> <div class="flex items-end gap-3"><p class="text-4xl font-black text-blue-400 tracking-tighter leading-none">${escape_html(data.tournamentStats?.in_progress_tournaments || 0)}</p> <p class="text-[10px] font-bold text-surface-600 uppercase mb-0.5">EN CURSO</p></div></div> <div class="glass-panel p-8 border-t-4 border-orange-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  Users($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Jugadores Inscritos</p> <div class="flex items-end gap-3"><p class="text-4xl font-black text-white tracking-tighter leading-none">${escape_html(data.tournamentStats?.total_players_registered || 0)}</p> <p class="text-[10px] font-bold text-surface-600 uppercase mb-0.5">USUARIOS</p></div></div> <div class="glass-panel p-8 border-t-4 border-purple-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  Award($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Bolsa de Premios</p> <div class="flex items-end gap-3"><p class="text-4xl font-black text-white tracking-tighter leading-none">${escape_html(formatCurrency(data.tournamentStats?.total_prize_pool || 0))}</p> <p class="text-[9px] font-black text-purple-400 uppercase mb-0.5 whitespace-nowrap">GLOBAL</p></div></div></div> <div class="flex flex-col lg:flex-row gap-4"><div class="flex-grow relative group">`);
  Search($$payload, {
    class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600 group-focus-within:text-primary-400 transition-colors"
  });
  $$payload.out.push(`<!----> <input type="text" placeholder="BUSCAR TORNEO POR NOMBRE O UBICACIÓN..."${attr("value", searchTerm)} class="w-full bg-surface-950/50 border border-surface-900 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all backdrop-blur-xl"/></div> <select class="bg-surface-950/50 border border-surface-900 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl min-w-[200px]">`);
  $$payload.select_value = statusFilter;
  $$payload.out.push(`<option value="all"${maybe_selected($$payload, "all")}>TODOS LOS ESTADOS</option><option value="draft"${maybe_selected($$payload, "draft")}>BORRADOR</option><option value="upcoming"${maybe_selected($$payload, "upcoming")}>PRÓXIMO</option><option value="in_progress"${maybe_selected($$payload, "in_progress")}>EN CURSO</option><option value="completed"${maybe_selected($$payload, "completed")}>FINALIZADO</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select> <select class="bg-surface-950/50 border border-surface-900 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl min-w-[200px]">`);
  $$payload.select_value = formatFilter;
  $$payload.out.push(`<option value="all"${maybe_selected($$payload, "all")}>TODOS LOS FORMATOS</option><option value="swiss"${maybe_selected($$payload, "swiss")}>SUIZO</option><option value="round_robin"${maybe_selected($$payload, "round_robin")}>ROUND ROBIN</option><option value="knockout"${maybe_selected($$payload, "knockout")}>ELIMINATORIO</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select> <button class="bg-surface-900/50 border border-surface-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-800 transition-all backdrop-blur-xl">RESETEAR</button></div> <div class="space-y-8">`);
  if (each_array.length !== 0) {
    $$payload.out.push("<!--[-->");
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let tournament = each_array[i];
      $$payload.out.push(`<div class="glass-panel group hover:border-primary-500/30 transition-all overflow-hidden"><div class="p-8"><div class="flex flex-col xl:flex-row gap-10"><div class="flex-1 space-y-6"><div class="flex flex-col md:flex-row md:items-center gap-6"><div class="w-16 h-16 bg-surface-950 border border-surface-900 rounded-2xl flex items-center justify-center text-primary-400 shadow-xl group-hover:scale-105 transition-transform flex-shrink-0">`);
      Trophy($$payload, { class: "w-8 h-8" });
      $$payload.out.push(`<!----></div> <div class="space-y-2"><div class="flex flex-wrap items-center gap-4"><h3 class="text-xl font-black text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight leading-none">${escape_html(tournament.name)}</h3> <span${attr_class(`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${statusThemes[tournament.status]}`)}>${escape_html(statusLabels[tournament.status])}</span></div> <p class="text-[11px] text-surface-500 leading-relaxed max-w-2xl">${escape_html(tournament.description)}</p></div></div> <div class="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4 border-t border-surface-900/50"><div class="space-y-1.5"><p class="text-[8px] font-black text-surface-600 uppercase tracking-[0.2em]">FECHA INICIO</p> <div class="flex items-center gap-2 text-white font-bold text-xs">`);
      Calendar($$payload, { class: "w-4 h-4 text-blue-400" });
      $$payload.out.push(`<!----> ${escape_html(formatDate(tournament.start_date))}</div></div> <div class="space-y-1.5"><p class="text-[8px] font-black text-surface-600 uppercase tracking-[0.2em]">CONTROL TIEMPO</p> <div class="flex items-center gap-2 text-white font-bold text-xs">`);
      Timer($$payload, { class: "w-4 h-4 text-orange-400" });
      $$payload.out.push(`<!----> ${escape_html(tournament.time_control)}</div></div> <div class="space-y-1.5"><p class="text-[8px] font-black text-surface-600 uppercase tracking-[0.2em]">SALA / SEDE</p> <div class="flex items-center gap-2 text-white font-bold text-xs">`);
      Map_pin($$payload, { class: "w-4 h-4 text-red-400" });
      $$payload.out.push(`<!----> ${escape_html(tournament.location.toUpperCase())}</div></div> <div class="space-y-1.5"><p class="text-[8px] font-black text-surface-600 uppercase tracking-[0.2em]">SISTEMA</p> <div class="flex items-center gap-2 text-white font-bold text-xs">`);
      Zap($$payload, { class: "w-4 h-4 text-purple-400" });
      $$payload.out.push(`<!----> ${escape_html(formatLabels[tournament.format] || tournament.format)}</div></div></div></div> <div class="hidden xl:block w-px bg-surface-900/50"></div> <div class="flex flex-col md:flex-row xl:flex-col items-center gap-10 xl:w-64"><div class="flex flex-1 items-center justify-around md:justify-start xl:flex-col gap-10 w-full"><div class="text-center xl:text-left"><p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-1">PARTICIPACIÓN</p> <p class="text-xl font-black text-white leading-none">${escape_html(tournament.players_registered)} <span class="text-surface-700">/ ${escape_html(tournament.max_players)}</span></p></div> <div class="text-center xl:text-left"><p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-1">PREMIACIÓN</p> <p class="text-xl font-black text-emerald-400 leading-none">${escape_html(formatCurrency(tournament.prize_pool))}</p></div> <div class="text-center xl:text-left"><p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-1">RONDA ACTUAL</p> <p class="text-xl font-black text-primary-400 leading-none">${escape_html(tournament.current_round)} <span class="text-surface-700">/ ${escape_html(tournament.total_rounds)}</span></p></div></div> <div class="flex gap-3 w-full justify-center md:justify-end xl:justify-start"><button class="p-4 bg-surface-950 border border-surface-900 rounded-2xl text-surface-400 hover:text-white hover:border-primary-500/30 transition-all shadow-xl group/btn">`);
      Eye($$payload, {
        class: "w-5 h-5 group-hover/btn:scale-110 transition-transform"
      });
      $$payload.out.push(`<!----></button> <button class="p-4 bg-surface-950 border border-surface-900 rounded-2xl text-surface-400 hover:text-primary-400 hover:border-primary-500/30 transition-all shadow-xl group/btn">`);
      Settings($$payload, {
        class: "w-5 h-5 group-hover/btn:scale-110 transition-transform"
      });
      $$payload.out.push(`<!----></button> <button class="p-4 bg-surface-950 border border-surface-900 rounded-2xl text-surface-400 hover:text-red-400 hover:border-red-500/30 transition-all shadow-xl group/btn">`);
      Trash_2($$payload, {
        class: "w-5 h-5 group-hover/btn:scale-110 transition-transform"
      });
      $$payload.out.push(`<!----></button></div></div></div></div></div>`);
    }
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<div class="glass-panel p-24 text-center space-y-6"><div class="w-20 h-20 bg-surface-950 border border-surface-900 rounded-3xl flex items-center justify-center mx-auto text-surface-800">`);
    Trophy($$payload, { class: "w-10 h-10" });
    $$payload.out.push(`<!----></div> <div><p class="text-[10px] font-black text-surface-600 uppercase tracking-[0.3em]">No se han localizado torneos</p> <p class="text-[9px] font-bold text-surface-800 uppercase tracking-widest mt-2">Ajusta los filtros o inicia una nueva arena.</p></div></div>`);
  }
  $$payload.out.push(`<!--]--></div></div>`);
  pop();
}
export {
  _page as default
};
