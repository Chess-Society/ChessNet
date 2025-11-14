import { w as store_get, k as ensure_array_like, i as head, e as escape_html, l as attr, j as attr_class, m as maybe_selected, x as unsubscribe_stores, d as bind_props, p as pop, f as push } from "../../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "../../../../../../chunks/state.svelte.js";
import { p as page } from "../../../../../../chunks/stores.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { U as User } from "../../../../../../chunks/user.js";
import { R as Rotate_ccw } from "../../../../../../chunks/rotate-ccw.js";
import { S as Save } from "../../../../../../chunks/save.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let data = $$props["data"];
  let studentData = data.student;
  let schools = data.schools || [];
  let formData = {
    name: studentData?.name || "",
    first_name: studentData?.first_name || "",
    last_name: studentData?.last_name || "",
    college_id: studentData?.college_id || "",
    notes: studentData?.notes || ""
  };
  let errors = {};
  const hasChanges = () => {
    return formData.name !== (studentData?.name || "") || formData.first_name !== (studentData?.first_name || "") || formData.last_name !== (studentData?.last_name || "") || formData.college_id !== (studentData?.college_id || "") || formData.notes !== (studentData?.notes || "");
  };
  {
    const urlCollegeId = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("college_id");
    if (urlCollegeId && !formData.college_id) {
      formData.college_id = urlCollegeId;
    }
  }
  const each_array = ensure_array_like(
    // Form state
    // Función para obtener el nombre del centro
    // Redirigir según el parámetro return_to
    schools
  );
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Editar Estudiante - ${escape_html(studentData?.name || "Estudiante")} - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="flex items-center space-x-3"><div class="p-2 bg-green-500/20 rounded-lg">`);
  User($$payload, { class: "w-6 h-6 text-green-500" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold">Editar Estudiante</h1> <p class="text-sm text-slate-400">${escape_html(studentData?.name)}</p></div></div></div> <div class="flex items-center space-x-3">`);
  if (hasChanges()) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<button class="btn-secondary svelte-mlurok">`);
    Rotate_ccw($$payload, { class: "w-4 h-4 mr-2" });
    $$payload.out.push(`<!----> Descartar Cambios</button>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <button${attr("disabled", !hasChanges(), true)} class="btn-primary svelte-mlurok">`);
  {
    $$payload.out.push("<!--[!-->");
    Save($$payload, { class: "w-4 h-4 mr-2" });
    $$payload.out.push(`<!----> Guardar Cambios`);
  }
  $$payload.out.push(`<!--]--></button></div></div></div></header> <main class="container mx-auto px-4 py-8"><div class="max-w-2xl mx-auto"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h2 class="text-xl font-semibold mb-6">Editar Estudiante</h2> `);
  if (store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("college_id")) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"><div class="flex items-center"><div class="w-2 h-2 bg-blue-400 rounded-full mr-3"></div> <p class="text-blue-300 text-sm"><strong>Centro asignado automáticamente:</strong> El estudiante se ha asignado al centro de la clase desde donde se está editando.</p></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="space-y-6"><div><label for="name" class="block text-sm font-medium text-slate-300 mb-2">Nombre Completo *</label> <input id="name" type="text"${attr("value", formData.name)}${attr_class(`input w-full ${errors.name ? "border-red-500" : ""}`, "svelte-mlurok")} placeholder="Nombre completo del estudiante"/> `);
  if (errors.name) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.name)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div><label for="first_name" class="block text-sm font-medium text-slate-300 mb-2">Nombre</label> <input id="first_name" type="text"${attr("value", formData.first_name)} class="input w-full svelte-mlurok" placeholder="Nombre del estudiante"/></div> <div><label for="last_name" class="block text-sm font-medium text-slate-300 mb-2">Apellidos</label> <input id="last_name" type="text"${attr("value", formData.last_name)} class="input w-full svelte-mlurok" placeholder="Apellidos del estudiante"/></div> <div><label for="college_id" class="block text-sm font-medium text-slate-300 mb-2">Centro Educativo</label> <select id="college_id" class="input w-full svelte-mlurok">`);
  $$payload.select_value = formData.college_id;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>Seleccionar centro</option><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let school = each_array[$$index];
    $$payload.out.push(`<option${attr("value", school.id)}${maybe_selected($$payload, school.id)}>${escape_html(school.name)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <div><label for="notes" class="block text-sm font-medium text-slate-300 mb-2">Notas</label> <textarea id="notes" class="input w-full h-24 resize-none svelte-mlurok" placeholder="Notas sobre el estudiante...">`);
  const $$body = escape_html(formData.notes);
  if ($$body) {
    $$payload.out.push(`${$$body}`);
  }
  $$payload.out.push(`</textarea></div></div></div></div></main></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
