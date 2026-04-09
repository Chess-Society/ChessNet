import { h as head } from "../../chunks/index.js";
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>ChessNet - Plataforma Educativa de Ajedrez</title>`;
    $$payload2.out.push(`<meta name="description" content="Plataforma educativa de ajedrez para colegios, clubes y academias"/>`);
  });
  $$payload.out.push(`<div class="min-h-screen flex items-center justify-center bg-slate-900"><div class="text-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div> <p class="text-slate-400">Redirigiendo al login...</p></div></div>`);
}
export {
  _page as default
};
