import { d as sanitize_props, f as spread_props, g as slot, s as store_get, h as head, c as escape_html, u as unsubscribe_stores } from "../../chunks/renderer.js";
import { p as page } from "../../chunks/stores.js";
import { T as Triangle_alert } from "../../chunks/triangle-alert.js";
import { I as Icon } from "../../chunks/Icon.js";
import { H as House } from "../../chunks/house.js";
function Refresh_cw($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      { "d": "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }
    ],
    ["path", { "d": "M21 3v5h-5" }],
    [
      "path",
      { "d": "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }
    ],
    ["path", { "d": "M8 16H3v5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "refresh-cw" },
    $$sanitized_props,
    {
      /**
       * @component @name RefreshCw
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAwIDEgOS05IDkuNzUgOS43NSAwIDAgMSA2Ljc0IDIuNzRMMjEgOCIgLz4KICA8cGF0aCBkPSJNMjEgM3Y1aC01IiAvPgogIDxwYXRoIGQ9Ik0yMSAxMmE5IDkgMCAwIDEtOSA5IDkuNzUgOS43NSAwIDAgMS02Ljc0LTIuNzRMMyAxNiIgLz4KICA8cGF0aCBkPSJNOCAxNkgzdjUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/refresh-cw
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
function _error($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let status, message, isConfigError;
    status = store_get($$store_subs ??= {}, "$page", page).status;
    message = store_get($$store_subs ??= {}, "$page", page).error?.message || "Ha ocurrido un error inesperado";
    isConfigError = message.includes("Missing Supabase environment variables");
    head("1j96wlh", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Error ${escape_html(status)} - ChessNet</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4"><div class="max-w-md w-full text-center"><div class="bg-slate-800 rounded-2xl p-8 shadow-2xl"><div class="text-6xl font-bold text-red-500 mb-4">${escape_html(status)}</div> <h1 class="text-2xl font-bold text-white mb-4">${escape_html(status === 404 ? "Página no encontrada" : isConfigError ? "Error de configuración" : "Error del servidor")}</h1> <p class="text-slate-300 mb-8">${escape_html(isConfigError ? "Las variables de entorno de Supabase no están configuradas correctamente. Por favor, contacta al administrador." : message)}</p> `);
    if (isConfigError) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4 mb-6"><div class="flex items-center gap-2 text-yellow-400 mb-2">`);
      Triangle_alert($$renderer2, { class: "w-4 h-4" });
      $$renderer2.push(`<!----> <span class="font-medium">Error de configuración</span></div> <p class="text-sm text-yellow-200">El sitio necesita las variables de entorno de Supabase para funcionar correctamente.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="space-y-4"><button class="w-full btn-primary flex items-center justify-center gap-2">`);
    Refresh_cw($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Recargar página</button> <button class="w-full btn-secondary flex items-center justify-center gap-2">`);
    House($$renderer2, { class: "w-4 h-4" });
    $$renderer2.push(`<!----> Ir al inicio</button></div></div></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _error as default
};
