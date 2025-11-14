import { w as store_get, i as head, l as attr, j as attr_class, e as escape_html, k as ensure_array_like, m as maybe_selected, x as unsubscribe_stores, d as bind_props, p as pop, f as push } from "../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "../../../../../chunks/state.svelte.js";
import { p as page } from "../../../../../chunks/stores.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { G as Graduation_cap } from "../../../../../chunks/graduation-cap.js";
import { X } from "../../../../../chunks/x.js";
import { S as Save } from "../../../../../chunks/save.js";
import { S as School } from "../../../../../chunks/school.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let collegeIdFromUrl, isPreSelectedCollege;
  let data = $$props["data"];
  let formData = { name: "", college_id: "" };
  let isSubmitting = false;
  let errors = {};
  const schools = data.schools || [];
  const getSchoolName = (schoolId) => {
    const school = schools.find((s) => s.id === schoolId);
    return school?.name || "";
  };
  collegeIdFromUrl = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("college_id");
  isPreSelectedCollege = !!collegeIdFromUrl;
  if (collegeIdFromUrl && schools.length > 0) {
    const collegeExists = schools.find((s) => s.id === collegeIdFromUrl);
    if (collegeExists) {
      formData.college_id = collegeIdFromUrl;
    }
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Nueva Clase - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="flex items-center space-x-3"><div class="p-2 bg-blue-500/20 rounded-lg">`);
  Graduation_cap($$payload, { class: "w-6 h-6 text-blue-500" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold">Nueva Clase</h1> <p class="text-sm text-slate-400">Crear un nuevo grupo/aula básico</p></div></div></div> <div class="flex items-center space-x-3"><button class="btn-secondary">`);
  X($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Cancelar</button> <button${attr("disabled", isSubmitting, true)} class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">`);
  {
    $$payload.out.push("<!--[!-->");
    Save($$payload, { class: "w-4 h-4 mr-2" });
    $$payload.out.push(`<!----> Crear Clase`);
  }
  $$payload.out.push(`<!--]--></button></div></div></div></header> <main class="container mx-auto px-4 py-8 max-w-4xl"><div class="bg-slate-800 border border-slate-700 rounded-xl p-8"><form class="space-y-8"><div><h2 class="text-xl font-semibold text-white mb-6 flex items-center">`);
  Graduation_cap($$payload, { class: "w-5 h-5 mr-2" });
  $$payload.out.push(`<!----> Información Esencial</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="md:col-span-2"><label for="name" class="block text-sm font-medium text-slate-300 mb-2">Nombre de la clase</label> <input id="name" type="text"${attr("value", formData.name)} placeholder="Ej: Principiantes Mañana, Intermedios Tarde..."${attr_class("input w-full svelte-1vhlwa4", void 0, { "border-red-500": errors.name })}/> `);
  if (errors.name) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.name)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="md:col-span-2"><label for="college_id" class="block text-sm font-medium text-slate-300 mb-2">`);
  School($$payload, { class: "w-4 h-4 inline mr-1" });
  $$payload.out.push(`<!----> Centro educativo</label> `);
  if (isPreSelectedCollege && formData.college_id) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"><div class="flex items-center space-x-2">`);
    School($$payload, { class: "w-4 h-4 text-blue-500" });
    $$payload.out.push(`<!----> <span>${escape_html(getSchoolName(formData.college_id))}</span> <span class="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">Pre-seleccionado</span></div></div> <p class="text-xs text-slate-400 mt-1">El centro se seleccionó automáticamente desde la página anterior</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array = ensure_array_like(schools);
    $$payload.out.push(`<select id="college_id"${attr_class("input w-full svelte-1vhlwa4", void 0, { "border-red-500": errors.college_id })}>`);
    $$payload.select_value = formData.college_id;
    $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>Selecciona un centro</option><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let school = each_array[$$index];
      $$payload.out.push(`<option${attr("value", school.id)}${maybe_selected($$payload, school.id)}>${escape_html(school.name)}</option>`);
    }
    $$payload.out.push(`<!--]-->`);
    $$payload.select_value = void 0;
    $$payload.out.push(`</select>`);
  }
  $$payload.out.push(`<!--]--> `);
  if (errors.college_id) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.college_id)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div></div> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="bg-slate-700/50 rounded-lg p-4"><h3 class="text-sm font-medium text-slate-300 mb-2">💡 Información</h3> <ul class="text-sm text-slate-400 space-y-1"><li>• Usa nombres descriptivos para identificar fácilmente la clase</li> <li>• Selecciona el centro educativo donde se impartirá la clase</li> <li>• La clase se creará con la información básica</li> <li>• Podrás agregar más detalles después de crear la clase</li></ul></div> <div class="text-xs text-slate-500 text-center">Presiona <kbd class="px-2 py-1 bg-slate-700 rounded text-slate-300 svelte-1vhlwa4">Ctrl + Enter</kbd> para crear rápidamente</div></form></div></main></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
