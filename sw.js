/* 鐵板神數 service worker：版本號變更即更新快取 */
var VER="tieban-v10-1";
var CORE=["./","index.html","process.html","core.js","export.js","ui.js","tiaowen.json","tiaowen_tyg.json","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
var CDN=["https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js","https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(VER).then(function(c){
  return c.addAll(CORE).then(function(){return Promise.all(CDN.map(function(u){return fetch(u,{mode:"cors"}).then(function(r){if(r.ok)return c.put(u,r)}).catch(function(){})}))})}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==VER&&k.indexOf("tieban-")===0)return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){var q=e.request;if(q.method!=="GET")return;var u=q.url;
  if(CDN.indexOf(u)>=0){e.respondWith(caches.match(u).then(function(r){return r||fetch(q).then(function(n){var cp=n.clone();caches.open(VER).then(function(c){c.put(u,cp)});return n})}));return}
  if(u.indexOf(self.registration.scope)!==0)return;
  e.respondWith(fetch(q).then(function(n){if(n&&n.ok){var cp=n.clone();caches.open(VER).then(function(c){c.put(q,cp)})}return n}).catch(function(){return caches.match(q,{ignoreSearch:true}).then(function(r){return r||caches.match("index.html")})}))});
