import assert from 'node:assert/strict';
import {groupRegions} from './regions.js';
const tile=v=>({mean:[v,v,v],grid:Array(24).fill(v),luminance:v});
const flat=Array.from({length:64},()=>tile(100));const merged=groupRegions(flat,8,8,true,18/255);assert.equal(merged.regions.length,4);assert(merged.regions.every(r=>r.size===4));assert(merged.tiles.every(t=>t.mean[0]===100));
const split=groupRegions(flat,8,8,false,18/255);assert.equal(split.regions.length,64);
const checker=flat.map((_,i)=>tile((i%8+Math.floor(i/8))%2?220:20));assert.equal(groupRegions(checker,8,8,true,18/255).regions.length,64);
const mixed=flat.map((t,i)=>i===27?tile(220):t);const groups=groupRegions(mixed,8,8,true,18/255);const coverage=new Uint8Array(64);for(const r of groups.regions)for(let y=r.y;y<r.y+r.size;y++)for(let x=r.x;x<r.x+r.size;x++)coverage[y*8+x]++;assert(coverage.every(c=>c===1));assert(groups.regions.find(r=>3>=r.x&&3<r.x+r.size&&3>=r.y&&3<r.y+r.size).size===1);
console.log('Uniform regions merge; edges keep detail; irregular layouts cover every cell exactly once.');
