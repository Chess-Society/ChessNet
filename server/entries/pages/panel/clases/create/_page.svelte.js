import { h as head, i as attr, a as attr_class, c as escape_html, e as ensure_array_like, j as derived, s as store_get, u as unsubscribe_stores } from "../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import "../../../../../chunks/state.svelte.js";
import { p as page } from "../../../../../chunks/stores.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { G as Graduation_cap } from "../../../../../chunks/graduation-cap.js";
import { X } from "../../../../../chunks/x.js";
import { S as Save } from "../../../../../chunks/save.js";
import { S as School } from "../../../../../chunks/school.js";
import { I as Info } from "../../../../../chunks/info.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    let formData = { name: "", college_id: "" };
    let isSubmitting = false;
    let errors = {};
    const schools = derived(() => data.schools || []);
    const collegeIdFromUrl = derived(() => store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("college_id"));
    const isPreSelectedCollege = derived(() => !!collegeIdFromUrl());
    const getSchoolName = (schoolId) => {
      return schools().find((s) => s.id === schoolId)?.name || "";
    };
    head("1e99kuu", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Nueva Clase - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="space-y-4"><button class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest">`);
    Arrow_left($$renderer2, {
      class: "w-4 h-4 transition-transform group-hover:-translate-x-1"
    });
    $$renderer2.push(`<!----> Volver a Clases</button> <div class="flex items-center gap-6"><div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">`);
    Graduation_cap($$renderer2, { class: "w-8 h-8" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-black text-white tracking-tighter uppercase">Crear Nueva Clase</h1> <p class="text-surface-500 text-sm font-medium">Define un nuevo grupo de entrenamiento.</p></div></div></div> <div class="flex items-center gap-3"><button class="btn-ghost flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"${attr("disabled", isSubmitting, true)}>`);
    X($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Cancelar</button> <button${attr("disabled", isSubmitting, true)} class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-3">`);
    {
      $$renderer2.push("<!--[-1-->");
      Save($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> <span>Registrar Clase</span>`);
    }
    $$renderer2.push(`<!--]--></button></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-10"><div class="lg:col-span-2 space-y-8"><section class="glass-panel p-8 space-y-8 border-t-4 border-primary-500"><div class="space-y-6"><div class="space-y-2"><label for="name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre de la Clase</label> <input id="name" type="text"${attr("value", formData.name)} placeholder="Ej: Avanzados Lunes 17:00"${attr_class(`w-full bg-surface-950 border rounded-xl px-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all ${errors.name ? "border-red-500" : "border-surface-800"}`)}/></div> <div class="space-y-2"><label for="college" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Centro Asignado</label> `);
    if (isPreSelectedCollege()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="w-full bg-surface-900 border border-primary-500/30 rounded-xl px-5 py-4 flex items-center justify-between"><div class="flex items-center gap-3">`);
      School($$renderer2, { class: "w-5 h-5 text-primary-400" });
      $$renderer2.push(`<!----> <span class="text-white font-bold uppercase text-xs">${escape_html(getSchoolName(formData.college_id))}</span></div> <span class="text-[8px] font-black text-primary-500 uppercase tracking-widest bg-primary-500/10 px-2 py-1 rounded">Pre-seleccionado</span></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="relative group">`);
      School($$renderer2, {
        class: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-700 pointer-events-none transition-colors group-focus-within:text-primary-400"
      });
      $$renderer2.push(`<!----> `);
      $$renderer2.select(
        {
          id: "college",
          value: formData.college_id,
          class: `w-full bg-surface-950 border rounded-xl pl-12 pr-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all cursor-pointer appearance-none ${errors.college_id ? "border-red-500" : "border-surface-800"}`
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "" }, ($$renderer4) => {
            $$renderer4.push(`SELECCIONA UN CENTRO`);
          });
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(schools());
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let s = each_array[$$index];
            $$renderer3.option({ value: s.id }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(s.name.toUpperCase())}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      );
      $$renderer2.push(`</div>`);
    }
    $$renderer2.push(`<!--]--></div></div></section> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="space-y-6"><div class="glass-panel p-8 space-y-4"><h3 class="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">`);
    Info($$renderer2, { class: "w-4 h-4 text-primary-400" });
    $$renderer2.push(`<!----> Recomendaciones</h3> <ul class="space-y-4"><li class="flex gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></div> <p class="text-xs text-surface-400 leading-relaxed font-medium">Usa nombres que incluyan nivel o horario para mayor claridad.</p></li> <li class="flex gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></div> <p class="text-xs text-surface-400 leading-relaxed font-medium">Cada clase hereda las habilidades configuradas para el centro.</p></li></ul></div> <div class="p-8 border-2 border-primary-500/20 rounded-3xl bg-primary-500/5"><p class="text-[10px] font-black text-surface-500 uppercase text-center tracking-widest">Presiona <kbd class="bg-surface-900 px-2 py-1 rounded text-primary-400 border border-surface-800 shadow-sm">CTRL+ENTER</kbd> para guardar</p></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
