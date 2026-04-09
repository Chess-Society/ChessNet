import { e as ensure_array_like, h as head, d as escape_html, i as attr, m as maybe_selected, p as pop, k as push } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import { U as Users } from "../../../../chunks/users.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { S as Search } from "../../../../chunks/search.js";
import { S as School } from "../../../../chunks/school.js";
import { S as Square_pen } from "../../../../chunks/square-pen.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  let students = data.students || [];
  let schools = data.schools || [];
  data.stats || {};
  let searchQuery = "";
  let selectedSchool = "";
  const filteredStudents = students.filter((student) => {
    const name = student.name || `${student.first_name || ""} ${student.last_name || ""}`;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSchool = !selectedSchool;
    return matchesSearch && matchesSchool;
  });
  const getSchoolName = (schoolId) => {
    const school = schools.find((s) => s.id === schoolId);
    return school ? school.name : "Sin asignar";
  };
  const getInitials = (student) => {
    if (student.name) {
      return student.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
    }
    return `${(student.first_name || "E").charAt(0)}${(student.last_name || "S").charAt(0)}`.toUpperCase();
  };
  const each_array = ensure_array_like(schools);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Estudiantes - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="space-y-10 animate-fade-in pb-20"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8"><div class="space-y-4"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400">`);
  Users($$payload, { class: "w-6 h-6" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-3xl font-black text-white tracking-tighter uppercase leading-none">Comunidad Estudiantil</h1> <p class="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em] mt-1">Gestión y Seguimiento de Talentos</p></div></div></div> <div class="flex items-center gap-4"><div class="bg-surface-950/50 border border-surface-900 px-5 py-2.5 rounded-2xl flex items-center gap-4 backdrop-blur-xl"><div class="text-right"><p class="text-[8px] font-black text-surface-600 uppercase tracking-widest">Base de Datos</p> <p class="text-xs font-black text-white uppercase">${escape_html(students.length)} ALUMNOS</p></div> <div class="w-px h-6 bg-surface-900"></div> <div class="text-right"><p class="text-[8px] font-black text-surface-600 uppercase tracking-widest">Centros</p> <p class="text-xs font-black text-white uppercase">${escape_html(schools.length)}</p></div></div> <button class="bg-primary-500 text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg shadow-primary-500/10 flex items-center gap-2">`);
  Plus($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> Matricular</button></div></div> <div class="flex flex-col md:flex-row gap-4"><div class="flex-grow relative group">`);
  Search($$payload, {
    class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600 group-focus-within:text-primary-400 transition-colors"
  });
  $$payload.out.push(`<!----> <input type="text" placeholder="BUSCAR POR NOMBRE O APELLIDO..."${attr("value", searchQuery)} class="w-full bg-surface-950/50 border border-surface-900 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all backdrop-blur-xl"/></div> <div class="relative group min-w-[240px]">`);
  School($$payload, {
    class: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-600"
  });
  $$payload.out.push(`<!----> <select class="w-full bg-surface-950/50 border border-surface-900 rounded-2xl pl-12 pr-10 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer backdrop-blur-xl">`);
  $$payload.select_value = selectedSchool;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>TODOS LOS CENTROS</option><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let school = each_array[$$index];
    $$payload.out.push(`<option${attr("value", school.id)}${maybe_selected($$payload, school.id)}>${escape_html(school.name.toUpperCase())}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <button class="bg-surface-900/50 border border-surface-800 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-800 transition-all backdrop-blur-xl">RESETEAR</button></div> `);
  if (filteredStudents.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="glass-panel p-24 text-center space-y-6"><div class="w-20 h-20 bg-surface-950 rounded-3xl flex items-center justify-center mx-auto border border-surface-900 text-surface-700">`);
    Users($$payload, { class: "w-10 h-10" });
    $$payload.out.push(`<!----></div> <div class="space-y-2"><h2 class="text-lg font-black text-white uppercase tracking-tighter">Sin coincidencias</h2> <p class="text-surface-500 text-[10px] font-black uppercase tracking-widest">Ajusta los filtros o añade un nuevo alumno</p></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array_1 = ensure_array_like(filteredStudents);
    $$payload.out.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let student = each_array_1[i];
      $$payload.out.push(`<div class="glass-panel group p-8 space-y-6 hover:border-primary-500/30 transition-all relative overflow-hidden"><div class="absolute -right-10 -top-10 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full group-hover:bg-primary-500/10 transition-all"></div> <div class="flex items-center justify-between relative z-10"><div class="flex items-center gap-5"><div class="w-14 h-14 bg-surface-950 border border-surface-900 rounded-2xl flex items-center justify-center text-primary-400 font-black text-lg group-hover:scale-110 group-hover:border-primary-500/30 transition-all shadow-2xl">${escape_html(getInitials(student))}</div> <div><h3 class="text-white font-black uppercase text-sm leading-tight tracking-tight group-hover:text-primary-400 transition-colors">${escape_html(student.name)}</h3> <div class="flex items-center gap-2 mt-1"><p class="text-[9px] font-black text-surface-500 uppercase tracking-widest">${escape_html(getSchoolName(student.college_id))}</p></div></div></div> <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all"><button class="p-2.5 bg-surface-950 border border-surface-900 rounded-xl text-surface-500 hover:text-primary-400 hover:border-primary-500/30 transition-all" title="Editar Alumno">`);
      Square_pen($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----></button> <button class="p-2.5 bg-surface-950 border border-surface-900 rounded-xl text-surface-500 hover:text-red-400 hover:border-red-500/30 transition-all" title="Eliminar Registro">`);
      Trash_2($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----></button></div></div> `);
      if (student.notes) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="p-4 bg-surface-950/50 border border-surface-900/50 rounded-xl relative z-10"><p class="text-[10px] text-surface-500 font-bold uppercase tracking-widest line-clamp-2 leading-relaxed">"${escape_html(student.notes)}"</p></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--> <div class="flex items-center justify-between pt-6 border-t border-surface-900 relative z-10"><div class="flex items-center gap-3"><div class="px-2 py-0.5 bg-surface-950 border border-surface-900 rounded text-[8px] font-black text-surface-600 uppercase tracking-widest">ALUMNO</div> `);
      if (student.level) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="px-2 py-0.5 bg-primary-500/10 border border-primary-500/20 rounded text-[8px] font-black text-primary-400 uppercase tracking-widest">${escape_html(student.level)}</div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></div> <button class="flex items-center gap-2 text-[9px] font-black text-primary-400 uppercase tracking-[0.2em] hover:text-white transition-all group/btn">PERFIL COMPLETO `);
      Chevron_right($$payload, {
        class: "w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1"
      });
      $$payload.out.push(`<!----></button></div></div>`);
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></div>`);
  pop();
}
export {
  _page as default
};
