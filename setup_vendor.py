"""Download pinned, self-hosted runtime dependencies. No card artwork is fetched."""
from pathlib import Path
import io,tarfile,urllib.request
ROOT=Path(__file__).resolve().parent

def download(url):
    print('Downloading',url)
    with urllib.request.urlopen(url) as response:return response.read()

def package(url,entries):
    with tarfile.open(fileobj=io.BytesIO(download(url)),mode='r:gz') as archive:
        for member,target in entries.items():
            dest=ROOT/target;dest.parent.mkdir(parents=True,exist_ok=True)
            dest.write_bytes(archive.extractfile('package/'+member).read())

package('https://registry.npmjs.org/three/-/three-0.187.0.tgz',{
    'build/three.module.js':'vendor/three/three.module.js',
    'build/three.core.js':'vendor/three/three.core.js','LICENSE':'vendor/three/LICENSE'})
package('https://registry.npmjs.org/@mediapipe/tasks-vision/-/tasks-vision-1.2.3.tgz',{
    'vision_bundle.mjs':'vendor/mediapipe/vision_bundle.mjs',
    'wasm/vision_wasm_internal.js':'vendor/mediapipe/wasm/vision_wasm_internal.js',
    'wasm/vision_wasm_internal.wasm':'vendor/mediapipe/wasm/vision_wasm_internal.wasm'})
model=ROOT/'vendor/mediapipe/selfie_segmenter_landscape.tflite'
model.write_bytes(download('https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter_landscape/float16/1/selfie_segmenter_landscape.tflite'))
(ROOT/'vendor/mediapipe/LICENSE').write_bytes(download('https://raw.githubusercontent.com/google-ai-edge/mediapipe/master/LICENSE'))
package('https://registry.npmjs.org/heic-to/-/heic-to-1.6.7.tgz',{
    'dist/heic-to.js':'vendor/heic-to-1.6.7.js','LICENSE':'vendor/HEIC-LICENSE'})
print('Ready. Run: python3 -m http.server 8080 --bind 127.0.0.1')
