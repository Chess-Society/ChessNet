import * as server from '../entries/pages/debug/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/debug/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/debug/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.BwtXb6on.js","_app/immutable/chunks/0MC4xOQl.js","_app/immutable/chunks/BUCQEZ4L.js","_app/immutable/chunks/fae6lLt6.js"];
export const stylesheets = [];
export const fonts = [];
