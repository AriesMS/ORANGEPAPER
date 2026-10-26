The Stage 02 viewer uses `public/models/facade-to-interior/front.glb`, derived
from the user-supplied `../FRONT/FRONT.obj` RealityScan export for block 318.
The source has 6,792,956 triangles; the web derivative has 249,914 triangles
and is approximately 9.8 MB with its embedded 4096-pixel JPEG atlas.

The supplied MTL names `FRONT_u1_v1_diffuse.png`, which is absent from this
folder. The supplied `FRONT_u1_v1_diffuse_2.png` colour atlas is used instead.
The original OBJ and textures are left untouched and are not copied into dist.

To regenerate, install numpy and Pillow for Python, then run from the repo root:

```sh
npm install --prefix tmp/model-tools meshoptimizer
python3 scripts/prepare-photogrammetry.py ../FRONT
node scripts/optimize-photogrammetry.mjs
npm test
```

Preparation preserves separate OBJ position/UV indices, rotates Z-up to Y-up,
centres the model, and flips texture V coordinates for glTF. Simplification
uses meshoptimizer with UV attributes, preserving the photograph alignment.
The viewer uses the original colour atlas without artificial lighting and
loads the model only when its section approaches the viewport.
