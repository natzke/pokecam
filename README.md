# Pokécam

A real-time camera mosaic by Erik Natzke. The public sample library contains **exactly ten generated images**, evenly spaced from white to black. No Pokémon card artwork, card downloads, private camera captures, or production image archives are included.

Production installation: https://pokecam.natzke.com/

## Run locally

Requires Python 3 with HTTPS access. Node is needed only for tests.

```sh
python3 setup_vendor.py
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://localhost:8080 and select **Start camera** or **Open image**. Camera access requires localhost or HTTPS. Dependencies are self-hosted after setup; camera frames and source images stay in the browser. Segmentation uses a local MediaPipe worker.

## Features

- Three.js instanced 3D cards, with a 2D fallback.
- Adaptive region sizes and spatial color/value matching.
- Horizontal and vertical grid drift over a stationary source.
- Person drift from 0× to 2× the main speed, driven by an invisible activity mask.
- Person-only flips when source color and card identity change. Four selectable directions; enabled directions are chosen randomly. None selected disables flipping.
- Flip limits and low-frame-rate admission gates.
- Background tile change delay, 0–1000 ms.
- Background-only overlap-to-gap easing with person protection.
- Flicker stabilization, gated image detail, fullscreen controls, freeze and PNG export.
- Live texture sizing follows the displayed resolution instead of uploading oversized canvases.

The grayscale demo intentionally has only ten distinct values. Whole-card, fragment and artwork modes all derive from those same ten images. Strict uniqueness can therefore require a much smaller grid. A larger custom library provides better color and spatial likeness.

## Custom libraries

Replace `cards.json`, `fragments.json`, `arttiles.json`, `atlases.json`, `large-proxies.json`, and `set-years.json` with your own assets and feature metadata. Every tile records `mean` RGB, a 24-number `grid` (2×4 RGB samples), `luminance`, and its atlas rectangle/page. Use only artwork you have permission to share.

## Tests

```sh
node --test test-*.mjs
```

Runtime sources are at the repository root. `setup_vendor.py` downloads pinned Three.js 0.187.0, MediaPipe Tasks Vision 1.2.3, the selfie segmentation model, and heic-to 1.6.7 from their publishers. Third-party licenses remain with those dependencies; the bundled Source Sans 3 font includes its license.

## Single-card light and shadow mode

Choose **Single card · light & shadow** in Display. One original Pokécam card-back design repeats across the frame. Source luminance controls its bottom-to-top tilt: dark regions become nearly edge-on; bright regions face the camera. Three.js standard materials, a directional light, and a shadow-receiving backdrop supply the lighting. The mode bypasses card-library matching and eases angle changes. Shadow updates are rate-limited to protect animation frame rate.
