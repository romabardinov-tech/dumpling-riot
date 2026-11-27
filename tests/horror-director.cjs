// Run from repository root: node tests/horror-director.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const directorSceneSounds='),b=c.indexOf('let dynamicHorror=null;',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
const dt=1/60,q=newHorrorDirector('forest',3),step=(n,p)=>{for(let i=0;i<n;i++)stepHorrorDirector(q,dt,p)};
check(q.phase==='quiet'&&!directorAllowsScene(q));step(190,.2);check(q.phase==='build'&&directorAllowsScene(q));
step(1,.9);check(q.phase==='peak'&&!directorAllowsScene(q));step(120,.6);check(q.phase==='peak');
step(180,.1);check(q.phase==='recovery'&&q.recovery>0);step(360,.1);check(q.phase==='quiet'||q.phase==='build');
step(190,.1);check(q.phase==='build');step(1,.86);check(q.phase==='peak'&&q.recovery===5);
for(const hp of [0,.2,.25,.5,1,NaN])for(const fear of [0,50,100,NaN])for(const near of [0,3,5,99]){const p=directorPressure(hp,fear,near,false,false);check(p>=0&&p<=1&&Number.isFinite(p))}
check(directorPressure(.2,0,0,false,false)>=.72);check(directorPressure(1,0,0,true,false)>=.72);check(directorPressure(1,0,0,false,true)>=.72);
check(directorPressure(1,90,5,false,false)>directorPressure(1,10,1,false,false));
const event={period:4,volume:.03,hz:70},build=directorAmbient({phase:'build'},event),peak=directorAmbient({phase:'peak'},event);
check(peak.period>event.period&&peak.volume<event.volume&&build.volume>peak.volume);check(event.period===4&&event.volume===.03&&peak.hz===70);check(directorAmbient(null,event)===event);
check(Object.keys(directorSceneSounds).length===6);for(const cue of Object.values(directorSceneSounds))check(cue[0]>=25&&cue[1]>0&&cue[1]<1);
let soloRun={},coop=false,onlineMode=false,horrorFx=true,state='game',waveState='fighting',selectedMap='forest',wave=2,player={x:0,y:0,hp:100,maxhp:100},enemies=[],hazards=[],nightmare=null,boss=null;
tickHorrorDirector(dt);check(horrorDirector.phase==='quiet');hazards=[{x:0,y:0,radius:30,remaining:.5,damage:10}];tickHorrorDirector(dt);check(horrorDirector.phase==='peak');wave++;hazards=[];tickHorrorDirector(dt);check(horrorDirector.phase==='quiet'&&horrorDirector.round===wave);coop=true;tickHorrorDirector(dt);check(horrorDirector===null);coop=false;onlineMode=true;tickHorrorDirector(dt);check(horrorDirector===null);onlineMode=false;horrorFx=false;tickHorrorDirector(dt);check(horrorDirector===null);
`)(check);
check(c.includes('tickHorrorDirector(dt);tickDynamicHorror(dt)'));check(c.includes('if(!directorAllowsScene(horrorDirector)&&!dynamicHorror.active)return'));check(c.includes('dynamicHorror=null;horrorDirector=null;'));
console.log('Horror director: '+count+' assertions passed; pressure, hysteresis, recovery, scene admission and mode guards.');
