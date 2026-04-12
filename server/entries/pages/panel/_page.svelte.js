import { d as sanitize_props, f as spread_props, g as slot, h as head, c as escape_html, a as attr_class, e as ensure_array_like, i as attr, b as stringify, s as store_get, al as attr_style, u as unsubscribe_stores, j as derived } from "../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
import { a as appStore } from "../../../chunks/appStore.js";
import { w as writable } from "../../../chunks/index.js";
import { C as Clock } from "../../../chunks/clock.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { T as Trophy } from "../../../chunks/trophy.js";
import { U as Users } from "../../../chunks/users.js";
import { P as Plus } from "../../../chunks/plus.js";
import { T as Trending_up } from "../../../chunks/trending-up.js";
import { D as Dollar_sign } from "../../../chunks/dollar-sign.js";
import { A as Activity } from "../../../chunks/activity.js";
import { A as Award } from "../../../chunks/award.js";
import { S as School } from "../../../chunks/school.js";
import { G as Graduation_cap } from "../../../chunks/graduation-cap.js";
import { T as Target } from "../../../chunks/target.js";
import { C as Circle_check_big } from "../../../chunks/circle-check-big.js";
import { C as Chart_column } from "../../../chunks/chart-column.js";
function Book_heart($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
      }
    ],
    [
      "path",
      {
        "d": "M8.62 9.8A2.25 2.25 0 1 1 12 6.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "book-heart" },
    $$sanitized_props,
    {
      /**
       * @component @name BookHeart
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAxOS41di0xNUEyLjUgMi41IDAgMCAxIDYuNSAySDE5YTEgMSAwIDAgMSAxIDF2MThhMSAxIDAgMCAxLTEgMUg2LjVhMSAxIDAgMCAxIDAtNUgyMCIgLz4KICA8cGF0aCBkPSJNOC42MiA5LjhBMi4yNSAyLjI1IDAgMSAxIDEyIDYuODM2YTIuMjUgMi4yNSAwIDEgMSAzLjM4IDIuOTY2bC0yLjYyNiAyLjg1NmEuOTk4Ljk5OCAwIDAgMS0xLjUwNyAweiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/book-heart
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
function Calendar_days($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M8 2v4" }],
    ["path", { "d": "M16 2v4" }],
    [
      "rect",
      { "width": "18", "height": "18", "x": "3", "y": "4", "rx": "2" }
    ],
    ["path", { "d": "M3 10h18" }],
    ["path", { "d": "M8 14h.01" }],
    ["path", { "d": "M12 14h.01" }],
    ["path", { "d": "M16 14h.01" }],
    ["path", { "d": "M8 18h.01" }],
    ["path", { "d": "M12 18h.01" }],
    ["path", { "d": "M16 18h.01" }]
  ];
  Icon($$renderer, spread_props([
    { name: "calendar-days" },
    $$sanitized_props,
    {
      /**
       * @component @name CalendarDays
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNOCAydjQiIC8+CiAgPHBhdGggZD0iTTE2IDJ2NCIgLz4KICA8cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjQiIHJ4PSIyIiAvPgogIDxwYXRoIGQ9Ik0zIDEwaDE4IiAvPgogIDxwYXRoIGQ9Ik04IDE0aC4wMSIgLz4KICA8cGF0aCBkPSJNMTIgMTRoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xNiAxNGguMDEiIC8+CiAgPHBhdGggZD0iTTggMThoLjAxIiAvPgogIDxwYXRoIGQ9Ik0xMiAxOGguMDEiIC8+CiAgPHBhdGggZD0iTTE2IDE4aC4wMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/calendar-days
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
function Grip_vertical($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["circle", { "cx": "9", "cy": "12", "r": "1" }],
    ["circle", { "cx": "9", "cy": "5", "r": "1" }],
    ["circle", { "cx": "9", "cy": "19", "r": "1" }],
    ["circle", { "cx": "15", "cy": "12", "r": "1" }],
    ["circle", { "cx": "15", "cy": "5", "r": "1" }],
    ["circle", { "cx": "15", "cy": "19", "r": "1" }]
  ];
  Icon($$renderer, spread_props([
    { name: "grip-vertical" },
    $$sanitized_props,
    {
      /**
       * @component @name GripVertical
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iMTIiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjUiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjE5IiByPSIxIiAvPgogIDxjaXJjbGUgY3g9IjE1IiBjeT0iMTIiIHI9IjEiIC8+CiAgPGNpcmNsZSBjeD0iMTUiIGN5PSI1IiByPSIxIiAvPgogIDxjaXJjbGUgY3g9IjE1IiBjeT0iMTkiIHI9IjEiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/grip-vertical
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
function Settings_2($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M14 17H5" }],
    ["path", { "d": "M19 7h-9" }],
    ["circle", { "cx": "17", "cy": "17", "r": "3" }],
    ["circle", { "cx": "7", "cy": "7", "r": "3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "settings-2" },
    $$sanitized_props,
    {
      /**
       * @component @name Settings2
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQgMTdINSIgLz4KICA8cGF0aCBkPSJNMTkgN2gtOSIgLz4KICA8Y2lyY2xlIGN4PSIxNyIgY3k9IjE3IiByPSIzIiAvPgogIDxjaXJjbGUgY3g9IjciIGN5PSI3IiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/settings-2
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
function createToastStore() {
  const { subscribe, update } = writable([]);
  function add(message, type = "success", duration = 3e3) {
    const id = crypto.randomUUID();
    update((all) => [{ id, message, type, duration }, ...all]);
    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
  }
  function remove(id) {
    update((all) => all.filter((t) => t.id !== id));
  }
  return {
    subscribe,
    success: (m) => add(m, "success"),
    error: (m) => add(m, "error"),
    info: (m) => add(m, "info"),
    warning: (m) => add(m, "warning"),
    remove
  };
}
createToastStore();
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const allActions = [
      {
        id: "centers",
        title: "Centros Educativos",
        desc: "Gestionar centros y ubicaciones",
        icon: School,
        color: "text-blue-500",
        link: "/panel/centros"
      },
      {
        id: "classes",
        title: "Clases",
        desc: "Organizar grupos y horarios",
        icon: Graduation_cap,
        color: "text-purple-500",
        link: "/panel/clases"
      },
      {
        id: "students",
        title: "Estudiantes",
        desc: "Gestionar alumnado e inscripciones",
        icon: Users,
        color: "text-emerald-500",
        link: "/panel/alumnos"
      },
      {
        id: "skills",
        title: "Habilidades",
        desc: "Definir temarios y competencias",
        icon: Target,
        color: "text-yellow-500",
        link: "/panel/habilidades"
      },
      {
        id: "tournaments",
        title: "Gestionar Torneos",
        desc: "Organizar competiciones locales",
        icon: Trophy,
        color: "text-orange-500",
        link: "/panel/torneos",
        premium: true
      },
      {
        id: "attendance",
        title: "Control de Asistencia",
        desc: "Pasar lista y estadísticas",
        icon: Circle_check_big,
        color: "text-pink-500",
        link: "/panel/asistencia"
      },
      {
        id: "reports",
        title: "Informes",
        desc: "Reportes y análisis avanzados",
        icon: Chart_column,
        color: "text-cyan-500",
        link: "/panel/informes",
        premium: true
      },
      {
        id: "payments",
        title: "Sistema de Pagos",
        desc: "Gestionar cobros y facturación",
        icon: Dollar_sign,
        color: "text-teal-500",
        link: "/panel/pagos",
        badge: "BETA",
        premium: true
      },
      {
        id: "planner",
        title: "Planificador",
        desc: "Diseñar sesiones y contenido",
        icon: Calendar_days,
        color: "text-indigo-500",
        link: "/panel/agenda",
        badge: "NEW",
        premium: true
      },
      {
        id: "leads",
        title: "CRM / Interesados",
        desc: "Gestionar posibles alumnos",
        icon: Book_heart,
        color: "text-pink-500",
        link: "/panel/contactos",
        badge: "NEW",
        premium: true
      },
      {
        id: "achievements",
        title: "Logros",
        desc: "Ver progreso y medallas",
        icon: Trophy,
        color: "text-amber-500",
        link: "/panel/logros"
      }
    ];
    let editMode = false;
    let draggedId = null;
    let displayedActions = derived(() => () => {
      const layout = store_get($$store_subs ??= {}, "$appStore", appStore).dashboardLayout || [];
      if (layout.length === 0) return allActions;
      const actionMap = new Map(allActions.map((a) => [a.id, a]));
      const result = layout.map((id) => actionMap.get(id)).filter(Boolean);
      allActions.forEach((a) => {
        if (!layout.includes(a.id)) result.push(a);
      });
      return result;
    });
    let stats = derived(() => ({
      totalStudents: store_get($$store_subs ??= {}, "$appStore", appStore).students.length,
      monthlyRevenue: store_get($$store_subs ??= {}, "$appStore", appStore).payments.filter((p) => {
        const date = new Date(p.date);
        const now = /* @__PURE__ */ new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).reduce((acc, p) => acc + p.amount, 0),
      occupancyRate: (() => {
        if (store_get($$store_subs ??= {}, "$appStore", appStore).attendance.length === 0) return 0;
        const rates = store_get($$store_subs ??= {}, "$appStore", appStore).attendance.map((a) => {
          const total = a.records.length;
          const present = a.records.filter((r) => r.status === "present").length;
          return total > 0 ? present / total * 100 : 0;
        });
        return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length);
      })()
    }));
    let nextTournament = derived(() => store_get($$store_subs ??= {}, "$appStore", appStore).tournaments.filter((t) => t.status === "Upcoming").sort((a, b) => a.date.localeCompare(b.date))[0]);
    let recentActivity = derived(() => () => {
      const activities = [];
      store_get($$store_subs ??= {}, "$appStore", appStore).students.slice(-3).reverse().forEach((s) => {
        activities.push({
          message: `Nuevo estudiante: ${s.name}`,
          time: "reciente",
          icon: Users,
          color: "text-emerald-400",
          timestamp: new Date(s.joinedAt || Date.now()).getTime()
        });
      });
      store_get($$store_subs ??= {}, "$appStore", appStore).payments.slice(-3).reverse().forEach((p) => {
        const student = store_get($$store_subs ??= {}, "$appStore", appStore).students.find((s) => s.id === p.studentId);
        activities.push({
          message: `Pago: ${p.amount}€ - ${student?.name || "Desconocido"}`,
          time: "reciente",
          icon: Dollar_sign,
          color: "text-teal-400",
          timestamp: new Date(p.date).getTime()
        });
      });
      return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
    });
    const todayFormat = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(/* @__PURE__ */ new Date());
    const chartData = derived(() => ({
      revenue: Array.from({ length: 6 }, (_, i) => {
        const d = /* @__PURE__ */ new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const month = d.getMonth();
        const year = d.getFullYear();
        return store_get($$store_subs ??= {}, "$appStore", appStore).payments.filter((p) => {
          const pd = new Date(p.date);
          return pd.getMonth() === month && pd.getFullYear() === year;
        }).reduce((acc, p) => acc + p.amount, 0);
      }),
      labels: Array.from({ length: 6 }, (_, i) => {
        const d = /* @__PURE__ */ new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return d.toLocaleDateString("es-ES", { month: "short" }).charAt(0).toUpperCase() + d.toLocaleDateString("es-ES", { month: "short" }).slice(1);
      })
    }));
    head("1vlecz5", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>ChessNet - Dashboard</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 svelte-1vlecz5"><div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 pt-6 svelte-1vlecz5"><div class="svelte-1vlecz5"><h1 class="text-3xl font-bold text-white flex items-center gap-2">Hola, Profe <span class="animate-pulse">👋</span></h1> <p class="text-slate-400 mt-1 text-lg">Aquí tienes el resumen de tu academia hoy.</p></div> <div class="mt-4 md:mt-0 text-left md:text-right bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 svelte-1vlecz5"><p class="text-xs text-slate-400 uppercase font-bold tracking-wider">Hoy es</p> <p class="text-xl font-bold text-white capitalize flex items-center gap-2">`);
    Clock($$renderer2, { class: "w-5 h-5 text-indigo-400" });
    $$renderer2.push(`<!----> ${escape_html(todayFormat)}</p></div></div> <div class="mb-10 svelte-1vlecz5"><div class="flex justify-between items-center mb-4 svelte-1vlecz5"><h2 class="text-lg font-bold text-white flex items-center gap-2">`);
    Grip_vertical($$renderer2, { class: "w-5 h-5 text-indigo-500" });
    $$renderer2.push(`<!----> Accesos Directos</h2> <button${attr_class(`text-xs flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors ${stringify("text-slate-400")}`)}>`);
    Settings_2($$renderer2, { class: "w-3.5 h-3.5" });
    $$renderer2.push(`<!----> ${escape_html("Personalizar")}</button></div> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 svelte-1vlecz5"><!--[-->`);
    const each_array = ensure_array_like(displayedActions()());
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let action = each_array[i];
      $$renderer2.push(`<div${attr("draggable", editMode)}${attr_class(`relative transition-all duration-200 ${stringify(draggedId === action.id ? "scale-105 z-10 opacity-50" : "")}`, "svelte-1vlecz5")}><button${attr_class(`group flex flex-col items-center justify-center p-4 bg-[#1e293b] hover:bg-slate-800 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300 w-full aspect-square md:aspect-auto md:h-32 shadow-lg hover:shadow-xl hover:-translate-y-1 relative ${stringify("cursor-pointer")} ${stringify(action.premium && store_get($$store_subs ??= {}, "$appStore", appStore).settings.plan === "free" ? "opacity-75 grayscale-[0.5]" : "")}`)}>`);
      if (action.premium && store_get($$store_subs ??= {}, "$appStore", appStore).settings.plan === "free") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="absolute -top-1 -right-1 bg-slate-900 border border-slate-700 p-1.5 rounded-lg shadow-xl z-20 svelte-1vlecz5">`);
        Trophy($$renderer2, { class: "w-3 h-3 text-slate-400" });
        $$renderer2.push(`<!----></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (action.badge) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="absolute top-2 left-2 bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">${escape_html(action.badge)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="p-3 bg-slate-900/50 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300 svelte-1vlecz5">`);
      if (action.icon) {
        $$renderer2.push("<!--[-->");
        action.icon($$renderer2, { class: `w-6 h-6 ${stringify(action.color)}` });
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
      $$renderer2.push(`</div> <span class="text-sm font-semibold text-slate-300 group-hover:text-white text-center leading-tight">${escape_html(action.title)}</span> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></button></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 svelte-1vlecz5"><div class="lg:col-span-2 space-y-8 svelte-1vlecz5">`);
    if (stats().totalStudents === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-8 text-center svelte-1vlecz5"><div class="inline-block p-4 bg-indigo-600/20 rounded-full mb-4 svelte-1vlecz5">`);
      Users($$renderer2, { class: "w-8 h-8 text-indigo-400" });
      $$renderer2.push(`<!----></div> <h3 class="text-xl font-bold text-white mb-2">¡Empecemos tu academia!</h3> <p class="text-slate-400 mb-6 max-w-md mx-auto">Parece que aún no tienes alumnos registrados. El primer paso es añadir a tus estudiantes para gestionar sus clases.</p> <button class="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/20 flex items-center gap-2 mx-auto">`);
      Plus($$renderer2, { class: "w-5 h-5" });
      $$renderer2.push(`<!----> Añadir Primer Alumno</button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 svelte-1vlecz5"><div class="bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50 svelte-1vlecz5"><p class="text-slate-500 text-xs font-bold uppercase mb-1">Alumnos</p> <p class="text-2xl font-bold text-white">${escape_html(stats().totalStudents)}</p> <p class="text-xs text-emerald-400 mt-1 flex items-center gap-1">`);
    Trending_up($$renderer2, { class: "w-3 h-3" });
    $$renderer2.push(`<!----> Activos</p></div> <div class="bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50 svelte-1vlecz5"><p class="text-slate-500 text-xs font-bold uppercase mb-1">Ingresos (Mes)</p> <p class="text-2xl font-bold text-white">${escape_html(stats().monthlyRevenue)}€</p> <p class="text-xs text-emerald-400 mt-1 flex items-center gap-1">`);
    Trending_up($$renderer2, { class: "w-3 h-3" });
    $$renderer2.push(`<!----> +15.0%</p></div> <div class="bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50 svelte-1vlecz5"><p class="text-slate-500 text-xs font-bold uppercase mb-1">Asistencia</p> <p class="text-2xl font-bold text-white">${escape_html(stats().occupancyRate)}%</p> <p class="text-xs text-blue-400 mt-1">Promedio global</p></div> <div class="bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50 flex flex-col justify-center svelte-1vlecz5"><p class="text-slate-500 text-xs font-bold uppercase mb-1">Próx. Torneo</p> `);
    if (nextTournament()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="truncate svelte-1vlecz5"><p class="text-lg font-bold text-white truncate">${escape_html(nextTournament().name)}</p> <p class="text-xs text-orange-400 mt-1">En ${escape_html(Math.ceil((new Date(nextTournament().date).getTime() - Date.now()) / (1e3 * 60 * 60 * 24)))} días</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<p class="text-lg font-bold text-slate-500">—</p>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 svelte-1vlecz5"><div class="bg-[#1e293b] border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300 group svelte-1vlecz5"><div class="flex justify-between items-start mb-6 svelte-1vlecz5"><div class="svelte-1vlecz5"><h3 class="text-slate-400 text-sm font-medium">Historial de Ingresos</h3> <div class="flex items-baseline gap-2 mt-1 svelte-1vlecz5"><span class="text-2xl font-bold text-white">${escape_html(stats().monthlyRevenue)}€</span></div></div> <div class="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors svelte-1vlecz5">`);
    Dollar_sign($$renderer2, { class: "w-5 h-5 text-emerald-500" });
    $$renderer2.push(`<!----></div></div> <div class="relative h-[150px] w-full mt-4 svelte-1vlecz5"><svg class="w-full h-full" viewBox="0 0 300 150"><defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#10b981" stop-opacity="0.2"></stop><stop offset="100%" stop-color="#10b981" stop-opacity="0"></stop></linearGradient></defs><!--[-->`);
    const each_array_1 = ensure_array_like([0, 1, 2, 3]);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let i = each_array_1[$$index_1];
      $$renderer2.push(`<line x1="20"${attr("y1", 130 - i * 35)} x2="280"${attr("y2", 130 - i * 35)} class="stroke-slate-700/30" stroke-dasharray="4 4"></line>`);
    }
    $$renderer2.push(`<!--]-->`);
    if (chartData().revenue.some((v) => v > 0)) {
      $$renderer2.push("<!--[0-->");
      const max = Math.max(...chartData().revenue, 100) * 1.2;
      const points = chartData().revenue.map((v, i) => `${20 + i * 52},${130 - v / max * 110}`).join(" ");
      $$renderer2.push(`<path${attr("d", `M 20,130 ${stringify(points)} 280,130`)} fill="url(#revGrad)"></path><path${attr("d", `M 20,130 ${stringify(points)}`)} fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"></path><!--[-->`);
      const each_array_2 = ensure_array_like(chartData().revenue);
      for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
        let v = each_array_2[i];
        $$renderer2.push(`<circle${attr("cx", 20 + i * 52)}${attr("cy", 130 - v / max * 110)} r="3" class="fill-slate-900 stroke-emerald-500 stroke-2"></circle>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></svg> <div class="flex justify-between px-2 mt-2 text-[10px] text-slate-500 font-medium svelte-1vlecz5"><!--[-->`);
    const each_array_3 = ensure_array_like(chartData().labels);
    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
      let label = each_array_3[$$index_3];
      $$renderer2.push(`<span>${escape_html(label)}</span>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="bg-[#1e293b] border border-slate-800 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 group svelte-1vlecz5"><div class="flex justify-between items-start mb-6 svelte-1vlecz5"><div class="svelte-1vlecz5"><h3 class="text-slate-400 text-sm font-medium">Fidelización Alumnos</h3> <div class="flex items-baseline gap-2 mt-1 svelte-1vlecz5"><span class="text-2xl font-bold text-white">${escape_html(stats().totalStudents)}</span> <span class="text-blue-400 text-xs font-medium">total acumulado</span></div></div> <div class="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors svelte-1vlecz5">`);
    Users($$renderer2, { class: "w-5 h-5 text-blue-500" });
    $$renderer2.push(`<!----></div></div> <div class="relative h-[150px] w-full mt-4 svelte-1vlecz5"><div class="flex items-end justify-between h-[120px] px-2 gap-4 svelte-1vlecz5"><!--[-->`);
    const each_array_4 = ensure_array_like([40, 60, 50, 80, 70, 95]);
    for (let i = 0, $$length = each_array_4.length; i < $$length; i++) {
      let height = each_array_4[i];
      $$renderer2.push(`<div class="flex-1 flex flex-col items-center svelte-1vlecz5"><div class="w-full bg-blue-500/10 group-hover:bg-blue-500/20 rounded-t-lg transition-all relative overflow-hidden svelte-1vlecz5"${attr_style(`height: ${stringify(height)}%`)}><div class="absolute bottom-0 left-0 right-0 bg-blue-500/40 svelte-1vlecz5" style="height: 40%"></div></div> <span class="text-[10px] text-slate-600 mt-2">${escape_html(chartData().labels[i])}</span></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></div></div> <div class="space-y-6 svelte-1vlecz5"><h3 class="text-lg font-bold text-white flex items-center gap-2">`);
    Activity($$renderer2, { class: "w-5 h-5 text-blue-500" });
    $$renderer2.push(`<!----> Actividad Reciente</h3> <div class="bg-[#1e293b] border border-slate-700 rounded-2xl p-2 max-h-[500px] overflow-y-auto custom-scrollbar svelte-1vlecz5">`);
    if (recentActivity()().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-8 text-center text-slate-500 text-sm svelte-1vlecz5">No hay actividad reciente.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="divide-y divide-slate-800 svelte-1vlecz5"><!--[-->`);
      const each_array_5 = ensure_array_like(recentActivity()());
      for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
        let activity = each_array_5[$$index_5];
        $$renderer2.push(`<div class="p-4 flex gap-4 hover:bg-slate-800/30 transition-colors rounded-xl svelte-1vlecz5"><div class="mt-1 svelte-1vlecz5"><div class="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 border-slate-700 svelte-1vlecz5">`);
        if (activity.icon) {
          $$renderer2.push("<!--[-->");
          activity.icon($$renderer2, { class: `w-4 h-4 ${stringify(activity.color)}` });
          $$renderer2.push("<!--]-->");
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push("<!--]-->");
        }
        $$renderer2.push(`</div></div> <div class="svelte-1vlecz5"><p class="text-sm text-slate-300 font-medium leading-snug">${escape_html(activity.message)}</p> <p class="text-xs text-slate-500 mt-1">${escape_html(activity.time)}</p></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-6 border border-indigo-500/30 text-center relative overflow-hidden group svelte-1vlecz5"><div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity svelte-1vlecz5">`);
    Award($$renderer2, { class: "w-24 h-24 text-white" });
    $$renderer2.push(`<!----></div> `);
    Award($$renderer2, {
      class: "w-10 h-10 text-yellow-400 mx-auto mb-3 relative z-10"
    });
    $$renderer2.push(`<!----> <h4 class="text-white font-bold mb-1 relative z-10">¿Nuevo Logro?</h4> <p class="text-sm text-indigo-200 mb-4 relative z-10">Revisa si has subido de nivel como entrenador.</p> <button class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all w-full relative z-10">Ver Mis Logros</button></div> <div class="bg-slate-800/50 border border-slate-700 p-4 rounded-xl svelte-1vlecz5"><p class="text-xs text-slate-400 mb-2">¿Necesitas ayuda con ChessNet?</p> <a href="mailto:soporte@chessnet.app" class="text-indigo-400 text-sm font-bold hover:text-indigo-300">Contactar Soporte →</a></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
