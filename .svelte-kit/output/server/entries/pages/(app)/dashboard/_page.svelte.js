import { a as sanitize_props, b as spread_props, c as slot, k as ensure_array_like, i as head, e as escape_html, j as attr_class, d as bind_props, p as pop, f as push } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "clsx";
import "../../../../chunks/state.svelte.js";
import { T as Triangle_alert } from "../../../../chunks/triangle-alert.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { S as School } from "../../../../chunks/school.js";
import { U as Users } from "../../../../chunks/users.js";
import { T as Trending_up } from "../../../../chunks/trending-up.js";
import { D as Dollar_sign } from "../../../../chunks/dollar-sign.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { G as Graduation_cap } from "../../../../chunks/graduation-cap.js";
import { U as User_check } from "../../../../chunks/user-check.js";
import { C as Circle_check_big } from "../../../../chunks/circle-check-big.js";
import { A as Activity } from "../../../../chunks/activity.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
import { T as Target } from "../../../../chunks/target.js";
import { T as Trophy } from "../../../../chunks/trophy.js";
import { C as Chart_column } from "../../../../chunks/chart-column.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { U as User_plus } from "../../../../chunks/user-plus.js";
function Arrow_up($$payload, $$props) {
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
    ["path", { "d": "m5 12 7-7 7 7" }],
    ["path", { "d": "M12 19V5" }]
  ];
  Icon($$payload, spread_props([
    { name: "arrow-up" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowUp
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNSAxMiA3LTcgNyA3IiAvPgogIDxwYXRoIGQ9Ik0xMiAxOVY1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/arrow-up
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
  let data = $$props["data"];
  let user = data.user;
  let dashboardStats = data.dashboardStats || {};
  let centersWithStats = data.centersWithStats || [];
  let featuredClasses = data.featuredClasses || [];
  let recentActivity = data.recentActivity || [];
  let upcomingSessionsToday = data.upcomingSessionsToday || [];
  const getStatusColor = (status) => {
    switch (status) {
      case "good":
        return "border-green-500/30 bg-green-500/10";
      case "warning":
        return "border-yellow-500/30 bg-yellow-500/10";
      case "danger":
        return "border-red-500/30 bg-red-500/10";
      default:
        return "border-slate-600 bg-slate-700/50";
    }
  };
  const getActivityIcon = (iconName) => {
    switch (iconName) {
      case "user-plus":
        return User_plus;
      case "check-circle":
        return Circle_check_big;
      case "plus":
        return Plus;
      case "alert-triangle":
        return Triangle_alert;
      default:
        return Activity;
    }
  };
  const getActivityColor = (color) => {
    switch (color) {
      case "green":
        return "text-green-400";
      case "blue":
        return "text-blue-400";
      case "purple":
        return "text-purple-400";
      case "yellow":
        return "text-yellow-400";
      case "red":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
  };
  const formatTimeAgo = (timestamp) => {
    const now = /* @__PURE__ */ new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1e3 * 60 * 60));
    if (diffInHours < 1) return "Hace menos de 1 hora";
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} días`;
  };
  const getOccupancyColor = (rate) => {
    if (rate >= 90) return "text-red-400";
    if (rate >= 75) return "text-yellow-400";
    return "text-green-400";
  };
  const getAttendanceColor = (rate) => {
    if (rate >= 85) return "text-green-400";
    if (rate >= 75) return "text-yellow-400";
    return "text-red-400";
  };
  const each_array_1 = ensure_array_like(recentActivity);
  const each_array_2 = ensure_array_like(centersWithStats);
  const each_array_3 = ensure_array_like(featuredClasses);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Dashboard - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-6"><div class="flex items-center justify-between"><div><h1 class="text-3xl font-bold text-white">Dashboard</h1> <p class="text-slate-400 mt-1">Bienvenido de vuelta, ${escape_html(user?.email || "Usuario")}</p></div> <div class="flex items-center space-x-4">`);
  if (dashboardStats.lowAttendanceClasses > 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">`);
    Triangle_alert($$payload, { class: "w-4 h-4 text-yellow-400" });
    $$payload.out.push(`<!----> <span class="text-sm text-yellow-300">${escape_html(dashboardStats.lowAttendanceClasses)} alerta(s)</span></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="text-right"><p class="text-sm text-slate-400">Hoy</p> <p class="font-semibold text-white">${escape_html((/* @__PURE__ */ new Date()).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }))}</p></div></div></div></div></header> <main class="container mx-auto px-4 py-8"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between"><div><p class="text-slate-400 text-sm">Centros Educativos</p> <p class="text-3xl font-bold text-white">${escape_html(dashboardStats.totalCenters || 0)}</p> <p class="text-xs text-green-400 mt-1">`);
  Arrow_up($$payload, { class: "w-3 h-3 inline mr-1" });
  $$payload.out.push(`<!----> +${escape_html(dashboardStats.newClassesThisMonth || 0)} este mes</p></div> <div class="p-3 bg-blue-500/20 rounded-lg">`);
  School($$payload, { class: "w-6 h-6 text-blue-500" });
  $$payload.out.push(`<!----></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between"><div><p class="text-slate-400 text-sm">Estudiantes Activos</p> <p class="text-3xl font-bold text-white">${escape_html(dashboardStats.totalStudents || 0)}</p> <p class="text-xs text-green-400 mt-1">`);
  Arrow_up($$payload, { class: "w-3 h-3 inline mr-1" });
  $$payload.out.push(`<!----> +${escape_html(dashboardStats.newStudentsThisWeek || 0)} esta semana</p></div> <div class="p-3 bg-green-500/20 rounded-lg">`);
  Users($$payload, { class: "w-6 h-6 text-green-500" });
  $$payload.out.push(`<!----></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between"><div><p class="text-slate-400 text-sm">Ocupación Global</p> <p${attr_class(`text-3xl font-bold ${getOccupancyColor(dashboardStats.occupancyRate || 0)}`, "svelte-5fvbz4")}>${escape_html(dashboardStats.occupancyRate || 0)}%</p> <p class="text-xs text-slate-400 mt-1">${escape_html(dashboardStats.currentOccupancy || 0)}/${escape_html(dashboardStats.totalCapacity || 0)} plazas</p></div> <div class="p-3 bg-purple-500/20 rounded-lg">`);
  Trending_up($$payload, { class: "w-6 h-6 text-purple-500" });
  $$payload.out.push(`<!----></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between"><div><p class="text-slate-400 text-sm">Ingresos Mensuales</p> <p class="text-3xl font-bold text-white">${escape_html(formatCurrency(dashboardStats.monthlyRevenue || 0))}</p> <p class="text-xs text-slate-400 mt-1">Promedio ${escape_html(formatCurrency(dashboardStats.averageClassPrice || 0))}/clase</p></div> <div class="p-3 bg-yellow-500/20 rounded-lg">`);
  Dollar_sign($$payload, { class: "w-6 h-6 text-yellow-500" });
  $$payload.out.push(`<!----></div></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"><div class="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-semibold text-white">Sesiones de Hoy</h2> <div class="flex items-center space-x-2">`);
  Clock($$payload, { class: "w-4 h-4 text-slate-400" });
  $$payload.out.push(`<!----> <span class="text-sm text-slate-400">${escape_html(upcomingSessionsToday.length)} programadas</span></div></div> `);
  if (upcomingSessionsToday.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="text-center py-8">`);
    Calendar($$payload, { class: "w-12 h-12 text-slate-600 mx-auto mb-3" });
    $$payload.out.push(`<!----> <p class="text-slate-400">No hay clases programadas para hoy</p></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array = ensure_array_like(upcomingSessionsToday);
    $$payload.out.push(`<div class="space-y-4"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let session = each_array[$$index];
      $$payload.out.push(`<div class="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"><div class="flex items-center space-x-4"><div class="p-2 bg-blue-500/20 rounded-lg">`);
      Graduation_cap($$payload, { class: "w-5 h-5 text-blue-400" });
      $$payload.out.push(`<!----></div> <div><h3 class="font-medium text-white">${escape_html(session.className)}</h3> <p class="text-sm text-slate-400">${escape_html(session.schoolName)} • ${escape_html(session.room)}</p></div></div> <div class="flex items-center space-x-4"><div class="text-right"><p class="font-medium text-white">${escape_html(session.time)}</p> <p class="text-xs text-slate-400">${escape_html(session.duration)} • ${escape_html(session.students)} estudiantes</p></div> `);
      if (!session.attendanceTaken) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<button class="btn-primary text-sm svelte-5fvbz4">`);
        User_check($$payload, { class: "w-4 h-4 mr-1" });
        $$payload.out.push(`<!----> Pasar Lista</button>`);
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`<div class="flex items-center space-x-1 text-green-400">`);
        Circle_check_big($$payload, { class: "w-4 h-4" });
        $$payload.out.push(`<!----> <span class="text-xs">Lista pasada</span></div>`);
      }
      $$payload.out.push(`<!--]--></div></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-semibold text-white">Actividad Reciente</h2> `);
  Activity($$payload, { class: "w-5 h-5 text-slate-400" });
  $$payload.out.push(`<!----></div> <div class="space-y-4"><!--[-->`);
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let activity = each_array_1[$$index_1];
    $$payload.out.push(`<div class="flex items-start space-x-3"><div${attr_class(
      `p-2 rounded-lg ${activity.color === "green" ? "bg-green-500/20" : activity.color === "blue" ? "bg-blue-500/20" : activity.color === "purple" ? "bg-purple-500/20" : activity.color === "yellow" ? "bg-yellow-500/20" : "bg-slate-700/50"}`,
      "svelte-5fvbz4"
    )}><!---->`);
    getActivityIcon(activity.icon)?.($$payload, { class: `w-4 h-4 ${getActivityColor(activity.color)}` });
    $$payload.out.push(`<!----></div> <div class="flex-1"><p class="text-sm text-slate-300 leading-relaxed">${escape_html(activity.message)}</p> <p class="text-xs text-slate-500 mt-1">${escape_html(formatTimeAgo(activity.timestamp))}</p></div></div>`);
  }
  $$payload.out.push(`<!--]--></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-semibold text-white">Rendimiento por Centro</h2> <button class="text-blue-400 hover:text-blue-300 text-sm">Ver todos</button></div> <div class="space-y-4"><!--[-->`);
  for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
    let center = each_array_2[$$index_2];
    $$payload.out.push(`<button class="w-full text-left p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"><div class="flex items-center justify-between"><div><h3 class="font-medium text-white">${escape_html(center.name)}</h3> <p class="text-sm text-slate-400">${escape_html(center.city)} • ${escape_html(center.totalClasses)} clases</p></div> <div class="text-right"><div class="flex items-center space-x-2"><span${attr_class(`text-sm font-medium ${getOccupancyColor(center.occupancyRate)}`, "svelte-5fvbz4")}>${escape_html(center.occupancyRate)}%</span> `);
    Chevron_right($$payload, { class: "w-4 h-4 text-slate-500" });
    $$payload.out.push(`<!----></div></div></div> <div class="mt-3 grid grid-cols-3 gap-4 text-xs"><div><span class="text-slate-400">Estudiantes:</span> <span class="text-white ml-1">${escape_html(center.totalStudents)}</span></div> <div><span class="text-slate-400">Asistencia:</span> <span${attr_class(`ml-1 ${getAttendanceColor(center.attendanceRate)}`, "svelte-5fvbz4")}>${escape_html(center.attendanceRate)}%</span></div> <div><span class="text-slate-400">Ingresos:</span> <span class="text-white ml-1">${escape_html(formatCurrency(center.monthlyRevenue))}</span></div></div></button>`);
  }
  $$payload.out.push(`<!--]--></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between mb-6"><h2 class="text-xl font-semibold text-white">Estado de las Clases</h2> <button class="text-blue-400 hover:text-blue-300 text-sm">Ver todas</button></div> <div class="space-y-4"><!--[-->`);
  for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
    let classItem = each_array_3[$$index_3];
    $$payload.out.push(`<button${attr_class(`w-full text-left p-4 rounded-lg border transition-colors ${getStatusColor(classItem.status)}`, "svelte-5fvbz4")}><div class="flex items-center justify-between"><div><h3 class="font-medium text-white">${escape_html(classItem.name)}</h3> <p class="text-sm text-slate-400">${escape_html(classItem.schoolName)}</p></div> <div class="text-right">`);
    if (classItem.status === "warning") {
      $$payload.out.push("<!--[-->");
      Triangle_alert($$payload, { class: "w-5 h-5 text-yellow-400" });
    } else {
      $$payload.out.push("<!--[!-->");
      Circle_check_big($$payload, { class: "w-5 h-5 text-green-400" });
    }
    $$payload.out.push(`<!--]--></div></div> <div class="mt-3 grid grid-cols-2 gap-4 text-xs"><div><span class="text-slate-400">Ocupación:</span> <span${attr_class(`ml-1 ${getOccupancyColor(classItem.occupancyRate)}`, "svelte-5fvbz4")}>${escape_html(classItem.students)}/${escape_html(classItem.capacity)} (${escape_html(classItem.occupancyRate)}%)</span></div> <div><span class="text-slate-400">Asistencia:</span> <span${attr_class(`ml-1 ${getAttendanceColor(classItem.attendanceRate)}`, "svelte-5fvbz4")}>${escape_html(classItem.attendanceRate)}%</span></div></div> <div class="mt-2 text-xs text-slate-500">Próxima sesión: ${escape_html(new Date(classItem.nextSession).toLocaleDateString("es-ES"))}</div></button>`);
  }
  $$payload.out.push(`<!--]--></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h2 class="text-xl font-semibold text-white mb-6">Acciones Rápidas</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><button class="group p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-all duration-200 text-left"><div class="flex items-center justify-between mb-4">`);
  School($$payload, { class: "w-8 h-8 text-blue-400" });
  $$payload.out.push(`<!----> `);
  Chevron_right($$payload, {
    class: "w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform"
  });
  $$payload.out.push(`<!----></div> <h3 class="font-medium text-blue-300 mb-2">Centros Educativos</h3> <p class="text-sm text-blue-400/80">Gestionar centros y ubicaciones</p></button> <button class="group p-6 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-all duration-200 text-left"><div class="flex items-center justify-between mb-4">`);
  Users($$payload, { class: "w-8 h-8 text-green-400" });
  $$payload.out.push(`<!----> `);
  Chevron_right($$payload, {
    class: "w-5 h-5 text-green-400 group-hover:translate-x-1 transition-transform"
  });
  $$payload.out.push(`<!----></div> <h3 class="font-medium text-green-300 mb-2">Estudiantes</h3> <p class="text-sm text-green-400/80">Gestionar alumnado e inscripciones</p></button> <button class="group p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-all duration-200 text-left"><div class="flex items-center justify-between mb-4">`);
  Graduation_cap($$payload, { class: "w-8 h-8 text-purple-400" });
  $$payload.out.push(`<!----> `);
  Chevron_right($$payload, {
    class: "w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform"
  });
  $$payload.out.push(`<!----></div> <h3 class="font-medium text-purple-300 mb-2">Clases</h3> <p class="text-sm text-purple-400/80">Organizar grupos y horarios</p></button> <button class="group p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-all duration-200 text-left"><div class="flex items-center justify-between mb-4">`);
  Target($$payload, { class: "w-8 h-8 text-yellow-400" });
  $$payload.out.push(`<!----> `);
  Chevron_right($$payload, {
    class: "w-5 h-5 text-yellow-400 group-hover:translate-x-1 transition-transform"
  });
  $$payload.out.push(`<!----></div> <h3 class="font-medium text-yellow-300 mb-2">Habilidades</h3> <p class="text-sm text-yellow-400/80">Definir temarios y competencias</p></button> <button class="group p-6 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-all duration-200 text-left"><div class="flex items-center justify-between mb-4">`);
  Trophy($$payload, { class: "w-8 h-8 text-orange-400" });
  $$payload.out.push(`<!----> `);
  Chevron_right($$payload, {
    class: "w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform"
  });
  $$payload.out.push(`<!----></div> <h3 class="font-medium text-orange-300 mb-2">Gestionar Torneos</h3> <p class="text-sm text-orange-400/80">Organizar competiciones locales</p></button> <button class="group p-6 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all duration-200 text-left"><div class="flex items-center justify-between mb-4">`);
  User_check($$payload, { class: "w-8 h-8 text-red-400" });
  $$payload.out.push(`<!----> `);
  Chevron_right($$payload, {
    class: "w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform"
  });
  $$payload.out.push(`<!----></div> <h3 class="font-medium text-red-300 mb-2">Control de Asistencia</h3> <p class="text-sm text-red-400/80">Pasar lista y estadísticas</p></button> <button class="group p-6 bg-teal-500/10 border border-teal-500/20 rounded-lg hover:bg-teal-500/20 transition-all duration-200 text-left"><div class="flex items-center justify-between mb-4">`);
  Chart_column($$payload, { class: "w-8 h-8 text-teal-400" });
  $$payload.out.push(`<!----> `);
  Chevron_right($$payload, {
    class: "w-5 h-5 text-teal-400 group-hover:translate-x-1 transition-transform"
  });
  $$payload.out.push(`<!----></div> <h3 class="font-medium text-teal-300 mb-2">Informes</h3> <p class="text-sm text-teal-400/80">Reportes y análisis avanzados</p></button> <button class="group p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all duration-200 text-left relative"><div class="absolute top-2 right-2"><div class="bg-yellow-500 text-slate-900 text-xs px-2 py-1 rounded-full font-medium">BETA</div></div> <div class="flex items-center justify-between mb-4">`);
  Dollar_sign($$payload, { class: "w-8 h-8 text-emerald-400" });
  $$payload.out.push(`<!----> `);
  Chevron_right($$payload, {
    class: "w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform"
  });
  $$payload.out.push(`<!----></div> <h3 class="font-medium text-emerald-300 mb-2">Sistema de Pagos</h3> <p class="text-sm text-emerald-400/80">Gestionar cobros y facturación</p></button></div></div></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
