// Run from repository root: node tests/temporary-curses.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');
let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const temporaryCurses='),b=c.indexOf('const merchantPrices=',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
for(const q of temporaryCurses){
 const run={cleared:5,closed:false,campaign:null};
 check(acceptCurse(run,5,q.id));check(!acceptCurse(run,5,q.id));check(!activeCurse(run,5));check(activeCurse(run,6)===q);check(validCurseState(run,6));
 check(curseValue(run,6,'hurt')===(q.hurt??1));check(curseValue(run,6,'extra',0)===(q.extra??0));check(curseValue(run,6,'heal')===(q.heal??1));
 let total=0;
 for(let w=6;w<=10;w++){total+=clearCurseBonus(run,w);run.cleared=w;check(clearCurseBonus(run,w)===0);check(validCurseState(run,w+1))}
 check(total===15&&run.curseClears===5&&run.curse===null);check(!activeCurse(run,11));check(acceptCurse(run,10,q.id));
 run.cleared=13;check(removeCurse(run));check(!removeCurse(run));check(clearCurseBonus(run,14)===0);
}
for(let w=1;w<=100;w++){const run={cleared:w};check(!!curseOffer(run,w,()=>0)===(w>=5&&w%5===0));check(!curseOffer({...run,closed:true},w,()=>0));}
check(!acceptCurse({cleared:15,campaign:{}},15,'thorns'));check(!acceptCurse({cleared:5},5,'invalid'));
check(!validCurseState({cleared:5,curse:{id:'bad',start:6}},6));
check(!validCurseState({cleared:5,curse:{id:'thorns',start:7}},6));check(!validCurseState({cleared:5,curseClears:1},6));
check(validCurseState({cleared:5},6));check(!activeCurse(null,6));check(curseValue(null,6,'hurt')===1);
`)(check);
console.log('Temporary curses: '+count+' assertions passed; isolated duration, rewards and cleansing.');
