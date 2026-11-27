// Run from repository root: node tests/secret-routes.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const code=fs.readFileSync('index.html','utf8');
const start=code.indexOf('const secretRouteThemes='),end=code.indexOf('function secretRouteStaticAvoid(',start);
assert(start>=0&&end>start);
let count=0;
const check=x=>{assert(x);count++};
for(const m of code.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim())new Function(m[1]);
new Function('check',code.slice(start,end)+`
const area={l:52,r:1868,t:58,b:1022};
for(const map of Object.keys(secretRouteThemes))for(const x of [110,315,960,1600,1810])for(const y of [110,315,540,780,960]){
 const event={map,x,y,stage:'done'};
 const avoid=[{x,y,pad:26},{x:x+70,y,pad:22}];
 const route=makeSecretRoute(event,area,avoid);
 check(!!route);check(routePointClear(route.entry,area,avoid));check(routePointClear(route.exit,area,avoid));
 check(Math.hypot(route.exit.x-x,route.exit.y-y)>=160);
 check(Math.hypot(route.exit.x-route.entry.x,route.exit.y-route.entry.y)>=188);
 const p={...route.entry,hp:100};
 check(!secretRouteStep(route,p,.1,false));check(!secretRouteStep(route,p,.1,true));check(route.hold===0);
 for(let i=0;i<6;i++)check(!secretRouteStep(route,p,.1,false));
 check(secretRouteStep(route,p,.1,false));check(route.status==='used');check(!secretRouteStep(route,p,.1,false));
}
check(makeSecretRoute({map:'forest',stage:'sealed',x:100,y:100},area,[])===null);
check(makeSecretRoute({map:'forest',stage:'done',x:960,y:540},area,[{x:960,y:540,pad:5000}])===null);
`)(check);
console.log('Secret routes: '+count+' assertions passed; scripts parsed. Browser not tested.');
