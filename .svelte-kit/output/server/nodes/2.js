import * as universal from '../entries/pages/(app)/_layout.ts.js';
import * as server from '../entries/pages/(app)/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/(app)/+layout.ts";
export { server };
export const server_id = "src/routes/(app)/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.DcDPLfzr.js","_app/immutable/chunks/XcqJ2fRq.js","_app/immutable/chunks/D3mFRmBv.js","_app/immutable/chunks/B_cg0bLn.js","_app/immutable/chunks/Cx3jsHvJ.js","_app/immutable/chunks/BdNEL7Gq.js","_app/immutable/chunks/e-6vUUpC.js","_app/immutable/chunks/BJ0OSh68.js","_app/immutable/chunks/CKcKJG6V.js","_app/immutable/chunks/BmBHHck_.js","_app/immutable/chunks/BBsIh7Kw.js","_app/immutable/chunks/DunMdFG0.js","_app/immutable/chunks/YexrlwXk.js","_app/immutable/chunks/C_RQASWt.js","_app/immutable/chunks/C4nH6oDz.js","_app/immutable/chunks/Dj7XNvy4.js","_app/immutable/chunks/C0T6L6h5.js"];
export const stylesheets = [];
export const fonts = [];
