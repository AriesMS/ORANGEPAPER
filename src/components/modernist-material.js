import * as THREE from 'three';

export function colourTexture(renderer,index){
    const tile=document.createElement('canvas');tile.width=tile.height=256;
    const c=tile.getContext('2d');
    const palette=['#d82d24','#f2c928','#174bb5'];
    c.fillStyle='#eee9da';c.fillRect(0,0,256,256);
    c.fillStyle=palette[index%3];c.fillRect(0,0,160,152);
    c.fillStyle=palette[(index+1)%3];c.fillRect(170,164,86,92);
    c.fillStyle=palette[(index+2)%3];c.fillRect(0,204,72,52);
    c.fillStyle='#101317';c.fillRect(158,0,9,256);c.fillRect(0,152,256,9);
    c.fillRect(0,196,158,8);c.fillRect(72,204,8,52);
    c.strokeStyle='#101317';c.lineWidth=8;c.strokeRect(0,0,256,256);
    const texture=new THREE.CanvasTexture(tile);texture.colorSpace=THREE.SRGBColorSpace;
    texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());return texture;
  }
