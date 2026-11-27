import { mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=resolve(root,'www');
const args=process.argv.slice(2);
if(args.some(a=>a!=='--online-dev')||args.length>1)throw Error('Only --online-dev is supported');
const online=args.includes('--online-dev');
const files=['manifest.webmanifest','privacy.html','icon-v38-180.png','icon-v38-192.png','icon-v38-512.png'];
const source=await readFile(resolve(root,'index.html'),'utf8');
const peer='https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js',gate='const ONLINE_COOP_ENABLED=true;';
if(source.split(peer).length!==2||source.split(gate).length!==2)throw Error('Native build source markers changed');
const html=source.replace(peer,'./vendor/peerjs.min.js').replace(gate,'const ONLINE_COOP_ENABLED='+online+';');
const pkg=JSON.parse(await readFile(resolve(root,'package.json'),'utf8'));
const hash=v=>createHash('sha256').update(v).digest('hex');
for(const name of files)await readFile(resolve(root,name));
if(online){await readFile(resolve(root,'node_modules/peerjs/dist/peerjs.min.js'));await readFile(resolve(root,'node_modules/peerjs/LICENSE'))}
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
for(const name of files)await copyFile(resolve(root,name),resolve(out,name));
if(online){await mkdir(resolve(out,'vendor'),{recursive:true});await copyFile(resolve(root,'node_modules/peerjs/dist/peerjs.min.js'),resolve(out,'vendor/peerjs.min.js'));await copyFile(resolve(root,'node_modules/peerjs/LICENSE'),resolve(out,'vendor/peerjs-LICENSE.txt'))}
await writeFile(resolve(out,'index.html'),html);
await writeFile(resolve(out,'build-profile.json'),JSON.stringify({version:pkg.version,profile:online?'online-dev':'offline-release',sourceSha256:hash(source),htmlSha256:hash(html)},null,2)+'\n');
console.log(online?'TEST ONLY: native online-dev bundle. Do not submit to stores.':'Native offline release candidate prepared in www/. Online co-op disabled; no PeerJS library bundled.');
