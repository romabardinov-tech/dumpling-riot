// Run from repo root: node tests/stability-regression.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
const section=(a,b)=>{const i=c.indexOf(a),j=c.indexOf(b,i+a.length);assert(i>=0&&j>i);return c.slice(i,j)};
let count=0;const check=x=>{assert(x);count++};
new Function('check',section('function secretRouteStep(', 'function secretRouteStaticAvoid(')+section('function updateSecretRoute(', 'function paintSecretRoute(')+`
let queries=0,blocked=false,boss=null,nightmare={fear:40},toastTimer=0;
const player={x:500,y:500,hp:100},secretRouteExitBlocked=()=>{queries++;return blocked},fearClamp=x=>Math.max(0,x),toast=()=>{},L=x=>x;
const event={route:{entry:{x:0,y:0},exit:{x:250,y:0},status:'ready',hold:0}};
for(let i=0;i<600;i++)updateSecretRoute(event,1/60);
check(queries===0);check(event.route.status==='ready');
player.x=player.y=0;blocked=true;for(let i=0;i<60;i++)updateSecretRoute(event,1/60);
check(player.x===0&&event.route.hold===0);
blocked=false;for(let i=0;i<38;i++)updateSecretRoute(event,1/60);
check(player.x===0);updateSecretRoute(event,1/60);check(player.x===250&&event.route.status==='used'&&nightmare.fear===34);
for(let i=0;i<60;i++)updateSecretRoute(event,1/60);check(nightmare.fear===34);
`)(check);
new Function('check',section('function validCheckpoint(', 'function readCheckpoint(')+`
const CAMPAIGN_MAPS=['kitchen','forest'],chars=[{id:'warden'}],runContracts=[{id:'normal'}],encounterRooms=[{id:'mirror'}],runArtifacts=[{id:'wardLantern'}],arena={l:52,r:1868,t:58,b:1022};
const q={v:1,wave:6,map:'kitchen',weapon:1,score:40,combo:1,fear:30,relic:false,
 run:{hero:'warden',startMap:'kitchen',campaign:null,contract:'normal',cleared:5,earned:10,kills:20,closed:false,coins:20,coinsEarned:30,coinsSpent:10,purchases:1,lastShop:3,pact:null,lastEncounter:0,seenRooms:[],roomChoices:0,nextRoomEffect:null,hiddenSummoned:[],hiddenDefeated:[],nextHidden:null,stationUses:0},
 player:{x:500,y:500,aim:0,hp:110,maxhp:170,xp:40,next:100,lvl:2,speed:86,fire:0,dash:0,bomb:3,inv:0,boost:{dmg:1.3,rate:1.25,move:1,crit:.14},heroUpgrades:[],artifacts:['wardLantern'],evolved:[false,false,false,false],weaponLevels:[1,1,1,1],weaponCharge:[1,1,1,1],shivCharge:1},
 drops:[{x:600,y:600,type:'xp',value:37.4,life:1,pulse:0}]};
check(validCheckpoint(q));check(JSON.stringify(parseCheckpoint(JSON.stringify(q)))===JSON.stringify(q));
for(const mutate of [x=>x.run.cleared=4,x=>x.player.hp=0,x=>x.player.artifacts.push('invalid'),x=>x.player.boost.crit=2,x=>x.drops[0].x=0,x=>x.run.closed=true]){
 const a=JSON.parse(JSON.stringify(q));mutate(a);check(!validCheckpoint(a));
}
`)(check);
async function testWorker(){
 const handlers={},scope='https://example.test/dumpling-riot/',data=new Map([['./index.html','game'],['./privacy.html','privacy']]);
 const self={location:{origin:'https://example.test'},registration:{scope},addEventListener:(n,f)=>handlers[n]=f};
 const cache={match:async k=>data.get(k),put:async(k,v)=>data.set(k,v)};
 let offline=false;
 const fetch=async req=>{if(offline)throw Error('offline');const body=req.url.includes('privacy.html')?'privacy-new':'game-new';return {ok:true,redirected:false,clone:()=>body,body}};
 const caches={open:async()=>cache};
 const Response=function(body,options){this.body=body;this.status=options.status};
 new Function('self','caches','fetch','Response','URL',sw)(self,caches,fetch,Response,URL);
 async function nav(path){let promise;handlers.fetch({request:{method:'GET',mode:'navigate',url:scope+path},respondWith:p=>promise=p});return promise?await promise:undefined}
 check((await nav('privacy.html')).body==='privacy-new');check(data.get('./index.html')==='game');check(data.get('./privacy.html')==='privacy-new');
 check((await nav('?v=72')).body==='game-new');check(data.get('./index.html')==='game-new');
 offline=true;check(await nav('privacy.html')==='privacy-new');check(await nav('index.html?x=2')==='game-new');check(await nav('not-a-game-page')===undefined);
 data.delete('./privacy.html');check((await nav('privacy.html')).status===503);
 console.log('Stability regression: '+count+' assertions passed; simulated service worker, not a browser.');
}
testWorker().catch(e=>{console.error(e);process.exitCode=1});
