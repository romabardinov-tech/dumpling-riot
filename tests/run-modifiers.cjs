// Run from repository root: node tests/run-modifiers.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');
let count=0;const check=x=>{assert(x);count++};
const start=c.indexOf('const runModifiers='),end=c.indexOf('const ritualChoices=',start);assert(start>=0&&end>start);
new Function('check',c.slice(start,end)+`
const classic=modifierFor('classic');
check(rollModifier('classic',()=>{throw Error('unexpected RNG')})==='classic');
check(rollModifier('bad')==='classic');check(normalizeModifierChoice('bad')==='classic');check(normalizeModifierChoice('random')==='random');
for(let i=0;i<6;i++){const id=runModifiers[i+1].id;check(rollModifier('random',()=> (i+.5)/6)===id);check(rollModifier(id,()=>{throw Error('unexpected RNG')})===id);check(validRunModifier(id));}
check(rollModifier('random',()=>1)==='headhunter');check(!validRunModifier('random'));
for(const hp of [78,84,88,92,95,110,125,170,210])for(const q of runModifiers){
 const p={maxhp:hp,hp,boost:{dmg:1.2,move:1.15}};
 applyStartingModifier(p,q.id);
 check(p.hp===p.maxhp&&p.hp>=1);check(p.maxhp===Math.round(hp*(q.startHP??1)));
 check(p.boost.dmg===1.2*(q.startDamage??1));check(p.boost.move===1.15*(q.startMove??1));
 for(const k of ['enemyHP','xp','coins','heal','bossHP']){check(modifierValue({modifier:q.id},k)===(q[k]??1));check(modifierValue(null,k)===1);check(modifierValue({},k)===1);}
}
check(modifierFor('lastlight').refuge===5);check(modifierFor('headhunter').bossCoins===8);
`)(check);
console.log('Run modifiers: '+count+' assertions passed; isolated rule checks.');
