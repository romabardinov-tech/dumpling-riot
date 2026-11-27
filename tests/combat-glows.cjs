// Run from repository root: node tests/combat-glows.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const section=(a,b)=>{const i=c.indexOf(a),j=c.indexOf(b,i+a.length);assert(i>=0&&j>i);return c.slice(i,j)};
new Function('check',section('const fxGlowCache=','function paintArenaAtmosphere(')+section('const combatGlowPalette=','function draw(){')+`
const view={x:0,y:0,w:480,h:270};
const rings=Array.from({length:50},(_,i)=>({x:20+(i%10)*48,y:24+Math.floor(i/10)*48,r:40,life:.2,maxlife:.4,artHero:'scar',element:'fire'}));
const shots=Array.from({length:100},(_,i)=>({x:20+(i%10)*48,y:24+Math.floor(i/10)%5*48,r:2,life:1,enemy:i%2===0,artHero:'nyx',element:'curse'}));
check(selectCombatGlows(rings,shots,view,false).length===0);
const lights=selectCombatGlows(rings,shots,view,true);
check(lights.length===10);check(lights.filter(q=>q.kind==='fire').length===5);check(lights.some(q=>q.kind==='enemy'));
check(new Set(lights.map(q=>Math.floor(q.x/48)+':'+Math.floor(q.y/48))).size===lights.length);
for(const q of lights){check(q.alpha>0&&q.alpha<=.14);check(q.r>=16&&q.r<=65)}
check(selectCombatGlows([{x:900,y:900,r:10,life:1,maxlife:1,artHero:'scar'}],[],view,true).length===0);
check(selectCombatGlows([{x:1,y:1,r:NaN,life:1,maxlife:1,artHero:'scar'}],[],view,true).length===0);
check(selectCombatGlows([{x:1,y:1,r:10,life:0,maxlife:1,artHero:'scar'}],[],view,true).length===0);
check(selectCombatGlows([], [{x:30,y:30,r:2,life:1,artHero:'nyx',element:'unknown'}],view,true)[0].kind==='physical');
const before=JSON.stringify([rings,shots]);let draws=0,created=0,depth=0,gradients=0;
const g={save(){depth++},restore(){depth--},drawImage(cv,x,y,w,h){check(cv.width===64&&cv.height===64);check([x,y,w,h].every(Number.isFinite)&&w>0&&h>0);draws++},createRadialGradient(){gradients++;return{addColorStop(){}}},fillRect(){}};
const document={createElement(){created++;return{getContext:()=>g}}};
paintCombatGlows(g,rings,shots,view,false);check(draws===0&&created===0);
paintCombatGlows(g,rings,shots,view,true);const first=created;check(draws===10&&depth===0&&first===gradients);
for(let i=0;i<60;i++)paintCombatGlows(g,rings,shots,view,true);check(created===first&&depth===0);check(draws===610);check(JSON.stringify([rings,shots])===before);
for(let i=0;i<25;i++)fxGlowSprite('test:'+i,'#112233');check(fxGlowCache.size===16);
`)(check);
const draw=section('function draw(){','function updateHud(){');check(draw.indexOf('paintFloorVignette(')<draw.indexOf('paintCombatGlows('));check(draw.indexOf('paintCombatGlows(')<draw.indexOf('paintNightmareFloor('));check(draw.indexOf('paintCombatGlows(')<draw.indexOf('paintHazardReadability('));check(c.includes("fxGlowSprite('arena:'+id,f.color)"));check(c.includes("horrorFx&&!reduceMotion&&state==='game'&&waveState==='fighting'"));
console.log('Combat glows: '+count+' assertions passed; bounded light count, cache reuse, culling, immutable simulation and warning order.');
