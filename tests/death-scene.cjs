const fs=require('node:fs'),assert=require('node:assert/strict'),c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};const section=(a,b)=>{const i=c.indexOf(a),j=c.indexOf(b,i+a.length);assert(i>=0&&j>i);return c.slice(i,j)};
new Function('check',section('const feedingProfiles=','function updateDeath(dt)')+`
const types=Object.keys(feedingProfiles);check(types.length===24);check(bossFeedingProfiles.length===15);
let reduceMotion=false;
for(const data of [...types.map(type=>({type})),...bossFeedingProfiles.map((_,bossId)=>({type:'boss',bossId}))]){
 const e={...data,x:150,y:0},p={x:0,y:0,dead:true};let elapsed=0,bites=0,opens=[];
 for(let i=0;i<60*5;i++){elapsed+=1/60;const old=Math.hypot(e.x,e.y);const bite=stepDeathFeeding(e,1/60,p,elapsed);if(old>(e.type==='boss'?39:18))check(!bite&&!e.feeding);if(bite)bites++;if(e.feeding)opens.push(feedingPose(e).open)}
 check(bites>0);check(opens.some(x=>x>.85)&&opens.some(x=>x<.1));check(opens.every(x=>x>=0&&x<=1));
 let depth=0,rects=0;const g={save(){depth++},restore(){depth--},fillRect(x,y,w,h){check([x,y,w,h].every(Number.isFinite)&&w>0&&h>0);rects++}};paintFeedingJaw(g,e);check(depth===0&&rects>0);reduceMotion=true;paintFeedingJaw(g,e);check(depth===0);reduceMotion=false;
}
const e={type:'fork',x:15,y:0};check(!stepDeathFeeding(e,.1,{x:0,y:0},.1)&&!e.feeding);
`)(check);
new Function('check',section('const deathCryProfiles=','function playPainVoice(')+`check(Object.keys(deathCryProfiles).length===8);check(new Set(Object.values(deathCryProfiles).map(x=>JSON.stringify(x))).size===8);for(const p of Object.values(deathCryProfiles))check(p[1]>p[0]&&p[3]>=.75&&p[3]<=1.7)`)(check);
check(c.includes("if(stepDeathFeeding(e,dt,target,deathTimer))playFeedingCue(e)"));check(c.includes("if(feeding&&(boss||!e.elite&&!e.champion))paintFeedingJaw(ctx,e)"));check(c.includes("enemyDeathVoice(e.type,e.type==='boss'?e.bossId:null)"));
console.log('Death scene: '+count+' assertions passed; 24 enemy and 15 boss jaw profiles, contact gating, bounded timing and 8 individual cries. No live audio/viewport test.');
