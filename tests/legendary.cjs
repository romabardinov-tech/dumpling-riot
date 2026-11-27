// Run from repository root: node tests/legendary.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');
let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const legendaryPaths='),b=c.indexOf('function eliteWave(',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
for(let i=0;i<4;i++){
 const p={hp:50,maxhp:100,evolved:[true,true,true,true],weaponLevels:[7,7,7,7],artifacts:legendaryPaths[i].items.slice(),legendarySlot:null};
 check(canAscend(p,i));check(!canAscend({...p,artifacts:[]},i));check(!canAscend({...p,weaponLevels:[6,6,6,6]},i));check(!canAscend({...p,evolved:[false,false,false,false]},i));
 check(ascendWeapon(p,i));check(!ascendWeapon(p,i));check(legendarySlotValid(p));check(!legendarySlotValid({...p,legendarySlot:9}));check(legendaryToken(p,i,false)===null);
 const t={x:0,y:0,hp:100,type:'fork'},others=[t,...[10,20,30,40,150].map(x=>({x,y:0,hp:100,type:'fork'}))],events=[];
 const emit=(kind,e,n)=>{events.push([kind,e,n]);if(kind==='damage')e.hp-=n};
 const token=legendaryToken(p,i,true);check(!!token);check(legendaryImpact(p,token,t,1000,others,0,emit));check(!legendaryImpact(p,token,t,1000,others,2,emit));
 check(!legendaryImpact(p,legendaryToken(p,i,true),t,1000,others,1,emit));
 check(events.filter(x=>x[0]==='pulse').length===1);
 if(i===0)check(p.hp===53);
 if(i===1)check(events.filter(x=>x[0]==='damage').length===1&&others[1].hp===55);
 if(i===2){check(t.frozen===2.8);const boss={type:'boss',hp:100,x:0,y:0};check(legendaryImpact(p,legendaryToken(p,i,true),boss,1000,others,2,emit));check(boss.hp===76)}
 if(i===3)check(events.filter(x=>x[0]==='damage').length===3&&others[1].hp===72&&others[4].hp===100);
 check(legendarySlotValid(JSON.parse(JSON.stringify(p))));
}
check(legendarySlotValid({}));check(legendarySlotValid({legendarySlot:null}));check(!legendarySlotValid({legendarySlot:'0'}));
`)(check);
console.log('Legendary ascensions: '+count+' assertions passed; isolated eligibility and proc bounds.');
