import { k as ensure_array_like, i as head, e as escape_html, l as attr, m as maybe_selected, h as stringify, d as bind_props, p as pop, f as push } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../chunks/arrow-left.js";
import { U as Users } from "../../../../chunks/users.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { S as School } from "../../../../chunks/school.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { S as Search } from "../../../../chunks/search.js";
import { F as Funnel } from "../../../../chunks/funnel.js";
import { S as Square_pen } from "../../../../chunks/square-pen.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
function _page($$payload, $$props) {
  push();
  let filteredStudents;
  let data = $$props["data"];
  let students = data.students || [];
  let stats = data.stats || { total: 0, newest: null };
  let schools = data.schools || [];
  let searchQuery = "";
  let selectedSchool = "";
  const getSchoolName = (schoolId) => {
    const school = schools.find((s) => s.id === schoolId);
    return school ? school.name : "Sin asignar";
  };
  filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.first_name && student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) || student.last_name && student.last_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSchool = !selectedSchool;
    return matchesSearch && matchesSchool;
  });
  const each_array = ensure_array_like(
    // Función para obtener el nombre del centro
    // Eliminar del array local solo si la eliminación fue exitosa
    // Función eliminada - ya no manejamos estado activo/inactivo
    // Función eliminada - ya está declarada arriba
    schools
  );
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Estudiantes - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="flex items-center space-x-3"><div class="p-2 bg-green-500/20 rounded-lg">`);
  Users($$payload, { class: "w-6 h-6 text-green-500" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold">Estudiantes</h1> <p class="text-sm text-slate-400">Gestión de alumnado</p></div></div></div> <button class="btn-primary">`);
  Plus($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Nuevo Estudiante</button></div></div></header> <main class="container mx-auto px-4 py-8"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center space-x-3"><div class="p-2 bg-blue-500/20 rounded-lg">`);
  Users($$payload, { class: "w-5 h-5 text-blue-500" });
  $$payload.out.push(`<!----></div> <div><div class="text-2xl font-bold text-white">${escape_html(stats.total)}</div> <div class="text-sm text-slate-400">Total</div></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center space-x-3"><div class="p-2 bg-green-500/20 rounded-lg">`);
  School($$payload, { class: "w-5 h-5 text-green-500" });
  $$payload.out.push(`<!----></div> <div><div class="text-2xl font-bold text-white">${escape_html(schools.length)}</div> <div class="text-sm text-slate-400">Centros</div></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center space-x-3"><div class="p-2 bg-purple-500/20 rounded-lg">`);
  Calendar($$payload, { class: "w-5 h-5 text-purple-500" });
  $$payload.out.push(`<!----></div> <div><div class="text-2xl font-bold text-white">${escape_html(stats.newest ? new Date(stats.newest).toLocaleDateString("es-ES") : "N/A")}</div> <div class="text-sm text-slate-400">Último Registro</div></div></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8"><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="relative">`);
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
  });
  $$payload.out.push(`<!----> <input type="text" placeholder="Buscar estudiantes..."${attr("value", searchQuery)} class="input pl-10 w-full svelte-x773vi"/></div> <select class="input svelte-x773vi">`);
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
    if (filteredStudents.length === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="text-center py-12">`);
      Users($$payload, { class: "w-16 h-16 text-slate-600 mx-auto mb-4" });
      $$payload.out.push(`<!----> <h3 class="text-xl font-semibold text-slate-400 mb-2">${escape_html("No hay estudiantes registrados")}</h3> <p class="text-slate-500 mb-6">${escape_html("Comienza agregando tu primer estudiante")}</p> `);
      {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<button class="btn-primary">`);
        Plus($$payload, { class: "w-4 h-4 mr-2" });
        $$payload.out.push(`<!----> Agregar Primer Estudiante</button>`);
      }
      $$payload.out.push(`<!--]--></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      const each_array_1 = ensure_array_like(filteredStudents);
      $$payload.out.push(`<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"><!--[-->`);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let student = each_array_1[$$index_1];
        $$payload.out.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors"><div class="flex items-start justify-between mb-4"><div class="flex items-center space-x-3"><div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">${escape_html((student.first_name || "E").charAt(0))}${escape_html((student.last_name || "S").charAt(0))}</div> <div><button class="font-semibold text-white cursor-pointer hover:text-green-400 transition-colors text-left"${attr("aria-label", `Ver detalles del estudiante ${stringify(student.name)}`)}>${escape_html(student.name)}</button> <p class="text-sm text-slate-400">Estudiante</p></div></div> <div class="flex items-center space-x-2"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white">`);
        Square_pen($$payload, { class: "w-4 h-4" });
        $$payload.out.push(`<!----></button> <button class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400">`);
        Trash_2($$payload, { class: "w-4 h-4" });
        $$payload.out.push(`<!----></button></div></div> <div class="space-y-3 mb-4"><div class="flex items-center space-x-2 text-sm">`);
        School($$payload, { class: "w-4 h-4 text-slate-500" });
        $$payload.out.push(`<!----> <span class="text-slate-300">${escape_html(getSchoolName(student.college_id))}</span></div></div> `);
        if (student.notes) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<div class="mt-4 p-3 bg-slate-700/50 rounded-lg"><p class="text-xs text-slate-400 mb-1">Notas:</p> <p class="text-sm text-slate-300 leading-relaxed">${escape_html(student.notes)}</p></div>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--> <div class="mt-4 pt-4 border-t border-slate-700"><p class="text-xs text-slate-500">Registrado: ${escape_html(new Date(student.created_at).toLocaleDateString("es-ES"))}</p></div></div>`);
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
