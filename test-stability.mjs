import assert from 'node:assert/strict';
globalThis.self={postMessage:message=>{if(message.error)throw Error(message.error);globalThis.result=message}};
await import('./worker.js');
const tile=value=>({mean:[value,value,value],grid:Array(24).fill(value),luminance:value});
const cards=[tile(100),tile(102),tile(220)];
function frame(value,temporal,first=false){self.onmessage({data:{cards:first?cards:undefined,key:'test',cols:1,tiles:[tile(value)],method:'mean',weight:0,reuse:'likeness',temporal,token:1}});return result.choices[0]}
let baseline=0,previous=-1;for(let i=0;i<20;i++){const choice=frame(i%2?101.1:100.9,false,i===0);if(previous>=0&&choice!==previous)baseline++;previous=choice}
let stabilized=0;previous=-1;for(let i=0;i<20;i++){const choice=frame(i%2?101.1:100.9,true);if(previous>=0&&choice!==previous)stabilized++;previous=choice}
assert.equal(baseline,19);assert.equal(stabilized,0);assert.equal(frame(220,true),2,'Substantial source changes must bypass delay');
assert.equal(frame(100,false),0,'Still image mode must bypass temporal holds');
console.log(`Alternating near-boundary input: ${baseline} switches → ${stabilized}; large color change responds immediately.`);
