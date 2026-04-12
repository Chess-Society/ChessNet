import { h as head, c as escape_html, e as ensure_array_like, a as attr_class, b as stringify, j as derived, s as store_get, u as unsubscribe_stores } from "../../../../chunks/renderer.js";
import { a as appStore } from "../../../../chunks/appStore.js";
import { T as Trophy } from "../../../../chunks/trophy.js";
import { L as Lock } from "../../../../chunks/lock.js";
import { C as Circle_check_big } from "../../../../chunks/circle-check-big.js";
import { S as Star } from "../../../../chunks/star.js";
import { U as Users } from "../../../../chunks/users.js";
import { A as Award } from "../../../../chunks/award.js";
import { M as Medal } from "../../../../chunks/medal.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let students = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).students || []);
    let classes = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).classes || []);
    let tournaments = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).tournaments || []);
    const achievements = derived(() => [
      {
        id: "pioneer",
        title: "Maestro Pionero",
        desc: "Regístrate en la plataforma ChessNet.",
        condition: true,
        icon: Star,
        color: "text-yellow-400"
      },
      {
        id: "first_class",
        title: "Primer Grupo",
        desc: "Crea tu primera clase o grupo.",
        condition: classes().length > 0,
        icon: Users,
        color: "text-blue-400"
      },
      {
        id: "mentor",
        title: "Mentor de Talentos",
        desc: "Ten al menos 10 alumnos matriculados.",
        condition: students().length >= 10,
        icon: Award,
        color: "text-emerald-400"
      },
      {
        id: "tournament_master",
        title: "Organizador Jefe",
        desc: "Organiza y completa 3 torneos.",
        condition: tournaments().filter((t) => t.status === "Completed").length >= 3,
        icon: Trophy,
        color: "text-orange-400"
      },
      {
        id: "expert_mentor",
        title: "Mentor Experto",
        desc: "Ten al menos 50 alumnos matriculados.",
        condition: students().length >= 50,
        icon: Medal,
        color: "text-purple-400"
      }
    ]);
    let unlockedCount = derived(() => achievements().filter((a) => a.condition).length);
    head("1xae3qa", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Mis Logros - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"><div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 pt-6"><div class="space-y-4"><div class="flex items-center gap-3"><div class="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500">`);
    Trophy($$renderer2, { class: "w-6 h-6" });
    $$renderer2.push(`<!----></div> <div><h1 class="text-3xl font-bold text-white tracking-tight">Mis Logros</h1> <p class="text-slate-400 text-sm">Desbloquea medallas y reconoce tu progresión como docente.</p></div></div></div> <div class="bg-amber-500 p-[2px] rounded-2xl shadow-lg shadow-amber-900/20"><div class="bg-[#0f172a] rounded-[14px] px-6 py-3 flex items-center gap-4"><div><p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Nivel de Instructor</p> <p class="text-lg font-bold text-white">${escape_html(unlockedCount() >= 3 ? "Avanzado" : "Iniciado")}</p></div> <div class="w-px h-8 bg-slate-800"></div> <div class="text-right"><p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Desbloqueados</p> <p class="text-lg font-bold text-amber-400">${escape_html(unlockedCount())} / ${escape_html(achievements().length)}</p></div></div></div></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
    const each_array = ensure_array_like(achievements());
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let achievement = each_array[i];
      $$renderer2.push(`<div${attr_class(`bg-[#1e293b] border ${stringify(achievement.condition ? "border-amber-500/30" : "border-slate-800 opacity-60")} rounded-3xl p-8 relative overflow-hidden group transition-all`)}>`);
      if (!achievement.condition) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><div class="bg-slate-800 p-3 rounded-full border border-slate-700 shadow-xl">`);
        Lock($$renderer2, { class: "w-6 h-6 text-slate-500" });
        $$renderer2.push(`<!----></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex flex-col items-center text-center"><div${attr_class(`w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 ${stringify(achievement.condition ? "shadow-2xl shadow-amber-500/10 scale-110" : "")} transition-transform`)}>`);
      if (achievement.icon) {
        $$renderer2.push("<!--[-->");
        achievement.icon($$renderer2, {
          class: `w-10 h-10 ${stringify(achievement.condition ? achievement.color : "text-slate-600")}`
        });
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
      $$renderer2.push(`</div> <h3${attr_class(`text-xl font-bold ${stringify(achievement.condition ? "text-white" : "text-slate-500")} mb-2`)}>${escape_html(achievement.title)}</h3> <p class="text-sm text-slate-400 px-4 leading-relaxed">${escape_html(achievement.desc)}</p> `);
      if (achievement.condition) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="mt-6 flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">`);
        Circle_check_big($$renderer2, { class: "w-3.5 h-3.5" });
        $$renderer2.push(`<!----> Obtenido</div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="mt-6 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Bloqueado</div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="mt-16 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-3xl p-10 text-center"><h3 class="text-2xl font-bold text-white mb-4">¿Tienes sugerencias para más logros?</h3> <p class="text-slate-300 max-w-2xl mx-auto mb-8">Queremos que ChessNet reconozca todo tu esfuerzo. Si crees que falta algún hito importante en la carrera de un profesor de ajedrez, cuéntanoslo.</p> <a href="mailto:logros@chessnet.app" class="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all inline-block shadow-lg shadow-indigo-900/20">Enviar Sugerencia</a></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
