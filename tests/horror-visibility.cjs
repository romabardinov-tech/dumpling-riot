const fs=require('node:fs'),assert=require('node:assert/strict'),c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const section=(a,b)=>{const i=c.indexOf(a),j=c.indexOf(b,i+a.length);assert(i>=0&&j>i);return c.slice(i,j)};
new Function('check',section('function fearSightRadius','function paintFearFog')+`
check(fearSightRadius(0)===320);check(fearSightRadius(100)===94);let prev=321;for(let f=0;f<=100;f++){const r=fearSightRadius(f);check(r<=prev&&r>=94);prev=r}
const p={x:100,y:100};check(fearActorVisible({x:400,y:100},p,{fear:0}));check(!fearActorVisible({x:400,y:100},p,{fear:100}));check(fearActorVisible({x:170,y:100},p,{fear:100}));
`)(check);
new Function('check',section('const creatureCalls=','function clearNpc()')+section('const heroPainProfiles=','function hurtPlayer(')+`
const ids=['scar','vesa','nyx','pelmage','assassin','golem','warden','revenant'];check(ids.every(id=>heroPainProfiles[id]));check(new Set(ids.map(id=>JSON.stringify(heroPainProfiles[id]))).size===8);check(Object.keys(creatureCalls).length===25);
const noop=()=>{},param=()=>({setValueAtTime:noop,exponentialRampToValueAtTime:noop}),node=()=>({connect:noop,disconnect:noop,frequency:param(),gain:param(),start:noop,stop:noop});let voices=0;
const audioReady=()=>true,horrorFx=true,npcVoiceEnabled=true,soundGate={},effectsGain={},admitAudio=()=>true,audioCtx={currentTime:2,createOscillator:()=>{voices++;return node()},createGain:node,createBiquadFilter:node};
for(const id of ids){let before=voices;playPainVoice({charId:id});check(voices-before===2);before=voices;playPainVoice({charId:id},true);check(voices-before===3)}
for(const id of Object.keys(creatureCalls)){let before=voices;creatureCall(id);check(voices-before===2)}
for(let id=0;id<15;id++){let before=voices;creatureCall(null,id);check(voices-before===2)}
`)(check);
check(!c.includes('new SpeechSynthesisUtterance'));check(c.includes('paintNpcComment(ctx,view,local)'));check(c.includes('playPainVoice(p,true);p.dead=true'));check(c.includes('paintDeathSequence(ctx,view,deathTimer)'));check(c.includes('fearActorVisible(e,local,nightmare)'));
const hud=section('<div id="rightHud"','<div id="fearHud"');check(hud.includes('id="abilityHud"'));check(hud.includes('id="bombHudValue"'));check(c.includes('#hud #weaponHud{position:absolute;display:flex'));check(c.includes('#hud #abilityHud{position:static;display:grid'));
console.log('Horror visibility, audio and HUD: '+count+' assertions passed; mocked audio/geometry, not a live browser.');
