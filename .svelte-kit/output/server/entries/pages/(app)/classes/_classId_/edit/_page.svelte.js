import { k as ensure_array_like, i as head, e as escape_html, l as attr, j as attr_class, m as maybe_selected, d as bind_props, p as pop, f as push } from "../../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { B as Book_open } from "../../../../../../chunks/book-open.js";
import { R as Rotate_ccw } from "../../../../../../chunks/rotate-ccw.js";
import { E as Eye } from "../../../../../../chunks/eye.js";
import { S as Save } from "../../../../../../chunks/save.js";
import { T as Target } from "../../../../../../chunks/target.js";
import { C as Clock } from "../../../../../../chunks/clock.js";
import { U as Users } from "../../../../../../chunks/users.js";
import { C as Circle_check_big } from "../../../../../../chunks/circle-check-big.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let classData = data.class;
  let schools = data.schools || [];
  data.suggestedSchedules || {};
  data.suggestedCapacities || {};
  let formData = {
    name: classData?.name || "",
    description: classData?.description || "",
    college_id: classData?.college_id || "",
    schedule: classData?.schedule || "",
    max_students: classData?.max_students || 12,
    level: classData?.level || "beginner"
  };
  let errors = {};
  const levelOptions = [
    {
      value: "beginner",
      label: "Principiante",
      color: "text-green-400"
    },
    {
      value: "intermediate",
      label: "Intermedio",
      color: "text-yellow-400"
    },
    { value: "advanced", label: "Avanzado", color: "text-red-400" },
    { value: "mixed", label: "Mixto", color: "text-purple-400" }
  ];
  const hasChanges = () => {
    return formData.name !== (classData?.name || "") || formData.description !== (classData?.description || "") || formData.college_id !== (classData?.college_id || "") || formData.schedule !== (classData?.schedule || "") || formData.max_students !== (classData?.max_students || 12) || formData.level !== (classData?.level || "beginner");
  };
  const each_array = ensure_array_like(schools);
  const each_array_1 = ensure_array_like(levelOptions);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Editar Clase - ${escape_html(classData?.name || "Clase")} - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="flex items-center space-x-3"><div class="p-2 bg-blue-500/20 rounded-lg">`);
  Book_open($$payload, { class: "w-6 h-6 text-blue-500" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold">Editar Clase</h1> <p class="text-sm text-slate-400">${escape_html(classData?.name)}</p></div></div></div> <div class="flex items-center space-x-3">`);
  if (hasChanges()) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<button class="btn-secondary svelte-mlurok">`);
    Rotate_ccw($$payload, { class: "w-4 h-4 mr-2" });
    $$payload.out.push(`<!----> Descartar Cambios</button>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <button class="btn-secondary svelte-mlurok">`);
  Eye($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> ${escape_html("Vista Previa")}</button> <button${attr("disabled", !hasChanges(), true)} class="btn-primary svelte-mlurok">`);
  {
    $$payload.out.push("<!--[!-->");
    Save($$payload, { class: "w-4 h-4 mr-2" });
    $$payload.out.push(`<!----> Guardar Cambios`);
  }
  $$payload.out.push(`<!--]--></button></div></div></div></header> <main class="container mx-auto px-4 py-8"><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-8"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h2 class="text-xl font-semibold mb-6">Información Básica</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label for="name" class="block text-sm font-medium text-slate-300 mb-2">Nombre de la Clase *</label> <input id="name" type="text"${attr("value", formData.name)}${attr_class(`input w-full ${errors.name ? "border-red-500" : ""}`, "svelte-mlurok")} placeholder="Ej: Principiantes Mañana"/> `);
  if (errors.name) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.name)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div><label for="college_id" class="block text-sm font-medium text-slate-300 mb-2">Centro Educativo *</label> <select id="college_id"${attr_class(`input w-full ${errors.college_id ? "border-red-500" : ""}`, "svelte-mlurok")}>`);
  $$payload.select_value = formData.college_id;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>Seleccionar centro</option><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let school = each_array[$$index];
    $$payload.out.push(`<option${attr("value", school.id)}${maybe_selected($$payload, school.id)}>${escape_html(school.name)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select> `);
  if (errors.college_id) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.college_id)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div><label for="level" class="block text-sm font-medium text-slate-300 mb-2">Nivel de la Clase</label> <select id="level" class="input w-full svelte-mlurok">`);
  $$payload.select_value = formData.level;
  $$payload.out.push(`<!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let option = each_array_1[$$index_1];
    $$payload.out.push(`<option${attr("value", option.value)}${maybe_selected($$payload, option.value)}>${escape_html(option.label)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div></div> <div class="mt-6"><label for="description" class="block text-sm font-medium text-slate-300 mb-2">Descripción</label> <textarea id="description" class="input w-full h-24 resize-none svelte-mlurok" placeholder="Describe el enfoque y objetivos de la clase...">`);
  const $$body = escape_html(formData.description);
  if ($$body) {
    $$payload.out.push(`${$$body}`);
  }
  $$payload.out.push(`</textarea></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h2 class="text-xl font-semibold mb-6">Horario y Capacidad</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label for="schedule" class="block text-sm font-medium text-slate-300 mb-2">Horario</label> <input id="schedule" type="text"${attr("value", formData.schedule)} class="input w-full svelte-mlurok" placeholder="Ej: Lunes y Miércoles 10:00-11:00"/></div> <div><label for="max_students" class="block text-sm font-medium text-slate-300 mb-2">Capacidad Máxima *</label> <input id="max_students" type="number"${attr("value", formData.max_students)}${attr_class(`input w-full ${errors.max_students ? "border-red-500" : ""}`, "svelte-mlurok")} min="1" max="50"/> `);
  if (errors.max_students) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.max_students)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div></div></div> <div class="space-y-6">`);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h3 class="font-semibold mb-4">Consejos</h3> <div class="space-y-3 text-sm text-slate-400"><div class="flex items-start space-x-2">`);
  Target($$payload, { class: "w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" });
  $$payload.out.push(`<!----> <p>Ajusta la capacidad según el nivel: principiantes necesitan más atención individual.</p></div> <div class="flex items-start space-x-2">`);
  Clock($$payload, { class: "w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" });
  $$payload.out.push(`<!----> <p>Los horarios matutinos funcionan mejor para niños pequeños.</p></div> <div class="flex items-start space-x-2">`);
  Book_open($$payload, { class: "w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" });
  $$payload.out.push(`<!----> <p>Usa las notas del instructor para recordar metodologías específicas del grupo.</p></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h3 class="font-semibold mb-4">Gestión de la Clase</h3> <div class="space-y-3"><button class="w-full btn-secondary text-left svelte-mlurok">`);
  Users($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Gestionar Estudiantes</button> <button class="w-full btn-secondary text-left svelte-mlurok">`);
  Target($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Gestionar Temario</button> <button class="w-full btn-secondary text-left svelte-mlurok">`);
  Circle_check_big($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Control de Asistencia</button></div></div></div></div></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
