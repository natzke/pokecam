import assert from 'node:assert/strict';
import {valueAngle} from './value-cards.js';
assert(Math.abs(valueAngle(255))<1e-8,'Bright source faces camera');
assert(valueAngle(0)<-1.5&&valueAngle(0)>-Math.PI/2,'Dark source turns nearly upward and edge-on');
for(let i=1;i<=255;i++)assert(valueAngle(i)>valueAngle(i-1),'Brighter source opens card toward camera');
assert.equal(valueAngle(-20),valueAngle(0));assert.equal(valueAngle(400),valueAngle(255));
console.log('Source brightness maps monotonically from upward/edge-on to front-facing.');
