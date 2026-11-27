// Run from repository root: node tests/audio.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const soundscapes='),b=c.indexOf('let effectsVolume=',a);assert(a>=0&&b>a);
new Function('check',c.slice(a,b)+`
check(Object.keys(soundscapes).length===6);
for(const map of Object.keys(soundscapes)){
 for(let i=0;i<12;i++)for(let t=0;t<=2;t++){const q=soundscapeEvent(map,i,t);check(q.hz>=25&&q.hz<=300);check(q.duration>0&&q.duration<=1);check(q.period>=2&&q.period<=6);check(q.volume<=.04);check(JSON.stringify(q)===JSON.stringify(soundscapeEvent(map,i,t)))}
 check(soundscapeEvent(map,0,2).period<soundscapeEvent(map,0,0).period);
}
check(tensionLevel(1,0,false)===0);check(tensionLevel(.4,0,false)===1);check(tensionLevel(.2,0,false)===2);check(tensionLevel(1,85,false)===2);check(tensionLevel(1,0,true)===2);
check(audioPercent(-1)===0);check(audioPercent(101)===100);check(audioPercent('bad')===80);check(scoreMix(0,true,true)===0);check(scoreMix(100,true,false)<scoreMix(100,false,false));check(scoreMix(100,false,true)<scoreMix(100,false,false));
const g={};check(admitAudio(g,'hit',0,cueInterval('hit')));check(!admitAudio(g,'hit',.03,cueInterval('hit')));check(admitAudio(g,'shoot',.03,cueInterval('shoot')));check(admitAudio(g,'hit',.08,cueInterval('hit')));
`)(check);
check(c.includes('effectsGain.connect(masterGain)'));check(c.includes('spatialVoices>=5'));check(c.includes('id="effectsVolume"'));check(!c.includes('const volume=.045*(musicVolume/100)'));
console.log('Audio: '+count+' assertions passed; deterministic soundscapes, tension, rate limits and volume routing.');
