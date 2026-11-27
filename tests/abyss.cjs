// Run from repository root: node tests/abyss.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');
let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const ABYSS_GOAL='),b=c.indexOf('function normalizeRunHistory(',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
const data={campaignWins:0,abyssCleared:0};check(nextAbyss(data)===null);data.campaignWins=1;
for(const q of abyssRanks){
 check(nextAbyss(data)===q.rank);
 const r={abyss:q.rank,daily:null,campaign:null,contract:'normal',modifier:'classic',cleared:0};
 for(let w=1;w<=15;w++){
  check(validAbyssRun(r,w));const e=abyssEffects(r,w);
  check(e.extra===(w<=5&&w%5!==0?q.extra:0));check(e.light===(w>=6&&w<=10?q.light:0));check(e.boss===(w>=11?q.boss:1));check(e.hurt===q.hurt);
  r.cleared=w;check(claimAbyssBonus(data,r)===(w===15?q.reward:0));
 }
 check(abyssCompleted(r));check(claimAbyssBonus(data,r)===0);check(data.abyssCleared===q.rank);
 check(!validAbyssRun(r,16));check(!validAbyssRun({...r,daily:'2026-11-27'},1));check(!validAbyssRun({...r,campaign:{}},1));check(!validAbyssRun({...r,contract:'blood'},1));check(!validAbyssRun({...r,modifier:'scavenger'},1));
}
check(nextAbyss(data)===3);check(normalizeAbyss(99)===3);check(normalizeAbyss(-1)===0);check(normalizeAbyss('3')===0);check(validAbyssRun({},100));check(!validAbyssRun({abyss:4},1));
check(claimAbyssBonus({campaignWins:1,abyssCleared:0},{abyss:3,cleared:15,campaign:null,contract:'normal',modifier:'classic'})===0);
check(abyssEffects(null,15).boss===1);check(!abyssCompleted({cleared:15}));
`)(check);
console.log('Abyss: '+count+' assertions passed; rank gates, phase effects and first-clear rewards.');
