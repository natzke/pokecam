export function sourcePosition(cell,columns,flowFraction){return (((cell/columns+flowFraction)%1)+1)%1}
export function drawFixedSource(context,source,width,height,mirror,flowFraction,buffer,cover,flowY=0){
 if(!flowFraction&&!flowY){cover(context,source,width,height,mirror);return}
 if(buffer.width!==width||buffer.height!==height){buffer.width=width;buffer.height=height}
 const fixed=buffer.getContext('2d');fixed.clearRect(0,0,width,height);cover(fixed,source,width,height,mirror);
 const offset=(((flowFraction%1)+1)%1)*width,offsetY=(((flowY%1)+1)%1)*height;context.drawImage(buffer,-offset,-offsetY,width,height);if(offset)context.drawImage(buffer,width-offset,-offsetY,width,height);if(offsetY)context.drawImage(buffer,-offset,height-offsetY,width,height);if(offset&&offsetY)context.drawImage(buffer,width-offset,height-offsetY,width,height);
}
