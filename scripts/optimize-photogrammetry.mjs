// One-time preparation: npm install --prefix tmp/model-tools meshoptimizer
// Run prepare-photogrammetry.py first; raw research assets stay out of public/.
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {MeshoptSimplifier} from '../tmp/model-tools/node_modules/meshoptimizer/index.js';
await MeshoptSimplifier.ready;
const typed = async (name, Type) => {
  const b = await readFile(`tmp/photogrammetry/${name}.bin`);
  return new Type(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));
};
const positions = await typed('positions',Float32Array);
const uv = await typed('uvs',Float32Array);
const original = await typed('indices',Uint32Array);
const [indices,error] = MeshoptSimplifier.simplifyWithAttributes(original,positions,3,uv,2,[.1,.1],null,750000,.003,['Prune']);
const [remap,count] = MeshoptSimplifier.compactMesh(indices);
const p = new Float32Array(count*3), t = new Float32Array(count*2);
const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
for(let i=0;i<remap.length;i++)if(remap[i]!==0xffffffff){
  const j=remap[i];
  for(let k=0;k<3;k++){const v=positions[i*3+k];p[j*3+k]=v;min[k]=Math.min(min[k],v);max[k]=Math.max(max[k],v);}
  // OBJ texture coordinates start at the bottom; glTF starts at the top.
  t[j*2]=uv[i*2];t[j*2+1]=1-uv[i*2+1];
}
const chunks=[],views=[];let length=0;
function add(data,target){
  const b=Buffer.from(data.buffer??data,data.byteOffset??0,data.byteLength??data.length);
  const index=views.length;
  views.push({buffer:0,byteOffset:length,byteLength:b.length,...(target?{target}:{})});
  chunks.push(b,Buffer.alloc((4-b.length%4)%4));length+=b.length+(4-b.length%4)%4;
  return index;
}
const pv=add(p,34962),tv=add(t,34962),iv=add(indices,34963),image=add(await readFile('tmp/photogrammetry/texture.jpg'));
const gltf={asset:{version:'2.0',generator:'ORANGEPAPER / RealityScan web derivative'},extensionsUsed:['KHR_materials_unlit'],scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0}],meshes:[{primitives:[{attributes:{POSITION:0,TEXCOORD_0:1},indices:2,material:0}]}],materials:[{name:'RealityScan colour atlas',doubleSided:true,pbrMetallicRoughness:{baseColorTexture:{index:0},metallicFactor:0,roughnessFactor:1},extensions:{KHR_materials_unlit:{}}}],textures:[{source:0}],images:[{bufferView:image,mimeType:'image/jpeg'}],accessors:[{bufferView:pv,componentType:5126,count,type:'VEC3',min,max},{bufferView:tv,componentType:5126,count,type:'VEC2'},{bufferView:iv,componentType:5125,count:indices.length,type:'SCALAR'}],bufferViews:views,buffers:[{byteLength:length}]};
let json=Buffer.from(JSON.stringify(gltf));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);
const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+json.length+length,8);header.writeUInt32LE(json.length,12);header.writeUInt32LE(0x4e4f534a,16);
const binHeader=Buffer.alloc(8);binHeader.writeUInt32LE(length);binHeader.writeUInt32LE(0x004e4942,4);
await mkdir('public/models/facade-to-interior',{recursive:true});
const glb=Buffer.concat([header,json,binHeader,...chunks]);
await writeFile('public/models/facade-to-interior/front.glb',glb);
console.log(JSON.stringify({originalTriangles:original.length/3,triangles:indices.length/3,vertices:count,error,megabytes:glb.length/1e6,min,max}));
