import { i as head, e as escape_html, j as attr_class, k as ensure_array_like, l as attr, d as bind_props, p as pop, f as push } from "../../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { U as User_check } from "../../../../../../chunks/user-check.js";
import { C as Calendar } from "../../../../../../chunks/calendar.js";
import { C as Chart_column } from "../../../../../../chunks/chart-column.js";
import { C as Circle_check_big } from "../../../../../../chunks/circle-check-big.js";
import { C as Circle_x } from "../../../../../../chunks/circle-x.js";
import { U as Users } from "../../../../../../chunks/users.js";
import { C as Clock } from "../../../../../../chunks/clock.js";
import { S as Save } from "../../../../../../chunks/save.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let classData = data.class;
  let students = data.students || [];
  data.recentAttendance || [];
  data.attendanceStats || [];
  let selectedDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  let currentAttendance = {};
  let isSubmitting = false;
  const getStatusIcon = (status) => {
    switch (status) {
      case "P":
        return Circle_check_big;
      case "T":
        return Clock;
      case "A":
        return Circle_x;
      default:
        return Circle_check_big;
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "P":
        return "text-green-400";
      case "T":
        return "text-yellow-400";
      case "A":
        return "text-red-400";
      default:
        return "text-green-400";
    }
  };
  const getStatusBgColor = (status) => {
    switch (status) {
      case "P":
        return "bg-green-500/20 border-green-500/30";
      case "T":
        return "bg-yellow-500/20 border-yellow-500/30";
      case "A":
        return "bg-red-500/20 border-red-500/30";
      default:
        return "bg-green-500/20 border-green-500/30";
    }
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case "P":
        return "Presente";
      case "T":
        return "Tardanza";
      case "A":
        return "Ausente";
      default:
        return "Presente";
    }
  };
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Asistencia - ${escape_html(classData?.name || "Clase")} - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><header class="border-b border-slate-700 bg-slate-800/50 backdrop-blur"><div class="container mx-auto px-4 py-4"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="flex items-center space-x-3"><div class="p-2 bg-green-500/20 rounded-lg">`);
  User_check($$payload, { class: "w-6 h-6 text-green-500" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold">Control de Asistencia</h1> <p class="text-sm text-slate-400">${escape_html(classData?.name)} • ${escape_html(classData?.schedule)}</p></div></div></div> <div class="flex items-center bg-slate-700/50 rounded-lg p-1"><button${attr_class(
    `px-4 py-2 rounded-md transition-colors ${"bg-green-500 text-white"}`,
    "svelte-x773vi"
  )}>`);
  User_check($$payload, { class: "w-4 h-4 inline mr-2" });
  $$payload.out.push(`<!----> Pasar Lista</button> <button${attr_class(
    `px-4 py-2 rounded-md transition-colors ${"text-slate-400 hover:text-white"}`,
    "svelte-x773vi"
  )}>`);
  Calendar($$payload, { class: "w-4 h-4 inline mr-2" });
  $$payload.out.push(`<!----> Historial</button> <button${attr_class(
    `px-4 py-2 rounded-md transition-colors ${"text-slate-400 hover:text-white"}`,
    "svelte-x773vi"
  )}>`);
  Chart_column($$payload, { class: "w-4 h-4 inline mr-2" });
  $$payload.out.push(`<!----> Estadísticas</button></div></div></div></header> <main class="container mx-auto px-4 py-8">`);
  {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(students);
    $$payload.out.push(`<div class="space-y-8"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between mb-4"><h2 class="text-xl font-semibold">Pasar Lista</h2> <div class="flex items-center space-x-4"><div class="flex items-center space-x-2">`);
    Calendar($$payload, { class: "w-5 h-5 text-slate-500" });
    $$payload.out.push(`<!----> <input type="date"${attr("value", selectedDate)} class="input svelte-x773vi"${attr("max", (/* @__PURE__ */ new Date()).toISOString().split("T")[0])}/></div> <button class="btn-secondary text-sm">`);
    Circle_check_big($$payload, { class: "w-4 h-4 mr-2" });
    $$payload.out.push(`<!----> Todos Presentes</button> <button class="btn-secondary text-sm">`);
    Circle_x($$payload, { class: "w-4 h-4 mr-2" });
    $$payload.out.push(`<!----> Limpiar Notas</button></div></div> <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"><div class="bg-slate-700/50 rounded-lg p-4"><div class="flex items-center space-x-2 mb-2">`);
    Users($$payload, { class: "w-4 h-4 text-blue-500" });
    $$payload.out.push(`<!----> <span class="text-sm text-slate-400">Total</span></div> <p class="text-2xl font-bold">${escape_html(students.length)}</p></div> <div class="bg-slate-700/50 rounded-lg p-4"><div class="flex items-center space-x-2 mb-2">`);
    Circle_check_big($$payload, { class: "w-4 h-4 text-green-500" });
    $$payload.out.push(`<!----> <span class="text-sm text-slate-400">Presentes</span></div> <p class="text-2xl font-bold text-green-400">${escape_html(Object.values(currentAttendance).filter((a) => a.status === "P").length)}</p></div> <div class="bg-slate-700/50 rounded-lg p-4"><div class="flex items-center space-x-2 mb-2">`);
    Clock($$payload, { class: "w-4 h-4 text-yellow-500" });
    $$payload.out.push(`<!----> <span class="text-sm text-slate-400">Tardanzas</span></div> <p class="text-2xl font-bold text-yellow-400">${escape_html(Object.values(currentAttendance).filter((a) => a.status === "T").length)}</p></div> <div class="bg-slate-700/50 rounded-lg p-4"><div class="flex items-center space-x-2 mb-2">`);
    Circle_x($$payload, { class: "w-4 h-4 text-red-500" });
    $$payload.out.push(`<!----> <span class="text-sm text-slate-400">Ausentes</span></div> <p class="text-2xl font-bold text-red-400">${escape_html(Object.values(currentAttendance).filter((a) => a.status === "A").length)}</p></div></div></div> <div class="space-y-4"><!--[-->`);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let student = each_array[$$index_1];
      const each_array_1 = ensure_array_like(["P", "T", "A"]);
      $$payload.out.push(`<div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-lg">${escape_html(student.name?.split(" ").map((n) => n[0]).join("").substring(0, 2) || "XX")}</span></div> <div><h3 class="font-semibold text-lg">${escape_html(student.name)}</h3> <p class="text-sm text-slate-400">${escape_html(student.age)} años • ${escape_html(student.level)}</p></div></div> <div class="flex items-center space-x-4"><div class="flex items-center space-x-2"><!--[-->`);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let status = each_array_1[$$index];
        $$payload.out.push(`<button${attr_class(
          `p-3 rounded-lg border transition-all ${currentAttendance[student.id]?.status === status ? getStatusBgColor(status) + " " + getStatusColor(status) : "border-slate-600 text-slate-400 hover:border-slate-500"}`,
          "svelte-x773vi"
        )}${attr("title", getStatusLabel(status))}><!---->`);
        getStatusIcon(status)?.($$payload, { class: "w-5 h-5" });
        $$payload.out.push(`<!----></button>`);
      }
      $$payload.out.push(`<!--]--></div> <div class="w-64"><input type="text" placeholder="Notas (opcional)"${attr("value", currentAttendance[student.id]?.notes || "")} class="input text-sm w-full svelte-x773vi"/></div> <div${attr_class(`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBgColor(currentAttendance[student.id]?.status || "P")}`, "svelte-x773vi")}>${escape_html(getStatusLabel(currentAttendance[student.id]?.status || "P"))}</div></div></div></div>`);
    }
    $$payload.out.push(`<!--]--></div> <div class="flex justify-end"><button${attr("disabled", isSubmitting, true)} class="btn-primary text-lg px-8 py-3">`);
    {
      $$payload.out.push("<!--[!-->");
      Save($$payload, { class: "w-5 h-5 mr-2" });
      $$payload.out.push(`<!----> Guardar Asistencia`);
    }
    $$payload.out.push(`<!--]--></button></div></div>`);
  }
  $$payload.out.push(`<!--]--></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
