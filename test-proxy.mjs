import assert from 'node:assert/strict';
import {needsMedium} from './proxy.js';
assert.equal(needsMedium(48,67,24,33.5,2),false);
assert.equal(needsMedium(48,67,48,67,1),false);
assert.equal(needsMedium(48,67,96,134,1),true);
assert.equal(needsMedium(48,67,48,67,2),true);
assert.equal(needsMedium(32,32,20,20,1),false);
assert.equal(needsMedium(32,32,40,40,1),true);
console.log('Proxy selection covers small, enlarged, and high-DPI tiles.');
