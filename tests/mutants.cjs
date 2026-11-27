// Run from repository root: node tests/mutants.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');
let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const mutantProfiles='),b=c.indexOf('function artifactById(',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
const arena={l:0,r:400,t:0,b:400},tp={x:200,y:200};
for(const [map,q] of Object.entries(mutantProfiles)){
 check(mutantOffer(map,3,true,false,false,()=>0)===q);
 check(!mutantOffer(map,3,true,false,false,()=>.30));
 for(let w=1;w<=100;w++){
  check(!!mutantOffer(map,w,true,false,false,()=>0)===(w>=3&&w%5!==4&&w%5!==0));
  check(!mutantOffer(map,w,false,false,false,()=>0));
  check(!mutantOffer(map,w,true,true,false,()=>0));
  check(!mutantOffer(map,w,true,false,true,()=>0));
 }
 const e={type:q.type,x:180,y:180,hp:100,maxhp:100,speed:40};
 check(empowerMutant(e,map));check(!empowerMutant(e,map));check(e.hp===100&&e.speed===40);check(!empowerMutant({type:q.type,elite:'x'},map));
 check(mutantDamage(e,20)===(map==='cemetery'?10:20));check(mutantDamage(e,20)===(map==='cemetery'?10:20));check(mutantDamage(e,20)===20);
 const events=[],ally={x:185,y:185,hp:50,maxhp:100,type:'fork'},boss={x:181,y:181,hp:1,maxhp:100,type:'boss'},guard={x:181,y:181,hp:1,maxhp:100,type:'fork',secretGuard:true};
 const emit=(...args)=>events.push(args);
 mutantStep(e,tp,[e,ally,boss,guard],2.3,arena,emit);
 if(map==='basement'){check(events.length===2&&events.every(a=>a[0]==='hazard'&&a[5]===1))}
 else if(map==='forest'){check(events.length===1&&events[0][1]===e.x&&events[0][2]===e.y)}
 else if(map==='foodcourt'){check(events.length===1&&events[0][0]==='heal');check(ally.hp===62&&boss.hp===1&&guard.hp===1)}
 else if(map==='slaughter'){check(e.mutantWindup===.65&&mutantSpeed(e)===1);mutantStep(e,tp,[e],.66,arena,emit);check(mutantSpeed(e)===1.35);mutantStep(e,tp,[e],.86,arena,emit);check(mutantSpeed(e)===1)}
 else check(events.length===0);
 check(!!mutantDeathHazard(e)===(map==='kitchen'));
 if(map==='kitchen')check(mutantDeathHazard(e).delay===1.2);
 const g={save(){},restore(){},fillRect(){}};paintMutantMark(g,map);
}
check(!mutantOffer('bad',3,true,false,false,()=>0));
`)(check);
console.log('Rare mutants: '+count+' assertions passed; isolated spawn gates and mutation rules.');
