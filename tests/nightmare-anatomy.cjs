const fs=require('node:fs'),assert=require('node:assert/strict'),c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};const section=(a,b)=>{const i=c.indexOf(a),j=c.indexOf(b,i+a.length);assert(i>=0&&j>i);return c.slice(i,j)};
new Function('check',section('function heroIsLimping','function heroRecoilPose')+`
const motionProfile=()=>({stride:1,bob:2,lean:.08,cadence:8,settle:.15});
for(const charId of ['scar','vesa','nyx','pelmage','assassin','golem','warden','revenant']){
 const p={charId,hp:20,maxhp:100,x:3,y:4,vx:90,vy:0,speed:90,animMotion:1,animPhase:1};check(!heroIsLimping(p));check(!heroMotionPose(p).limp);
 p.hp=19.99;check(heroIsLimping(p));let poses=[];
 for(let i=0;i<100;i++){stepHeroMotion(p,1/60);const q=heroMotionPose(p);check(q.limp&&Math.abs(q.lean)<.3&&q.bob<=3);poses.push(JSON.stringify(q.limp));}
 check(new Set(poses).size>4);check(p.x===3&&p.y===4&&p.vx===90);check(heroMotionPose(p,true).limp.drag===0);p.hp=25;check(!heroMotionPose(p).limp);p.dead=true;p.hp=0;check(!heroIsLimping(p));
}
`)(check);
new Function('check',section('const nightmareAnatomy=','function pixelEnemy(')+`
const ids=Object.keys(nightmareAnatomy);check(ids.length===24);const signatures=new Set();
for(const id of ids){let depth=0,ops=[];const g={save(){depth++},restore(){depth--},fillRect(x,y,w,h){check([x,y,w,h].every(Number.isFinite)&&w>0&&h>0);ops.push([this.fillStyle,x,y,w,h])},beginPath(){},moveTo(x,y){check(Number.isFinite(x)&&Number.isFinite(y));ops.push([x,y])},lineTo(x,y){check(Number.isFinite(x)&&Number.isFinite(y));ops.push([x,y])},closePath(){},fill(){}};
 check(paintNightmareAnatomy(g,id,1,0,1,false));check(depth===0&&ops.length>5);signatures.add(JSON.stringify(ops));ops=[];check(paintNightmareAnatomy(g,id,99,0,1,true));const a=JSON.stringify(ops);ops=[];check(paintNightmareAnatomy(g,id,0,0,1,true));check(JSON.stringify(ops)===a&&depth===0);
}check(signatures.size===24);
`)(check);
check(c.includes('pixelHeroBody(ctx,ch.id,walk,phase,p.aim,gait.limp)'));check((c.match(/paintNightmareAnatomy\(g,type,phase,lunge,attack,reduceMotion\)/g)||[]).length===6);
console.log('Nightmare anatomy and limp: '+count+' assertions passed; all heroes, 24 authored enemies, reduced motion and bounded geometry. No actual viewport.');
