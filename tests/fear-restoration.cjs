const fs=require('node:fs'),assert=require('node:assert/strict'),c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const section=(a,b)=>{const i=c.indexOf(a),j=c.indexOf(b,i+a.length);assert(i>=0&&j>i);return c.slice(i,j)};
new Function('check',section('const FEAR_RULES=','let nightmare=null;')+section('const fearAnomalies=','function tickFearAnomaly')+`
const area={l:0,r:1000,t:0,b:1000},p={x:500,y:500,hp:100},n=newNightmare();
resetNightmareWave(n,{x:550,y:500});for(let i=0;i<60*20;i++)fearStep(n,1/60,1,4,1,false,true);check(n.fear>=25&&n.fear<100);
const before=n.fear;for(let i=0;i<60*2;i++)fearStep(n,1/60,1,2,1,true,true);check(n.fear<before&&n.charge<FEAR_RULES.charge);
check(!shouldSummonNightmare({...n,fear:100},1));check(shouldSummonNightmare({...n,fear:85},3));check(!shouldSummonNightmare({...n,fear:100,summoned:true},3));
for(const map of Object.keys(fearAnomalies)){
 let q=newNightmare();q.fear=65;q.anomalyTimer=0;check(fearAnomalyStep(q,.02,map,p,[p],area)==='warn');check(q.anomaly.map===map&&q.anomaly.radius===fearAnomalies[map].r);check(fearAnomalyStep(q,q.anomaly.left+.01,map,p,[p],area)==='hit');check(q.fear===65+fearAnomalies[map].gain);
 q.anomalyTimer=0;check(fearAnomalyStep(q,.02,map,p,[p],area)==='warn');const far={x:900,y:900};check(fearAnomalyStep(q,q.anomaly.left+.01,map,p,[far],area)==='avoid');
 q.anomalyTimer=0;check(fearAnomalyStep(q,.02,map,p,[p],area)==='warn');q.inside=true;check(fearAnomalyStep(q,2,map,p,[p],area)===''&&q.anomaly===null);
}
check(new Set(Object.values(fearAnomalies).map(a=>a.glyph)).size===6);
n.fear=90;n.hunter={};n.echo={};n.anomaly={};fearStep(n,1,2,0,1,false,false);check(n.fear===81&&n.hunter===null&&n.anomaly===null);
`)(check);
new Function('check',section('function fearClamp','function newNightmare')+section('const fearAnomalies=','function fearAnomalyStep')+section('function updateFearHud(n){','function updateHud(){')+`
const nodes=new Map(),document={getElementById:id=>{if(!nodes.has(id))nodes.set(id,{style:{},dataset:{},classList:{toggle(){}}});return nodes.get(id)}},L=(en,ru)=>en;let coop=false;updateFearHud({fear:0,charge:9});check(!nodes.get('fearHud').hidden&&nodes.get('fearValue').textContent==='0%');updateFearHud({fear:87,charge:3});check(nodes.get('fearHud').dataset.stage==='2'&&nodes.get('fearFill').style.width==='87%');coop=true;updateFearHud({fear:60,charge:3});check(nodes.get('fearLabel').textContent==='TEAM FEAR');updateFearHud(null);check(nodes.get('fearHud').hidden);
`)(check);
check(c.includes('nightmare=newNightmare();if(soloRun)'));check(c.includes('nightmare:nightmare?{fear:nightmare.fear'));check(c.includes('paintFearFrame(ctx,nightmare)'));check(c.includes('paintFearAnomaly(ctx,nightmare)'));check(c.includes('class="panel" hidden><div class="fearHead"'));
console.log('Fear restoration: '+count+' assertions passed; first wave pressure, refuge, hunter, all arena anomalies, HUD and network wiring. No real viewport or multiplayer test.');
