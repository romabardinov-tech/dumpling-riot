// Run from repository root: node tests/combat-regression.cjs
const fs=require('node:fs');
const assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');
let count=0;
function section(start,end){const a=c.indexOf(start),b=c.indexOf(end,a+start.length);assert(a>=0&&b>a);return c.slice(a,b)}
for(const m of c.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim())new Function(m[1]);
new Function(fs.readFileSync('sw.js','utf8'));
const check=ok=>{assert(ok);count++};
new Function('check',section('function scheduleHazard','function summonMinions')+`
let horrorTime=0,warningAt=0;const spatialTone=()=>false,arenaFeatures={},enemies=[],drops=[];let hazards=[],p=[{x:0,y:0,hp:100},{x:100,y:0,hp:100}],hits=0,shake=0;
const alivePlayers=()=>p;
const hurtPlayer=(p,d)=>{p.hp-=d;hits++};
const ring=()=>{},spawnParticles=()=>{};
scheduleHazard(0,0,50,20,.75);
updateHazards(.5);check(hits===0);
updateHazards(.25);check(hits===1&&p[0].hp===80&&p[1].hp===100);
updateHazards(1);check(hits===1&&hazards.length===0);
const source={dead:false};scheduleHazard(0,0,50,20,.5,source);source.dead=true;updateHazards(.6);check(hits===1&&hazards.length===0);
scheduleHazard(0,0,50,20,.5);p[0].x=70;updateHazards(.6);check(hits===1);
`)(check);
new Function('check',section('function retainInPlace(','function fxTick(')+section('function updateProjectiles','function updateRings')+`
let projectiles=[],enemies=[{x:10,y:0,r:8,hp:100},{x:10,y:0,r:8,hp:100}],rings=[];
const arena={l:-100,r:100,t:-100,b:100};
const onlineMode=false,breakableProps=[],propImpactLedger=new WeakMap(),hitBreakables=()=>{};const hitWithElement=(e,d)=>e.hp-=d;const targetPlayer=()=>null,hurtPlayer=()=>{},spawnParticles=()=>{},ring=()=>{};
function shot(pierce){return {x:10,y:0,vx:0,vy:0,life:2,r:2,pierce,damage:10,owner:'p1'}}
projectiles=[shot(0)];updateProjectiles(.1);check(enemies[0].hp===90&&enemies[1].hp===100&&projectiles.length===0);
projectiles=[shot(2)];updateProjectiles(.1);check(enemies[0].hp===80&&enemies[1].hp===90&&projectiles.length===1);
updateProjectiles(.1);check(enemies[0].hp===80&&enemies[1].hp===90);
`)(check);
new Function('check',section('const dashProfiles=','const maps=[')+section('function dashFor(p)','function dash(){')+`
const chars=Object.keys(dashProfiles).map(id=>({id,color:'#fff'})),clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),lerp=(a,b,t)=>a+(b-a)*t,locName=x=>x.name;
const soloRun=null,tutorialEvent=()=>{},addDashGhosts=()=>{};const arena={l:0,r:200,t:0,b:200},initAudio=()=>{},sfx=()=>{},spawnParticles=()=>{},floatText=()=>{};
let rings=[],projectiles=[],enemies=[],player,state='game';
const ring=(x,y,r,color,life,max,owner)=>rings.push({x,y,r,max,owner});
const damageEnemy=(e,d)=>e.hp-=d;
for(const id of Object.keys(dashProfiles)){
 player={charId:id,x:100,y:100,vx:1,vy:0,aim:0,inv:0,dash:0,dead:false,boost:{dmg:1}};
 rings=[];projectiles=[];enemies=[{x:120,y:100,r:8,hp:100}];
 dashFor(player);const a=dashProfiles[id];
 check(player.x===100+a.distance&&player.inv===a.inv&&player.dash===a.cooldown);
 check(id==='vesa'?projectiles.length===3:id==='assassin'?enemies[0].hp===87&&enemies[0].poison===1.5:a.radius?rings.length===1&&rings[0].damage===a.damage:rings.length===0);
 const x=player.x;dashFor(player);check(player.x===x);
 player.dash=0;player.x=190;dashFor(player);check(player.x===191);
}
`)(check);
console.log('Combat regression: '+count+' assertions passed; scripts parsed. Browser and multiplayer not tested.');
