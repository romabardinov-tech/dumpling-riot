const fs=require('node:fs'),assert=require('node:assert/strict'),c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};const section=(a,b)=>{const i=c.indexOf(a),j=c.indexOf(b,i+a.length);assert(i>=0&&j>i);return c.slice(i,j)};
new Function('check',section('const waveHorrorArt=','function drawEvolvingEnemy(')+`
const ids=Object.keys(waveHorrorArt);check(ids.length===24);check(new Set(ids.map(id=>waveHorrorArt[id][0])).size===6);check(waveHorrorLevel(1)===0&&waveHorrorLevel(30)===1&&waveHorrorLevel(1000)===1);
function draw(id,w,seed,phase,less){let depth=0,ops=[];const g={save(){depth++},restore(){depth--},fillRect(x,y,w,h){check([x,y,w,h].every(Number.isFinite)&&w>0&&h>0);ops.push([this.fillStyle,x,y,w,h])},beginPath(){},moveTo(x,y){check(Number.isFinite(x)&&Number.isFinite(y));ops.push([x,y])},lineTo(x,y){check(Number.isFinite(x)&&Number.isFinite(y));ops.push([x,y])},closePath(){},fill(){ops.push(this.fillStyle)}};paintWaveHorror(g,id,w,seed,phase,less);check(depth===0&&ops.length<250);return JSON.stringify(ops)}
const unique=new Set();
for(const id of ids){let last=draw(id,1,5,0,true);check(last==='[]');for(let w=2;w<=30;w++){const current=draw(id,w,5,0,true);check(current!==last);last=current}check(draw(id,30,5,12,true)===last);check(draw(id,1000,5,0,true)===last);unique.add(last)}
check(unique.size===24);
`)(check);
check(c.includes('e.artWave=wave;e.artSeed='));check(c.includes('artWave:e.artWave,artSeed:e.artSeed})),projectiles:'));check(c.includes('drawEvolvingEnemy(ctx,e,phase,wave'));check(c.includes('drawEvolvingEnemy(g,q,Number.isFinite(q.phase)'));
console.log('Wave horror evolution: '+count+' assertions passed; 24 species, 30 wave levels, reduced motion, deterministic rendering and network/death wiring. No live screenshot.');
