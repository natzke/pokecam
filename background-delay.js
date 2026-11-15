// Cooldowns belong to stable regions and reset when the source/library/layout changes.
export class BackgroundDelay {
 constructor(){this.history=new Map()}
 apply(frame,{delay=0,now,source,signature,isPerson=()=>false}){
  if(this.source!==source||this.signature!==signature){this.history.clear();this.source=source;this.signature=signature}
  const next=new Map();
  frame.regions.forEach((region,i)=>{
   const old=this.history.get(region.key),person=isPerson(region),choice=frame.choices[i];
   if(old&&choice!==old.choice&&!person&&delay>0&&now-old.changedAt<delay){frame.choices[i]=old.choice;frame.scores[i]=old.score;next.set(region.key,old)}
   else next.set(region.key,{choice,score:frame.scores[i],changedAt:!old||choice!==old.choice?now:old.changedAt});
  });
  this.history=next;
 }
}
