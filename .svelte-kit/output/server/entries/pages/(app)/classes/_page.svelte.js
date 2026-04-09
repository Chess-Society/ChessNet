import { e as ensure_array_like, h as head, d as escape_html, i as attr, m as maybe_selected, f as attr_class, p as pop, k as push } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import { G as Graduation_cap } from "../../../../chunks/graduation-cap.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { U as Users } from "../../../../chunks/users.js";
import { A as Activity } from "../../../../chunks/activity.js";
import { S as School } from "../../../../chunks/school.js";
import { S as Search } from "../../../../chunks/search.js";
import { S as Square_pen } from "../../../../chunks/square-pen.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { B as Book_open } from "../../../../chunks/book-open.js";
import { U as User_check } from "../../../../chunks/user-check.js";
import { E as Eye } from "../../../../chunks/eye.js";
import { U as User_plus } from "../../../../chunks/user-plus.js";
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  let classes = data.classes || [];
  let stats = data.stats || {
    totalStudents: 0,
    occupancyRate: 0
  };
  let schools = data.schools || [];
  let searchQuery = "";
  let selectedLevel = "";
  let selectedSchool = "";
  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) || classItem.description && classItem.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = !selectedLevel;
    const matchesSchool = !selectedSchool;
    return matchesSearch && matchesLevel && matchesSchool;
  });
  const levelLabels = {
    beginner: "PRINCIPIANTE",
    intermediate: "INTERMEDIO",
    advanced: "AVANZADO",
    mixed: "MIXTO"
  };
  const levelThemes = {
    beginner: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    intermediate: "text-orange-400 border-orange-500/20 bg-orange-500/10",
    advanced: "text-red-400 border-red-500/20 bg-red-500/10",
    mixed: "text-purple-400 border-purple-500/20 bg-purple-500/10"
  };
  const getSchoolName = (collegeId) => {
    const school = schools.find((s) => s.id === collegeId);
    return school?.name || "CENTRO NO ASIGNADO";
  };
  const each_array = ensure_array_like(schools);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Gestión de Clases - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="space-y-10 animate-fade-in pb-20"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="space-y-4"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400 shadow-2xl">`);
  Graduation_cap($$payload, { class: "w-6 h-6" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">Gestión Académica</h1> <p class="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] mt-1">Control de Aulas y Programas Formativos</p></div></div></div> <button class="bg-primary-500 text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg flex items-center justify-center gap-3 group">`);
  Plus($$payload, { class: "w-5 h-5 transition-transform group-hover:rotate-90" });
  $$payload.out.push(`<!----> NUEVA CLASE</button></div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><div class="glass-panel p-8 border-t-4 border-primary-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  Graduation_cap($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Total Programas</p> <div class="flex items-end gap-3"><p class="text-4xl font-black text-white tracking-tighter leading-none">${escape_html(classes.length)}</p> <p class="text-[10px] font-bold text-surface-600 uppercase mb-0.5">GRUPOS</p></div></div> <div class="glass-panel p-8 border-t-4 border-blue-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  Users($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Alumnos Inscritos</p> <div class="flex items-end gap-3"><p class="text-4xl font-black text-white tracking-tighter leading-none">${escape_html(stats.totalStudents)}</p> <p class="text-[10px] font-bold text-surface-600 uppercase mb-0.5">ACTIVOS</p></div></div> <div class="glass-panel p-8 border-t-4 border-orange-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  Activity($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Ocupación Media</p> <div class="flex items-end gap-3"><p class="text-4xl font-black text-white tracking-tighter leading-none">${escape_html(stats.occupancyRate.toFixed(0))}%</p> <p class="text-[10px] font-bold text-surface-600 uppercase mb-0.5">CAPACIDAD</p></div></div> <div class="glass-panel p-8 border-t-4 border-purple-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">`);
  School($$payload, { class: "w-24 h-24" });
  $$payload.out.push(`<!----></div> <p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-2">Centros Asignados</p> <div class="flex items-end gap-3"><p class="text-4xl font-black text-white tracking-tighter leading-none">${escape_html(schools.length)}</p> <p class="text-[10px] font-bold text-surface-600 uppercase mb-0.5">SEDES</p></div></div></div> <div class="flex flex-col lg:flex-row gap-4"><div class="flex-grow relative group">`);
  Search($$payload, {
    class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600 group-focus-within:text-primary-400 transition-colors"
  });
  $$payload.out.push(`<!----> <input type="text" placeholder="BUSCAR POR NOMBRE O DESCRIPCIÓN..."${attr("value", searchQuery)} class="w-full bg-surface-950/50 border border-surface-900 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all backdrop-blur-xl"/></div> <select class="bg-surface-950/50 border border-surface-900 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl min-w-[200px]">`);
  $$payload.select_value = selectedLevel;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>TODOS LOS NIVELES</option><option value="beginner"${maybe_selected($$payload, "beginner")}>PRINCIPIANTE</option><option value="intermediate"${maybe_selected($$payload, "intermediate")}>INTERMEDIO</option><option value="advanced"${maybe_selected($$payload, "advanced")}>AVANZADO</option><option value="mixed"${maybe_selected($$payload, "mixed")}>MIXTO</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select> <select class="bg-surface-950/50 border border-surface-900 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl min-w-[200px]">`);
  $$payload.select_value = selectedSchool;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>TODOS LOS CENTROS</option><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let school = each_array[$$index];
    $$payload.out.push(`<option${attr("value", school.id)}${maybe_selected($$payload, school.id)}>${escape_html(school.name.toUpperCase())}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select> <button class="bg-surface-900/50 border border-surface-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-800 transition-all backdrop-blur-xl">RESETEAR</button></div> `);
  if (filteredClasses.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="glass-panel p-24 text-center space-y-6"><div class="w-20 h-20 bg-surface-950 border border-surface-900 rounded-3xl flex items-center justify-center mx-auto text-surface-800">`);
    Graduation_cap($$payload, { class: "w-10 h-10" });
    $$payload.out.push(`<!----></div> <div><p class="text-[10px] font-black text-surface-600 uppercase tracking-[0.3em]">No hay clases disponibles</p> <p class="text-[9px] font-bold text-surface-800 uppercase tracking-widest mt-2">Prueba a ajustar los criterios de búsqueda.</p></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array_1 = ensure_array_like(filteredClasses);
    $$payload.out.push(`<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"><!--[-->`);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let classItem = each_array_1[i];
      const each_array_2 = ensure_array_like([
        { label: "ALUMNOS", path: "students" },
        { label: "TEMARIO", path: "skills" },
        { label: "ANÁLISIS", path: "analysis" }
      ]);
      $$payload.out.push(`<div class="glass-panel group hover:border-primary-500/30 transition-all"><div class="p-8 space-y-6"><div class="flex items-start justify-between gap-4"><div class="flex items-center gap-5"><div class="w-14 h-14 bg-surface-950 border border-surface-900 rounded-2xl flex items-center justify-center text-primary-400 shadow-xl group-hover:scale-105 transition-transform">`);
      Graduation_cap($$payload, { class: "w-7 h-7" });
      $$payload.out.push(`<!----></div> <div><h3 class="text-base font-black text-white uppercase tracking-tight group-hover:text-primary-400 transition-colors leading-none">${escape_html(classItem.name)}</h3> <p class="text-[9px] font-black text-surface-600 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">`);
      School($$payload, { class: "w-3 h-3" });
      $$payload.out.push(`<!----> ${escape_html(getSchoolName(classItem.college_id))}</p></div></div> <div class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button class="p-2.5 bg-surface-950 border border-surface-900 rounded-xl text-surface-400 hover:text-white hover:border-primary-500/30 transition-all">`);
      Square_pen($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----></button> <button class="p-2.5 bg-surface-950 border border-surface-900 rounded-xl text-surface-400 hover:text-red-400 hover:border-red-500/30 transition-all">`);
      Trash_2($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----></button></div></div> <div class="flex flex-wrap gap-2">`);
      if (classItem.level) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<span${attr_class(`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${levelThemes[classItem.level]}`, "svelte-yan7o")}>${escape_html(levelLabels[classItem.level])}</span>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--> <span class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-primary-500/20 bg-primary-500/10 text-primary-400">ACTIVA</span></div> <div class="grid grid-cols-2 gap-4 pt-6 border-t border-surface-900/50"><div class="space-y-1"><p class="text-[8px] font-black text-surface-600 uppercase tracking-[0.2em]">MATRICULADOS</p> <div class="flex items-center gap-2">`);
      Users($$payload, { class: "w-3.5 h-3.5 text-blue-400" });
      $$payload.out.push(`<!----> <span class="text-white font-black text-sm">~15</span></div></div> <div class="space-y-1"><p class="text-[8px] font-black text-surface-600 uppercase tracking-[0.2em]">CONTENIDO</p> <div class="flex items-center gap-2">`);
      Book_open($$payload, { class: "w-3.5 h-3.5 text-purple-400" });
      $$payload.out.push(`<!----> <span class="text-white font-black text-sm">~5 BLOQUES</span></div></div></div> <div class="flex flex-col gap-3 pt-2"><button class="w-full bg-primary-500/10 border border-primary-500/20 text-primary-400 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-black transition-all flex items-center justify-center gap-3">`);
      User_check($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----> TOMAR ASISTENCIA</button> <div class="grid grid-cols-2 gap-3"><button class="bg-surface-950 border border-surface-900 py-3 rounded-2xl text-[9px] font-black text-surface-500 uppercase tracking-widest hover:text-white hover:border-primary-500/30 transition-all flex items-center justify-center gap-2">`);
      Eye($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----> DETALLES</button> <button class="bg-surface-950 border border-surface-900 py-3 rounded-2xl text-[9px] font-black text-surface-500 uppercase tracking-widest hover:text-white hover:border-primary-500/30 transition-all flex items-center justify-center gap-2">`);
      User_plus($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----> MATRICULAR</button></div></div> <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar pt-2 svelte-yan7o"><!--[-->`);
      for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
        let sub = each_array_2[$$index_1];
        $$payload.out.push(`<button class="px-4 py-2 bg-surface-950/80 border border-surface-900 rounded-xl text-[8px] font-black text-surface-600 hover:text-primary-400 hover:border-primary-500/30 transition-all whitespace-nowrap uppercase tracking-widest">${escape_html(sub.label)}</button>`);
      }
      $$payload.out.push(`<!--]--></div></div></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></div>`);
  pop();
}
export {
  _page as default
};
