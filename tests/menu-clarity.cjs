// Run from repository root: node tests/menu-clarity.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const a=c.indexOf('const altarViews='),b=c.indexOf('function renderAltar(',a);assert(a>=0&&b>a);
new Function('check',`
const tabs=['build','legacy','history'].map(id=>({dataset:{altarView:id},setAttribute(k,v){this[k]=v},addEventListener(n,f){this.click=f}}));
const groups=['build','legacy','history'].map(id=>({dataset:{altarGroup:id},hidden:true})),body={scrollTop:42};
const document={querySelectorAll:s=>s==='[data-altar-view]'?tabs:groups,getElementById:k=>body};
`+c.slice(a,b)+`
for(const id of altarViews){check(setAltarView(id));check(groups.filter(x=>!x.hidden).length===1);check(groups.find(x=>!x.hidden).dataset.altarGroup===id);check(tabs.filter(x=>x['aria-pressed']==='true').length===1);check(body.scrollTop===42)}
check(!setAltarView('invalid'));check(altarView==='history');tabs[1].click();check(altarView==='legacy'&&body.scrollTop===0);
for(const save of [false,true])for(const coop of [false,true])for(const online of [false,true])check(menuPrimaryAction(save,coop,online)===(save&&!coop&&!online?'continue':'start'));
`)(check);
const html=c.slice(c.indexOf('<body>'),c.indexOf('<script',c.indexOf('<body>'))),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);check(ids.length===new Set(ids).size);
for(const [id,group] of [['altarBuild','build'],['altarLegacy','legacy'],['altarHistory','history']]){check(html.includes('aria-controls="'+id+'"'));check(html.includes('id="'+id+'" data-altar-group="'+group+'"'))}
check(c.includes('start.disabled=resumePrimary;start.hidden=resumePrimary'));check(c.includes('bar.max=q.goal;bar.value=progress'));check(c.includes("b.dataset.status=claimed?'claimed'"));check(c.includes('#menu [data-altar-group][hidden],#menu #startBtn[hidden]'));check(c.includes('min-height:44px'));check(c.includes('white-space:pre-line'));
console.log('Menu clarity: '+count+' assertions passed; tab navigation, checkpoint priority, unique markup and progress wiring.');
