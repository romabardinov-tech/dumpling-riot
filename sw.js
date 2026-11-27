const CACHE='dumpling-riot-v71-3';
const ASSETS=['./','./index.html','./manifest.webmanifest','./privacy.html','./icon-v38-180.png','./icon-v38-192.png','./icon-v38-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('dumpling-riot-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy)).catch(()=>{})}return r}).catch(()=>caches.match('./index.html')));return}e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
