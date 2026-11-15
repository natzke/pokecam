import assert from 'node:assert/strict';
import {isMerge} from './merge-glitch.js';
const previous=[{x:0,y:0,size:1},{x:1,y:0,size:1},{x:0,y:1,size:1},{x:1,y:1,size:1}];
assert(isMerge({x:0,y:0,size:2},previous));
assert(!isMerge({x:0,y:0,size:2},[{x:0,y:0,size:2}]));
assert(!isMerge({x:0,y:0,size:1},[{x:0,y:0,size:2}]));
assert(!isMerge({x:5,y:5,size:2},previous));
console.log('Glitch triggers only when smaller regions merge, not when cards change or regions split.');
