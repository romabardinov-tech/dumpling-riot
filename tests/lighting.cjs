// Run from repository root: node tests/lighting.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const arenaLightingProfiles='),b=c.indexOf('// V67: cull presentation only',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
const TAU=Math.PI*2,arenaLights=Object.fromEntries(Object.keys(arenaLightingProfiles).map(k=>[k,[[20,20],[70,70],[120,120],[500,500]]]));
let created=0,gradients=0,draws=0,rects=0,depth=0,strokes=0;const colors=[];
const makeCtx=()=>({globalAlpha:1,save(){depth++},restore(){depth--},fillRect(x,y,w,h){check([x,y,w,h].every(Number.isFinite));check(w>=0&&h>=0);rects++},drawImage(cv,x,y,w,h){check(cv.width===64&&cv.height===64&&w>0&&h>0);draws++},createRadialGradient(){gradients++;return {addColorStop(t,c){check(t>=0&&t<=1);check(typeof c==='string');colors.push(c)}}},beginPath(){},arc(x,y,r){check(Number.isFinite(r)&&r>=0)},stroke(){strokes++},setLineDash(){}});
const document={createElement(){created++;return {getContext:()=>makeCtx()}}};
const g=makeCtx(),v={x:0,y:0,w:160,h:90},horrorFx=true,reduceMotion=false,state='game',waveState='fighting',dynamicHorror=null,horrorLocalLight=()=>1;
for(const [id,q] of Object.entries(arenaLightingProfiles)){
 check(/^#[0-9a-f]{6}$/i.test(q.warm)&&/^#[0-9a-f]{6}$/i.test(q.cool)&&/^#[0-9a-f]{6}$/i.test(q.shade));check(q.strength<=.4&&q.ambient<=.2&&q.radius<=112);
 paintArenaLighting(g,{id},v,false);paintFloorVignette(g,id,v,{x:80,y:45},true);paintActorContact(g,id,12,8);check(depth===0);
 const before=created;paintArenaLighting(g,{id},v,true);paintFloorVignette(g,id,v,{x:-400,y:-400},true);check(created===before);check(depth===0);
}
check(created===18&&gradients===18&&arenaLightSprites.size===18);check(fixtureVisible(0,0,10,v));check(!fixtureVisible(500,500,10,v));check(lightingProfile('bad')===arenaLightingProfiles.kitchen);
const before=draws;paintFloorVignette(g,'kitchen',v,null,false);check(draws===before);
paintHazardReadability(g,{x:20,y:20,radius:25,kind:'mutantDeath'});check(strokes===2&&depth===0);
check(new Set(Object.values(arenaLightingProfiles).map(q=>q.motif)).size===6);
`)(check);
const draw=c.slice(c.indexOf('function draw(){'),c.indexOf('function updateHud(){'));check(draw.indexOf('paintFloorVignette(')<draw.indexOf('paintNightmareFloor('));check(draw.indexOf('paintHazardReadability(')>draw.indexOf('drawEnemy(a)'));
console.log('Lighting: '+count+' assertions passed; mocked Canvas, bounded texture cache and render order.');
