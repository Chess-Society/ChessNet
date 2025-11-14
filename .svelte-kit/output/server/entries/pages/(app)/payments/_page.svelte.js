import { i as head, j as attr_class, e as escape_html, k as ensure_array_like, h as stringify, d as bind_props, p as pop, f as push } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "clsx";
import "../../../../chunks/state.svelte.js";
import { A as Arrow_left } from "../../../../chunks/arrow-left.js";
import { D as Dollar_sign } from "../../../../chunks/dollar-sign.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { T as Trending_up } from "../../../../chunks/trending-up.js";
import { T as Trending_down } from "../../../../chunks/trending-down.js";
import { C as Clock } from "../../../../chunks/clock.js";
import { T as Triangle_alert } from "../../../../chunks/triangle-alert.js";
import { C as Chart_column } from "../../../../chunks/chart-column.js";
import { U as Users } from "../../../../chunks/users.js";
import { S as School } from "../../../../chunks/school.js";
function _page($$payload, $$props) {
  push();
  let filteredPayments;
  let data = $$props["data"];
  let statusFilter = "all";
  let typeFilter = "all";
  let conceptFilter = "all";
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };
  const getStatusBadge = (status) => {
    const badges = {
      paid: {
        class: "bg-green-500/20 text-green-400 border-green-500/30",
        label: "Pagado"
      },
      pending: {
        class: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        label: "Pendiente"
      },
      overdue: {
        class: "bg-red-500/20 text-red-400 border-red-500/30",
        label: "Vencido"
      },
      cancelled: {
        class: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        label: "Cancelado"
      },
      refunded: {
        class: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        label: "Reembolsado"
      }
    };
    return badges[status] || badges.pending;
  };
  filteredPayments = data.payments?.filter((payment) => {
    const matchesSearch = true;
    const matchesStatus = statusFilter === "all";
    const matchesType = typeFilter === "all";
    const matchesConcept = conceptFilter === "all";
    return matchesSearch && matchesStatus && matchesType && matchesConcept;
  }) || [];
  (() => {
    const schoolPayments = filteredPayments.filter((p) => p.payment_type === "school");
    const studentPayments = filteredPayments.filter((p) => p.payment_type === "student");
    const sortedSchools = schoolPayments.sort((a, b) => {
      const nameA = a.school?.name || "";
      const nameB = b.school?.name || "";
      return nameA.localeCompare(nameB);
    });
    const sortedStudents = studentPayments.sort((a, b) => {
      const nameA = a.student?.name || "";
      const nameB = b.student?.name || "";
      return nameA.localeCompare(nameB);
    });
    return [...sortedSchools, ...sortedStudents];
  })();
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Sistema de Pagos - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-slate-900"><div class="border-b border-slate-700/50 bg-slate-800/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-6"><div class="flex items-center space-x-4"><button class="p-2 text-slate-400 hover:text-white transition-colors" title="Volver al Dashboard">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <div class="p-2 bg-emerald-500/20 rounded-lg">`);
  Dollar_sign($$payload, { class: "w-8 h-8 text-emerald-400" });
  $$payload.out.push(`<!----></div> <div><h1 class="text-2xl font-bold text-white">Sistema de Pagos</h1> <p class="text-slate-400">Gestión de cobros y facturación</p></div></div> <button class="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">`);
  Plus($$payload, { class: "w-4 h-4" });
  $$payload.out.push(`<!----> <span>Nuevo Pago</span></button></div></div></div> <div class="border-b border-slate-700/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><nav class="flex space-x-12"><button${attr_class(`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${stringify(
    "border-emerald-500 text-emerald-400"
  )}`)}>Resumen</button> <button${attr_class(`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${stringify("border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300")}`)}>Todos los Pagos</button> <button${attr_class(`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${stringify("border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300")}`)}>Por Estudiante</button> <button${attr_class(`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${stringify("border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300")}`)}>Por Centro</button></nav></div></div> <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`);
  {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="space-y-8"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><div class="flex items-center justify-between mb-4"><div class="p-2 bg-emerald-500/20 rounded-lg">`);
    Dollar_sign($$payload, { class: "w-6 h-6 text-emerald-400" });
    $$payload.out.push(`<!----></div> `);
    if (data.paymentStats?.revenue_growth_percentage > 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="flex items-center space-x-1 text-emerald-400">`);
      Trending_up($$payload, { class: "w-4 h-4" });
      $$payload.out.push(`<!----> <span class="text-sm">+${escape_html(data.paymentStats.revenue_growth_percentage)}%</span></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      if (data.paymentStats?.revenue_growth_percentage < 0) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="flex items-center space-x-1 text-red-400">`);
        Trending_down($$payload, { class: "w-4 h-4" });
        $$payload.out.push(`<!----> <span class="text-sm">${escape_html(data.paymentStats.revenue_growth_percentage)}%</span></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]-->`);
    }
    $$payload.out.push(`<!--]--></div> <h3 class="text-2xl font-bold text-white mb-1">${escape_html(formatCurrency(data.paymentStats?.total_revenue_this_month || 0))}</h3> <p class="text-slate-400 text-sm">Ingresos este mes</p></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><div class="flex items-center justify-between mb-4"><div class="p-2 bg-yellow-500/20 rounded-lg">`);
    Clock($$payload, { class: "w-6 h-6 text-yellow-400" });
    $$payload.out.push(`<!----></div> <span class="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">${escape_html(data.paymentStats?.pending_payments_count || 0)}</span></div> <h3 class="text-2xl font-bold text-white mb-1">Pendientes</h3> <p class="text-slate-400 text-sm">Por cobrar</p></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><div class="flex items-center justify-between mb-4"><div class="p-2 bg-red-500/20 rounded-lg">`);
    Triangle_alert($$payload, { class: "w-6 h-6 text-red-400" });
    $$payload.out.push(`<!----></div> <span class="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">${escape_html(data.paymentStats?.overdue_payments_count || 0)}</span></div> <h3 class="text-2xl font-bold text-white mb-1">${escape_html(formatCurrency(data.paymentStats?.overdue_amount || 0))}</h3> <p class="text-slate-400 text-sm">Vencidos</p></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"><div class="flex items-center justify-between mb-4"><div class="p-2 bg-blue-500/20 rounded-lg">`);
    Chart_column($$payload, { class: "w-6 h-6 text-blue-400" });
    $$payload.out.push(`<!----></div></div> <h3 class="text-2xl font-bold text-white mb-1">${escape_html(formatCurrency(data.paymentStats?.average_payment_amount || 0))}</h3> <p class="text-slate-400 text-sm">Promedio por pago</p></div></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg"><div class="p-6 border-b border-slate-700/50"><h2 class="text-lg font-semibold text-white">Pagos Recientes</h2></div> <div class="p-6">`);
    if (data.payments && data.payments.length > 0) {
      $$payload.out.push("<!--[-->");
      const each_array = ensure_array_like(data.payments.slice(0, 5));
      $$payload.out.push(`<div class="space-y-4"><!--[-->`);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let payment = each_array[$$index];
        $$payload.out.push(`<div class="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"><div class="flex items-center space-x-4"><div class="p-2 bg-slate-600/50 rounded-lg">`);
        if (payment.payment_type === "student") {
          $$payload.out.push("<!--[-->");
          Users($$payload, { class: "w-5 h-5 text-slate-400" });
        } else {
          $$payload.out.push("<!--[!-->");
          School($$payload, { class: "w-5 h-5 text-slate-400" });
        }
        $$payload.out.push(`<!--]--></div> <div><h4 class="font-medium text-white">${escape_html(payment.student?.name || payment.school?.name || "Sin nombre")}</h4> <p class="text-sm text-slate-400">${escape_html(payment.description)}</p></div></div> <div class="flex items-center space-x-4"><div class="text-right"><p class="font-semibold text-white">${escape_html(formatCurrency(payment.amount))}</p> <p class="text-sm text-slate-400">${escape_html(formatDate(payment.due_date))}</p></div> <span${attr_class(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stringify(getStatusBadge(payment.status).class)}`)}>${escape_html(getStatusBadge(payment.status).label)}</span></div></div>`);
      }
      $$payload.out.push(`<!--]--></div>`);
    } else {
      $$payload.out.push("<!--[!-->");
      $$payload.out.push(`<div class="text-center py-8">`);
      Dollar_sign($$payload, { class: "w-12 h-12 text-slate-600 mx-auto mb-4" });
      $$payload.out.push(`<!----> <p class="text-slate-400">No hay pagos registrados</p></div>`);
    }
    $$payload.out.push(`<!--]--></div></div> `);
    if (data.paymentStats?.overdue_payments_count > 0) {
      $$payload.out.push("<!--[-->");
      $$payload.out.push(`<div class="bg-red-500/10 border border-red-500/20 rounded-lg p-6"><div class="flex items-center space-x-3">`);
      Triangle_alert($$payload, { class: "w-6 h-6 text-red-400" });
      $$payload.out.push(`<!----> <div><h3 class="font-semibold text-red-400">Atención: Pagos Vencidos</h3> <p class="text-red-300/80">Tienes ${escape_html(data.paymentStats.overdue_payments_count)} pagos vencidos por un total de ${escape_html(formatCurrency(data.paymentStats.overdue_amount))}</p></div></div></div>`);
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
  $$payload.out.push(`<!--]--></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
