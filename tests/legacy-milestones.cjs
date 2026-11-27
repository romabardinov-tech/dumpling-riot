// Run from repository root: node tests/legacy-milestones.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const legacyMilestones='),b=c.indexOf('function rememberRun(',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
const chars=['scar','vesa','nyx','pelmage','assassin','golem','warden','revenant'].map(id=>({id})),CAMPAIGN_MAPS=['kitchen','basement','foodcourt','slaughter','cemetery','forest'],campaignEndings=['dawn','echo','root'].map(id=>({id})),fieldRecordIds=()=>CAMPAIGN_MAPS.flatMap(m=>[0,1].map(i=>'record:'+m+':'+i)),metaInt=(v,max=1e9)=>Number.isFinite(v)?Math.max(0,Math.min(max,Math.floor(v))):0;
check(legacyMilestones.length===8&&new Set(legacyMilestones.map(q=>q.id)).size===8);
const history=[{hero:'scar',waves:12},{hero:'scar',waves:8},{hero:'vesa',waves:5},{hero:'unknown',waves:999}],data={shards:0,heroBest:normalizeHeroBest({scar:10,nyx:7,unknown:999},history),maps:{},endings:{},milestoneClaims:[]};
check(data.heroBest.scar===12&&data.heroBest.vesa===5&&data.heroBest.nyx===7&&!Object.hasOwn(data.heroBest,'unknown'));updateHeroBest(data,'scar',3);check(data.heroBest.scar===12);updateHeroBest(data,'scar',21);check(data.heroBest.scar===21);updateHeroBest(data,'unknown',99);check(!Object.hasOwn(data.heroBest,'unknown'));
for(const q of legacyMilestones){check(claimLegacyMilestone(data,[],q.id)===0);check(milestoneProgress(data,[],q)>=0&&milestoneProgress(data,[],q)<=q.goal)}
data.maps=Object.fromEntries(CAMPAIGN_MAPS.map(k=>[k,10]));for(const h of chars)updateHeroBest(data,h.id,10);data.endings=Object.fromEntries(campaignEndings.map(k=>[k.id,1]));data.abyssCleared=3;data.escapes=10;
const entries=[...fieldRecordIds(),'boss:13','boss:14','boss:13','unrelated'];
let total=0;for(const q of legacyMilestones){check(milestoneProgress(data,entries,q)===q.goal);check(claimLegacyMilestone(data,entries,q.id)===q.reward);total+=q.reward;check(data.shards===total);check(claimLegacyMilestone(data,entries,q.id)===0)}
check(data.milestoneClaims.length===8);check(total===295);check(normalizeMilestoneClaims(['unknown','escape','escape']).join(',')==='escape');
const saved=JSON.parse(JSON.stringify(data));saved.heroBest=normalizeHeroBest(saved.heroBest,[]);saved.milestoneClaims=normalizeMilestoneClaims(saved.milestoneClaims);check(saved.heroBest.scar===21);check(claimLegacyMilestone(saved,entries,'sixHorrors')===0);
const cap={...data,shards:999999999,milestoneClaims:[]};check(claimLegacyMilestone(cap,entries,'sixHorrors')===0&&cap.shards===999999999&&cap.milestoneClaims.length===0);
`)(check);
check(c.includes('updateHeroBest(data,run.hero,run.cleared)'));check(c.includes('r.heroBest=normalizeHeroBest(o.heroBest,r.history)'));check(c.includes('r.milestoneClaims=normalizeMilestoneClaims(o.milestoneClaims)'));check(c.includes('localStorage.setItem(META_KEY,raw)'));check(c.includes('id="legacyGoals"'));check(c.includes('id="heroRecords"'));
console.log('Legacy milestones: '+count+' assertions passed; lifetime records, migration, progress, claims and reward bounds.');
