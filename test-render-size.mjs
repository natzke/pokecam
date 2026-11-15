import assert from 'node:assert/strict';
import {previewTileWidth} from './render-size.js';
assert.equal(previewTileWidth({columns:40,rows:16,aspect:245/342,displayWidth:567,dpr:2}),22);
for(const [columns,rows]of [[90,64],[6,90],[40,16]]){const w=previewTileWidth({columns,rows,aspect:245/342,displayWidth:10000,dpr:3});assert(w*columns<=4096);assert(w*rows/(245/342)<=4096)}
console.log('Live textures follow visible Retina resolution and stay within GPU limits.');
