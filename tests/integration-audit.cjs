// Run from repository root: node tests/integration-audit.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');
const section=(a,b)=>{const i=c.indexOf(a),j=c.indexOf(b,i+a.length);assert(i>=0&&j>i);return c.slice(i,j)};
let count=0;const check=x=>{assert(x);count++};
new Function('check',section('function golemQuestHit(','function projectileQuestEvent(')+section('function pendingDeathBlast(','function updateHazards(')+`
const cast={targets:new Set(),done:false},a={},b={},c={},d={};let progress=0;
const record=(event,n,token)=>{check(event==='golemCrowd'&&token===cast);progress+=n;return true};
check(!golemQuestHit(cast,a,record));check(!golemQuestHit(cast,a,record));check(!golemQuestHit(cast,b,record));check(golemQuestHit(cast,c,record));check(!golemQuestHit(cast,d,record));check(progress===1);
const h={kind:'mutantDeath',remaining:1,damage:15},ordinary={remaining:1,damage:10},heal={kind:'foodcourt',remaining:1,damage:0},enemy={enemy:true},friendly={enemy:false};
check(!canClearCombat('game','fighting',4,4,null,[],[h],true));check(canClearCombat('game','fighting',4,4,null,[],[{...h,remaining:0}],true));check(!canClearCombat('death','fighting',4,4,null,[],[],true));check(!canClearCombat('game','fighting',3,4,null,[],[],true));check(!canClearCombat('game','fighting',4,4,{},[],[],true));check(!canClearCombat('game','fighting',4,4,null,[{}],[],true));check(canClearCombat('game','fighting',4,4,null,[],[ordinary],false));
const rest=safeRestAttacks([enemy,friendly],[h,ordinary,heal]);check(rest.projectiles.length===1&&rest.projectiles[0]===friendly);check(rest.hazards.length===1&&rest.hazards[0]===heal);
`)(check);
new Function('check',section('const temporaryCurses=','const merchantPrices=')+section('const DAILY_GOAL=','function normalizeRunHistory(')+section('function clearWaveReward(','function chooseOmen(')+`
const FINAL_WAVE=15,metaInt=(v,max=1e9)=>Math.max(0,Math.min(max,Math.floor(v))),waveReward=()=>5,campaignRound=(r,w)=>w,unlockAchievements=()=>{},rememberRun=(data,r,escaped)=>{data.history.push({escaped,w:r.cleared})},contractFor=()=>({mult:1});
const mk=()=>({shards:0,maps:{kitchen:0},best:0,campaignWins:1,abyssCleared:0,history:[],runs:0,kills:0,escapes:0});
const date=dailyDate(),q=dailyPreset(date),data=mk(),daily={daily:date,hero:q.hero,startMap:q.map,contract:q.contract,modifier:q.modifier,campaign:null,cleared:0,earned:0,kills:0,closed:false};
for(let w=1;w<=10;w++){check(clearWaveReward(data,daily,w,'kitchen')===(w===10?25:5));check(clearWaveReward(data,daily,w,'kitchen')===0)}
check(data.shards===70);check(clearWaveReward(data,daily,11,'kitchen')===0);check(!canExtractRun(daily));check(!finishMetaRun(data,daily,true));check(finishMetaRun(data,daily,false));check(data.history[0].escaped);check(data.escapes===0);
const retry={...daily,closed:false,cleared:9,earned:0};check(clearWaveReward(data,retry,10,'kitchen')===5);
for(let rank=1;rank<=3;rank++){
 const run={abyss:rank,campaign:null,daily:null,contract:'normal',modifier:'classic',cleared:0,earned:0,kills:0,closed:false};
 for(let w=1;w<=15;w++)check(clearWaveReward(data,run,w,'kitchen')===(w===15?5+abyssRank(rank).reward:5));
 check(data.abyssCleared===rank);check(!canExtractRun(run));check(clearWaveReward(data,run,16,'kitchen')===0);check(finishMetaRun(data,run,false));
}
const run={cleared:5,earned:0,kills:0,closed:false,campaign:null};check(acceptCurse(run,5,'thorns'));for(let w=6;w<=10;w++)check(clearWaveReward(data,run,w,'kitchen')===8);check(run.curse===null&&run.curseClears===5);check(canExtractRun(run));
let selectedChar='nyx',selectedMap='forest',campaignMode=true;const readStorage=(k,d)=>d,menuChoiceDefaults=()=>({hero:'scar',map:'kitchen'});rememberSpecialMenu();selectedChar='golem';selectedMap='basement';campaignMode=false;rememberSpecialMenu();restoreSpecialMenu();check(selectedChar==='nyx'&&selectedMap==='forest'&&campaignMode===true);restoreSpecialMenu();check(selectedChar==='scar'&&selectedMap==='kitchen'&&!campaignMode);
`)(check);
console.log('Integration audit: '+count+' assertions passed; actual reward composition, mode boundaries, cast accounting and rest hazards.');
