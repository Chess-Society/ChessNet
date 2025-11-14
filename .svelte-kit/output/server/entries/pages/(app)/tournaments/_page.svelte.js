import { k as ensure_array_like, i as head, e as escape_html, l as attr, j as attr_class, h as stringify, d as bind_props, p as pop, f as push } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../chunks/arrow-left.js";
import { T as Trophy } from "../../../../chunks/trophy.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { P as Play, a as Pen_line } from "../../../../chunks/play.js";
import { U as Users } from "../../../../chunks/users.js";
import { A as Award } from "../../../../chunks/award.js";
import { T as Trending_up } from "../../../../chunks/trending-up.js";
import { S as Search } from "../../../../chunks/search.js";
import { F as Funnel } from "../../../../chunks/funnel.js";
import { C as Chevron_down } from "../../../../chunks/chevron-down.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { M as Map_pin } from "../../../../chunks/map-pin.js";
import { E as Eye } from "../../../../chunks/eye.js";
import { S as Settings } from "../../../../chunks/settings.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { C as Circle_alert } from "../../../../chunks/circle-alert.js";
import { C as Circle_check_big } from "../../../../chunks/circle-check-big.js";
function _page($$payload, $$props) {
  push();
  let filteredTournaments;
  let data = $$props["data"];
  let searchTerm = "";
  let statusFilter = "all";
  let formatFilter = "all";
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
  };
  const getStatusBadge = (status) => {
    const badges = {
      draft: {
        class: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        label: "Borrador"
      },
      upcoming: {
        class: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        label: "Próximo"
      },
      in_progress: {
        class: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        label: "En Curso"
      },
      completed: {
        class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        label: "Completado"
      },
      cancelled: {
        class: "bg-red-500/20 text-red-400 border-red-500/30",
        label: "Cancelado"
      }
    };
    return badges[status] || badges.draft;
  };
  const getFormatLabel = (format) => {
    const labels = {
      swiss: "Suizo",
      round_robin: "Round Robin",
      knockout: "Eliminatorio",
      single_elimination: "Eliminación Simple"
    };
    return labels[format] || format;
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "draft":
        return Pen_line;
      case "upcoming":
        return Calendar;
      case "in_progress":
        return Play;
      case "completed":
        return Circle_check_big;
      case "cancelled":
        return Circle_alert;
      default:
        return Trophy;
    }
  };
  const getOccupancyColor = (registered, max) => {
    const percentage = registered / max * 100;
    if (percentage >= 90) return "text-emerald-400";
    if (percentage >= 70) return "text-yellow-400";
    if (percentage >= 50) return "text-blue-400";
    return "text-slate-400";
  };
  const isRegistrationOpen = (tournament) => {
    const now = /* @__PURE__ */ new Date();
    const deadline = new Date(tournament.registration_deadline);
    return now < deadline && tournament.status !== "completed" && tournament.status !== "cancelled";
  };
  filteredTournaments = data.tournaments?.filter((tournament) => {
    const matchesSearch = !searchTerm;
    const matchesStatus = statusFilter === "all";
    const matchesFormat = formatFilter === "all";
    return matchesSearch && matchesStatus && matchesFormat;
  }) || [];
  const each_array = ensure_array_like(
    // Importar tournamentDB dinámicamente
    // Recargar la página para actualizar la lista
    filteredTournaments
  );
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Gestión de Torneos - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-slate-900"><div class="border-b border-slate-700/50 bg-slate-800/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-6"><div class="flex items-center space-x-4"><button class="p-2 text-slate-400 hover:text-white transition-colors" title="Volver al Dashboard">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="p-2 bg-orange-500/20 rounded-lg">`);
  Trophy($$payload, { class: "w-8 h-8 text-orange-400" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold text-white">Gestión de Torneos</h1> <p class="text-slate-400">Organizar competiciones locales</p></div></div> <button class="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">`);
  Plus($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> <span>Nuevo Torneo</span></button></div></div></div> <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"><div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><div class="flex items-center justify-between mb-4"><div class="p-2 bg-orange-500/20 rounded-lg">`);
  Trophy($$payload, { class: "w-6 h-6 text-orange-400" });
  $$payload.out.push(`<!----></div></div> <h3 class="text-2xl font-bold text-white mb-1">${escape_html(data.tournamentStats?.total_tournaments || 0)}</h3> <p class="text-slate-400 text-sm">Total torneos</p></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><div class="flex items-center justify-between mb-4"><div class="p-2 bg-yellow-500/20 rounded-lg">`);
  Play($$payload, { class: "w-6 h-6 text-yellow-400" });
  $$payload.out.push(`<!----></div> <span class="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">${escape_html(data.tournamentStats?.in_progress_tournaments || 0)}</span></div> <h3 class="text-2xl font-bold text-white mb-1">En Curso</h3> <p class="text-slate-400 text-sm">Activos ahora</p></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><div class="flex items-center justify-between mb-4"><div class="p-2 bg-blue-500/20 rounded-lg">`);
  Users($$payload, { class: "w-6 h-6 text-blue-400" });
  $$payload.out.push(`<!----></div></div> <h3 class="text-2xl font-bold text-white mb-1">${escape_html(data.tournamentStats?.total_players_registered || 0)}</h3> <p class="text-slate-400 text-sm">Participantes totales</p></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><div class="flex items-center justify-between mb-4"><div class="p-2 bg-emerald-500/20 rounded-lg">`);
  Award($$payload, { class: "w-6 h-6 text-emerald-400" });
  $$payload.out.push(`<!----></div> `);
  Trending_up($$payload, { class: "w-4 h-4 text-emerald-400" });
  $$payload.out.push(`<!----></div> <h3 class="text-2xl font-bold text-white mb-1">${escape_html(formatCurrency(data.tournamentStats?.total_prize_pool || 0))}</h3> <p class="text-slate-400 text-sm">En premios</p></div></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 mb-8"><div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"><div class="relative">`);
  Search($$payload, {
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
  });
  $$payload.out.push(`<!----> <input type="text" placeholder="Buscar torneos..."${attr("value", searchTerm)} class="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 w-full lg:w-80"/></div> <div class="flex items-center space-x-3"><button class="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors">`);
  Funnel($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> <span>Filtros</span> `);
  Chevron_down($$payload, {
    class: `w-4 h-4 transition-transform ${stringify("")}`
  });
  $$payload.out.push(`<!----></button></div></div> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div> <div class="space-y-6"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tournament = each_array[$$index];
    const statusBadge = getStatusBadge(tournament.status);
    const StatusIcon = getStatusIcon(tournament.status);
    $$payload.out.push(`<div class="bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-700/30 transition-all duration-200"><div class="p-6"><div class="flex items-start justify-between mb-4"><div class="flex items-start space-x-4"><div class="p-3 bg-orange-500/20 rounded-lg">`);
    StatusIcon($$payload, { class: "w-6 h-6 text-orange-400" });
    $$payload.out.push(`<!----></div> <div class="flex-1"><div class="flex items-center space-x-3 mb-2"><h3 class="text-lg font-semibold text-white">${escape_html(tournament.name)}</h3> <span${attr_class(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stringify(statusBadge.class)}`)}>${escape_html(statusBadge.label)}</span></div> <p class="text-slate-400 mb-3">${escape_html(tournament.description)}</p> <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"><div class="flex items-center space-x-2">`);
    Calendar($$payload, { class: "w-4 h-4 text-slate-500" });
    $$payload.out.push(`<!----> <span class="text-slate-300">${escape_html(formatDate(tournament.start_date))}</span></div> <div class="flex items-center space-x-2">`);
    Clock($$payload, { class: "w-4 h-4 text-slate-500" });
    $$payload.out.push(`<!----> <span class="text-slate-300">${escape_html(tournament.time_control)}</span></div> <div class="flex items-center space-x-2">`);
    Map_pin($$payload, { class: "w-4 h-4 text-slate-500" });
    $$payload.out.push(`<!----> <span class="text-slate-300">${escape_html(tournament.location)}</span></div></div></div></div> <div class="flex items-center space-x-2"><button class="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors" title="Ver detalles del torneo">`);
    Eye($$payload, { class: "w-4 h-4" });
    $$payload.out.push(`<!----> <span>Ver</span></button> <button class="flex items-center space-x-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors" title="Gestionar torneo">`);
    Settings($$payload, { class: "w-4 h-4" });
    $$payload.out.push(`<!----> <span>Gestionar</span></button> <button class="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors" title="Eliminar torneo">`);
    Trash_2($$payload, { class: "w-4 h-4" });
    $$payload.out.push(`<!----> <span>Eliminar</span></button></div></div> <div class="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-slate-700/50"><div class="text-center"><div${attr_class(`text-lg font-semibold ${stringify(getOccupancyColor(tournament.players_registered, tournament.max_players))}`)}>${escape_html(tournament.players_registered)}/${escape_html(tournament.max_players)}</div> <div class="text-xs text-slate-400">Jugadores</div></div> <div class="text-center"><div class="text-lg font-semibold text-white">${escape_html(getFormatLabel(tournament.format))}</div> <div class="text-xs text-slate-400">Formato</div></div> <div class="text-center"><div class="text-lg font-semibold text-white">${escape_html(tournament.current_round)}/${escape_html(tournament.total_rounds)}</div> <div class="text-xs text-slate-400">Rondas</div></div> <div class="text-center"><div class="text-lg font-semibold text-emerald-400">${escape_html(formatCurrency(tournament.entry_fee))}</div> <div class="text-xs text-slate-400">Inscripción</div></div> <div class="text-center"><div class="text-lg font-semibold text-emerald-400">${escape_html(formatCurrency(tournament.prize_pool))}</div> <div class="text-xs text-slate-400">Premios</div></div></div> <div class="mt-4 flex items-center justify-between text-sm"><div class="flex items-center space-x-4"><span class="text-slate-400">Organizado por: <span class="text-slate-300">${escape_html(tournament.organizer)}</span></span> `);
    if (tournament.status === "upcoming" && isRegistrationOpen(tournament)) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<span class="text-emerald-400">✓ Inscripciones abiertas hasta ${escape_html(formatDate(tournament.registration_deadline))}</span>`);
    } else {
      $$payload.out.push("<!--[!-->");
      if (tournament.status === "upcoming") {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<span class="text-red-400">✗ Inscripciones cerradas</span>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]--></div> <div class="text-slate-400">Creado: ${escape_html(formatDate(tournament.created_at))}</div></div></div></div>`);
  }
  $$payload.out.push(`<!--]--> `);
  if (filteredTournaments.length === 0) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="text-center py-12">`);
    Trophy($$payload, { class: "w-12 h-12 text-slate-600 mx-auto mb-4" });
    $$payload.out.push(`<!----> <p class="text-slate-400">No se encontraron torneos</p> `);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></div></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
