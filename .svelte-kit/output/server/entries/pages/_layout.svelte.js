import "clsx";
import { e as ensure_array_like, q as store_get, f as attr_class, l as stringify, d as escape_html, u as unsubscribe_stores, p as pop, k as push } from "../../chunks/index.js";
import { w as writable } from "../../chunks/index2.js";
import { X } from "../../chunks/x.js";
import { I as Info } from "../../chunks/info.js";
import { T as Triangle_alert } from "../../chunks/triangle-alert.js";
import { C as Circle_x } from "../../chunks/circle-x.js";
import { C as Circle_check_big } from "../../chunks/circle-check-big.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "../../chunks/state.svelte.js";
const toasts = writable([]);
function Toast($$payload, $$props) {
  push();
  var $$store_subs;
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return Circle_check_big;
      case "error":
        return Circle_x;
      case "warning":
        return Triangle_alert;
      case "info":
        return Info;
      default:
        return Info;
    }
  };
  const getColorClasses = (type) => {
    switch (type) {
      case "success":
        return "bg-green-600 border-green-500";
      case "error":
        return "bg-red-600 border-red-500";
      case "warning":
        return "bg-yellow-600 border-yellow-500";
      case "info":
        return "bg-blue-600 border-blue-500";
      default:
        return "bg-slate-600 border-slate-500";
    }
  };
  const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts));
  $$payload.out.push(`<div class="fixed top-4 right-4 z-50 space-y-2"><!--[-->`);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let toast = each_array[$$index];
    $$payload.out.push(`<div${attr_class(`flex items-center gap-3 p-4 rounded-lg border shadow-lg text-white min-w-80 max-w-96 transform transition-all duration-300 ease-in-out ${stringify(getColorClasses(toast.type))}`)} role="alert" aria-live="polite"><!---->`);
    getIcon(toast.type)?.($$payload, { class: "w-5 h-5 flex-shrink-0" });
    $$payload.out.push(`<!----> <span class="flex-1 text-sm font-medium">${escape_html(toast.message)}</span> <button class="flex-shrink-0 p-1 rounded-full hover:bg-black/20 transition-colors" aria-label="Cerrar notificación">`);
    X($$payload, { class: "w-4 h-4" });
    $$payload.out.push(`<!----></button></div>`);
  }
  $$payload.out.push(`<!--]--></div>`);
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function CookieBanner($$payload, $$props) {
  push();
  {
    $$payload.out.push("<!--[!-->");
  }
  $$payload.out.push(`<!--]-->`);
  pop();
}
function _layout($$payload, $$props) {
  let { children } = $$props;
  console.log("🔄 Layout mounted - Auth store DISABLED, using server-side auth only");
  $$payload.out.push(`<main class="min-h-screen bg-slate-900 text-slate-100">`);
  children($$payload);
  $$payload.out.push(`<!----> `);
  Toast($$payload);
  $$payload.out.push(`<!----> `);
  CookieBanner($$payload);
  $$payload.out.push(`<!----> `);
  $$payload.out.push(`<!----></main>`);
}
export {
  _layout as default
};
