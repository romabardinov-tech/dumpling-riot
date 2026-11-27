// Run from repository root: node tests/advanced-loot.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const section=(a,b)=>{const i=c.indexOf(a),j=c.indexOf(b,i+a.length);assert(i>=0&&j>i);return c.slice(i,j)};
new Function('check',section('const artifactCombos=','function weaponElement(')+section('const runArtifacts=','// V53:')+section('function artifactById(','function artifactDashCooldown(')+`
const elements={fire:{}};const hasCombo=(p,id)=>artifactCombos.some(q=>q.id===id&&q.items.every(k=>p?.artifacts?.includes(k)));
const activeCombos=p=>artifactCombos.filter(q=>q.items.every(k=>p.artifacts.includes(k)));
const eq=(x,y)=>Math.abs(x-y)<1e-9;
const ids=runArtifacts.map(a=>a.id);check(ids.length===18&&new Set(ids).size===18);
check(artifactRollWeight('clock',['boots'])===2);check(artifactRollWeight('clock',[])===1);check(artifactRollWeight('boots',['clock','hourglass'])===2);
for(const owned of [[],['boots'],['fang','eye'],ids.slice(0,17)]){
 for(const [roll,tier] of [[.01,'legendary'],[.12,'epic'],[.42,'epic'],[.43,'rare'],[.99,'rare']]){
  for(let i=0;i<200;i++){
   let j=0;const a=chooseArtifact(owned,()=>j++===0?roll:i/200);
   check(!owned.includes(a.id));check(!runArtifacts.some(k=>k.rarity===tier&&!owned.includes(k.id))||a.rarity===tier);
  }
 }
}
check(chooseArtifact(ids,()=>0)===null);
let clockCount=0,fangCount=0;for(let i=0;i<800;i++){let j=0;const a=chooseArtifact(['boots'],()=>j++===0?.9:i/800,['boots']);if(a.id==='clock')clockCount++;if(a.id==='fang')fangCount++}check(Math.abs(clockCount/fangCount-2)<.03);
const p={artifacts:['hunterMark','bloodChime','graveKey'],hp:34,maxhp:100};check(eq(artifactWeaponMultiplier(p,{elite:'kitchen',cursed:1},'physical'),1.12*1.12*1.15));p.hp=35;check(eq(artifactWeaponMultiplier(p,{elite:'kitchen',mutation:'kitchen'},'physical'),1.12));check(eq(artifactWeaponMultiplier(p,{cursed:0},'physical'),1));check(eq(artifactWeaponMultiplier(p,{cursed:1},'physical'),1.15));check(eq(artifactWeaponMultiplier(null,{elite:true,cursed:3},'physical'),1));
for(const id of ['hunterMark','bloodChime','graveKey']){const q={artifacts:[],hp:50,maxhp:100,boost:{dmg:1,move:1,rate:1,crit:0}};check(applyArtifact(q,id));check(q.artifacts.length===1&&q.boost.dmg===1&&q.hp===50);check(!applyArtifact(q,id))}
`)(check);
new Function('check',section('function paintCombatDrop(','// V71.4')+section('const lootRarities=','// V52:')+section('const runArtifacts=','// V53:')+`
const artifactById=id=>runArtifacts.find(a=>a.id===id),reduceMotion=true;const seen=new Set();
for(const a of runArtifacts){let calls=[],depth=0;const g={fillRect(...v){check(v.every(Number.isFinite)&&v[2]>0&&v[3]>0);calls.push([this.fillStyle,...v])},save(){depth++},restore(){depth--},translate(){},beginPath(){},moveTo(...v){calls.push(v)},lineTo(...v){calls.push(v)},closePath(){},fill(){calls.push(this.fillStyle)}};paintCombatDrop(g,{x:0,y:0,type:'artifact',artifact:a.id});check(depth===0);seen.add(JSON.stringify(calls));}
check(seen.size===18);
`)(check);
check(c.includes('chooseArtifact(owned,random,p.artifacts)'));check(c.includes('chooseArtifact(owned,Math.random,player.artifacts)'));check(c.includes('unique(p.artifacts,runArtifacts.map(x=>x.id))'));
console.log('Advanced loot: '+count+' assertions passed; tier preservation, weighted pairs, conditional bonuses, unique art and checkpoint whitelist.');
