import { e as escape_html, c as slot, d as bind_props, p as pop, f as push, h as stringify } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "clsx";
import "../../../chunks/state.svelte.js";
import { U as User } from "../../../chunks/user.js";
import { C as Chevron_down } from "../../../chunks/chevron-down.js";
function _layout($$payload, $$props) {
  push();
  let user;
  let data = $$props["data"];
  user = data.user;
  $$payload.out.push(`<div class="min-h-screen bg-slate-900"><header class="bg-slate-800/50 border-b border-slate-700/50 sticky top-0 z-40"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center h-16"><div class="flex items-center space-x-3"><div class="text-xl font-bold text-white">ChessNet</div> <div class="text-sm text-slate-400">Sistema de Gestión</div></div> <div class="flex items-center space-x-4">`);
  if (user) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="relative user-menu"><button class="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"><div class="p-1 bg-slate-600/50 rounded-full">`);
    User($$payload, { class: "w-4 h-4 text-slate-300" });
    $$payload.out.push(`<!----></div> <span class="text-sm text-slate-300 max-w-32 truncate">${escape_html(user.email || "Usuario")}</span> `);
    Chevron_down($$payload, {
      class: `w-4 h-4 text-slate-400 transition-transform ${stringify("")}`
    });
    $$payload.out.push(`<!----></button> `);
    {
      $$payload.out.push("<!--[!-->");
    }
    $$payload.out.push(`<!--]--></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`<div class="text-sm text-slate-400">No autenticado</div>`);
  }
  $$payload.out.push(`<!--]--></div></div></div></header> <main><!---->`);
  slot($$payload, $$props, "default", {});
  $$payload.out.push(`<!----></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _layout as default
};
