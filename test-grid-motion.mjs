import assert from 'node:assert/strict';
import {sourcePosition,drawFixedSource} from './grid-motion.js';
import {shouldFlip} from './flip-budget.js';
const tile=v=>({grid:Array(24).fill(v)});
assert.equal(sourcePosition(0,10,.25),.25);assert(Math.abs(sourcePosition(0,10,-.2)-.8)<1e-10);assert(Math.abs(sourcePosition(8,10,.4)-.2)<1e-10);
const draws=[],context={drawImage:(image,x,y)=>draws.push([x+0,y+0])},buffer={width:100,height:100,getContext:()=>({clearRect(){}})};
drawFixedSource(context,{},100,100,false,.25,buffer,()=>{});assert.deepEqual(draws,[[-25,0],[75,0]]);
assert(!shouldFlip({fromId:'A',toId:'A',fromTile:tile(20),toTile:tile(200),personConfidence:1}),'Same card never flips');
assert(!shouldFlip({fromId:'A',toId:'B',fromTile:tile(100),toTile:tile(100)}),'Different choice with unchanged source color updates directly');
assert(!shouldFlip({fromId:'A',toId:'B',fromTile:tile(100),toTile:tile(102)}),'Sensor noise cannot trigger a flip');
assert(shouldFlip({fromId:'A',toId:'B',fromTile:tile(20),toTile:tile(200),personConfidence:1}));
assert(!shouldFlip({fromId:'A',toId:'B',fromTile:tile(20),toTile:tile(200),elapsed:300,personConfidence:1}),'Rapid reversals are gated');
console.log('Grid samples a stationary source as it drifts; flips require changed source color and a different card.');

assert(!shouldFlip({fromId:'A',toId:'B',fromTile:tile(20),toTile:tile(200),personConfidence:.2}),'Background cards never flip');
assert(!shouldFlip({fromId:'A',toId:'B',fromTile:tile(20),toTile:tile(200)}),'Missing mask fails closed');
assert(shouldFlip({fromId:'A',toId:'B',fromTile:tile(20),toTile:tile(200),personConfidence:.8}),'Confident person regions can flip');

draws.length=0;drawFixedSource(context,{},100,100,false,.25,buffer,()=>{},.5);assert.deepEqual(draws,[[-25,-50],[75,-50],[-25,50],[75,50]]);
console.log('Vertical drift and diagonal four-edge wrapping verified.');
