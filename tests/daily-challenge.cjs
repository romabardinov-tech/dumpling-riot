// Run from repository root: node tests/daily-challenge.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');
let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const DAILY_GOAL='),b=c.indexOf('function normalizeRunHistory(',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
const sets=[new Set(),new Set(),new Set(),new Set()];
for(let i=0;i<730;i++){
 const date=dailyDate(new Date(Date.UTC(2025,0,1+i))),q=dailyPreset(date);
 check(validDailyDate(date));check(JSON.stringify(q)===JSON.stringify(dailyPreset(date)));
 check(dailyHeroes.includes(q.hero)&&dailyMaps.includes(q.map)&&dailyContracts.includes(q.contract)&&dailyModifiers.includes(q.modifier));
 [q.hero,q.map,q.contract,q.modifier].forEach((v,j)=>sets[j].add(v));
 const r={daily:date,hero:q.hero,startMap:q.map,contract:q.contract,modifier:q.modifier,campaign:null,cleared:9};
 check(validDailyRun(r,10));check(!validDailyRun(r,11));check(!validDailyRun({...r,hero:'warden'},10));
 const meta={dailyClaim:null};check(claimDailyBonus(meta,r,date)===0);r.cleared=10;check(claimDailyBonus(meta,r,date)===20);check(claimDailyBonus(meta,r,date)===0);check(dailyCompleted(r));check(meta.dailyClaim===date);
 check(!dailyBonusAvailable(meta,dailyDate(new Date(Date.UTC(2024,11,31))),date));
}
check(sets[0].size===6&&sets[1].size===6&&sets[2].size===4&&sets[3].size===6);
check(!validDailyDate('2026-02-30'));check(!validDailyDate('2026-1-1'));check(validDailyDate('2024-02-29'));
check(!dailyBonusAvailable({},'2026-11-28','2026-11-27'));check(validDailyRun({},20));check(!dailyCompleted({cleared:10}));
`)(check);
console.log('Daily challenge: '+count+' assertions passed; date presets and local claim rules.');
