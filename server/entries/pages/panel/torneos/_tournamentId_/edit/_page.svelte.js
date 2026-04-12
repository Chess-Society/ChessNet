import { h as head, c as escape_html, i as attr, a as attr_class, aj as bind_props, b as stringify } from "../../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../../chunks/exports.js";
import "../../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../chunks/root.js";
import "../../../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { T as Trophy } from "../../../../../../chunks/trophy.js";
import { S as Settings } from "../../../../../../chunks/settings.js";
import { F as File_text } from "../../../../../../chunks/file-text.js";
import { S as Save } from "../../../../../../chunks/save.js";
import { T as Triangle_alert } from "../../../../../../chunks/triangle-alert.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let tournament = data.tournament;
    let isSubmitting = false;
    let errors = {};
    let formData = {
      name: tournament?.name || "",
      description: tournament?.description || "",
      format: tournament?.format || "swiss",
      time_control: tournament?.time_control || "15+10",
      max_players: tournament?.max_players || 16,
      entry_fee: tournament?.entry_fee || 0,
      prize_pool: tournament?.prize_pool || 0,
      start_date: tournament?.start_date ? new Date(tournament.start_date).toISOString().slice(0, 16) : "",
      end_date: tournament?.end_date ? new Date(tournament.end_date).toISOString().slice(0, 16) : "",
      registration_deadline: tournament?.registration_deadline ? new Date(tournament.registration_deadline).toISOString().slice(0, 16) : "",
      location: tournament?.location || "",
      organizer: tournament?.organizer || "",
      notes: tournament?.notes || "",
      rules: tournament?.rules || ""
    };
    const getFormatLabel = (format) => {
      const formats = {
        "swiss": "Sistema Suizo",
        "round_robin": "Todos contra Todos",
        "knockout": "Eliminatorio",
        "single_elimination": "Eliminación Simple"
      };
      return formats[format] || format;
    };
    const getStatusLabel = (status) => {
      const statuses = {
        "draft": "Borrador",
        "upcoming": "Próximo",
        "in_progress": "En Progreso",
        "completed": "Completado",
        "cancelled": "Cancelado"
      };
      return statuses[status] || status;
    };
    head("k33cl4", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Editar ${escape_html(tournament?.name || "Torneo")} - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-slate-900"><header class="bg-slate-800 border-b border-slate-700"><div class="container mx-auto px-4 py-6"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">`);
    Arrow_left($$renderer2, { class: "w-5 h-5 text-slate-400" });
    $$renderer2.push(`<!----></button> <div><h1 class="text-2xl font-bold text-white">Editar Torneo</h1> <p class="text-slate-400">${escape_html(tournament?.name || "Torneo")}</p></div></div> <div class="flex items-center space-x-3"><span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-slate-600 bg-slate-700/50 text-slate-300">${escape_html(getStatusLabel(tournament?.status || "draft"))}</span></div></div></div></header> <main class="container mx-auto px-4 py-8"><form class="max-w-4xl mx-auto"><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-6"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h2 class="text-xl font-semibold text-white mb-6 flex items-center">`);
    Trophy($$renderer2, { class: "w-5 h-5 mr-2 text-orange-400" });
    $$renderer2.push(`<!----> Información Básica</h2> <div class="space-y-4"><div><label for="name" class="block text-sm font-medium text-slate-300 mb-2">Nombre del Torneo *</label> <input id="name" type="text"${attr("value", formData.name)}${attr_class(`input w-full ${stringify(errors.name ? "border-red-500" : "")}`)} placeholder="Ej: Torneo Principiantes Marzo"/> `);
    if (errors.name) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.name)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="description" class="block text-sm font-medium text-slate-300 mb-2">Descripción *</label> <textarea id="description" rows="3"${attr_class(`input w-full ${stringify(errors.description ? "border-red-500" : "")}`)} placeholder="Describe el torneo, su propósito y características especiales">`);
    const $$body = escape_html(formData.description);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> `);
    if (errors.description) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.description)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="format" class="block text-sm font-medium text-slate-300 mb-2">Formato del Torneo *</label> `);
    $$renderer2.select({ id: "format", value: formData.format, class: "input w-full" }, ($$renderer3) => {
      $$renderer3.option({ value: "swiss" }, ($$renderer4) => {
        $$renderer4.push(`Sistema Suizo`);
      });
      $$renderer3.option({ value: "round_robin" }, ($$renderer4) => {
        $$renderer4.push(`Todos contra Todos`);
      });
      $$renderer3.option({ value: "knockout" }, ($$renderer4) => {
        $$renderer4.push(`Eliminatorio`);
      });
      $$renderer3.option({ value: "single_elimination" }, ($$renderer4) => {
        $$renderer4.push(`Eliminación Simple`);
      });
    });
    $$renderer2.push(`</div> <div><label for="time_control" class="block text-sm font-medium text-slate-300 mb-2">Control de Tiempo</label> `);
    $$renderer2.select(
      {
        id: "time_control",
        value: formData.time_control,
        class: "input w-full"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "5+0" }, ($$renderer4) => {
          $$renderer4.push(`5 minutos`);
        });
        $$renderer3.option({ value: "10+0" }, ($$renderer4) => {
          $$renderer4.push(`10 minutos`);
        });
        $$renderer3.option({ value: "15+10" }, ($$renderer4) => {
          $$renderer4.push(`15+10`);
        });
        $$renderer3.option({ value: "25+5" }, ($$renderer4) => {
          $$renderer4.push(`25+5`);
        });
        $$renderer3.option({ value: "30+0" }, ($$renderer4) => {
          $$renderer4.push(`30 minutos`);
        });
        $$renderer3.option({ value: "60+0" }, ($$renderer4) => {
          $$renderer4.push(`1 hora`);
        });
      }
    );
    $$renderer2.push(`</div></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h2 class="text-xl font-semibold text-white mb-6 flex items-center">`);
    Settings($$renderer2, { class: "w-5 h-5 mr-2 text-blue-400" });
    $$renderer2.push(`<!----> Configuración</h2> <div class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label for="max_players" class="block text-sm font-medium text-slate-300 mb-2">Máximo de Jugadores *</label> <input id="max_players" type="number" min="2" max="64"${attr("value", formData.max_players)}${attr_class(`input w-full ${stringify(errors.max_players ? "border-red-500" : "")}`)}/> `);
    if (errors.max_players) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.max_players)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="entry_fee" class="block text-sm font-medium text-slate-300 mb-2">Cuota de Inscripción (€)</label> <input id="entry_fee" type="number" min="0" step="0.01"${attr("value", formData.entry_fee)}${attr_class(`input w-full ${stringify(errors.entry_fee ? "border-red-500" : "")}`)}/> `);
    if (errors.entry_fee) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.entry_fee)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="prize_pool" class="block text-sm font-medium text-slate-300 mb-2">Premio Total (€)</label> <input id="prize_pool" type="number" min="0" step="0.01"${attr("value", formData.prize_pool)}${attr_class(`input w-full ${stringify(errors.prize_pool ? "border-red-500" : "")}`)}/> `);
    if (errors.prize_pool) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.prize_pool)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label for="start_date" class="block text-sm font-medium text-slate-300 mb-2">Fecha de Inicio *</label> <input id="start_date" type="datetime-local"${attr("value", formData.start_date)}${attr_class(`input w-full ${stringify(errors.start_date ? "border-red-500" : "")}`)}/> `);
    if (errors.start_date) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.start_date)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="end_date" class="block text-sm font-medium text-slate-300 mb-2">Fecha de Fin *</label> <input id="end_date" type="datetime-local"${attr("value", formData.end_date)}${attr_class(`input w-full ${stringify(errors.end_date ? "border-red-500" : "")}`)}/> `);
    if (errors.end_date) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.end_date)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="registration_deadline" class="block text-sm font-medium text-slate-300 mb-2">Límite Inscripción *</label> <input id="registration_deadline" type="datetime-local"${attr("value", formData.registration_deadline)}${attr_class(`input w-full ${stringify(errors.registration_deadline ? "border-red-500" : "")}`)}/> `);
    if (errors.registration_deadline) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.registration_deadline)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="location" class="block text-sm font-medium text-slate-300 mb-2">Ubicación *</label> <input id="location" type="text"${attr("value", formData.location)}${attr_class(`input w-full ${stringify(errors.location ? "border-red-500" : "")}`)} placeholder="Centro, sala, dirección..."/> `);
    if (errors.location) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.location)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div><label for="organizer" class="block text-sm font-medium text-slate-300 mb-2">Organizador *</label> <input id="organizer" type="text"${attr("value", formData.organizer)}${attr_class(`input w-full ${stringify(errors.organizer ? "border-red-500" : "")}`)} placeholder="Nombre del organizador"/> `);
    if (errors.organizer) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-red-400 text-sm mt-1">${escape_html(errors.organizer)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h2 class="text-xl font-semibold text-white mb-6 flex items-center">`);
    File_text($$renderer2, { class: "w-5 h-5 mr-2 text-green-400" });
    $$renderer2.push(`<!----> Información Adicional</h2> <div class="space-y-4"><div><label for="notes" class="block text-sm font-medium text-slate-300 mb-2">Notas Adicionales</label> <textarea id="notes" rows="3" class="input w-full" placeholder="Información adicional sobre el torneo...">`);
    const $$body_1 = escape_html(formData.notes);
    if ($$body_1) {
      $$renderer2.push(`${$$body_1}`);
    }
    $$renderer2.push(`</textarea></div> <div><label for="rules" class="block text-sm font-medium text-slate-300 mb-2">Reglas Específicas</label> <textarea id="rules" rows="4" class="input w-full" placeholder="Reglas específicas del torneo, variantes, etc...">`);
    const $$body_2 = escape_html(formData.rules);
    if ($$body_2) {
      $$renderer2.push(`${$$body_2}`);
    }
    $$renderer2.push(`</textarea></div></div></div></div> <div class="space-y-6"><div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h3 class="text-lg font-semibold text-white mb-4">Resumen</h3> <div class="space-y-3"><div class="flex justify-between"><span class="text-slate-400">Formato:</span> <span class="text-white">${escape_html(getFormatLabel(formData.format))}</span></div> <div class="flex justify-between"><span class="text-slate-400">Control:</span> <span class="text-white">${escape_html(formData.time_control)}</span></div> <div class="flex justify-between"><span class="text-slate-400">Jugadores:</span> <span class="text-white">${escape_html(formData.max_players)}</span></div> <div class="flex justify-between"><span class="text-slate-400">Cuota:</span> <span class="text-white">€${escape_html(formData.entry_fee)}</span></div> <div class="flex justify-between"><span class="text-slate-400">Premio:</span> <span class="text-white">€${escape_html(formData.prize_pool)}</span></div></div></div> <div class="bg-slate-800 border border-slate-700 rounded-xl p-6"><h3 class="text-lg font-semibold text-white mb-4">Acciones</h3> <div class="space-y-3"><button type="submit"${attr("disabled", isSubmitting, true)} class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white rounded-lg transition-colors">`);
    Save($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> <span>${escape_html("Guardar Cambios")}</span></button> <button type="button" class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">`);
    Arrow_left($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> <span>Cancelar</span></button></div></div> `);
    if (tournament?.status === "in_progress" || tournament?.status === "completed") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6"><div class="flex items-center space-x-2 mb-3">`);
      Triangle_alert($$renderer2, { class: "w-5 h-5 text-yellow-400" });
      $$renderer2.push(`<!----> <h3 class="text-lg font-semibold text-yellow-300">Advertencia</h3></div> <p class="text-yellow-200 text-sm">Este torneo ya ha comenzado o ha terminado. Algunos cambios pueden no ser aplicables.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></form></main></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
