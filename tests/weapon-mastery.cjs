// Run from repository root: node tests/weapon-mastery.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const section=(a,b)=>{const i=c.indexOf(a),j=c.indexOf(b,i+a.length);assert(i>=0&&j>i);return c.slice(i,j)};
new Function('check',section('const weaponMasteries=','function legendaryEligible(')+`
for(let slot=0;slot<4;slot++)for(const path of ['force','reach']){
 const p={weaponLevels:[5,5,5,5],evolved:[true,true,true,true]};
 check(!masteryEligible(p,slot));check(!chooseMastery(p,slot,path));p.weaponLevels[slot]=6;
 check(masteryEligible(p,slot));check(masteryOptions(p,slot,false).length===0);check(masteryOptions(p,slot,true).map(o=>o.id).join(',')==='mastery_'+slot+'_force,mastery_'+slot+'_reach');
 check(!chooseMastery(p,slot,'invalid'));check(chooseMastery(p,slot,path));check(!chooseMastery(p,(slot+1)%4,path));check(masteryOptions(p,slot,true).length===0);
 const m=masteryFor(p,slot,true);check(m===weaponMasteries[path]);check(masteryFor(p,slot,false)===neutralMastery);check(masteryFor(p,(slot+1)%4,true)===neutralMastery);
 check(masteryRadius(50,m)===(path==='force'?50:59));check(masteryRadius(0,m)===0);
 const loaded=JSON.parse(JSON.stringify(p));check(masteryFor(loaded,slot,true)===m);
 loaded.evolved[slot]=false;check(masteryFor(loaded,slot,true)===neutralMastery);
}
check(weaponMasteries.force.damage===1.25&&weaponMasteries.force.charge===1.15);check(weaponMasteries.reach.damage===.92&&weaponMasteries.reach.pierce===1);
const old={weaponLevels:[6,1,1,1],evolved:[true,false,false,false]};check(masteryFor(old,0,true)===neutralMastery);check(masteryEligible(old,0));
`)(check);
new Function('check',section('function validCheckpoint(','function readCheckpoint(')+`
const CAMPAIGN_MAPS=['kitchen'],chars=[{id:'scar'}],runContracts=[{id:'normal'}],encounterRooms=[],runArtifacts=[],arena={l:0,r:1000,t:0,b:1000};
const q={v:1,wave:6,map:'kitchen',weapon:0,score:1,combo:1,fear:0,relic:false,run:{hero:'scar',startMap:'kitchen',campaign:null,contract:'normal',cleared:5,earned:0,kills:0,closed:false,coins:0,coinsEarned:0,coinsSpent:0,purchases:0,lastShop:0,pact:null,lastEncounter:0,seenRooms:[],roomChoices:0,nextRoomEffect:null,hiddenSummoned:[],hiddenDefeated:[],nextHidden:null,stationUses:0},player:{x:500,y:500,aim:0,hp:100,maxhp:100,xp:0,next:100,lvl:6,speed:88,fire:0,dash:0,bomb:3,inv:0,boost:{dmg:1,rate:1,move:1,crit:0},heroUpgrades:[],artifacts:[],evolved:[true,false,false,false],weaponLevels:[6,1,1,1],weaponCharge:[1,1,1,1],shivCharge:1},drops:[]};
check(validCheckpoint(q));for(const path of ['force','reach']){q.player.mastery={slot:0,path};check(validCheckpoint(q));check(parseCheckpoint(JSON.stringify(q)).player.mastery.path===path)}
for(const bad of [{slot:1,path:'force'},{slot:0,path:'invalid'},{slot:4,path:'reach'},{slot:0,path:'reach',extra:1},false,[]]){q.player.mastery=bad;check(!validCheckpoint(q))}
q.player.mastery=null;check(validCheckpoint(q));
`)(check);
check(c.includes('*mastery.damage'));check(c.includes('masteryFor(p,i,!coop&&!onlineMode).charge'));check(c.includes('masteryRadius(extra.explosionRadius||0,mastery)'));check(c.includes('masteryRadius(wide?Math.round(max*1.35):max,mastery)'));check(c.includes('player.mastery=player.mastery??null'));check(c.includes('p.mastery=null'));check(c.includes('const special=masteryOptions(p,weapon,!!soloRun)'));
console.log('Weapon mastery: '+count+' assertions passed; exclusive branches, effect bounds, save migration and combat wiring.');
