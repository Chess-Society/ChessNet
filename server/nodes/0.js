import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "load": null,
  "prerender": false,
  "ssr": false,
  "trailingSlash": "always"
};
export const universal_id = "src/routes/+layout.js";
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.nkoDPx5K.js","_app/immutable/chunks/0MC4xOQl.js","_app/immutable/chunks/C55OLQlh.js","_app/immutable/chunks/BIYOSaNE.js","_app/immutable/chunks/BUCQEZ4L.js","_app/immutable/chunks/2eyeOJhG.js","_app/immutable/chunks/CPDqQ9Ql.js","_app/immutable/chunks/Cc6KLJKQ.js","_app/immutable/chunks/DwqS1WSN.js","_app/immutable/chunks/EgOe4qld.js","_app/immutable/chunks/Bnc-bXrq.js","_app/immutable/chunks/ByHdDyoQ.js","_app/immutable/chunks/Bm_YTN_r.js","_app/immutable/chunks/ZgVhdR3i.js","_app/immutable/chunks/C0EKSxHY.js","_app/immutable/chunks/D_FzZ_Fc.js","_app/immutable/chunks/DlekFfjM.js","_app/immutable/chunks/uI_K4zS_.js","_app/immutable/chunks/DjECU__t.js","_app/immutable/chunks/Cu_RswMi.js"];
export const stylesheets = ["_app/immutable/assets/0.DrNdQzEj.css"];
export const fonts = [];
