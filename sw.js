const CACHE='dumpling-riot-v75-19';
const ASSETS=['./','./index.html','./manifest.webmanifest','./privacy.html','./icon-v38-180.png','./icon-v38-192.png','./icon-v38-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('dumpling-riot-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
function navigationKey(url,scope){
 const base=new URL(scope),u=new URL(url);
 if(u.origin!==base.origin||!u.pathname.startsWith(base.pathname))return null;
 const path=u.pathname.slice(base.pathname.length);
 if(path===''||path==='index.html')return './index.html';
 if(path==='privacy.html')return './privacy.html';
 return null;
}
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
 if(e.request.mode==='navigate'){
  const key=navigationKey(e.request.url,self.registration.scope);
  if(!key)return;
  e.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   try{
    const r=await fetch(e.request);
    if(r.ok&&!r.redirected){try{await cache.put(key,r.clone())}catch(_){}}
    return r;
   }catch(_){return (await cache.match(key))||new Response('Offline. Reconnect and try again.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})}
  })());return;
 }
 e.respondWith(caches.open(CACHE).then(c=>c.match(e.request)).then(r=>r||fetch(e.request)));
});
