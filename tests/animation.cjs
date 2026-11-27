// Run from repository root: node tests/animation.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('function recoilPose('),b=c.indexOf('function impactProfile(',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
const ids=Object.keys(heroMotionProfiles);check(ids.length===8);
for(const id of ids){
 const p={charId:id,vx:100,vy:0,speed:100,animMotion:0,animPhase:0,x:5,y:6};
 for(let i=0;i<60;i++)stepHeroMotion(p,1/60);
 check(p.animMotion>.99&&p.animMotion<=1);check(p.x===5&&p.y===6&&p.vx===100);
 const q=heroMotionPose(p,false,1);check(Math.abs(q.walk)<=1.2&&Math.abs(q.bob)<=3&&Math.abs(q.lean)<=.13);
 const reduced=heroMotionPose(p,true);check(reduced.walk===0&&reduced.bob===0&&reduced.lean===0&&reduced.phase===0);
 p.vx=0;const previous=p.animMotion;stepHeroMotion(p,1/60);check(p.animMotion<previous&&p.animMotion>0);
 for(let i=0;i<90;i++)stepHeroMotion(p,1/60);check(p.animMotion===0);const phase=p.animPhase;stepHeroMotion(p,1/60);check(p.animPhase===phase);
 for(let slot=0;slot<4;slot++){check(heroRecoilPose(id,.14,slot,false).offset<=8);check(heroRecoilPose(id,.14,slot,true).offset===0);check(heroRecoilPose(id,0,slot,false).offset===0)}
}
check(new Set(ids.map(id=>motionProfile(id).cadence)).size===8);
for(const [type,range] of Object.entries(enemyCueRanges)){
 const e={type,attack:.2,phase:1};check(enemyAnimationCue(e,10)===1);check(enemyAnimationCue({...e,attack:.3},10)===0);if(Number.isFinite(range))check(enemyAnimationCue(e,range+1)===0);check(enemyAnimationCue({...e,lunge:.1},10)===2);check(enemyAnimationCue({...e,dead:true},10)===0);
}
check(enemyAnimationCue({type:'fork',attack:.01},10)===0);check(enemyAnimationCue({type:'boss',charge:{left:.2}},10)===1);check(enemyAnimationCue({type:'boss',comboRecover:.2},10)===2);
for(const cue of [0,1,2]){const p=enemyMotionPose({type:'boss',phase:1,animCue:cue,hitT:.1},true);check(p.sx===1&&p.sy===1&&p.cue===cue&&p.bob===0)}
let depth=0,rects=0;const g={save(){depth++},restore(){depth--},fillRect(x,y,w,h){check(w>0&&h>0);rects++}};paintEnemyCue(g,{type:'boss'},1);check(depth===0&&rects===4);paintEnemyCue(g,{type:'fork'},0);check(rects===4);
`)(check);
console.log('Animation: '+count+' assertions passed; presentation clocks, bounded recoil and timing cues.');
