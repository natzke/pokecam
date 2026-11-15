export function needsMedium(sourceWidth,sourceHeight,displayWidth,displayHeight,pixelRatio=1){return displayWidth*pixelRatio>sourceWidth*1.05||displayHeight*pixelRatio>sourceHeight*1.05}
