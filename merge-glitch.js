export function isMerge(region,previous){let count=0;for(const old of previous){if(old.x>=region.x&&old.y>=region.y&&old.x+old.size<=region.x+region.size&&old.y+old.size<=region.y+region.size&&old.size<region.size)count++;if(count>1)return true}return false}
export class MergeGlitch{
 constructor(canvas){this.canvas=canvas;this.previous=[];this.signature='';this.effects=[];this.timer=null;this.redraw=null;this.reduced=window.matchMedia('(prefers-reduced-motion: reduce)')}
 prepare(regions,cols,rows,w,h,redraw){const signature=[cols,rows,w,h].join('|'),now=performance.now();this.redraw=redraw;if(signature!==this.signature){this.effects=[];this.previous=[];this.signature=signature}
  const keys=new Set(regions.map(r=>r.key));this.effects=this.effects.filter(e=>keys.has(e.key)&&now-e.start<160);
  if(!this.reduced.matches&&this.previous.length)for(const r of regions){if(this.effects.length>=6)break;if(r.size<2||this.effects.some(e=>e.key===r.key)||!isMerge(r,this.previous))continue;
   const patch=document.createElement('canvas');patch.width=Math.ceil(r.size*w);patch.height=Math.ceil(r.size*h);patch.getContext('2d').drawImage(this.canvas,r.x*w,r.y*h,r.size*w,r.size*h,0,0,patch.width,patch.height);this.effects.push({key:r.key,x:r.x*w,y:r.y*h,w:r.size*w,h:r.size*h,patch,start:now,seed:r.x*13+r.y*29});
  }
  this.previous=regions.map(r=>({...r}));
 }
 paint(ctx){if(this.reduced.matches){this.effects=[];return}const now=performance.now();this.effects=this.effects.filter(e=>now-e.start<160);ctx.save();
  for(const e of this.effects){const t=(now-e.start)/160,burst=t<.22||(t>.34&&t<.53)||(t>.66&&t<.78);if(!burst)continue;ctx.save();ctx.beginPath();ctx.rect(e.x,e.y,e.w,e.h);ctx.clip();ctx.globalAlpha=.85*(1-t*.65);const phase=Math.floor(t*18);for(let band=0;band<5;band++){const top=band*e.patch.height/5,height=e.patch.height/5,offset=((e.seed+band*7+phase*11)%9-4)*(1-t);ctx.drawImage(e.patch,0,top,e.patch.width,height,e.x+offset,e.y+band*e.h/5,e.w,e.h/5)}ctx.restore()}
  ctx.restore();if(this.effects.length&&!this.timer)this.timer=requestAnimationFrame(()=>{this.timer=null;this.redraw?.()});
 }
}
