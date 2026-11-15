import{assign,distance}from'./matcher.js';
let library=[],tree=null,treeKey='',lumOrder=[];
function build(ids,depth=0){if(!ids.length)return null;const axis=depth%3;ids.sort((a,b)=>library[a].mean[axis]-library[b].mean[axis]);const mid=ids.length>>1;return {j:ids[mid],axis,left:build(ids.slice(0,mid),depth+1),right:build(ids.slice(mid+1),depth+1)}}
function nearest(mean,limit){const list=[];let worst=Infinity,at=0;function visit(node){if(!node)return;const b=library[node.j].mean,c=(mean[0]-b[0])**2+(mean[1]-b[1])**2+(mean[2]-b[2])**2;if(list.length<limit||c<worst){if(list.length<limit)list.push([node.j,c]);else list[at]=[node.j,c];if(list.length===limit){worst=-1;for(let k=0;k<list.length;k++)if(list[k][1]>worst){worst=list[k][1];at=k}}}const delta=mean[node.axis]-b[node.axis];visit(delta<0?node.left:node.right);if(delta*delta<worst)visit(delta<0?node.right:node.left)}visit(tree);return list}
function luminanceNeighbors(value){let lo=0,hi=lumOrder.length;while(lo<hi){const mid=(lo+hi)>>1;if(library[lumOrder[mid]].luminance<value)lo=mid+1;else hi=mid}const start=Math.max(0,Math.min(lumOrder.length-64,lo-32));return lumOrder.slice(start,start+64).map(j=>[j,0])}
let temporal=null;
function stabilize(d,choices){
 if(!d.temporal||d.reuse==='unique'){temporal=null;return {churn:0,reversals:0}}
 const key=d.key+'|'+d.cols+'|'+d.method+'|'+d.weight,now=performance.now();
 if(!temporal||temporal.key!==key)temporal={key,regions:new Map()};
 let changes=0,reversals=0;const next=new Map();
 for(let i=0;i<choices.length;i++){
  const regionKey=d.regions?.[i]?.key||String(i),previous=temporal.regions.get(regionKey);
  if(!previous){next.set(regionKey,{choice:choices[i],prior:-1,tile:d.tiles[i],changedAt:now,oscillation:0});continue}
  const old=previous.choice,candidate=choices[i];previous.oscillation*=.92;
  if(candidate!==old){
   const movement=Math.sqrt(distance(d.tiles[i],previous.tile,'grid',.65));
   const improvement=distance(d.tiles[i],library[old],d.method,d.weight)-distance(d.tiles[i],library[candidate],d.method,d.weight);
   const bounce=candidate===previous.prior;if(bounce)previous.oscillation=Math.min(1,previous.oscillation+.24);
   const hold=25+180*previous.oscillation+((i*37)%45),elapsed=now-previous.changedAt;
   const significant=movement>.045||improvement>.008,marginal=improvement<.0004+.002*previous.oscillation;
   if(!significant&&(marginal||(elapsed<hold&&movement<.025)))choices[i]=old;
   else{changes++;if(bounce)reversals++;previous.prior=old;previous.changedAt=now;}
  }
  next.set(regionKey,{...previous,choice:choices[i],tile:d.tiles[i]});
 }
 temporal.regions=next;return {churn:changes/choices.length,reversals:reversals/choices.length};
}
self.onmessage=({data:d})=>{try{
 if(d.cards){library=d.cards;treeKey='';lumOrder=Array.from(library,(_,i)=>i).sort((a,b)=>library[a].luminance-library[b].luminance);}d.cards=library;
 if(d.key!==treeKey){tree=build(Array.from(library,(_,i)=>i));treeKey=d.key;}

 const n=d.tiles.length,m=d.cards.length;let choices;
 if(d.reuse==='unique'){
  const cost=new Float64Array(n*m);for(let i=0;i<n;i++)for(let j=0;j<m;j++)cost[i*m+j]=distance(d.tiles[i],d.cards[j],d.method,d.weight);choices=assign(cost,n,m);
 }else{
  const usage=new Uint16Array(m);choices=new Int32Array(n);
  for(let i=0;i<n;i++){
   // Shortlist by average color, then compare eight spatial samples and reuse costs.
   // The larger pool is useful for fragments, without a full spatial comparison of every piece.
   const shortlist=d.method==='value'?luminanceNeighbors(d.tiles[i].luminance):nearest(d.tiles[i].mean,Math.min(48,m));
   let best=Infinity;const x=i%d.cols;
   for(const[j]of shortlist){let c=distance(d.tiles[i],d.cards[j],d.method,d.weight);if(d.reuse==='balanced'){c+=Math.min(.012,.0008*usage[j]);if(d.neighbors){for(const neighbor of d.neighbors[i])if(choices[neighbor]===j)c+=.035}else for(const[dx,dy]of[[-1,0],[-2,0],[-1,-1],[0,-1],[1,-1],[0,-2]]){const xx=x+dx,ii=i+dy*d.cols+dx;if(xx>=0&&xx<d.cols&&ii>=0&&ii<i&&choices[ii]===j)c+=.035}}if(c<best){best=c;choices[i]=j}}
   usage[choices[i]]++;
  }
 }
 const stability=stabilize(d,choices);self.postMessage({stability,choices:Array.from(choices),scores:Array.from(choices,(j,i)=>Math.max(0,1-Math.sqrt(distance(d.tiles[i],d.cards[j],d.method,d.weight)))),token:d.token});
}catch(e){self.postMessage({error:e.message,token:d.token})}};
