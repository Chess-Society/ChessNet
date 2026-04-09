import{c as D,a as j,f as R,h as F}from"../chunks/B37GFagT.js";import"../chunks/oe7eaGRK.js";import{f as G,p as J,l as $,e as K,t as N,k as O,g as e,j as t,o as w,$ as Q,u as a,s as n,v as p,z as y}from"../chunks/Bpv75Ngb.js";import{e as P,s as E}from"../chunks/C9ZkF2k7.js";import{i as U}from"../chunks/D3nlvN1e.js";import{i as V}from"../chunks/C7kAYM6E.js";import{s as W,a as X}from"../chunks/CEgkY6kx.js";import{p as Y}from"../chunks/2G1FpQsh.js";import{R as Z}from"../chunks/BT5XsZxg.js";import{I as ee,s as ae}from"../chunks/CGvoXjMf.js";import{l as te,s as se}from"../chunks/QBEKSanO.js";import{T as re}from"../chunks/bNXit1nt.js";function oe(v,l){const r=te(l,["children","$$slots","$$events","$$legacy"]);/**
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
 */const m=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}]];ee(v,se({name:"house"},()=>r,{get iconNode(){return m},children:(f,i)=>{var s=D(),o=G(s);ae(o,l,"default",{}),j(f,s)},$$slots:{default:!0}}))}var ie=R('<div class="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4 mb-6"><div class="flex items-center gap-2 text-yellow-400 mb-2"><!> <span class="font-medium">Error de configuración</span></div> <p class="text-sm text-yellow-200">El sitio necesita las variables de entorno de Supabase para funcionar correctamente.</p></div>'),ne=R('<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4"><div class="max-w-md w-full text-center"><div class="bg-slate-800 rounded-2xl p-8 shadow-2xl"><div class="text-6xl font-bold text-red-500 mb-4"> </div> <h1 class="text-2xl font-bold text-white mb-4"> </h1> <p class="text-slate-300 mb-8"> </p> <!> <div class="space-y-4"><button class="w-full btn-primary flex items-center justify-center gap-2"><!> Recargar página</button> <button class="w-full btn-secondary flex items-center justify-center gap-2"><!> Ir al inicio</button></div></div></div></div>');function xe(v,l){J(l,!1);const r=()=>X(Y,"$page",m),[m,f]=W(),i=w(),s=w(),o=w();$(()=>r(),()=>{y(i,r().status)}),$(()=>r(),()=>{y(s,r().error?.message||"Ha ocurrido un error inesperado")}),$(()=>t(s),()=>{y(o,t(s).includes("Missing Supabase environment variables"))}),K(),V();var u=ne();F(d=>{N(()=>Q.title=`Error ${t(i)??""} - ChessNet`)});var k=e(u),z=e(k),_=e(z),S=e(_,!0);a(_);var g=n(_,2),C=e(g,!0);a(g);var b=n(g,2),T=e(b,!0);a(b);var H=n(b,2);{var A=d=>{var x=ie(),M=e(x),B=e(M);re(B,{class:"w-4 h-4"}),p(2),a(M),p(2),a(x),j(d,x)};U(H,d=>{t(o)&&d(A)})}var I=n(H,2),c=e(I),L=e(c);Z(L,{class:"w-4 h-4"}),p(),a(c);var h=n(c,2),q=e(h);oe(q,{class:"w-4 h-4"}),p(),a(h),a(I),a(z),a(k),a(u),N(()=>{E(S,t(i)),E(C,t(i)===404?"Página no encontrada":t(o)?"Error de configuración":"Error del servidor"),E(T,t(o)?"Las variables de entorno de Supabase no están configuradas correctamente. Por favor, contacta al administrador.":t(s))}),P("click",c,()=>window.location.reload()),P("click",h,()=>window.location.href="/"),j(v,u),O(),f()}export{xe as component};
