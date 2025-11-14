import { i as head, e as escape_html, o as attr_style, j as attr_class, k as ensure_array_like, l as attr, m as maybe_selected, d as bind_props, p as pop, f as push, h as stringify } from "../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { T as Trophy } from "../../../../../chunks/trophy.js";
import { F as File_text } from "../../../../../chunks/file-text.js";
import { C as Circle_alert } from "../../../../../chunks/circle-alert.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let formData = {
    name: "",
    description: "",
    format: "swiss",
    time_control: "10+5",
    max_players: 16,
    entry_fee: 5,
    prize_pool: 0
  };
  let currentStep = 1;
  let totalSteps = 4;
  let errors = {};
  const getFormatDescription = (format) => {
    const descriptions = {
      swiss: "Sistema suizo: Cada jugador juega el mismo número de partidas. Emparejamientos basados en puntuación.",
      round_robin: "Todos contra todos: Cada jugador juega contra todos los demás participantes.",
      knockout: "Eliminatorio: Los perdedores quedan eliminados. Formato de copa.",
      single_elimination: "Eliminación simple: Una sola derrota elimina al jugador."
    };
    return descriptions[format] || "";
  };
  if (formData.auto_prize_pool) {
    formData.prize_pool = formData.max_players * formData.entry_fee * 0.8;
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Crear Nuevo Torneo - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-slate-900"><div class="border-b border-slate-700/50 bg-slate-800/50"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between py-6"><div class="flex items-center space-x-4"><button class="p-2 text-slate-400 hover:text-white transition-colors" title="Volver a Torneos">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="p-2 bg-orange-500/20 rounded-lg">`);
  Trophy($$payload, { class: "w-8 h-8 text-orange-400" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold text-white">Crear Nuevo Torneo</h1> <p class="text-slate-400">Configurar una nueva competición</p></div></div> <button class="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors">`);
  File_text($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> <span>${escape_html("Vista Previa")}</span></button></div></div></div> <div class="bg-slate-800/30 border-b border-slate-700/50"><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4"><div class="flex items-center justify-between mb-2"><span class="text-sm font-medium text-slate-300">Paso ${escape_html(currentStep)} de 4</span> <span class="text-sm text-slate-400">${escape_html(Math.round(currentStep / totalSteps * 100))}% completado</span></div> <div class="w-full bg-slate-700/50 rounded-full h-2"><div class="bg-orange-500 h-2 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(currentStep / totalSteps * 100)}%`)}></div></div></div></div> <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div${attr_class(`grid grid-cols-1 ${stringify("")} gap-8`)}><div class="space-y-8">`);
  {
    $$payload.out.push("<!--[-->");
    const each_array = ensure_array_like(["swiss", "round_robin", "knockout", "single_elimination"]);
    $$payload.out.push(`<div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><div class="flex items-center space-x-3 mb-6"><div class="p-2 bg-orange-500/20 rounded-lg">`);
    File_text($$payload, { class: "w-5 h-5 text-orange-400" });
    $$payload.out.push(`<!----></div> <h2 class="text-lg font-semibold text-white">Información Básica</h2></div> <div class="space-y-6"><div><label for="tournament_name" class="block text-sm font-medium text-slate-300 mb-2">Nombre del Torneo</label> <input id="tournament_name" type="text"${attr("value", formData.name)} placeholder="Ej: Torneo Principiantes Marzo 2024" class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"/> `);
    if (errors.name) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<p class="mt-1 text-sm text-red-400">${escape_html(errors.name)}</p>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div> <div><label for="tournament_description" class="block text-sm font-medium text-slate-300 mb-2">Descripción</label> <textarea id="tournament_description" placeholder="Describe el torneo, nivel requerido, objetivos..." rows="3" class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none">`);
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
    $$payload.out.push(`<!--]--></div> <div><fieldset><legend class="block text-sm font-medium text-slate-300 mb-3">Formato del Torneo</legend> <div class="grid grid-cols-1 md:grid-cols-2 gap-3"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let format = each_array[$$index];
      $$payload.out.push(`<label class="relative"><input type="radio"${attr("checked", formData.format === format, true)}${attr("value", format)} class="sr-only"/> <div${attr_class(`p-4 border-2 rounded-lg cursor-pointer transition-all ${stringify(formData.format === format ? "border-orange-500 bg-orange-500/10" : "border-slate-600 hover:border-slate-500")}`)}><div${attr_class(`font-medium ${stringify(formData.format === format ? "text-orange-300" : "text-white")} mb-1`)}>${escape_html(format === "swiss" ? "Sistema Suizo" : format === "round_robin" ? "Round Robin" : format === "knockout" ? "Eliminatorio" : "Eliminación Simple")}</div> <div class="text-xs text-slate-400">${escape_html(getFormatDescription(format))}</div></div></label>`);
    }
    $$payload.out.push(`<!--]--></div> `);
    if (errors.format) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<p class="mt-1 text-sm text-red-400">${escape_html(errors.format)}</p>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></fieldset></div> <div><label for="time_control" class="block text-sm font-medium text-slate-300 mb-2">Control de Tiempo</label> <select id="time_control" class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500/50">`);
    $$payload.select_value = formData.time_control;
    $$payload.out.push(`<option value="5+3"${maybe_selected($$payload, "5+3")}>Blitz 5+3</option><option value="10+5"${maybe_selected($$payload, "10+5")}>Rápidas 10+5</option><option value="15+10"${maybe_selected($$payload, "15+10")}>Rápidas 15+10</option><option value="30+0"${maybe_selected($$payload, "30+0")}>Clásicas 30+0</option><option value="60+30"${maybe_selected($$payload, "60+30")}>Clásicas 60+30</option><option value="90+30"${maybe_selected($$payload, "90+30")}>Clásicas 90+30</option>`);
    $$payload.select_value = void 0;
    $$payload.out.push(`</select></div></div></div>`);
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  if (errors.submit) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4"><div class="flex items-center space-x-2">`);
    Circle_alert($$payload, { class: "w-5 h-5 text-red-400" });
    $$payload.out.push(`<!----> <p class="text-red-400">${escape_html(errors.submit)}</p></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> <div class="flex items-center justify-between space-x-4"><button${attr("disabled", currentStep === 1, true)} class="px-6 py-3 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Anterior</button> <div class="flex items-center space-x-4"><button class="px-6 py-3 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors">Cancelar</button> `);
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<button class="flex items-center space-x-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"><span>Siguiente</span> `);
    Arrow_left($$payload, { class: "w-4 h-4 rotate-180" });
    $$payload.out.push(`<!----></button>`);
  }
  $$payload.out.push(`<!--]--></div></div></div> `);
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
