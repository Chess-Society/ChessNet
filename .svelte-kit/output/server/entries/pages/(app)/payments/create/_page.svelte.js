import { e as ensure_array_like, h as head, d as escape_html, f as attr_class, i as attr, m as maybe_selected, j as bind_props, p as pop, k as push, l as stringify } from "../../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { D as Dollar_sign } from "../../../../../chunks/dollar-sign.js";
import { F as File_text } from "../../../../../chunks/file-text.js";
import { U as Users } from "../../../../../chunks/users.js";
import { S as School } from "../../../../../chunks/school.js";
import { C as Circle_alert } from "../../../../../chunks/circle-alert.js";
import { C as Circle_check_big } from "../../../../../chunks/circle-check-big.js";
function _page($$payload, $$props) {
  push();
  let filteredClasses, selectedStudent, selectedSchool, selectedClass;
  let data = $$props["data"];
  let formData = {
    payment_type: "student",
    student_id: "",
    school_id: "",
    class_id: "",
    amount: 0,
    concept: "monthly_fee",
    description: "",
    period_start: "",
    period_end: "",
    due_date: "",
    notes: ""
  };
  let isSubmitting = false;
  let errors = {};
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
  };
  filteredClasses = data.classes?.filter((cls) => {
    return data.classes || [];
  }) || [];
  selectedStudent = data.students?.find((s) => s.id === formData.student_id);
  selectedSchool = data.schools?.find((s) => s.id === formData.school_id);
  selectedClass = data.classes?.find((c) => c.id === formData.class_id);
  if (selectedClass && formData.amount === 0) {
    formData.amount = selectedClass.price;
  }
  if (selectedStudent || selectedSchool) {
    const conceptLabels = {
      monthly_fee: "Mensualidad",
      registration: "Inscripción",
      tournament: "Torneo",
      material: "Material educativo",
      private_lesson: "Clase particular",
      other: "Otros servicios"
    };
    const entityName = selectedStudent?.name || selectedSchool?.name || "";
    const className = selectedClass ? ` - ${selectedClass.name}` : "";
    const periodText = "";
    formData.description = `${conceptLabels[formData.concept]} ${entityName}${className}${periodText}`;
  }
  const each_array_2 = ensure_array_like(
    // Set default due date (next month, day 5)
    // Reset related fields when payment type changes
    // Validaciones opcionales - solo validar formato si se proporciona
    // Redirect to payments page with success message
    filteredClasses
  );
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Crear Nuevo Pago - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-slate-900"><div class="border-b border-slate-700/50 bg-slate-800/50"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between py-6"><div class="flex items-center space-x-4"><button class="p-2 text-slate-400 hover:text-white transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="p-2 bg-emerald-500/20 rounded-lg">`);
  Dollar_sign($$payload, { class: "w-8 h-8 text-emerald-400" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold text-white">Crear Nuevo Pago</h1> <p class="text-slate-400">Registrar un nuevo pago o factura</p></div></div> <button class="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors">`);
  File_text($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> <span>${escape_html("Vista Previa")}</span></button></div></div></div> <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div${attr_class(`grid grid-cols-1 ${stringify("")} gap-8`)}><div class="space-y-8"><div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h2 class="text-lg font-semibold text-white mb-4">Tipo de Pago</h2> <div class="grid grid-cols-2 gap-4"><label class="relative"><input type="radio"${attr("checked", formData.payment_type === "student", true)} value="student" class="sr-only"/> <div${attr_class(`p-4 border-2 rounded-lg cursor-pointer transition-all ${stringify(
    "border-emerald-500 bg-emerald-500/10"
  )}`)}><div class="flex items-center space-x-3">`);
  Users($$payload, {
    class: `w-6 h-6 ${stringify("text-emerald-400")}`
  });
  $$payload.out.push(`<!----> <div><h3${attr_class(`font-medium ${stringify("text-emerald-300")}`)}>Estudiante Individual</h3> <p class="text-sm text-slate-400">Pago de un estudiante específico</p></div></div></div></label> <label class="relative"><input type="radio"${attr("checked", formData.payment_type === "school", true)} value="school" class="sr-only"/> <div${attr_class(`p-4 border-2 rounded-lg cursor-pointer transition-all ${stringify("border-slate-600 hover:border-slate-500")}`)}><div class="flex items-center space-x-3">`);
  School($$payload, {
    class: `w-6 h-6 ${stringify("text-slate-400")}`
  });
  $$payload.out.push(`<!----> <div><h3${attr_class(`font-medium ${stringify("text-white")}`)}>Centro Educativo</h3> <p class="text-sm text-slate-400">Pago de un centro completo</p></div></div></div></label></div> `);
  if (errors.payment_type) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="mt-2 text-sm text-red-400 flex items-center space-x-1">`);
    Circle_alert($$payload, { class: "w-4 h-4" });
    $$payload.out.push(`<!----> <span>${escape_html(errors.payment_type)}</span></p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h2 class="text-lg font-semibold text-white mb-4">${escape_html("Seleccionar Estudiante")}</h2> `);
  {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(data.students || []);
    $$payload.out.push(`<div class="space-y-4"><div><label for="student_id" class="block text-sm font-medium text-slate-300 mb-2">Estudiante</label> <select id="student_id" class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50">`);
    $$payload.select_value = formData.student_id;
    $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>Selecciona un estudiante</option><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let student = each_array[$$index];
      $$payload.out.push(`<option${attr("value", student.id)}${maybe_selected($$payload, student.id)}>${escape_html(student.name)} - ${escape_html(student.email)}</option>`);
    }
    $$payload.out.push(`<!--]-->`);
    $$payload.select_value = void 0;
    $$payload.out.push(`</select> `);
    if (errors.student_id) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<p class="mt-1 text-sm text-red-400">${escape_html(errors.student_id)}</p>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div> `);
    if (selectedStudent) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="p-3 bg-slate-700/30 rounded-lg"><div class="flex items-center space-x-3">`);
      Users($$payload, { class: "w-5 h-5 text-blue-400" });
      $$payload.out.push(`<!----> <div><p class="font-medium text-white">${escape_html(selectedStudent.name)}</p> <p class="text-sm text-slate-400">${escape_html(selectedStudent.email)}</p></div></div></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div>`);
  }
  $$payload.out.push(`<!--]--></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h2 class="text-lg font-semibold text-white mb-4">Detalles del Pago</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="concept" class="block text-sm font-medium text-slate-300 mb-2">Concepto</label> <select id="concept" class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50">`);
  $$payload.select_value = formData.concept;
  $$payload.out.push(`<option value="monthly_fee"${maybe_selected($$payload, "monthly_fee")}>Mensualidad</option><option value="registration"${maybe_selected($$payload, "registration")}>Inscripción</option><option value="tournament"${maybe_selected($$payload, "tournament")}>Torneo</option><option value="material"${maybe_selected($$payload, "material")}>Material</option><option value="private_lesson"${maybe_selected($$payload, "private_lesson")}>Clase Particular</option><option value="other"${maybe_selected($$payload, "other")}>Otros</option>`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select> `);
  if (errors.concept) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="mt-1 text-sm text-red-400">${escape_html(errors.concept)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div><label for="class_id" class="block text-sm font-medium text-slate-300 mb-2">Clase (opcional)</label> <select id="class_id" class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50">`);
  $$payload.select_value = formData.class_id;
  $$payload.out.push(`<option value=""${maybe_selected($$payload, "")}>Sin clase específica</option><!--[-->`);
  for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
    let cls = each_array_2[$$index_2];
    $$payload.out.push(`<option${attr("value", cls.id)}${maybe_selected($$payload, cls.id)}>${escape_html(cls.name)} - ${escape_html(formatCurrency(cls.price))}</option>`);
  }
  $$payload.out.push(`<!--]-->`);
  $$payload.select_value = void 0;
  $$payload.out.push(`</select></div> <div><label for="amount" class="block text-sm font-medium text-slate-300 mb-2">Importe</label> <div class="relative"><input id="amount" type="number" step="0.01" min="0"${attr("value", formData.amount)} placeholder="0.00" class="w-full pl-8 pr-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"/> `);
  Dollar_sign($$payload, {
    class: "absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
  });
  $$payload.out.push(`<!----></div> `);
  if (errors.amount) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="mt-1 text-sm text-red-400">${escape_html(errors.amount)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div><label for="due_date" class="block text-sm font-medium text-slate-300 mb-2">Fecha de Vencimiento</label> <input id="due_date" type="date"${attr("value", formData.due_date)} class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"/> `);
  if (errors.due_date) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="mt-1 text-sm text-red-400">${escape_html(errors.due_date)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div> <div class="mt-4"><label for="description" class="block text-sm font-medium text-slate-300 mb-2">Descripción</label> <textarea id="description" placeholder="Descripción del pago..." rows="3" class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none">`);
  const $$body = escape_html(formData.description);
  if ($$body) {
    $$payload.out.push(`${$$body}`);
  }
  $$payload.out.push(`</textarea> `);
  if (errors.description) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="mt-1 text-sm text-red-400">${escape_html(errors.description)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h2 class="text-lg font-semibold text-white mb-4">Período (Opcional)</h2> <p class="text-sm text-slate-400 mb-4">Define el período que cubre este pago (útil para mensualidades)</p> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="period_start" class="block text-sm font-medium text-slate-300 mb-2">Fecha de Inicio</label> <input id="period_start" type="date"${attr("value", formData.period_start)} class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"/></div> <div><label for="period_end" class="block text-sm font-medium text-slate-300 mb-2">Fecha de Fin</label> <input id="period_end" type="date"${attr("value", formData.period_end)} class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"/></div></div> `);
  if (errors.period_start) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<p class="mt-2 text-sm text-red-400">${escape_html(errors.period_start)}</p>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h2 class="text-lg font-semibold text-white mb-4">Notas Adicionales</h2> <textarea placeholder="Notas internas, recordatorios, observaciones..." rows="3" class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none">`);
  const $$body_1 = escape_html(formData.notes);
  if ($$body_1) {
    $$payload.out.push(`${$$body_1}`);
  }
  $$payload.out.push(`</textarea></div> `);
  if (errors.submit) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4"><div class="flex items-center space-x-2">`);
    Circle_alert($$payload, { class: "w-5 h-5 text-red-400" });
    $$payload.out.push(`<!----> <p class="text-red-400">${escape_html(errors.submit)}</p></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="flex items-center justify-between space-x-4"><button class="px-6 py-3 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors">Cancelar</button> <button${attr("disabled", isSubmitting, true)} class="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white rounded-lg transition-colors">`);
  {
    $$payload.out.push("<!--[!-->");
    Circle_check_big($$payload, { class: "w-4 h-4" });
    $$payload.out.push(`<!----> <span>Crear Pago</span>`);
  }
  $$payload.out.push(`<!--]--></button></div></div> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
