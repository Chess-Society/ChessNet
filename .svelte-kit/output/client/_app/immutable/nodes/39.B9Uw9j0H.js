import{f as Mn,h as yc,a as gn}from"../chunks/B37GFagT.js";import{p as _c,aC as dr,s as dt,t as fr,k as wc,$ as vc,g as Ie,z as ft,j as mn,u as Te,v as pt}from"../chunks/Bpv75Ngb.js";import{d as Ic,s as Tc}from"../chunks/C9ZkF2k7.js";import{i as pr}from"../chunks/D3nlvN1e.js";import{a as Ec,s as bc}from"../chunks/CEgkY6kx.js";import{p as Ac}from"../chunks/2G1FpQsh.js";import{b as ji}from"../chunks/70moWVVj.js";import{g as Sc}from"../chunks/jCKqsZiR.js";import{C as gr}from"../chunks/l3XdRQd0.js";const Cc=()=>{};var mr={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mo=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let o=n.charCodeAt(s);o<128?e[t++]=o:o<2048?(e[t++]=o>>6|192,e[t++]=o&63|128):(o&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(o=65536+((o&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=o>>18|240,e[t++]=o>>12&63|128,e[t++]=o>>6&63|128,e[t++]=o&63|128):(e[t++]=o>>12|224,e[t++]=o>>6&63|128,e[t++]=o&63|128)}return e},Pc=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const o=n[t++];if(o<128)e[s++]=String.fromCharCode(o);else if(o>191&&o<224){const c=n[t++];e[s++]=String.fromCharCode((o&31)<<6|c&63)}else if(o>239&&o<365){const c=n[t++],l=n[t++],g=n[t++],v=((o&7)<<18|(c&63)<<12|(l&63)<<6|g&63)-65536;e[s++]=String.fromCharCode(55296+(v>>10)),e[s++]=String.fromCharCode(56320+(v&1023))}else{const c=n[t++],l=n[t++];e[s++]=String.fromCharCode((o&15)<<12|(c&63)<<6|l&63)}}return e.join("")},yo={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let o=0;o<n.length;o+=3){const c=n[o],l=o+1<n.length,g=l?n[o+1]:0,v=o+2<n.length,T=v?n[o+2]:0,A=c>>2,S=(c&3)<<4|g>>4;let b=(g&15)<<2|T>>6,O=T&63;v||(O=64,l||(b=64)),s.push(t[A],t[S],t[b],t[O])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(mo(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Pc(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let o=0;o<n.length;){const c=t[n.charAt(o++)],g=o<n.length?t[n.charAt(o)]:0;++o;const T=o<n.length?t[n.charAt(o)]:64;++o;const S=o<n.length?t[n.charAt(o)]:64;if(++o,c==null||g==null||T==null||S==null)throw new kc;const b=c<<2|g>>4;if(s.push(b),T!==64){const O=g<<4&240|T>>2;if(s.push(O),S!==64){const L=T<<6&192|S;s.push(L)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class kc extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Rc=function(n){const e=mo(n);return yo.encodeByteArray(e,!0)},An=function(n){return Rc(n).replace(/\./g,"")},_o=function(n){try{return yo.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dc(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nc=()=>Dc().__FIREBASE_DEFAULTS__,Oc=()=>{if(typeof process>"u"||typeof mr>"u")return;const n=mr.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Lc=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&_o(n[1]);return e&&JSON.parse(e)},Bi=()=>{try{return Cc()||Nc()||Oc()||Lc()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},wo=n=>Bi()?.emulatorHosts?.[n],Mc=n=>{const e=wo(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},vo=()=>Bi()?.config,Io=n=>Bi()?.[`_${n}`];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xc{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jt(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function To(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uc(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",o=n.iat||0,c=n.sub||n.user_id;if(!c)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const l={iss:`https://securetoken.google.com/${s}`,aud:s,iat:o,exp:o+3600,auth_time:o,sub:c,user_id:c,firebase:{sign_in_provider:"custom",identities:{}},...n};return[An(JSON.stringify(t)),An(JSON.stringify(l)),""].join(".")}const jt={};function Fc(){const n={prod:[],emulator:[]};for(const e of Object.keys(jt))jt[e]?n.emulator.push(e):n.prod.push(e);return n}function Vc(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let yr=!1;function Eo(n,e){if(typeof window>"u"||typeof document>"u"||!Jt(window.location.host)||jt[n]===e||jt[n]||yr)return;jt[n]=e;function t(b){return`__firebase__banner__${b}`}const s="__firebase__banner",c=Fc().prod.length>0;function l(){const b=document.getElementById(s);b&&b.remove()}function g(b){b.style.display="flex",b.style.background="#7faaf0",b.style.position="fixed",b.style.bottom="5px",b.style.left="5px",b.style.padding=".5em",b.style.borderRadius="5px",b.style.alignItems="center"}function v(b,O){b.setAttribute("width","24"),b.setAttribute("id",O),b.setAttribute("height","24"),b.setAttribute("viewBox","0 0 24 24"),b.setAttribute("fill","none"),b.style.marginLeft="-6px"}function T(){const b=document.createElement("span");return b.style.cursor="pointer",b.style.marginLeft="16px",b.style.fontSize="24px",b.innerHTML=" &times;",b.onclick=()=>{yr=!0,l()},b}function A(b,O){b.setAttribute("id",O),b.innerText="Learn more",b.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",b.setAttribute("target","__blank"),b.style.paddingLeft="5px",b.style.textDecoration="underline"}function S(){const b=Vc(s),O=t("text"),L=document.getElementById(O)||document.createElement("span"),F=t("learnmore"),x=document.getElementById(F)||document.createElement("a"),z=t("preprendIcon"),G=document.getElementById(z)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(b.created){const ee=b.element;g(ee),A(x,F);const j=T();v(G,z),ee.append(G,L,x,j),document.body.appendChild(ee)}c?(L.innerText="Preview backend disconnected.",G.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(G.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,L.innerText="Preview backend running in this workspace."),L.setAttribute("id",O)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",S):S()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Z(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function jc(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Z())}function Bc(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function $i(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function $c(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Hc(){const n=Z();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Hi(){try{return typeof indexedDB=="object"}catch{return!1}}function zi(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(s);o.onsuccess=()=>{o.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},o.onupgradeneeded=()=>{t=!1},o.onerror=()=>{e(o.error?.message||"")}}catch(t){e(t)}})}function bo(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zc="FirebaseError";class ue extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=zc,Object.setPrototypeOf(this,ue.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ot.prototype.create)}}class ot{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},o=`${this.service}/${e}`,c=this.errors[e],l=c?Gc(c,s):"Error",g=`${this.serviceName}: ${l} (${o}).`;return new ue(o,g,s)}}function Gc(n,e){return n.replace(Wc,(t,s)=>{const o=e[s];return o!=null?String(o):`<${s}?>`})}const Wc=/\{\$([^}]+)}/g;function qc(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Be(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const o of t){if(!s.includes(o))return!1;const c=n[o],l=e[o];if(_r(c)&&_r(l)){if(!Be(c,l))return!1}else if(c!==l)return!1}for(const o of s)if(!t.includes(o))return!1;return!0}function _r(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xt(n){const e=[];for(const[t,s]of Object.entries(n))Array.isArray(s)?s.forEach(o=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function Kc(n,e){const t=new Jc(n,e);return t.subscribe.bind(t)}class Jc{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,s){let o;if(e===void 0&&t===void 0&&s===void 0)throw new Error("Missing Observer.");Xc(e,["next","error","complete"])?o=e:o={next:e,error:t,complete:s},o.next===void 0&&(o.next=mi),o.error===void 0&&(o.error=mi),o.complete===void 0&&(o.complete=mi);const c=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),c}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Xc(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function mi(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yc=1e3,Qc=2,Zc=14400*1e3,el=.5;function wr(n,e=Yc,t=Qc){const s=e*Math.pow(t,n),o=Math.round(el*s*(Math.random()-.5)*2);return Math.min(Zc,s+o)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ve(n){return n&&n._delegate?n._delegate:n}class he{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ke="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tl{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new xc;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:t});o&&s.resolve(o)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e?.identifier),s=e?.optional??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(o){if(s)return null;throw o}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(il(e))try{this.getOrInitializeService({instanceIdentifier:Ke})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(t);try{const c=this.getOrInitializeService({instanceIdentifier:o});s.resolve(c)}catch{}}}}clearInstance(e=Ke){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ke){return this.instances.has(e)}getOptions(e=Ke){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[c,l]of this.instancesDeferred.entries()){const g=this.normalizeInstanceIdentifier(c);s===g&&l.resolve(o)}return o}onInit(e,t){const s=this.normalizeInstanceIdentifier(t),o=this.onInitCallbacks.get(s)??new Set;o.add(e),this.onInitCallbacks.set(s,o);const c=this.instances.get(s);return c&&e(c,s),()=>{o.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const o of s)try{o(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:nl(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=Ke){return this.component?this.component.multipleInstances?e:Ke:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function nl(n){return n===Ke?void 0:n}function il(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sl{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new tl(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var N;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(N||(N={}));const rl={debug:N.DEBUG,verbose:N.VERBOSE,info:N.INFO,warn:N.WARN,error:N.ERROR,silent:N.SILENT},ol=N.INFO,al={[N.DEBUG]:"log",[N.VERBOSE]:"log",[N.INFO]:"info",[N.WARN]:"warn",[N.ERROR]:"error"},cl=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),o=al[e];if(o)console[o](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class xn{constructor(e){this.name=e,this._logLevel=ol,this._logHandler=cl,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in N))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?rl[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,N.DEBUG,...e),this._logHandler(this,N.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,N.VERBOSE,...e),this._logHandler(this,N.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,N.INFO,...e),this._logHandler(this,N.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,N.WARN,...e),this._logHandler(this,N.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,N.ERROR,...e),this._logHandler(this,N.ERROR,...e)}}const ll=(n,e)=>e.some(t=>n instanceof t);let vr,Ir;function hl(){return vr||(vr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ul(){return Ir||(Ir=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ao=new WeakMap,Pi=new WeakMap,So=new WeakMap,yi=new WeakMap,Gi=new WeakMap;function dl(n){const e=new Promise((t,s)=>{const o=()=>{n.removeEventListener("success",c),n.removeEventListener("error",l)},c=()=>{t(Ve(n.result)),o()},l=()=>{s(n.error),o()};n.addEventListener("success",c),n.addEventListener("error",l)});return e.then(t=>{t instanceof IDBCursor&&Ao.set(t,n)}).catch(()=>{}),Gi.set(e,n),e}function fl(n){if(Pi.has(n))return;const e=new Promise((t,s)=>{const o=()=>{n.removeEventListener("complete",c),n.removeEventListener("error",l),n.removeEventListener("abort",l)},c=()=>{t(),o()},l=()=>{s(n.error||new DOMException("AbortError","AbortError")),o()};n.addEventListener("complete",c),n.addEventListener("error",l),n.addEventListener("abort",l)});Pi.set(n,e)}let ki={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Pi.get(n);if(e==="objectStoreNames")return n.objectStoreNames||So.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Ve(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function pl(n){ki=n(ki)}function gl(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call(_i(this),e,...t);return So.set(s,e.sort?e.sort():[e]),Ve(s)}:ul().includes(n)?function(...e){return n.apply(_i(this),e),Ve(Ao.get(this))}:function(...e){return Ve(n.apply(_i(this),e))}}function ml(n){return typeof n=="function"?gl(n):(n instanceof IDBTransaction&&fl(n),ll(n,hl())?new Proxy(n,ki):n)}function Ve(n){if(n instanceof IDBRequest)return dl(n);if(yi.has(n))return yi.get(n);const e=ml(n);return e!==n&&(yi.set(n,e),Gi.set(e,n)),e}const _i=n=>Gi.get(n);function Co(n,e,{blocked:t,upgrade:s,blocking:o,terminated:c}={}){const l=indexedDB.open(n,e),g=Ve(l);return s&&l.addEventListener("upgradeneeded",v=>{s(Ve(l.result),v.oldVersion,v.newVersion,Ve(l.transaction),v)}),t&&l.addEventListener("blocked",v=>t(v.oldVersion,v.newVersion,v)),g.then(v=>{c&&v.addEventListener("close",()=>c()),o&&v.addEventListener("versionchange",T=>o(T.oldVersion,T.newVersion,T))}).catch(()=>{}),g}const yl=["get","getKey","getAll","getAllKeys","count"],_l=["put","add","delete","clear"],wi=new Map;function Tr(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(wi.get(e))return wi.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,o=_l.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(o||yl.includes(t)))return;const c=async function(l,...g){const v=this.transaction(l,o?"readwrite":"readonly");let T=v.store;return s&&(T=T.index(g.shift())),(await Promise.all([T[t](...g),o&&v.done]))[0]};return wi.set(e,c),c}pl(n=>({...n,get:(e,t,s)=>Tr(e,t)||n.get(e,t,s),has:(e,t)=>!!Tr(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wl{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(vl(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function vl(n){return n.getComponent()?.type==="VERSION"}const Ri="@firebase/app",Er="0.14.9";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ce=new xn("@firebase/app"),Il="@firebase/app-compat",Tl="@firebase/analytics-compat",El="@firebase/analytics",bl="@firebase/app-check-compat",Al="@firebase/app-check",Sl="@firebase/auth",Cl="@firebase/auth-compat",Pl="@firebase/database",kl="@firebase/data-connect",Rl="@firebase/database-compat",Dl="@firebase/functions",Nl="@firebase/functions-compat",Ol="@firebase/installations",Ll="@firebase/installations-compat",Ml="@firebase/messaging",xl="@firebase/messaging-compat",Ul="@firebase/performance",Fl="@firebase/performance-compat",Vl="@firebase/remote-config",jl="@firebase/remote-config-compat",Bl="@firebase/storage",$l="@firebase/storage-compat",Hl="@firebase/firestore",zl="@firebase/ai",Gl="@firebase/firestore-compat",Wl="firebase",ql="12.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Di="[DEFAULT]",Kl={[Ri]:"fire-core",[Il]:"fire-core-compat",[El]:"fire-analytics",[Tl]:"fire-analytics-compat",[Al]:"fire-app-check",[bl]:"fire-app-check-compat",[Sl]:"fire-auth",[Cl]:"fire-auth-compat",[Pl]:"fire-rtdb",[kl]:"fire-data-connect",[Rl]:"fire-rtdb-compat",[Dl]:"fire-fn",[Nl]:"fire-fn-compat",[Ol]:"fire-iid",[Ll]:"fire-iid-compat",[Ml]:"fire-fcm",[xl]:"fire-fcm-compat",[Ul]:"fire-perf",[Fl]:"fire-perf-compat",[Vl]:"fire-rc",[jl]:"fire-rc-compat",[Bl]:"fire-gcs",[$l]:"fire-gcs-compat",[Hl]:"fire-fst",[Gl]:"fire-fst-compat",[zl]:"fire-vertex","fire-js":"fire-js",[Wl]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gt=new Map,Jl=new Map,Ni=new Map;function br(n,e){try{n.container.addComponent(e)}catch(t){Ce.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function _e(n){const e=n.name;if(Ni.has(e))return Ce.debug(`There were multiple attempts to register component ${e}.`),!1;Ni.set(e,n);for(const t of Gt.values())br(t,n);for(const t of Jl.values())br(t,n);return!0}function at(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function oe(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xl={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},je=new ot("app","Firebase",Xl);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yl{constructor(e,t,s){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new he("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw je.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tt=ql;function Po(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s={name:Di,automaticDataCollectionEnabled:!0,...e},o=s.name;if(typeof o!="string"||!o)throw je.create("bad-app-name",{appName:String(o)});if(t||(t=vo()),!t)throw je.create("no-options");const c=Gt.get(o);if(c){if(Be(t,c.options)&&Be(s,c.config))return c;throw je.create("duplicate-app",{appName:o})}const l=new sl(o);for(const v of Ni.values())l.addComponent(v);const g=new Yl(t,s,l);return Gt.set(o,g),g}function Un(n=Di){const e=Gt.get(n);if(!e&&n===Di&&vo())return Po();if(!e)throw je.create("no-app",{appName:n});return e}function Ql(){return Array.from(Gt.values())}function se(n,e,t){let s=Kl[n]??n;t&&(s+=`-${t}`);const o=s.match(/\s|\//),c=e.match(/\s|\//);if(o||c){const l=[`Unable to register library "${s}" with version "${e}":`];o&&l.push(`library name "${s}" contains illegal characters (whitespace or "/")`),o&&c&&l.push("and"),c&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Ce.warn(l.join(" "));return}_e(new he(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zl="firebase-heartbeat-database",eh=1,Wt="firebase-heartbeat-store";let vi=null;function ko(){return vi||(vi=Co(Zl,eh,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Wt)}catch(t){console.warn(t)}}}}).catch(n=>{throw je.create("idb-open",{originalErrorMessage:n.message})})),vi}async function th(n){try{const t=(await ko()).transaction(Wt),s=await t.objectStore(Wt).get(Ro(n));return await t.done,s}catch(e){if(e instanceof ue)Ce.warn(e.message);else{const t=je.create("idb-get",{originalErrorMessage:e?.message});Ce.warn(t.message)}}}async function Ar(n,e){try{const s=(await ko()).transaction(Wt,"readwrite");await s.objectStore(Wt).put(e,Ro(n)),await s.done}catch(t){if(t instanceof ue)Ce.warn(t.message);else{const s=je.create("idb-set",{originalErrorMessage:t?.message});Ce.warn(s.message)}}}function Ro(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nh=1024,ih=30;class sh{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new oh(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){try{const t=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Sr();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:t}),this._heartbeatsCache.heartbeats.length>ih){const o=ah(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){Ce.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=Sr(),{heartbeatsToSend:t,unsentEntries:s}=rh(this._heartbeatsCache.heartbeats),o=An(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(e){return Ce.warn(e),""}}}function Sr(){return new Date().toISOString().substring(0,10)}function rh(n,e=nh){const t=[];let s=n.slice();for(const o of n){const c=t.find(l=>l.agent===o.agent);if(c){if(c.dates.push(o.date),Cr(t)>e){c.dates.pop();break}}else if(t.push({agent:o.agent,dates:[o.date]}),Cr(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class oh{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Hi()?zi().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await th(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Ar(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Ar(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function Cr(n){return An(JSON.stringify({version:2,heartbeats:n})).length}function ah(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let s=1;s<n.length;s++)n[s].date<t&&(t=n[s].date,e=s);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ch(n){_e(new he("platform-logger",e=>new wl(e),"PRIVATE")),_e(new he("heartbeat",e=>new sh(e),"PRIVATE")),se(Ri,Er,n),se(Ri,Er,"esm2020"),se("fire-js","")}ch("");var lh="firebase",hh="12.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */se(lh,hh,"app");function Do(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const uh=Do,No=new ot("auth","Firebase",Do());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sn=new xn("@firebase/auth");function dh(n,...e){Sn.logLevel<=N.WARN&&Sn.warn(`Auth (${Tt}): ${n}`,...e)}function vn(n,...e){Sn.logLevel<=N.ERROR&&Sn.error(`Auth (${Tt}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function we(n,...e){throw qi(n,...e)}function le(n,...e){return qi(n,...e)}function Wi(n,e,t){const s={...uh(),[e]:t};return new ot("auth","Firebase",s).create(e,{appName:n.name})}function Ze(n){return Wi(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function fh(n,e,t){const s=t;if(!(e instanceof s))throw s.name!==e.constructor.name&&we(n,"argument-error"),Wi(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function qi(n,...e){if(typeof n!="string"){const t=e[0],s=[...e.slice(1)];return s[0]&&(s[0].appName=n.name),n._errorFactory.create(t,...s)}return No.create(n,...e)}function C(n,e,...t){if(!n)throw qi(e,...t)}function Ae(n){const e="INTERNAL ASSERTION FAILED: "+n;throw vn(e),new Error(e)}function Pe(n,e){n||Ae(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oi(){return typeof self<"u"&&self.location?.href||""}function ph(){return Pr()==="http:"||Pr()==="https:"}function Pr(){return typeof self<"u"&&self.location?.protocol||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gh(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(ph()||$i()||"connection"in navigator)?navigator.onLine:!0}function mh(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt{constructor(e,t){this.shortDelay=e,this.longDelay=t,Pe(t>e,"Short delay should be less than long delay!"),this.isMobile=jc()||$c()}get(){return gh()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ki(n,e){Pe(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oo{static initialize(e,t,s){this.fetchImpl=e,t&&(this.headersImpl=t),s&&(this.responseImpl=s)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ae("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ae("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ae("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yh={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _h=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],wh=new Yt(3e4,6e4);function Ji(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function Et(n,e,t,s,o={}){return Lo(n,o,async()=>{let c={},l={};s&&(e==="GET"?l=s:c={body:JSON.stringify(s)});const g=Xt({key:n.config.apiKey,...l}).slice(1),v=await n._getAdditionalHeaders();v["Content-Type"]="application/json",n.languageCode&&(v["X-Firebase-Locale"]=n.languageCode);const T={method:e,headers:v,...c};return Bc()||(T.referrerPolicy="no-referrer"),n.emulatorConfig&&Jt(n.emulatorConfig.host)&&(T.credentials="include"),Oo.fetch()(await Mo(n,n.config.apiHost,t,g),T)})}async function Lo(n,e,t){n._canInitEmulator=!1;const s={...yh,...e};try{const o=new Ih(n),c=await Promise.race([t(),o.promise]);o.clearNetworkTimeout();const l=await c.json();if("needConfirmation"in l)throw yn(n,"account-exists-with-different-credential",l);if(c.ok&&!("errorMessage"in l))return l;{const g=c.ok?l.errorMessage:l.error.message,[v,T]=g.split(" : ");if(v==="FEDERATED_USER_ID_ALREADY_LINKED")throw yn(n,"credential-already-in-use",l);if(v==="EMAIL_EXISTS")throw yn(n,"email-already-in-use",l);if(v==="USER_DISABLED")throw yn(n,"user-disabled",l);const A=s[v]||v.toLowerCase().replace(/[_\s]+/g,"-");if(T)throw Wi(n,A,T);we(n,A)}}catch(o){if(o instanceof ue)throw o;we(n,"network-request-failed",{message:String(o)})}}async function vh(n,e,t,s,o={}){const c=await Et(n,e,t,s,o);return"mfaPendingCredential"in c&&we(n,"multi-factor-auth-required",{_serverResponse:c}),c}async function Mo(n,e,t,s){const o=`${e}${t}?${s}`,c=n,l=c.config.emulator?Ki(n.config,o):`${n.config.apiScheme}://${o}`;return _h.includes(t)&&(await c._persistenceManagerAvailable,c._getPersistenceType()==="COOKIE")?c._getPersistence()._getFinalTarget(l).toString():l}class Ih{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,s)=>{this.timer=setTimeout(()=>s(le(this.auth,"network-request-failed")),wh.get())})}}function yn(n,e,t){const s={appName:n.name};t.email&&(s.email=t.email),t.phoneNumber&&(s.phoneNumber=t.phoneNumber);const o=le(n,e,s);return o.customData._tokenResponse=t,o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Th(n,e){return Et(n,"POST","/v1/accounts:delete",e)}async function Cn(n,e){return Et(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bt(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Eh(n,e=!1){const t=ve(n),s=await t.getIdToken(e),o=Xi(s);C(o&&o.exp&&o.auth_time&&o.iat,t.auth,"internal-error");const c=typeof o.firebase=="object"?o.firebase:void 0,l=c?.sign_in_provider;return{claims:o,token:s,authTime:Bt(Ii(o.auth_time)),issuedAtTime:Bt(Ii(o.iat)),expirationTime:Bt(Ii(o.exp)),signInProvider:l||null,signInSecondFactor:c?.sign_in_second_factor||null}}function Ii(n){return Number(n)*1e3}function Xi(n){const[e,t,s]=n.split(".");if(e===void 0||t===void 0||s===void 0)return vn("JWT malformed, contained fewer than 3 sections"),null;try{const o=_o(t);return o?JSON.parse(o):(vn("Failed to decode base64 JWT payload"),null)}catch(o){return vn("Caught error parsing JWT payload as JSON",o?.toString()),null}}function kr(n){const e=Xi(n);return C(e,"internal-error"),C(typeof e.exp<"u","internal-error"),C(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qt(n,e,t=!1){if(t)return e;try{return await e}catch(s){throw s instanceof ue&&bh(s)&&n.auth.currentUser===n&&await n.auth.signOut(),s}}function bh({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ah{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const s=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,s)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Li{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Bt(this.lastLoginAt),this.creationTime=Bt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pn(n){const e=n.auth,t=await n.getIdToken(),s=await qt(n,Cn(e,{idToken:t}));C(s?.users.length,e,"internal-error");const o=s.users[0];n._notifyReloadListener(o);const c=o.providerUserInfo?.length?xo(o.providerUserInfo):[],l=Ch(n.providerData,c),g=n.isAnonymous,v=!(n.email&&o.passwordHash)&&!l?.length,T=g?v:!1,A={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:l,metadata:new Li(o.createdAt,o.lastLoginAt),isAnonymous:T};Object.assign(n,A)}async function Sh(n){const e=ve(n);await Pn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Ch(n,e){return[...n.filter(s=>!e.some(o=>o.providerId===s.providerId)),...e]}function xo(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ph(n,e){const t=await Lo(n,{},async()=>{const s=Xt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:c}=n.config,l=await Mo(n,o,"/v1/token",`key=${c}`),g=await n._getAdditionalHeaders();g["Content-Type"]="application/x-www-form-urlencoded";const v={method:"POST",headers:g,body:s};return n.emulatorConfig&&Jt(n.emulatorConfig.host)&&(v.credentials="include"),Oo.fetch()(l,v)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function kh(n,e){return Et(n,"POST","/v2/accounts:revokeToken",Ji(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){C(e.idToken,"internal-error"),C(typeof e.idToken<"u","internal-error"),C(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):kr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){C(e.length!==0,"internal-error");const t=kr(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(C(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:s,refreshToken:o,expiresIn:c}=await Ph(e,t);this.updateTokensAndExpiration(s,o,Number(c))}updateTokensAndExpiration(e,t,s){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+s*1e3}static fromJSON(e,t){const{refreshToken:s,accessToken:o,expirationTime:c}=t,l=new gt;return s&&(C(typeof s=="string","internal-error",{appName:e}),l.refreshToken=s),o&&(C(typeof o=="string","internal-error",{appName:e}),l.accessToken=o),c&&(C(typeof c=="number","internal-error",{appName:e}),l.expirationTime=c),l}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new gt,this.toJSON())}_performRefresh(){return Ae("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Me(n,e){C(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class ae{constructor({uid:e,auth:t,stsTokenManager:s,...o}){this.providerId="firebase",this.proactiveRefresh=new Ah(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=o.displayName||null,this.email=o.email||null,this.emailVerified=o.emailVerified||!1,this.phoneNumber=o.phoneNumber||null,this.photoURL=o.photoURL||null,this.isAnonymous=o.isAnonymous||!1,this.tenantId=o.tenantId||null,this.providerData=o.providerData?[...o.providerData]:[],this.metadata=new Li(o.createdAt||void 0,o.lastLoginAt||void 0)}async getIdToken(e){const t=await qt(this,this.stsTokenManager.getToken(this.auth,e));return C(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Eh(this,e)}reload(){return Sh(this)}_assign(e){this!==e&&(C(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new ae({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){C(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let s=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),s=!0),t&&await Pn(this),await this.auth._persistUserIfCurrent(this),s&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(oe(this.auth.app))return Promise.reject(Ze(this.auth));const e=await this.getIdToken();return await qt(this,Th(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const s=t.displayName??void 0,o=t.email??void 0,c=t.phoneNumber??void 0,l=t.photoURL??void 0,g=t.tenantId??void 0,v=t._redirectEventId??void 0,T=t.createdAt??void 0,A=t.lastLoginAt??void 0,{uid:S,emailVerified:b,isAnonymous:O,providerData:L,stsTokenManager:F}=t;C(S&&F,e,"internal-error");const x=gt.fromJSON(this.name,F);C(typeof S=="string",e,"internal-error"),Me(s,e.name),Me(o,e.name),C(typeof b=="boolean",e,"internal-error"),C(typeof O=="boolean",e,"internal-error"),Me(c,e.name),Me(l,e.name),Me(g,e.name),Me(v,e.name),Me(T,e.name),Me(A,e.name);const z=new ae({uid:S,auth:e,email:o,emailVerified:b,displayName:s,isAnonymous:O,photoURL:l,phoneNumber:c,tenantId:g,stsTokenManager:x,createdAt:T,lastLoginAt:A});return L&&Array.isArray(L)&&(z.providerData=L.map(G=>({...G}))),v&&(z._redirectEventId=v),z}static async _fromIdTokenResponse(e,t,s=!1){const o=new gt;o.updateFromServerResponse(t);const c=new ae({uid:t.localId,auth:e,stsTokenManager:o,isAnonymous:s});return await Pn(c),c}static async _fromGetAccountInfoResponse(e,t,s){const o=t.users[0];C(o.localId!==void 0,"internal-error");const c=o.providerUserInfo!==void 0?xo(o.providerUserInfo):[],l=!(o.email&&o.passwordHash)&&!c?.length,g=new gt;g.updateFromIdToken(s);const v=new ae({uid:o.localId,auth:e,stsTokenManager:g,isAnonymous:l}),T={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:c,metadata:new Li(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!c?.length};return Object.assign(v,T),v}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rr=new Map;function Se(n){Pe(n instanceof Function,"Expected a class definition");let e=Rr.get(n);return e?(Pe(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Rr.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uo{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Uo.type="NONE";const Dr=Uo;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function In(n,e,t){return`firebase:${n}:${e}:${t}`}class mt{constructor(e,t,s){this.persistence=e,this.auth=t,this.userKey=s;const{config:o,name:c}=this.auth;this.fullUserKey=In(this.userKey,o.apiKey,c),this.fullPersistenceKey=In("persistence",o.apiKey,c),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Cn(this.auth,{idToken:e}).catch(()=>{});return t?ae._fromGetAccountInfoResponse(this.auth,t,e):null}return ae._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,s="authUser"){if(!t.length)return new mt(Se(Dr),e,s);const o=(await Promise.all(t.map(async T=>{if(await T._isAvailable())return T}))).filter(T=>T);let c=o[0]||Se(Dr);const l=In(s,e.config.apiKey,e.name);let g=null;for(const T of t)try{const A=await T._get(l);if(A){let S;if(typeof A=="string"){const b=await Cn(e,{idToken:A}).catch(()=>{});if(!b)break;S=await ae._fromGetAccountInfoResponse(e,b,A)}else S=ae._fromJSON(e,A);T!==c&&(g=S),c=T;break}}catch{}const v=o.filter(T=>T._shouldAllowMigration);return!c._shouldAllowMigration||!v.length?new mt(c,e,s):(c=v[0],g&&await c._set(l,g.toJSON()),await Promise.all(t.map(async T=>{if(T!==c)try{await T._remove(l)}catch{}})),new mt(c,e,s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nr(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Bo(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Fo(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Ho(e))return"Blackberry";if(zo(e))return"Webos";if(Vo(e))return"Safari";if((e.includes("chrome/")||jo(e))&&!e.includes("edge/"))return"Chrome";if($o(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,s=n.match(t);if(s?.length===2)return s[1]}return"Other"}function Fo(n=Z()){return/firefox\//i.test(n)}function Vo(n=Z()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function jo(n=Z()){return/crios\//i.test(n)}function Bo(n=Z()){return/iemobile/i.test(n)}function $o(n=Z()){return/android/i.test(n)}function Ho(n=Z()){return/blackberry/i.test(n)}function zo(n=Z()){return/webos/i.test(n)}function Yi(n=Z()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Rh(n=Z()){return Yi(n)&&!!window.navigator?.standalone}function Dh(){return Hc()&&document.documentMode===10}function Go(n=Z()){return Yi(n)||$o(n)||zo(n)||Ho(n)||/windows phone/i.test(n)||Bo(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wo(n,e=[]){let t;switch(n){case"Browser":t=Nr(Z());break;case"Worker":t=`${Nr(Z())}-${n}`;break;default:t=n}const s=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Tt}/${s}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nh{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const s=c=>new Promise((l,g)=>{try{const v=e(c);l(v)}catch(v){g(v)}});s.onAbort=t,this.queue.push(s);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const s of this.queue)await s(e),s.onAbort&&t.push(s.onAbort)}catch(s){t.reverse();for(const o of t)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:s?.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Oh(n,e={}){return Et(n,"GET","/v2/passwordPolicy",Ji(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lh=6;class Mh{constructor(e){const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??Lh,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const s=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;s&&(t.meetsMinPasswordLength=e.length>=s),o&&(t.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let s;for(let o=0;o<e.length;o++)s=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(t,s>="a"&&s<="z",s>="A"&&s<="Z",s>="0"&&s<="9",this.allowedNonAlphanumericCharacters.includes(s))}updatePasswordCharacterOptionsStatuses(e,t,s,o,c){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=s)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xh{constructor(e,t,s,o){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=s,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Or(this),this.idTokenSubscription=new Or(this),this.beforeStateQueue=new Nh(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=No,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(c=>this._resolvePersistenceManagerAvailable=c)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Se(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted&&(this.persistenceManager=await mt.create(this,e),this._resolvePersistenceManagerAvailable?.(),!this._deleted)){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Cn(this,{idToken:e}),s=await ae._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(s)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(oe(this.app)){const c=this.app.settings.authIdToken;return c?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(c).then(l,l))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let s=t,o=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const c=this.redirectUser?._redirectEventId,l=s?._redirectEventId,g=await this.tryRedirectSignIn(e);(!c||c===l)&&g?.user&&(s=g.user,o=!0)}if(!s)return this.directlySetCurrentUser(null);if(!s._redirectEventId){if(o)try{await this.beforeStateQueue.runMiddleware(s)}catch(c){s=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(c))}return s?this.reloadAndSetCurrentUserOrClear(s):this.directlySetCurrentUser(null)}return C(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===s._redirectEventId?this.directlySetCurrentUser(s):this.reloadAndSetCurrentUserOrClear(s)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Pn(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=mh()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(oe(this.app))return Promise.reject(Ze(this));const t=e?ve(e):null;return t&&C(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&C(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return oe(this.app)?Promise.reject(Ze(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return oe(this.app)?Promise.reject(Ze(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Se(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Oh(this),t=new Mh(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new ot("auth","Firebase",e())}onAuthStateChanged(e,t,s){return this.registerStateListener(this.authStateSubscription,e,t,s)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,s){return this.registerStateListener(this.idTokenSubscription,e,t,s)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const s=this.onAuthStateChanged(()=>{s(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),s={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(s.tenantId=this.tenantId),await kh(this,s)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){const s=await this.getOrInitRedirectPersistenceManager(t);return e===null?s.removeCurrentUser():s.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Se(e)||this._popupRedirectResolver;C(t,this,"argument-error"),this.redirectPersistenceManager=await mt.create(this,[Se(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,s,o){if(this._deleted)return()=>{};const c=typeof t=="function"?t:t.next.bind(t);let l=!1;const g=this._isInitialized?Promise.resolve():this._initializationPromise;if(C(g,this,"internal-error"),g.then(()=>{l||c(this.currentUser)}),typeof t=="function"){const v=e.addObserver(t,s,o);return()=>{l=!0,v()}}else{const v=e.addObserver(t);return()=>{l=!0,v()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return C(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Wo(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();t&&(e["X-Firebase-Client"]=t);const s=await this._getAppCheckToken();return s&&(e["X-Firebase-AppCheck"]=s),e}async _getAppCheckToken(){if(oe(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&dh(`Error while retrieving App Check token: ${e.error}`),e?.token}}function Fn(n){return ve(n)}class Or{constructor(e){this.auth=e,this.observer=null,this.addObserver=Kc(t=>this.observer=t)}get next(){return C(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Qi={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Uh(n){Qi=n}function Fh(n){return Qi.loadJS(n)}function Vh(){return Qi.gapiScript}function jh(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bh(n,e){const t=at(n,"auth");if(t.isInitialized()){const o=t.getImmediate(),c=t.getOptions();if(Be(c,e??{}))return o;we(o,"already-initialized")}return t.initialize({options:e})}function $h(n,e){const t=e?.persistence||[],s=(Array.isArray(t)?t:[t]).map(Se);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(s,e?.popupRedirectResolver)}function Hh(n,e,t){const s=Fn(n);C(/^https?:\/\//.test(e),s,"invalid-emulator-scheme");const o=!1,c=qo(e),{host:l,port:g}=zh(e),v=g===null?"":`:${g}`,T={url:`${c}//${l}${v}/`},A=Object.freeze({host:l,port:g,protocol:c.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!s._canInitEmulator){C(s.config.emulator&&s.emulatorConfig,s,"emulator-config-failed"),C(Be(T,s.config.emulator)&&Be(A,s.emulatorConfig),s,"emulator-config-failed");return}s.config.emulator=T,s.emulatorConfig=A,s.settings.appVerificationDisabledForTesting=!0,Jt(l)?(To(`${c}//${l}${v}`),Eo("Auth",!0)):Gh()}function qo(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function zh(n){const e=qo(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const s=t[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(s);if(o){const c=o[1];return{host:c,port:Lr(s.substr(c.length+1))}}else{const[c,l]=s.split(":");return{host:c,port:Lr(l)}}}function Lr(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Gh(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ko{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Ae("not implemented")}_getIdTokenResponse(e){return Ae("not implemented")}_linkToIdToken(e,t){return Ae("not implemented")}_getReauthenticationResolver(e){return Ae("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yt(n,e){return vh(n,"POST","/v1/accounts:signInWithIdp",Ji(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wh="http://localhost";class nt extends Ko{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new nt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):we("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:s,signInMethod:o,...c}=t;if(!s||!o)return null;const l=new nt(s,o);return l.idToken=c.idToken||void 0,l.accessToken=c.accessToken||void 0,l.secret=c.secret,l.nonce=c.nonce,l.pendingToken=c.pendingToken||null,l}_getIdTokenResponse(e){const t=this.buildRequest();return yt(e,t)}_linkToIdToken(e,t){const s=this.buildRequest();return s.idToken=t,yt(e,s)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,yt(e,t)}buildRequest(){const e={requestUri:Wh,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Xt(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zi{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qt extends Zi{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe extends Qt{constructor(){super("facebook.com")}static credential(e){return nt._fromParams({providerId:xe.PROVIDER_ID,signInMethod:xe.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return xe.credentialFromTaggedObject(e)}static credentialFromError(e){return xe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return xe.credential(e.oauthAccessToken)}catch{return null}}}xe.FACEBOOK_SIGN_IN_METHOD="facebook.com";xe.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ee extends Qt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return nt._fromParams({providerId:Ee.PROVIDER_ID,signInMethod:Ee.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Ee.credentialFromTaggedObject(e)}static credentialFromError(e){return Ee.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:s}=e;if(!t&&!s)return null;try{return Ee.credential(t,s)}catch{return null}}}Ee.GOOGLE_SIGN_IN_METHOD="google.com";Ee.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue extends Qt{constructor(){super("github.com")}static credential(e){return nt._fromParams({providerId:Ue.PROVIDER_ID,signInMethod:Ue.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ue.credentialFromTaggedObject(e)}static credentialFromError(e){return Ue.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ue.credential(e.oauthAccessToken)}catch{return null}}}Ue.GITHUB_SIGN_IN_METHOD="github.com";Ue.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fe extends Qt{constructor(){super("twitter.com")}static credential(e,t){return nt._fromParams({providerId:Fe.PROVIDER_ID,signInMethod:Fe.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Fe.credentialFromTaggedObject(e)}static credentialFromError(e){return Fe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:s}=e;if(!t||!s)return null;try{return Fe.credential(t,s)}catch{return null}}}Fe.TWITTER_SIGN_IN_METHOD="twitter.com";Fe.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,s,o=!1){const c=await ae._fromIdTokenResponse(e,s,o),l=Mr(s);return new vt({user:c,providerId:l,_tokenResponse:s,operationType:t})}static async _forOperation(e,t,s){await e._updateTokensIfNecessary(s,!0);const o=Mr(s);return new vt({user:e,providerId:o,_tokenResponse:s,operationType:t})}}function Mr(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kn extends ue{constructor(e,t,s,o){super(t.code,t.message),this.operationType=s,this.user=o,Object.setPrototypeOf(this,kn.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:s}}static _fromErrorAndOperation(e,t,s,o){return new kn(e,t,s,o)}}function Jo(n,e,t,s){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(c=>{throw c.code==="auth/multi-factor-auth-required"?kn._fromErrorAndOperation(n,c,e,s):c})}async function qh(n,e,t=!1){const s=await qt(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return vt._forOperation(n,"link",s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Kh(n,e,t=!1){const{auth:s}=n;if(oe(s.app))return Promise.reject(Ze(s));const o="reauthenticate";try{const c=await qt(n,Jo(s,o,e,n),t);C(c.idToken,s,"internal-error");const l=Xi(c.idToken);C(l,s,"internal-error");const{sub:g}=l;return C(n.uid===g,s,"user-mismatch"),vt._forOperation(n,o,c)}catch(c){throw c?.code==="auth/user-not-found"&&we(s,"user-mismatch"),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jh(n,e,t=!1){if(oe(n.app))return Promise.reject(Ze(n));const s="signIn",o=await Jo(n,s,e),c=await vt._fromIdTokenResponse(n,s,o);return t||await n._updateCurrentUser(c.user),c}function Xh(n,e,t,s){return ve(n).onIdTokenChanged(e,t,s)}function Yh(n,e,t){return ve(n).beforeAuthStateChanged(e,t)}const Rn="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xo{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Rn,"1"),this.storage.removeItem(Rn),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qh=1e3,Zh=10;class Yo extends Xo{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Go(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const s=this.storage.getItem(t),o=this.localCache[t];s!==o&&e(t,o,s)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((l,g,v)=>{this.notifyListeners(l,v)});return}const s=e.key;t?this.detachListener():this.stopPolling();const o=()=>{const l=this.storage.getItem(s);!t&&this.localCache[s]===l||this.notifyListeners(s,l)},c=this.storage.getItem(s);Dh()&&c!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,Zh):o()}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const o of Array.from(s))o(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,s)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:s}),!0)})},Qh)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Yo.type="LOCAL";const eu=Yo;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qo extends Xo{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Qo.type="SESSION";const Zo=Qo;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tu(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(o=>o.isListeningto(e));if(t)return t;const s=new Vn(e);return this.receivers.push(s),s}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:s,eventType:o,data:c}=t.data,l=this.handlersMap[o];if(!l?.size)return;t.ports[0].postMessage({status:"ack",eventId:s,eventType:o});const g=Array.from(l).map(async T=>T(t.origin,c)),v=await tu(g);t.ports[0].postMessage({status:"done",eventId:s,eventType:o,response:v})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Vn.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function es(n="",e=10){let t="";for(let s=0;s<e;s++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nu{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,s=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let c,l;return new Promise((g,v)=>{const T=es("",20);o.port1.start();const A=setTimeout(()=>{v(new Error("unsupported_event"))},s);l={messageChannel:o,onMessage(S){const b=S;if(b.data.eventId===T)switch(b.data.status){case"ack":clearTimeout(A),c=setTimeout(()=>{v(new Error("timeout"))},3e3);break;case"done":clearTimeout(c),g(b.data.response);break;default:clearTimeout(A),clearTimeout(c),v(new Error("invalid_response"));break}}},this.handlers.add(l),o.port1.addEventListener("message",l.onMessage),this.target.postMessage({eventType:e,eventId:T,data:t},[o.port2])}).finally(()=>{l&&this.removeMessageHandler(l)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ye(){return window}function iu(n){ye().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ea(){return typeof ye().WorkerGlobalScope<"u"&&typeof ye().importScripts=="function"}async function su(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function ru(){return navigator?.serviceWorker?.controller||null}function ou(){return ea()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ta="firebaseLocalStorageDb",au=1,Dn="firebaseLocalStorage",na="fbase_key";class Zt{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function jn(n,e){return n.transaction([Dn],e?"readwrite":"readonly").objectStore(Dn)}function cu(){const n=indexedDB.deleteDatabase(ta);return new Zt(n).toPromise()}function Mi(){const n=indexedDB.open(ta,au);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const s=n.result;try{s.createObjectStore(Dn,{keyPath:na})}catch(o){t(o)}}),n.addEventListener("success",async()=>{const s=n.result;s.objectStoreNames.contains(Dn)?e(s):(s.close(),await cu(),e(await Mi()))})})}async function xr(n,e,t){const s=jn(n,!0).put({[na]:e,value:t});return new Zt(s).toPromise()}async function lu(n,e){const t=jn(n,!1).get(e),s=await new Zt(t).toPromise();return s===void 0?null:s.value}function Ur(n,e){const t=jn(n,!0).delete(e);return new Zt(t).toPromise()}const hu=800,uu=3;class ia{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Mi(),this.db)}async _withRetries(e){let t=0;for(;;)try{const s=await this._openDb();return await e(s)}catch(s){if(t++>uu)throw s;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return ea()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Vn._getInstance(ou()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await su(),!this.activeServiceWorker)return;this.sender=new nu(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||ru()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Mi();return await xr(e,Rn,"1"),await Ur(e,Rn),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(s=>xr(s,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(s=>lu(s,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Ur(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const c=jn(o,!1).getAll();return new Zt(c).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],s=new Set;if(e.length!==0)for(const{fbase_key:o,value:c}of e)s.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(c)&&(this.notifyListeners(o,c),t.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!s.has(o)&&(this.notifyListeners(o,null),t.push(o));return t}notifyListeners(e,t){this.localCache[e]=t;const s=this.listeners[e];if(s)for(const o of Array.from(s))o(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),hu)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}ia.type="LOCAL";const du=ia;new Yt(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sa(n,e){return e?Se(e):(C(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ts extends Ko{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return yt(e,this._buildIdpRequest())}_linkToIdToken(e,t){return yt(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return yt(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function fu(n){return Jh(n.auth,new ts(n),n.bypassAuthState)}function pu(n){const{auth:e,user:t}=n;return C(t,e,"internal-error"),Kh(t,new ts(n),n.bypassAuthState)}async function gu(n){const{auth:e,user:t}=n;return C(t,e,"internal-error"),qh(t,new ts(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ra{constructor(e,t,s,o,c=!1){this.auth=e,this.resolver=s,this.user=o,this.bypassAuthState=c,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(s){this.reject(s)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:s,postBody:o,tenantId:c,error:l,type:g}=e;if(l){this.reject(l);return}const v={auth:this.auth,requestUri:t,sessionId:s,tenantId:c||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(g)(v))}catch(T){this.reject(T)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return fu;case"linkViaPopup":case"linkViaRedirect":return gu;case"reauthViaPopup":case"reauthViaRedirect":return pu;default:we(this.auth,"internal-error")}}resolve(e){Pe(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Pe(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mu=new Yt(2e3,1e4);async function yu(n,e,t){if(oe(n.app))return Promise.reject(le(n,"operation-not-supported-in-this-environment"));const s=Fn(n);fh(n,e,Zi);const o=sa(s,t);return new Xe(s,"signInViaPopup",e,o).executeNotNull()}class Xe extends ra{constructor(e,t,s,o,c){super(e,t,o,c),this.provider=s,this.authWindow=null,this.pollId=null,Xe.currentPopupAction&&Xe.currentPopupAction.cancel(),Xe.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return C(e,this.auth,"internal-error"),e}async onExecution(){Pe(this.filter.length===1,"Popup operations only handle one event");const e=es();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(le(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(le(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Xe.currentPopupAction=null}pollUserCancellation(){const e=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(le(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,mu.get())};e()}}Xe.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _u="pendingRedirect",Tn=new Map;class wu extends ra{constructor(e,t,s=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,s),this.eventId=null}async execute(){let e=Tn.get(this.auth._key());if(!e){try{const s=await vu(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(s)}catch(t){e=()=>Promise.reject(t)}Tn.set(this.auth._key(),e)}return this.bypassAuthState||Tn.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function vu(n,e){const t=Eu(e),s=Tu(n);if(!await s._isAvailable())return!1;const o=await s._get(t)==="true";return await s._remove(t),o}function Iu(n,e){Tn.set(n._key(),e)}function Tu(n){return Se(n._redirectPersistence)}function Eu(n){return In(_u,n.config.apiKey,n.name)}async function bu(n,e,t=!1){if(oe(n.app))return Promise.reject(Ze(n));const s=Fn(n),o=sa(s,e),l=await new wu(s,o,t).execute();return l&&!t&&(delete l.user._redirectEventId,await s._persistUserIfCurrent(l.user),await s._setRedirectUser(null,e)),l}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Au=600*1e3;class Su{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(s=>{this.isEventForConsumer(e,s)&&(t=!0,this.sendToConsumer(e,s),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Cu(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){if(e.error&&!oa(e)){const s=e.error.code?.split("auth/")[1]||"internal-error";t.onError(le(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const s=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&s}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Au&&this.cachedEventUids.clear(),this.cachedEventUids.has(Fr(e))}saveEventToCache(e){this.cachedEventUids.add(Fr(e)),this.lastProcessedEventTime=Date.now()}}function Fr(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function oa({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function Cu(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return oa(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pu(n,e={}){return Et(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ku=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Ru=/^https?/;async function Du(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Pu(n);for(const t of e)try{if(Nu(t))return}catch{}we(n,"unauthorized-domain")}function Nu(n){const e=Oi(),{protocol:t,hostname:s}=new URL(e);if(n.startsWith("chrome-extension://")){const l=new URL(n);return l.hostname===""&&s===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&l.hostname===s}if(!Ru.test(t))return!1;if(ku.test(n))return s===n;const o=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(s)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ou=new Yt(3e4,6e4);function Vr(){const n=ye().___jsl;if(n?.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function Lu(n){return new Promise((e,t)=>{function s(){Vr(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Vr(),t(le(n,"network-request-failed"))},timeout:Ou.get()})}if(ye().gapi?.iframes?.Iframe)e(gapi.iframes.getContext());else if(ye().gapi?.load)s();else{const o=jh("iframefcb");return ye()[o]=()=>{gapi.load?s():t(le(n,"network-request-failed"))},Fh(`${Vh()}?onload=${o}`).catch(c=>t(c))}}).catch(e=>{throw En=null,e})}let En=null;function Mu(n){return En=En||Lu(n),En}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xu=new Yt(5e3,15e3),Uu="__/auth/iframe",Fu="emulator/auth/iframe",Vu={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},ju=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Bu(n){const e=n.config;C(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Ki(e,Fu):`https://${n.config.authDomain}/${Uu}`,s={apiKey:e.apiKey,appName:n.name,v:Tt},o=ju.get(n.config.apiHost);o&&(s.eid=o);const c=n._getFrameworks();return c.length&&(s.fw=c.join(",")),`${t}?${Xt(s).slice(1)}`}async function $u(n){const e=await Mu(n),t=ye().gapi;return C(t,n,"internal-error"),e.open({where:document.body,url:Bu(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Vu,dontclear:!0},s=>new Promise(async(o,c)=>{await s.restyle({setHideOnLeave:!1});const l=le(n,"network-request-failed"),g=ye().setTimeout(()=>{c(l)},xu.get());function v(){ye().clearTimeout(g),o(s)}s.ping(v).then(v,()=>{c(l)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hu={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},zu=500,Gu=600,Wu="_blank",qu="http://localhost";class jr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Ku(n,e,t,s=zu,o=Gu){const c=Math.max((window.screen.availHeight-o)/2,0).toString(),l=Math.max((window.screen.availWidth-s)/2,0).toString();let g="";const v={...Hu,width:s.toString(),height:o.toString(),top:c,left:l},T=Z().toLowerCase();t&&(g=jo(T)?Wu:t),Fo(T)&&(e=e||qu,v.scrollbars="yes");const A=Object.entries(v).reduce((b,[O,L])=>`${b}${O}=${L},`,"");if(Rh(T)&&g!=="_self")return Ju(e||"",g),new jr(null);const S=window.open(e||"",g,A);C(S,n,"popup-blocked");try{S.focus()}catch{}return new jr(S)}function Ju(n,e){const t=document.createElement("a");t.href=n,t.target=e;const s=document.createEvent("MouseEvent");s.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xu="__/auth/handler",Yu="emulator/auth/handler",Qu=encodeURIComponent("fac");async function Br(n,e,t,s,o,c){C(n.config.authDomain,n,"auth-domain-config-required"),C(n.config.apiKey,n,"invalid-api-key");const l={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:s,v:Tt,eventId:o};if(e instanceof Zi){e.setDefaultLanguage(n.languageCode),l.providerId=e.providerId||"",qc(e.getCustomParameters())||(l.customParameters=JSON.stringify(e.getCustomParameters()));for(const[A,S]of Object.entries({}))l[A]=S}if(e instanceof Qt){const A=e.getScopes().filter(S=>S!=="");A.length>0&&(l.scopes=A.join(","))}n.tenantId&&(l.tid=n.tenantId);const g=l;for(const A of Object.keys(g))g[A]===void 0&&delete g[A];const v=await n._getAppCheckToken(),T=v?`#${Qu}=${encodeURIComponent(v)}`:"";return`${Zu(n)}?${Xt(g).slice(1)}${T}`}function Zu({config:n}){return n.emulator?Ki(n,Yu):`https://${n.authDomain}/${Xu}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ti="webStorageSupport";class ed{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Zo,this._completeRedirectFn=bu,this._overrideRedirectResult=Iu}async _openPopup(e,t,s,o){Pe(this.eventManagers[e._key()]?.manager,"_initialize() not called before _openPopup()");const c=await Br(e,t,s,Oi(),o);return Ku(e,c,es())}async _openRedirect(e,t,s,o){await this._originValidation(e);const c=await Br(e,t,s,Oi(),o);return iu(c),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:o,promise:c}=this.eventManagers[t];return o?Promise.resolve(o):(Pe(c,"If manager is not set, promise should be"),c)}const s=this.initAndGetManager(e);return this.eventManagers[t]={promise:s},s.catch(()=>{delete this.eventManagers[t]}),s}async initAndGetManager(e){const t=await $u(e),s=new Su(e);return t.register("authEvent",o=>(C(o?.authEvent,e,"invalid-auth-event"),{status:s.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:s},this.iframes[e._key()]=t,s}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ti,{type:Ti},o=>{const c=o?.[0]?.[Ti];c!==void 0&&t(!!c),we(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Du(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Go()||Vo()||Yi()}}const td=ed;var $r="@firebase/auth",Hr="1.12.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nd{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(s=>{e(s?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){C(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function id(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function sd(n){_e(new he("auth",(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),c=e.getProvider("app-check-internal"),{apiKey:l,authDomain:g}=s.options;C(l&&!l.includes(":"),"invalid-api-key",{appName:s.name});const v={apiKey:l,authDomain:g,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Wo(n)},T=new xh(s,o,c,v);return $h(T,t),T},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,s)=>{e.getProvider("auth-internal").initialize()})),_e(new he("auth-internal",e=>{const t=Fn(e.getProvider("auth").getImmediate());return(s=>new nd(s))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),se($r,Hr,id(n)),se($r,Hr,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rd=300,od=Io("authIdTokenMaxAge")||rd;let zr=null;const ad=n=>async e=>{const t=e&&await e.getIdTokenResult(),s=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(s&&s>od)return;const o=t?.token;zr!==o&&(zr=o,await fetch(n,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function cd(n=Un()){const e=at(n,"auth");if(e.isInitialized())return e.getImmediate();const t=Bh(n,{popupRedirectResolver:td,persistence:[du,eu,Zo]}),s=Io("authTokenSyncURL");if(s&&typeof isSecureContext=="boolean"&&isSecureContext){const c=new URL(s,location.origin);if(location.origin===c.origin){const l=ad(c.toString());Yh(t,l,()=>l(t.currentUser)),Xh(t,g=>l(g))}}const o=wo("auth");return o&&Hh(t,`http://${o}`),t}function ld(){return document.getElementsByTagName("head")?.[0]??document}Uh({loadJS(n){return new Promise((e,t)=>{const s=document.createElement("script");s.setAttribute("src",n),s.onload=e,s.onerror=o=>{const c=le("internal-error");c.customData=o,t(c)},s.type="text/javascript",s.charset="UTF-8",ld().appendChild(s)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});sd("Browser");var Gr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var ns;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(m,u){function f(){}f.prototype=u.prototype,m.F=u.prototype,m.prototype=new f,m.prototype.constructor=m,m.D=function(y,p,w){for(var d=Array(arguments.length-2),te=2;te<arguments.length;te++)d[te-2]=arguments[te];return u.prototype[p].apply(y,d)}}function t(){this.blockSize=-1}function s(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(s,t),s.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(m,u,f){f||(f=0);const y=Array(16);if(typeof u=="string")for(var p=0;p<16;++p)y[p]=u.charCodeAt(f++)|u.charCodeAt(f++)<<8|u.charCodeAt(f++)<<16|u.charCodeAt(f++)<<24;else for(p=0;p<16;++p)y[p]=u[f++]|u[f++]<<8|u[f++]<<16|u[f++]<<24;u=m.g[0],f=m.g[1],p=m.g[2];let w=m.g[3],d;d=u+(w^f&(p^w))+y[0]+3614090360&4294967295,u=f+(d<<7&4294967295|d>>>25),d=w+(p^u&(f^p))+y[1]+3905402710&4294967295,w=u+(d<<12&4294967295|d>>>20),d=p+(f^w&(u^f))+y[2]+606105819&4294967295,p=w+(d<<17&4294967295|d>>>15),d=f+(u^p&(w^u))+y[3]+3250441966&4294967295,f=p+(d<<22&4294967295|d>>>10),d=u+(w^f&(p^w))+y[4]+4118548399&4294967295,u=f+(d<<7&4294967295|d>>>25),d=w+(p^u&(f^p))+y[5]+1200080426&4294967295,w=u+(d<<12&4294967295|d>>>20),d=p+(f^w&(u^f))+y[6]+2821735955&4294967295,p=w+(d<<17&4294967295|d>>>15),d=f+(u^p&(w^u))+y[7]+4249261313&4294967295,f=p+(d<<22&4294967295|d>>>10),d=u+(w^f&(p^w))+y[8]+1770035416&4294967295,u=f+(d<<7&4294967295|d>>>25),d=w+(p^u&(f^p))+y[9]+2336552879&4294967295,w=u+(d<<12&4294967295|d>>>20),d=p+(f^w&(u^f))+y[10]+4294925233&4294967295,p=w+(d<<17&4294967295|d>>>15),d=f+(u^p&(w^u))+y[11]+2304563134&4294967295,f=p+(d<<22&4294967295|d>>>10),d=u+(w^f&(p^w))+y[12]+1804603682&4294967295,u=f+(d<<7&4294967295|d>>>25),d=w+(p^u&(f^p))+y[13]+4254626195&4294967295,w=u+(d<<12&4294967295|d>>>20),d=p+(f^w&(u^f))+y[14]+2792965006&4294967295,p=w+(d<<17&4294967295|d>>>15),d=f+(u^p&(w^u))+y[15]+1236535329&4294967295,f=p+(d<<22&4294967295|d>>>10),d=u+(p^w&(f^p))+y[1]+4129170786&4294967295,u=f+(d<<5&4294967295|d>>>27),d=w+(f^p&(u^f))+y[6]+3225465664&4294967295,w=u+(d<<9&4294967295|d>>>23),d=p+(u^f&(w^u))+y[11]+643717713&4294967295,p=w+(d<<14&4294967295|d>>>18),d=f+(w^u&(p^w))+y[0]+3921069994&4294967295,f=p+(d<<20&4294967295|d>>>12),d=u+(p^w&(f^p))+y[5]+3593408605&4294967295,u=f+(d<<5&4294967295|d>>>27),d=w+(f^p&(u^f))+y[10]+38016083&4294967295,w=u+(d<<9&4294967295|d>>>23),d=p+(u^f&(w^u))+y[15]+3634488961&4294967295,p=w+(d<<14&4294967295|d>>>18),d=f+(w^u&(p^w))+y[4]+3889429448&4294967295,f=p+(d<<20&4294967295|d>>>12),d=u+(p^w&(f^p))+y[9]+568446438&4294967295,u=f+(d<<5&4294967295|d>>>27),d=w+(f^p&(u^f))+y[14]+3275163606&4294967295,w=u+(d<<9&4294967295|d>>>23),d=p+(u^f&(w^u))+y[3]+4107603335&4294967295,p=w+(d<<14&4294967295|d>>>18),d=f+(w^u&(p^w))+y[8]+1163531501&4294967295,f=p+(d<<20&4294967295|d>>>12),d=u+(p^w&(f^p))+y[13]+2850285829&4294967295,u=f+(d<<5&4294967295|d>>>27),d=w+(f^p&(u^f))+y[2]+4243563512&4294967295,w=u+(d<<9&4294967295|d>>>23),d=p+(u^f&(w^u))+y[7]+1735328473&4294967295,p=w+(d<<14&4294967295|d>>>18),d=f+(w^u&(p^w))+y[12]+2368359562&4294967295,f=p+(d<<20&4294967295|d>>>12),d=u+(f^p^w)+y[5]+4294588738&4294967295,u=f+(d<<4&4294967295|d>>>28),d=w+(u^f^p)+y[8]+2272392833&4294967295,w=u+(d<<11&4294967295|d>>>21),d=p+(w^u^f)+y[11]+1839030562&4294967295,p=w+(d<<16&4294967295|d>>>16),d=f+(p^w^u)+y[14]+4259657740&4294967295,f=p+(d<<23&4294967295|d>>>9),d=u+(f^p^w)+y[1]+2763975236&4294967295,u=f+(d<<4&4294967295|d>>>28),d=w+(u^f^p)+y[4]+1272893353&4294967295,w=u+(d<<11&4294967295|d>>>21),d=p+(w^u^f)+y[7]+4139469664&4294967295,p=w+(d<<16&4294967295|d>>>16),d=f+(p^w^u)+y[10]+3200236656&4294967295,f=p+(d<<23&4294967295|d>>>9),d=u+(f^p^w)+y[13]+681279174&4294967295,u=f+(d<<4&4294967295|d>>>28),d=w+(u^f^p)+y[0]+3936430074&4294967295,w=u+(d<<11&4294967295|d>>>21),d=p+(w^u^f)+y[3]+3572445317&4294967295,p=w+(d<<16&4294967295|d>>>16),d=f+(p^w^u)+y[6]+76029189&4294967295,f=p+(d<<23&4294967295|d>>>9),d=u+(f^p^w)+y[9]+3654602809&4294967295,u=f+(d<<4&4294967295|d>>>28),d=w+(u^f^p)+y[12]+3873151461&4294967295,w=u+(d<<11&4294967295|d>>>21),d=p+(w^u^f)+y[15]+530742520&4294967295,p=w+(d<<16&4294967295|d>>>16),d=f+(p^w^u)+y[2]+3299628645&4294967295,f=p+(d<<23&4294967295|d>>>9),d=u+(p^(f|~w))+y[0]+4096336452&4294967295,u=f+(d<<6&4294967295|d>>>26),d=w+(f^(u|~p))+y[7]+1126891415&4294967295,w=u+(d<<10&4294967295|d>>>22),d=p+(u^(w|~f))+y[14]+2878612391&4294967295,p=w+(d<<15&4294967295|d>>>17),d=f+(w^(p|~u))+y[5]+4237533241&4294967295,f=p+(d<<21&4294967295|d>>>11),d=u+(p^(f|~w))+y[12]+1700485571&4294967295,u=f+(d<<6&4294967295|d>>>26),d=w+(f^(u|~p))+y[3]+2399980690&4294967295,w=u+(d<<10&4294967295|d>>>22),d=p+(u^(w|~f))+y[10]+4293915773&4294967295,p=w+(d<<15&4294967295|d>>>17),d=f+(w^(p|~u))+y[1]+2240044497&4294967295,f=p+(d<<21&4294967295|d>>>11),d=u+(p^(f|~w))+y[8]+1873313359&4294967295,u=f+(d<<6&4294967295|d>>>26),d=w+(f^(u|~p))+y[15]+4264355552&4294967295,w=u+(d<<10&4294967295|d>>>22),d=p+(u^(w|~f))+y[6]+2734768916&4294967295,p=w+(d<<15&4294967295|d>>>17),d=f+(w^(p|~u))+y[13]+1309151649&4294967295,f=p+(d<<21&4294967295|d>>>11),d=u+(p^(f|~w))+y[4]+4149444226&4294967295,u=f+(d<<6&4294967295|d>>>26),d=w+(f^(u|~p))+y[11]+3174756917&4294967295,w=u+(d<<10&4294967295|d>>>22),d=p+(u^(w|~f))+y[2]+718787259&4294967295,p=w+(d<<15&4294967295|d>>>17),d=f+(w^(p|~u))+y[9]+3951481745&4294967295,m.g[0]=m.g[0]+u&4294967295,m.g[1]=m.g[1]+(p+(d<<21&4294967295|d>>>11))&4294967295,m.g[2]=m.g[2]+p&4294967295,m.g[3]=m.g[3]+w&4294967295}s.prototype.v=function(m,u){u===void 0&&(u=m.length);const f=u-this.blockSize,y=this.C;let p=this.h,w=0;for(;w<u;){if(p==0)for(;w<=f;)o(this,m,w),w+=this.blockSize;if(typeof m=="string"){for(;w<u;)if(y[p++]=m.charCodeAt(w++),p==this.blockSize){o(this,y),p=0;break}}else for(;w<u;)if(y[p++]=m[w++],p==this.blockSize){o(this,y),p=0;break}}this.h=p,this.o+=u},s.prototype.A=function(){var m=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);m[0]=128;for(var u=1;u<m.length-8;++u)m[u]=0;u=this.o*8;for(var f=m.length-8;f<m.length;++f)m[f]=u&255,u/=256;for(this.v(m),m=Array(16),u=0,f=0;f<4;++f)for(let y=0;y<32;y+=8)m[u++]=this.g[f]>>>y&255;return m};function c(m,u){var f=g;return Object.prototype.hasOwnProperty.call(f,m)?f[m]:f[m]=u(m)}function l(m,u){this.h=u;const f=[];let y=!0;for(let p=m.length-1;p>=0;p--){const w=m[p]|0;y&&w==u||(f[p]=w,y=!1)}this.g=f}var g={};function v(m){return-128<=m&&m<128?c(m,function(u){return new l([u|0],u<0?-1:0)}):new l([m|0],m<0?-1:0)}function T(m){if(isNaN(m)||!isFinite(m))return S;if(m<0)return x(T(-m));const u=[];let f=1;for(let y=0;m>=f;y++)u[y]=m/f|0,f*=4294967296;return new l(u,0)}function A(m,u){if(m.length==0)throw Error("number format error: empty string");if(u=u||10,u<2||36<u)throw Error("radix out of range: "+u);if(m.charAt(0)=="-")return x(A(m.substring(1),u));if(m.indexOf("-")>=0)throw Error('number format error: interior "-" character');const f=T(Math.pow(u,8));let y=S;for(let w=0;w<m.length;w+=8){var p=Math.min(8,m.length-w);const d=parseInt(m.substring(w,w+p),u);p<8?(p=T(Math.pow(u,p)),y=y.j(p).add(T(d))):(y=y.j(f),y=y.add(T(d)))}return y}var S=v(0),b=v(1),O=v(16777216);n=l.prototype,n.m=function(){if(F(this))return-x(this).m();let m=0,u=1;for(let f=0;f<this.g.length;f++){const y=this.i(f);m+=(y>=0?y:4294967296+y)*u,u*=4294967296}return m},n.toString=function(m){if(m=m||10,m<2||36<m)throw Error("radix out of range: "+m);if(L(this))return"0";if(F(this))return"-"+x(this).toString(m);const u=T(Math.pow(m,6));var f=this;let y="";for(;;){const p=j(f,u).g;f=z(f,p.j(u));let w=((f.g.length>0?f.g[0]:f.h)>>>0).toString(m);if(f=p,L(f))return w+y;for(;w.length<6;)w="0"+w;y=w+y}},n.i=function(m){return m<0?0:m<this.g.length?this.g[m]:this.h};function L(m){if(m.h!=0)return!1;for(let u=0;u<m.g.length;u++)if(m.g[u]!=0)return!1;return!0}function F(m){return m.h==-1}n.l=function(m){return m=z(this,m),F(m)?-1:L(m)?0:1};function x(m){const u=m.g.length,f=[];for(let y=0;y<u;y++)f[y]=~m.g[y];return new l(f,~m.h).add(b)}n.abs=function(){return F(this)?x(this):this},n.add=function(m){const u=Math.max(this.g.length,m.g.length),f=[];let y=0;for(let p=0;p<=u;p++){let w=y+(this.i(p)&65535)+(m.i(p)&65535),d=(w>>>16)+(this.i(p)>>>16)+(m.i(p)>>>16);y=d>>>16,w&=65535,d&=65535,f[p]=d<<16|w}return new l(f,f[f.length-1]&-2147483648?-1:0)};function z(m,u){return m.add(x(u))}n.j=function(m){if(L(this)||L(m))return S;if(F(this))return F(m)?x(this).j(x(m)):x(x(this).j(m));if(F(m))return x(this.j(x(m)));if(this.l(O)<0&&m.l(O)<0)return T(this.m()*m.m());const u=this.g.length+m.g.length,f=[];for(var y=0;y<2*u;y++)f[y]=0;for(y=0;y<this.g.length;y++)for(let p=0;p<m.g.length;p++){const w=this.i(y)>>>16,d=this.i(y)&65535,te=m.i(p)>>>16,He=m.i(p)&65535;f[2*y+2*p]+=d*He,G(f,2*y+2*p),f[2*y+2*p+1]+=w*He,G(f,2*y+2*p+1),f[2*y+2*p+1]+=d*te,G(f,2*y+2*p+1),f[2*y+2*p+2]+=w*te,G(f,2*y+2*p+2)}for(m=0;m<u;m++)f[m]=f[2*m+1]<<16|f[2*m];for(m=u;m<2*u;m++)f[m]=0;return new l(f,0)};function G(m,u){for(;(m[u]&65535)!=m[u];)m[u+1]+=m[u]>>>16,m[u]&=65535,u++}function ee(m,u){this.g=m,this.h=u}function j(m,u){if(L(u))throw Error("division by zero");if(L(m))return new ee(S,S);if(F(m))return u=j(x(m),u),new ee(x(u.g),x(u.h));if(F(u))return u=j(m,x(u)),new ee(x(u.g),u.h);if(m.g.length>30){if(F(m)||F(u))throw Error("slowDivide_ only works with positive integers.");for(var f=b,y=u;y.l(m)<=0;)f=W(f),y=W(y);var p=K(f,1),w=K(y,1);for(y=K(y,2),f=K(f,2);!L(y);){var d=w.add(y);d.l(m)<=0&&(p=p.add(f),w=d),y=K(y,1),f=K(f,1)}return u=z(m,p.j(u)),new ee(p,u)}for(p=S;m.l(u)>=0;){for(f=Math.max(1,Math.floor(m.m()/u.m())),y=Math.ceil(Math.log(f)/Math.LN2),y=y<=48?1:Math.pow(2,y-48),w=T(f),d=w.j(u);F(d)||d.l(m)>0;)f-=y,w=T(f),d=w.j(u);L(w)&&(w=b),p=p.add(w),m=z(m,d)}return new ee(p,m)}n.B=function(m){return j(this,m).h},n.and=function(m){const u=Math.max(this.g.length,m.g.length),f=[];for(let y=0;y<u;y++)f[y]=this.i(y)&m.i(y);return new l(f,this.h&m.h)},n.or=function(m){const u=Math.max(this.g.length,m.g.length),f=[];for(let y=0;y<u;y++)f[y]=this.i(y)|m.i(y);return new l(f,this.h|m.h)},n.xor=function(m){const u=Math.max(this.g.length,m.g.length),f=[];for(let y=0;y<u;y++)f[y]=this.i(y)^m.i(y);return new l(f,this.h^m.h)};function W(m){const u=m.g.length+1,f=[];for(let y=0;y<u;y++)f[y]=m.i(y)<<1|m.i(y-1)>>>31;return new l(f,m.h)}function K(m,u){const f=u>>5;u%=32;const y=m.g.length-f,p=[];for(let w=0;w<y;w++)p[w]=u>0?m.i(w+f)>>>u|m.i(w+f+1)<<32-u:m.i(w+f);return new l(p,m.h)}s.prototype.digest=s.prototype.A,s.prototype.reset=s.prototype.u,s.prototype.update=s.prototype.v,l.prototype.add=l.prototype.add,l.prototype.multiply=l.prototype.j,l.prototype.modulo=l.prototype.B,l.prototype.compare=l.prototype.l,l.prototype.toNumber=l.prototype.m,l.prototype.toString=l.prototype.toString,l.prototype.getBits=l.prototype.i,l.fromNumber=T,l.fromString=A,ns=l}).apply(typeof Gr<"u"?Gr:typeof self<"u"?self:typeof window<"u"?window:{});var _n=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var n,e=Object.defineProperty;function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof _n=="object"&&_n];for(var r=0;r<i.length;++r){var a=i[r];if(a&&a.Math==Math)return a}throw Error("Cannot find global object")}var s=t(this);function o(i,r){if(r)e:{var a=s;i=i.split(".");for(var h=0;h<i.length-1;h++){var _=i[h];if(!(_ in a))break e;a=a[_]}i=i[i.length-1],h=a[i],r=r(h),r!=h&&r!=null&&e(a,i,{configurable:!0,writable:!0,value:r})}}o("Symbol.dispose",function(i){return i||Symbol("Symbol.dispose")}),o("Array.prototype.values",function(i){return i||function(){return this[Symbol.iterator]()}}),o("Object.entries",function(i){return i||function(r){var a=[],h;for(h in r)Object.prototype.hasOwnProperty.call(r,h)&&a.push([h,r[h]]);return a}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var c=c||{},l=this||self;function g(i){var r=typeof i;return r=="object"&&i!=null||r=="function"}function v(i,r,a){return i.call.apply(i.bind,arguments)}function T(i,r,a){return T=v,T.apply(null,arguments)}function A(i,r){var a=Array.prototype.slice.call(arguments,1);return function(){var h=a.slice();return h.push.apply(h,arguments),i.apply(this,h)}}function S(i,r){function a(){}a.prototype=r.prototype,i.Z=r.prototype,i.prototype=new a,i.prototype.constructor=i,i.Ob=function(h,_,I){for(var E=Array(arguments.length-2),P=2;P<arguments.length;P++)E[P-2]=arguments[P];return r.prototype[_].apply(h,E)}}var b=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?i=>i&&AsyncContext.Snapshot.wrap(i):i=>i;function O(i){const r=i.length;if(r>0){const a=Array(r);for(let h=0;h<r;h++)a[h]=i[h];return a}return[]}function L(i,r){for(let h=1;h<arguments.length;h++){const _=arguments[h];var a=typeof _;if(a=a!="object"?a:_?Array.isArray(_)?"array":a:"null",a=="array"||a=="object"&&typeof _.length=="number"){a=i.length||0;const I=_.length||0;i.length=a+I;for(let E=0;E<I;E++)i[a+E]=_[E]}else i.push(_)}}class F{constructor(r,a){this.i=r,this.j=a,this.h=0,this.g=null}get(){let r;return this.h>0?(this.h--,r=this.g,this.g=r.next,r.next=null):r=this.i(),r}}function x(i){l.setTimeout(()=>{throw i},0)}function z(){var i=m;let r=null;return i.g&&(r=i.g,i.g=i.g.next,i.g||(i.h=null),r.next=null),r}class G{constructor(){this.h=this.g=null}add(r,a){const h=ee.get();h.set(r,a),this.h?this.h.next=h:this.g=h,this.h=h}}var ee=new F(()=>new j,i=>i.reset());class j{constructor(){this.next=this.g=this.h=null}set(r,a){this.h=r,this.g=a,this.next=null}reset(){this.next=this.g=this.h=null}}let W,K=!1,m=new G,u=()=>{const i=Promise.resolve(void 0);W=()=>{i.then(f)}};function f(){for(var i;i=z();){try{i.h.call(i.g)}catch(a){x(a)}var r=ee;r.j(i),r.h<100&&(r.h++,i.next=r.g,r.g=i)}K=!1}function y(){this.u=this.u,this.C=this.C}y.prototype.u=!1,y.prototype.dispose=function(){this.u||(this.u=!0,this.N())},y.prototype[Symbol.dispose]=function(){this.dispose()},y.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function p(i,r){this.type=i,this.g=this.target=r,this.defaultPrevented=!1}p.prototype.h=function(){this.defaultPrevented=!0};var w=(function(){if(!l.addEventListener||!Object.defineProperty)return!1;var i=!1,r=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const a=()=>{};l.addEventListener("test",a,r),l.removeEventListener("test",a,r)}catch{}return i})();function d(i){return/^[\s\xa0]*$/.test(i)}function te(i,r){p.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i&&this.init(i,r)}S(te,p),te.prototype.init=function(i,r){const a=this.type=i.type,h=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;this.target=i.target||i.srcElement,this.g=r,r=i.relatedTarget,r||(a=="mouseover"?r=i.fromElement:a=="mouseout"&&(r=i.toElement)),this.relatedTarget=r,h?(this.clientX=h.clientX!==void 0?h.clientX:h.pageX,this.clientY=h.clientY!==void 0?h.clientY:h.pageY,this.screenX=h.screenX||0,this.screenY=h.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=i.pointerType,this.state=i.state,this.i=i,i.defaultPrevented&&te.Z.h.call(this)},te.prototype.h=function(){te.Z.h.call(this);const i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var He="closure_listenable_"+(Math.random()*1e6|0),Ua=0;function Fa(i,r,a,h,_){this.listener=i,this.proxy=null,this.src=r,this.type=a,this.capture=!!h,this.ha=_,this.key=++Ua,this.da=this.fa=!1}function nn(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function sn(i,r,a){for(const h in i)r.call(a,i[h],h,i)}function Va(i,r){for(const a in i)r.call(void 0,i[a],a,i)}function fs(i){const r={};for(const a in i)r[a]=i[a];return r}const ps="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function gs(i,r){let a,h;for(let _=1;_<arguments.length;_++){h=arguments[_];for(a in h)i[a]=h[a];for(let I=0;I<ps.length;I++)a=ps[I],Object.prototype.hasOwnProperty.call(h,a)&&(i[a]=h[a])}}function rn(i){this.src=i,this.g={},this.h=0}rn.prototype.add=function(i,r,a,h,_){const I=i.toString();i=this.g[I],i||(i=this.g[I]=[],this.h++);const E=Gn(i,r,h,_);return E>-1?(r=i[E],a||(r.fa=!1)):(r=new Fa(r,this.src,I,!!h,_),r.fa=a,i.push(r)),r};function zn(i,r){const a=r.type;if(a in i.g){var h=i.g[a],_=Array.prototype.indexOf.call(h,r,void 0),I;(I=_>=0)&&Array.prototype.splice.call(h,_,1),I&&(nn(r),i.g[a].length==0&&(delete i.g[a],i.h--))}}function Gn(i,r,a,h){for(let _=0;_<i.length;++_){const I=i[_];if(!I.da&&I.listener==r&&I.capture==!!a&&I.ha==h)return _}return-1}var Wn="closure_lm_"+(Math.random()*1e6|0),qn={};function ms(i,r,a,h,_){if(Array.isArray(r)){for(let I=0;I<r.length;I++)ms(i,r[I],a,h,_);return null}return a=ws(a),i&&i[He]?i.J(r,a,g(h)?!!h.capture:!1,_):ja(i,r,a,!1,h,_)}function ja(i,r,a,h,_,I){if(!r)throw Error("Invalid event type");const E=g(_)?!!_.capture:!!_;let P=Jn(i);if(P||(i[Wn]=P=new rn(i)),a=P.add(r,a,h,E,I),a.proxy)return a;if(h=Ba(),a.proxy=h,h.src=i,h.listener=a,i.addEventListener)w||(_=E),_===void 0&&(_=!1),i.addEventListener(r.toString(),h,_);else if(i.attachEvent)i.attachEvent(_s(r.toString()),h);else if(i.addListener&&i.removeListener)i.addListener(h);else throw Error("addEventListener and attachEvent are unavailable.");return a}function Ba(){function i(a){return r.call(i.src,i.listener,a)}const r=$a;return i}function ys(i,r,a,h,_){if(Array.isArray(r))for(var I=0;I<r.length;I++)ys(i,r[I],a,h,_);else h=g(h)?!!h.capture:!!h,a=ws(a),i&&i[He]?(i=i.i,I=String(r).toString(),I in i.g&&(r=i.g[I],a=Gn(r,a,h,_),a>-1&&(nn(r[a]),Array.prototype.splice.call(r,a,1),r.length==0&&(delete i.g[I],i.h--)))):i&&(i=Jn(i))&&(r=i.g[r.toString()],i=-1,r&&(i=Gn(r,a,h,_)),(a=i>-1?r[i]:null)&&Kn(a))}function Kn(i){if(typeof i!="number"&&i&&!i.da){var r=i.src;if(r&&r[He])zn(r.i,i);else{var a=i.type,h=i.proxy;r.removeEventListener?r.removeEventListener(a,h,i.capture):r.detachEvent?r.detachEvent(_s(a),h):r.addListener&&r.removeListener&&r.removeListener(h),(a=Jn(r))?(zn(a,i),a.h==0&&(a.src=null,r[Wn]=null)):nn(i)}}}function _s(i){return i in qn?qn[i]:qn[i]="on"+i}function $a(i,r){if(i.da)i=!0;else{r=new te(r,this);const a=i.listener,h=i.ha||i.src;i.fa&&Kn(i),i=a.call(h,r)}return i}function Jn(i){return i=i[Wn],i instanceof rn?i:null}var Xn="__closure_events_fn_"+(Math.random()*1e9>>>0);function ws(i){return typeof i=="function"?i:(i[Xn]||(i[Xn]=function(r){return i.handleEvent(r)}),i[Xn])}function q(){y.call(this),this.i=new rn(this),this.M=this,this.G=null}S(q,y),q.prototype[He]=!0,q.prototype.removeEventListener=function(i,r,a,h){ys(this,i,r,a,h)};function J(i,r){var a,h=i.G;if(h)for(a=[];h;h=h.G)a.push(h);if(i=i.M,h=r.type||r,typeof r=="string")r=new p(r,i);else if(r instanceof p)r.target=r.target||i;else{var _=r;r=new p(h,i),gs(r,_)}_=!0;let I,E;if(a)for(E=a.length-1;E>=0;E--)I=r.g=a[E],_=on(I,h,!0,r)&&_;if(I=r.g=i,_=on(I,h,!0,r)&&_,_=on(I,h,!1,r)&&_,a)for(E=0;E<a.length;E++)I=r.g=a[E],_=on(I,h,!1,r)&&_}q.prototype.N=function(){if(q.Z.N.call(this),this.i){var i=this.i;for(const r in i.g){const a=i.g[r];for(let h=0;h<a.length;h++)nn(a[h]);delete i.g[r],i.h--}}this.G=null},q.prototype.J=function(i,r,a,h){return this.i.add(String(i),r,!1,a,h)},q.prototype.K=function(i,r,a,h){return this.i.add(String(i),r,!0,a,h)};function on(i,r,a,h){if(r=i.i.g[String(r)],!r)return!0;r=r.concat();let _=!0;for(let I=0;I<r.length;++I){const E=r[I];if(E&&!E.da&&E.capture==a){const P=E.listener,$=E.ha||E.src;E.fa&&zn(i.i,E),_=P.call($,h)!==!1&&_}}return _&&!h.defaultPrevented}function Ha(i,r){if(typeof i!="function")if(i&&typeof i.handleEvent=="function")i=T(i.handleEvent,i);else throw Error("Invalid listener argument");return Number(r)>2147483647?-1:l.setTimeout(i,r||0)}function vs(i){i.g=Ha(()=>{i.g=null,i.i&&(i.i=!1,vs(i))},i.l);const r=i.h;i.h=null,i.m.apply(null,r)}class za extends y{constructor(r,a){super(),this.m=r,this.l=a,this.h=null,this.i=!1,this.g=null}j(r){this.h=arguments,this.g?this.i=!0:vs(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function bt(i){y.call(this),this.h=i,this.g={}}S(bt,y);var Is=[];function Ts(i){sn(i.g,function(r,a){this.g.hasOwnProperty(a)&&Kn(r)},i),i.g={}}bt.prototype.N=function(){bt.Z.N.call(this),Ts(this)},bt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Yn=l.JSON.stringify,Ga=l.JSON.parse,Wa=class{stringify(i){return l.JSON.stringify(i,void 0)}parse(i){return l.JSON.parse(i,void 0)}};function Es(){}function qa(){}var At={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Qn(){p.call(this,"d")}S(Qn,p);function Zn(){p.call(this,"c")}S(Zn,p);var ct={},bs=null;function ei(){return bs=bs||new q}ct.Ia="serverreachability";function As(i){p.call(this,ct.Ia,i)}S(As,p);function St(i){const r=ei();J(r,new As(r))}ct.STAT_EVENT="statevent";function Ss(i,r){p.call(this,ct.STAT_EVENT,i),this.stat=r}S(Ss,p);function X(i){const r=ei();J(r,new Ss(r,i))}ct.Ja="timingevent";function Cs(i,r){p.call(this,ct.Ja,i),this.size=r}S(Cs,p);function Ct(i,r){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){i()},r)}function Pt(){this.g=!0}Pt.prototype.ua=function(){this.g=!1};function Ka(i,r,a,h,_,I){i.info(function(){if(i.g)if(I){var E="",P=I.split("&");for(let M=0;M<P.length;M++){var $=P[M].split("=");if($.length>1){const H=$[0];$=$[1];const fe=H.split("_");E=fe.length>=2&&fe[1]=="type"?E+(H+"="+$+"&"):E+(H+"=redacted&")}}}else E=null;else E=I;return"XMLHTTP REQ ("+h+") [attempt "+_+"]: "+r+`
`+a+`
`+E})}function Ja(i,r,a,h,_,I,E){i.info(function(){return"XMLHTTP RESP ("+h+") [ attempt "+_+"]: "+r+`
`+a+`
`+I+" "+E})}function lt(i,r,a,h){i.info(function(){return"XMLHTTP TEXT ("+r+"): "+Ya(i,a)+(h?" "+h:"")})}function Xa(i,r){i.info(function(){return"TIMEOUT: "+r})}Pt.prototype.info=function(){};function Ya(i,r){if(!i.g)return r;if(!r)return null;try{const I=JSON.parse(r);if(I){for(i=0;i<I.length;i++)if(Array.isArray(I[i])){var a=I[i];if(!(a.length<2)){var h=a[1];if(Array.isArray(h)&&!(h.length<1)){var _=h[0];if(_!="noop"&&_!="stop"&&_!="close")for(let E=1;E<h.length;E++)h[E]=""}}}}return Yn(I)}catch{return r}}var ti={NO_ERROR:0,TIMEOUT:8},Qa={},Ps;function ni(){}S(ni,Es),ni.prototype.g=function(){return new XMLHttpRequest},Ps=new ni;function kt(i){return encodeURIComponent(String(i))}function Za(i){var r=1;i=i.split(":");const a=[];for(;r>0&&i.length;)a.push(i.shift()),r--;return i.length&&a.push(i.join(":")),a}function ke(i,r,a,h){this.j=i,this.i=r,this.l=a,this.S=h||1,this.V=new bt(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new ks}function ks(){this.i=null,this.g="",this.h=!1}var Rs={},ii={};function si(i,r,a){i.M=1,i.A=cn(de(r)),i.u=a,i.R=!0,Ds(i,null)}function Ds(i,r){i.F=Date.now(),an(i),i.B=de(i.A);var a=i.B,h=i.S;Array.isArray(h)||(h=[String(h)]),zs(a.i,"t",h),i.C=0,a=i.j.L,i.h=new ks,i.g=cr(i.j,a?r:null,!i.u),i.P>0&&(i.O=new za(T(i.Y,i,i.g),i.P)),r=i.V,a=i.g,h=i.ba;var _="readystatechange";Array.isArray(_)||(_&&(Is[0]=_.toString()),_=Is);for(let I=0;I<_.length;I++){const E=ms(a,_[I],h||r.handleEvent,!1,r.h||r);if(!E)break;r.g[E.key]=E}r=i.J?fs(i.J):{},i.u?(i.v||(i.v="POST"),r["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.B,i.v,i.u,r)):(i.v="GET",i.g.ea(i.B,i.v,null,r)),St(),Ka(i.i,i.v,i.B,i.l,i.S,i.u)}ke.prototype.ba=function(i){i=i.target;const r=this.O;r&&Ne(i)==3?r.j():this.Y(i)},ke.prototype.Y=function(i){try{if(i==this.g)e:{const P=Ne(this.g),$=this.g.ya(),M=this.g.ca();if(!(P<3)&&(P!=3||this.g&&(this.h.h||this.g.la()||Ys(this.g)))){this.K||P!=4||$==7||($==8||M<=0?St(3):St(2)),ri(this);var r=this.g.ca();this.X=r;var a=ec(this);if(this.o=r==200,Ja(this.i,this.v,this.B,this.l,this.S,P,r),this.o){if(this.U&&!this.L){t:{if(this.g){var h,_=this.g;if((h=_.g?_.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!d(h)){var I=h;break t}}I=null}if(i=I)lt(this.i,this.l,i,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,oi(this,i);else{this.o=!1,this.m=3,X(12),ze(this),Rt(this);break e}}if(this.R){i=!0;let H;for(;!this.K&&this.C<a.length;)if(H=tc(this,a),H==ii){P==4&&(this.m=4,X(14),i=!1),lt(this.i,this.l,null,"[Incomplete Response]");break}else if(H==Rs){this.m=4,X(15),lt(this.i,this.l,a,"[Invalid Chunk]"),i=!1;break}else lt(this.i,this.l,H,null),oi(this,H);if(Ns(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),P!=4||a.length!=0||this.h.h||(this.m=1,X(16),i=!1),this.o=this.o&&i,!i)lt(this.i,this.l,a,"[Invalid Chunked Response]"),ze(this),Rt(this);else if(a.length>0&&!this.W){this.W=!0;var E=this.j;E.g==this&&E.aa&&!E.P&&(E.j.info("Great, no buffering proxy detected. Bytes received: "+a.length),pi(E),E.P=!0,X(11))}}else lt(this.i,this.l,a,null),oi(this,a);P==4&&ze(this),this.o&&!this.K&&(P==4?sr(this.j,this):(this.o=!1,an(this)))}else gc(this.g),r==400&&a.indexOf("Unknown SID")>0?(this.m=3,X(12)):(this.m=0,X(13)),ze(this),Rt(this)}}}catch{}finally{}};function ec(i){if(!Ns(i))return i.g.la();const r=Ys(i.g);if(r==="")return"";let a="";const h=r.length,_=Ne(i.g)==4;if(!i.h.i){if(typeof TextDecoder>"u")return ze(i),Rt(i),"";i.h.i=new l.TextDecoder}for(let I=0;I<h;I++)i.h.h=!0,a+=i.h.i.decode(r[I],{stream:!(_&&I==h-1)});return r.length=0,i.h.g+=a,i.C=0,i.h.g}function Ns(i){return i.g?i.v=="GET"&&i.M!=2&&i.j.Aa:!1}function tc(i,r){var a=i.C,h=r.indexOf(`
`,a);return h==-1?ii:(a=Number(r.substring(a,h)),isNaN(a)?Rs:(h+=1,h+a>r.length?ii:(r=r.slice(h,h+a),i.C=h+a,r)))}ke.prototype.cancel=function(){this.K=!0,ze(this)};function an(i){i.T=Date.now()+i.H,Os(i,i.H)}function Os(i,r){if(i.D!=null)throw Error("WatchDog timer not null");i.D=Ct(T(i.aa,i),r)}function ri(i){i.D&&(l.clearTimeout(i.D),i.D=null)}ke.prototype.aa=function(){this.D=null;const i=Date.now();i-this.T>=0?(Xa(this.i,this.B),this.M!=2&&(St(),X(17)),ze(this),this.m=2,Rt(this)):Os(this,this.T-i)};function Rt(i){i.j.I==0||i.K||sr(i.j,i)}function ze(i){ri(i);var r=i.O;r&&typeof r.dispose=="function"&&r.dispose(),i.O=null,Ts(i.V),i.g&&(r=i.g,i.g=null,r.abort(),r.dispose())}function oi(i,r){try{var a=i.j;if(a.I!=0&&(a.g==i||ai(a.h,i))){if(!i.L&&ai(a.h,i)&&a.I==3){try{var h=a.Ba.g.parse(r)}catch{h=null}if(Array.isArray(h)&&h.length==3){var _=h;if(_[0]==0){e:if(!a.v){if(a.g)if(a.g.F+3e3<i.F)fn(a),un(a);else break e;fi(a),X(18)}}else a.xa=_[1],0<a.xa-a.K&&_[2]<37500&&a.F&&a.A==0&&!a.C&&(a.C=Ct(T(a.Va,a),6e3));xs(a.h)<=1&&a.ta&&(a.ta=void 0)}else We(a,11)}else if((i.L||a.g==i)&&fn(a),!d(r))for(_=a.Ba.g.parse(r),r=0;r<_.length;r++){let M=_[r];const H=M[0];if(!(H<=a.K))if(a.K=H,M=M[1],a.I==2)if(M[0]=="c"){a.M=M[1],a.ba=M[2];const fe=M[3];fe!=null&&(a.ka=fe,a.j.info("VER="+a.ka));const qe=M[4];qe!=null&&(a.za=qe,a.j.info("SVER="+a.za));const Oe=M[5];Oe!=null&&typeof Oe=="number"&&Oe>0&&(h=1.5*Oe,a.O=h,a.j.info("backChannelRequestTimeoutMs_="+h)),h=a;const Le=i.g;if(Le){const pn=Le.g?Le.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(pn){var I=h.h;I.g||pn.indexOf("spdy")==-1&&pn.indexOf("quic")==-1&&pn.indexOf("h2")==-1||(I.j=I.l,I.g=new Set,I.h&&(ci(I,I.h),I.h=null))}if(h.G){const gi=Le.g?Le.g.getResponseHeader("X-HTTP-Session-Id"):null;gi&&(h.wa=gi,U(h.J,h.G,gi))}}a.I=3,a.l&&a.l.ra(),a.aa&&(a.T=Date.now()-i.F,a.j.info("Handshake RTT: "+a.T+"ms")),h=a;var E=i;if(h.na=ar(h,h.L?h.ba:null,h.W),E.L){Us(h.h,E);var P=E,$=h.O;$&&(P.H=$),P.D&&(ri(P),an(P)),h.g=E}else nr(h);a.i.length>0&&dn(a)}else M[0]!="stop"&&M[0]!="close"||We(a,7);else a.I==3&&(M[0]=="stop"||M[0]=="close"?M[0]=="stop"?We(a,7):di(a):M[0]!="noop"&&a.l&&a.l.qa(M),a.A=0)}}St(4)}catch{}}var nc=class{constructor(i,r){this.g=i,this.map=r}};function Ls(i){this.l=i||10,l.PerformanceNavigationTiming?(i=l.performance.getEntriesByType("navigation"),i=i.length>0&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Ms(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function xs(i){return i.h?1:i.g?i.g.size:0}function ai(i,r){return i.h?i.h==r:i.g?i.g.has(r):!1}function ci(i,r){i.g?i.g.add(r):i.h=r}function Us(i,r){i.h&&i.h==r?i.h=null:i.g&&i.g.has(r)&&i.g.delete(r)}Ls.prototype.cancel=function(){if(this.i=Fs(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function Fs(i){if(i.h!=null)return i.i.concat(i.h.G);if(i.g!=null&&i.g.size!==0){let r=i.i;for(const a of i.g.values())r=r.concat(a.G);return r}return O(i.i)}var Vs=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function ic(i,r){if(i){i=i.split("&");for(let a=0;a<i.length;a++){const h=i[a].indexOf("=");let _,I=null;h>=0?(_=i[a].substring(0,h),I=i[a].substring(h+1)):_=i[a],r(_,I?decodeURIComponent(I.replace(/\+/g," ")):"")}}}function Re(i){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let r;i instanceof Re?(this.l=i.l,Dt(this,i.j),this.o=i.o,this.g=i.g,Nt(this,i.u),this.h=i.h,li(this,Gs(i.i)),this.m=i.m):i&&(r=String(i).match(Vs))?(this.l=!1,Dt(this,r[1]||"",!0),this.o=Ot(r[2]||""),this.g=Ot(r[3]||"",!0),Nt(this,r[4]),this.h=Ot(r[5]||"",!0),li(this,r[6]||"",!0),this.m=Ot(r[7]||"")):(this.l=!1,this.i=new Mt(null,this.l))}Re.prototype.toString=function(){const i=[];var r=this.j;r&&i.push(Lt(r,js,!0),":");var a=this.g;return(a||r=="file")&&(i.push("//"),(r=this.o)&&i.push(Lt(r,js,!0),"@"),i.push(kt(a).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a=this.u,a!=null&&i.push(":",String(a))),(a=this.h)&&(this.g&&a.charAt(0)!="/"&&i.push("/"),i.push(Lt(a,a.charAt(0)=="/"?oc:rc,!0))),(a=this.i.toString())&&i.push("?",a),(a=this.m)&&i.push("#",Lt(a,cc)),i.join("")},Re.prototype.resolve=function(i){const r=de(this);let a=!!i.j;a?Dt(r,i.j):a=!!i.o,a?r.o=i.o:a=!!i.g,a?r.g=i.g:a=i.u!=null;var h=i.h;if(a)Nt(r,i.u);else if(a=!!i.h){if(h.charAt(0)!="/")if(this.g&&!this.h)h="/"+h;else{var _=r.h.lastIndexOf("/");_!=-1&&(h=r.h.slice(0,_+1)+h)}if(_=h,_==".."||_==".")h="";else if(_.indexOf("./")!=-1||_.indexOf("/.")!=-1){h=_.lastIndexOf("/",0)==0,_=_.split("/");const I=[];for(let E=0;E<_.length;){const P=_[E++];P=="."?h&&E==_.length&&I.push(""):P==".."?((I.length>1||I.length==1&&I[0]!="")&&I.pop(),h&&E==_.length&&I.push("")):(I.push(P),h=!0)}h=I.join("/")}else h=_}return a?r.h=h:a=i.i.toString()!=="",a?li(r,Gs(i.i)):a=!!i.m,a&&(r.m=i.m),r};function de(i){return new Re(i)}function Dt(i,r,a){i.j=a?Ot(r,!0):r,i.j&&(i.j=i.j.replace(/:$/,""))}function Nt(i,r){if(r){if(r=Number(r),isNaN(r)||r<0)throw Error("Bad port number "+r);i.u=r}else i.u=null}function li(i,r,a){r instanceof Mt?(i.i=r,lc(i.i,i.l)):(a||(r=Lt(r,ac)),i.i=new Mt(r,i.l))}function U(i,r,a){i.i.set(r,a)}function cn(i){return U(i,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),i}function Ot(i,r){return i?r?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function Lt(i,r,a){return typeof i=="string"?(i=encodeURI(i).replace(r,sc),a&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function sc(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var js=/[#\/\?@]/g,rc=/[#\?:]/g,oc=/[#\?]/g,ac=/[#\?@]/g,cc=/#/g;function Mt(i,r){this.h=this.g=null,this.i=i||null,this.j=!!r}function Ge(i){i.g||(i.g=new Map,i.h=0,i.i&&ic(i.i,function(r,a){i.add(decodeURIComponent(r.replace(/\+/g," ")),a)}))}n=Mt.prototype,n.add=function(i,r){Ge(this),this.i=null,i=ht(this,i);let a=this.g.get(i);return a||this.g.set(i,a=[]),a.push(r),this.h+=1,this};function Bs(i,r){Ge(i),r=ht(i,r),i.g.has(r)&&(i.i=null,i.h-=i.g.get(r).length,i.g.delete(r))}function $s(i,r){return Ge(i),r=ht(i,r),i.g.has(r)}n.forEach=function(i,r){Ge(this),this.g.forEach(function(a,h){a.forEach(function(_){i.call(r,_,h,this)},this)},this)};function Hs(i,r){Ge(i);let a=[];if(typeof r=="string")$s(i,r)&&(a=a.concat(i.g.get(ht(i,r))));else for(i=Array.from(i.g.values()),r=0;r<i.length;r++)a=a.concat(i[r]);return a}n.set=function(i,r){return Ge(this),this.i=null,i=ht(this,i),$s(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[r]),this.h+=1,this},n.get=function(i,r){return i?(i=Hs(this,i),i.length>0?String(i[0]):r):r};function zs(i,r,a){Bs(i,r),a.length>0&&(i.i=null,i.g.set(ht(i,r),O(a)),i.h+=a.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],r=Array.from(this.g.keys());for(let h=0;h<r.length;h++){var a=r[h];const _=kt(a);a=Hs(this,a);for(let I=0;I<a.length;I++){let E=_;a[I]!==""&&(E+="="+kt(a[I])),i.push(E)}}return this.i=i.join("&")};function Gs(i){const r=new Mt;return r.i=i.i,i.g&&(r.g=new Map(i.g),r.h=i.h),r}function ht(i,r){return r=String(r),i.j&&(r=r.toLowerCase()),r}function lc(i,r){r&&!i.j&&(Ge(i),i.i=null,i.g.forEach(function(a,h){const _=h.toLowerCase();h!=_&&(Bs(this,h),zs(this,_,a))},i)),i.j=r}function hc(i,r){const a=new Pt;if(l.Image){const h=new Image;h.onload=A(De,a,"TestLoadImage: loaded",!0,r,h),h.onerror=A(De,a,"TestLoadImage: error",!1,r,h),h.onabort=A(De,a,"TestLoadImage: abort",!1,r,h),h.ontimeout=A(De,a,"TestLoadImage: timeout",!1,r,h),l.setTimeout(function(){h.ontimeout&&h.ontimeout()},1e4),h.src=i}else r(!1)}function uc(i,r){const a=new Pt,h=new AbortController,_=setTimeout(()=>{h.abort(),De(a,"TestPingServer: timeout",!1,r)},1e4);fetch(i,{signal:h.signal}).then(I=>{clearTimeout(_),I.ok?De(a,"TestPingServer: ok",!0,r):De(a,"TestPingServer: server error",!1,r)}).catch(()=>{clearTimeout(_),De(a,"TestPingServer: error",!1,r)})}function De(i,r,a,h,_){try{_&&(_.onload=null,_.onerror=null,_.onabort=null,_.ontimeout=null),h(a)}catch{}}function dc(){this.g=new Wa}function hi(i){this.i=i.Sb||null,this.h=i.ab||!1}S(hi,Es),hi.prototype.g=function(){return new ln(this.i,this.h)};function ln(i,r){q.call(this),this.H=i,this.o=r,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}S(ln,q),n=ln.prototype,n.open=function(i,r){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=i,this.D=r,this.readyState=1,Ut(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const r={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};i&&(r.body=i),(this.H||l).fetch(new Request(this.D,r)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,xt(this)),this.readyState=0},n.Pa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,Ut(this)),this.g&&(this.readyState=3,Ut(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Ws(this)}else i.text().then(this.Oa.bind(this),this.ga.bind(this))};function Ws(i){i.j.read().then(i.Ma.bind(i)).catch(i.ga.bind(i))}n.Ma=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var r=i.value?i.value:new Uint8Array(0);(r=this.B.decode(r,{stream:!i.done}))&&(this.response=this.responseText+=r)}i.done?xt(this):Ut(this),this.readyState==3&&Ws(this)}},n.Oa=function(i){this.g&&(this.response=this.responseText=i,xt(this))},n.Na=function(i){this.g&&(this.response=i,xt(this))},n.ga=function(){this.g&&xt(this)};function xt(i){i.readyState=4,i.l=null,i.j=null,i.B=null,Ut(i)}n.setRequestHeader=function(i,r){this.A.append(i,r)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],r=this.h.entries();for(var a=r.next();!a.done;)a=a.value,i.push(a[0]+": "+a[1]),a=r.next();return i.join(`\r
`)};function Ut(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(ln.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function qs(i){let r="";return sn(i,function(a,h){r+=h,r+=":",r+=a,r+=`\r
`}),r}function ui(i,r,a){e:{for(h in a){var h=!1;break e}h=!0}h||(a=qs(a),typeof i=="string"?a!=null&&kt(a):U(i,r,a))}function V(i){q.call(this),this.headers=new Map,this.L=i||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}S(V,q);var fc=/^https?$/i,pc=["POST","PUT"];n=V.prototype,n.Fa=function(i){this.H=i},n.ea=function(i,r,a,h){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);r=r?r.toUpperCase():"GET",this.D=i,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Ps.g(),this.g.onreadystatechange=b(T(this.Ca,this));try{this.B=!0,this.g.open(r,String(i),!0),this.B=!1}catch(I){Ks(this,I);return}if(i=a||"",a=new Map(this.headers),h)if(Object.getPrototypeOf(h)===Object.prototype)for(var _ in h)a.set(_,h[_]);else if(typeof h.keys=="function"&&typeof h.get=="function")for(const I of h.keys())a.set(I,h.get(I));else throw Error("Unknown input type for opt_headers: "+String(h));h=Array.from(a.keys()).find(I=>I.toLowerCase()=="content-type"),_=l.FormData&&i instanceof l.FormData,!(Array.prototype.indexOf.call(pc,r,void 0)>=0)||h||_||a.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[I,E]of a)this.g.setRequestHeader(I,E);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(i),this.v=!1}catch(I){Ks(this,I)}};function Ks(i,r){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=r,i.o=5,Js(i),hn(i)}function Js(i){i.A||(i.A=!0,J(i,"complete"),J(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=i||7,J(this,"complete"),J(this,"abort"),hn(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),hn(this,!0)),V.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?Xs(this):this.Xa())},n.Xa=function(){Xs(this)};function Xs(i){if(i.h&&typeof c<"u"){if(i.v&&Ne(i)==4)setTimeout(i.Ca.bind(i),0);else if(J(i,"readystatechange"),Ne(i)==4){i.h=!1;try{const I=i.ca();e:switch(I){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var r=!0;break e;default:r=!1}var a;if(!(a=r)){var h;if(h=I===0){let E=String(i.D).match(Vs)[1]||null;!E&&l.self&&l.self.location&&(E=l.self.location.protocol.slice(0,-1)),h=!fc.test(E?E.toLowerCase():"")}a=h}if(a)J(i,"complete"),J(i,"success");else{i.o=6;try{var _=Ne(i)>2?i.g.statusText:""}catch{_=""}i.l=_+" ["+i.ca()+"]",Js(i)}}finally{hn(i)}}}}function hn(i,r){if(i.g){i.m&&(clearTimeout(i.m),i.m=null);const a=i.g;i.g=null,r||J(i,"ready");try{a.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function Ne(i){return i.g?i.g.readyState:0}n.ca=function(){try{return Ne(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(i){if(this.g){var r=this.g.responseText;return i&&r.indexOf(i)==0&&(r=r.substring(i.length)),Ga(r)}};function Ys(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.F){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function gc(i){const r={};i=(i.g&&Ne(i)>=2&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let h=0;h<i.length;h++){if(d(i[h]))continue;var a=Za(i[h]);const _=a[0];if(a=a[1],typeof a!="string")continue;a=a.trim();const I=r[_]||[];r[_]=I,I.push(a)}Va(r,function(h){return h.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ft(i,r,a){return a&&a.internalChannelParams&&a.internalChannelParams[i]||r}function Qs(i){this.za=0,this.i=[],this.j=new Pt,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Ft("failFast",!1,i),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Ft("baseRetryDelayMs",5e3,i),this.Za=Ft("retryDelaySeedMs",1e4,i),this.Ta=Ft("forwardChannelMaxRetries",2,i),this.va=Ft("forwardChannelRequestTimeoutMs",2e4,i),this.ma=i&&i.xmlHttpFactory||void 0,this.Ua=i&&i.Rb||void 0,this.Aa=i&&i.useFetchStreams||!1,this.O=void 0,this.L=i&&i.supportsCrossDomainXhr||!1,this.M="",this.h=new Ls(i&&i.concurrentRequestLimit),this.Ba=new dc,this.S=i&&i.fastHandshake||!1,this.R=i&&i.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=i&&i.Pb||!1,i&&i.ua&&this.j.ua(),i&&i.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&i&&i.detectBufferingProxy||!1,this.ia=void 0,i&&i.longPollingTimeout&&i.longPollingTimeout>0&&(this.ia=i.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=Qs.prototype,n.ka=8,n.I=1,n.connect=function(i,r,a,h){X(0),this.W=i,this.H=r||{},a&&h!==void 0&&(this.H.OSID=a,this.H.OAID=h),this.F=this.X,this.J=ar(this,null,this.W),dn(this)};function di(i){if(Zs(i),i.I==3){var r=i.V++,a=de(i.J);if(U(a,"SID",i.M),U(a,"RID",r),U(a,"TYPE","terminate"),Vt(i,a),r=new ke(i,i.j,r),r.M=2,r.A=cn(de(a)),a=!1,l.navigator&&l.navigator.sendBeacon)try{a=l.navigator.sendBeacon(r.A.toString(),"")}catch{}!a&&l.Image&&(new Image().src=r.A,a=!0),a||(r.g=cr(r.j,null),r.g.ea(r.A)),r.F=Date.now(),an(r)}or(i)}function un(i){i.g&&(pi(i),i.g.cancel(),i.g=null)}function Zs(i){un(i),i.v&&(l.clearTimeout(i.v),i.v=null),fn(i),i.h.cancel(),i.m&&(typeof i.m=="number"&&l.clearTimeout(i.m),i.m=null)}function dn(i){if(!Ms(i.h)&&!i.m){i.m=!0;var r=i.Ea;W||u(),K||(W(),K=!0),m.add(r,i),i.D=0}}function mc(i,r){return xs(i.h)>=i.h.j-(i.m?1:0)?!1:i.m?(i.i=r.G.concat(i.i),!0):i.I==1||i.I==2||i.D>=(i.Sa?0:i.Ta)?!1:(i.m=Ct(T(i.Ea,i,r),rr(i,i.D)),i.D++,!0)}n.Ea=function(i){if(this.m)if(this.m=null,this.I==1){if(!i){this.V=Math.floor(Math.random()*1e5),i=this.V++;const _=new ke(this,this.j,i);let I=this.o;if(this.U&&(I?(I=fs(I),gs(I,this.U)):I=this.U),this.u!==null||this.R||(_.J=I,I=null),this.S)e:{for(var r=0,a=0;a<this.i.length;a++){t:{var h=this.i[a];if("__data__"in h.map&&(h=h.map.__data__,typeof h=="string")){h=h.length;break t}h=void 0}if(h===void 0)break;if(r+=h,r>4096){r=a;break e}if(r===4096||a===this.i.length-1){r=a+1;break e}}r=1e3}else r=1e3;r=tr(this,_,r),a=de(this.J),U(a,"RID",i),U(a,"CVER",22),this.G&&U(a,"X-HTTP-Session-Id",this.G),Vt(this,a),I&&(this.R?r="headers="+kt(qs(I))+"&"+r:this.u&&ui(a,this.u,I)),ci(this.h,_),this.Ra&&U(a,"TYPE","init"),this.S?(U(a,"$req",r),U(a,"SID","null"),_.U=!0,si(_,a,null)):si(_,a,r),this.I=2}}else this.I==3&&(i?er(this,i):this.i.length==0||Ms(this.h)||er(this))};function er(i,r){var a;r?a=r.l:a=i.V++;const h=de(i.J);U(h,"SID",i.M),U(h,"RID",a),U(h,"AID",i.K),Vt(i,h),i.u&&i.o&&ui(h,i.u,i.o),a=new ke(i,i.j,a,i.D+1),i.u===null&&(a.J=i.o),r&&(i.i=r.G.concat(i.i)),r=tr(i,a,1e3),a.H=Math.round(i.va*.5)+Math.round(i.va*.5*Math.random()),ci(i.h,a),si(a,h,r)}function Vt(i,r){i.H&&sn(i.H,function(a,h){U(r,h,a)}),i.l&&sn({},function(a,h){U(r,h,a)})}function tr(i,r,a){a=Math.min(i.i.length,a);const h=i.l?T(i.l.Ka,i.l,i):null;e:{var _=i.i;let P=-1;for(;;){const $=["count="+a];P==-1?a>0?(P=_[0].g,$.push("ofs="+P)):P=0:$.push("ofs="+P);let M=!0;for(let H=0;H<a;H++){var I=_[H].g;const fe=_[H].map;if(I-=P,I<0)P=Math.max(0,_[H].g-100),M=!1;else try{I="req"+I+"_"||"";try{var E=fe instanceof Map?fe:Object.entries(fe);for(const[qe,Oe]of E){let Le=Oe;g(Oe)&&(Le=Yn(Oe)),$.push(I+qe+"="+encodeURIComponent(Le))}}catch(qe){throw $.push(I+"type="+encodeURIComponent("_badmap")),qe}}catch{h&&h(fe)}}if(M){E=$.join("&");break e}}E=void 0}return i=i.i.splice(0,a),r.G=i,E}function nr(i){if(!i.g&&!i.v){i.Y=1;var r=i.Da;W||u(),K||(W(),K=!0),m.add(r,i),i.A=0}}function fi(i){return i.g||i.v||i.A>=3?!1:(i.Y++,i.v=Ct(T(i.Da,i),rr(i,i.A)),i.A++,!0)}n.Da=function(){if(this.v=null,ir(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var i=4*this.T;this.j.info("BP detection timer enabled: "+i),this.B=Ct(T(this.Wa,this),i)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,X(10),un(this),ir(this))};function pi(i){i.B!=null&&(l.clearTimeout(i.B),i.B=null)}function ir(i){i.g=new ke(i,i.j,"rpc",i.Y),i.u===null&&(i.g.J=i.o),i.g.P=0;var r=de(i.na);U(r,"RID","rpc"),U(r,"SID",i.M),U(r,"AID",i.K),U(r,"CI",i.F?"0":"1"),!i.F&&i.ia&&U(r,"TO",i.ia),U(r,"TYPE","xmlhttp"),Vt(i,r),i.u&&i.o&&ui(r,i.u,i.o),i.O&&(i.g.H=i.O);var a=i.g;i=i.ba,a.M=1,a.A=cn(de(r)),a.u=null,a.R=!0,Ds(a,i)}n.Va=function(){this.C!=null&&(this.C=null,un(this),fi(this),X(19))};function fn(i){i.C!=null&&(l.clearTimeout(i.C),i.C=null)}function sr(i,r){var a=null;if(i.g==r){fn(i),pi(i),i.g=null;var h=2}else if(ai(i.h,r))a=r.G,Us(i.h,r),h=1;else return;if(i.I!=0){if(r.o)if(h==1){a=r.u?r.u.length:0,r=Date.now()-r.F;var _=i.D;h=ei(),J(h,new Cs(h,a)),dn(i)}else nr(i);else if(_=r.m,_==3||_==0&&r.X>0||!(h==1&&mc(i,r)||h==2&&fi(i)))switch(a&&a.length>0&&(r=i.h,r.i=r.i.concat(a)),_){case 1:We(i,5);break;case 4:We(i,10);break;case 3:We(i,6);break;default:We(i,2)}}}function rr(i,r){let a=i.Qa+Math.floor(Math.random()*i.Za);return i.isActive()||(a*=2),a*r}function We(i,r){if(i.j.info("Error code "+r),r==2){var a=T(i.bb,i),h=i.Ua;const _=!h;h=new Re(h||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Dt(h,"https"),cn(h),_?hc(h.toString(),a):uc(h.toString(),a)}else X(2);i.I=0,i.l&&i.l.pa(r),or(i),Zs(i)}n.bb=function(i){i?(this.j.info("Successfully pinged google.com"),X(2)):(this.j.info("Failed to ping google.com"),X(1))};function or(i){if(i.I=0,i.ja=[],i.l){const r=Fs(i.h);(r.length!=0||i.i.length!=0)&&(L(i.ja,r),L(i.ja,i.i),i.h.i.length=0,O(i.i),i.i.length=0),i.l.oa()}}function ar(i,r,a){var h=a instanceof Re?de(a):new Re(a);if(h.g!="")r&&(h.g=r+"."+h.g),Nt(h,h.u);else{var _=l.location;h=_.protocol,r=r?r+"."+_.hostname:_.hostname,_=+_.port;const I=new Re(null);h&&Dt(I,h),r&&(I.g=r),_&&Nt(I,_),a&&(I.h=a),h=I}return a=i.G,r=i.wa,a&&r&&U(h,a,r),U(h,"VER",i.ka),Vt(i,h),h}function cr(i,r,a){if(r&&!i.L)throw Error("Can't create secondary domain capable XhrIo object.");return r=i.Aa&&!i.ma?new V(new hi({ab:a})):new V(i.ma),r.Fa(i.L),r}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function lr(){}n=lr.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function ie(i,r){q.call(this),this.g=new Qs(r),this.l=i,this.h=r&&r.messageUrlParams||null,i=r&&r.messageHeaders||null,r&&r.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=r&&r.initMessageHeaders||null,r&&r.messageContentType&&(i?i["X-WebChannel-Content-Type"]=r.messageContentType:i={"X-WebChannel-Content-Type":r.messageContentType}),r&&r.sa&&(i?i["X-WebChannel-Client-Profile"]=r.sa:i={"X-WebChannel-Client-Profile":r.sa}),this.g.U=i,(i=r&&r.Qb)&&!d(i)&&(this.g.u=i),this.A=r&&r.supportsCrossDomainXhr||!1,this.v=r&&r.sendRawJson||!1,(r=r&&r.httpSessionIdParam)&&!d(r)&&(this.g.G=r,i=this.h,i!==null&&r in i&&(i=this.h,r in i&&delete i[r])),this.j=new ut(this)}S(ie,q),ie.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},ie.prototype.close=function(){di(this.g)},ie.prototype.o=function(i){var r=this.g;if(typeof i=="string"){var a={};a.__data__=i,i=a}else this.v&&(a={},a.__data__=Yn(i),i=a);r.i.push(new nc(r.Ya++,i)),r.I==3&&dn(r)},ie.prototype.N=function(){this.g.l=null,delete this.j,di(this.g),delete this.g,ie.Z.N.call(this)};function hr(i){Qn.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var r=i.__sm__;if(r){e:{for(const a in r){i=a;break e}i=void 0}(this.i=i)&&(i=this.i,r=r!==null&&i in r?r[i]:void 0),this.data=r}else this.data=i}S(hr,Qn);function ur(){Zn.call(this),this.status=1}S(ur,Zn);function ut(i){this.g=i}S(ut,lr),ut.prototype.ra=function(){J(this.g,"a")},ut.prototype.qa=function(i){J(this.g,new hr(i))},ut.prototype.pa=function(i){J(this.g,new ur)},ut.prototype.oa=function(){J(this.g,"b")},ie.prototype.send=ie.prototype.o,ie.prototype.open=ie.prototype.m,ie.prototype.close=ie.prototype.close,ti.NO_ERROR=0,ti.TIMEOUT=8,ti.HTTP_ERROR=6,Qa.COMPLETE="complete",qa.EventType=At,At.OPEN="a",At.CLOSE="b",At.ERROR="c",At.MESSAGE="d",q.prototype.listen=q.prototype.J,V.prototype.listenOnce=V.prototype.K,V.prototype.getLastError=V.prototype.Ha,V.prototype.getLastErrorCode=V.prototype.ya,V.prototype.getStatus=V.prototype.ca,V.prototype.getResponseJson=V.prototype.La,V.prototype.getResponseText=V.prototype.la,V.prototype.send=V.prototype.ea,V.prototype.setWithCredentials=V.prototype.Fa}).apply(typeof _n<"u"?_n:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Y.UNAUTHENTICATED=new Y(null),Y.GOOGLE_CREDENTIALS=new Y("google-credentials-uid"),Y.FIRST_PARTY=new Y("first-party-uid"),Y.MOCK_USER=new Y("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let en="12.10.0";function hd(n){en=n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const It=new xn("@firebase/firestore");function ce(n,...e){if(It.logLevel<=N.DEBUG){const t=e.map(is);It.debug(`Firestore (${en}): ${n}`,...t)}}function aa(n,...e){if(It.logLevel<=N.ERROR){const t=e.map(is);It.error(`Firestore (${en}): ${n}`,...t)}}function ud(n,...e){if(It.logLevel<=N.WARN){const t=e.map(is);It.warn(`Firestore (${en}): ${n}`,...t)}}function is(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kt(n,e,t){let s="Unexpected state";typeof e=="string"?s=e:t=e,ca(n,s,t)}function ca(n,e,t){let s=`FIRESTORE (${en}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{s+=" CONTEXT: "+JSON.stringify(t)}catch{s+=" CONTEXT: "+t}throw aa(s),new Error(s)}function $t(n,e,t,s){let o="Unexpected state";typeof t=="string"?o=t:s=t,n||ca(e,o,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const R={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class D extends ue{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class la{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class dd{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Y.UNAUTHENTICATED)))}shutdown(){}}class fd{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class pd{constructor(e){this.t=e,this.currentUser=Y.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){$t(this.o===void 0,42304);let s=this.i;const o=v=>this.i!==s?(s=this.i,t(v)):Promise.resolve();let c=new Ht;this.o=()=>{this.i++,this.currentUser=this.u(),c.resolve(),c=new Ht,e.enqueueRetryable((()=>o(this.currentUser)))};const l=()=>{const v=c;e.enqueueRetryable((async()=>{await v.promise,await o(this.currentUser)}))},g=v=>{ce("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=v,this.o&&(this.auth.addAuthTokenListener(this.o),l())};this.t.onInit((v=>g(v))),setTimeout((()=>{if(!this.auth){const v=this.t.getImmediate({optional:!0});v?g(v):(ce("FirebaseAuthCredentialsProvider","Auth not yet detected"),c.resolve(),c=new Ht)}}),0),l()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((s=>this.i!==e?(ce("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):s?($t(typeof s.accessToken=="string",31837,{l:s}),new la(s.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return $t(e===null||typeof e=="string",2055,{h:e}),new Y(e)}}class gd{constructor(e,t,s){this.P=e,this.T=t,this.I=s,this.type="FirstParty",this.user=Y.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class md{constructor(e,t,s){this.P=e,this.T=t,this.I=s}getToken(){return Promise.resolve(new gd(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Y.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Wr{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class yd{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,oe(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){$t(this.o===void 0,3512);const s=c=>{c.error!=null&&ce("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${c.error.message}`);const l=c.token!==this.m;return this.m=c.token,ce("FirebaseAppCheckTokenProvider",`Received ${l?"new":"existing"} token.`),l?t(c.token):Promise.resolve()};this.o=c=>{e.enqueueRetryable((()=>s(c)))};const o=c=>{ce("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=c,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((c=>o(c))),setTimeout((()=>{if(!this.appCheck){const c=this.V.getImmediate({optional:!0});c?o(c):ce("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Wr(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?($t(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Wr(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _d(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let s=0;s<n;s++)t[s]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wd{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let s="";for(;s.length<20;){const o=_d(40);for(let c=0;c<o.length;++c)s.length<20&&o[c]<t&&(s+=e.charAt(o[c]%62))}return s}}function $e(n,e){return n<e?-1:n>e?1:0}function vd(n,e){const t=Math.min(n.length,e.length);for(let s=0;s<t;s++){const o=n.charAt(s),c=e.charAt(s);if(o!==c)return Ei(o)===Ei(c)?$e(o,c):Ei(o)?1:-1}return $e(n.length,e.length)}const Id=55296,Td=57343;function Ei(n){const e=n.charCodeAt(0);return e>=Id&&e<=Td}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qr="__name__";class pe{constructor(e,t,s){t===void 0?t=0:t>e.length&&Kt(637,{offset:t,range:e.length}),s===void 0?s=e.length-t:s>e.length-t&&Kt(1746,{length:s,range:e.length-t}),this.segments=e,this.offset=t,this.len=s}get length(){return this.len}isEqual(e){return pe.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof pe?e.forEach((s=>{t.push(s)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,s=this.limit();t<s;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const s=Math.min(e.length,t.length);for(let o=0;o<s;o++){const c=pe.compareSegments(e.get(o),t.get(o));if(c!==0)return c}return $e(e.length,t.length)}static compareSegments(e,t){const s=pe.isNumericId(e),o=pe.isNumericId(t);return s&&!o?-1:!s&&o?1:s&&o?pe.extractNumericId(e).compare(pe.extractNumericId(t)):vd(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return ns.fromString(e.substring(4,e.length-2))}}class re extends pe{construct(e,t,s){return new re(e,t,s)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const s of e){if(s.indexOf("//")>=0)throw new D(R.INVALID_ARGUMENT,`Invalid segment (${s}). Paths must not contain // in them.`);t.push(...s.split("/").filter((o=>o.length>0)))}return new re(t)}static emptyPath(){return new re([])}}const Ed=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Je extends pe{construct(e,t,s){return new Je(e,t,s)}static isValidIdentifier(e){return Ed.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Je.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===qr}static keyField(){return new Je([qr])}static fromServerFormat(e){const t=[];let s="",o=0;const c=()=>{if(s.length===0)throw new D(R.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(s),s=""};let l=!1;for(;o<e.length;){const g=e[o];if(g==="\\"){if(o+1===e.length)throw new D(R.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const v=e[o+1];if(v!=="\\"&&v!=="."&&v!=="`")throw new D(R.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);s+=v,o+=2}else g==="`"?(l=!l,o++):g!=="."||l?(s+=g,o++):(c(),o++)}if(c(),l)throw new D(R.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Je(t)}static emptyPath(){return new Je([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e){this.path=e}static fromPath(e){return new Ye(re.fromString(e))}static fromName(e){return new Ye(re.fromString(e).popFirst(5))}static empty(){return new Ye(re.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&re.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return re.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new Ye(new re(e.slice()))}}function bd(n,e,t,s){if(e===!0&&s===!0)throw new D(R.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Ad(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Sd(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(s){return s.constructor?s.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":Kt(12329,{type:typeof n})}function Cd(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new D(R.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Sd(n);throw new D(R.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B(n,e){const t={typeString:n};return e&&(t.value=e),t}function tn(n,e){if(!Ad(n))throw new D(R.INVALID_ARGUMENT,"JSON must be an object");let t;for(const s in e)if(e[s]){const o=e[s].typeString,c="value"in e[s]?{value:e[s].value}:void 0;if(!(s in n)){t=`JSON missing required field: '${s}'`;break}const l=n[s];if(o&&typeof l!==o){t=`JSON field '${s}' must be a ${o}.`;break}if(c!==void 0&&l!==c.value){t=`Expected '${s}' field to equal '${c.value}'`;break}}if(t)throw new D(R.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kr=-62135596800,Jr=1e6;class ge{static now(){return ge.fromMillis(Date.now())}static fromDate(e){return ge.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),s=Math.floor((e-1e3*t)*Jr);return new ge(t,s)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new D(R.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new D(R.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Kr)throw new D(R.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new D(R.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Jr}_compareTo(e){return this.seconds===e.seconds?$e(this.nanoseconds,e.nanoseconds):$e(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ge._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(tn(e,ge._jsonSchema))return new ge(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Kr;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ge._jsonSchemaVersion="firestore/timestamp/1.0",ge._jsonSchema={type:B("string",ge._jsonSchemaVersion),seconds:B("number"),nanoseconds:B("number")};function Pd(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kd extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(o){try{return atob(o)}catch(c){throw typeof DOMException<"u"&&c instanceof DOMException?new kd("Invalid base64 string: "+c):c}})(e);return new it(t)}static fromUint8Array(e){const t=(function(o){let c="";for(let l=0;l<o.length;++l)c+=String.fromCharCode(o[l]);return c})(e);return new it(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const s=new Uint8Array(t.length);for(let o=0;o<t.length;o++)s[o]=t.charCodeAt(o);return s})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return $e(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}it.EMPTY_BYTE_STRING=new it("");const xi="(default)";class Nn{constructor(e,t){this.projectId=e,this.database=t||xi}static empty(){return new Nn("","")}get isDefaultDatabase(){return this.database===xi}isEqual(e){return e instanceof Nn&&e.projectId===this.projectId&&e.database===this.database}}function Rd(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new D(R.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Nn(n.options.projectId,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dd{constructor(e,t=null,s=[],o=[],c=null,l="F",g=null,v=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=s,this.filters=o,this.limit=c,this.limitType=l,this.startAt=g,this.endAt=v,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function Nd(n){return new Dd(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Xr,k;(k=Xr||(Xr={}))[k.OK=0]="OK",k[k.CANCELLED=1]="CANCELLED",k[k.UNKNOWN=2]="UNKNOWN",k[k.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",k[k.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",k[k.NOT_FOUND=5]="NOT_FOUND",k[k.ALREADY_EXISTS=6]="ALREADY_EXISTS",k[k.PERMISSION_DENIED=7]="PERMISSION_DENIED",k[k.UNAUTHENTICATED=16]="UNAUTHENTICATED",k[k.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",k[k.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",k[k.ABORTED=10]="ABORTED",k[k.OUT_OF_RANGE=11]="OUT_OF_RANGE",k[k.UNIMPLEMENTED=12]="UNIMPLEMENTED",k[k.INTERNAL=13]="INTERNAL",k[k.UNAVAILABLE=14]="UNAVAILABLE",k[k.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new ns([4294967295,4294967295],0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Od=41943040;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ld=1048576;function bi(){return typeof document<"u"?document:null}class Md{constructor(e,t,s=1e3,o=1.5,c=6e4){this.Ci=e,this.timerId=t,this.R_=s,this.A_=o,this.V_=c,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const t=Math.floor(this.d_+this.y_()),s=Math.max(0,Date.now()-this.f_),o=Math.max(0,t-s);o>0&&ce("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.d_} ms, delay with jitter: ${t} ms, last attempt: ${s} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,o,(()=>(this.f_=Date.now(),e()))),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ss{constructor(e,t,s,o,c){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=s,this.op=o,this.removalCallback=c,this.deferred=new Ht,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((l=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,s,o,c){const l=Date.now()+s,g=new ss(e,t,l,o,c);return g.start(s),g}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new D(R.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var Yr,Qr;(Qr=Yr||(Yr={})).Ma="default",Qr.Cache="cache";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xd(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ud="ComponentProvider",Zr=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ha="firestore.googleapis.com",eo=!0;class to{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new D(R.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=ha,this.ssl=eo}else this.host=e.host,this.ssl=e.ssl??eo;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Od;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Ld)throw new D(R.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}bd("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=xd(e.experimentalLongPollingOptions??{}),(function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new D(R.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new D(R.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new D(R.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(s,o){return s.timeoutSeconds===o.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ua{constructor(e,t,s,o){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=s,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new to({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new D(R.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new D(R.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new to(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(s){if(!s)return new dd;switch(s.type){case"firstParty":return new md(s.sessionIndex||"0",s.iamToken||null,s.authTokenFactory||null);case"provider":return s.client;default:throw new D(R.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const s=Zr.get(t);s&&(ce(Ud,"Removing Datastore"),Zr.delete(t),s.terminate())})(this),Promise.resolve()}}function Fd(n,e,t,s={}){n=Cd(n,ua);const o=Jt(e),c=n._getSettings(),l={...c,emulatorOptions:n._getEmulatorOptions()},g=`${e}:${t}`;o&&(To(`https://${g}`),Eo("Firestore",!0)),c.host!==ha&&c.host!==g&&ud("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const v={...c,host:g,ssl:o,emulatorOptions:s};if(!Be(v,l)&&(n._setSettings(v),s.mockUserToken)){let T,A;if(typeof s.mockUserToken=="string")T=s.mockUserToken,A=Y.MOCK_USER;else{T=Uc(s.mockUserToken,n._app?.options.projectId);const S=s.mockUserToken.sub||s.mockUserToken.user_id;if(!S)throw new D(R.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");A=new Y(S)}n._authCredentials=new fd(new la(T,A))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{constructor(e,t,s){this.converter=t,this._query=s,this.type="query",this.firestore=e}withConverter(e){return new rs(this.firestore,e,this._query)}}class me{constructor(e,t,s){this.converter=t,this._key=s,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new os(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new me(this.firestore,e,this._key)}toJSON(){return{type:me._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,s){if(tn(t,me._jsonSchema))return new me(e,s||null,new Ye(re.fromString(t.referencePath)))}}me._jsonSchemaVersion="firestore/documentReference/1.0",me._jsonSchema={type:B("string",me._jsonSchemaVersion),referencePath:B("string")};class os extends rs{constructor(e,t,s){super(e,t,Nd(s)),this._path=s,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new me(this.firestore,null,new Ye(e))}withConverter(e){return new os(this.firestore,e,this._path)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const no="AsyncQueue";class io{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Md(this,"async_queue_retry"),this._c=()=>{const s=bi();s&&ce(no,"Visibility state changed to "+s.visibilityState),this.M_.w_()},this.ac=e;const t=bi();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=bi();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise((()=>{}));const t=new Ht;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Yu.push(e),this.lc())))}async lc(){if(this.Yu.length!==0){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!Pd(e))throw e;ce(no,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_((()=>this.lc()))}}cc(e){const t=this.ac.then((()=>(this.rc=!0,e().catch((s=>{throw this.nc=s,this.rc=!1,aa("INTERNAL UNHANDLED ERROR: ",so(s)),s})).then((s=>(this.rc=!1,s))))));return this.ac=t,t}enqueueAfterDelay(e,t,s){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const o=ss.createAndSchedule(this,e,t,s,(c=>this.hc(c)));return this.tc.push(o),o}uc(){this.nc&&Kt(47125,{Pc:so(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then((()=>{this.tc.sort(((t,s)=>t.targetTimeMs-s.targetTimeMs));for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()}))}Rc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function so(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class Vd extends ua{constructor(e,t,s,o){super(e,t,s,o),this.type="firestore",this._queue=new io,this._persistenceKey=o?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new io(e),this._firestoreClient=void 0,await e}}}function jd(n,e){const t=typeof n=="object"?n:Un(),s=typeof n=="string"?n:xi,o=at(t,"firestore").getImmediate({identifier:s});if(!o._initialized){const c=Mc("firestore");c&&Fd(o,...c)}return o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be{constructor(e){this._byteString=e}static fromBase64String(e){try{return new be(it.fromBase64String(e))}catch(t){throw new D(R.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new be(it.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:be._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(tn(e,be._jsonSchema))return be.fromBase64String(e.bytes)}}be._jsonSchemaVersion="firestore/bytes/1.0",be._jsonSchema={type:B("string",be._jsonSchemaVersion),bytes:B("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class da{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new D(R.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Je(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new D(R.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new D(R.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return $e(this._lat,e._lat)||$e(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:et._jsonSchemaVersion}}static fromJSON(e){if(tn(e,et._jsonSchema))return new et(e.latitude,e.longitude)}}et._jsonSchemaVersion="firestore/geoPoint/1.0",et._jsonSchema={type:B("string",et._jsonSchemaVersion),latitude:B("number"),longitude:B("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(s,o){if(s.length!==o.length)return!1;for(let c=0;c<s.length;++c)if(s[c]!==o[c])return!1;return!0})(this._values,e._values)}toJSON(){return{type:tt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(tn(e,tt._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new tt(e.vectorValues);throw new D(R.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}tt._jsonSchemaVersion="firestore/vectorValue/1.0",tt._jsonSchema={type:B("string",tt._jsonSchemaVersion),vectorValues:B("object")};function fa(n,e,t){if((e=ve(e))instanceof da)return e._internalPath;if(typeof e=="string")return $d(n,e);throw Ui("Field path arguments must be of type string or ",n)}const Bd=new RegExp("[~\\*/\\[\\]]");function $d(n,e,t){if(e.search(Bd)>=0)throw Ui(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n);try{return new da(...e.split("."))._internalPath}catch{throw Ui(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n)}}function Ui(n,e,t,s,o){let c=`Function ${e}() called with invalid data`;c+=". ";let l="";return new D(R.INVALID_ARGUMENT,c+n+l)}const ro="@firebase/firestore",oo="4.12.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pa{constructor(e,t,s,o,c){this._firestore=e,this._userDataWriter=t,this._key=s,this._document=o,this._converter=c}get id(){return this._key.path.lastSegment()}get ref(){return new me(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Hd(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){return this._document?.data.clone().value.mapValue.fields??void 0}get(e){if(this._document){const t=this._document.data.field(fa("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class Hd extends pa{data(){return super.data()}}class wn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class _t extends pa{constructor(e,t,s,o,c,l){super(e,t,s,o,l),this._firestore=e,this._firestoreImpl=e,this.metadata=c}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new bn(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const s=this._document.data.field(fa("DocumentSnapshot.get",e));if(s!==null)return this._userDataWriter.convertValue(s,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new D(R.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=_t._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}_t._jsonSchemaVersion="firestore/documentSnapshot/1.0",_t._jsonSchema={type:B("string",_t._jsonSchemaVersion),bundleSource:B("string","DocumentSnapshot"),bundleName:B("string"),bundle:B("string")};class bn extends _t{data(e={}){return super.data(e)}}class zt{constructor(e,t,s,o){this._firestore=e,this._userDataWriter=t,this._snapshot=o,this.metadata=new wn(o.hasPendingWrites,o.fromCache),this.query=s}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((s=>{e.call(t,new bn(this._firestore,this._userDataWriter,s.key,s,new wn(this._snapshot.mutatedKeys.has(s.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new D(R.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(o,c){if(o._snapshot.oldDocs.isEmpty()){let l=0;return o._snapshot.docChanges.map((g=>{const v=new bn(o._firestore,o._userDataWriter,g.doc.key,g.doc,new wn(o._snapshot.mutatedKeys.has(g.doc.key),o._snapshot.fromCache),o.query.converter);return g.doc,{type:"added",doc:v,oldIndex:-1,newIndex:l++}}))}{let l=o._snapshot.oldDocs;return o._snapshot.docChanges.filter((g=>c||g.type!==3)).map((g=>{const v=new bn(o._firestore,o._userDataWriter,g.doc.key,g.doc,new wn(o._snapshot.mutatedKeys.has(g.doc.key),o._snapshot.fromCache),o.query.converter);let T=-1,A=-1;return g.type!==0&&(T=l.indexOf(g.doc.key),l=l.delete(g.doc.key)),g.type!==1&&(l=l.add(g.doc),A=l.indexOf(g.doc.key)),{type:zd(g.type),doc:v,oldIndex:T,newIndex:A}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new D(R.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=zt._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=wd.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],s=[],o=[];return this.docs.forEach((c=>{c._document!==null&&(t.push(c._document),s.push(this._userDataWriter.convertObjectMap(c._document.data.value.mapValue.fields,"previous")),o.push(c.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function zd(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Kt(61501,{type:n})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */zt._jsonSchemaVersion="firestore/querySnapshot/1.0",zt._jsonSchema={type:B("string",zt._jsonSchemaVersion),bundleSource:B("string","QuerySnapshot"),bundleName:B("string"),bundle:B("string")};(function(e,t=!0){hd(Tt),_e(new he("firestore",((s,{instanceIdentifier:o,options:c})=>{const l=s.getProvider("app").getImmediate(),g=new Vd(new pd(s.getProvider("auth-internal")),new yd(l,s.getProvider("app-check-internal")),Rd(l,o),l);return c={useFetchStreams:t,...c},g._setSettings(c),g}),"PUBLIC").setMultipleInstances(!0)),se(ro,oo,e),se(ro,oo,"esm2020")})();const ga="@firebase/installations",as="0.6.20";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ma=1e4,ya=`w:${as}`,_a="FIS_v2",Gd="https://firebaseinstallations.googleapis.com/v1",Wd=3600*1e3,qd="installations",Kd="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jd={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},st=new ot(qd,Kd,Jd);function wa(n){return n instanceof ue&&n.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function va({projectId:n}){return`${Gd}/projects/${n}/installations`}function Ia(n){return{token:n.token,requestStatus:2,expiresIn:Yd(n.expiresIn),creationTime:Date.now()}}async function Ta(n,e){const s=(await e.json()).error;return st.create("request-failed",{requestName:n,serverCode:s.code,serverMessage:s.message,serverStatus:s.status})}function Ea({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function Xd(n,{refreshToken:e}){const t=Ea(n);return t.append("Authorization",Qd(e)),t}async function ba(n){const e=await n();return e.status>=500&&e.status<600?n():e}function Yd(n){return Number(n.replace("s","000"))}function Qd(n){return`${_a} ${n}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zd({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const s=va(n),o=Ea(n),c=e.getImmediate({optional:!0});if(c){const T=await c.getHeartbeatsHeader();T&&o.append("x-firebase-client",T)}const l={fid:t,authVersion:_a,appId:n.appId,sdkVersion:ya},g={method:"POST",headers:o,body:JSON.stringify(l)},v=await ba(()=>fetch(s,g));if(v.ok){const T=await v.json();return{fid:T.fid||t,registrationStatus:2,refreshToken:T.refreshToken,authToken:Ia(T.authToken)}}else throw await Ta("Create Installation",v)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Aa(n){return new Promise(e=>{setTimeout(e,n)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ef(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tf=/^[cdef][\w-]{21}$/,Fi="";function nf(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=sf(n);return tf.test(t)?t:Fi}catch{return Fi}}function sf(n){return ef(n).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bn(n){return`${n.appName}!${n.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sa=new Map;function Ca(n,e){const t=Bn(n);Pa(t,e),rf(t,e)}function Pa(n,e){const t=Sa.get(n);if(t)for(const s of t)s(e)}function rf(n,e){const t=of();t&&t.postMessage({key:n,fid:e}),af()}let Qe=null;function of(){return!Qe&&"BroadcastChannel"in self&&(Qe=new BroadcastChannel("[Firebase] FID Change"),Qe.onmessage=n=>{Pa(n.data.key,n.data.fid)}),Qe}function af(){Sa.size===0&&Qe&&(Qe.close(),Qe=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cf="firebase-installations-database",lf=1,rt="firebase-installations-store";let Ai=null;function cs(){return Ai||(Ai=Co(cf,lf,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(rt)}}})),Ai}async function On(n,e){const t=Bn(n),o=(await cs()).transaction(rt,"readwrite"),c=o.objectStore(rt),l=await c.get(t);return await c.put(e,t),await o.done,(!l||l.fid!==e.fid)&&Ca(n,e.fid),e}async function ka(n){const e=Bn(n),s=(await cs()).transaction(rt,"readwrite");await s.objectStore(rt).delete(e),await s.done}async function $n(n,e){const t=Bn(n),o=(await cs()).transaction(rt,"readwrite"),c=o.objectStore(rt),l=await c.get(t),g=e(l);return g===void 0?await c.delete(t):await c.put(g,t),await o.done,g&&(!l||l.fid!==g.fid)&&Ca(n,g.fid),g}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ls(n){let e;const t=await $n(n.appConfig,s=>{const o=hf(s),c=uf(n,o);return e=c.registrationPromise,c.installationEntry});return t.fid===Fi?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function hf(n){const e=n||{fid:nf(),registrationStatus:0};return Ra(e)}function uf(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const o=Promise.reject(st.create("app-offline"));return{installationEntry:e,registrationPromise:o}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},s=df(n,t);return{installationEntry:t,registrationPromise:s}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:ff(n)}:{installationEntry:e}}async function df(n,e){try{const t=await Zd(n,e);return On(n.appConfig,t)}catch(t){throw wa(t)&&t.customData.serverCode===409?await ka(n.appConfig):await On(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function ff(n){let e=await ao(n.appConfig);for(;e.registrationStatus===1;)await Aa(100),e=await ao(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:s}=await ls(n);return s||t}return e}function ao(n){return $n(n,e=>{if(!e)throw st.create("installation-not-found");return Ra(e)})}function Ra(n){return pf(n)?{fid:n.fid,registrationStatus:0}:n}function pf(n){return n.registrationStatus===1&&n.registrationTime+ma<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gf({appConfig:n,heartbeatServiceProvider:e},t){const s=mf(n,t),o=Xd(n,t),c=e.getImmediate({optional:!0});if(c){const T=await c.getHeartbeatsHeader();T&&o.append("x-firebase-client",T)}const l={installation:{sdkVersion:ya,appId:n.appId}},g={method:"POST",headers:o,body:JSON.stringify(l)},v=await ba(()=>fetch(s,g));if(v.ok){const T=await v.json();return Ia(T)}else throw await Ta("Generate Auth Token",v)}function mf(n,{fid:e}){return`${va(n)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hs(n,e=!1){let t;const s=await $n(n.appConfig,c=>{if(!Da(c))throw st.create("not-registered");const l=c.authToken;if(!e&&wf(l))return c;if(l.requestStatus===1)return t=yf(n,e),c;{if(!navigator.onLine)throw st.create("app-offline");const g=If(c);return t=_f(n,g),g}});return t?await t:s.authToken}async function yf(n,e){let t=await co(n.appConfig);for(;t.authToken.requestStatus===1;)await Aa(100),t=await co(n.appConfig);const s=t.authToken;return s.requestStatus===0?hs(n,e):s}function co(n){return $n(n,e=>{if(!Da(e))throw st.create("not-registered");const t=e.authToken;return Tf(t)?{...e,authToken:{requestStatus:0}}:e})}async function _f(n,e){try{const t=await gf(n,e),s={...e,authToken:t};return await On(n.appConfig,s),t}catch(t){if(wa(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await ka(n.appConfig);else{const s={...e,authToken:{requestStatus:0}};await On(n.appConfig,s)}throw t}}function Da(n){return n!==void 0&&n.registrationStatus===2}function wf(n){return n.requestStatus===2&&!vf(n)}function vf(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+Wd}function If(n){const e={requestStatus:1,requestTime:Date.now()};return{...n,authToken:e}}function Tf(n){return n.requestStatus===1&&n.requestTime+ma<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ef(n){const e=n,{installationEntry:t,registrationPromise:s}=await ls(e);return s?s.catch(console.error):hs(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bf(n,e=!1){const t=n;return await Af(t),(await hs(t,e)).token}async function Af(n){const{registrationPromise:e}=await ls(n);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sf(n){if(!n||!n.options)throw Si("App Configuration");if(!n.name)throw Si("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw Si(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function Si(n){return st.create("missing-app-config-values",{valueName:n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Na="installations",Cf="installations-internal",Pf=n=>{const e=n.getProvider("app").getImmediate(),t=Sf(e),s=at(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:s,_delete:()=>Promise.resolve()}},kf=n=>{const e=n.getProvider("app").getImmediate(),t=at(e,Na).getImmediate();return{getId:()=>Ef(t),getToken:o=>bf(t,o)}};function Rf(){_e(new he(Na,Pf,"PUBLIC")),_e(new he(Cf,kf,"PRIVATE"))}Rf();se(ga,as);se(ga,as,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ln="analytics",Df="firebase_id",Nf="origin",Of=60*1e3,Lf="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",us="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Q=new xn("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mf={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},ne=new ot("analytics","Analytics",Mf);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xf(n){if(!n.startsWith(us)){const e=ne.create("invalid-gtag-resource",{gtagURL:n});return Q.warn(e.message),""}return n}function Oa(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function Uf(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function Ff(n,e){const t=Uf("firebase-js-sdk-policy",{createScriptURL:xf}),s=document.createElement("script"),o=`${us}?l=${n}&id=${e}`;s.src=t?t?.createScriptURL(o):o,s.async=!0,document.head.appendChild(s)}function Vf(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function jf(n,e,t,s,o,c){const l=s[o];try{if(l)await e[l];else{const v=(await Oa(t)).find(T=>T.measurementId===o);v&&await e[v.appId]}}catch(g){Q.error(g)}n("config",o,c)}async function Bf(n,e,t,s,o){try{let c=[];if(o&&o.send_to){let l=o.send_to;Array.isArray(l)||(l=[l]);const g=await Oa(t);for(const v of l){const T=g.find(S=>S.measurementId===v),A=T&&e[T.appId];if(A)c.push(A);else{c=[];break}}}c.length===0&&(c=Object.values(e)),await Promise.all(c),n("event",s,o||{})}catch(c){Q.error(c)}}function $f(n,e,t,s){async function o(c,...l){try{if(c==="event"){const[g,v]=l;await Bf(n,e,t,g,v)}else if(c==="config"){const[g,v]=l;await jf(n,e,t,s,g,v)}else if(c==="consent"){const[g,v]=l;n("consent",g,v)}else if(c==="get"){const[g,v,T]=l;n("get",g,v,T)}else if(c==="set"){const[g]=l;n("set",g)}else n(c,...l)}catch(g){Q.error(g)}}return o}function Hf(n,e,t,s,o){let c=function(...l){window[s].push(arguments)};return window[o]&&typeof window[o]=="function"&&(c=window[o]),window[o]=$f(c,n,e,t),{gtagCore:c,wrappedGtag:window[o]}}function zf(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(us)&&t.src.includes(n))return t;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gf=30,Wf=1e3;class qf{constructor(e={},t=Wf){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const La=new qf;function Kf(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function Jf(n){const{appId:e,apiKey:t}=n,s={method:"GET",headers:Kf(t)},o=Lf.replace("{app-id}",e),c=await fetch(o,s);if(c.status!==200&&c.status!==304){let l="";try{const g=await c.json();g.error?.message&&(l=g.error.message)}catch{}throw ne.create("config-fetch-failed",{httpStatus:c.status,responseMessage:l})}return c.json()}async function Xf(n,e=La,t){const{appId:s,apiKey:o,measurementId:c}=n.options;if(!s)throw ne.create("no-app-id");if(!o){if(c)return{measurementId:c,appId:s};throw ne.create("no-api-key")}const l=e.getThrottleMetadata(s)||{backoffCount:0,throttleEndTimeMillis:Date.now()},g=new Zf;return setTimeout(async()=>{g.abort()},Of),Ma({appId:s,apiKey:o,measurementId:c},l,g,e)}async function Ma(n,{throttleEndTimeMillis:e,backoffCount:t},s,o=La){const{appId:c,measurementId:l}=n;try{await Yf(s,e)}catch(g){if(l)return Q.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${l} provided in the "measurementId" field in the local Firebase config. [${g?.message}]`),{appId:c,measurementId:l};throw g}try{const g=await Jf(n);return o.deleteThrottleMetadata(c),g}catch(g){const v=g;if(!Qf(v)){if(o.deleteThrottleMetadata(c),l)return Q.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${l} provided in the "measurementId" field in the local Firebase config. [${v?.message}]`),{appId:c,measurementId:l};throw g}const T=Number(v?.customData?.httpStatus)===503?wr(t,o.intervalMillis,Gf):wr(t,o.intervalMillis),A={throttleEndTimeMillis:Date.now()+T,backoffCount:t+1};return o.setThrottleMetadata(c,A),Q.debug(`Calling attemptFetch again in ${T} millis`),Ma(n,A,s,o)}}function Yf(n,e){return new Promise((t,s)=>{const o=Math.max(e-Date.now(),0),c=setTimeout(t,o);n.addEventListener(()=>{clearTimeout(c),s(ne.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function Qf(n){if(!(n instanceof ue)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class Zf{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function ep(n,e,t,s,o){if(o&&o.global){n("event",t,s);return}else{const c=await e,l={...s,send_to:c};n("event",t,l)}}async function tp(n,e,t,s){if(s&&s.global){const o={};for(const c of Object.keys(t))o[`user_properties.${c}`]=t[c];return n("set",o),Promise.resolve()}else{const o=await e;n("config",o,{update:!0,user_properties:t})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function np(){if(Hi())try{await zi()}catch(n){return Q.warn(ne.create("indexeddb-unavailable",{errorInfo:n?.toString()}).message),!1}else return Q.warn(ne.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function ip(n,e,t,s,o,c,l){const g=Xf(n);g.then(b=>{t[b.measurementId]=b.appId,n.options.measurementId&&b.measurementId!==n.options.measurementId&&Q.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${b.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(b=>Q.error(b)),e.push(g);const v=np().then(b=>{if(b)return s.getId()}),[T,A]=await Promise.all([g,v]);zf(c)||Ff(c,T.measurementId),o("js",new Date);const S=l?.config??{};return S[Nf]="firebase",S.update=!0,A!=null&&(S[Df]=A),o("config",T.measurementId,S),T.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sp{constructor(e){this.app=e}_delete(){return delete wt[this.app.options.appId],Promise.resolve()}}let wt={},lo=[];const ho={};let Ci="dataLayer",rp="gtag",uo,ds,fo=!1;function op(){const n=[];if($i()&&n.push("This is a browser extension environment."),bo()||n.push("Cookies are not available."),n.length>0){const e=n.map((s,o)=>`(${o+1}) ${s}`).join(" "),t=ne.create("invalid-analytics-context",{errorInfo:e});Q.warn(t.message)}}function ap(n,e,t){op();const s=n.options.appId;if(!s)throw ne.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)Q.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw ne.create("no-api-key");if(wt[s]!=null)throw ne.create("already-exists",{id:s});if(!fo){Vf(Ci);const{wrappedGtag:c,gtagCore:l}=Hf(wt,lo,ho,Ci,rp);ds=c,uo=l,fo=!0}return wt[s]=ip(n,lo,ho,e,uo,Ci,t),new sp(n)}function cp(n=Un()){n=ve(n);const e=at(n,Ln);return e.isInitialized()?e.getImmediate():lp(n)}function lp(n,e={}){const t=at(n,Ln);if(t.isInitialized()){const o=t.getImmediate();if(Be(e,t.getOptions()))return o;throw ne.create("already-initialized")}return t.initialize({options:e})}async function hp(){if($i()||!bo()||!Hi())return!1;try{return await zi()}catch{return!1}}function up(n,e,t){n=ve(n),tp(ds,wt[n.app.options.appId],e,t).catch(s=>Q.error(s))}function dp(n,e,t,s){n=ve(n),ep(ds,wt[n.app.options.appId],e,t,s).catch(o=>Q.error(o))}const po="@firebase/analytics",go="0.10.20";function fp(){_e(new he(Ln,(e,{options:t})=>{const s=e.getProvider("app").getImmediate(),o=e.getProvider("installations-internal").getImmediate();return ap(s,o,t)},"PUBLIC")),_e(new he("analytics-internal",n,"PRIVATE")),se(po,go),se(po,go,"esm2020");function n(e){try{const t=e.getProvider(Ln).getImmediate();return{logEvent:(s,o,c)=>dp(t,s,o,c),setUserProperties:(s,o)=>up(t,s,o)}}catch(t){throw ne.create("interop-component-reg-failed",{reason:t})}}}fp();const pp="AIzaSyAVfcGFylUSYSkwEH0dTrCySqu-SwAhHm4",gp="chessnet-2505.firebaseapp.com",mp="chessnet-2505",yp="chessnet-2505.firebasestorage.app",_p="668650751820",wp="1:668650751820:web:94d658408221c4c11af1e9",vp="G-37RZFE1WJQ",Vi={apiKey:pp,authDomain:gp,projectId:mp,storageBucket:yp,messagingSenderId:_p,appId:wp,measurementId:vp};ji&&console.log("🔥 Initializing Firebase with Config:",{projectId:Vi.projectId,hasApiKey:!!Vi.apiKey});const Hn=Ql().length===0?Po(Vi):Un(),xa=cd(Hn),Ip=jd(Hn);ji&&console.log("🔥 Firebase Initialized:",{hasApp:!!Hn,hasAuth:!!xa,hasDb:!!Ip});ji&&hp().then(n=>{n&&cp(Hn)});const Tp=async()=>{const n=new Ee;try{return{user:(await yu(xa,n)).user,error:null}}catch(e){return console.error("Error signing in with Google:",e),{user:null,error:e}}},Ep=async(n,e,t,s)=>{try{ft(e,!0),ft(t,""),console.log("🔄 Iniciando sesión con Firebase Google...");const{user:o,error:c}=await Tp();if(c)console.error("❌ Error en Firebase Google Auth:",c),ft(t,"Error al iniciar sesión con Google. Por favor, intenta nuevamente.");else if(o)if(console.log("✅ Sesión iniciada correctamente:",o.email),(await fetch("/api/auth/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user:o})})).ok){const g=s().url.searchParams.get("redirectTo")||"/dashboard";Sc(g)}else ft(t,"Error al crear la sesión en el servidor.")}catch(o){console.error("❌ Error inesperado:",o),ft(t,"Error inesperado al iniciar sesión. Por favor, intenta nuevamente.")}finally{ft(e,!1)}};var bp=Mn('<div class="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center"><!> <p class="text-red-300 text-sm"> </p></div>'),Ap=Mn('<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div> <span class="font-medium">Iniciando sesión...</span>',1),Sp=Mn('<svg class="w-5 h-5 mr-3" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg> <span class="font-medium">Continuar con Google</span>',1),Cp=Mn(`<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><div class="absolute inset-0 opacity-5"><div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, #64748b 2px, transparent 2px), radial-gradient(circle at 75% 75%, #64748b 2px, transparent 2px); background-size: 50px 50px;"></div></div> <div class="relative min-h-screen flex items-center justify-center p-4"><div class="w-full max-w-lg"><div class="text-center mb-8"><div class="mx-auto w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl"><span class="text-white text-3xl font-bold">♔</span></div> <h1 class="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">ChessNet</h1> <p class="text-slate-400 text-lg">Plataforma educativa de ajedrez</p> <div class="mt-4 flex items-center justify-center space-x-4 text-sm text-slate-500"><span class="flex items-center"><div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div> Sistema Activo</span> <span class="text-amber-400 font-medium">BETA</span></div></div> <div class="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl"><div class="text-center mb-6"><h2 class="text-xl font-semibold text-white mb-2">Bienvenido de vuelta</h2> <p class="text-slate-400 text-sm">Inicia sesión para acceder a tu plataforma educativa</p></div> <!> <button class="w-full flex items-center justify-center px-6 py-4 border border-slate-600/50 rounded-xl bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/80 hover:to-slate-500/80 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"><!></button> <div class="mt-8 text-center space-y-3"><p class="text-sm text-slate-400">Al iniciar sesión, aceptas nuestros <a href="/legal/terms" class="text-primary-400 hover:text-primary-300 underline transition-colors">términos de servicio</a> y <a href="/legal/privacy" class="text-primary-400 hover:text-primary-300 underline transition-colors">política de privacidad</a></p> <p class="text-xs text-slate-500">También puedes consultar nuestra <a href="/legal/cookies" class="text-primary-400 hover:text-primary-300 underline transition-colors">política de cookies</a></p></div></div> <div class="mt-8 grid grid-cols-2 gap-3"><div class="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 text-center backdrop-blur-sm"><div class="text-primary-400 text-2xl font-bold mb-2">📚</div> <div class="text-white font-medium text-sm mb-1">Gestión</div> <div class="text-slate-400 text-xs">Centros y Clases</div></div> <div class="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 text-center backdrop-blur-sm"><div class="text-secondary-400 text-2xl font-bold mb-2">🏆</div> <div class="text-white font-medium text-sm mb-1">Torneos</div> <div class="text-slate-400 text-xs">Sistema Local</div></div> <div class="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 text-center backdrop-blur-sm"><div class="text-green-400 text-2xl font-bold mb-2">📊</div> <div class="text-white font-medium text-sm mb-1">Informes</div> <div class="text-slate-400 text-xs">Progreso Detallado</div></div> <div class="bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 text-center backdrop-blur-sm"><div class="text-blue-400 text-2xl font-bold mb-2">💰</div> <div class="text-white font-medium text-sm mb-1">Pagos</div> <div class="text-slate-400 text-xs">Control Total</div></div></div> <div class="mt-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl backdrop-blur-sm"><div class="flex items-start"><!> <div class="text-sm"><p class="font-semibold text-amber-400 mb-1">🚀 Versión Beta</p> <p class="text-amber-300/90 leading-relaxed">Esta aplicación está en desarrollo activo. Los datos pueden eliminarse durante las actualizaciones. 
                Te notificaremos con 30 días de antelación antes de cualquier migración importante.</p></div></div></div> <div class="mt-6 bg-slate-800/40 border border-slate-700/30 rounded-xl p-4 backdrop-blur-sm"><h3 class="text-lg font-semibold text-white mb-3 text-center">🚀 Estado del Proyecto</h3> <div class="grid grid-cols-1 gap-2 text-sm"><div class="flex items-center justify-between"><span class="text-slate-300">✅ Autenticación y Dashboard</span> <span class="text-green-400 text-xs font-medium">COMPLETO</span></div> <div class="flex items-center justify-between"><span class="text-slate-300">⚡ Gestión de Centros y Clases</span> <span class="text-yellow-400 text-xs font-medium">ACTIVO</span></div> <div class="flex items-center justify-between"><span class="text-slate-300">🏆 Torneos Locales</span> <span class="text-blue-400 text-xs font-medium">DISPONIBLE</span></div> <div class="flex items-center justify-between"><span class="text-slate-300">💰 Sistema de Pagos</span> <span class="text-amber-400 text-xs font-medium">BETA</span></div></div></div></div></div> <div class="fixed bottom-4 right-4 z-50"><div id="kofi-widget-container"></div></div></div>`);function Up(n,e){_c(e,!0);const t=()=>Ec(Ac,"$page",s),[s,o]=bc();let c=dr(!1),l=dr("");var g=Cp();yc(j=>{vc.title="Iniciar Sesión - ChessNet"});var v=dt(Ie(g),2),T=Ie(v),A=dt(Ie(T),2),S=dt(Ie(A),2);{var b=j=>{var W=bp(),K=Ie(W);gr(K,{class:"w-5 h-5 text-red-400 mr-3 flex-shrink-0"});var m=dt(K,2),u=Ie(m,!0);Te(m),Te(W),fr(()=>Tc(u,mn(l))),gn(j,W)};pr(S,j=>{mn(l)&&j(b)})}var O=dt(S,2);O.__click=[Ep,c,l,t];var L=Ie(O);{var F=j=>{var W=Ap();pt(2),gn(j,W)},x=j=>{var W=Sp();pt(2),gn(j,W)};pr(L,j=>{mn(c)?j(F):j(x,!1)})}Te(O),pt(2),Te(A);var z=dt(A,4),G=Ie(z),ee=Ie(G);gr(ee,{class:"w-5 h-5 text-amber-400 mt-0.5 mr-3 flex-shrink-0"}),pt(2),Te(G),Te(z),pt(2),Te(T),Te(v),pt(2),Te(g),fr(()=>O.disabled=mn(c)),gn(n,g),wc(),o()}Ic(["click"]);export{Up as component};
