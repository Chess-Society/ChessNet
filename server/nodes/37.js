import * as server from '../entries/pages/panel/pagos/_page.server.ts.js';

export const index = 37;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/panel/pagos/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/panel/pagos/+page.server.ts";
export const imports = ["_app/immutable/nodes/37.DOOApWqs.js","_app/immutable/chunks/0MC4xOQl.js","_app/immutable/chunks/BIYOSaNE.js","_app/immutable/chunks/C0EKSxHY.js","_app/immutable/chunks/2eyeOJhG.js","_app/immutable/chunks/B6ACea8n.js","_app/immutable/chunks/fae6lLt6.js","_app/immutable/chunks/Cc6KLJKQ.js","_app/immutable/chunks/BUCQEZ4L.js","_app/immutable/chunks/CuI5zyMQ.js","_app/immutable/chunks/b1q8FOrj.js","_app/immutable/chunks/CPStrXhq.js","_app/immutable/chunks/BvJu0QXf.js","_app/immutable/chunks/C3rWd286.js","_app/immutable/chunks/B9Jx4_Ts.js","_app/immutable/chunks/D1jA7bbO.js","_app/immutable/chunks/CcNl8ktO.js","_app/immutable/chunks/D_qI-t-n.js"];
export const stylesheets = [];
export const fonts = [];
