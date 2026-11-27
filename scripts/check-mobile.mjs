import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const path=n=>fileURLToPath(new URL('../'+n,import.meta.url));
const args=process.argv.slice(2);
assert.ok(args.length===0||args.length===1&&args[0]==='--online-dev','Only --online-dev is supported');
const online=args.includes('--online-dev');
const html=await readFile(path('www/index.html'),'utf8'),source=await readFile(path('index.html'),'utf8');
const profile=JSON.parse(await readFile(path('www/build-profile.json'),'utf8')),pkg=JSON.parse(await readFile(path('package.json'),'utf8'));
const hash=v=>createHash('sha256').update(v).digest('hex');
assert.equal(profile.profile,online?'online-dev':'offline-release','Wrong build profile');
assert.equal(profile.version,pkg.version,'Stale version; rebuild www');
assert.equal(profile.sourceSha256,hash(source),'Source changed; rebuild www');
assert.equal(profile.htmlSha256,hash(html),'Bundle HTML changed');
assert.equal(html,source.replace('https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js','./vendor/peerjs.min.js').replace('const ONLINE_COOP_ENABLED=true;','const ONLINE_COOP_ENABLED='+online+';'));
assert.match(html,/const peerScriptUrl='\.\/vendor\/peerjs\.min\.js'/);
assert.doesNotMatch(html,/<script[^>]+src=["']https?:/);
assert.match(html,/if\(!nativeMobile\(\)&&'serviceWorker'/);
for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim())new Function(m[1]);
for(const n of ['privacy.html','manifest.webmanifest','icon-v38-180.png','icon-v38-192.png','icon-v38-512.png']){
 const original=await readFile(path(n)),copy=await readFile(path('www/'+n));assert.ok(copy.length>0,n);assert.equal(hash(copy),hash(original),'Stale asset '+n);
}
if(online){for(const n of ['peerjs.min.js','peerjs-LICENSE.txt'])assert.ok((await stat(path('www/vendor/'+n))).size>0,n)}
else{await assert.rejects(stat(path('www/vendor/peerjs.min.js')),{code:'ENOENT'});assert.match(html,/const ONLINE_COOP_ENABLED=false;/)}
const config=JSON.parse(await readFile(path('capacitor.config.json'),'utf8'));
assert.equal(config.webDir,'www');assert.equal(config.appId,'com.dumplingriot.game');assert.equal(config.server?.url,undefined);assert.equal(config.android?.allowMixedContent,false);
console.log('Mobile source and asset checks passed: '+profile.profile+' '+profile.version+'. Native signing/device QA not covered.');
