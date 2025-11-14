import { k as ensure_array_like, i as head, e as escape_html, l as attr, m as maybe_selected, j as attr_class, d as bind_props, p as pop, f as push } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../chunks/arrow-left.js";
import { G as Graduation_cap } from "../../../../chunks/graduation-cap.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { A as Activity } from "../../../../chunks/activity.js";
import { U as Users } from "../../../../chunks/users.js";
import { S as School } from "../../../../chunks/school.js";
import { S as Search } from "../../../../chunks/search.js";
import { F as Funnel } from "../../../../chunks/funnel.js";
import { S as Square_pen } from "../../../../chunks/square-pen.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { B as Book_open } from "../../../../chunks/book-open.js";
import { E as Eye } from "../../../../chunks/eye.js";
import { U as User_plus } from "../../../../chunks/user-plus.js";
import { T as Target } from "../../../../chunks/target.js";
import { U as User_check } from "../../../../chunks/user-check.js";
function _page($$payload, $$props) {
  push();
  let filteredClasses;
  let data = $$props["data"];
  let classes = data.classes || [];
  let stats = data.stats || {
    totalStudents: 0
  };
  let schools = data.schools || [];
  let searchQuery = "";
  let selectedLevel = "";
  let selectedSchool = "";
  const getSchoolName = (collegeId) => {
    const school = schools.find((s) => s.id === collegeId);
    return school?.name || "Centro no asignado";
  };
  filteredClasses = classes.filter((classItem) => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) || classItem.description && classItem.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !selectedLevel;
    const matchesSchool = !selectedSchool;
    return matchesSearch && matchesLevel && matchesSchool;
  });
  const each_array = ensure_array_like(
    // Usar el endpoint DELETE de la API
    // Eliminar del array local
    // Funciones para mejorar UX
    schools
  );
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Clases - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-6"><div class="flex items-center justify-between mb-6"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="flex items-center space-x-3"><div class="p-2 bg-blue-500/20 rounded-lg">`);
  Graduation_cap($$payload, { class: "w-6 h-6 text-blue-500" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold">Clases</h1> <p class="text-sm text-slate-400">Gestión de grupos y aulas</p></div></div></div> <div class="flex items-center space-x-3"><button class="btn-primary">`);
  Plus($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Nueva Clase</button></div></div> `);
  if (classes.length > 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600"><div class="flex items-center justify-between"><div><p class="text-sm text-slate-400">Total Clases</p> <p class="text-2xl font-bold text-white">${escape_html(classes.length)}</p></div> <div class="bg-blue-500/20 p-3 rounded-lg">`);
    Graduation_cap($$payload, { class: "w-6 h-6 text-blue-400" });
    $$payload.out.push(`<!----></div></div></div> <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600"><div class="flex items-center justify-between"><div><p class="text-sm text-slate-400">Total Estudiantes</p> <p class="text-2xl font-bold text-white">${escape_html(stats.totalStudents)}</p></div> <div class="bg-green-500/20 p-3 rounded-lg">`);
    Activity($$payload, { class: "w-6 h-6 text-green-400" });
    $$payload.out.push(`<!----></div></div></div> <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600"><div class="flex items-center justify-between"><div><p class="text-sm text-slate-400">Estudiantes</p> <p class="text-2xl font-bold text-white">${escape_html(stats.totalStudents)}</p></div> <div class="bg-purple-500/20 p-3 rounded-lg">`);
    Users($$payload, { class: "w-6 h-6 text-purple-400" });
    $$payload.out.push(`<!----></div></div></div> <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600"><div class="flex items-center justify-between"><div><p class="text-sm text-slate-400">Centros</p> <p class="text-2xl font-bold text-white">${escape_html(schools.length)}</p></div> <div class="bg-orange-500/20 p-3 rounded-lg">`);
    School($$payload, { class: "w-6 h-6 text-orange-400" });
    $$payload.out.push(`<!----></div></div></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></header> <main class="container mx-auto px-4 py-8"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8"><div class="grid grid-cols-1 md:grid-cols-5 gap-4"><div class="relative">`);
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
  });
  $$payload.out.push(`<!----> <input type="text" placeholder="Buscar clases..."${attr("value", searchQuery)} class="input pl-10 w-full svelte-x773vi"/></div> <select class="input svelte-x773vi">`);
  $$payload.select_value = selectedLevel;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>Todos los niveles</option><option value="beginner"${maybe_selected($$payload, "beginner")}>Principiante</option><option value="intermediate"${maybe_selected($$payload, "intermediate")}>Intermedio</option><option value="advanced"${maybe_selected($$payload, "advanced")}>Avanzado</option><option value="mixed"${maybe_selected($$payload, "mixed")}>Mixto</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select> <select class="input svelte-x773vi">`);
  $$payload.select_value = selectedSchool;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>Todos los centros</option><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let school = each_array[$$index];
    $$payload.out.push(`<option${attr("value", school.id)}${maybe_selected($$payload, school.id)}>${escape_html(school.name)}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select> <button class="btn-secondary">`);
  Funnel($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Limpiar</button></div></div> `);
  {
    $$payload.out.push("<!--[!-->");
    if (filteredClasses.length === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="text-center py-12">`);
      Graduation_cap($$payload, { class: "w-16 h-16 text-slate-600 mx-auto mb-4" });
      $$payload.out.push(`<!----> <h3 class="text-xl font-semibold text-slate-400 mb-2">${escape_html("No hay clases registradas")}</h3> <p class="text-slate-500 mb-6">${escape_html("Comienza creando tu primera clase")}</p> `);
      {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<button class="btn-primary">`);
        Plus($$payload, { class: "w-4 h-4 mr-2" });
        $$payload.out.push(`<!----> Crear Primera Clase</button>`);
      }
      $$payload.out.push(`<!--]--></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      const each_array_1 = ensure_array_like(filteredClasses);
      $$payload.out.push(`<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"><!--[-->`);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let classItem = each_array_1[$$index_1];
        $$payload.out.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors group"><div class="flex items-start justify-between mb-4"><div class="flex items-center space-x-3"><div class="p-3 bg-blue-500/20 rounded-lg">`);
        Graduation_cap($$payload, { class: "w-6 h-6 text-blue-400" });
        $$payload.out.push(`<!----></div> <div><h3 class="font-semibold text-lg text-white">${escape_html(classItem.name)}</h3> <p class="text-sm text-slate-400">${escape_html(getSchoolName(classItem.college_id))}</p></div></div> <div class="flex items-center space-x-2"><span${attr_class(`px-2 py-1 rounded-full text-xs font-medium ${getClassStatusColor(classItem)} bg-slate-700/50`, "svelte-x773vi")}>${escape_html(getClassStatusText(classItem))}</span> <div class="opacity-0 group-hover:opacity-100 transition-opacity"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white" title="Editar clase">`);
        Square_pen($$payload, { class: "w-4 h-4" });
        $$payload.out.push(`<!----></button> <button class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400" title="Eliminar clase">`);
        Trash_2($$payload, { class: "w-4 h-4" });
        $$payload.out.push(`<!----></button></div></div></div> <div class="space-y-3 mb-4"><div class="flex items-center text-sm text-slate-400">`);
        Calendar($$payload, { class: "w-4 h-4 mr-2" });
        $$payload.out.push(`<!----> Creada ${escape_html(new Date(classItem.created_at).toLocaleDateString("es-ES"))}</div> <div class="flex items-center justify-between text-sm"><div class="flex items-center text-slate-400">`);
        Users($$payload, { class: "w-4 h-4 mr-1" });
        $$payload.out.push(`<!----> ~15 estudiantes</div> <div class="flex items-center text-slate-400">`);
        Book_open($$payload, { class: "w-4 h-4 mr-1" });
        $$payload.out.push(`<!----> ~5 temas</div></div></div> <div class="mt-4 pt-4 border-t border-slate-700"><div class="grid grid-cols-2 gap-2"><button class="btn-secondary text-sm py-2">`);
        Eye($$payload, { class: "w-4 h-4 mr-1" });
        $$payload.out.push(`<!----> Ver Detalles</button> <button class="btn-primary text-sm py-2">`);
        User_plus($$payload, { class: "w-4 h-4 mr-1" });
        $$payload.out.push(`<!----> Nuevo Estudiante</button></div> <div class="flex space-x-2 mt-2"><button class="flex-1 btn-secondary text-xs py-1">`);
        Users($$payload, { class: "w-3 h-3 mr-1" });
        $$payload.out.push(`<!----> Gestionar</button> <button class="flex-1 btn-secondary text-xs py-1">`);
        Target($$payload, { class: "w-3 h-3 mr-1" });
        $$payload.out.push(`<!----> Temario</button> <button class="flex-1 btn-secondary text-xs py-1">`);
        User_check($$payload, { class: "w-3 h-3 mr-1" });
        $$payload.out.push(`<!----> Lista</button></div></div></div>`);
      }
      $$payload.out.push(`<!--]--></div>`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
