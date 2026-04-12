import { d as sanitize_props, f as spread_props, g as slot, h as head, c as escape_html, e as ensure_array_like, al as attr_style, a as attr_class, i as attr, j as derived } from "../../../../chunks/renderer.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/subscriptions.js";
import { S as Sparkles } from "../../../../chunks/sparkles.js";
import { A as Activity } from "../../../../chunks/activity.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { U as Users } from "../../../../chunks/users.js";
import { S as School } from "../../../../chunks/school.js";
import { T as Trophy } from "../../../../chunks/trophy.js";
import { T as Target } from "../../../../chunks/target.js";
import { C as Check } from "../../../../chunks/check.js";
import { Z as Zap } from "../../../../chunks/zap.js";
import { S as Star } from "../../../../chunks/star.js";
import { S as Shield } from "../../../../chunks/shield.js";
function Crown($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"
      }
    ],
    ["path", { "d": "M5 21h14" }]
  ];
  Icon($$renderer, spread_props([
    { name: "crown" },
    $$sanitized_props,
    {
      /**
       * @component @name Crown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEuNTYyIDMuMjY2YS41LjUgMCAwIDEgLjg3NiAwTDE1LjM5IDguODdhMSAxIDAgMCAwIDEuNTE2LjI5NEwyMS4xODMgNS41YS41LjUgMCAwIDEgLjc5OC41MTlsLTIuODM0IDEwLjI0NmExIDEgMCAwIDEtLjk1Ni43MzRINS44MWExIDEgMCAwIDEtLjk1Ny0uNzM0TDIuMDIgNi4wMmEuNS41IDAgMCAxIC43OTgtLjUxOWw0LjI3NiAzLjY2NGExIDEgMCAwIDAgMS41MTYtLjI5NHoiIC8+CiAgPHBhdGggZD0iTTUgMjFoMTQiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/crown
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
function Hard_drive($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["line", { "x1": "22", "x2": "2", "y1": "12", "y2": "12" }],
    [
      "path",
      {
        "d": "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
      }
    ],
    ["line", { "x1": "6", "x2": "6.01", "y1": "16", "y2": "16" }],
    [
      "line",
      { "x1": "10", "x2": "10.01", "y1": "16", "y2": "16" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "hard-drive" },
    $$sanitized_props,
    {
      /**
       * @component @name HardDrive
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMjIiIHgyPSIyIiB5MT0iMTIiIHkyPSIxMiIgLz4KICA8cGF0aCBkPSJNNS40NSA1LjExIDIgMTJ2NmEyIDIgMCAwIDAgMiAyaDE2YTIgMiAwIDAgMCAyLTJ2LTZsLTMuNDUtNi44OUEyIDIgMCAwIDAgMTYuNzYgNEg3LjI0YTIgMiAwIDAgMC0xLjc5IDEuMTF6IiAvPgogIDxsaW5lIHgxPSI2IiB4Mj0iNi4wMSIgeTE9IjE2IiB5Mj0iMTYiIC8+CiAgPGxpbmUgeDE9IjEwIiB4Mj0iMTAuMDEiIHkxPSIxNiIgeTI9IjE2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/hard-drive
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
    let upgradeData = derived(() => data.upgradeData);
    let isUpgrading = false;
    const getUsagePercentage = (current, max) => {
      if (max === -1) return 0;
      return Math.min(current / max * 100, 100);
    };
    const getPlanIcon = (planName) => {
      switch (planName) {
        case "free":
          return Shield;
        case "professional":
          return Star;
        case "academy":
          return Crown;
        default:
          return Zap;
      }
    };
    const getStatIcon = (icon) => icon;
    head("xllfui", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Premium Upgrade - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-12 animate-fade-in pb-20"><div class="text-center space-y-4 py-8"><div class="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-[10px] font-black uppercase tracking-widest mb-4">`);
    Sparkles($$renderer2, { class: "w-3 h-3" });
    $$renderer2.push(`<!----> Potencia tu academia</div> <h1 class="text-5xl font-black text-white tracking-tighter sm:text-6xl">Lleva el ajedrez al <span class="text-primary-400">siguiente nivel</span></h1> <p class="text-surface-400 text-lg max-w-2xl mx-auto">Desbloquea herramientas avanzadas, límites extendidos e insights detallados para gestionar tu academia de forma profesional.</p></div> `);
    if (upgradeData()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="glass-panel p-8 relative overflow-hidden group"><div class="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">`);
      Activity($$renderer2, { class: "w-32 h-32 text-primary-400" });
      $$renderer2.push(`<!----></div> <div class="relative z-10 space-y-6"><div class="flex items-center gap-4"><div class="p-3 bg-primary-500/20 rounded-2xl text-primary-400 shadow-2xl">`);
      Hard_drive($$renderer2, { class: "w-6 h-6" });
      $$renderer2.push(`<!----></div> <div><h2 class="text-xl font-black text-white uppercase tracking-tight">Tu Uso Actual</h2> <p class="text-surface-500 text-xs font-bold uppercase tracking-widest">Estado del plan ${escape_html(upgradeData().current_plan.display_name)}</p></div></div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6"><!--[-->`);
      const each_array = ensure_array_like([
        {
          label: "Estudiantes",
          icon: Users,
          current: upgradeData().usage_stats.students_count,
          max: upgradeData().user_limits.max_students
        },
        {
          label: "Clases",
          icon: School,
          current: upgradeData().usage_stats.classes_count,
          max: upgradeData().user_limits.max_classes
        },
        {
          label: "Centros",
          icon: School,
          current: upgradeData().usage_stats.colleges_count,
          max: upgradeData().user_limits.max_colleges
        },
        {
          label: "Torneos",
          icon: Trophy,
          current: upgradeData().usage_stats.tournaments_count,
          max: upgradeData().user_limits.max_tournaments
        },
        {
          label: "Storage",
          icon: Hard_drive,
          current: upgradeData().usage_stats.storage_used_mb,
          max: upgradeData().user_limits.max_storage_mb
        },
        {
          label: "Skills",
          icon: Target,
          current: upgradeData().usage_stats.custom_skills_count,
          max: upgradeData().user_limits.max_custom_skills
        }
      ]);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let stat = each_array[$$index];
        const StatIcon = getStatIcon(stat.icon);
        $$renderer2.push(`<div class="space-y-2"><div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-surface-500"><span class="flex items-center gap-1.5">`);
        if (StatIcon) {
          $$renderer2.push("<!--[-->");
          StatIcon($$renderer2, { class: "w-3 h-3" });
          $$renderer2.push("<!--]-->");
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push("<!--]-->");
        }
        $$renderer2.push(` ${escape_html(stat.label)}</span> <span class="text-surface-300">${escape_html(stat.current)}${escape_html(stat.max === -1 ? "" : ` / ${stat.max}`)}</span></div> <div class="h-2 bg-surface-950 border border-surface-900 rounded-full overflow-hidden"><div class="h-full bg-primary-500 transition-all duration-1000"${attr_style(`width: ${stat.max === -1 ? 100 : getUsagePercentage(stat.current, stat.max)}%`)}></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><!--[-->`);
      const each_array_1 = ensure_array_like(upgradeData().available_plans);
      for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
        let plan = each_array_1[$$index_2];
        const isCurrent = upgradeData().current_plan.name === plan.name;
        const isPopular = plan.name === "professional";
        const PlanIcon = getPlanIcon(plan.name);
        $$renderer2.push(`<div${attr_class(`glass-panel p-8 relative flex flex-col transition-all duration-300 hover:translate-y-[-8px] ${isPopular ? "border-t-4 border-primary-500 scale-105 z-10 shadow-[0_32px_64px_-16px_rgba(16,185,129,0.2)]" : ""}`)}>`);
        if (isPopular) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Más Popular</div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="mb-8 text-center"><div${attr_class(`w-16 h-16 mx-auto mb-6 rounded-3xl flex items-center justify-center border-2 ${isPopular ? "bg-primary-500/10 border-primary-500 shadow-[0_0_24px_-12px_rgba(16,185,129,0.5)]" : "bg-surface-900 border-surface-800"}`)}>`);
        if (PlanIcon) {
          $$renderer2.push("<!--[-->");
          PlanIcon($$renderer2, {
            class: `w-8 h-8 ${isPopular ? "text-primary-400" : "text-surface-600"}`
          });
          $$renderer2.push("<!--]-->");
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push("<!--]-->");
        }
        $$renderer2.push(`</div> <h3 class="text-2xl font-black text-white uppercase tracking-tighter mb-2">${escape_html(plan.display_name)}</h3> <div class="flex items-baseline justify-center gap-1 mb-4"><span class="text-4xl font-black text-white">€${escape_html(plan.price_annual)}</span> <span class="text-surface-500 text-sm font-bold">/año</span></div> <p class="text-surface-500 text-sm">${escape_html(plan.description)}</p></div> <div class="space-y-4 mb-10 flex-grow"><!--[-->`);
        const each_array_2 = ensure_array_like(plan.features);
        for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
          let feature = each_array_2[$$index_1];
          $$renderer2.push(`<div class="flex items-center gap-3"><div class="w-5 h-5 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">`);
          Check($$renderer2, { class: "w-3 h-3 text-primary-400" });
          $$renderer2.push(`<!----></div> <span class="text-sm text-surface-300 font-medium">${escape_html(feature)}</span></div>`);
        }
        $$renderer2.push(`<!--]--></div> <button${attr("disabled", isCurrent || isUpgrading || plan.name === "free", true)}${attr_class(`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${isCurrent ? "bg-surface-900 border border-surface-800 text-surface-600" : isPopular ? "bg-primary-500 text-black hover:bg-primary-400 hover:shadow-[0_0_32px_-8px_rgba(16,185,129,0.4)]" : "bg-white text-black hover:bg-surface-200"}`)}>`);
        if (isCurrent) {
          $$renderer2.push("<!--[1-->");
          Check($$renderer2, { class: "w-4 h-4" });
          $$renderer2.push(`<!----> Plan Actual`);
        } else {
          $$renderer2.push("<!--[-1-->");
          Zap($$renderer2, { class: "w-4 h-4" });
          $$renderer2.push(`<!----> Suscritbirse`);
        }
        $$renderer2.push(`<!--]--></button></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-12"><div class="space-y-2"><h4 class="text-white font-black uppercase tracking-tight">¿Puedo cambiar luego?</h4> <p class="text-surface-500 text-sm leading-relaxed">Puedes mejorar tu plan en cualquier momento. La diferencia se prorrateará automáticamente en tu factura.</p></div> <div class="space-y-2"><h4 class="text-white font-black uppercase tracking-tight">¿Es seguro el pago?</h4> <p class="text-surface-500 text-sm leading-relaxed">Utilizamos pasarelas de pago cifradas de nivel bancario. ChessNet nunca almacena tus datos de tarjeta.</p></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
