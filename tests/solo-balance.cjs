// Run from repository root: node tests/solo-balance.cjs
const fs=require('node:fs'),assert=require('node:assert/strict');
const c=fs.readFileSync('index.html','utf8');
const section=(a,b)=>{const i=c.indexOf(a),j=c.indexOf(b,i+a.length);assert(i>=0&&j>i);return c.slice(i,j)};
let count=0;const check=x=>{assert(x);count++};
for(const m of c.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(m[1].trim())new Function(m[1]);
new Function('check',section('function soloWaveCount(','function soloRelic(')+section('const legendaryPaths=','function eliteWave(')+section('function buildUpgradeOptions(','function announceUpgrade(')+`
let soloRun={};
const chars=[{id:'warden'},{id:'revenant'}],weapons=[{name:'A'},{name:'B'},{name:'C'},{name:'D'}],weaponLevels=[1,1,1,1],canEvolve=()=>false;
let weapon=0,player=null;
for(let w=1;w<=10000;w++){
 check(Number.isInteger(soloWaveCount(w))&&soloWaveCount(w)>0&&soloWaveCount(w)<=120);
 check(soloStatRound(w)<=w&&soloStatRound(w)>0);
 check(soloStatRound(w+1)>soloStatRound(w));check(soloBossBase(w+1)>soloBossBase(w));
 check(soloActiveLimit(w)>=10&&soloActiveLimit(w)<=36);
 check(!allowWaveSpawn(true,w,soloActiveLimit(w)));check(allowWaveSpawn(true,w,soloActiveLimit(w)-1));check(!allowWaveSpawn(false,w,1000));
 check(soloHurtScale(w)>=.9&&soloHurtScale(w)<=1);
 check(soloXPScale(w)>=.73&&soloXPScale(w)<=.86);
}
check(soloWaveCount(4)===24&&soloWaveCount(6)===32&&soloWaveCount(7)===36);
check(soloBossBase(5)===4600&&soloBossBase(10)===7700&&soloBossBase(15)===11800);
check(soloStatRound(20)===20&&soloStatRound(100)<45);
const options={warden:['ward_hp','ward_rate','ward_dmg'],revenant:['rev_hp','rev_crit','rev_move']};
for(const hero of Object.keys(options)){
 const p={charId:hero,bomb:3,maxhp:100,hp:20,boost:{dmg:1,rate:1,move:1,crit:.95},weaponLevels:[1,1,1,1],heroUpgrades:[]};
 const seen=new Set();for(let k=0;k<500;k++)for(const o of buildUpgradeOptions(p))seen.add(o.id);
 for(const id of options[hero])check(seen.has(id));
 for(const id of options[hero])applyUpgrade(p,{id});
 if(hero==='warden'){check(p.maxhp===145&&p.hp===145);check(p.boost.rate===1.25&&p.boost.dmg===1.3);}
 else{check(p.maxhp===140&&p.hp===140);check(p.boost.crit===1&&p.boost.move===1.24);}
 soloRun=null;for(let k=0;k<500;k++)for(const o of buildUpgradeOptions(p))check(!options[hero].includes(o.id));
 const before=JSON.stringify(p);for(const id of options[hero])applyUpgrade(p,{id});check(JSON.stringify(p)===before);
 soloRun={};
}
`)(check);
console.log('Solo balance: '+count+' assertions passed; scripts parsed. Live combat not tested.');
