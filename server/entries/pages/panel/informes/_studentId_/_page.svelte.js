import { d as sanitize_props, f as spread_props, g as slot, h as head, c as escape_html, a as attr_class, e as ensure_array_like, al as attr_style, b as stringify, j as derived } from "../../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import "../../../../../chunks/state.svelte.js";
import { T as Triangle_alert } from "../../../../../chunks/triangle-alert.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { T as Trophy } from "../../../../../chunks/trophy.js";
import { S as School } from "../../../../../chunks/school.js";
import { C as Calendar } from "../../../../../chunks/calendar.js";
import { C as Clock } from "../../../../../chunks/clock.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
import { F as File_text } from "../../../../../chunks/file-text.js";
import { A as Activity } from "../../../../../chunks/activity.js";
import { Z as Zap } from "../../../../../chunks/zap.js";
import { D as Dollar_sign } from "../../../../../chunks/dollar-sign.js";
import { U as User } from "../../../../../chunks/user.js";
import { M as Mail } from "../../../../../chunks/mail.js";
import { P as Phone } from "../../../../../chunks/phone.js";
import { B as Book_open } from "../../../../../chunks/book-open.js";
function Briefcase($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      { "d": "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" }
    ],
    [
      "rect",
      { "width": "20", "height": "14", "x": "2", "y": "6", "rx": "2" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "briefcase" },
    $$sanitized_props,
    {
      /**
       * @component @name Briefcase
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMjBWNGEyIDIgMCAwIDAtMi0yaC00YTIgMiAwIDAgMC0yIDJ2MTYiIC8+CiAgPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE0IiB4PSIyIiB5PSI2IiByeD0iMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/briefcase
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Download($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M12 15V3" }],
    ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["path", { "d": "m7 10 5 5 5-5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "download" },
    $$sanitized_props,
    {
      /**
       * @component @name Download
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTVWMyIgLz4KICA8cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCIgLz4KICA8cGF0aCBkPSJtNyAxMCA1IDUgNS01IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/download
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Share_2($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["circle", { "cx": "18", "cy": "5", "r": "3" }],
    ["circle", { "cx": "6", "cy": "12", "r": "3" }],
    ["circle", { "cx": "18", "cy": "19", "r": "3" }],
    [
      "line",
      { "x1": "8.59", "x2": "15.42", "y1": "13.51", "y2": "17.49" }
    ],
    [
      "line",
      { "x1": "15.41", "x2": "8.59", "y1": "6.51", "y2": "10.49" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "share-2" },
    $$sanitized_props,
    {
      /**
       * @component @name Share2
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxOCIgY3k9IjUiIHI9IjMiIC8+CiAgPGNpcmNsZSBjeD0iNiIgY3k9IjEyIiByPSIzIiAvPgogIDxjaXJjbGUgY3g9IjE4IiBjeT0iMTkiIHI9IjMiIC8+CiAgPGxpbmUgeDE9IjguNTkiIHgyPSIxNS40MiIgeTE9IjEzLjUxIiB5Mj0iMTcuNDkiIC8+CiAgPGxpbmUgeDE9IjE1LjQxIiB4Mj0iOC41OSIgeTE9IjYuNTEiIHkyPSIxMC40OSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/share-2
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Timer($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["line", { "x1": "10", "x2": "14", "y1": "2", "y2": "2" }],
    ["line", { "x1": "12", "x2": "15", "y1": "14", "y2": "11" }],
    ["circle", { "cx": "12", "cy": "14", "r": "8" }]
  ];
  Icon($$renderer, spread_props([
    { name: "timer" },
    $$sanitized_props,
    {
      /**
       * @component @name Timer
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMTAiIHgyPSIxNCIgeTE9IjIiIHkyPSIyIiAvPgogIDxsaW5lIHgxPSIxMiIgeDI9IjE1IiB5MT0iMTQiIHkyPSIxMSIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE0IiByPSI4IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/timer
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let selectedTab = "overview";
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();
    };
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
    };
    const calculateAge = (birthDate) => {
      const today = /* @__PURE__ */ new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birth.getDate()) {
        age--;
      }
      return age;
    };
    const report = derived(() => data.report);
    const student = derived(() => report()?.student);
    const progress = derived(() => report()?.progress_summary);
    const tabs = [
      { id: "overview", label: "Resumen", icon: Activity },
      { id: "attendance", label: "Asistencia", icon: Calendar },
      { id: "skills", label: "Habilidades", icon: Zap },
      { id: "payments", label: "Pagos", icon: Dollar_sign },
      { id: "tournaments", label: "Torneos", icon: Trophy },
      { id: "timeline", label: "Cronología", icon: Timer }
    ];
    head("eg81i", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Expediente: ${escape_html(student()?.name || "Estudiante")} - ChessNet</title>`);
      });
    });
    if (!report()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="min-h-[60vh] flex items-center justify-center p-8"><div class="glass-panel p-12 text-center max-w-md space-y-6 border-t-4 border-red-500"><div class="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center text-red-400 mx-auto shadow-2xl">`);
      Triangle_alert($$renderer2, { class: "w-10 h-10" });
      $$renderer2.push(`<!----></div> <div><h2 class="text-2xl font-black text-white uppercase tracking-tighter">Expediente No Encontrado</h2> <p class="text-[10px] font-black text-surface-500 uppercase tracking-widest mt-2">No se pudo localizar la información analítica de este estudiante.</p></div> <button class="w-full bg-surface-950 border border-surface-900 py-4 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:border-primary-500/50 transition-all flex items-center justify-center gap-3">`);
      Arrow_left($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> VOLVER AL PANEL</button></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-10 animate-fade-in pb-20"><div class="flex flex-col xl:flex-row gap-8 items-start justify-between"><div class="flex flex-col md:flex-row items-center gap-8 text-center md:text-left"><div class="relative group"><div class="absolute inset-0 bg-primary-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div> <div class="w-32 h-32 bg-surface-950 border-4 border-surface-900 rounded-[2.5rem] flex items-center justify-center text-primary-400 text-5xl font-black shadow-2xl relative z-10 group-hover:border-primary-500/30 transition-all">${escape_html(student().name.charAt(0))}</div> <div class="absolute -bottom-2 -right-2 bg-primary-500 text-black p-2 rounded-xl shadow-lg z-20">`);
      Trophy($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></div></div> <div class="space-y-3"><div class="flex flex-wrap items-center justify-center md:justify-start gap-3"><h1 class="text-4xl font-black text-white tracking-tighter uppercase leading-none">${escape_html(student().name)}</h1> <span class="bg-primary-500/10 border border-primary-500/20 text-primary-400 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">ID: ${escape_html(student().id.slice(0, 8))}</span></div> <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 text-surface-500 text-[10px] font-bold uppercase tracking-widest"><div class="flex items-center gap-2">`);
      School($$renderer2, { class: "w-3 h-3 text-primary-400" });
      $$renderer2.push(`<!----> ${escape_html(report().college.name)}</div> <div class="w-1.5 h-1.5 rounded-full bg-surface-800"></div> <div class="flex items-center gap-2">`);
      Calendar($$renderer2, { class: "w-3 h-3 text-primary-400" });
      $$renderer2.push(`<!----> ${escape_html(calculateAge(student().date_of_birth))} AÑOS</div> <div class="w-1.5 h-1.5 rounded-full bg-surface-800"></div> <div class="flex items-center gap-2">`);
      Clock($$renderer2, { class: "w-3 h-3 text-primary-400" });
      $$renderer2.push(`<!----> ACTIVO DESDE ${escape_html(formatDate(progress().enrollment_date))}</div></div></div></div> <div class="flex items-center gap-4 w-full md:w-auto"><button class="flex-1 md:flex-none bg-surface-950/50 border border-surface-900 p-4 rounded-2xl text-white hover:border-primary-500/30 transition-all backdrop-blur-xl group">`);
      Share_2($$renderer2, { class: "w-5 h-5 group-hover:scale-110 transition-transform" });
      $$renderer2.push(`<!----></button> <button class="flex-1 md:flex-none bg-surface-950/50 border border-surface-900 p-4 rounded-2xl text-white hover:border-primary-500/30 transition-all backdrop-blur-xl group">`);
      Download($$renderer2, { class: "w-5 h-5 group-hover:scale-110 transition-transform" });
      $$renderer2.push(`<!----></button> <button class="flex-[3] md:flex-none bg-primary-500 text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg flex items-center justify-center gap-3">`);
      File_text($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> GENERAR INFORME PDF</button></div></div> <div class="grid grid-cols-2 lg:grid-cols-4 gap-4"><div class="glass-panel p-6 border-l-4 border-primary-500 flex items-center justify-between group"><div><p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-1">Ratio Asistencia</p> <p class="text-3xl font-black text-white tracking-tighter">${escape_html(progress().attendance_rate.toFixed(1))}%</p></div> <div class="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">`);
      Activity($$renderer2, { class: "w-6 h-6" });
      $$renderer2.push(`<!----></div></div> <div class="glass-panel p-6 border-l-4 border-blue-500 flex items-center justify-between group"><div><p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-1">Chess Rating (ELO)</p> <div class="flex items-baseline gap-2"><p class="text-3xl font-black text-white tracking-tighter">${escape_html(progress().current_rating)}</p> <span${attr_class(`text-[10px] font-black ${progress().rating_change >= 0 ? "text-emerald-400" : "text-red-400"}`)}>${escape_html(progress().rating_change >= 0 ? "▲" : "▼")} ${escape_html(Math.abs(progress().rating_change))}</span></div></div> <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">`);
      Trophy($$renderer2, { class: "w-6 h-6" });
      $$renderer2.push(`<!----></div></div> <div class="glass-panel p-6 border-l-4 border-purple-500 flex items-center justify-between group"><div><p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-1">Dominio Skills</p> <p class="text-3xl font-black text-white tracking-tighter">${escape_html(progress().skill_completion_rate.toFixed(1))}%</p></div> <div class="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">`);
      Zap($$renderer2, { class: "w-6 h-6" });
      $$renderer2.push(`<!----></div></div> <div class="glass-panel p-6 border-l-4 border-orange-500 flex items-center justify-between group"><div><p class="text-[9px] font-black text-surface-500 uppercase tracking-widest mb-1">Balance Financiero</p> <p${attr_class(`text-3xl font-black tracking-tighter ${progress().overdue_payments > 0 ? "text-red-400" : "text-emerald-400"}`)}>${escape_html(progress().overdue_payments > 0 ? `-${progress().overdue_payments}` : "OK")}</p></div> <div class="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">`);
      Dollar_sign($$renderer2, { class: "w-6 h-6" });
      $$renderer2.push(`<!----></div></div></div> <div class="flex flex-wrap gap-2 p-1.5 bg-surface-950/50 border border-surface-900 rounded-[2rem] backdrop-blur-xl"><!--[-->`);
      const each_array = ensure_array_like(tabs);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tab = each_array[$$index];
        $$renderer2.push(`<button${attr_class(`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedTab === tab.id ? "bg-primary-500 text-black shadow-xl scale-[1.02]" : "text-surface-500 hover:text-white hover:bg-surface-900"}`)}>`);
        if (tab.icon) {
          $$renderer2.push("<!--[-->");
          tab.icon($$renderer2, { class: "w-4 h-4" });
          $$renderer2.push("<!--]-->");
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push("<!--]-->");
        }
        $$renderer2.push(` <span class="hidden sm:inline">${escape_html(tab.label)}</span></button>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="space-y-8">`);
      {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-8"><div class="glass-panel overflow-hidden border-t-4 border-primary-500"><div class="p-8 border-b border-surface-900 bg-surface-950/50"><h3 class="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">`);
        User($$renderer2, { class: "w-4 h-4 text-primary-400" });
        $$renderer2.push(`<!----> Información de Contacto</h3></div> <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8"><div class="space-y-6"><div class="group"><p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-1">Correo Electrónico</p> <div class="flex items-center gap-3 text-white font-bold tracking-tight bg-surface-950/50 p-3 rounded-xl border border-surface-900 group-hover:border-primary-500/30 transition-all">`);
        Mail($$renderer2, { class: "w-4 h-4 text-primary-400" });
        $$renderer2.push(`<!----> ${escape_html(student().email)}</div></div> <div class="group"><p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-1">Teléfono Móvil</p> <div class="flex items-center gap-3 text-white font-bold tracking-tight bg-surface-950/50 p-3 rounded-xl border border-surface-900 group-hover:border-primary-500/30 transition-all">`);
        Phone($$renderer2, { class: "w-4 h-4 text-primary-400" });
        $$renderer2.push(`<!----> ${escape_html(student().phone)}</div></div></div> <div class="space-y-6"><div class="group"><p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-1">Fecha Nacimiento</p> <div class="flex items-center gap-3 text-white font-bold tracking-tight bg-surface-950/50 p-3 rounded-xl border border-surface-900 group-hover:border-primary-500/30 transition-all">`);
        Calendar($$renderer2, { class: "w-4 h-4 text-primary-400" });
        $$renderer2.push(`<!----> ${escape_html(formatDate(student().date_of_birth))}</div></div> <div class="group"><p class="text-[9px] font-black text-surface-600 uppercase tracking-widest mb-1">Última Conexión</p> <div class="flex items-center gap-3 text-white font-bold tracking-tight bg-surface-950/50 p-3 rounded-xl border border-surface-900 group-hover:border-primary-500/30 transition-all">`);
        Activity($$renderer2, { class: "w-4 h-4 text-primary-400" });
        $$renderer2.push(`<!----> ${escape_html(formatDate(progress().last_activity_date))}</div></div></div></div></div> `);
        if (student().instructor_notes) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="glass-panel p-8 border-t-4 border-orange-500"><h3 class="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">`);
          File_text($$renderer2, { class: "w-4 h-4 text-orange-400" });
          $$renderer2.push(`<!----> Observaciones Técnicas</h3> <div class="p-6 bg-surface-950/80 border border-surface-900 rounded-2xl italic text-surface-300 text-sm leading-relaxed relative overflow-hidden"><div class="absolute top-0 right-0 p-4 opacity-10">`);
          Book_open($$renderer2, { class: "w-12 h-12" });
          $$renderer2.push(`<!----></div> "${escape_html(student().instructor_notes)}"</div></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="glass-panel p-8 border-t-4 border-blue-500"><h3 class="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">`);
        Briefcase($$renderer2, { class: "w-4 h-4 text-blue-400" });
        $$renderer2.push(`<!----> Programas Activos</h3> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
        const each_array_1 = ensure_array_like(report().classes);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let cls = each_array_1[$$index_1];
          $$renderer2.push(`<div class="p-5 bg-surface-950/50 border border-surface-900 rounded-2xl group hover:border-blue-500/30 transition-all"><div class="flex items-center justify-between mb-3"><h4 class="text-sm font-black text-white uppercase tracking-tight">${escape_html(cls.name)}</h4> <span class="text-[10px] font-black text-emerald-400">${escape_html(formatCurrency(cls.price))}/MES</span></div> <div class="flex items-center gap-2 text-[10px] font-bold text-surface-500 uppercase">`);
          Clock($$renderer2, { class: "w-3.5 h-3.5" });
          $$renderer2.push(`<!----> ${escape_html(cls.schedule)}</div></div>`);
        }
        $$renderer2.push(`<!--]--></div></div></div> <div class="space-y-8"><div class="glass-panel p-8 border-t-4 border-emerald-500"><h3 class="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Trayectoria de Rating</h3> <div class="space-y-4"><!--[-->`);
        const each_array_2 = ensure_array_like(report().rating_history);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let entry = each_array_2[$$index_2];
          $$renderer2.push(`<div class="flex items-center justify-between p-4 bg-surface-950/50 border border-surface-900 rounded-2xl group hover:bg-surface-950 transition-colors"><div><p class="text-[10px] font-black text-white uppercase tracking-tight">${escape_html(entry.event)}</p> <p class="text-[8px] font-black text-surface-600 uppercase mt-0.5">${escape_html(formatDate(entry.date))}</p></div> <div class="text-right"><p class="text-sm font-black text-white">${escape_html(entry.rating)}</p> <p${attr_class(`text-[9px] font-black ${entry.change >= 0 ? "text-emerald-400" : "text-red-400"}`)}>${escape_html(entry.change >= 0 ? "+" : "")}${escape_html(entry.change)}</p></div></div>`);
        }
        $$renderer2.push(`<!--]--></div></div> <div class="glass-panel p-8 border-t-4 border-purple-500"><h3 class="text-xs font-black text-white uppercase tracking-[0.2em] mb-6">Estado Habilidades</h3> <div class="space-y-5"><div class="space-y-2"><div class="flex justify-between text-[10px] font-black tracking-widest text-emerald-400"><span>DOMINADAS</span> <span>${escape_html(progress().skills_mastered)} / ${escape_html(progress().total_skills_assigned)}</span></div> <div class="h-2 bg-surface-950 rounded-full border border-surface-900 overflow-hidden"><div class="h-full bg-emerald-500"${attr_style(`width: ${stringify(progress().total_skills_assigned > 0 ? progress().skills_mastered / progress().total_skills_assigned * 100 : 0)}%`)}></div></div></div> <div class="space-y-2"><div class="flex justify-between text-[10px] font-black tracking-widest text-blue-400"><span>EN DESARROLLO</span> <span>${escape_html(progress().skills_in_progress)}</span></div> <div class="h-2 bg-surface-950 rounded-full border border-surface-900 overflow-hidden"><div class="h-full bg-blue-500"${attr_style(`width: ${stringify(progress().total_skills_assigned > 0 ? progress().skills_in_progress / progress().total_skills_assigned * 100 : 0)}%`)}></div></div></div> <div class="space-y-2"><div class="flex justify-between text-[10px] font-black tracking-widest text-surface-600"><span>PENDIENTES</span> <span>${escape_html(progress().total_skills_assigned - progress().skills_mastered - progress().skills_in_progress)}</span></div> <div class="h-2 bg-surface-950 rounded-full border border-surface-900 overflow-hidden"><div class="h-full bg-surface-800"${attr_style(`width: ${stringify(progress().total_skills_assigned > 0 ? (progress().total_skills_assigned - progress().skills_mastered - progress().skills_in_progress) / progress().total_skills_assigned * 100 : 0)}%`)}></div></div></div></div></div></div></div>`);
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
