// Run from repository root: node tests/boss-encounters.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const bossEncounterProfiles='),b=c.indexOf('function bossComboTick(',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
check(bossEncounterProfiles.length===15);check(new Set(bossEncounterProfiles.map(x=>JSON.stringify(x))).size>=12);
for(let id=0;id<15;id++){
 const [shift,rest,bonus]=bossEncounterFor(id),e={type:'boss',bossId:id,maxhp:100,hp:100};
 check(shift>=.6&&shift<=1&&rest>=.36&&rest<=.64&&bonus>=1.12&&bonus<=1.2);
 check(bossStageFor(e)===1);e.hp=54;check(bossStageFor(e)===2);e.hp=24;check(bossStageFor(e)===3);e.hp=55;check(bossStageFor(e)===1);e.hp=25;check(bossStageFor(e)===2);
 e.phaseShift=shift;e.chargeRecover=rest;check(bossEncounterState(e,true)==='phase');check(bossCounterMultiplier(e,true)===1);
 for(let n=0;n<61;n++)tickBossEncounter(e,1/60,true);check(e.phaseShift===0&&e.chargeRecover===0);
 e.charge={left:.2};check(bossEncounterState(e,true)==='charge');e.charge=null;e.chargeRecover=rest;
 check(bossEncounterState(e,true)==='exposed'&&bossCounterMultiplier(e,true)===bonus);check(bossCounterMultiplier(e,false)===1);check(bossEncounterHold(e)===rest);
 e.comboWindup=.5;e.comboRecover=1;check(bossEncounterState(e,true)==='attack');check(bossCounterMultiplier(e,true)===1);
 e.comboWindup=0;check(bossEncounterHold(e)===1);check(bossCounterMultiplier(e,true)===bonus);
 e.lunge=.1;check(bossCounterMultiplier(e,true)===1);e.lunge=0;e.dead=true;check(bossCounterMultiplier(e,true)===1);
 tickBossEncounter(e,1/60,false);check(e.phaseShift===0&&e.chargeRecover===0);
}
check(bossCounterMultiplier({type:'fork',chargeRecover:1},true)===1);
`)(check);
check(c.includes('d*counter*artifactWeaponMultiplier'));check(c.includes("owner==='p1'"));check(c.includes('e.chargeRecover=bossEncounterFor(e.bossId)[1];hold=true;'));check(c.includes('if(e.attack<=0&&!recovering&&!hold)'));check(c.includes('id="bossState"'));check(c.includes('if(Math.hypot(tp.x-e.x,tp.y-e.y)<42)hurtPlayer'));
console.log('Boss encounters: '+count+' assertions passed; phase thresholds, bounded recovery, counter eligibility and attack gates.');
