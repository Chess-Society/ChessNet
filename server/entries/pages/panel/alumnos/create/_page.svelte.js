import { h as head, i as attr, a as attr_class, c as escape_html, j as derived, s as store_get, u as unsubscribe_stores } from "../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import "../../../../../chunks/state.svelte.js";
import { p as page } from "../../../../../chunks/stores.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { C as Circle_user } from "../../../../../chunks/circle-user.js";
import { X } from "../../../../../chunks/x.js";
import { S as Save } from "../../../../../chunks/save.js";
import { A as Activity } from "../../../../../chunks/activity.js";
import { U as User } from "../../../../../chunks/user.js";
import { F as File_text } from "../../../../../chunks/file-text.js";
import { B as Book_open } from "../../../../../chunks/book-open.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    let formData = { first_name: "", last_name: "", notes: "" };
    let isSubmitting = false;
    let errors = {};
    const classId = derived(() => store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("class_id"));
    const isFromClass = derived(() => !!classId());
    head("1pvbp9q", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Nueva Matrícula - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="space-y-4"><button class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest">`);
    Arrow_left($$renderer2, {
      class: "w-4 h-4 transition-transform group-hover:-translate-x-1"
    });
    $$renderer2.push(`<!----> Regresar</button> <div class="flex items-center gap-6"><div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">`);
    Circle_user($$renderer2, { class: "w-8 h-8" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">Matriculación</h1> <p class="text-surface-500 text-sm font-medium uppercase tracking-widest mt-1">Nuevo Registro de Alumno</p></div></div></div> <div class="flex items-center gap-3"><button class="bg-surface-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-surface-800 hover:border-surface-700 transition-all flex items-center gap-2">`);
    X($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Cancelar</button> <button${attr("disabled", isSubmitting, true)} class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/10 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">`);
    {
      $$renderer2.push("<!--[-1-->");
      Save($$renderer2, { class: "w-4 h-4" });
    }
    $$renderer2.push(`<!--]--> Confirmar Alta</button></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-10"><div class="lg:col-span-2 space-y-8">`);
    if (isFromClass()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="glass-panel p-6 border-l-4 border-blue-500 flex items-center gap-4 animate-bounce-subtle"><div class="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">`);
      Activity($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----></div> <div><p class="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Inscripción Activa</p> <p class="text-[10px] font-bold text-surface-500 uppercase tracking-tight">El alumno será añadido a la clase automáticamente</p></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <section class="glass-panel p-10 space-y-10"><div class="flex items-center gap-3 border-b border-surface-900 pb-6">`);
    User($$renderer2, { class: "w-5 h-5 text-primary-400" });
    $$renderer2.push(`<!----> <h2 class="text-lg font-black text-white uppercase tracking-tight">Identificación del Alumno</h2></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div class="space-y-3"><label for="first_name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre(s) *</label> <input id="first_name" type="text"${attr("value", formData.first_name)} placeholder="EJ: JUAN CARLOS"${attr_class(`w-full bg-surface-950 border rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white outline-none transition-all placeholder:text-surface-800 ${errors.first_name ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-surface-900 focus:border-primary-500/50"}`)}/> `);
    if (errors.first_name) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-[10px] font-bold uppercase tracking-tight ml-4">${escape_html(errors.first_name)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="space-y-3"><label for="last_name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Apellidos</label> <input id="last_name" type="text"${attr("value", formData.last_name)} placeholder="EJ: PÉREZ RODRÍGUEZ" class="w-full bg-surface-950 border border-surface-900 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all placeholder:text-surface-800"/></div></div></section> <section class="glass-panel p-10 space-y-10"><div class="flex items-center gap-3 border-b border-surface-900 pb-6">`);
    File_text($$renderer2, { class: "w-5 h-5 text-primary-400" });
    $$renderer2.push(`<!----> <h2 class="text-lg font-black text-white uppercase tracking-tight">Expediente y Notas</h2></div> <div class="space-y-3"><label for="notes" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Resumen Inicial</label> <textarea id="notes" placeholder="Escribe aquí observaciones iniciales, nivel estimado o cualquier dato relevante para su seguimiento..." class="w-full bg-surface-950 border border-surface-900 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white h-48 resize-none focus:border-primary-500/50 outline-none transition-all placeholder:text-surface-800">`);
    const $$body = escape_html(formData.notes);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div></section></div> <div class="space-y-8"><section class="glass-panel p-8 space-y-8 border-t-4 border-primary-500"><div class="flex items-center gap-3">`);
    Book_open($$renderer2, { class: "w-5 h-5 text-primary-400" });
    $$renderer2.push(`<!----> <h3 class="text-sm font-black text-white uppercase tracking-tighter">Guía de Registro</h3></div> <div class="space-y-6"><div class="flex gap-4"><div class="w-8 h-8 bg-surface-950 rounded-lg flex items-center justify-center text-[10px] font-black text-primary-400 border border-surface-800">01</div> <p class="text-[10px] font-bold text-surface-500 uppercase tracking-tight leading-relaxed">Usa <span class="text-white">MAYÚSCULAS</span> para mantener la consistencia en el sistema.</p></div> <div class="flex gap-4"><div class="w-8 h-8 bg-surface-950 rounded-lg flex items-center justify-center text-[10px] font-black text-primary-400 border border-surface-800">02</div> <p class="text-[10px] font-bold text-surface-500 uppercase tracking-tight leading-relaxed">Puedes dejar campos vacíos y editarlos más tarde desde el <span class="text-white">perfil del alumno</span>.</p></div> <div class="flex gap-4"><div class="w-8 h-8 bg-surface-950 rounded-lg flex items-center justify-center text-[10px] font-black text-primary-400 border border-surface-800">03</div> <p class="text-[10px] font-bold text-surface-500 uppercase tracking-tight leading-relaxed">Presiona <span class="text-white">CTRL + ENTER</span> para finalizar el registro rápidamente.</p></div></div></section> <section class="glass-panel p-8 space-y-6"><h3 class="text-xs font-black text-surface-500 uppercase tracking-widest border-b border-surface-900 pb-4 italic">Vista Previa</h3> <div class="p-6 bg-surface-950 rounded-2xl border border-surface-900 space-y-4"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-surface-900 rounded-xl flex items-center justify-center text-primary-400 font-black">${escape_html("?")}</div> <div><p class="text-[10px] font-black text-white uppercase truncate max-w-[120px]">${escape_html("SIN NOMBRE")} ${escape_html("")}</p> <p class="text-[8px] font-black text-primary-400 uppercase tracking-widest">NUEVO ASPIRANTE</p></div></div></div></section></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
