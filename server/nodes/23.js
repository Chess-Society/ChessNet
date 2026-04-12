import * as server from '../entries/pages/panel/clases/_page.server.ts.js';

export const index = 23;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/panel/clases/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/panel/clases/+page.server.ts";
export const imports = ["_app/immutable/nodes/23.Ct_KAxaA.js","_app/immutable/chunks/0MC4xOQl.js","_app/immutable/chunks/BIYOSaNE.js","_app/immutable/chunks/C0EKSxHY.js","_app/immutable/chunks/2eyeOJhG.js","_app/immutable/chunks/B6ACea8n.js","_app/immutable/chunks/fae6lLt6.js","_app/immutable/chunks/Cc6KLJKQ.js","_app/immutable/chunks/BUCQEZ4L.js","_app/immutable/chunks/CuI5zyMQ.js","_app/immutable/chunks/D_FzZ_Fc.js","_app/immutable/chunks/DlekFfjM.js","_app/immutable/chunks/CPDqQ9Ql.js","_app/immutable/chunks/b1q8FOrj.js","_app/immutable/chunks/CPStrXhq.js","_app/immutable/chunks/DOXeY487.js","_app/immutable/chunks/C3rWd286.js","_app/immutable/chunks/CcNl8ktO.js","_app/immutable/chunks/BURgM3Pn.js","_app/immutable/chunks/CcDQY4rZ.js","_app/immutable/chunks/jh0L_z3_.js","_app/immutable/chunks/BEBZHHC_.js","_app/immutable/chunks/YSUXitgx.js"];
export const stylesheets = [];
export const fonts = [];
