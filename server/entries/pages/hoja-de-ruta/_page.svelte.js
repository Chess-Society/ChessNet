import { d as sanitize_props, f as spread_props, g as slot, h as head } from "../../../chunks/renderer.js";
import { S as School } from "../../../chunks/school.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { Z as Zap } from "../../../chunks/zap.js";
import { L as Lock } from "../../../chunks/lock.js";
function Cloud($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      { "d": "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "cloud" },
    $$sanitized_props,
    {
      /**
       * @component @name Cloud
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTcuNSAxOUg5YTcgNyAwIDEgMSA2LjcxLTloMS43OWE0LjUgNC41IDAgMSAxIDAgOVoiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/cloud
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
function Cog($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M11 10.27 7 3.34" }],
    ["path", { "d": "m11 13.73-4 6.93" }],
    ["path", { "d": "M12 22v-2" }],
    ["path", { "d": "M12 2v2" }],
    ["path", { "d": "M14 12h8" }],
    ["path", { "d": "m17 20.66-1-1.73" }],
    ["path", { "d": "m17 3.34-1 1.73" }],
    ["path", { "d": "M2 12h2" }],
    ["path", { "d": "m20.66 17-1.73-1" }],
    ["path", { "d": "m20.66 7-1.73 1" }],
    ["path", { "d": "m3.34 17 1.73-1" }],
    ["path", { "d": "m3.34 7 1.73 1" }],
    ["circle", { "cx": "12", "cy": "12", "r": "2" }],
    ["circle", { "cx": "12", "cy": "12", "r": "8" }]
  ];
  Icon($$renderer, spread_props([
    { name: "cog" },
    $$sanitized_props,
    {
      /**
       * @component @name Cog
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgMTAuMjcgNyAzLjM0IiAvPgogIDxwYXRoIGQ9Im0xMSAxMy43My00IDYuOTMiIC8+CiAgPHBhdGggZD0iTTEyIDIydi0yIiAvPgogIDxwYXRoIGQ9Ik0xMiAydjIiIC8+CiAgPHBhdGggZD0iTTE0IDEyaDgiIC8+CiAgPHBhdGggZD0ibTE3IDIwLjY2LTEtMS43MyIgLz4KICA8cGF0aCBkPSJtMTcgMy4zNC0xIDEuNzMiIC8+CiAgPHBhdGggZD0iTTIgMTJoMiIgLz4KICA8cGF0aCBkPSJtMjAuNjYgMTctMS43My0xIiAvPgogIDxwYXRoIGQ9Im0yMC42NiA3LTEuNzMgMSIgLz4KICA8cGF0aCBkPSJtMy4zNCAxNyAxLjczLTEiIC8+CiAgPHBhdGggZD0ibTMuMzQgNyAxLjczIDEiIC8+CiAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMiIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/cog
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
function Map($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"
      }
    ],
    ["path", { "d": "M15 5.764v15" }],
    ["path", { "d": "M9 3.236v15" }]
  ];
  Icon($$renderer, spread_props([
    { name: "map" },
    $$sanitized_props,
    {
      /**
       * @component @name Map
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQuMTA2IDUuNTUzYTIgMiAwIDAgMCAxLjc4OCAwbDMuNjU5LTEuODNBMSAxIDAgMCAxIDIxIDQuNjE5djEyLjc2NGExIDEgMCAwIDEtLjU1My44OTRsLTQuNTUzIDIuMjc3YTIgMiAwIDAgMS0xLjc4OCAwbC00LjIxMi0yLjEwNmEyIDIgMCAwIDAtMS43ODggMGwtMy42NTkgMS44M0ExIDEgMCAwIDEgMyAxOS4zODFWNi42MThhMSAxIDAgMCAxIC41NTMtLjg5NGw0LjU1My0yLjI3N2EyIDIgMCAwIDEgMS43ODggMHoiIC8+CiAgPHBhdGggZD0iTTE1IDUuNzY0djE1IiAvPgogIDxwYXRoIGQ9Ik05IDMuMjM2djE1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/map
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
function Smartphone($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "rect",
      {
        "width": "14",
        "height": "20",
        "x": "5",
        "y": "2",
        "rx": "2",
        "ry": "2"
      }
    ],
    ["path", { "d": "M12 18h.01" }]
  ];
  Icon($$renderer, spread_props([
    { name: "smartphone" },
    $$sanitized_props,
    {
      /**
       * @component @name Smartphone
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTQiIGhlaWdodD0iMjAiIHg9IjUiIHk9IjIiIHJ4PSIyIiByeT0iMiIgLz4KICA8cGF0aCBkPSJNMTIgMThoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/smartphone
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
function _page($$renderer) {
  head("eyia5m", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Hoja de Ruta 2026+ | ChessNet</title>`);
    });
    $$renderer2.push(`<meta name="description" content="Descubre las próximas funcionalidades de ChessNet: autenticación, análisis avanzados, automatización, app móvil y más. Roadmap actualizado para profesores de ajedrez."/>`);
  });
  $$renderer.push(`<div class="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden"><div class="fixed inset-0 z-0 opacity-20 pointer-events-none"><div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div> <div class="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div></div> <div class="fixed top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] pointer-events-none animate-pulse"></div> <div class="fixed bottom-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none"></div> <nav class="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto"><a href="/" class="flex items-center gap-2 font-bold text-xl tracking-tight group"><div class="relative"><div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-200"></div> <div class="relative bg-slate-900 rounded-lg p-1">`);
  School($$renderer, { class: "w-8 h-8 text-emerald-500" });
  $$renderer.push(`<!----></div></div> <span class="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">ChessNet</span></a> <a href="/" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">Volver al Inicio</a></nav> <main class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><div class="text-center mb-16"><div class="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 text-blue-500 mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/10">`);
  Map($$renderer, { class: "w-8 h-8" });
  $$renderer.push(`<!----></div> <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">Hoja de Ruta</h1> <p class="text-lg text-slate-400 leading-relaxed mb-4 max-w-2xl mx-auto">El futuro de la gestión de academias de ajedrez</p> <div class="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full border border-yellow-500/20 text-sm font-medium">`);
  Zap($$renderer, { class: "w-4 h-4" });
  $$renderer.push(`<!----> Sujeto a cambios según feedback de la comunidad</div></div> <div class="space-y-8"><div class="relative"><div class="flex items-start gap-6"><div class="flex-shrink-0 w-24 text-right"><span class="text-sm font-bold text-emerald-400">Q1 2026</span></div> <div class="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all"><div class="flex items-center gap-3 mb-4"><div class="p-2 rounded-lg bg-emerald-500/10">`);
  Lock($$renderer, { class: "w-6 h-6 text-emerald-400" });
  $$renderer.push(`<!----></div> <h3 class="text-xl font-bold text-white">Autenticación y Seguridad</h3></div> <ul class="space-y-2 text-slate-200"><li class="flex items-start gap-2"><span class="text-emerald-400 mt-1">•</span> <span>Sistema de registro con email</span></li> <li class="flex items-start gap-2"><span class="text-emerald-400 mt-1">•</span> <span>Autenticación segura (login/logout)</span></li> <li class="flex items-start gap-2"><span class="text-emerald-400 mt-1">•</span> <span>Recuperación de contraseña</span></li> <li class="flex items-start gap-2"><span class="text-emerald-400 mt-1">•</span> <span>Gestión de perfil de profesor</span></li></ul></div></div></div> <div class="relative"><div class="flex items-start gap-6"><div class="flex-shrink-0 w-24 text-right"><span class="text-sm font-bold text-blue-400">Q2 2026</span></div> <div class="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all"><div class="flex items-center gap-3 mb-4"><div class="p-2 rounded-lg bg-blue-500/10">`);
  Cloud($$renderer, { class: "w-6 h-6 text-blue-400" });
  $$renderer.push(`<!----></div> <h3 class="text-xl font-bold text-white">Mejoras de Gestión</h3></div> <ul class="space-y-2 text-slate-200"><li class="flex items-start gap-2"><span class="text-blue-400 mt-1">•</span> <span>Importación masiva de datos (CSV/Excel)</span></li> <li class="flex items-start gap-2"><span class="text-blue-400 mt-1">•</span> <span>Plantillas de clases y horarios</span></li> <li class="flex items-start gap-2"><span class="text-blue-400 mt-1">•</span> <span>Sistema de copias de seguridad automáticas</span></li> <li class="flex items-start gap-2"><span class="text-blue-400 mt-1">•</span> <span>Historial de cambios y auditoría</span></li></ul></div></div></div> <div class="relative"><div class="flex items-start gap-6"><div class="flex-shrink-0 w-24 text-right"><span class="text-sm font-bold text-purple-400">Q3 2026</span></div> <div class="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all"><div class="flex items-center gap-3 mb-4"><div class="p-2 rounded-lg bg-purple-500/10">`);
  Cog($$renderer, { class: "w-6 h-6 text-purple-400" });
  $$renderer.push(`<!----></div> <h3 class="text-xl font-bold text-white">Análisis y Reportes</h3></div> <ul class="space-y-2 text-slate-200"><li class="flex items-start gap-2"><span class="text-purple-400 mt-1">•</span> <span>Dashboards personalizables</span></li> <li class="flex items-start gap-2"><span class="text-purple-400 mt-1">•</span> <span>Exportación avanzada (PDF, Excel)</span></li> <li class="flex items-start gap-2"><span class="text-purple-400 mt-1">•</span> <span>Gráficos de progreso por alumno</span></li> <li class="flex items-start gap-2"><span class="text-purple-400 mt-1">•</span> <span>Estadísticas comparativas entre centros</span></li></ul></div></div></div> <div class="relative"><div class="flex items-start gap-6"><div class="flex-shrink-0 w-24 text-right"><span class="text-sm font-bold text-orange-400">Q4 2026</span></div> <div class="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-orange-500/30 transition-all"><div class="flex items-center gap-3 mb-4"><div class="p-2 rounded-lg bg-orange-500/10">`);
  Cog($$renderer, { class: "w-6 h-6 text-orange-400" });
  $$renderer.push(`<!----></div> <h3 class="text-xl font-bold text-white">Automatización</h3></div> <ul class="space-y-2 text-slate-200"><li class="flex items-start gap-2"><span class="text-orange-400 mt-1">•</span> <span>Recordatorios automáticos de pagos</span></li> <li class="flex items-start gap-2"><span class="text-orange-400 mt-1">•</span> <span>Generación automática de recibos</span></li> <li class="flex items-start gap-2"><span class="text-orange-400 mt-1">•</span> <span>Integración con herramientas de contabilidad</span></li> <li class="flex items-start gap-2"><span class="text-orange-400 mt-1">•</span> <span>API para integraciones externas</span></li></ul></div></div></div> <div class="relative"><div class="flex items-start gap-6"><div class="flex-shrink-0 w-24 text-right"><span class="text-sm font-bold text-cyan-400">2027+</span></div> <div class="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all"><div class="flex items-center gap-3 mb-4"><div class="p-2 rounded-lg bg-cyan-500/10">`);
  Smartphone($$renderer, { class: "w-6 h-6 text-cyan-400" });
  $$renderer.push(`<!----></div> <h3 class="text-xl font-bold text-white">Expansión Profesional</h3></div> <ul class="space-y-2 text-slate-200"><li class="flex items-start gap-2"><span class="text-cyan-400 mt-1">•</span> <span>App móvil para gestión sobre la marcha</span></li> <li class="flex items-start gap-2"><span class="text-cyan-400 mt-1">•</span> <span>Modo offline con sincronización</span></li> <li class="flex items-start gap-2"><span class="text-cyan-400 mt-1">•</span> <span>Colaboración multi-profesor (mismo centro)</span></li> <li class="flex items-start gap-2"><span class="text-cyan-400 mt-1">•</span> <span>Personalización avanzada (marca blanca para clubes)</span></li></ul></div></div></div></div> <div class="mt-16 text-center"><div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 max-w-3xl mx-auto"><p class="text-slate-400 mb-4">Esta hoja de ruta es orientativa y puede cambiar según las necesidades de los profesores y recursos disponibles.</p> <p class="text-slate-200">¿Tienes sugerencias? <a href="https://discord.gg/G7SrFtJHnr" class="text-emerald-400 hover:text-emerald-300 font-medium">Únete a nuestra comunidad en Discord</a>.</p></div></div></main></div>`);
}
export {
  _page as default
};
