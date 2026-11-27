// Run from repository root: node tests/campaign-paths.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');
let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const campaignPaths='),b=c.indexOf('function campaignVictory(',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
const CAMPAIGN_MAPS=['kitchen','basement','foodcourt','slaughter','cemetery','forest'],FINAL_WAVE=15;
const addCoins=(r,n)=>{r.coins=Math.min(9999,r.coins+n)};
for(const start of CAMPAIGN_MAPS)for(let i=0;i<6;i++)for(let j=0;j<6;j++){
 const c=newCampaign(start),run={campaign:c,coins:0},p={hp:40,maxhp:100,bomb:3};
 const rand=()=> (i+.5)/6;
 check(activeCampaignPath(run).id==='legacy');check(routeOptions(c,4,rand).length===0);
 let choices=routeOptions(c,5,rand);check(choices.length===2&&choices[0].map!==choices[1].map);
 check(choices.every(q=>q.map!==start));check(['sanctuary','supply'].includes(choices[0].path));check(['ambush','famine','eclipse'].includes(choices[1].path));
 check(routeOptions(c,5,rand).length===0);
 const picked=chooseCampaignRoute(c,5,choices[j%2].map);check(!!picked);check(c.chapter===2&&c.paths.length===1);check(activeCampaignPath(run).id===picked.path);
 pathReward(run,p,picked);check(p.hp<=100&&p.bomb<=9&&run.coins>=0);
 check(chooseCampaignRoute(c,5,picked.map)===null);
 choices=routeOptions(c,10,()=> (j+.5)/6);
 check(choices.length===2&&choices.every(q=>!c.visited.includes(q.map)));
 const next=chooseCampaignRoute(c,10,choices[(j+1)%2].map);check(!!next);check(c.chapter===3&&new Set(c.visited).size===3);
 check(validCampaignPaths(c.paths,2));check(activeCampaignPath(run).id===next.path);check(routeOptions(c,15,rand).length===0);
 check(activeCampaignPath({campaign:JSON.parse(JSON.stringify(c))}).id===next.path);
}
const legacy={start:'kitchen',visited:['kitchen','forest'],chapter:2,gate:5,options:[],won:false};
const q=routeOptions(legacy,10,()=>0);check(chooseCampaignRoute(legacy,10,q[0].map)!==null);check(legacy.paths[0]==='legacy'&&legacy.paths.length===2);
check(!validCampaignPaths(['nope'],1));check(!validCampaignPaths(['sanctuary'],2));check(!validCampaignPaths(null,0));
for(const path of campaignPaths){
 const p={hp:40,maxhp:100,bomb:8},r={coins:10};pathReward(r,p,{path:path.id});
 check(p.hp===Math.min(100,40+Math.ceil(100*(path.healNow??0))));
 check(p.bomb===Math.min(9,8+(path.bombsNow??0)));check(r.coins===10+(path.coinsNow??0));
}
check(activeCampaignPath(null).id==='legacy');check(activeCampaignPath({campaign:{chapter:2}}).id==='legacy');
`)(check);
console.log('Campaign paths: '+count+' assertions passed; isolated transitions and rewards.');
