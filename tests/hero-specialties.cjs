// Run from repository root: node tests/hero-specialties.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const heroSpecialties='),b=c.indexOf('const maps=[',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
const arenaAffinity={forest:{weak:'frost'}},dashProfiles={nyx:{cooldown:1.25}},artifactDashCooldown=(p,base)=>base*(p.artifacts?.includes('hourglass')?.9:1);
const p={x:0,y:0,hp:100,maxhp:100,vx:0,vy:0,dash:1.25,bomb:3},e={x:48,y:0,bleed:1,poison:1,lastOwner:'p1',type:'boss'};
check(Object.keys(heroSpecialties).length===8);
for(const charId of Object.keys(heroSpecialties)){
 p.charId=charId;
 check(heroSpecialtyHit(p,e,'frost','forest',false)===1);check(heroSpecialtyCast(p,false)===1);check(heroSpecialtyDefense(p,false)===1);
 check(heroSpecialtyRefuge(p,{fear:20},1,false)===0);check(heroSpecialtyKill(p,e,false)===null);
}
p.charId='scar';check(heroSpecialtyHit(p,e,'physical','forest',true)===1.10);e.x=48.01;check(heroSpecialtyHit(p,e,'physical','forest',true)===1);e.x=48;
p.charId='vesa';check(heroSpecialtyHit(p,e,'physical','forest',true)===1.12);e.bleed=0;check(heroSpecialtyHit(p,e,'physical','forest',true)===1);
p.charId='pelmage';check(heroSpecialtyHit(p,e,'frost','forest',true)===1.10);check(heroSpecialtyHit(p,e,'fire','forest',true)===1);
p.charId='nyx';check(heroSpecialtyCast(p,true)===1.15);p.dash=.8;check(heroSpecialtyCast(p,true)===1);p.dash=.81;check(heroSpecialtyCast(p,true)===1.15);p.artifacts=['hourglass'];p.dash=1.125;check(heroSpecialtyCast(p,true)===1.15);p.dash=0;check(heroSpecialtyCast(p,true)===1);
p.charId='golem';check(heroSpecialtyDefense(p,true)===.9);p.vx=5;check(heroSpecialtyDefense(p,true)===1);
p.charId='warden';const n={fear:20};check(heroSpecialtyRefuge(p,n,.5,true)===1.2);check(Math.abs(n.fear-18.8)<1e-8);n.fear=.1;check(heroSpecialtyRefuge(p,n,1,true)===.1&&n.fear===0);check(heroSpecialtyRefuge(p,n,0,true)===0);
p.charId='assassin';p.dash=.2;check(heroSpecialtyKill(p,e,true).amount===.12);check(Math.abs(p.dash-.08)<1e-8);check(heroSpecialtyKill(p,e,true).amount<=.12&&p.dash===0);check(heroSpecialtyKill(p,e,true)===null);e.poison=0;p.dash=1;check(heroSpecialtyKill(p,e,true)===null);e.venomStatus={left:1};check(heroSpecialtyKill(p,e,true).kind==='dash');
p.charId='revenant';p.bomb=8;check(heroSpecialtyKill(p,e,true).amount===1&&p.bomb===9);check(heroSpecialtyKill(p,e,true)===null);p.bomb=3;e.type='fork';check(heroSpecialtyKill(p,e,true)===null);e.type='boss';e.lastOwner='p2';check(heroSpecialtyKill(p,e,true)===null);e.lastOwner='p1';p.dead=true;check(heroSpecialtyKill(p,e,true)===null);check(heroSpecialtyHit(p,e,'frost','forest',true)===1);
`)(check);
check(c.includes('heroSpecialtyCast(p,!!soloRun&&!coop&&!onlineMode&&p===player)'));check(c.includes('heroSpecialtyKill(player,e,!!soloRun&&!soloRun.closed&&!coop&&!onlineMode'));check(c.includes('chargeBefore-n.charge'));check(c.includes("L('Passive','Пассивный навык')"));
console.log('Hero specialties: '+count+' assertions passed; eight unique skills, bounds and mode guards.');
