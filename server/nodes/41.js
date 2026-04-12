import * as server from '../entries/pages/panel/torneos/_tournamentId_/_page.server.ts.js';

export const index = 41;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/panel/torneos/_tournamentId_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/panel/torneos/[tournamentId]/+page.server.ts";
export const imports = ["_app/immutable/nodes/41._a0LY5d-.js","_app/immutable/chunks/0MC4xOQl.js","_app/immutable/chunks/BIYOSaNE.js","_app/immutable/chunks/C0EKSxHY.js","_app/immutable/chunks/2eyeOJhG.js","_app/immutable/chunks/B6ACea8n.js","_app/immutable/chunks/fae6lLt6.js","_app/immutable/chunks/Cc6KLJKQ.js","_app/immutable/chunks/BUCQEZ4L.js","_app/immutable/chunks/D_FzZ_Fc.js","_app/immutable/chunks/DlekFfjM.js","_app/immutable/chunks/CPDqQ9Ql.js","_app/immutable/chunks/b1q8FOrj.js","_app/immutable/chunks/CPStrXhq.js","_app/immutable/chunks/Ddg2OEXD.js","_app/immutable/chunks/CLgGSP2l.js","_app/immutable/chunks/HEdatSQG.js","_app/immutable/chunks/Ch-atjY8.js","_app/immutable/chunks/DSJQCdIV.js","_app/immutable/chunks/BUuXkRWy.js","_app/immutable/chunks/BeW1mfF0.js","_app/immutable/chunks/DbqVL5MC.js"];
export const stylesheets = ["_app/immutable/assets/41.DxdbrT00.css"];
export const fonts = [];
