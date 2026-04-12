import { d as sanitize_props, f as spread_props, g as slot, h as head } from "../../../chunks/renderer.js";
import { S as School } from "../../../chunks/school.js";
import { I as Icon } from "../../../chunks/Icon.js";
function Heart($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "heart" },
    $$sanitized_props,
    {
      /**
       * @component @name Heart
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMiA5LjVhNS41IDUuNSAwIDAgMSA5LjU5MS0zLjY3Ni41Ni41NiAwIDAgMCAuODE4IDBBNS40OSA1LjQ5IDAgMCAxIDIyIDkuNWMwIDIuMjktMS41IDQtMyA1LjVsLTUuNDkyIDUuMzEzYTIgMiAwIDAgMS0zIC4wMTlMNSAxNWMtMS41LTEuNS0zLTMuMi0zLTUuNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/heart
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
function _page($$renderer) {
  head("jkfyep", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Apoya el Desarrollo | ChessNet</title>`);
    });
    $$renderer2.push(`<meta name="description" content="Ayuda a mantener ChessNet gratuito y en constante mejora. Tu donación nos permite seguir desarrollando nuevas funcionalidades para profesores de ajedrez."/>`);
  });
  $$renderer.push(`<div class="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden"><div class="fixed inset-0 z-0 opacity-20 pointer-events-none"><div class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div> <div class="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div></div> <div class="fixed top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] pointer-events-none animate-pulse"></div> <div class="fixed bottom-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none"></div> <nav class="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto"><a href="/" class="flex items-center gap-2 font-bold text-xl tracking-tight group"><div class="relative"><div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-200"></div> <div class="relative bg-slate-900 rounded-lg p-1">`);
  School($$renderer, { class: "w-8 h-8 text-emerald-500" });
  $$renderer.push(`<!----></div></div> <span class="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">ChessNet</span></a> <a href="/" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">Volver al Inicio</a></nav> <main class="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"><div><div class="inline-flex items-center justify-center p-3 rounded-2xl bg-pink-500/10 text-pink-500 mb-6 border border-pink-500/20 shadow-lg shadow-pink-500/10">`);
  Heart($$renderer, { class: "w-8 h-8 fill-current" });
  $$renderer.push(`<!----></div> <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">Apoya el desarrollo</h1> <p class="text-lg text-slate-400 leading-relaxed mb-12 max-w-2xl mx-auto">ChessNet es un proyecto joven creado con pasión por el ajedrez.
        Tu contribución nos ayuda a mantener los servidores y seguir
        desarrollando nuevas funcionalidades gratuitas para la
        comunidad.</p> <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl inline-block max-w-md w-full">`);
  $$renderer.push(`<script async="" src="https://js.stripe.com/v3/buy-button.js"><\/script>`);
  $$renderer.push(` <stripe-buy-button buy-button-id="buy_btn_1ShDC7RBnPDD6EfRe0xpMg3F" publishable-key="pk_live_51RzKQXRBnPDD6EfRTxX5YwO774aneUhFFobOgN60B6L119zJqahr3xkTIkq9Y4U9yROltHJGfbIREKP8yrLj19cb00gLokkz1l"></stripe-buy-button></div> <p class="mt-8 text-sm text-slate-500">Pago seguro procesado por Stripe. <br/> Gracias por ser parte de ChessNet.</p></div></main></div>`);
}
export {
  _page as default
};
