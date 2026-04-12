import * as server from '../entries/pages/debug-auth/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/debug-auth/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/debug-auth/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.DvC6-XHu.js","_app/immutable/chunks/0MC4xOQl.js","_app/immutable/chunks/BUCQEZ4L.js","_app/immutable/chunks/BIYOSaNE.js","_app/immutable/chunks/2eyeOJhG.js","_app/immutable/chunks/fae6lLt6.js","_app/immutable/chunks/D_FzZ_Fc.js","_app/immutable/chunks/DlekFfjM.js","_app/immutable/chunks/C0EKSxHY.js","_app/immutable/chunks/CPDqQ9Ql.js"];
export const stylesheets = [];
export const fonts = [];
