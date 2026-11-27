// Run from repository root: node tests/render-pacing.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');let count=0;
const check=x=>{assert(x);count++};
function section(a,b){const i=c.indexOf(a),j=c.indexOf(b,i+a.length);assert(i>=0&&j>i);return c.slice(i,j)}
new Function('check',section('function renderFrameDeadline(', 'let hudElapsed=')+`
for(const hz of [30,60,75,90,120,144,240]){
 let deadline=NaN,frames=0;
 for(let i=0;i<hz*10;i++){const now=i*1000/hz;const due=renderFrameDeadline(now,deadline);if(due!==null){check(due>now);deadline=due;frames++}}
 check(Math.abs(frames-Math.min(hz,60)*10)<=2);
}
check(renderFrameDeadline(5,16.667)===null);check(renderFrameDeadline(5,16.667,true)>5);check(renderFrameDeadline(2000,20)>2000);check(renderFrameDeadline(0,2000)>0);
`)(check);
new Function('check',section('function paintLowHpFrame(', 'function draw(){')+`
let rects=[],depth=0;
const g={save(){depth++},restore(){depth--},fillRect(...q){rects.push(q)}};
const v={x:40,y:50,w:480,h:270};
paintLowHpFrame(g,.3,v,false);paintLowHpFrame(g,.6,v,true);paintLowHpFrame(g,NaN,v,true);check(rects.length===0);
for(const hp of [0,.1,.3,.54]){rects=[];paintLowHpFrame(g,hp,v,true);check(rects.length===4&&depth===0);for(const [x,y,w,h] of rects){check(w>0&&h>0);check(!(x<280&&x+w>280&&y<185&&y+h>185))}}
`)(check);
const draw=section('function draw(){','function drawRemoteArrow(){');check(draw.indexOf('paintLowHpFrame(')<draw.indexOf('paintHazardReadability('));check(draw.indexOf('paintLowHpFrame(')<draw.indexOf('drawEnemy(a)'));check(c.includes('if(state===\'menu\'){if(changed)drawRemoteArrow()'));check(c.includes('const step=1/60;'));
console.log('Render pacing: '+count+' assertions passed; simulated display rates, low-HP edge geometry and draw order.');
