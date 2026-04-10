import{f as $,a as _}from"../chunks/BZehMmYk.js";import{i as S}from"../chunks/CRtqaoAm.js";import{p as L,o as R,t as y,a as G,e as M,s as i,c as o,b as l,x as u,$ as U,r as s,n as P,g as v}from"../chunks/DszD4bRL.js";import{s as f}from"../chunks/BmnrYep1.js";import{h as W}from"../chunks/BUbufpFC.js";var j=$('<div class="min-h-screen bg-slate-900 p-8"><div class="max-w-4xl mx-auto"><h1 class="text-3xl font-bold text-white mb-8">🔍 Debug de Cookies</h1> <div class="bg-slate-800 rounded-lg p-6 mb-6"><h2 class="text-xl font-semibold text-white mb-4">Información General</h2> <pre class="text-green-400 text-sm whitespace-pre-wrap"> </pre></div> <div class="bg-slate-800 rounded-lg p-6 mb-6"><h2 class="text-xl font-semibold text-white mb-4">Análisis de Timing</h2> <pre class="text-yellow-400 text-sm whitespace-pre-wrap"> </pre></div> <div class="bg-slate-800 rounded-lg p-6 mb-6"><h2 class="text-xl font-semibold text-white mb-4">Cookies Detalladas</h2> <pre class="text-blue-400 text-sm whitespace-pre-wrap"> </pre></div> <div class="bg-slate-800 rounded-lg p-6"><h2 class="text-xl font-semibold text-white mb-4">Instrucciones</h2> <ol class="text-slate-300 space-y-2"><li>1. Abre DevTools → Console</li> <li>2. Recarga esta página</li> <li>3. Copia todos los logs que empiecen con 🍪</li> <li>4. Envíame esos logs para análisis</li></ol></div></div></div>');function F(N,O){L(O,!1);let n=u("Iniciando diagnóstico..."),x=u(""),r=u("");R(()=>{try{console.log("🔍 DEBUG PAGE - Análisis completo de cookies");const t=document.cookie;console.log("🍪 document.cookie INMEDIATO:",t);const a=document.cookie.split(";").map(e=>e.trim()).filter(e=>e!=="");console.log("🍪 Cookies parseadas:",a);const p=a.filter(e=>e.startsWith("sb-"));console.log("🍪 Cookies sb-*:",p);const g=a.find(e=>e.startsWith("sb-access-token")),h=a.find(e=>e.startsWith("sb-refresh-token"));if(g){const[e,b]=g.split("=");console.log("🔑 Access Token - Name:",e,"Value length:",b?.length)}if(h){const[e,b]=h.split("=");console.log("🔄 Refresh Token - Name:",e,"Value length:",b?.length)}console.log("🌐 User Agent:",navigator.userAgent),console.log("🌐 Location:",window.location.href),console.log("🌐 Domain:",window.location.hostname),l(n,`
ANÁLISIS COMPLETO:
- Total cookies: ${a.length}
- Cookies sb-*: ${p.length}
- Access Token: ${g?"ENCONTRADO":"NO ENCONTRADO"}
- Refresh Token: ${h?"ENCONTRADO":"NO ENCONTRADO"}
- document.cookie: "${t}"
      `.trim()),l(x,`
COOKIES DETALLADAS:
${a.map(e=>`- ${e}`).join(`
`)}

COOKIES SB-*:
${p.map(e=>`- ${e}`).join(`
`)}
      `.trim()),setTimeout(()=>{const e=document.cookie;console.log("🍪 document.cookie DESPUÉS de 1s:",e),e!==t?(console.log("⚠️ Las cookies cambiaron después de 1 segundo"),l(r,"⚠️ TIMING ISSUE: Las cookies cambiaron después de 1s")):l(r,"✅ No hay problema de timing")},1e3)}catch(t){console.error("❌ Error en debug:",t),l(n,`❌ Error: ${t.message}`)}}),S();var c=j();W("1cmtigg",t=>{M(()=>{U.title="Debug - ChessNet"})});var k=o(c),m=i(o(k),2),C=i(o(m),2),E=o(C,!0);s(C),s(m);var d=i(m,2),A=i(o(d),2),D=o(A,!0);s(A),s(d);var T=i(d,2),w=i(o(T),2),I=o(w,!0);s(w),s(T),P(2),s(k),s(c),y(()=>{f(E,v(n)),f(D,v(r)),f(I,v(x))}),_(N,c),G()}export{F as component};
