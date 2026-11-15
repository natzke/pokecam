// Keep live texture work proportional to the displayed pixels, including Retina.
export function previewTileWidth({columns,rows,aspect,displayWidth,dpr=1,maxSize=4096}){
 const desired=displayWidth>0?Math.ceil(displayWidth*Math.min(1.5,dpr)/columns):48;
 return Math.max(1,Math.min(96,desired,Math.floor(maxSize/columns),Math.floor(maxSize*aspect/rows)));
}
