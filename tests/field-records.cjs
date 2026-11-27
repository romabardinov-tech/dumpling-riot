// Run from repository root: node tests/field-records.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const fieldRecords='),b=c.indexOf('const enemyNotes=',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
const area={l:0,r:1000,t:0,b:700};const ids=fieldRecordIds();check(ids.length===12&&new Set(ids).size===12);
for(const map of Object.keys(fieldRecords)){
 for(const [round,i] of [[3,0],[4,1],[8,0],[9,1]]){
  for(const p of [{x:50,y:50},{x:950,y:650},{x:500,y:350}]){
   const avoid=[{x:p.x+100,y:p.y,pad:60}];const q=makeFieldRecord(map,round,p,area,avoid,[]);
   check(!!q&&q.i===i&&ids.includes(q.key));check(q.x>=30&&q.x<=970&&q.y>=30&&q.y<=670);
   check(Math.hypot(q.x-avoid[0].x,q.y-avoid[0].y)>=84);
   check(makeFieldRecord(map,round,p,area,avoid,[q.key])===null);
   check(!stepFieldRecord(q,{x:q.x+23,y:q.y},.6,false));check(!stepFieldRecord(q,q,.6,true));
   for(let k=0;k<32;k++)check(!stepFieldRecord(q,q,1/60,false));
   check(stepFieldRecord(q,q,1/60,false));check(!stepFieldRecord(q,q,1,false));
  }
 }
 check(fieldRecords[map].every(n=>n.length===4&&n.every(s=>s.length>0)));
 for(const r of [1,2,5,6,7,10,11,15])check(makeFieldRecord(map,r,{x:500,y:350},area,[],[])===null);
}
check(makeFieldRecord('forest',3,{x:500,y:350},area,[{x:500,y:350,pad:10000}],[])===null);
let soloRun={},coop=false,onlineMode=false,state='game',waveState='fighting',player={x:500,y:350},hazards=[],stored=[],toastTimer=0;
const discoverJournal=k=>{if(stored.includes(k))return false;stored.push(k);return true},toast=()=>{},L=x=>x;
fieldRecord=makeFieldRecord('forest',3,player,area,[],[]);player.x=fieldRecord.x;player.y=fieldRecord.y;
hazards=[{x:player.x,y:player.y,radius:30,damage:10,remaining:.2}];updateFieldRecord(.6);check(stored.length===0);
waveState='clear';updateFieldRecord(.6);check(stored.length===1);updateFieldRecord(.6);check(stored.length===1);
fieldRecord=makeFieldRecord('forest',4,player,area,[],[]);player.x=fieldRecord.x;player.y=fieldRecord.y;coop=true;updateFieldRecord(.6);check(stored.length===1);coop=false;onlineMode=true;updateFieldRecord(.6);check(stored.length===1);
`)(check);
check(c.includes('...fieldRecordIds()'));check(c.includes("add('record:'+m.id+':'+i"));check(c.includes('fieldRecord=null;arenaTrial=null'));check(c.includes('updateArenaTrial(dt);updateFieldRecord(dt)'));
console.log('Field records: '+count+' assertions passed; unique lore, placement, collection, persistence wiring and mode guards.');
