import { h as head, i as attr, e as ensure_array_like, c as escape_html } from "../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import "../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { S as School } from "../../../../../chunks/school.js";
import { C as Check } from "../../../../../chunks/check.js";
import { M as Map_pin } from "../../../../../chunks/map-pin.js";
import { S as Sparkles } from "../../../../../chunks/sparkles.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let name = "";
    let city = "";
    head("h5lcbd", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Nuevo Centro - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-3xl mx-auto space-y-8 animate-fade-in"><div class="space-y-4"><button class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest">`);
    Arrow_left($$renderer2, {
      class: "w-4 h-4 transition-transform group-hover:-translate-x-1"
    });
    $$renderer2.push(`<!----> Volver a Centros</button> <div class="flex items-center gap-4"><div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">`);
    School($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-black text-white tracking-tight uppercase">Registrar Nuevo Centro</h1> <p class="text-surface-500 text-sm">Configura una nueva sede para tu academia de ajedrez.</p></div></div></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8"><div class="md:col-span-2 space-y-6"><div class="glass-panel p-8 space-y-8 border-t-4 border-primary-500"><div class="space-y-6"><div class="space-y-2"><label for="name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre del Centro Educational</label> <div class="relative group"><input id="name" type="text"${attr("value", name)} placeholder="Ej: Colegio San Ramón y San Antonio" class="w-full bg-surface-950 border border-surface-800 rounded-xl px-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all placeholder:text-surface-700 font-bold" required=""/> `);
    if (name.length > 3) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500">`);
      Check($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="space-y-2"><label for="city" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Ciudad o Localidad</label> <div class="relative group">`);
    Map_pin($$renderer2, {
      class: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-700 group-focus-within:text-primary-400 transition-colors"
    });
    $$renderer2.push(`<!----> <input id="city" type="text"${attr("value", city)} placeholder="Ej: Madrid, España" class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all placeholder:text-surface-700"/></div></div></div> <div class="flex items-center justify-end gap-4 pt-4 border-t border-surface-900"><button type="button" class="px-6 py-3 text-surface-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Cancelar</button> <button${attr("disabled", !name.trim(), true)} class="bg-primary-500 text-black px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20 flex items-center gap-3">`);
    {
      $$renderer2.push("<!--[-1-->");
      Sparkles($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> <span>Crear Centro</span>`);
    }
    $$renderer2.push(`<!--]--></button></div></div></div> <div class="space-y-6"><div class="glass-panel p-6 space-y-4 bg-primary-500/5 border-primary-500/10"><h3 class="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">`);
    Sparkles($$renderer2, { class: "w-4 h-4 text-primary-400" });
    $$renderer2.push(`<!----> ¿Qué sucede ahora?</h3> <ul class="space-y-3"><!--[-->`);
    const each_array = ensure_array_like([
      "Se creará un perfil único para el centro.",
      "Se habilitará la gestión de clases y grupos.",
      "Podrás vincular estudiantes al centro.",
      "Se activará el seguimiento de pagos."
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tip = each_array[$$index];
      $$renderer2.push(`<li class="flex items-start gap-2"><div class="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] flex-shrink-0"></div> <p class="text-xs text-surface-400 leading-relaxed font-medium">${escape_html(tip)}</p></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div> <div class="glass-panel p-6 space-y-4"><h3 class="text-sm font-black text-white uppercase tracking-widest">Ayuda</h3> <p class="text-xs text-surface-500 leading-relaxed">Si necesitas importar datos masivos desde un Excel, contacta con soporte o utiliza la herramienta de importación en el Dashboard.</p></div></div></div></div>`);
  });
}
export {
  _page as default
};
