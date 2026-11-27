// Run from repository root: node tests/hot-loop.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const section=(a,b)=>{const i=c.indexOf(a),j=c.indexOf(b,i+a.length);assert(i>=0&&j>i);return c.slice(i,j)};
new Function('check',section('function retainInPlace(','function recoilPose(')+section('function nearbyPickupTarget(','function updateDrops(')+`
let seed=7517;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
for(let k=0;k<1000;k++){
 const list=Array.from({length:k%129},(_,i)=>({i,life:random()-.3})),original=list.slice(),expected=original.filter(q=>q.life>0);
 check(retainInPlace(list,q=>q.life>0)===list);check(list.length===expected.length&&list.every((q,i)=>q===expected[i]));
 const dt=.1,remaining=expected.filter(q=>q.life>dt);check(fxTick(list,dt)===list);check(list.length===remaining.length&&list.every((q,i)=>q===remaining[i]));
}
let calls=0;const nativeHypot=Math.hypot;const old=(d,players)=>{let cp=null,dist=Infinity;for(const p of players){const v=nativeHypot(p.x-d.x,p.y-d.y);if(v<dist){dist=v;cp=p}}return {cp,dist}};
const MathProxy=Object.create(Math);MathProxy.hypot=(...v)=>{calls++;return nativeHypot(...v)};
// Exercise actual helper with an instrumented Math without mutating the real global.
const tracked=new Function('Math','return '+nearbyPickupTarget.toString())(MathProxy);
const limits={xp:64,artifact:20,relic:18,heal:15,bomb:13};
for(const [type,limit] of Object.entries(limits)){
 for(let k=0;k<4000;k++){
  const d={type,x:random()*100,y:random()*100},players=Array.from({length:k%3},()=>({x:random()*240-60,y:random()*240-60}));
  const ref=old(d,players),result=tracked(d,players);
  if(ref.dist<limit)check(result?.cp===ref.cp&&result.dist===ref.dist);else check(result===null);
 }
 const d={type,x:0,y:0},a={x:limit/2,y:0},b={x:-limit/2,y:0};check(tracked(d,[a,b]).cp===a);
 check(tracked(d,[{x:limit,y:0}])===null);check(tracked(d,[{x:limit-1e-8,y:0}])!==null);
}
const p={x:0,y:0};calls=0;
for(let i=0;i<5000;i++)check(tracked({type:'xp',x:100+i%100,y:100+Math.floor(i/100)},[p])===null);
check(calls===0);
const long=Array.from({length:5000},(_,i)=>({life:1,id:i}));
for(let step=0;step<3600;step++){if(step%60===0)long.push({life:1,id:5000+step});if(long.length&&step%2===0)long[0].life=0;retainInPlace(long,q=>q.life>0)}
check(long.every(q=>q.life>0));check(new Set(long.map(q=>q.id)).size===long.length);check(long.length===3260);
`)(check);
check(c.includes('retainInPlace(projectiles,'));check(c.includes('retainInPlace(rings,'));check(c.includes('retainInPlace(drops,'));check(c.includes('retainInPlace(enemies,'));check(c.includes('retainInPlace(particles,'));check(c.includes('retainInPlace(texts,'));
check(c.includes("const nearby=nearbyPickupTarget(d,cps)"));check(c.includes("if(dist>10&&dist<(cp.artifacts?.includes('void')?64:32))"));
console.log('Hot loop: '+count+' assertions passed; stable compaction, exact pickup parity, 5000 distant pickups, synthetic long-loop stress.');
