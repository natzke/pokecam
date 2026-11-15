export function flipBudget(requested,fps,reduced=false){if(reduced||fps<24)return 0;return fps<40?Math.min(3,requested):requested}
export function wrapPosition(x,width){return ((x%width)+width)%width}
export function sameRegion(a,b){return !!a&&!!b&&a.x===b.x&&a.y===b.y&&a.size===b.size}
export class FlipPool{
 constructor(capacity=24){this.capacity=capacity;this.active=new Map();this.skipped=0}
 prune(keys,now){for(const[key,flip]of this.active)if(!keys.has(key)||now-flip.start>=flip.duration)this.active.delete(key)}
 admit(key,now,budget){if(this.active.has(key)||this.active.size>=Math.min(budget,this.capacity)){this.skipped++;return null}const used=new Set([...this.active.values()].map(f=>f.slot));let slot=0;while(used.has(slot))slot++;const flip={key,slot,start:now,duration:360};this.active.set(key,flip);return flip}
}

export function sourceColorDelta(a,b){if(!a?.grid||!b?.grid)return 0;let sum=0;for(let i=0;i<24;i++)sum+=(a.grid[i]-b.grid[i])**2;return Math.sqrt(sum/24)/255}
export function shouldFlip({fromId,toId,fromTile,toTile,personConfidence=0,elapsed=Infinity}){return personConfidence>=.55&&fromId!==toId&&sourceColorDelta(fromTile,toTile)>=.018&&elapsed>=650}
