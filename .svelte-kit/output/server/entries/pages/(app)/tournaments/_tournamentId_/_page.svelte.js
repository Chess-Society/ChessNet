import { i as head, e as escape_html, j as attr_class, h as stringify, o as attr_style, k as ensure_array_like, d as bind_props, p as pop, f as push } from "../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "clsx";
import "../../../../../chunks/state.svelte.js";
import { T as Triangle_alert } from "../../../../../chunks/triangle-alert.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { T as Trophy } from "../../../../../chunks/trophy.js";
import { C as Calendar } from "../../../../../chunks/calendar.js";
import { C as Clock } from "../../../../../chunks/clock.js";
import { M as Map_pin } from "../../../../../chunks/map-pin.js";
import { T as Target } from "../../../../../chunks/target.js";
import { U as User_plus } from "../../../../../chunks/user-plus.js";
import { P as Play, a as Pen_line } from "../../../../../chunks/play.js";
import { T as Trash_2 } from "../../../../../chunks/trash-2.js";
import { S as Settings } from "../../../../../chunks/settings.js";
import { C as Circle_check_big } from "../../../../../chunks/circle-check-big.js";
import { C as Circle_x } from "../../../../../chunks/circle-x.js";
function _page($$payload, $$props) {
  push();
  let tournament, registeredPlayers, rounds, pairings;
  let data = $$props["data"];
  let currentRoundPairings = [];
  const loadCurrentRoundPairings = async () => {
    if (!tournament?.id || !tournament?.current_round) return;
    try {
      const { tournamentDB } = await import("../../../../../chunks/tournaments.js");
      const pairings2 = await tournamentDB.getRoundPairings(tournament.id, tournament.current_round);
      currentRoundPairings = pairings2;
      console.log(`✅ Loaded ${pairings2.length} pairings for round ${tournament.current_round}`);
    } catch (error) {
      console.error("❌ Error loading pairings:", error);
      currentRoundPairings = [];
    }
  };
  const syncMockDataToIndexedDB = async () => {
    if (!tournament) return;
    try {
      const { tournamentDB } = await import("../../../../../chunks/tournaments.js");
      const existingTournament = await tournamentDB.getTournament(tournament.id);
      if (!existingTournament) {
        console.log("🔄 Syncing mock tournament to IndexedDB:", tournament.id);
        const newTournament = {
          ...tournament,
          id: tournament.id,
          // Usar el ID del mock, no generar uno nuevo
          created_at: tournament.created_at,
          updated_at: tournament.updated_at
        };
        const database = await tournamentDB.init();
        const transaction = database.transaction(["tournaments"], "readwrite");
        const store = transaction.objectStore("tournaments");
        await new Promise((resolve, reject) => {
          const request = store.add(newTournament);
          request.onsuccess = () => {
            console.log("✅ Tournament synced to IndexedDB:", tournament.id);
            resolve(newTournament);
          };
          request.onerror = () => reject(request.error);
        });
        for (const player of registeredPlayers) {
          try {
            await tournamentDB.registerPlayer({
              tournament_id: player.tournament_id,
              student_id: player.student_id,
              student_name: player.student_name,
              student_rating: player.student_rating,
              status: player.status,
              notes: player.notes
            });
          } catch (playerError) {
            if (playerError.name === "ConstraintError") {
              console.log("⚠️ Player already exists:", player.student_name);
              continue;
            }
            throw playerError;
          }
        }
        console.log("✅ Mock data synced to IndexedDB");
      }
    } catch (error) {
      console.error("❌ Error syncing mock data:", error);
    }
  };
  const clearDuplicateTournaments = async () => {
    try {
      const { tournamentDB } = await import("../../../../../chunks/tournaments.js");
      const database = await tournamentDB.init();
      const transaction = database.transaction(["tournaments"], "readwrite");
      const store = transaction.objectStore("tournaments");
      const request = store.getAll();
      request.onsuccess = () => {
        const tournaments = request.result || [];
        const mockTournaments = tournaments.filter((t) => t.id.startsWith("tournament-"));
        const dynamicTournaments = tournaments.filter((t) => t.id.startsWith("tournament_"));
        dynamicTournaments.forEach((tournament2) => {
          const mockEquivalent = mockTournaments.find((mt) => mt.name === tournament2.name);
          if (mockEquivalent) {
            console.log("🗑️ Removing duplicate tournament:", tournament2.id);
            store.delete(tournament2.id);
          }
        });
      };
    } catch (error) {
      console.error("❌ Error clearing duplicates:", error);
    }
  };
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
        label: "Borrador",
        icon: Pen_line
      },
      upcoming: {
        class: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        label: "Próximo",
        icon: Calendar
      },
      in_progress: {
        class: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        label: "En Curso",
        icon: Play
      },
      completed: {
        class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        label: "Completado",
        icon: Circle_check_big
      },
      cancelled: {
        class: "bg-red-500/20 text-red-400 border-red-500/30",
        label: "Cancelado",
        icon: Circle_x
      }
    };
    return badges[status] || badges.draft;
  };
  const getFormatLabel = (format) => {
    const labels = {
      swiss: "Sistema Suizo",
      round_robin: "Round Robin",
      knockout: "Eliminatorio",
      single_elimination: "Eliminación Simple"
    };
    return labels[format] || format;
  };
  const getResultColor = (result) => {
    switch (result) {
      case "1-0":
        return "text-emerald-400";
      case "0-1":
        return "text-red-400";
      case "1/2-1/2":
        return "text-yellow-400";
      case "*":
        return "text-slate-400";
      default:
        return "text-slate-400";
    }
  };
  const getResultLabel = (result) => {
    switch (result) {
      case "1-0":
        return "1-0";
      case "0-1":
        return "0-1";
      case "1/2-1/2":
        return "½-½";
      case "*":
        return "En juego";
      default:
        return "Sin resultado";
    }
  };
  const canStartTournament = () => {
    return tournament?.status === "upcoming" && registeredPlayers.length >= 2 && /* @__PURE__ */ new Date() >= new Date(tournament.registration_deadline);
  };
  const isRegistrationOpen = () => {
    if (!tournament) return false;
    const now = /* @__PURE__ */ new Date();
    const deadline = new Date(tournament.registration_deadline);
    return now < deadline && tournament.status !== "completed" && tournament.status !== "cancelled" && registeredPlayers.length < tournament.max_players;
  };
  const getPlayerName = (playerId) => {
    if (!playerId) return "BYE";
    const player = registeredPlayers.find((p) => p.id === playerId);
    return player ? player.student_name : "Jugador desconocido";
  };
  let canFinishCurrentRound = false;
  const calculateStandings = async () => {
    if (!tournament) return [];
    try {
      const { tournamentDB } = await import("../../../../../chunks/tournaments.js");
      const allPairings = await tournamentDB.getAllTournamentPairings(tournament.id);
      const updatedPlayers = await tournamentDB.getTournamentPlayers(tournament.id);
      const playerStats = /* @__PURE__ */ new Map();
      updatedPlayers.forEach((player) => {
        playerStats.set(player.id, {
          id: player.id,
          name: player.student_name,
          rating: player.student_rating,
          points: 0,
          games: 0,
          wins: 0,
          draws: 0,
          losses: 0
        });
      });
      allPairings.forEach((pairing) => {
        if (pairing.result && pairing.result !== "*") {
          const whiteStats = playerStats.get(pairing.white_player_id);
          const blackStats = playerStats.get(pairing.black_player_id);
          if (whiteStats) {
            whiteStats.games++;
            whiteStats.points += pairing.white_points || 0;
            if (pairing.result === "1-0") whiteStats.wins++;
            else if (pairing.result === "1/2-1/2") whiteStats.draws++;
            else if (pairing.result === "0-1") whiteStats.losses++;
          }
          if (blackStats) {
            blackStats.games++;
            blackStats.points += pairing.black_points || 0;
            if (pairing.result === "0-1") blackStats.wins++;
            else if (pairing.result === "1/2-1/2") blackStats.draws++;
            else if (pairing.result === "1-0") blackStats.losses++;
          }
        }
      });
      const standings = Array.from(playerStats.values()).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.rating - a.rating;
      }).map((player, index) => ({ position: index + 1, ...player }));
      return standings;
    } catch (error) {
      console.error("❌ Error calculating standings:", error);
      return [];
    }
  };
  tournament = data.tournament;
  registeredPlayers = data.registeredPlayers || [];
  rounds = data.rounds || [];
  pairings = data.pairings || [];
  if (tournament?.status === "in_progress" && tournament?.current_round) {
    loadCurrentRoundPairings();
  }
  if (tournament && registeredPlayers.length > 0) {
    clearDuplicateTournaments().then(() => {
      syncMockDataToIndexedDB();
    });
  }
  data.standings || [];
  canFinishCurrentRound = tournament && currentRoundPairings.length > 0 && currentRoundPairings.every((pairing) => pairing.is_bye || pairing.result && pairing.result !== "*");
  if (tournament && tournament.status === "in_progress") {
    calculateStandings().then((standings) => {
    });
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html(tournament?.name || "Torneo")} - ChessNet</title>`;
  });
  if (!tournament) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="min-h-screen bg-slate-900 flex items-center justify-center"><div class="text-center">`);
    Triangle_alert($$payload, { class: "w-12 h-12 text-red-400 mx-auto mb-4" });
    $$payload.out.push(`<!----> <h2 class="text-xl font-semibold text-white mb-2">Torneo no encontrado</h2> <p class="text-slate-400 mb-4">No se pudo cargar la información del torneo</p> <button class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">Volver a Torneos</button></div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<div class="min-h-screen bg-slate-900"><div class="border-b border-slate-700/50 bg-slate-800/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between py-6"><div class="flex items-center space-x-4"><button class="p-2 text-slate-400 hover:text-white transition-colors" title="Volver a Torneos">`);
    Arrow_left($$payload, { class: "w-5 h-5" });
    $$payload.out.push(`<!----></button> <div class="p-2 bg-orange-500/20 rounded-lg">`);
    Trophy($$payload, { class: "w-8 h-8 text-orange-400" });
    $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold text-white">${escape_html(tournament.name)}</h1> <p class="text-slate-400">Gestión del torneo</p></div></div> <div class="flex items-center space-x-3">`);
    if (tournament.status) {
      $$payload.out.push("<!--[-->");
      const statusBadge = getStatusBadge(tournament.status);
      $$payload.out.push(`<span${attr_class(`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${stringify(statusBadge.class)}`)}><!---->`);
      statusBadge.icon?.($$payload, { class: "w-4 h-4 mr-1" });
      $$payload.out.push(`<!----> ${escape_html(statusBadge.label)}</span>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div></div></div></div> <div class="bg-slate-800/50 border-b border-slate-700/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="space-y-4"><h3 class="font-semibold text-white">Información Básica</h3> <div class="space-y-2"><div class="flex items-center space-x-2">`);
    Calendar($$payload, { class: "w-4 h-4 text-slate-400" });
    $$payload.out.push(`<!----> <span class="text-sm text-slate-300">${escape_html(formatDate(tournament.start_date))}</span></div> <div class="flex items-center space-x-2">`);
    Clock($$payload, { class: "w-4 h-4 text-slate-400" });
    $$payload.out.push(`<!----> <span class="text-sm text-slate-300">${escape_html(tournament.time_control)}</span></div> <div class="flex items-center space-x-2">`);
    Map_pin($$payload, { class: "w-4 h-4 text-slate-400" });
    $$payload.out.push(`<!----> <span class="text-sm text-slate-300">${escape_html(tournament.location)}</span></div> <div class="flex items-center space-x-2">`);
    Target($$payload, { class: "w-4 h-4 text-slate-400" });
    $$payload.out.push(`<!----> <span class="text-sm text-slate-300">${escape_html(getFormatLabel(tournament.format))}</span></div></div></div> <div class="space-y-4"><h3 class="font-semibold text-white">Métricas</h3> <div class="grid grid-cols-2 gap-4"><div class="text-center"><div class="text-lg font-bold text-white">${escape_html(registeredPlayers.length)}/${escape_html(tournament.max_players)}</div> <div class="text-xs text-slate-400">Jugadores</div></div> <div class="text-center"><div class="text-lg font-bold text-white">${escape_html(tournament.current_round)}/${escape_html(tournament.total_rounds)}</div> <div class="text-xs text-slate-400">Rondas</div></div> <div class="text-center"><div class="text-lg font-bold text-emerald-400">${escape_html(formatCurrency(tournament.entry_fee))}</div> <div class="text-xs text-slate-400">Inscripción</div></div> <div class="text-center"><div class="text-lg font-bold text-emerald-400">${escape_html(formatCurrency(tournament.prize_pool))}</div> <div class="text-xs text-slate-400">Premios</div></div></div></div> <div class="space-y-4"><h3 class="font-semibold text-white">Acciones</h3> <div class="space-y-2">`);
    if (isRegistrationOpen()) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<button class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">`);
      User_plus($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----> <span>Inscribir Jugador</span></button>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    if (canStartTournament()) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<button class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">`);
      Play($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----> <span>Iniciar Torneo</span></button>`);
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> <button class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm">`);
    Trash_2($$payload, { class: "w-4 h-4" });
    $$payload.out.push(`<!----> <span>Limpiar DB (Debug)</span></button> <button class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">`);
    Settings($$payload, { class: "w-4 h-4" });
    $$payload.out.push(`<!----> <span>Configurar</span></button></div></div></div></div></div> <div class="border-b border-slate-700/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><nav class="flex space-x-12"><button${attr_class(`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${stringify(
      "border-orange-500 text-orange-400"
    )}`)}>Resumen</button> <button${attr_class(`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${stringify("border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300")}`)}>Jugadores (${escape_html(registeredPlayers.length)})</button> <button${attr_class(`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${stringify("border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300")}`)}>Rondas</button> <button${attr_class(`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${stringify("border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300")}`)}>Clasificación</button> <button${attr_class(`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${stringify("border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300")}`)}>Configuración</button></nav></div></div> <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`);
    {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="space-y-8"><div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h3 class="text-lg font-semibold text-white mb-4">Progreso del Torneo</h3> <div class="space-y-4"><div><div class="flex justify-between text-sm mb-2"><span class="text-slate-300">Ronda ${escape_html(tournament.current_round)} de ${escape_html(tournament.total_rounds)}</span> <span class="text-slate-400">${escape_html(Math.round(tournament.current_round / tournament.total_rounds * 100))}% completado</span></div> <div class="w-full bg-slate-700/50 rounded-full h-3"><div class="bg-orange-500 h-3 rounded-full transition-all duration-300"${attr_style(`width: ${stringify(tournament.current_round / tournament.total_rounds * 100)}%`)}></div></div></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="p-4 bg-slate-700/30 rounded-lg text-center"><div class="text-2xl font-bold text-white mb-1">${escape_html(registeredPlayers.length)}</div> <div class="text-sm text-slate-400">Jugadores Inscritos</div></div> <div class="p-4 bg-slate-700/30 rounded-lg text-center"><div class="text-2xl font-bold text-white mb-1">${escape_html(rounds.filter((r) => r.status === "completed").length)}</div> <div class="text-sm text-slate-400">Rondas Completadas</div></div> <div class="p-4 bg-slate-700/30 rounded-lg text-center"><div class="text-2xl font-bold text-white mb-1">${escape_html(pairings.filter((p) => p.result && p.result !== "*").length)}</div> <div class="text-sm text-slate-400">Partidas Jugadas</div></div></div></div></div> `);
      if (tournament.status === "in_progress" && currentRoundPairings.length > 0) {
        $$payload.out.push("<!--[-->");
        const each_array = ensure_array_like(currentRoundPairings);
        $$payload.out.push(`<div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h3 class="text-lg font-semibold text-white mb-4 flex items-center">`);
        Target($$payload, { class: "w-5 h-5 mr-2 text-blue-400" });
        $$payload.out.push(`<!----> Ronda ${escape_html(tournament.current_round)} - Emparejamientos</h3> <div class="space-y-3"><!--[-->`);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let pairing = each_array[$$index];
          $$payload.out.push(`<div class="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"><div class="flex items-center space-x-4"><div class="text-sm font-medium text-slate-400">Tablero ${escape_html(pairing.board_number)}</div> <div class="flex items-center space-x-2"><span class="text-white">${escape_html(getPlayerName(pairing.white_player_id))}</span> <span class="text-slate-400">vs</span> <span class="text-white">${escape_html(getPlayerName(pairing.black_player_id))}</span></div></div> <div class="flex items-center space-x-3">`);
          if (pairing.is_bye) {
            $$payload.out.push("<!--[-->");
            $$payload.out.push(`<span class="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded">BYE</span>`);
          } else {
            $$payload.out.push("<!--[!-->");
            $$payload.out.push(`<div class="flex items-center space-x-2"><button${attr_class(`px-3 py-1 text-xs rounded transition-colors ${stringify(pairing.result === "1-0" ? "bg-emerald-600 text-white" : "bg-slate-600 text-slate-300 hover:bg-emerald-600 hover:text-white")}`)} title="Victoria de las blancas">1-0</button> <button${attr_class(`px-3 py-1 text-xs rounded transition-colors ${stringify(pairing.result === "1/2-1/2" ? "bg-yellow-600 text-white" : "bg-slate-600 text-slate-300 hover:bg-yellow-600 hover:text-white")}`)} title="Tablas">½-½</button> <button${attr_class(`px-3 py-1 text-xs rounded transition-colors ${stringify(pairing.result === "0-1" ? "bg-red-600 text-white" : "bg-slate-600 text-slate-300 hover:bg-red-600 hover:text-white")}`)} title="Victoria de las negras">0-1</button></div> <div class="text-sm">`);
            if (pairing.result && pairing.result !== "*") {
              $$payload.out.push("<!--[-->");
              $$payload.out.push(`<span class="px-2 py-1 bg-slate-600 text-slate-300 rounded">${escape_html(getResultLabel(pairing.result))}</span>`);
            } else {
              $$payload.out.push("<!--[!-->");
              $$payload.out.push(`<span class="px-2 py-1 bg-slate-500/50 text-slate-400 rounded">Pendiente</span>`);
            }
            $$payload.out.push(`<!--]--></div>`);
          }
          $$payload.out.push(`<!--]--></div></div>`);
        }
        $$payload.out.push(`<!--]--></div> `);
        if (tournament.status === "in_progress" && canFinishCurrentRound) {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<div class="mt-6 pt-4 border-t border-slate-700/50"><button class="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">`);
          Circle_check_big($$payload, { class: "w-5 h-5" });
          $$payload.out.push(`<!----> <span>${escape_html(tournament.current_round >= tournament.total_rounds ? "Finalizar Torneo" : `Finalizar Ronda ${tournament.current_round}`)}</span></button></div>`);
        } else {
          $$payload.out.push("<!--[!-->");
        }
        $$payload.out.push(`<!--]--></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--> `);
      if (tournament.description) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h3 class="text-lg font-semibold text-white mb-4">Descripción</h3> <p class="text-slate-300">${escape_html(tournament.description)}</p></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--> `);
      if (pairings.length > 0) {
        $$payload.out.push("<!--[-->");
        const each_array_1 = ensure_array_like(pairings.slice(-5));
        $$payload.out.push(`<div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><h3 class="text-lg font-semibold text-white mb-4">Últimas Partidas</h3> <div class="space-y-3"><!--[-->`);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let pairing = each_array_1[$$index_1];
          $$payload.out.push(`<div class="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"><div class="flex items-center space-x-4"><div class="text-sm font-medium text-white">Mesa ${escape_html(pairing.board_number)}</div> <div class="text-sm text-slate-300">${escape_html(pairing.white_player_name)} vs ${escape_html(pairing.black_player_name)}</div></div> <div${attr_class(`text-sm font-medium ${stringify(getResultColor(pairing.result))}`)}>${escape_html(getResultLabel(pairing.result))}</div></div>`);
        }
        $$payload.out.push(`<!--]--></div></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--></div>`);
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
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></main></div> `);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]-->`);
  }
  $$payload.out.push(`<!--]-->`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
