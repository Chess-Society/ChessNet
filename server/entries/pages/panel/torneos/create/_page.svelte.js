import { h as head, i as attr } from "../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import "../../../../../chunks/state.svelte.js";
import "../../../../../chunks/appStore.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { T as Trophy } from "../../../../../chunks/trophy.js";
import { C as Calendar } from "../../../../../chunks/calendar.js";
import { C as Clock } from "../../../../../chunks/clock.js";
import { M as Map_pin } from "../../../../../chunks/map-pin.js";
import { T as Target } from "../../../../../chunks/target.js";
import { D as Dollar_sign } from "../../../../../chunks/dollar-sign.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let tournament = {
      name: "",
      startDate: "",
      timeControl: "10 + 5",
      location: "",
      format: "swiss",
      maxPlayers: 20,
      prizePool: 0
    };
    head("awprrh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Crear Torneo - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"><div class="flex items-center gap-4 mb-10 pt-8"><button class="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">`);
    Arrow_left($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></button> <div><h1 class="text-3xl font-black text-white tracking-tight">Nuevo Torneo</h1> <p class="text-slate-400 text-sm">Organiza un evento inolvidable para tus alumnos.</p></div></div> <form class="space-y-8"><div class="bg-[#1e293b] rounded-3xl p-8 border border-slate-800 shadow-xl"><h3 class="text-white font-bold mb-8 flex items-center gap-2">`);
    Trophy($$renderer2, { class: "w-5 h-5 text-amber-500" });
    $$renderer2.push(`<!----> Información del Evento</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div class="space-y-2 md:col-span-2"><label for="t-name" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre del Torneo</label> <input id="t-name" type="text"${attr("value", tournament.name)} required="" placeholder="Ej. I Torneo Clasificatorio de Invierno" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"/></div> <div class="space-y-2"><label for="t-date" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Fecha</label> <div class="relative">`);
    Calendar($$renderer2, { class: "absolute left-4 top-3.5 w-4 h-4 text-slate-500" });
    $$renderer2.push(`<!----> <input id="t-date" type="date"${attr("value", tournament.startDate)} required="" class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"/></div></div> <div class="space-y-2"><label for="t-time" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Control de Tiempo</label> <div class="relative">`);
    Clock($$renderer2, { class: "absolute left-4 top-3.5 w-4 h-4 text-slate-500" });
    $$renderer2.push(`<!----> <input id="t-time" type="text"${attr("value", tournament.timeControl)} placeholder="Ej. 10min + 5seg" class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"/></div></div> <div class="space-y-2"><label for="t-loc" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Ubicación / Modalidad</label> <div class="relative">`);
    Map_pin($$renderer2, { class: "absolute left-4 top-3.5 w-4 h-4 text-slate-500" });
    $$renderer2.push(`<!----> <input id="t-loc" type="text"${attr("value", tournament.location)} placeholder="Ej. Club de Ajedrez Central o Online" class="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all"/></div></div> <div class="space-y-2"><label for="t-format" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Formato</label> <div class="relative">`);
    Target($$renderer2, { class: "absolute left-4 top-3.5 w-4 h-4 text-slate-500" });
    $$renderer2.push(`<!----> `);
    $$renderer2.select(
      {
        id: "t-format",
        value: tournament.format,
        class: "w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-amber-500 outline-none transition-all appearance-none"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "swiss" }, ($$renderer4) => {
          $$renderer4.push(`Sistema Suizo`);
        });
        $$renderer3.option({ value: "round_robin" }, ($$renderer4) => {
          $$renderer4.push(`Liga (Round Robin)`);
        });
        $$renderer3.option({ value: "elimination" }, ($$renderer4) => {
          $$renderer4.push(`Eliminación Directa`);
        });
      }
    );
    $$renderer2.push(`</div></div></div></div> <div class="bg-[#1e293b] rounded-3xl p-8 border border-slate-800 shadow-xl"><h3 class="text-white font-bold mb-8 flex items-center gap-2">`);
    Dollar_sign($$renderer2, { class: "w-5 h-5 text-emerald-500" });
    $$renderer2.push(`<!----> Premios y Límites</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div class="space-y-2"><label for="t-prize" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Bolsa de Premios (€)</label> <input id="t-prize" type="number"${attr("value", tournament.prizePool)} class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-all"/></div> <div class="space-y-2"><label for="t-max" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Máx. Jugadores</label> <input id="t-max" type="number"${attr("value", tournament.maxPlayers)} class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition-all"/></div></div></div> <div class="flex justify-end gap-4"><button type="button" class="px-8 py-3 text-slate-400 font-bold hover:text-white transition-colors">Descartar</button> <button type="submit" class="bg-amber-600 hover:bg-amber-500 text-white font-bold px-10 py-3 rounded-2xl shadow-lg shadow-amber-900/20 transition-all hover:scale-105 active:scale-95">Publicar Torneo</button></div></form></div>`);
  });
}
export {
  _page as default
};
