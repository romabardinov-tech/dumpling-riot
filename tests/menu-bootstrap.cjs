// Execute the entire game script (not isolated functions) using strict markup IDs and Canvas/DOM doubles.
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const body=c.slice(c.indexOf('<body>'),c.indexOf('<script',c.indexOf('<body>')));
const ids=new Set([...body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
const titles=['homeHeroName','homeMapName','homeModeName','altarHomeLabel','altarHomeValue','journalHomeLabel','journalHomeValue','dailyHomeLabel','dailyHomeValue','abyssHomeLabel','abyssHomeValue','settingsHomeLabel','settingsHomeValue'];
for(const id of titles)check(new RegExp('id="'+id+'">[^<]+<').test(body));
function boot(lang,online){
 const html=online?c:c.replace('const ONLINE_COOP_ENABLED=true;','const ONLINE_COOP_ENABLED=false;');
 const code=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).join('\n');
 const noop=()=>{},nodes=new Map(),ctx=new Proxy({measureText:()=>({width:30}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop}),createPattern:()=>null,getImageData:()=>({data:new Uint8ClampedArray(4)})},{get(t,k){return k in t?t[k]:noop}});
 function el(id){
  if(!nodes.has(id)){
   const q={style:{setProperty:noop,removeProperty:noop},dataset:{},classList:{add:noop,remove:noop,toggle:noop,contains:()=>false},children:[],textContent:'',value:'',options:[{},{},{}],getContext:()=>ctx,addEventListener:noop,setAttribute:noop,getAttribute:()=>null,append:noop,prepend:noop,appendChild:noop,replaceChildren:noop,querySelector:s=>el(s),querySelectorAll:()=>[],closest:s=>el(s),getBoundingClientRect:()=>({width:800,height:450,left:0,top:0}),focus:noop,dispatchEvent:noop,remove:noop};
   nodes.set(id,q)
  }return nodes.get(id)
 }
 const document={getElementById:id=>ids.has(id)?el(id):null,querySelector:s=>el(s),querySelectorAll:()=>[],createElement:()=>el(Symbol()),documentElement:el('html'),body:el('body'),head:el('head'),addEventListener:noop};
 const window={matchMedia:()=>({matches:false,addEventListener:noop}),addEventListener:noop,devicePixelRatio:1};
 const localStorage={getItem:k=>k==='dumpling-riot-lang'?lang:null,setItem:noop,removeItem:noop};
 new Function('document','window','localStorage','navigator','location','requestAnimationFrame','addEventListener','setTimeout','clearTimeout','performance','innerWidth','innerHeight',code)(document,window,localStorage,{language:lang,maxTouchPoints:0},{protocol:'https:'},noop,noop,noop,noop,{now:()=>0},800,450);
 for(const id of titles)check(typeof el(id).textContent==='string'&&el(id).textContent.trim().length>0);
 check(el('menu').dataset.view==='home');check(el('homeHeroName').textContent===(lang==='ru'?'СКАРФ':'SCARF'));check(el('homeMapName').textContent===(lang==='ru'?'КУХНЯ':'KITCHEN'));
 check(el('settingsHomeLabel').textContent===(lang==='ru'?'Настройки':'Settings'));
 for(const key of ['altar','journal','daily','abyss','settings'])check(el(key+'HomeIcon').innerHTML.includes('<svg'));
}
for(const lang of ['ru','en'])for(const online of [true,false])boot(lang,online);
check(c.indexOf('setLanguage(lang);')>c.indexOf('const arenaLightingProfiles='));check(c.indexOf('setLanguage(lang);')>c.indexOf("window.addEventListener('error'"));
console.log('Menu bootstrap: '+count+' assertions passed; complete startup in RU/EN, online/offline profiles, nonempty titles and icons. DOM/Canvas doubles, no real viewport.');
