// Execute the entire game script (not isolated functions) using strict markup IDs and Canvas/DOM doubles.
const fs=require('node:fs'),assert=require('node:assert/strict');const c=fs.readFileSync('index.html','utf8');let count=0;const check=x=>{assert(x);count++};
const body=c.slice(c.indexOf('<body>'),c.indexOf('<script',c.indexOf('<body>')));
const ids=new Set([...body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
const titles=['homeHeroName','homeMapName','homeModeName','altarHomeLabel','altarHomeValue','journalHomeLabel','journalHomeValue','dailyHomeLabel','dailyHomeValue','abyssHomeLabel','abyssHomeValue','settingsHomeLabel','settingsHomeValue'];
for(const id of titles)check(new RegExp('id="'+id+'">[^<]+<').test(body));
function boot(lang,online){
 const html=online?c:c.replace('const ONLINE_COOP_ENABLED=true;','const ONLINE_COOP_ENABLED=false;');
 const code=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).join('\n');
 const noop=()=>{},nodes=new Map(),listeners=new Map(),ctx=new Proxy({measureText:()=>({width:30}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop}),createPattern:()=>null,getImageData:()=>({data:new Uint8ClampedArray(4)})},{get(t,k){return k in t?t[k]:noop}});
 function el(id){
  if(!nodes.has(id)){
   const q={style:{setProperty:noop,removeProperty:noop},dataset:{},classList:{add:noop,remove:noop,toggle:noop,contains:()=>false},children:[],textContent:'',value:'',options:[{},{},{}],getContext:()=>ctx,addEventListener:(event,fn)=>listeners.set(String(id)+':'+event,fn),setAttribute:noop,getAttribute:()=>null,append:noop,prepend:noop,appendChild:noop,replaceChildren:noop,querySelector:s=>el(s),querySelectorAll:()=>[],closest:s=>el(s),getBoundingClientRect:()=>({width:800,height:450,left:0,top:0}),focus:noop,dispatchEvent:noop,remove:noop};
   nodes.set(id,q)
  }return nodes.get(id)
 }
 const document={getElementById:id=>ids.has(id)?el(id):null,querySelector:s=>el(s),querySelectorAll:()=>[],createElement:()=>el(Symbol()),documentElement:el('html'),body:el('body'),head:el('head'),addEventListener:noop};
 const window={matchMedia:()=>({matches:false,addEventListener:noop}),addEventListener:noop,devicePixelRatio:1};
 const values=new Map([['dumpling-riot-lang',lang]]);const localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k)};
 new Function('document','window','localStorage','navigator','location','requestAnimationFrame','addEventListener','setTimeout','clearTimeout','performance','innerWidth','innerHeight',code)(document,window,localStorage,{language:lang,maxTouchPoints:0},{protocol:'https:'},noop,noop,noop,noop,{now:()=>0},800,450);
 for(const id of titles)check(typeof el(id).textContent==='string'&&el(id).textContent.trim().length>0);
 check(el('menu').dataset.view==='home');if(lang==='ru'||lang==='en'){check(el('homeHeroName').textContent===(lang==='ru'?'СКАРФ':'SCARF'));check(el('homeMapName').textContent===(lang==='ru'?'КУХНЯ':'KITCHEN'))}
 const settings={ru:'Настройки',en:'Settings',fi:'Asetukset',de:'Einstellungen',fr:'Paramètres',es:'Ajustes',pt:'Configurações',pl:'Ustawienia',uk:'Налаштування'};check(el('settingsHomeLabel').textContent===settings[lang]);check(document.documentElement.lang===lang);check(el('languageSelect').value===lang);if(lang==='en')for(const id of titles)check(!/[А-Яа-яЁё]/.test(el(id).textContent));
 for(const key of ['altar','journal','daily','abyss','settings'])check(el(key+'HomeIcon').innerHTML.includes('<svg'));
 const change=listeners.get('languageSelect:change');check(typeof change==='function');
 for(const next of ['ru','en','fi','de','fr','es','pt','pl','uk','en']){change({target:{value:next}});check(document.documentElement.lang===next);check(values.get('dumpling-riot-lang')===next);check(el('languageSelect').value===next);check(el('settingsHomeLabel').textContent===settings[next]);for(const id of titles){check(el(id).textContent.trim().length>0);if(next==='en')check(!/[А-Яа-яЁё]/.test(el(id).textContent))}}

}
for(const lang of ['ru','en','fi','de','fr','es','pt','pl','uk'])for(const online of [true,false])boot(lang,online);
check(c.indexOf('setLanguage(lang);')>c.indexOf('const arenaLightingProfiles='));check(c.indexOf('setLanguage(lang);')>c.indexOf("window.addEventListener('error'"));
console.log('Menu bootstrap: '+count+' assertions passed; complete startup and repeated language switching in nine locales, online/offline profiles, persisted preference and nonempty titles. DOM/Canvas doubles, no real viewport.');
