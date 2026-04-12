import { h as head, i as attr, a as attr_class, c as escape_html, e as ensure_array_like, j as derived } from "../../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/root.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { C as Circle_user } from "../../../../../../chunks/circle-user.js";
import { R as Rotate_ccw } from "../../../../../../chunks/rotate-ccw.js";
import { S as Save } from "../../../../../../chunks/save.js";
import { U as User } from "../../../../../../chunks/user.js";
import { F as File_text } from "../../../../../../chunks/file-text.js";
import { S as School } from "../../../../../../chunks/school.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let studentData = derived(() => data.student);
    let schools = derived(() => data.schools || []);
    let formData = {
      name: "",
      first_name: "",
      last_name: "",
      college_id: "",
      notes: ""
    };
    let errors = {};
    const hasChanges = derived(() => formData.name !== (studentData()?.name || "") || formData.first_name !== (studentData()?.first_name || "") || formData.last_name !== (studentData()?.last_name || "") || formData.college_id !== (studentData()?.college_id || "") || formData.notes !== (studentData()?.notes || ""));
    head("xware1", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Editar Alumno - ${escape_html(studentData()?.name)} - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="space-y-4"><button class="flex items-center gap-2 text-surface-500 hover:text-primary-400 transition-colors group text-xs font-black uppercase tracking-widest">`);
    Arrow_left($$renderer2, {
      class: "w-4 h-4 transition-transform group-hover:-translate-x-1"
    });
    $$renderer2.push(`<!----> Regresar a Lista</button> <div class="flex items-center gap-6"><div class="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-3xl flex items-center justify-center text-primary-400 shadow-2xl shadow-primary-500/10">`);
    Circle_user($$renderer2, { class: "w-8 h-8" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">Editar Alumno</h1> <p class="text-surface-500 text-sm font-medium uppercase tracking-widest mt-1">Configuración del Perfil</p></div></div></div> <div class="flex items-center gap-3">`);
    if (hasChanges()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="bg-surface-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-surface-800 hover:border-surface-700 transition-all flex items-center gap-2">`);
      Rotate_ccw($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Descartar</button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button${attr("disabled", !hasChanges(), true)} class="bg-primary-500 text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/10 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">`);
    {
      $$renderer2.push("<!--[-1-->");
      Save($$renderer2, { class: "w-4 h-4" });
    }
    $$renderer2.push(`<!--]--> Guardar Cambios</button></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-10"><div class="lg:col-span-2 space-y-8"><section class="glass-panel p-10 space-y-10"><div class="flex items-center gap-3 border-b border-surface-900 pb-6">`);
    User($$renderer2, { class: "w-5 h-5 text-primary-400" });
    $$renderer2.push(`<!----> <h2 class="text-lg font-black text-white uppercase tracking-tight">Información Personal</h2></div> <div class="grid grid-cols-1 gap-8"><div class="space-y-3"><label for="name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre Completo (Obligatorio)</label> <input id="name" type="text"${attr("value", formData.name)} placeholder="EJ: JUAN PÉREZ GARCÍA"${attr_class(`w-full bg-surface-950 border rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white outline-none transition-all placeholder:text-surface-800 ${errors.name ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-surface-900 focus:border-primary-500/50"}`)}/> `);
    if (errors.name) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-[10px] font-bold uppercase tracking-tight ml-4">${escape_html(errors.name)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="space-y-3"><label for="first_name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Nombre(s)</label> <input id="first_name" type="text"${attr("value", formData.first_name)} class="w-full bg-surface-950 border border-surface-900 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all"/></div> <div class="space-y-3"><label for="last_name" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Apellidos</label> <input id="last_name" type="text"${attr("value", formData.last_name)} class="w-full bg-surface-950 border border-surface-900 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all"/></div></div></div></section> <section class="glass-panel p-10 space-y-10"><div class="flex items-center gap-3 border-b border-surface-900 pb-6">`);
    File_text($$renderer2, { class: "w-5 h-5 text-primary-400" });
    $$renderer2.push(`<!----> <h2 class="text-lg font-black text-white uppercase tracking-tight">Observaciones Académicas</h2></div> <div class="space-y-3"><label for="notes" class="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Notas del Instructor</label> <textarea id="notes" placeholder="Añade comentarios sobre su estilo de juego, aperturas favoritas o áreas de mejora..." class="w-full bg-surface-950 border border-surface-900 rounded-2xl px-6 py-4 text-xs font-bold uppercase tracking-widest text-white h-48 resize-none focus:border-primary-500/50 outline-none transition-all placeholder:text-surface-800">`);
    const $$body = escape_html(formData.notes);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div></section></div> <div class="space-y-8"><section class="glass-panel p-8 space-y-8 border-t-4 border-blue-500"><div class="flex items-center gap-3">`);
    School($$renderer2, { class: "w-5 h-5 text-blue-400" });
    $$renderer2.push(`<!----> <h3 class="text-sm font-black text-white uppercase tracking-tighter">Centro Asociado</h3></div> <div class="space-y-4">`);
    $$renderer2.select(
      {
        value: formData.college_id,
        class: "w-full bg-surface-950 border border-surface-900 rounded-2xl px-5 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-blue-500/50 outline-none transition-all appearance-none cursor-pointer"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`SIN ASIGNAR`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(schools());
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let school = each_array[$$index];
          $$renderer3.option({ value: school.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(school.name.toUpperCase())}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(` <p class="text-[9px] font-black text-surface-600 uppercase tracking-[0.2em] leading-relaxed italic">La asociación a un centro educativo permite incluir al alumno en las clases correspondientes y generar informes institucionales.</p></div></section> <section class="glass-panel p-8 space-y-6"><h3 class="text-xs font-black text-surface-500 uppercase tracking-widest border-b border-surface-900 pb-4 italic">Vista Previa del Perfil</h3> <div class="flex items-center gap-4"><div class="w-12 h-12 bg-surface-950 border border-surface-900 rounded-xl flex items-center justify-center text-primary-400 font-black">${escape_html("?")}</div> <div><p class="text-[10px] font-black text-white uppercase tracking-tight truncate max-w-[150px]">${escape_html("SIN NOMBRE")}</p> <p class="text-[8px] font-black text-primary-400 uppercase tracking-widest">ALUMNO ACTIVO</p></div></div></section></div></div></div>`);
  });
}
export {
  _page as default
};
