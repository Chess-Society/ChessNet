import { d as sanitize_props, f as spread_props, g as slot, h as head, c as escape_html, e as ensure_array_like, a as attr_class, ah as clsx, i as attr, aj as bind_props } from "../../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/root.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { U as Users } from "../../../../../../chunks/users.js";
import { E as Eye } from "../../../../../../chunks/eye.js";
import { U as User_plus } from "../../../../../../chunks/user-plus.js";
import { U as User_check } from "../../../../../../chunks/user-check.js";
import { C as Chart_column } from "../../../../../../chunks/chart-column.js";
import { A as Activity } from "../../../../../../chunks/activity.js";
import { C as Calendar } from "../../../../../../chunks/calendar.js";
import { S as Square_pen } from "../../../../../../chunks/square-pen.js";
import { I as Icon } from "../../../../../../chunks/Icon.js";
import { S as Search } from "../../../../../../chunks/search.js";
import { C as Circle_alert } from "../../../../../../chunks/circle-alert.js";
import { M as Mail } from "../../../../../../chunks/mail.js";
function User_minus($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
    ["circle", { "cx": "9", "cy": "7", "r": "4" }],
    ["line", { "x1": "22", "x2": "16", "y1": "11", "y2": "11" }]
  ];
  Icon($$renderer, spread_props([
    { name: "user-minus" },
    $$sanitized_props,
    {
      /**
       * @component @name UserMinus
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg2YTQgNCAwIDAgMC00IDR2MiIgLz4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iNyIgcj0iNCIgLz4KICA8bGluZSB4MT0iMjIiIHgyPSIxNiIgeTE9IjExIiB5Mj0iMTEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/user-minus
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let filteredAvailableStudents;
    let data = $$props["data"];
    let classData = data.class;
    let enrolledStudents = data.enrolledStudents || [];
    let availableStudents = data.availableStudents || [];
    let stats = data.stats || { enrolled: 0, available: 0, capacity: 0, occupancyRate: 0 };
    let searchQuery = "";
    let isEnrolling = false;
    const levelColors = {
      beginner: "text-green-400",
      intermediate: "text-yellow-400",
      advanced: "text-red-400"
    };
    const levelLabels = {
      beginner: "Principiante",
      intermediate: "Intermedio",
      advanced: "Avanzado"
    };
    const calculateAge = (dateOfBirth) => {
      const today = /* @__PURE__ */ new Date();
      const birth = new Date(dateOfBirth);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birth.getDate()) {
        age--;
      }
      return age;
    };
    filteredAvailableStudents = availableStudents.filter((student) => student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) || student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) || student.email.toLowerCase().includes(searchQuery.toLowerCase()));
    head("43det0", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Estudiantes - ${escape_html(classData?.name || "Clase")} - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-6"><div class="flex items-center justify-between mb-6"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
    Arrow_left($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></button> <div class="flex items-center space-x-3"><div class="p-2 bg-blue-500/20 rounded-lg">`);
    Users($$renderer2, { class: "w-6 h-6 text-blue-500" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-2xl font-bold">${escape_html(classData?.name)}</h1> <p class="text-sm text-slate-400">Gestión de estudiantes</p></div></div></div> <div class="flex items-center space-x-3"><button class="btn-secondary">`);
    Eye($$renderer2, { class: "w-4 h-4 mr-2" });
    $$renderer2.push(`<!----> Ver Clase</button> <button class="btn-primary">`);
    User_plus($$renderer2, { class: "w-4 h-4 mr-2" });
    $$renderer2.push(`<!----> Nuevo Estudiante</button></div></div> <div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600"><div class="flex items-center justify-between"><div><p class="text-sm text-slate-400">Estudiantes Inscritos</p> <p class="text-2xl font-bold text-white">${escape_html(stats.enrolled)}</p></div> <div class="bg-green-500/20 p-3 rounded-lg">`);
    User_check($$renderer2, { class: "w-6 h-6 text-green-400" });
    $$renderer2.push(`<!----></div></div></div> <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600"><div class="flex items-center justify-between"><div><p class="text-sm text-slate-400">Disponibles</p> <p class="text-2xl font-bold text-white">${escape_html(stats.available)}</p></div> <div class="bg-blue-500/20 p-3 rounded-lg">`);
    Users($$renderer2, { class: "w-6 h-6 text-blue-400" });
    $$renderer2.push(`<!----></div></div></div> <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600"><div class="flex items-center justify-between"><div><p class="text-sm text-slate-400">Capacidad</p> <p class="text-2xl font-bold text-white">${escape_html(stats.capacity)}</p></div> <div class="bg-purple-500/20 p-3 rounded-lg">`);
    Chart_column($$renderer2, { class: "w-6 h-6 text-purple-400" });
    $$renderer2.push(`<!----></div></div></div> <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600"><div class="flex items-center justify-between"><div><p class="text-sm text-slate-400">Ocupación</p> <p class="text-2xl font-bold text-white">${escape_html(stats.occupancyRate)}%</p></div> <div class="bg-orange-500/20 p-3 rounded-lg">`);
    Activity($$renderer2, { class: "w-6 h-6 text-orange-400" });
    $$renderer2.push(`<!----></div></div></div></div></div></header> <main class="container mx-auto px-4 py-8"><div class="grid grid-cols-1 lg:grid-cols-2 gap-8"><div class="space-y-6"><div class="flex items-center justify-between"><h2 class="text-xl font-semibold text-white flex items-center">`);
    User_check($$renderer2, { class: "w-5 h-5 mr-2" });
    $$renderer2.push(`<!----> Estudiantes Inscritos (${escape_html(enrolledStudents.length)})</h2></div> `);
    if (enrolledStudents.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">`);
      Users($$renderer2, { class: "w-12 h-12 text-slate-600 mx-auto mb-3" });
      $$renderer2.push(`<!----> <h3 class="text-lg font-semibold text-slate-400 mb-2">No hay estudiantes inscritos</h3> <p class="text-slate-500 mb-4">Comienza inscribiendo estudiantes en esta clase</p> <div class="flex flex-col sm:flex-row gap-3 justify-center"><button class="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center space-x-2">`);
      User_plus($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> <span>Crear Nuevo Estudiante</span></button> `);
      if (availableStudents.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">`);
        User_check($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> <span>Ver Estudiantes Disponibles (${escape_html(availableStudents.length)})</span></button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array = ensure_array_like(enrolledStudents);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let student = each_array[$$index];
        $$renderer2.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors"><div class="flex items-center justify-between"><div class="flex items-center space-x-3"><div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">${escape_html(student.first_name.charAt(0))}${escape_html(student.last_name.charAt(0))}</div> <div><h3 class="font-semibold text-white">${escape_html(student.first_name)} ${escape_html(student.last_name)}</h3> <div class="flex items-center space-x-4 text-sm text-slate-400"><span>${escape_html(calculateAge(student.date_of_birth))} años</span> <span${attr_class(clsx(levelColors[student.chess_level]), "svelte-43det0")}>${escape_html(levelLabels[student.chess_level])}</span> <div class="flex items-center space-x-1">`);
        Calendar($$renderer2, { class: "w-3 h-3" });
        $$renderer2.push(`<!----> <span>${escape_html(new Date(student.enrolled_at).toLocaleDateString("es-ES"))}</span></div></div></div></div> <button class="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-slate-400 hover:text-blue-400" title="Editar estudiante">`);
        Square_pen($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button> <button class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400" title="Desinscribir estudiante">`);
        User_minus($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----></button></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="space-y-6 available-students-section"><div class="flex items-center justify-between"><h2 class="text-xl font-semibold text-white flex items-center">`);
    User_plus($$renderer2, { class: "w-5 h-5 mr-2" });
    $$renderer2.push(`<!----> Estudiantes Disponibles (${escape_html(filteredAvailableStudents.length)})</h2> <button class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2">`);
    User_plus($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> <span>Crear Estudiante</span></button></div> <div class="relative">`);
    Search($$renderer2, {
      class: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
    });
    $$renderer2.push(`<!----> <input type="text" placeholder="Buscar estudiantes disponibles..."${attr("value", searchQuery)} class="input pl-10 w-full svelte-43det0"/></div> `);
    if (stats.available <= 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-slate-800 border border-red-500/30 rounded-xl p-6 text-center">`);
      Circle_alert($$renderer2, { class: "w-12 h-12 text-red-400 mx-auto mb-3" });
      $$renderer2.push(`<!----> <h3 class="text-lg font-semibold text-red-400 mb-2">Clase completa</h3> <p class="text-slate-400">La clase ha alcanzado su capacidad máxima de ${escape_html(stats.capacity)} estudiantes</p></div>`);
    } else if (filteredAvailableStudents.length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">`);
      Users($$renderer2, { class: "w-12 h-12 text-slate-600 mx-auto mb-3" });
      $$renderer2.push(`<!----> <h3 class="text-lg font-semibold text-slate-400 mb-2">${escape_html("No hay estudiantes disponibles")}</h3> <p class="text-slate-500">${escape_html("Todos los estudiantes activos ya están inscritos")}</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array_1 = ensure_array_like(filteredAvailableStudents);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let student = each_array_1[$$index_1];
        $$renderer2.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors"><div class="flex items-center justify-between"><div class="flex items-center space-x-3"><div class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">${escape_html(student.first_name.charAt(0))}${escape_html(student.last_name.charAt(0))}</div> <div><h3 class="font-semibold text-white">${escape_html(student.first_name)} ${escape_html(student.last_name)}</h3> <div class="flex items-center space-x-4 text-sm text-slate-400"><span>${escape_html(calculateAge(student.date_of_birth))} años</span> <span${attr_class(clsx(levelColors[student.chess_level]), "svelte-43det0")}>${escape_html(levelLabels[student.chess_level])}</span> <div class="flex items-center space-x-1">`);
        Mail($$renderer2, { class: "w-3 h-3" });
        $$renderer2.push(`<!----> <span>${escape_html(student.email)}</span></div></div></div></div> <button${attr("disabled", isEnrolling, true)} class="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-slate-400 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed" title="Inscribir estudiante">`);
        {
          $$renderer2.push("<!--[-1-->");
          User_plus($$renderer2, { class: "w-4 h-4" });
        }
        $$renderer2.push(`<!--]--></button></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></main></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
