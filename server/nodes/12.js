import * as server from '../entries/pages/panel/_page.server.ts.js';

export const index = 12;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/panel/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/panel/+page.server.ts";
export const imports = ["_app/immutable/nodes/12.CF92H4ba.js","_app/immutable/chunks/0MC4xOQl.js","_app/immutable/chunks/BIYOSaNE.js","_app/immutable/chunks/C0EKSxHY.js","_app/immutable/chunks/2eyeOJhG.js","_app/immutable/chunks/CPDqQ9Ql.js","_app/immutable/chunks/B6ACea8n.js","_app/immutable/chunks/fae6lLt6.js","_app/immutable/chunks/Cc6KLJKQ.js","_app/immutable/chunks/BUCQEZ4L.js","_app/immutable/chunks/D_FzZ_Fc.js","_app/immutable/chunks/DlekFfjM.js","_app/immutable/chunks/b1q8FOrj.js","_app/immutable/chunks/CPStrXhq.js","_app/immutable/chunks/jh0L_z3_.js","_app/immutable/chunks/B9Jx4_Ts.js","_app/immutable/chunks/BvJu0QXf.js","_app/immutable/chunks/BEBZHHC_.js","_app/immutable/chunks/BNoXZ-M5.js","_app/immutable/chunks/C6oCK9lb.js","_app/immutable/chunks/SUUL4bNi.js","_app/immutable/chunks/DOXeY487.js","_app/immutable/chunks/DbqVL5MC.js","_app/immutable/chunks/ZZ2cUJ8L.js","_app/immutable/chunks/ZgVhdR3i.js","_app/immutable/chunks/DErjtamf.js","_app/immutable/chunks/C3rWd286.js"];
export const stylesheets = ["_app/immutable/assets/12.AYIAKST2.css"];
export const fonts = [];
