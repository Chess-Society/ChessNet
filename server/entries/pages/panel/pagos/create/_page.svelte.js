import { h as head, c as escape_html, a as attr_class, i as attr, e as ensure_array_like, aj as bind_props, b as stringify } from "../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import "../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { D as Dollar_sign } from "../../../../../chunks/dollar-sign.js";
import { F as File_text } from "../../../../../chunks/file-text.js";
import { U as Users } from "../../../../../chunks/users.js";
import { S as School } from "../../../../../chunks/school.js";
import { C as Circle_alert } from "../../../../../chunks/circle-alert.js";
import { C as Circle_check_big } from "../../../../../chunks/circle-check-big.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
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
    head("qbepmx", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Crear Nuevo Pago - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-slate-900"><div class="border-b border-slate-700/50 bg-slate-800/50"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between py-6"><div class="flex items-center space-x-4"><button class="p-2 text-slate-400 hover:text-white transition-colors">`);
    Arrow_left($$renderer2, { class: "w-5 h-5" });
    $$renderer2.push(`<!----></button> <div class="p-2 bg-emerald-500/20 rounded-lg">`);
    Dollar_sign($$renderer2, { class: "w-8 h-8 text-emerald-400" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-2xl font-bold text-white">Crear Nuevo Pago</h1> <p class="text-slate-400">Registrar un nuevo pago o factura</p></div></div> <button class="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors">`);
    File_text($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> <span>${escape_html("Vista Previa")}</span></button></div></div></div> <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div${attr_class(`grid grid-cols-1 ${stringify("")} gap-8`)}><div class="space-y-8"><div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h2 class="text-lg font-semibold text-white mb-4">Tipo de Pago</h2> <div class="grid grid-cols-2 gap-4"><label class="relative"><input type="radio"${attr("checked", formData.payment_type === "student", true)} value="student" class="sr-only"/> <div${attr_class(`p-4 border-2 rounded-lg cursor-pointer transition-all ${stringify(
      "border-emerald-500 bg-emerald-500/10"
    )}`)}><div class="flex items-center space-x-3">`);
    Users($$renderer2, {
      class: `w-6 h-6 ${stringify("text-emerald-400")}`
    });
    $$renderer2.push(`<!----> <div><h3${attr_class(`font-medium ${stringify("text-emerald-300")}`)}>Estudiante Individual</h3> <p class="text-sm text-slate-400">Pago de un estudiante específico</p></div></div></div></label> <label class="relative"><input type="radio"${attr("checked", formData.payment_type === "school", true)} value="school" class="sr-only"/> <div${attr_class(`p-4 border-2 rounded-lg cursor-pointer transition-all ${stringify("border-slate-600 hover:border-slate-500")}`)}><div class="flex items-center space-x-3">`);
    School($$renderer2, {
      class: `w-6 h-6 ${stringify("text-slate-400")}`
    });
    $$renderer2.push(`<!----> <div><h3${attr_class(`font-medium ${stringify("text-white")}`)}>Centro Educativo</h3> <p class="text-sm text-slate-400">Pago de un centro completo</p></div></div></div></label></div> `);
    if (errors.payment_type) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-2 text-sm text-red-400 flex items-center space-x-1">`);
      Circle_alert($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> <span>${escape_html(errors.payment_type)}</span></p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h2 class="text-lg font-semibold text-white mb-4">${escape_html("Seleccionar Estudiante")}</h2> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="space-y-4"><div><label for="student_id" class="block text-sm font-medium text-slate-300 mb-2">Estudiante</label> `);
      $$renderer2.select(
        {
          id: "student_id",
          value: formData.student_id,
          class: "w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "" }, ($$renderer4) => {
            $$renderer4.push(`Selecciona un estudiante`);
          });
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(data.students || []);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let student = each_array[$$index];
            $$renderer3.option({ value: student.id }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(student.name)} - ${escape_html(student.email)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      );
      $$renderer2.push(` `);
      if (errors.student_id) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="mt-1 text-sm text-red-400">${escape_html(errors.student_id)}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (selectedStudent) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="p-3 bg-slate-700/30 rounded-lg"><div class="flex items-center space-x-3">`);
        Users($$renderer2, { class: "w-5 h-5 text-blue-400" });
        $$renderer2.push(`<!----> <div><p class="font-medium text-white">${escape_html(selectedStudent.name)}</p> <p class="text-sm text-slate-400">${escape_html(selectedStudent.email)}</p></div></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h2 class="text-lg font-semibold text-white mb-4">Detalles del Pago</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="concept" class="block text-sm font-medium text-slate-300 mb-2">Concepto</label> `);
    $$renderer2.select(
      {
        id: "concept",
        value: formData.concept,
        class: "w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "monthly_fee" }, ($$renderer4) => {
          $$renderer4.push(`Mensualidad`);
        });
        $$renderer3.option({ value: "registration" }, ($$renderer4) => {
          $$renderer4.push(`Inscripción`);
        });
        $$renderer3.option({ value: "tournament" }, ($$renderer4) => {
          $$renderer4.push(`Torneo`);
        });
        $$renderer3.option({ value: "material" }, ($$renderer4) => {
          $$renderer4.push(`Material`);
        });
        $$renderer3.option({ value: "private_lesson" }, ($$renderer4) => {
          $$renderer4.push(`Clase Particular`);
        });
        $$renderer3.option({ value: "other" }, ($$renderer4) => {
          $$renderer4.push(`Otros`);
        });
      }
    );
    $$renderer2.push(` `);
    if (errors.concept) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-1 text-sm text-red-400">${escape_html(errors.concept)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="class_id" class="block text-sm font-medium text-slate-300 mb-2">Clase (opcional)</label> `);
    $$renderer2.select(
      {
        id: "class_id",
        value: formData.class_id,
        class: "w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Sin clase específica`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(filteredClasses);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let cls = each_array_2[$$index_2];
          $$renderer3.option({ value: cls.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(cls.name)} - ${escape_html(formatCurrency(cls.price))}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div><label for="amount" class="block text-sm font-medium text-slate-300 mb-2">Importe</label> <div class="relative"><input id="amount" type="number" step="0.01" min="0"${attr("value", formData.amount)} placeholder="0.00" class="w-full pl-8 pr-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"/> `);
    Dollar_sign($$renderer2, {
      class: "absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
    });
    $$renderer2.push(`<!----></div> `);
    if (errors.amount) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-1 text-sm text-red-400">${escape_html(errors.amount)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="due_date" class="block text-sm font-medium text-slate-300 mb-2">Fecha de Vencimiento</label> <input id="due_date" type="date"${attr("value", formData.due_date)} class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"/> `);
    if (errors.due_date) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-1 text-sm text-red-400">${escape_html(errors.due_date)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="mt-4"><label for="description" class="block text-sm font-medium text-slate-300 mb-2">Descripción</label> <textarea id="description" placeholder="Descripción del pago..." rows="3" class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none">`);
    const $$body = escape_html(formData.description);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> `);
    if (errors.description) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-1 text-sm text-red-400">${escape_html(errors.description)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h2 class="text-lg font-semibold text-white mb-4">Período (Opcional)</h2> <p class="text-sm text-slate-400 mb-4">Define el período que cubre este pago (útil para mensualidades)</p> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="period_start" class="block text-sm font-medium text-slate-300 mb-2">Fecha de Inicio</label> <input id="period_start" type="date"${attr("value", formData.period_start)} class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"/></div> <div><label for="period_end" class="block text-sm font-medium text-slate-300 mb-2">Fecha de Fin</label> <input id="period_end" type="date"${attr("value", formData.period_end)} class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"/></div></div> `);
    if (errors.period_start) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="mt-2 text-sm text-red-400">${escape_html(errors.period_start)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h2 class="text-lg font-semibold text-white mb-4">Notas Adicionales</h2> <textarea placeholder="Notas internas, recordatorios, observaciones..." rows="3" class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-none">`);
    const $$body_1 = escape_html(formData.notes);
    if ($$body_1) {
      $$renderer2.push(`${$$body_1}`);
    }
    $$renderer2.push(`</textarea></div> `);
    if (errors.submit) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4"><div class="flex items-center space-x-2">`);
      Circle_alert($$renderer2, { class: "w-5 h-5 text-red-400" });
      $$renderer2.push(`<!----> <p class="text-red-400">${escape_html(errors.submit)}</p></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="flex items-center justify-between space-x-4"><button class="px-6 py-3 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors">Cancelar</button> <button${attr("disabled", isSubmitting, true)} class="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white rounded-lg transition-colors">`);
    {
      $$renderer2.push("<!--[-1-->");
      Circle_check_big($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> <span>Crear Pago</span>`);
    }
    $$renderer2.push(`<!--]--></button></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></main></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
