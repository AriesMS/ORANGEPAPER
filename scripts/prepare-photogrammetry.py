"""Extract RealityScan OBJ streams for the web mesh optimizer (numpy + Pillow)."""
import sys
from array import array
from pathlib import Path
import numpy as np
from PIL import Image

source = Path(sys.argv[1])
out = Path('tmp/photogrammetry')
out.mkdir(parents=True, exist_ok=True)
positions, uvs, pairs = array('f'), array('f'), array('I')
with (source / 'FRONT.obj').open() as stream:
    for line in stream:
        if line.startswith('v '):
            positions.extend(map(float, line.split()[1:4]))
        elif line.startswith('vt '):
            uvs.extend(map(float, line.split()[1:3]))
        elif line.startswith('f '):
            corners = line.split()[1:]
            if len(corners) != 3:
                raise ValueError('Expected triangulated RealityScan export')
            for corner in corners:
                v, t = corner.split('/')[:2]
                pairs.extend((int(v)-1, int(t)-1))
p = np.asarray(positions).reshape(-1, 3)
t = np.asarray(uvs).reshape(-1, 2)
corners = np.asarray(pairs).reshape(-1, 2)
print(f'Parsed {len(p):,} positions and {len(corners)//3:,} triangles', flush=True)
# OBJ uses separate position/UV indices; preserve seams in the glTF vertex stream.
unique, indices = np.unique(corners, axis=0, return_inverse=True)
vertices = p[unique[:, 0]].copy()
print('Bounds:', vertices.min(axis=0), vertices.max(axis=0), flush=True)
# RealityScan's local model is Z-up; glTF is Y-up.
vertices = vertices[:, [0, 2, 1]]
vertices[:, 2] *= -1
vertices -= (vertices.min(axis=0) + vertices.max(axis=0)) / 2
vertices.astype('<f4').tofile(out / 'positions.bin')
t[unique[:, 1]].astype('<f4').tofile(out / 'uvs.bin')
indices.astype('<u4').tofile(out / 'indices.bin')
# The MTL references a missing unsuffixed PNG. The supplied _2 layer is the
# matching colour atlas; keep the original 8K textures untouched.
image = Image.open(source / 'FRONT_u1_v1_diffuse_2.png').convert('RGB')
image.thumbnail((4096, 4096), Image.Resampling.LANCZOS)
image.save(out / 'texture.jpg', quality=88, optimize=True)
print(f'Prepared {len(unique):,} seam-preserving vertices', flush=True)
