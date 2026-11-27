// Run from repository root: node tests/mobile-release-profile.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8'),prepare=fs.readFileSync('scripts/prepare-mobile.mjs','utf8'),verify=fs.readFileSync('scripts/check-mobile.mjs','utf8');let count=0;const check=x=>{assert(x);count++};
const gate='const ONLINE_COOP_ENABLED=true;',url='https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js';
check(c.split(gate).length===2);check(c.split(url).length===2);
for(const online of [true,false]){
 const html=c.replace(gate,'const ONLINE_COOP_ENABLED='+online+';').replace(url,'./vendor/peerjs.min.js');
 for(const m of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim())new Function(m[1]);
 check(html.includes('const ONLINE_COOP_ENABLED='+online+';'));check(!html.includes(url));
}
for(const s of ["modes.filter(q=>q.id!=='online'||ONLINE_COOP_ENABLED)","if(!ONLINE_COOP_ENABLED)return Promise.reject","if(!ONLINE_COOP_ENABLED&&(onlineMode||fromNetwork))return;","function startOnlineHost(){if(!ONLINE_COOP_ENABLED)return false;"])check(c.includes(s));
check(prepare.includes("args.includes('--online-dev')"));check(prepare.includes("online?'online-dev':'offline-release'"));check(prepare.includes("if(online){await mkdir"));check(prepare.includes('sourceSha256:hash(source)'));check(verify.includes("assert.equal(profile.sourceSha256,hash(source)"));check(verify.includes("assert.equal(profile.htmlSha256,hash(html)"));check(verify.includes("assert.equal(config.server?.url,undefined)"));check(verify.includes("assert.rejects(stat(path('www/vendor/peerjs.min.js'))"));
console.log('Mobile release profile: '+count+' assertions passed; source gates, profiles, freshness and package checks. Native build not executed.');
