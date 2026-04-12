import * as server from '../entries/pages/panel/informes/_page.server.ts.js';

export const index = 34;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/panel/informes/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/panel/informes/+page.server.ts";
export const imports = ["_app/immutable/nodes/34.CcNgFhi5.js","_app/immutable/chunks/0MC4xOQl.js","_app/immutable/chunks/BIYOSaNE.js","_app/immutable/chunks/C0EKSxHY.js","_app/immutable/chunks/2eyeOJhG.js","_app/immutable/chunks/B6ACea8n.js","_app/immutable/chunks/fae6lLt6.js","_app/immutable/chunks/Cc6KLJKQ.js","_app/immutable/chunks/BUCQEZ4L.js","_app/immutable/chunks/b1q8FOrj.js","_app/immutable/chunks/CPStrXhq.js","_app/immutable/chunks/DErjtamf.js","_app/immutable/chunks/B9Jx4_Ts.js","_app/immutable/chunks/D1jA7bbO.js","_app/immutable/chunks/BEBZHHC_.js"];
export const stylesheets = [];
export const fonts = [];
