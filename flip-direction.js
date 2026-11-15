export const flipDirections={
 'left-right':{axis:'y',sign:1},
 'right-left':{axis:'y',sign:-1},
 'top-bottom':{axis:'x',sign:1},
 'bottom-top':{axis:'x',sign:-1}
};
export function chooseFlipDirection(enabled=[],random=Math.random){
 const available=enabled.filter(id=>flipDirections[id]);
 return available.length?available[Math.min(available.length-1,Math.floor(random()*available.length))]:null;
}
export function flipRotation(direction,angle){const d=flipDirections[direction];return d?{x:d.axis==='x'?angle*d.sign:0,y:d.axis==='y'?angle*d.sign:0}:{x:0,y:0}}
