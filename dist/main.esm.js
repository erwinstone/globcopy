/*!
* @erwinstone/globcopy v1.0.2 (https://github.com/erwinstone/globcopy#readme)
* Copyright 2021 - 2022 erwinstone
* Licensed under MIT (https://github.com/erwinstone/globcopy/blob/master/LICENSE)
*/
import{promises as o}from"fs";import{posix as m}from"path";import{performance as p}from"perf_hooks";import y from"fast-glob";import{watch as d}from"chokidar";const u={starting:t=>(console.log(`Starting '${t}'...`),p.now()),finished:(t,a)=>{let e=Math.round(p.now()-a),r=e>=1e3?`${(e/1e3).toFixed(2)} s`:`${Math.round(e)} ms`;r=r.toString(),console.log(`Finished '${t}' after ${r}`)}};async function c(t=null,a=null){const e=u.starting("copy");if(t===null){const r=await o.readFile(a,"utf8");t=Object.entries(JSON.parse(r))}for(let[r,s]of t){const f=Array.isArray(s)?s:[s];await o.mkdir(r,{recursive:!0});const g=await y(f,{onlyFiles:!1,markDirectories:!0}),h=w(f);g.forEach(async i=>{const l=h.map(n=>i.startsWith(n)?i.replace(n,r):null).filter(n=>n!==null)[0];l.endsWith("/")?await o.mkdir(l,{recursive:!0}):await o.copyFile(i,l)})}u.finished("copy",e)}function w(t){let a=[];return Array.isArray(t)&&(t=t.filter(e=>!e.startsWith("!")),t.forEach(e=>{a.push(e.split("/").filter(r=>!r.startsWith("*")&&!r.endsWith("*")).join("/"))})),[...new Set(a)]}function b(t){d(t,{ignoreInitial:!0}).on("change",()=>setTimeout(async()=>await c(null,t),200)).on("ready",()=>console.log("Ready for changes"))}async function v(t){const a=m.resolve(t.path);t.watch===!0?b(a):await c(null,a)}async function x(t){const a=Object.entries(JSON.parse(t));await c(a)}export{v as globcopy,x as globcopyRaw};
