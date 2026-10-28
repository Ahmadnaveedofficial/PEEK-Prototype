const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const assets=path.join(root,fs.existsSync(path.join(root,'public'))?'public':'dist');
const ctx={console,document:{addEventListener(){}},safe:s=>String(s),setTimeout};
ctx.window=ctx;vm.createContext(ctx);
for(const file of ['discovery-data.js','v3-context.js','perf-sim.js','v3-finder.js']){
  vm.runInContext(fs.readFileSync(path.join(assets,file),'utf8'),ctx);
}
assert.equal(ctx.PeekCtx.DV.length,11);
assert.equal(ctx.PEEKData.devices.length,11);
assert.equal(ctx.PeekCtx.FK.length,38);
assert.equal(ctx.PeekCtx.RK.length,15);
assert.equal(ctx.PeekCtx.D('iphone18').id,'i18');
assert.equal(ctx.PeekCtx.D('s23').f[ctx.PeekCtx.FK.indexOf('ram')],'12 GB');
const queries=[
  ['mujhe PUBG ke liye 50k tak ka phone batao',50000,'PUBG MOBILE',30],
  ['CapCut video editing ke liye 1 lakh tak',100000,'CapCut',30],
  ['Genshin Impact, 2 ghante roz, battery acha ho, 2 lakh tak',200000,'Genshin Impact',120],
  ['YouTube 40 hazar mein',40000,'YouTube',30]
];
for(const [text,budget,app,mins]of queries){
  const q=ctx.PeekFinder.parse(text);
  assert.equal(q.budget,budget);assert.equal(q.app.name,app);assert.equal(q.mins,mins);
  const r=ctx.PeekFinder.rank(q);
  assert(r.within.every(d=>d.price<=budget));
  assert(r.within.every(d=>Number.isFinite(d.r.avgFps)));
}
assert.equal(ctx.PeekFinder.parse('battery achi ho').app,null);
assert.equal(ctx.PeekFinder.parse('PUBG 60 fps 2 ghante 50k').budget,50000);
let cases=0;
for(const d of ctx.PeekCtx.DV){
  assert(!ctx.PeekCtx.tn(d).includes('POCO POCO'));
  for(const app of [{name:'PUBG MOBILE',genre:'Games'},{name:'CapCut',genre:'Photo & Video'},
    {name:'YouTube',genre:'Photo & Video'},{name:'Lightroom'},{name:'Instagram'},
    {name:'Google Maps'},{name:'Spotify'},{name:'Unknown app'}]){
    for(const mins of [15,30,60,120]){
      const h=ctx.PeekSim.hardware(d,ctx.PeekCtx.FK),c=ctx.PeekSim.classify(app);
      const ev=ctx.PeekSim.evaluate(h,c,mins,'verify-'+d.id+app.name);
      assert(ev.auto>=0&&ev.auto<ev.rows.length);
      for(const r of ev.rows){
        if(r.unsupported)continue;
        for(const n of ['avgFps','low1','peakT','drain','hours','avgP','ramAvg']){
          assert(Number.isFinite(r[n]),d.id+' '+app.name+' '+n);
        }
        assert(r.batt.every(b=>b>=0&&b<=100));
        assert.equal(r.t.at(-1),mins);
      }
      cases++;
    }
  }
}
const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'3d-preservation.json'),'utf8'));
for(const [file,hash]of Object.entries(baseline)){
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(assets,file))).digest('hex'),hash,'Studio asset integrity mismatch: '+file);
}
assert(!fs.readFileSync(path.join(assets,'v3-context.js'),'utf8').includes('function Viewer('));
console.log(cases+' simulation combinations, Finder parsing and budgets, merged catalogue, and studio asset integrity passed.');
