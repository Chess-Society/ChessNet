import{c as ce,a as l,f as p,t as q}from"../chunks/XcqJ2fRq.js";import"../chunks/B_cg0bLn.js";import{f as A,p as ve,l as me,b as pe,a as fe,d as ue,aJ as _e,c as e,s as c,g as s,m as z,r as t,e as m,h as xe,t as G,u as E,n as J}from"../chunks/D3mFRmBv.js";import{s as V}from"../chunks/Cx3jsHvJ.js";import{i as b}from"../chunks/e-6vUUpC.js";import{I as ge,a as B}from"../chunks/BJ0OSh68.js";import{e as L}from"../chunks/BdNEL7Gq.js";import{i as he}from"../chunks/BmBHHck_.js";import{l as be,s as we,p as ye}from"../chunks/BBsIh7Kw.js";import{s as $e,a as Ce}from"../chunks/DunMdFG0.js";import{p as ke}from"../chunks/C_RQASWt.js";import{g as Se}from"../chunks/C4nH6oDz.js";import{U as je}from"../chunks/Dj7XNvy4.js";import{C as Me}from"../chunks/C0T6L6h5.js";function Oe(w,v){const f=be(v,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.542.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const y=[["path",{d:"m16 17 5-5-5-5"}],["path",{d:"M21 12H9"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"}]];ge(w,we({name:"log-out"},()=>f,{get iconNode(){return y},children:($,d)=>{var u=ce(),i=A(u);B(i,v,"default",{}),l($,u)},$$slots:{default:!0}}))}const We=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"}));var Ue=p('<div class="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent"></div> <span class="text-sm text-slate-300">Cerrando sesión...</span>',1),ze=p('<!> <span class="text-sm text-slate-300">Cerrar Sesión</span>',1),Ee=p('<div class="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700/50 rounded-lg shadow-lg py-1 z-50"><div class="px-4 py-2 border-b border-slate-700/50"><div class="text-sm font-medium text-white truncate"> </div> <div class="text-xs text-slate-400"><!></div></div> <button class="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><!></button></div>'),Le=p('<div class="relative user-menu"><button class="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"><div class="p-1 bg-slate-600/50 rounded-full"><!></div> <span class="text-sm text-slate-300 max-w-32 truncate"> </span> <!></button> <!></div>'),Ne=p('<div class="text-sm text-slate-400">No autenticado</div>'),Ie=p('<div class="min-h-screen bg-slate-900"><header class="bg-slate-800/50 border-b border-slate-700/50 sticky top-0 z-40"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center h-16"><div class="flex items-center space-x-3"><div class="text-xl font-bold text-white">ChessNet</div> <div class="text-sm text-slate-400">Sistema de Gestión</div></div> <div class="flex items-center space-x-4"><!></div></div></div></header> <main><!></main></div>');function Xe(w,v){ve(v,!1);const f=()=>Ce(ke,"$page",y),[y,$]=$e(),d=z();let u=ye(v,"data",8),i=z(!1),_=z(!1);const D=async()=>{if(!s(_)){m(_,!0);try{console.log("🚪 Iniciando cierre de sesión...");const o=await(await fetch("/logout",{method:"POST",headers:{"Content-Type":"application/json"}})).json();o.success?(console.log("✅ Sesión cerrada exitosamente"),Se("/login")):(console.error("❌ Error al cerrar sesión:",o),alert("Error al cerrar sesión"))}catch(r){console.error("❌ Error al cerrar sesión:",r),alert("Error al cerrar sesión")}finally{m(_,!1),m(i,!1)}}},F=r=>{r.target.closest(".user-menu")||m(i,!1)};me(()=>ue(u()),()=>{m(d,u().user)}),pe(),he();var C=Ie();L("click",_e,F);var k=e(C),N=e(k),I=e(N),P=c(e(I),2),K=e(P);{var Q=r=>{var o=Le(),g=e(o),S=e(g),X=e(S);je(X,{class:"w-4 h-4 text-slate-300"}),t(S);var j=c(S,2),Y=e(j,!0);t(j);var Z=c(j,2);{let x=xe(()=>s(i)?"rotate-180":"");Me(Z,{get class(){return`w-4 h-4 text-slate-400 transition-transform ${s(x)??""}`}})}t(g);var ee=c(g,2);{var te=x=>{var M=Ee(),O=e(M),U=e(O),ae=e(U,!0);t(U);var H=c(U,2),se=e(H);{var re=a=>{var n=q("Modo Local");l(a,n)},oe=a=>{var n=q("Conectado");l(a,n)};b(se,a=>{f(),E(()=>f().url.hostname==="localhost"||f().url.hostname==="127.0.0.1")?a(re):a(oe,!1)})}t(H),t(O);var h=c(O,2),le=e(h);{var ie=a=>{var n=Ue();J(2),l(a,n)},ne=a=>{var n=ze(),de=A(n);Oe(de,{class:"w-4 h-4 text-red-400"}),J(2),l(a,n)};b(le,a=>{s(_)?a(ie):a(ne,!1)})}t(h),t(M),G(()=>{V(ae,(s(d),E(()=>s(d).email||"Usuario"))),h.disabled=s(_)}),L("click",h,D),l(x,M)};b(ee,x=>{s(i)&&x(te)})}t(o),G(()=>V(Y,(s(d),E(()=>s(d).email||"Usuario")))),L("click",g,()=>m(i,!s(i))),l(r,o)},R=r=>{var o=Ne();l(r,o)};b(K,r=>{s(d)?r(Q):r(R,!1)})}t(P),t(I),t(N),t(k);var T=c(k,2),W=e(T);B(W,v,"default",{}),t(T),t(C),l(w,C),fe(),$()}export{Xe as component,We as universal};
