import { i as head, l as attr, d as bind_props, p as pop, f as push } from "../../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils.js";
import "../../../../../chunks/state.svelte.js";
import "../../../../../chunks/supabase.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { S as School } from "../../../../../chunks/school.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let name = "";
  let city = "";
  let isCreating = false;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Crear Centro - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-slate-900"><header class="bg-slate-800 border-b border-slate-700"><div class="container mx-auto px-4 py-4"><div class="flex items-center space-x-4"><button class="text-slate-400 hover:text-white transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----></button> <h1 class="text-2xl font-bold text-white">Crear Nuevo Centro</h1></div></div></header> <main class="container mx-auto px-4 py-8"><div class="max-w-2xl mx-auto"><div class="card"><div class="flex items-center space-x-3 mb-6"><div class="bg-primary-600 p-3 rounded-xl">`);
  School($$payload, { class: "w-6 h-6 text-white" });
  $$payload.out.push(`<!----></div> <div><h2 class="text-xl font-semibold">Información del Centro</h2> <p class="text-slate-400">Completa los datos de tu centro educativo</p></div></div> <form class="space-y-6"><div class="space-y-4"><h3 class="text-lg font-medium text-slate-200">Información Básica</h3> <div><label for="name" class="block text-sm font-medium text-slate-300 mb-2">Nombre del centro</label> <input id="name" type="text"${attr("value", name)} placeholder="Ej: Colegio San Ramón y San Antonio" class="input-base w-full" required/></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="city" class="block text-sm font-medium text-slate-300 mb-2">Ciudad</label> <input id="city" type="text"${attr("value", city)} placeholder="Ej: Madrid" class="input-base w-full"/></div></div></div> <div class="flex justify-end space-x-4 pt-6 border-t border-slate-700"><button type="button" class="btn-ghost"${attr("disabled", isCreating, true)}>Cancelar</button> <button type="submit" class="btn-primary"${attr("disabled", !name.trim(), true)}>`);
  {
    $$payload.out.push("<!--[!-->");
    $$payload.out.push(`Crear centro`);
  }
  $$payload.out.push(`<!--]--></button></div></form></div> <div class="mt-6 p-4 bg-slate-800 rounded-lg"><h4 class="font-medium text-slate-200 mb-2">💡 Consejos</h4> <ul class="text-sm text-slate-400 space-y-1"><li>• El nombre del centro es obligatorio y aparecerá en todos los documentos</li> <li>• La información de contacto es opcional pero recomendada</li> <li>• Podrás modificar estos datos más tarde desde la configuración del centro</li> <li>• Una vez creado, se inicializarán automáticamente las habilidades y materiales por defecto</li></ul></div></div></main></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
