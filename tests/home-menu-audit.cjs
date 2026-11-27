// Run from repository root: node tests/home-menu-audit.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const section=(a,b)=>{const i=c.indexOf(a),j=c.indexOf(b,i+a.length);assert(i>=0&&j>i);return c.slice(i,j)};
const html=section('<body>','<script'),home=section('id="homePanel"','<div id="menuBackBar"'),settings=section('data-menu-panel="settings"','</div><footer class="menuFooter">'),footer=section('<footer class="menuFooter">','</footer>');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);check(ids.length===new Set(ids).size);
for(const id of ['helpToggle','soundToggle','privacyBtn','soundPanel','menuHelp','touchSettings','npcVoiceToggle','horrorFxToggle','musicVolume','effectsVolume']){check(settings.includes('id="'+id+'"'));check(!footer.includes('id="'+id+'"'))}
for(const id of ['startBtn','continueRunBtn','discardRunBtn','checkpointNotice'])check(footer.includes('id="'+id+'"'));
for(const id of ['altarHome','journalHome','dailyHome','abyssHome','settingsHome'])check(home.includes('id="'+id+'"'));
new Function('check',section('function menuViewAllowed(', "document.querySelectorAll('[data-open-menu]').forEach(b=>b.addEventListener")+`
const names=['home','hero','map','mode','altar','journal','settings'],panels=names.map(x=>({dataset:{menuPanel:x},hidden:true})),menu={dataset:{view:'home'},querySelector:()=>null},bar={},body={},title={},lang='en',L=x=>x,renderJournal=()=>{};
const document={querySelectorAll:s=>s==='[data-menu-tab]'?[]:panels,getElementById:k=>({menu,menuBody:body,menuBackBar:bar,menuCurrentTitle:title}[k])};
for(const name of names){check(setMenuTab(name));check(panels.filter(p=>!p.hidden).length===1);check(panels.find(p=>!p.hidden).dataset.menuPanel===name);check(bar.hidden===(name==='home'))}
check(setMenuTab('settings')&&title.textContent==='Settings');check(!setMenuTab('invalid'));
`)(check);
check(c.includes("el.hidden=!resumePrimary"));check(c.includes("start.disabled=resumePrimary;start.hidden=resumePrimary"));check(c.includes("if(state!=='menu'||!savedCheckpoint||coop||onlineMode)return;"));check(c.includes("if(onlineMode&&!isOnlineHost){setMenuTab('mode')"));check(c.includes("env(safe-area-inset-left)"));check(c.includes("#menu [data-menu-panel=settings] #menuHelp{max-height:none;overflow:visible}"));
console.log('Home menu audit: '+count+' assertions passed; navigation, markup, saved-run isolation, settings layout wiring. Real viewport not tested.');
