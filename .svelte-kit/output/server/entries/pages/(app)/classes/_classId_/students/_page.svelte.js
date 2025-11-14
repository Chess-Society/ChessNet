import { a as sanitize_props, b as spread_props, c as slot, i as head, e as escape_html, k as ensure_array_like, j as attr_class, u as clsx, l as attr, d as bind_props, p as pop, f as push } from "../../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
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
function User_minus($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.542.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
    ["circle", { "cx": "9", "cy": "7", "r": "4" }],
    ["line", { "x1": "22", "x2": "16", "y1": "11", "y2": "11" }]
  ];
  Icon($$payload, spread_props([
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
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function _page($$payload, $$props) {
  push();
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
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Estudiantes - ${escape_html(classData?.name || "Clase")} - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-6"><div class="flex items-center justify-between mb-6"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="flex items-center space-x-3"><div class="p-2 bg-blue-500/20 rounded-lg">`);
  Users($$payload, { class: "w-6 h-6 text-blue-500" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold">${escape_html(classData?.name)}</h1> <p class="text-sm text-slate-400">Gestión de estudiantes</p></div></div></div> <div class="flex items-center space-x-3"><button class="btn-secondary">`);
  Eye($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Ver Clase</button> <button class="btn-primary">`);
  User_plus($$payload, { class: "w-4 h-4 mr-2" });
  $$payload.out.push(`<!----> Nuevo Estudiante</button></div></div> <div class="grid grid-cols-1 md:grid-cols-4 gap-4"><div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600"><div class="flex items-center justify-between"><div><p class="text-sm text-slate-400">Estudiantes Inscritos</p> <p class="text-2xl font-bold text-white">${escape_html(stats.enrolled)}</p></div> <div class="bg-green-500/20 p-3 rounded-lg">`);
  User_check($$payload, { class: "w-6 h-6 text-green-400" });
  $$payload.out.push(`<!----></div></div></div> <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600"><div class="flex items-center justify-between"><div><p class="text-sm text-slate-400">Disponibles</p> <p class="text-2xl font-bold text-white">${escape_html(stats.available)}</p></div> <div class="bg-blue-500/20 p-3 rounded-lg">`);
  Users($$payload, { class: "w-6 h-6 text-blue-400" });
  $$payload.out.push(`<!----></div></div></div> <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600"><div class="flex items-center justify-between"><div><p class="text-sm text-slate-400">Capacidad</p> <p class="text-2xl font-bold text-white">${escape_html(stats.capacity)}</p></div> <div class="bg-purple-500/20 p-3 rounded-lg">`);
  Chart_column($$payload, { class: "w-6 h-6 text-purple-400" });
  $$payload.out.push(`<!----></div></div></div> <div class="bg-slate-700/50 rounded-lg p-4 border border-slate-600"><div class="flex items-center justify-between"><div><p class="text-sm text-slate-400">Ocupación</p> <p class="text-2xl font-bold text-white">${escape_html(stats.occupancyRate)}%</p></div> <div class="bg-orange-500/20 p-3 rounded-lg">`);
  Activity($$payload, { class: "w-6 h-6 text-orange-400" });
  $$payload.out.push(`<!----></div></div></div></div></div></header> <main class="container mx-auto px-4 py-8"><div class="grid grid-cols-1 lg:grid-cols-2 gap-8"><div class="space-y-6"><div class="flex items-center justify-between"><h2 class="text-xl font-semibold text-white flex items-center">`);
  User_check($$payload, { class: "w-5 h-5 mr-2" });
  $$payload.out.push(`<!----> Estudiantes Inscritos (${escape_html(enrolledStudents.length)})</h2></div> `);
  if (enrolledStudents.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">`);
    Users($$payload, { class: "w-12 h-12 text-slate-600 mx-auto mb-3" });
    $$payload.out.push(`<!----> <h3 class="text-lg font-semibold text-slate-400 mb-2">No hay estudiantes inscritos</h3> <p class="text-slate-500 mb-4">Comienza inscribiendo estudiantes en esta clase</p> <div class="flex flex-col sm:flex-row gap-3 justify-center"><button class="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center space-x-2">`);
    User_plus($$payload, { class: "w-4 h-4" });
    $$payload.out.push(`<!----> <span>Crear Nuevo Estudiante</span></button> `);
    if (availableStudents.length > 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<button class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">`);
      User_check($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----> <span>Ver Estudiantes Disponibles (${escape_html(availableStudents.length)})</span></button>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array = ensure_array_like(enrolledStudents);
    $$payload.out.push(`<div class="space-y-3"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let student = each_array[$$index];
      $$payload.out.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors"><div class="flex items-center justify-between"><div class="flex items-center space-x-3"><div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">${escape_html(student.first_name.charAt(0))}${escape_html(student.last_name.charAt(0))}</div> <div><h3 class="font-semibold text-white">${escape_html(student.first_name)} ${escape_html(student.last_name)}</h3> <div class="flex items-center space-x-4 text-sm text-slate-400"><span>${escape_html(calculateAge(student.date_of_birth))} años</span> <span${attr_class(clsx(levelColors[student.chess_level]), "svelte-x773vi")}>${escape_html(levelLabels[student.chess_level])}</span> <div class="flex items-center space-x-1">`);
      Calendar($$payload, { class: "w-3 h-3" });
      $$payload.out.push(`<!----> <span>${escape_html(new Date(student.enrolled_at).toLocaleDateString("es-ES"))}</span></div></div></div></div> <button class="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-slate-400 hover:text-blue-400" title="Editar estudiante">`);
      Square_pen($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----></button> <button class="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-400 hover:text-red-400" title="Desinscribir estudiante">`);
      User_minus($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----></button></div></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></div> <div class="space-y-6 available-students-section"><div class="flex items-center justify-between"><h2 class="text-xl font-semibold text-white flex items-center">`);
  User_plus($$payload, { class: "w-5 h-5 mr-2" });
  $$payload.out.push(`<!----> Estudiantes Disponibles (${escape_html(filteredAvailableStudents.length)})</h2> <button class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2">`);
  User_plus($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> <span>Crear Estudiante</span></button></div> <div class="relative">`);
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
  });
  $$payload.out.push(`<!----> <input type="text" placeholder="Buscar estudiantes disponibles..."${attr("value", searchQuery)} class="input pl-10 w-full svelte-x773vi"/></div> `);
  if (stats.available <= 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="bg-slate-800 border border-red-500/30 rounded-xl p-6 text-center">`);
    Circle_alert($$payload, { class: "w-12 h-12 text-red-400 mx-auto mb-3" });
    $$payload.out.push(`<!----> <h3 class="text-lg font-semibold text-red-400 mb-2">Clase completa</h3> <p class="text-slate-400">La clase ha alcanzado su capacidad máxima de ${escape_html(stats.capacity)} estudiantes</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    if (filteredAvailableStudents.length === 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">`);
      Users($$payload, { class: "w-12 h-12 text-slate-600 mx-auto mb-3" });
      $$payload.out.push(`<!----> <h3 class="text-lg font-semibold text-slate-400 mb-2">${escape_html("No hay estudiantes disponibles")}</h3> <p class="text-slate-500">${escape_html("Todos los estudiantes activos ya están inscritos")}</p></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      const each_array_1 = ensure_array_like(filteredAvailableStudents);
      $$payload.out.push(`<div class="space-y-3"><!--[-->`);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let student = each_array_1[$$index_1];
        $$payload.out.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors"><div class="flex items-center justify-between"><div class="flex items-center space-x-3"><div class="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">${escape_html(student.first_name.charAt(0))}${escape_html(student.last_name.charAt(0))}</div> <div><h3 class="font-semibold text-white">${escape_html(student.first_name)} ${escape_html(student.last_name)}</h3> <div class="flex items-center space-x-4 text-sm text-slate-400"><span>${escape_html(calculateAge(student.date_of_birth))} años</span> <span${attr_class(clsx(levelColors[student.chess_level]), "svelte-x773vi")}>${escape_html(levelLabels[student.chess_level])}</span> <div class="flex items-center space-x-1">`);
        Mail($$payload, { class: "w-3 h-3" });
        $$payload.out.push(`<!----> <span>${escape_html(student.email)}</span></div></div></div></div> <button${attr("disabled", isEnrolling, true)} class="p-2 hover:bg-green-500/20 rounded-lg transition-colors text-slate-400 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed" title="Inscribir estudiante">`);
        {
          $$payload.out.push("<!--[!-->");
          User_plus($$payload, { class: "w-4 h-4" });
        }
        $$payload.out.push(`<!--]--></button></div></div>`);
      }
      $$payload.out.push(`<!--]--></div>`);
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]--></div></div></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
