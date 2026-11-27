// Run from repository root: node tests/local-encounters.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const encounterRooms='),b=c.indexOf('let encounter=null;',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
const runArtifacts=[],addCoins=(r,n)=>{r.coins+=n;r.coinsEarned+=n;return n},mkRun=w=>({closed:false,cleared:w,lastEncounter:0,seenRooms:[],coins:100,coinsEarned:100,coinsSpent:0,nextRoomEffect:null,roomChoices:0}),mkP=()=>({hp:70,maxhp:100,bomb:3,boost:{move:1,dmg:1},artifacts:[]});
check(encounterRooms.length===12&&new Set(encounterRooms.map(r=>r.id)).size===12);
check(new Set(localEncounterRooms.flatMap(r=>r.choices.map(q=>q.id))).size===12);
for(const room of localEncounterRooms){
 for(const q of room.choices){
  const run=mkRun(2),p=mkP(),n={fear:70},event=createEncounter(run,2,()=>0,room.map);
  check(event.room===room);check(encounterReason(run,p,n,event,q.id)==='');
  check(resolveEncounter(run,p,n,event,q.id));check(event.closed&&run.roomChoices===1);check(!resolveEncounter(run,p,n,event,q.id));
  check(run.coins===100-(q.cost||0)+(q.gainCoins||0)&&run.coinsSpent===(q.cost||0));
  check(p.hp>0&&p.hp<=p.maxhp&&p.bomb>=0&&p.bomb<=9);
  check(p.bomb===3-(q.bombCost||0)+(q.bombGain||0));check(p.maxhp===100+(q.maxHP||0));
  check(p.hp===Math.min(p.maxhp,70-Math.ceil(100*(q.hpCost||0))+(q.maxHP||0)+Math.ceil(100*(q.heal||0))));
  check(n.fear===Math.max(0,70-(q.fearRelief||0)));check(p.boost.move===(q.boostMove||1)&&p.boost.dmg===(q.boostDamage||1));
  if(q.next){check(JSON.stringify(run.nextRoomEffect)===JSON.stringify(q.next));const effect=applyRoomEffect(run,n,{count:0,speed:1});check(run.nextRoomEffect===null);check(effect.count===(q.next.count||0)&&effect.speed===(q.next.speed||1));}
  run.cleared=7;check(createEncounter(run,7,()=>0,room.map).room.map===undefined);
  const r=mkRun(2),pp=mkP(),nn={fear:70},ev=createEncounter(r,2,()=>0,room.map);
  if(q.cost){r.coins=q.cost-1;check(encounterReason(r,pp,nn,ev,q.id)==='coins');check(!resolveEncounter(r,pp,nn,ev,q.id));check(r.coins===q.cost-1&&!ev.closed)}
  if(q.bombCost){pp.bomb=0;check(encounterReason(r,pp,nn,ev,q.id)==='bombs');check(!resolveEncounter(r,pp,nn,ev,q.id));}
  if(q.hpCost){pp.hp=Math.ceil(pp.maxhp*q.hpCost);check(encounterReason(r,pp,nn,ev,q.id)==='health');}
 }
 const r=mkRun(2),ev=createEncounter(r,2,()=>0,room.map);check(resolveEncounter(r,mkP(),{fear:70},ev,'leave')&&r.coins===100&&r.roomChoices===0);
}
const r=mkRun(2);r.seenRooms=encounterRooms.map(q=>q.id);check(createEncounter(r,2,()=>0,'forest').room.id==='mirror');check(localEncounterRooms.every(q=>r.seenRooms.includes(q.id)));check(r.seenRooms.length===7);
const other=mkRun(2);check(createEncounter(other,2,()=>.99,'forest').room.map===undefined);
check(createEncounter(mkRun(2),2,()=>0).room.id==='mirror');
`)(check);
check(c.includes('createEncounter(soloRun,wave,Math.random,selectedMap)'));check(c.includes('unique(r.seenRooms,encounterRooms.map(x=>x.id))'));check(c.includes('encounterRooms.push(...localEncounterRooms)'));
console.log('Local encounters: '+count+' assertions passed; arena routing, choice economy, guards, one-use and rotation.');
