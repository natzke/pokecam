let FilesetResolver,ImageSegmenter;
let segmenter;
self.onmessage=async({data:d})=>{try{
 if(d.type==='init'){
  ({FilesetResolver,ImageSegmenter}=await import('./vendor/mediapipe/vision_bundle.mjs'));
  const vision=await FilesetResolver.forVisionTasks(new URL('vendor/mediapipe/wasm',self.location.href).href);
  segmenter=await ImageSegmenter.createFromOptions(vision,{baseOptions:{modelAssetPath:new URL('vendor/mediapipe/selfie_segmenter_landscape.tflite',self.location.href).href,delegate:'CPU'},runningMode:'IMAGE',outputCategoryMask:false,outputConfidenceMasks:true});self.postMessage({type:'ready'});return;
 }
 if(d.type==='frame'&&segmenter){const started=performance.now();try{segmenter.segment(d.bitmap,result=>{const mask=result.confidenceMasks?.at(-1);if(!mask)throw Error('No person mask');const raw=mask.getAsFloat32Array(),values=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)values[i]=Math.round(Math.max(0,Math.min(1,raw[i]))*255);self.postMessage({type:'mask',width:mask.width,height:mask.height,values,ms:performance.now()-started,requestId:d.requestId},[values.buffer])})}finally{d.bitmap.close()}}
}catch(error){d.bitmap?.close();self.postMessage({type:'error',message:error.message||String(error)})}};
