import { i as head, l as attr, e as escape_html, k as ensure_array_like, d as bind_props, p as pop, f as push } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/supabase.js";
import { A as Arrow_left } from "../../../../chunks/arrow-left.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { S as School } from "../../../../chunks/school.js";
import { B as Book_open } from "../../../../chunks/book-open.js";
import { U as Users } from "../../../../chunks/users.js";
import { M as Map_pin } from "../../../../chunks/map-pin.js";
import { S as Square_pen } from "../../../../chunks/square-pen.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { E as Eye } from "../../../../chunks/eye.js";
const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let schools = data.schools || [];
  let isLoading = false;
  let deletingId = null;
  const getTotalClasses = () => {
    return schools.length * 2;
  };
  const getTotalStudents = () => {
    return schools.length * 15;
  };
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Mis Centros - ChessNet</title>`;
  });
  {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<div class="min-h-screen bg-slate-900"><header class="bg-slate-800 border-b border-slate-700"><div class="container mx-auto px-4 py-6"><div class="flex items-center justify-between mb-6"><div class="flex items-center space-x-4"><button class="text-slate-400 hover:text-white transition-colors">`);
    Arrow_left($$payload, { class: "w-5 h-5" });
    $$payload.out.push(`<!----></button> <h1 class="text-2xl font-bold text-white">Mis Centros</h1></div> <div class="flex items-center space-x-3"><button${attr("disabled", isLoading, true)} class="btn-secondary">${escape_html("Actualizar")}</button> <button class="btn-primary">`);
    Plus($$payload, { class: "w-4 h-4 mr-2" });
    $$payload.out.push(`<!----> Nuevo centro</button></div></div> `);
    if (schools.length > 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600"><div class="flex items-center justify-between"><div><p class="text-sm text-slate-400">Total Centros</p> <p class="text-2xl font-bold text-white">${escape_html(schools.length)}</p></div> <div class="bg-blue-500/20 p-3 rounded-lg">`);
      School($$payload, { class: "w-6 h-6 text-blue-400" });
      $$payload.out.push(`<!----></div></div></div> <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600"><div class="flex items-center justify-between"><div><p class="text-sm text-slate-400">Clases Estimadas</p> <p class="text-2xl font-bold text-white">${escape_html(getTotalClasses())}</p></div> <div class="bg-green-500/20 p-3 rounded-lg">`);
      Book_open($$payload, { class: "w-6 h-6 text-green-400" });
      $$payload.out.push(`<!----></div></div></div> <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600"><div class="flex items-center justify-between"><div><p class="text-sm text-slate-400">Estudiantes Estimados</p> <p class="text-2xl font-bold text-white">${escape_html(getTotalStudents())}</p></div> <div class="bg-purple-500/20 p-3 rounded-lg">`);
      Users($$payload, { class: "w-6 h-6 text-purple-400" });
      $$payload.out.push(`<!----></div></div></div></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div></header> <main class="container mx-auto px-4 py-8">`);
    if (schools.length === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="text-center py-16"><div class="bg-slate-800 rounded-2xl p-8 max-w-md mx-auto">`);
      School($$payload, { class: "w-16 h-16 text-primary-500 mx-auto mb-4" });
      $$payload.out.push(`<!----> <h2 class="text-2xl font-bold mb-4">No tienes centros aún</h2> <p class="text-slate-400 mb-6">Crea tu primer centro educativo para comenzar a organizar tus clases de ajedrez</p> <button class="btn-primary">`);
      Plus($$payload, { class: "w-4 h-4 mr-2" });
      $$payload.out.push(`<!----> Crear mi primer centro</button></div></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      const each_array = ensure_array_like(schools);
      $$payload.out.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let school = each_array[$$index];
        $$payload.out.push(`<div class="card group hover:border-primary-500/50 transition-all duration-200"><div class="flex items-start justify-between mb-4"><div class="flex items-center space-x-3"><div class="bg-primary-600 p-3 rounded-lg">`);
        School($$payload, { class: "w-6 h-6 text-white" });
        $$payload.out.push(`<!----></div> <div><h3 class="font-semibold text-lg text-white">${escape_html(school.name)}</h3> `);
        if (school.city) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<div class="flex items-center text-sm text-slate-400">`);
          Map_pin($$payload, { class: "w-4 h-4 mr-1" });
          $$payload.out.push(`<!----> ${escape_html(school.city)}</div>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--></div></div> <div class="opacity-0 group-hover:opacity-100 transition-opacity"><div class="flex space-x-1"><button class="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors" title="Editar centro">`);
        Square_pen($$payload, { class: "w-4 h-4" });
        $$payload.out.push(`<!----></button> <button${attr("disabled", deletingId === school.id, true)} class="p-2 rounded-lg bg-red-700 hover:bg-red-600 transition-colors disabled:opacity-50" title="Eliminar centro">`);
        if (deletingId === school.id) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>`);
        } else {
          $$payload.out.push("<!--[!-->");
          Trash_2($$payload, { class: "w-4 h-4" });
        }
        $$payload.out.push(`<!--]--></button></div></div></div> <div class="space-y-3 mb-4"><div class="flex items-center text-sm text-slate-400">`);
        Calendar($$payload, { class: "w-4 h-4 mr-2" });
        $$payload.out.push(`<!----> Creado ${escape_html(formatDate(school.created_at))}</div> <div class="flex items-center justify-between text-sm"><div class="flex items-center text-slate-400">`);
        Book_open($$payload, { class: "w-4 h-4 mr-1" });
        $$payload.out.push(`<!----> ~2 clases</div> <div class="flex items-center text-slate-400">`);
        Users($$payload, { class: "w-4 h-4 mr-1" });
        $$payload.out.push(`<!----> ~15 estudiantes</div></div></div> <div class="mt-4 pt-4 border-t border-slate-700"><div class="flex space-x-2"><button class="flex-1 btn-secondary text-sm py-2">`);
        Eye($$payload, { class: "w-4 h-4 mr-1" });
        $$payload.out.push(`<!----> Ver Detalles</button> <button class="flex-1 btn-primary text-sm py-2">`);
        Plus($$payload, { class: "w-4 h-4 mr-1" });
        $$payload.out.push(`<!----> Nueva Clase</button></div></div></div>`);
      }
      $$payload.out.push(`<!--]--></div>`);
    }
    $$payload.out.push(`<!--]--></main></div>`);
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
