// V75.12 — all formations, phase scaling, legacy supplies and telegraph wiring.
const fs=require('node:fs'),assert=require('node:assert/strict'),c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const section=(a,b)=>{const i=c.indexOf(a),j=c.indexOf(b,i+a.length);assert(i>=0&&j>i);return c.slice(i,j)};
new Function('check',section('const bossVolleyProfiles=','function fireBossVolley')+`
const signatures=new Set;
for(let id=0;id<15;id++){
 const sig=[];
 for(let stage=1;stage<=3;stage++)for(let cycle=0;cycle<2;cycle++){
 const p=bossVolleyPattern(id,stage,0,cycle),t=bossVolleyTiming(id,stage);check(p.length>=3&&p.length<=18);check(p.every(q=>Number.isFinite(q.angle)&&q.speed>0&&q.radius>=2.5&&q.damage>0));check(t.windup>=.36&&t.cadence>=.72);check(JSON.stringify(p)===JSON.stringify(bossVolleyPattern(id,stage,0,cycle)));sig.push(JSON.stringify(p));
 }
 signatures.add(sig.join('|'));check(bossVolleyTiming(id,3).cadence<bossVolleyTiming(id,1).cadence);check(bossVolleyPattern(id,3,0)[0].damage>bossVolleyPattern(id,1,0)[0].damage);
}
check(signatures.size===15);
`)(check);
new Function('check',section('function soloRelic(','function heroWeaponStats(')+`
const p={hp:20,maxhp:100,bomb:2,boost:{dmg:1,rate:1,move:1}};soloRelic(p);check(p.hp===45&&p.maxhp===100&&p.bomb===3);check(p.boost.dmg===1&&p.boost.rate===1&&p.boost.move===1);
`)(check);
check(!c.includes("type:'relic',life:24"));check(c.includes("volley:e.volley"));check(c.includes("fireBossVolley(e,bossVolleyPattern"));check(c.includes("if(!e.charge&&!e.volley)"));check(c.includes("if(e.type!=='boss'||!e.volley)continue"));
console.log('Boss arsenal: '+count+' assertions passed; patterns, phase tuning, supplies and telegraph wiring. No live playtest.');
