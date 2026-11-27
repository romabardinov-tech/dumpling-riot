// Run from repository root: node tests/squad-pacing.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const squadAttackProfiles='),b=c.indexOf('function updateEnemies(dt)',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
const dt=1/60,p={x:0,y:0,hp:100},mk=(type,x=40,extra={})=>({type,x,y:0,attack:0,...extra});
const clock={};resetSquadAttackPacing(clock);
for(const family of Object.keys(squadAttackGaps)){
 const types=Object.keys(squadAttackProfiles).filter(k=>squadAttackProfiles[k][0]===family);
 const list=Array.from({length:12},(_,i)=>mk(types[i%types.length]));
 const shots=[],counts=Array(list.length).fill(0);
 resetSquadAttackPacing(clock);
 for(let frame=0;frame<600;frame++){
  paceSquadAttacks(list,p,5,dt,clock,true);
  let grants=0;
  for(let i=0;i<list.length;i++){const e=list[i];e.attack-=dt;if(e.attack<=0){grants++;counts[i]++;shots.push(frame);e.attack=.78;}}
  check(grants<=1);
 }
 for(let i=1;i<shots.length;i++)check((shots[i]-shots[i-1])*dt+1e-7>=squadAttackGaps[family]);
 check(counts.every(n=>n>=2));check(Math.max(...counts)-Math.min(...counts)<=1);
}
const mixed=[mk('chainHound'),mk('eye'),mk('boneWalker'),mk('stalker'),mk('boiler'),mk('maw')];
resetSquadAttackPacing(clock);paceSquadAttacks(mixed,p,3,dt,clock,true);
check(mixed.filter(e=>e.attack<=dt).length===3);
const exempt=[mk('eye'),mk('eye'),mk('eye'),mk('eye',40,{elite:true}),mk('eye',40,{mutation:'x'}),mk('boss'),mk('eye',40,{dead:true}),mk('chainHound',125)];
resetSquadAttackPacing(clock);paceSquadAttacks(exempt,p,5,dt,clock,true);
check(exempt.slice(3).every(e=>e.attack===0));check(exempt.slice(0,3).filter(e=>e.attack===0).length===1);
for(const [enabled,round] of [[false,8],[true,1],[true,2]]){const list=[mk('eye'),mk('eye'),mk('eye')];paceSquadAttacks(list,p,round,dt,clock,enabled);check(list.every(e=>e.attack===0));check(Object.values(clock).every(x=>x===0));}
const pair=[mk('eye'),mk('eye')];paceSquadAttacks(pair,p,5,dt,clock,true);check(pair.every(e=>e.attack===0));
const near=[mk('chainHound'),mk('chainHound',126),mk('chainHound',80),mk('chainHound',40,{lunge:.1})];paceSquadAttacks(near,p,5,dt,clock,true);check(near[1].attack===0&&near[3].attack===0);
resetSquadAttackPacing(clock);check(Object.values(clock).every(x=>x===0));
`)(check);
check(c.includes('resetSquadAttackPacing(squadAttackPacing);'));
check(c.includes('paceSquadAttacks(enemies,targets[0],wave,dt,squadAttackPacing,!!soloRun&&!coop&&!onlineMode)'));
console.log('Squad pacing: '+count+' assertions passed; family spacing, fairness, exemptions and wave reset.');
