export function canUpgrade({live,fps,stableMs,gapMs}){return gapMs>=200&&(!live||(fps>=24&&stableMs>=450))}
// Large proxies have a separate bounded cache and never block the matching loop.
export class DetailCache{
 constructor(state,onReady){this.state=state;this.onReady=onReady;this.cache=new Map();this.wanted=new Map();this.failed=new Set();this.pixels=0;this.active=false;this.timer=null;this.lastStart=-Infinity;}
 get(url){const item=this.cache.get(url);if(item){this.cache.delete(url);this.cache.set(url,item)}return item?.image}
 update(requests){this.wanted=new Map();for(const r of requests){const old=this.wanted.get(r.url);if(!old||r.stableSince<old.stableSince)this.wanted.set(r.url,r)}const ranked=[...this.wanted.values()].sort((a,b)=>b.area-a.area);this.wanted.clear();let budget=6_000_000;for(const r of ranked){const cost=r.kind==='card'?192*268:768*1072;if(cost<=budget&&this.wanted.size<32){this.wanted.set(r.url,r);budget-=cost}}this.pump()}
 pump(){if(this.active||this.timer)return;const candidates=[...this.wanted.values()].filter(r=>!this.cache.has(r.url)&&!this.failed.has(r.url)).sort((a,b)=>b.area-a.area);if(!candidates.length)return;
  const now=performance.now(),state=this.state(),next=candidates.find(r=>canUpgrade({...state,stableMs:now-r.stableSince,gapMs:now-this.lastStart}));
  if(!next){this.timer=setTimeout(()=>{this.timer=null;this.pump()},150);return}
  this.active=true;this.lastStart=now;const work=()=>{const latest=this.state();if(!this.wanted.has(next.url)||!canUpgrade({...latest,stableMs:performance.now()-next.stableSince,gapMs:200})){this.active=false;this.pump();return}const image=new Image();image.src=next.url;
   image.decode().then(()=>{const pixels=image.naturalWidth*image.naturalHeight;while(this.pixels+pixels>8_000_000&&this.cache.size){const key=this.cache.keys().next().value;this.pixels-=this.cache.get(key).pixels;this.cache.delete(key)}this.cache.set(next.url,{image,pixels});this.pixels+=pixels;this.onReady()}).catch(()=>this.failed.add(next.url)).finally(()=>{this.active=false;this.pump()})};
  if(window.requestIdleCallback)window.requestIdleCallback(work,{timeout:500});else setTimeout(work,32);
 }
}
