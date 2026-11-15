const wrap=(v,n)=>((v%n)+n)%n;
// A coarse occupancy field keeps this bounded independently of image resolution.
export class GapFiller {
 constructor(){this.moves=new Map();this.lastSolve=-Infinity}
 reset(){this.moves.clear();this.lastSolve=-Infinity}
 step({regions,offsets,cols,rows,width,height,flow=0,flowY=0,now,dt,isBackground}){
  const byKey=new Map(regions.map(r=>[r.key,r]));
  for(const [key,move]of this.moves){const r=byKey.get(key),d=offsets.get(key);if(!r||!d||!isBackground(r,0,0)||!isBackground(r,move.x,move.y)){this.moves.delete(key);continue}const a=1-Math.exp(-dt/0.18),dx=move.x*a,dy=move.y*a;d.x+=dx;d.y+=dy;move.x-=dx;move.y-=dy;if(Math.hypot(move.x,move.y)<.05)this.moves.delete(key)}
  if(now-this.lastSolve<120)return;this.lastSolve=now;
  const gw=cols*2,gh=rows*2,counts=new Uint16Array(gw*gh),sx=width/gw,sy=height/gh;
  const cells=(r,dx=0,dy=0)=>{const d=offsets.get(r.key)||{x:0,y:0};const x=(r.x*width/cols+flow+d.x+dx)/sx,y=(r.y*height/rows+flowY+d.y+dy)/sy,out=[];for(let yy=Math.ceil(y-.5);yy<y+r.size*2-.5;yy++)for(let xx=Math.ceil(x-.5);xx<x+r.size*2-.5;xx++)out.push(wrap(yy,gh)*gw+wrap(xx,gw));return out};
  const footprints=new Map();for(const r of regions){const move=this.moves.get(r.key),c=cells(r,move?.x||0,move?.y||0);footprints.set(r.key,c);for(const k of c)counts[k]++}
  let moved=0;
  for(const r of regions){if(moved>=48)break;if(this.moves.has(r.key)||!isBackground(r,0,0))continue;const old=footprints.get(r.key);if(!old.some(k=>counts[k]>1))continue;
   for(const k of old)counts[k]--;const baseline=old.reduce((sum,k)=>sum+(counts[k]===0?1:0),0);let best=baseline,target=null;
   for(const [x,y]of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1],[-2,0],[2,0],[0,-2],[0,2]]){const dx=x*sx,dy=y*sy;if(!isBackground(r,dx,dy))continue;const c=cells(r,dx,dy),score=c.reduce((sum,k)=>sum+(counts[k]===0?1:0),0);if(score>best){best=score;target={x:dx,y:dy,c}}}
   if(target){this.moves.set(r.key,{x:target.x,y:target.y});for(const k of target.c)counts[k]++;moved++}else for(const k of old)counts[k]++;
  }
 }
}
