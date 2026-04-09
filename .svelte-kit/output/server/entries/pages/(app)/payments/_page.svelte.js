import { a as sanitize_props, b as spread_props, c as slot, e as ensure_array_like, h as head, f as attr_class, d as escape_html, p as pop, k as push } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "clsx";
import "../../../../chunks/state.svelte.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { H as History } from "../../../../chunks/history.js";
import { U as Users } from "../../../../chunks/users.js";
import { S as School } from "../../../../chunks/school.js";
import { T as Trending_up } from "../../../../chunks/trending-up.js";
import { D as Dollar_sign } from "../../../../chunks/dollar-sign.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { T as Triangle_alert } from "../../../../chunks/triangle-alert.js";
import { C as Chart_column } from "../../../../chunks/chart-column.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
function Chart_pie($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.542.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"
      }
    ],
    ["path", { "d": "M21.21 15.89A10 10 0 1 1 8 2.83" }]
  ];
  Icon($$payload, spread_props([
    { name: "chart-pie" },
    $$sanitized_props,
    {
      /**
       * @component @name ChartPie
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEgMTJjLjU1MiAwIDEuMDA1LS40NDkuOTUtLjk5OGExMCAxMCAwIDAgMC04Ljk1My04Ljk1MWMtLjU1LS4wNTUtLjk5OC4zOTgtLjk5OC45NXY4YTEgMSAwIDAgMCAxIDF6IiAvPgogIDxwYXRoIGQ9Ik0yMS4yMSAxNS44OUExMCAxMCAwIDEgMSA4IDIuODMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/chart-pie
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Trending_down($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.542.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    ["path", { "d": "M16 17h6v-6" }],
    ["path", { "d": "m22 17-8.5-8.5-5 5L2 7" }]
  ];
  Icon($$payload, spread_props([
    { name: "trending-down" },
    $$sanitized_props,
    {
      /**
       * @component @name TrendingDown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgMTdoNnYtNiIgLz4KICA8cGF0aCBkPSJtMjIgMTctOC41LTguNS01IDVMMiA3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/trending-down
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Wallet($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.542.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
      }
    ],
    ["path", { "d": "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" }]
  ];
  Icon($$payload, spread_props([
    { name: "wallet" },
    $$sanitized_props,
    {
      /**
       * @component @name Wallet
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgN1Y0YTEgMSAwIDAgMC0xLTFINWEyIDIgMCAwIDAgMCA0aDE1YTEgMSAwIDAgMSAxIDF2NGgtM2EyIDIgMCAwIDAgMCA0aDNhMSAxIDAgMCAwIDEtMXYtMmExIDEgMCAwIDAtMS0xIiAvPgogIDxwYXRoIGQ9Ik0zIDV2MTRhMiAyIDAgMCAwIDIgMmgxNWExIDEgMCAwIDAgMS0xdi00IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/wallet
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  let statusFilter = "all";
  let typeFilter = "all";
  let conceptFilter = "all";
  let selectedTab = "overview";
  data.payments?.filter((payment) => {
    const matchesSearch = true;
    const matchesStatus = statusFilter === "all";
    const matchesType = typeFilter === "all";
    const matchesConcept = conceptFilter === "all";
    return matchesSearch && matchesStatus && matchesType && matchesConcept;
  }) || [];
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
  };
  const statusThemes = {
    paid: "bg-green-500/10 text-green-400 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    overdue: "bg-red-500/10 text-red-400 border-red-500/20",
    cancelled: "bg-surface-800 text-surface-500 border-surface-700",
    refunded: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  };
  const statusLabels = {
    paid: "Pagado",
    pending: "Pendiente",
    overdue: "Vencido",
    cancelled: "Cancelado",
    refunded: "Reembolsado"
  };
  const conceptLabels = {
    monthly_fee: "Mensualidad",
    registration: "Inscripción",
    tournament: "Torneo",
    material: "Material",
    private_lesson: "Clase Particular",
    other: "Otros"
  };
  const each_array = ensure_array_like(["overview", "payments", "students", "schools"]);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Pagos - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="space-y-8 animate-fade-in"><div class="flex flex-col md:flex-row md:items-end justify-between gap-6"><div class="space-y-2 text-center md:text-left"><div class="flex items-center justify-center md:justify-start gap-3 text-primary-400 font-bold uppercase tracking-widest text-xs">`);
  Wallet($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> Finanzas &amp; Facturación</div> <h1 class="text-4xl font-black text-white tracking-tight">Sistema de Pagos</h1> <p class="text-surface-400 text-lg">Administra ingresos, cobros pendientes y estados financieros.</p></div> <div class="flex items-center justify-center gap-3"><button class="group relative px-6 py-3 bg-primary-500 hover:bg-primary-400 text-surface-950 font-black uppercase tracking-tighter rounded-xl transition-all duration-300 flex items-center gap-2 overflow-hidden shadow-2xl shadow-primary-500/20"><div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div> `);
  Plus($$payload, { class: "w-5 h-5 relative z-10" });
  $$payload.out.push(`<!----> <span class="relative z-10 text-sm">Nuevo Pago</span></button></div></div> <div class="flex p-1 bg-surface-950/50 border border-surface-800 rounded-2xl w-full max-w-2xl overflow-x-auto no-scrollbar svelte-13kq8op"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tab = each_array[$$index];
    $$payload.out.push(`<button${attr_class(
      `flex-1 min-w-[100px] py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${selectedTab === tab ? "bg-surface-800 text-primary-400 shadow-xl" : "text-surface-500 hover:text-surface-300"}`,
      "svelte-13kq8op"
    )}>`);
    if (tab === "overview") {
      $$payload.out.push("<!--[-->");
      Chart_pie($$payload, { class: "w-3.5 h-3.5" });
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    if (tab === "payments") {
      $$payload.out.push("<!--[-->");
      History($$payload, { class: "w-3.5 h-3.5" });
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    if (tab === "students") {
      $$payload.out.push("<!--[-->");
      Users($$payload, { class: "w-3.5 h-3.5" });
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> `);
    if (tab === "schools") {
      $$payload.out.push("<!--[-->");
      School($$payload, { class: "w-3.5 h-3.5" });
    } else {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--> ${escape_html(tab === "overview" ? "Resumen" : tab === "payments" ? "Pagos" : tab === "students" ? "Alumnos" : "Centros")}</button>`);
  }
  $$payload.out.push(`<!--]--></div> <main class="space-y-8 min-h-[60vh]">`);
  {
    $$payload.out.push("<!--[-->");
    const each_array_1 = ensure_array_like(data.payments?.slice(0, 4) || []);
    $$payload.out.push(`<div class="space-y-8"><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><div class="glass-card p-6 border-b-2 border-primary-500 relative overflow-hidden group"><div class="absolute -right-4 -top-4 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-all duration-500"></div> <p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Ingresos Mes</p> <div class="flex items-center justify-between"><div><p class="text-3xl font-black text-white">${escape_html(formatCurrency(data.paymentStats?.total_revenue_this_month || 0))}</p> <div class="flex items-center gap-1.5 mt-1">`);
    if ((data.paymentStats?.revenue_growth_percentage || 0) >= 0) {
      $$payload.out.push("<!--[-->");
      Trending_up($$payload, { class: "w-3 h-3 text-green-400" });
      $$payload.out.push(`<!----> <span class="text-[10px] font-bold text-green-400">+${escape_html(data.paymentStats.revenue_growth_percentage)}%</span>`);
    } else {
      $$payload.out.push("<!--[!-->");
      Trending_down($$payload, { class: "w-3 h-3 text-red-400" });
      $$payload.out.push(`<!----> <span class="text-[10px] font-bold text-red-400">${escape_html(data.paymentStats.revenue_growth_percentage)}%</span>`);
    }
    $$payload.out.push(`<!--]--></div></div> <div class="p-2 bg-primary-500/10 rounded-xl text-primary-400">`);
    Dollar_sign($$payload, { class: "w-5 h-5" });
    $$payload.out.push(`<!----></div></div></div> <div class="glass-card p-6 border-b-2 border-yellow-500"><p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Pendientes</p> <div class="flex items-center justify-between"><div><p class="text-3xl font-black text-yellow-500">${escape_html(data.paymentStats?.pending_payments_count || 0)}</p> <p class="text-[10px] text-surface-500 font-bold mt-1 uppercase">POR COBRAR</p></div> <div class="p-2 bg-yellow-500/10 rounded-xl text-yellow-500">`);
    Clock($$payload, { class: "w-5 h-5" });
    $$payload.out.push(`<!----></div></div></div> <div class="glass-card p-6 border-b-2 border-red-500"><p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Vencidos (Debt)</p> <div class="flex items-center justify-between"><div><p class="text-3xl font-black text-red-500">${escape_html(formatCurrency(data.paymentStats?.overdue_amount || 0))}</p> <p class="text-[10px] text-red-500/50 font-bold mt-1 uppercase">${escape_html(data.paymentStats?.overdue_payments_count || 0)} RECIBOS</p></div> <div class="p-2 bg-red-500/10 rounded-xl text-red-400">`);
    Triangle_alert($$payload, { class: "w-5 h-5" });
    $$payload.out.push(`<!----></div></div></div> <div class="glass-card p-6 border-b-2 border-blue-500"><p class="text-[10px] font-bold text-surface-500 uppercase tracking-wider mb-2">Ticket Medio</p> <div class="flex items-center justify-between"><div><p class="text-3xl font-black text-blue-400">${escape_html(formatCurrency(data.paymentStats?.average_payment_amount || 0))}</p> <p class="text-[10px] text-surface-500 font-bold mt-1 uppercase">VALOR TRANSACCIÓN</p></div> <div class="p-2 bg-blue-500/10 rounded-xl text-blue-400">`);
    Chart_column($$payload, { class: "w-5 h-5" });
    $$payload.out.push(`<!----></div></div></div></div> <div class="space-y-4"><div class="flex items-center justify-between"><h2 class="text-xl font-black text-white flex items-center gap-2 italic uppercase">`);
    History($$payload, { class: "w-5 h-5 text-primary-400" });
    $$payload.out.push(`<!----> Últimas Transacciones</h2> <button class="text-[10px] font-bold text-primary-400 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">Ver Historial Completo `);
    Chevron_right($$payload, { class: "w-4 h-4" });
    $$payload.out.push(`<!----></button></div> <div class="grid grid-cols-1 gap-3"><!--[-->`);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let payment = each_array_1[$$index_1];
      $$payload.out.push(`<div class="glass-panel group hover:bg-surface-900/40 transition-all duration-300"><div class="p-4 flex items-center justify-between"><div class="flex items-center gap-4"><div${attr_class(
        `w-12 h-12 rounded-xl flex items-center justify-center border border-surface-800 shadow-xl transition-all group-hover:scale-110 ${payment.payment_type === "student" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"}`,
        "svelte-13kq8op"
      )}>`);
      if (payment.payment_type === "student") {
        $$payload.out.push("<!--[-->");
        Users($$payload, { class: "w-6 h-6" });
      } else {
        $$payload.out.push("<!--[!-->");
        School($$payload, { class: "w-6 h-6" });
      }
      $$payload.out.push(`<!--]--></div> <div><h4 class="font-bold text-white group-hover:text-primary-400 transition-colors">${escape_html(payment.student?.name || payment.school?.name)}</h4> <p class="text-[10px] font-bold text-surface-500 uppercase tracking-widest">${escape_html(conceptLabels[payment.concept] || "Otros")}</p></div></div> <div class="flex items-center gap-8"><div class="text-right hidden sm:block"><p class="text-[10px] font-bold text-surface-600 uppercase tracking-widest mb-0.5">Vencimiento</p> <p class="text-xs font-black text-white">${escape_html(formatDate(payment.due_date))}</p></div> <div class="text-right"><p class="text-lg font-black text-white">${escape_html(formatCurrency(payment.amount))}</p> <span${attr_class(`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${statusThemes[payment.status]}`, "svelte-13kq8op")}>${escape_html(statusLabels[payment.status])}</span></div> <button class="p-2 text-surface-600 hover:text-white transition-colors">`);
      Chevron_right($$payload, { class: "w-5 h-5" });
      $$payload.out.push(`<!----></button></div></div></div>`);
    }
    $$payload.out.push(`<!--]--></div></div></div>`);
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--> `);
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]--></main></div>`);
  pop();
}
export {
  _page as default
};
