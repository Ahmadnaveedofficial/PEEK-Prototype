import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const assets=path.join(root,fs.existsSync(path.join(root,'public'))?'public':'dist');
const {samsungParts}=await import(pathToFileURL(path.join(assets,'samsung-data.js')));
const {assemblyPlacement,phoneDimensions,exteriorCameras}=await import(pathToFileURL(path.join(assets,'samsung-assembly.js')));
// Every assembly must fit the closed phone envelope, rather than forming a
// second exploded stack. Reserve a small tolerance for mechanical protrusions.
for(const part of samsungParts){
 const p=assemblyPlacement(part.id),[w,h,d]=part.size;
 assert(p.scale>0&&p.scale<=1,part.id+' scale');
 assert(Math.abs(p.x)+w*p.scale/2<=phoneDimensions.width/2+.05,part.id+' width');
 assert(Math.abs(p.y-.15)+h*p.scale/2<=phoneDimensions.height/2+.05,part.id+' height');
 assert(Math.abs(p.z)+d*p.scale/2<=phoneDimensions.depth/2+.02,part.id+' depth');
}
assert.equal(samsungParts.length,19);
assert(Math.abs(phoneDimensions.height/phoneDimensions.width-163.4/78.1)<.02,'Phone proportions');
console.log('All 19 assembled modules fit the phone envelope; device proportions passed.');

assert.equal(exteriorCameras.length,5,'Rear optical / sensor module count');
for(const camera of exteriorCameras){
 assert(camera.x-camera.r>0&&camera.x+camera.r<600,'Lens within rear width');
 assert(camera.y-camera.r>0&&camera.y+camera.r<1260,'Lens within rear height');
}
for(let i=0;i<exteriorCameras.length;i++)for(let j=i+1;j<exteriorCameras.length;j++){
 const a=exteriorCameras[i],b=exteriorCameras[j];
 assert(Math.hypot(a.x-b.x,a.y-b.y)>a.r+b.r+6,'Raised camera rings must not overlap');
}
console.log('Five rear modules fit the reference layout without overlapping.');
