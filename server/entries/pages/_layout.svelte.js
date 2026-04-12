import "clsx";
import { e as ensure_array_like, s as store_get, a as attr_class, b as stringify, c as escape_html, u as unsubscribe_stores } from "../../chunks/renderer.js";
import { w as writable } from "../../chunks/index.js";
import { X } from "../../chunks/x.js";
import { I as Info } from "../../chunks/info.js";
import { T as Triangle_alert } from "../../chunks/triangle-alert.js";
import { C as Circle_x } from "../../chunks/circle-x.js";
import { C as Circle_check_big } from "../../chunks/circle-check-big.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
import "../../chunks/state.svelte.js";
const toasts = writable([]);
function Toast($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
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
    $$renderer2.push(`<div class="fixed top-4 right-4 z-50 space-y-2"><!--[-->`);
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let toast = each_array[$$index];
      $$renderer2.push(`<div${attr_class(`flex items-center gap-3 p-4 rounded-lg border shadow-lg text-white min-w-80 max-w-96 transform transition-all duration-300 ease-in-out ${stringify(getColorClasses(toast.type))}`)} role="alert" aria-live="polite">`);
      if (getIcon(toast.type)) {
        $$renderer2.push("<!--[-->");
        getIcon(toast.type)($$renderer2, { class: "w-5 h-5 flex-shrink-0" });
        $$renderer2.push("<!--]-->");
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push("<!--]-->");
      }
      $$renderer2.push(` <span class="flex-1 text-sm font-medium">${escape_html(toast.message)}</span> <button class="flex-shrink-0 p-1 rounded-full hover:bg-black/20 transition-colors" aria-label="Cerrar notificación">`);
      X($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----></button></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function CookieBanner($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function _layout($$renderer, $$props) {
  let { children } = $$props;
  console.log("🔄 Layout mounted - Auth store DISABLED, using server-side auth only");
  $$renderer.push(`<main class="min-h-screen bg-slate-900 text-slate-100">`);
  children($$renderer);
  $$renderer.push(`<!----> `);
  Toast($$renderer);
  $$renderer.push(`<!----> `);
  CookieBanner($$renderer);
  $$renderer.push(`<!----> `);
  $$renderer.push(`<!----></main>`);
}
export {
  _layout as default
};
