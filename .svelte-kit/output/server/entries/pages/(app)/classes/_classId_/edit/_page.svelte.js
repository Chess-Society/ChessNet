import { e as ensure_array_like, h as head, d as escape_html, i as attr, f as attr_class, m as maybe_selected, p as pop, k as push } from "../../../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { P as Pen_line } from "../../../../../../chunks/pen-line.js";
import { X } from "../../../../../../chunks/x.js";
import { S as Save } from "../../../../../../chunks/save.js";
import { B as Book_open } from "../../../../../../chunks/book-open.js";
import { C as Clock } from "../../../../../../chunks/clock.js";
import { U as Users } from "../../../../../../chunks/users.js";
import { T as Triangle_alert } from "../../../../../../chunks/triangle-alert.js";
import { R as Rotate_ccw } from "../../../../../../chunks/rotate-ccw.js";
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  let classData = data.class;
  let schools = data.schools || [];
  let formData = {
    name: "",
    description: "",
    college_id: "",
    schedule: "",
    max_students: 12,
    level: "beginner"
  };
  let isSubmitting = false;
  let errors = {};
  const levelOptions = [
    { value: "beginner", label: "PRINCIPIANTE" },
    { value: "intermediate", label: "INTERMEDIO" },
    { value: "advanced", label: "AVANZADO" },
    { value: "mixed", label: "MIXTO" }
  ];
  const each_array = ensure_array_like(schools);
  const each_array_1 = ensure_array_like(levelOptions);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Editar ${escape_html(classData?.name)} - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="space-y-4"><button class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest">`);
  Arrow_left($$payload, {
    class: "w-4 h-4 transition-transform group-hover:-translate-x-1"
  });
  $$payload.out.push(`<!----> Regresar a Clase</button> <div class="flex items-center gap-6"><div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">`);
  Pen_line($$payload, { class: "w-8 h-8" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-3xl font-black text-white tracking-tighter uppercase">Editar Grupo</h1> <p class="text-surface-500 text-sm font-medium uppercase tracking-widest">Ajustando detalles de ${escape_html(classData?.name)}</p></div></div></div> <div class="flex items-center gap-3"><button class="btn-ghost flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"${attr("disabled", isSubmitting, true)}>`);
  X($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> Descartar</button> <button${attr("disabled", isSubmitting, true)} class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/20 flex items-center gap-3">`);
  {
    $$payload.out.push("<!--[!-->");
    Save($$payload, { class: "w-4 h-4" });
    $$payload.out.push(`<!----> <span>Guardar Cambios</span>`);
  }
  $$payload.out.push(`<!--]--></button></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-10"><div class="lg:col-span-2 space-y-8"><section class="glass-panel p-8 space-y-8 border-t-4 border-primary-500"><h2 class="text-white font-black uppercase tracking-tight flex items-center gap-3">`);
  Book_open($$payload, { class: "w-5 h-5 text-primary-400" });
  $$payload.out.push(`<!----> Información Curricular</h2> <div class="space-y-6"><div class="space-y-2"><label for="name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre del Grupo</label> <input id="name" type="text"${attr("value", formData.name)}${attr_class(`w-full bg-surface-950 border rounded-xl px-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all ${errors.name ? "border-red-500" : "border-surface-800"}`)}/></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-2"><label for="college" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Centro Educativo</label> <select id="college" class="w-full bg-surface-950 border border-surface-800 rounded-xl px-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all cursor-pointer">`);
  $$payload.select_value = formData.college_id;
  $$payload.out.push(`<!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let s = each_array[$$index];
    $$payload.out.push(`<option${attr("value", s.id)}${maybe_selected($$payload, s.id)}>${escape_html(s.name.toUpperCase())}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <div class="space-y-2"><label for="level" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nivel Recomendado</label> <select id="level" class="w-full bg-surface-950 border border-surface-800 rounded-xl px-5 py-4 text-white font-bold focus:border-primary-500/50 outline-none transition-all cursor-pointer">`);
  $$payload.select_value = formData.level;
  $$payload.out.push(`<!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let opt = each_array_1[$$index_1];
    $$payload.out.push(`<option${attr("value", opt.value)}${maybe_selected($$payload, opt.value)}>${escape_html(opt.label)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div></div> <div class="space-y-2"><label for="desc" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Descripción del Enfoque</label> <textarea id="desc" rows="3" class="w-full bg-surface-950 border border-surface-800 rounded-xl px-5 py-4 text-white font-medium focus:border-primary-500/50 outline-none transition-all resize-none" placeholder="Ej: Orientado a la táctica básica y finales elementales...">`);
  const $$body = escape_html(formData.description);
  if ($$body) {
    $$payload.out.push(`${$$body}`);
  }
  $$payload.out.push(`</textarea></div></div></section> <section class="glass-panel p-8 space-y-8 border-t-4 border-blue-500"><h2 class="text-white font-black uppercase tracking-tight flex items-center gap-3">`);
  Clock($$payload, { class: "w-5 h-5 text-blue-400" });
  $$payload.out.push(`<!----> Logística y Horarios</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div class="space-y-2"><label for="schedule" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Horario de Sesiones</label> <div class="relative group">`);
  Clock($$payload, {
    class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700"
  });
  $$payload.out.push(`<!----> <input id="schedule" type="text"${attr("value", formData.schedule)} class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all" placeholder="Ej: Martes 17:00 - 18:30"/></div></div> <div class="space-y-2"><label for="max" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Capacidad Máxima (Alumnos)</label> <div class="relative group">`);
  Users($$payload, {
    class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700"
  });
  $$payload.out.push(`<!----> <input id="max" type="number"${attr("value", formData.max_students)} class="w-full bg-surface-950 border border-surface-800 rounded-xl pl-12 pr-5 py-4 text-white focus:border-primary-500/50 outline-none transition-all"/></div></div></div></section></div> <div class="space-y-8"><div class="glass-panel p-8 space-y-6"><h3 class="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">`);
  Triangle_alert($$payload, { class: "w-4 h-4 text-primary-400" });
  $$payload.out.push(`<!----> Consideraciones</h3> <ul class="space-y-4"><li class="flex gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></div> <p class="text-[10px] text-surface-400 font-bold uppercase tracking-wider leading-relaxed">Cambiar el nivel actualizará los objetivos sugeridos para el grupo.</p></li> <li class="flex gap-3"><div class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></div> <p class="text-[10px] text-surface-400 font-bold uppercase tracking-wider leading-relaxed">La capacidad afecta al cálculo de ingresos estimados del centro.</p></li></ul></div> <div class="p-8 border-2 border-primary-500/20 rounded-3xl bg-primary-500/5 space-y-4"><div class="flex items-center gap-4 text-primary-400 mb-2">`);
  Rotate_ccw($$payload, { class: "w-6 h-6" });
  $$payload.out.push(`<!----> <h3 class="text-xs font-black uppercase tracking-widest">Historial</h3></div> <p class="text-[10px] text-surface-500 font-bold uppercase leading-relaxed">Puedes revertir cambios si no has guardado todavía. Una vez guardados, los reportes se generarán con la nueva información.</p></div></div></div></div>`);
  pop();
}
export {
  _page as default
};
