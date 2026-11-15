import assert from 'node:assert/strict';
import {FlipPool,flipBudget,wrapPosition,sameRegion} from './flip-budget.js';
assert.equal(flipBudget(12,60),12);assert.equal(flipBudget(12,30),3);assert.equal(flipBudget(12,20),0);assert.equal(flipBudget(12,60,true),0);
const pool=new FlipPool(24);for(let i=0;i<30;i++)pool.admit(String(i),100,8);assert.equal(pool.active.size,8);assert.equal(new Set([...pool.active.values()].map(f=>f.slot)).size,8);
pool.prune(new Set(['0','1']),200);assert.equal(pool.active.size,2);pool.prune(new Set(['0','1']),500);assert.equal(pool.active.size,0);
assert.equal(wrapPosition(-10,100),90);assert.equal(wrapPosition(110,100),10);assert(sameRegion({x:1,y:2,size:3},{x:1,y:2,size:3}));assert(!sameRegion({x:1,y:2,size:3},{x:1,y:2,size:4}));
console.log('Flip cap, low-FPS admission, slot reuse, resizing, and bidirectional wrap verified.');
