// Run from repo root: node tests/ui-regression.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');
let count=0;const check=v=>{assert(v);count++};
function section(a,b){const start=c.indexOf(a),end=c.indexOf(b,start+a.length);assert(start>=0&&end>start);return c.slice(start,end)}
const markup=c.slice(c.indexOf('<body>'),c.indexOf('<script',c.indexOf('<body>')));
const ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);check(ids.length===new Set(ids).size);
for(const id of ['startBtn','heroDetail','mapDetail','menuBody','runHero','runMap','runMode','helpToggle','menuHelp','touchDashValue','touchBombValue','pauseBtn','createRoomBtn','joinRoomBtn','onlinePanel','roomCodeInput'])check(ids.includes(id));
new Function('check',section('function setMenuTab(', "document.querySelectorAll('[data-menu-tab]').forEach(b=>b.addEventListener")+`
const tabs=['hero','map','mode'].map(x=>({dataset:{menuTab:x},setAttribute(k,v){this.pressed=v}}));
const panels=['hero','map','mode'].map(x=>({dataset:{menuPanel:x},hidden:true})),body={scrollTop:99};
const document={querySelectorAll:s=>s==='[data-menu-tab]'?tabs:panels,getElementById:()=>body};
for(const name of ['hero','map','mode']){check(setMenuTab(name)===true);check(panels.filter(p=>!p.hidden).length===1);check(panels.find(p=>!p.hidden).dataset.menuPanel===name);check(tabs.filter(b=>b.pressed==='true').length===1);check(body.scrollTop===0)}
check(setMenuTab('invalid')===false);
`)(check);
new Function('check',section('function bindMobileButton(','function setupMobile(')+`
let state='game',downs=0,ups=0,active=false;const events={};
const el={addEventListener:(n,f)=>events[n]=f,setPointerCapture(){},classList:{add(){active=true},remove(){active=false}}};
const e=id=>({pointerId:id,preventDefault(){}});
bindMobileButton(el,()=>downs++,()=>ups++);
events.pointerdown(e(1));check(downs===1&&active);events.pointerdown(e(2));check(downs===1);events.pointerup(e(2));check(active&&ups===0);events.pointercancel(e(1));check(!active&&ups===1);
events.pointerdown(e(3));events.inputreset();check(!active&&downs===2&&ups===2);events.lostpointercapture(e(3));check(ups===2);state='pause';events.pointerdown(e(4));check(downs===2&&!active);
`)(check);
new Function('check',section('function updateTouchHud(','function updateHud(')+`
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),locName=x=>x.name,heroWeaponStats=(p,i)=>({name:'weapon'+i});
const make=()=>({style:{setProperty(k,v){this[k]=v}},classList:{toggle(k,v){this[k]=v}},setAttribute(k,v){this[k]=v},textContent:''});
const dash=make(),bomb=make(),dv=make(),bv=make();
const weapons=Array.from({length:4},(_,i)=>{const b=make();b.dataset={weapon:String(i)};b.parts={'.mwLv':make(),'.mwCharge':make()};b.querySelector=k=>b.parts[k];return b});
const document={getElementById:k=>({dashBtn:dash,bombBtn:bomb,touchDashValue:dv,touchBombValue:bv}[k]),querySelectorAll:()=>weapons};
updateTouchHud({dash:.5,bomb:0,weaponLevels:[1,2,3,4],weaponCharge:[0,.5,1,1]},2,{cooldown:1});
check(dash.style['--charge']==='0.5'&&dash.classList.cooling);check(bomb.classList.empty&&bv.textContent===0);check(dv.textContent==='0.5');check(weapons.filter(x=>x.classList.sel).length===1&&weapons[2].classList.sel);check(weapons[1].parts['.mwCharge'].style.width==='50%');check(weapons[3].parts['.mwLv'].textContent===4);
updateTouchHud({dash:0,bomb:3,weaponLevels:[1,1,1,1],weaponCharge:[1,1,1,1]},0,{cooldown:1});check(!dash.classList.cooling&&dv.textContent==='');check(!bomb.classList.empty&&bv.textContent===3);check(weapons[0].classList.sel);
`)(check);
console.log('UI regression: '+count+' assertions passed; DOM mocks, not a browser layout test.');
