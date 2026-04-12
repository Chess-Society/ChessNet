import { s as store_get, h as head, e as ensure_array_like, c as escape_html, i as attr, al as attr_style, b as stringify, a as attr_class, u as unsubscribe_stores, j as derived } from "../../../../chunks/renderer.js";
import { p as page } from "../../../../chunks/stores.js";
import { a as appStore } from "../../../../chunks/appStore.js";
import { C as Circle_check_big } from "../../../../chunks/circle-check-big.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { U as User_check } from "../../../../chunks/user-check.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { U as Users } from "../../../../chunks/users.js";
import { C as Circle_x } from "../../../../chunks/circle-x.js";
import { S as Save } from "../../../../chunks/save.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let selectedClassId = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("classId") || "";
    let selectedDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    let classes = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).classes || []);
    let selectedClass = derived(() => classes().find((c) => c.id === selectedClassId));
    let students = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).students || []);
    let classStudents = derived(() => () => {
      if (!selectedClass()) return [];
      return students().filter((s) => selectedClass().studentIds?.includes(s.id));
    });
    let currentAttendance = derived(() => () => {
      return store_get($$store_subs ??= {}, "$appStore", appStore).attendance.find((a) => a.classId === selectedClassId && a.date === selectedDate);
    });
    const getStatus = (studentId) => {
      const record = currentAttendance()()?.records.find((r) => r.studentId === studentId);
      return record ? record.status : "unmarked";
    };
    const stats = derived(() => () => {
      const records = currentAttendance()()?.records || [];
      const present = records.filter((r) => r.status === "present").length;
      const total = classStudents()().length;
      return {
        present,
        total,
        percent: total > 0 ? Math.round(present / total * 100) : 0
      };
    });
    head("1jcs5su", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Control de Asistencia - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6"><div class="space-y-4"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center text-pink-500">`);
    Circle_check_big($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-bold text-white tracking-tight">Control de Asistencia</h1> <p class="text-slate-400 text-sm">Registra la asistencia diaria de tus grupos y mantén el control.</p></div></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8"><div class="lg:col-span-1 space-y-4"><label class="block"><span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Seleccionar Clase</span> `);
    $$renderer2.select(
      {
        value: selectedClassId,
        class: "w-full mt-1.5 bg-[#1e293b]/50 border border-slate-800 rounded-2xl px-4 py-4 text-sm text-white focus:border-pink-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Selecciona una clase...`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(classes());
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let cls = each_array[$$index];
          $$renderer3.option({ value: cls.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(cls.name)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</label></div> <div class="lg:col-span-1 space-y-4"><label class="block"><span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Fecha de Sesión</span> <div class="relative">`);
    Calendar($$renderer2, {
      class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
    });
    $$renderer2.push(`<!----> <input type="date"${attr("value", selectedDate)} class="w-full mt-1.5 bg-[#1e293b]/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-pink-500/50 outline-none transition-all backdrop-blur-xl"/></div></label></div> `);
    if (selectedClassId) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="lg:col-span-2 flex items-end gap-3"><div class="flex-grow bg-[#1e293b]/30 border border-slate-800 rounded-2xl px-6 py-3 flex items-center justify-between"><div class="flex items-center gap-4"><div class="text-center"><p class="text-[9px] font-bold text-slate-500 uppercase">Presentes</p> <p class="text-lg font-bold text-emerald-500">${escape_html(stats()().present)}</p></div> <div class="w-px h-8 bg-slate-800"></div> <div class="text-center"><p class="text-[9px] font-bold text-slate-500 uppercase">Ausentes</p> <p class="text-lg font-bold text-red-500">${escape_html(stats()().total - stats()().present)}</p></div></div> <div class="flex items-center gap-3"><div class="text-right"><p class="text-[9px] font-bold text-slate-500 uppercase">Asistencia</p> <p class="text-xl font-bold text-white">${escape_html(stats()().percent)}%</p></div> <div class="w-10 h-10 rounded-full border-2 border-slate-800 flex items-center justify-center relative"><div class="absolute inset-0 rounded-full border-2 border-pink-500 border-t-transparent"${attr_style(`transform: rotate(${stringify(stats()().percent * 3.6)}deg)`)}></div> `);
      User_check($$renderer2, { class: "w-4 h-4 text-pink-500" });
      $$renderer2.push(`<!----></div></div></div> <button class="bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-2xl text-xs font-bold transition-all border border-slate-700 whitespace-nowrap">Todos Presentes</button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (!selectedClassId) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-[#1e293b]/40 border border-slate-800 border-dashed rounded-3xl p-24 text-center space-y-6"><div class="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 text-slate-700">`);
      Clock($$renderer2, { class: "w-10 h-10" });
      $$renderer2.push(`<!----></div> <div class="space-y-2"><h2 class="text-xl font-bold text-white">Selecciona una clase</h2> <p class="text-slate-500 text-sm">Elige el grupo del que quieres registrar la asistencia hoy.</p></div></div>`);
    } else if (classStudents()().length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="bg-[#1e293b]/40 border border-slate-800 border-dashed rounded-3xl p-24 text-center space-y-6"><div class="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto border border-slate-800 text-slate-700">`);
      Users($$renderer2, { class: "w-10 h-10" });
      $$renderer2.push(`<!----></div> <div class="space-y-2"><h2 class="text-xl font-bold text-white">No hay alumnos en esta clase</h2> <p class="text-slate-500 text-sm">Añade alumnos a la clase "${escape_html(selectedClass()?.name)}" para empezar el registro.</p> <button class="text-pink-500 font-bold text-xs mt-4">Configurar Clase →</button></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="bg-[#1e293b]/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"><div class="grid grid-cols-1 divide-y divide-slate-800"><!--[-->`);
      const each_array_1 = ensure_array_like(classStudents()());
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let student = each_array_1[$$index_1];
        const status = getStatus(student.id);
        $$renderer2.push(`<div class="flex items-center justify-between p-6 hover:bg-slate-800/30 transition-all group"><div class="flex items-center gap-4"><div class="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xs font-bold text-slate-400">${escape_html(student.name.split(" ").map((n) => n[0]).join(""))}</div> <div><p class="text-white font-bold">${escape_html(student.name)}</p> <p class="text-[10px] text-slate-500 uppercase tracking-widest">${escape_html(student.level || "Sin nivel")}</p></div></div> <div class="flex items-center gap-2"><button${attr_class(`flex items-center gap-2 px-6 py-2.5 rounded-xl border transition-all font-bold text-xs ${stringify(status === "present" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-emerald-500/30")}`)}>`);
        Circle_check_big($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> Presente</button> <button${attr_class(`flex items-center gap-2 px-6 py-2.5 rounded-xl border transition-all font-bold text-xs ${stringify(status === "absent" ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-red-500/30")}`)}>`);
        Circle_x($$renderer2, { class: "w-4 h-4" });
        $$renderer2.push(`<!----> Ausente</button></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div> <div class="mt-8 flex justify-end"><div class="flex items-center gap-4 text-slate-500 text-xs italic">`);
      Save($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> Los cambios se guardan automáticamente en la nube.</div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
