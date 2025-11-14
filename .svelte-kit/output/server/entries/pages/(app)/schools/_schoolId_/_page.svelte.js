import { i as head, e as escape_html, l as attr, m as maybe_selected, k as ensure_array_like, h as stringify, j as attr_class, d as bind_props, p as pop, f as push } from "../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { S as School } from "../../../../../chunks/school.js";
import { S as Square_pen } from "../../../../../chunks/square-pen.js";
import { P as Plus } from "../../../../../chunks/plus.js";
import { M as Map_pin } from "../../../../../chunks/map-pin.js";
import { P as Phone } from "../../../../../chunks/phone.js";
import { M as Mail } from "../../../../../chunks/mail.js";
import { G as Globe } from "../../../../../chunks/globe.js";
import { G as Graduation_cap } from "../../../../../chunks/graduation-cap.js";
import { U as Users } from "../../../../../chunks/users.js";
import { T as Target } from "../../../../../chunks/target.js";
import { T as Trending_up } from "../../../../../chunks/trending-up.js";
import { T as Trash_2 } from "../../../../../chunks/trash-2.js";
function _page($$payload, $$props) {
  push();
  let filteredClasses;
  let data = $$props["data"];
  let school = data.school;
  let classes = data.classes || [];
  let stats = data.stats || {
    totalClasses: 0,
    totalCapacity: 0,
    levels: { beginner: 0, intermediate: 0, advanced: 0, mixed: 0 }
  };
  let selectedLevel = "";
  let selectedStatus = "active";
  const levelColors = {
    beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    advanced: "bg-red-500/20 text-red-400 border-red-500/30",
    mixed: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  };
  const levelLabels = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
    mixed: "Mixto"
  };
  filteredClasses = classes.filter((classItem) => {
    const matchesLevel = !selectedLevel;
    const matchesStatus = selectedStatus === "active";
    return matchesLevel && matchesStatus;
  });
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html(school?.name || "Centro")} | ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-slate-900 text-white"><div class="bg-slate-800 border-b border-slate-700"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between h-16"><div class="flex items-center space-x-4"><button class="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----> <span>Volver a Centros</span></button> <div class="h-6 w-px bg-slate-600"></div> <div class="flex items-center space-x-3">`);
  School($$payload, { class: "w-6 h-6 text-blue-400" });
  $$payload.out.push(`<!----> <div><h1 class="text-xl font-semibold">${escape_html(school?.name || "Centro")}</h1> <p class="text-sm text-slate-400">Gestión de clases y estudiantes</p></div></div></div> <div class="flex items-center space-x-3"><button class="px-4 py-2 text-slate-300 hover:text-white transition-colors">`);
  Square_pen($$payload, { class: "w-4 h-4 mr-2 inline" });
  $$payload.out.push(`<!----> Editar Centro</button> <button class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">`);
  Plus($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> <span>Nueva Clase</span></button></div></div></div></div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8"><div class="flex items-start justify-between"><div class="flex-1"><h2 class="text-2xl font-bold text-white mb-2">${escape_html(school?.name)}</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">`);
  if (school?.city) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="flex items-center space-x-2">`);
    Map_pin($$payload, { class: "w-4 h-4 text-slate-500" });
    $$payload.out.push(`<!----> <span class="text-slate-300">${escape_html(school.city)}</span></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (school?.phone) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="flex items-center space-x-2">`);
    Phone($$payload, { class: "w-4 h-4 text-slate-500" });
    $$payload.out.push(`<!----> <span class="text-slate-300">${escape_html(school.phone)}</span></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (school?.email) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="flex items-center space-x-2">`);
    Mail($$payload, { class: "w-4 h-4 text-slate-500" });
    $$payload.out.push(`<!----> <span class="text-slate-300">${escape_html(school.email)}</span></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (school?.website) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="flex items-center space-x-2">`);
    Globe($$payload, { class: "w-4 h-4 text-slate-500" });
    $$payload.out.push(`<!----> <a${attr("href", school.website)} target="_blank" class="text-blue-400 hover:text-blue-300">Sitio web</a></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div></div></div> <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between"><div><span class="text-sm text-slate-400">Clases</span></div> `);
  Graduation_cap($$payload, { class: "w-8 h-8 text-blue-400" });
  $$payload.out.push(`<!----></div> <p class="text-2xl font-bold text-white">${escape_html(stats.totalClasses)}</p> <p class="text-xs text-slate-500">${escape_html(stats.levels.beginner)} principiantes, ${escape_html(stats.levels.intermediate)} intermedios, ${escape_html(stats.levels.advanced)} avanzados</p></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between"><div><span class="text-sm text-slate-400">Capacidad Total</span></div> `);
  Users($$payload, { class: "w-8 h-8 text-green-400" });
  $$payload.out.push(`<!----></div> <p class="text-2xl font-bold text-white">${escape_html(stats.totalCapacity)}</p> <p class="text-xs text-slate-500">estudiantes máximo</p></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between"><div><span class="text-sm text-slate-400">Niveles</span></div> `);
  Target($$payload, { class: "w-8 h-8 text-yellow-400" });
  $$payload.out.push(`<!----></div> <p class="text-2xl font-bold text-white">${escape_html(Object.values(stats.levels).reduce((a, b) => a + b, 0))}</p> <p class="text-xs text-slate-500">diferentes niveles</p></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between"><div><span class="text-sm text-slate-400">Estado</span></div> `);
  Trending_up($$payload, { class: "w-8 h-8 text-purple-400" });
  $$payload.out.push(`<!----></div> <p class="text-2xl font-bold text-white">Activo</p> <p class="text-xs text-slate-500">centro operativo</p></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6"><div class="flex flex-wrap items-center gap-4"><div class="flex items-center space-x-2"><label for="level_filter" class="text-sm font-medium text-slate-300">Nivel:</label> <select id="level_filter" class="input svelte-1ny4jsz">`);
  $$payload.select_value = selectedLevel;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>Todos los niveles</option><option value="beginner"${maybe_selected($$payload, "beginner")}>Principiante</option><option value="intermediate"${maybe_selected($$payload, "intermediate")}>Intermedio</option><option value="advanced"${maybe_selected($$payload, "advanced")}>Avanzado</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <div class="flex items-center space-x-2"><label for="status_filter" class="text-sm font-medium text-slate-300">Estado:</label> <select id="status_filter" class="input svelte-1ny4jsz">`);
  $$payload.select_value = selectedStatus;
  $$payload.out.push(`<option value="active"${maybe_selected($$payload, "active")}>Solo activas</option><option value="all"${maybe_selected($$payload, "all")}>Todas</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <button class="px-4 py-2 text-slate-400 hover:text-white transition-colors">Limpiar filtros</button></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between mb-6"><h3 class="text-xl font-semibold text-white">Clases del Centro</h3> <div class="flex items-center space-x-4"><span class="text-sm text-slate-400">${escape_html(filteredClasses.length)} clases</span> <button class="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">Ver todas las clases</button></div></div> `);
  if (filteredClasses.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="text-center py-12">`);
    Graduation_cap($$payload, { class: "w-16 h-16 text-slate-600 mx-auto mb-4" });
    $$payload.out.push(`<!----> <h3 class="text-xl font-semibold text-slate-400 mb-2">${escape_html("No hay clases en este centro")}</h3> <p class="text-slate-500 mb-6">${escape_html("Comienza creando la primera clase")}</p> `);
    {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<button class="btn-primary svelte-1ny4jsz">`);
      Plus($$payload, { class: "w-4 h-4 mr-2" });
      $$payload.out.push(`<!----> Crear Primera Clase</button>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array = ensure_array_like(filteredClasses);
    $$payload.out.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let classItem = each_array[$$index];
      $$payload.out.push(`<div class="bg-slate-700 border border-slate-600 rounded-xl p-6 hover:border-slate-500 transition-colors"><div class="flex items-start justify-between mb-4"><div class="flex-1"><button class="text-lg font-semibold text-white mb-2 cursor-pointer hover:text-blue-400 transition-colors text-left"${attr("aria-label", `Ver detalles de la clase ${stringify(classItem.name)}`)}>${escape_html(classItem.name)}</button></div> <div class="flex items-center space-x-2"><button class="p-2 hover:bg-slate-600 rounded-lg transition-colors" title="Editar clase">`);
      Square_pen($$payload, { class: "w-4 h-4 text-slate-400" });
      $$payload.out.push(`<!----></button> <button class="p-2 hover:bg-slate-600 rounded-lg transition-colors" title="Eliminar clase">`);
      Trash_2($$payload, { class: "w-4 h-4 text-red-400" });
      $$payload.out.push(`<!----></button></div></div> <div class="space-y-2 mb-4">`);
      if (classItem.max_students) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="flex items-center space-x-2 text-sm">`);
        Users($$payload, { class: "w-4 h-4 text-slate-500" });
        $$payload.out.push(`<!----> <span class="text-slate-300">Capacidad máxima: ${escape_html(classItem.max_students)} estudiantes</span></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></div> <div class="flex items-center justify-between"><span${attr_class(`px-3 py-1 rounded-full text-xs font-medium border ${levelColors[classItem.level] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`, "svelte-1ny4jsz")}>${escape_html(levelLabels[classItem.level] || classItem.level)}</span> <span class="px-3 py-1 rounded-full text-xs font-medium border bg-green-500/20 text-green-400 border-green-500/30">Activa</span></div></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></div></div></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
