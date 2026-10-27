// Eșantioane (aplicația în Chromium). Usage: node tools/precizie-ascendent-esantioane.mjs $PWD/index.html 600 horoscop -> asc_horoscop.json
import {createRequire} from 'module'; const require=createRequire(process.env.PW_ROOT||import.meta.url); const {chromium}=require('playwright');
import fs from 'fs';
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
const ctx=await b.newContext({bypassCSP:true}); await ctx.route(/^https?:/,r=>r.abort());
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.argv[2]); await p.waitForTimeout(1500);
let s=4242; const rnd=()=>{s=(s*1664525+1013904223)%4294967296; return s/4294967296;};
const N=+process.argv[3]||600; const mode=process.argv[4]||'eclipsa';
const smp=[]; for(let i=0;i<N;i++) smp.push({jd:2415020.5+rnd()*(2469807.5-2415020.5), lon:-180+rnd()*360, lat:-65+rnd()*130, tgt:rnd()*360});
const out=await p.evaluate(({smp,mode})=>smp.map(o=>{
  if(mode==='eclipsa'){
    const eps=obliquity(o.jd), ramc=norm360(gmst(o.jd)+o.lon); const am=ascMC(ramc,eps,o.lat);
    const c=placidusCusps(ramc,eps,o.lat,am.asc,am.mc); const valid=placidusValid(c);
    return {...o, asc:am.asc, mc:am.mc, c, valid, hp: valid?houseFromCusps(c,o.tgt):null, he: equalHouse(am.asc,o.tgt), hw: wholeSignHouse(am.asc,o.tgt)};
  } else { const d=o.jd-2451545.0; return {...o, asc:window._hsTest.ascendantLon(d,o.lon,o.lat)}; }
}),{smp,mode});
console.log('ok',errs.length,out.length); fs.writeFileSync(`asc_${mode}.json`,JSON.stringify(out)); await b.close();
