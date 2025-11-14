import * as server from '../entries/pages/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.CgMEx3tG.js","_app/immutable/chunks/XcqJ2fRq.js","_app/immutable/chunks/D3mFRmBv.js","_app/immutable/chunks/B_cg0bLn.js"];
export const stylesheets = [];
export const fonts = [];
