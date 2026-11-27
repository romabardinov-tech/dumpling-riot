// Run from repository root: node tests/hero-quests.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');
let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const heroQuests='),b=c.indexOf('const ritualChoices=',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
const addCoins=(r,n)=>{const old=r.coins;r.coins=Math.min(9999,r.coins+n);return r.coins-old};
for(const spec of heroQuests){
 const r={hero:spec.hero,quest:newHeroQuest(spec.hero),closed:false,cleared:0,coins:0},seen=new WeakSet(),token={};
 check(validHeroQuest(r.quest,r.hero));check(!advanceHeroQuest(r,'wrong',1,token,seen));
 check(!advanceHeroQuest(r,spec.event,-1));check(!advanceHeroQuest(r,spec.event,NaN));
 check(advanceHeroQuest(r,spec.event,1,token,seen));check(!advanceHeroQuest(r,spec.event,1,token,seen));
 for(let i=0;i<spec.goal+2;i++)advanceHeroQuest(r,spec.event,1,{},seen);
 check(r.quest.progress===spec.goal);check(settleHeroQuest(r)===0);check(!r.quest.claimed);
 r.cleared=1;check(settleHeroQuest(r)===25);check(r.quest.claimed);check(r.coins===25);check(settleHeroQuest(r)===0);
 check(!advanceHeroQuest(r,spec.event,10));check(validHeroQuest(JSON.parse(JSON.stringify(r.quest)),r.hero));
 check(!validHeroQuest({progress:spec.goal+1,claimed:false},r.hero));check(!validHeroQuest({progress:0,claimed:true},r.hero));
}
check(!advanceHeroQuest(null,'scarMelee'));check(newHeroQuest('unknown')===null);
check(projectileQuestEvent({owner:'p1',artHero:'vesa',bleed:1})==='vesaBleed');
check(projectileQuestEvent({owner:'p1',artHero:'assassin',poison:1})==='shivPoison');
check(projectileQuestEvent({owner:'p2',artHero:'vesa',bleed:1})===null);
check(projectileQuestEvent({owner:'p1',artHero:'vesa',bleed:0})===null);
check(ringQuestEvent({owner:'p1',artHero:'scar',artSlot:0})==='scarMelee');
check(ringQuestEvent({owner:'p1',artHero:'scar',artSlot:2})==='scarMelee');
check(ringQuestEvent({owner:'p1',artHero:'scar',artSlot:1})===null);
check(ringQuestEvent({owner:'p1',artHero:'nyx',artSlot:2})==='nyxSlash');
check(ringQuestEvent({owner:'p1',artHero:'pelmage',artSlot:2,questExplosion:true})==='mageBlast');
check(ringQuestEvent({owner:'p1',artHero:'pelmage',artSlot:2})===null);
check(ringQuestEvent({owner:'p2',artHero:'scar',artSlot:0})===null);
`)(check);
console.log('Hero quests: '+count+' assertions passed; isolated tracking and settlement.');
