import { a as sanitize_props, b as spread_props, c as slot, i as head, k as ensure_array_like, e as escape_html, o as attr_style, j as attr_class, h as stringify, l as attr, d as bind_props, p as pop, f as push } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/subscriptions.js";
import { A as Arrow_left } from "../../../../chunks/arrow-left.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { U as Users } from "../../../../chunks/users.js";
import { S as School } from "../../../../chunks/school.js";
import { T as Trophy } from "../../../../chunks/trophy.js";
import { T as Target } from "../../../../chunks/target.js";
import { Z as Zap } from "../../../../chunks/zap.js";
import { S as Shield } from "../../../../chunks/shield.js";
import { S as Star } from "../../../../chunks/star.js";
function Check($$payload, $$props) {
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
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  Icon($$payload, spread_props([
    { name: "check" },
    $$sanitized_props,
    {
      /**
       * @component @name Check
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgNiA5IDE3bC01LTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/check
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
function Crown($$payload, $$props) {
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
        "d": "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"
      }
    ],
    ["path", { "d": "M5 21h14" }]
  ];
  Icon($$payload, spread_props([
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
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Hard_drive($$payload, $$props) {
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
  Icon($$payload, spread_props([
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
      children: ($$payload2) => {
        $$payload2.out.push(`<!---->`);
        slot($$payload2, $$props, "default", {});
        $$payload2.out.push(`<!---->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Sparkles($$payload, $$props) {
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
        "d": "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
      }
    ],
    ["path", { "d": "M20 2v4" }],
    ["path", { "d": "M22 4h-4" }],
    ["circle", { "cx": "4", "cy": "20", "r": "2" }]
  ];
  Icon($$payload, spread_props([
    { name: "sparkles" },
    $$sanitized_props,
    {
      /**
       * @component @name Sparkles
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEuMDE3IDIuODE0YTEgMSAwIDAgMSAxLjk2NiAwbDEuMDUxIDUuNTU4YTIgMiAwIDAgMCAxLjU5NCAxLjU5NGw1LjU1OCAxLjA1MWExIDEgMCAwIDEgMCAxLjk2NmwtNS41NTggMS4wNTFhMiAyIDAgMCAwLTEuNTk0IDEuNTk0bC0xLjA1MSA1LjU1OGExIDEgMCAwIDEtMS45NjYgMGwtMS4wNTEtNS41NThhMiAyIDAgMCAwLTEuNTk0LTEuNTk0bC01LjU1OC0xLjA1MWExIDEgMCAwIDEgMC0xLjk2Nmw1LjU1OC0xLjA1MWEyIDIgMCAwIDAgMS41OTQtMS41OTR6IiAvPgogIDxwYXRoIGQ9Ik0yMCAydjQiIC8+CiAgPHBhdGggZD0iTTIyIDRoLTQiIC8+CiAgPGNpcmNsZSBjeD0iNCIgY3k9IjIwIiByPSIyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/sparkles
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
  let data = $$props["data"];
  let upgradeData = data.upgradeData;
  let isUpgrading = false;
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(price);
  };
  const getUsagePercentage = (current, max) => {
    if (max === -1) return 0;
    return Math.min(current / max * 100, 100);
  };
  const getUsageColor = (percentage) => {
    if (percentage >= 90) return "text-red-400";
    if (percentage >= 75) return "text-yellow-400";
    return "text-green-400";
  };
  const getPlanIcon = (planName) => {
    switch (planName) {
      case "free":
        return Users;
      case "professional":
        return Star;
      case "academy":
        return Crown;
      default:
        return Shield;
    }
  };
  const getPlanColor = (planName) => {
    switch (planName) {
      case "free":
        return "border-slate-600 bg-slate-800/50";
      case "professional":
        return "border-blue-500/50 bg-blue-500/10";
      case "academy":
        return "border-purple-500/50 bg-purple-500/10";
      default:
        return "border-slate-600 bg-slate-800/50";
    }
  };
  const isCurrentPlan = (planName) => {
    return upgradeData?.current_plan?.name === planName;
  };
  const isPopularPlan = (planName) => {
    return planName === "professional";
  };
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Upgrade de Plan - ChessNet</title>`;
  });
  $$payload.out.push(`<div class="min-h-screen bg-slate-900 text-slate-100"><div class="bg-slate-800/50 border-b border-slate-700/50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"><div class="flex items-center justify-between"><div class="flex items-center space-x-4"><button class="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors">`);
  Arrow_left($$payload, { class: "w-5 h-5" });
  $$payload.out.push(`<!----> <span>Volver al Dashboard</span></button></div> <div class="flex items-center space-x-3">`);
  Sparkles($$payload, { class: "w-6 h-6 text-blue-400" });
  $$payload.out.push(`<!----> <h1 class="text-2xl font-bold text-white">Upgrade de Plan</h1></div></div></div></div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`);
  if (!upgradeData) {
    $$payload.out.push("<!--[-->");
    $$payload.out.push(`<div class="text-center"><div class="text-slate-400">Cargando datos de suscripción...</div></div>`);
  } else {
    $$payload.out.push("<!--[!-->");
    const each_array = ensure_array_like([
      {
        key: "students",
        label: "Estudiantes",
        icon: Users,
        current: upgradeData.usage_stats.students_count,
        max: upgradeData.user_limits.max_students
      },
      {
        key: "classes",
        label: "Clases",
        icon: School,
        current: upgradeData.usage_stats.classes_count,
        max: upgradeData.user_limits.max_classes
      },
      {
        key: "colleges",
        label: "Centros",
        icon: School,
        current: upgradeData.usage_stats.colleges_count,
        max: upgradeData.user_limits.max_colleges
      },
      {
        key: "tournaments",
        label: "Torneos",
        icon: Trophy,
        current: upgradeData.usage_stats.tournaments_count,
        max: upgradeData.user_limits.max_tournaments
      },
      {
        key: "storage",
        label: "Almacenamiento",
        icon: Hard_drive,
        current: upgradeData.usage_stats.storage_used_mb,
        max: upgradeData.user_limits.max_storage_mb
      },
      {
        key: "skills",
        label: "Skills Custom",
        icon: Target,
        current: upgradeData.usage_stats.custom_skills_count,
        max: upgradeData.user_limits.max_custom_skills
      }
    ]);
    const each_array_1 = ensure_array_like(upgradeData.available_plans);
    $$payload.out.push(`<div class="mb-8"><h2 class="text-xl font-semibold text-white mb-4">Tu Uso Actual</h2> <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"><!--[-->`);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let stat = each_array[$$index];
      $$payload.out.push(`<div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"><div class="flex items-center space-x-2 mb-2"><!---->`);
      stat.icon?.($$payload, { class: "w-4 h-4 text-slate-400" });
      $$payload.out.push(`<!----> <span class="text-sm text-slate-400">${escape_html(stat.label)}</span></div> <div class="text-lg font-semibold text-white">${escape_html(stat.current)}${escape_html(stat.max === -1 ? "" : `/${stat.max}`)}</div> `);
      if (stat.max !== -1) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="w-full bg-slate-700 rounded-full h-1.5 mt-2"><div class="bg-blue-400 h-1.5 rounded-full transition-all"${attr_style(`width: ${stringify(getUsagePercentage(stat.current, stat.max))}%`)}></div></div> <div${attr_class(`text-xs ${stringify(getUsageColor(getUsagePercentage(stat.current, stat.max)))} mt-1`)}>${escape_html(getUsagePercentage(stat.current, stat.max).toFixed(0))}% usado</div>`);
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`<div class="text-xs text-green-400 mt-1">Ilimitado</div>`);
      }
      $$payload.out.push(`<!--]--></div>`);
    }
    $$payload.out.push(`<!--]--></div></div> <div class="mb-8"><h2 class="text-xl font-semibold text-white mb-6 text-center">Elige tu Plan</h2> <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"><!--[-->`);
    for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
      let plan = each_array_1[$$index_2];
      const IconComponent = getPlanIcon(plan.name);
      const each_array_2 = ensure_array_like(plan.features);
      $$payload.out.push(`<div class="relative">`);
      if (isPopularPlan(plan.name)) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10"><div class="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">Más Popular</div></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--> <div${attr_class(`card ${stringify(getPlanColor(plan.name))} relative overflow-hidden`)}>`);
      if (isCurrentPlan(plan.name)) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="absolute top-4 right-4"><div class="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">Plan Actual</div></div>`);
      } else {
        $$payload.out.push("<!--[!-->");
      }
      $$payload.out.push(`<!--]--> <div class="text-center mb-6"><div class="flex justify-center mb-3"><div class="p-3 bg-slate-700/50 rounded-full"><!---->`);
      IconComponent?.($$payload, { class: "w-8 h-8 text-blue-400" });
      $$payload.out.push(`<!----></div></div> <h3 class="text-xl font-bold text-white mb-2">${escape_html(plan.display_name)}</h3> <p class="text-slate-400 text-sm mb-4">${escape_html(plan.description)}</p> <div class="mb-4">`);
      if (plan.price_annual === 0) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<div class="text-3xl font-bold text-green-400">Gratuito</div>`);
      } else {
        $$payload.out.push("<!--[!-->");
        $$payload.out.push(`<div class="text-3xl font-bold text-white">${escape_html(formatPrice(plan.price_annual))} <span class="text-lg font-normal text-slate-400">/año</span></div> <div class="text-sm text-slate-400">Solo ${escape_html(formatPrice(plan.price_annual / 12))}/mes</div>`);
      }
      $$payload.out.push(`<!--]--></div></div> <div class="mb-6"><h4 class="text-sm font-semibold text-slate-300 mb-3">Características:</h4> <ul class="space-y-2"><!--[-->`);
      for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
        let feature = each_array_2[$$index_1];
        $$payload.out.push(`<li class="flex items-start space-x-2">`);
        Check($$payload, { class: "w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" });
        $$payload.out.push(`<!----> <span class="text-sm text-slate-300">${escape_html(feature)}</span></li>`);
      }
      $$payload.out.push(`<!--]--></ul></div> <div class="mb-6"><h4 class="text-sm font-semibold text-slate-300 mb-3">Límites:</h4> <div class="grid grid-cols-2 gap-2 text-xs"><div class="text-slate-400"><span class="font-medium">Estudiantes:</span> ${escape_html(plan.max_students === -1 ? "Ilimitados" : plan.max_students)}</div> <div class="text-slate-400"><span class="font-medium">Clases:</span> ${escape_html(plan.max_classes === -1 ? "Ilimitadas" : plan.max_classes)}</div> <div class="text-slate-400"><span class="font-medium">Centros:</span> ${escape_html(plan.max_colleges === -1 ? "Ilimitados" : plan.max_colleges)}</div> <div class="text-slate-400"><span class="font-medium">Torneos:</span> ${escape_html(plan.max_tournaments === -1 ? "Ilimitados" : plan.max_tournaments)}</div></div></div> <div class="mt-auto">`);
      if (isCurrentPlan(plan.name)) {
        $$payload.out.push("<!--[-->");
        $$payload.out.push(`<button disabled class="w-full py-3 bg-slate-600 text-slate-400 rounded-lg font-medium cursor-not-allowed">Plan Actual</button>`);
      } else {
        $$payload.out.push("<!--[!-->");
        if (plan.name === "free") {
          $$payload.out.push("<!--[-->");
          $$payload.out.push(`<button disabled class="w-full py-3 bg-slate-700 text-slate-400 rounded-lg font-medium cursor-not-allowed">No se puede downgrade</button>`);
        } else {
          $$payload.out.push("<!--[!-->");
          $$payload.out.push(`<button${attr("disabled", isUpgrading, true)} class="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">`);
          {
            $$payload.out.push("<!--[!-->");
            Zap($$payload, { class: "w-4 h-4" });
            $$payload.out.push(`<!----> <span>Upgrade Ahora</span>`);
          }
          $$payload.out.push(`<!--]--></button>`);
        }
        $$payload.out.push(`<!--]-->`);
      }
      $$payload.out.push(`<!--]--></div></div></div>`);
    }
    $$payload.out.push(`<!--]--></div></div> <div class="max-w-3xl mx-auto"><h2 class="text-xl font-semibold text-white mb-6 text-center">Preguntas Frecuentes</h2> <div class="space-y-4"><div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"><h3 class="font-medium text-white mb-2">¿Puedo cambiar de plan en cualquier momento?</h3> <p class="text-slate-400 text-sm">Sí, puedes hacer upgrade en cualquier momento. Los downgrades se aplicarán al final del período de facturación actual.</p></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"><h3 class="font-medium text-white mb-2">¿Qué pasa si supero los límites de mi plan?</h3> <p class="text-slate-400 text-sm">Te notificaremos cuando te acerques a los límites y te daremos la opción de hacer upgrade antes de que se bloqueen las funcionalidades.</p></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"><h3 class="font-medium text-white mb-2">¿Hay descuentos por pago anual?</h3> <p class="text-slate-400 text-sm">¡Sí! Todos nuestros precios ya incluyen un descuento significativo por pago anual comparado con planes mensuales.</p></div> <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"><h3 class="font-medium text-white mb-2">¿Puedo cancelar en cualquier momento?</h3> <p class="text-slate-400 text-sm">Por supuesto. Puedes cancelar tu suscripción en cualquier momento y seguirás teniendo acceso hasta el final del período pagado.</p></div></div></div>`);
  }
  $$payload.out.push(`<!--]--></div></div>`);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
