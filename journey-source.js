import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
let records = [
  {id:'01',title:'PhD / Computational architecture',year:'Ongoing',type:'RESEARCH FOUNDATION',place:'National University of Singapore',text:'Research across generative design, AI-assisted design modelling, graph-based spatial inference, and computational architecture.',shape:'sphere',p:[0,0,0],s:1.25},
  {id:'02',title:'Facade to Interior',year:'2026',type:'RESEARCH PROJECT',place:'CAADRIA',text:'An image-to-graph framework for predicting structural graphs from facade images. Connecting photogrammetry, detection models, synthetic data, and graph neural networks.',shape:'box',p:[-1.65,.75,.3],s:1.1,link:'facade-to-interior.html'},
  {id:'03',title:'Internal Wall Inference',year:'2025',type:'RESEARCH PROJECT',place:'HDB research',text:'Inferring internal wall configurations using heterogeneous graph neural networks. Exploring prediction, validation overlays, and cost and embodied-carbon evaluation.',shape:'pyramid',p:[1.35,1.25,-.1],s:1.2,link:'internal-wall-inference.html'},
  {id:'04',title:'Interior Segmentation',year:'2026',type:'RESEARCH PROJECT',place:'3D spatial reconstruction',text:'Visual experiments in interior segmentation, AI-assisted object recognition, and 3D reconstruction of spatial fragments.',shape:'torus',p:[1.6,-.6,.5],s:1.05,link:'interior-segmentation.html'},
  {id:'05',title:'Generative Design / NUS',year:'Mar 2024 – Present',type:'RESEARCH EXPERIENCE',place:'Creative Design Critical Data Lab, NUS',text:'Researcher working on generative design modelling with AI.',shape:'box',p:[-.7,-1.65,.1],s:.8},
  {id:'06',title:'Future Cities Lab Global',year:'Mar 2024 – Aug 2025',type:'RESEARCH EXPERIENCE',place:'Singapore-ETH Centre',text:'Researcher in generative design modelling with AI at Future Cities Lab Global.',shape:'sphere',p:[-1.4,-.65,-1.1],s:.75},
  {id:'07',title:'Teaching / NUS',year:'Aug 2025 – Present',type:'TEACHING EXPERIENCE',place:'National University of Singapore',text:'Adjunct Teaching Fellow at NUS, alongside an ongoing research practice.',shape:'pyramid',p:[.3,1.85,-.9],s:.65},
  {id:'08',title:'Architecture / Practice',year:'Jun – Jul 2022',type:'PROFESSIONAL EXPERIENCE',place:'DP Architects',text:'Architecture internship: an early chapter in the journey from architectural practice to computational research.',shape:'box',p:[.8,-1.25,-1.1],s:.65}
];
// A spatial constellation: offset centres and independent X/Y/Z tilts (radians).
// Shared by the visible wires and picking surfaces.
const arrangement = [
  {p:[0,0,0], rotation:[.38,-.52,.18]},
  {p:[-1.9,.85,1.3], rotation:[.85,-.65,-.55]},
  {p:[1.25,1.55,-1.65], rotation:[-.65,.95,.7]},
  {p:[1.7,-.7,1.45], rotation:[1.15,.4,-.8]},
  {p:[-.65,-1.8,-1.2], rotation:[-.7,-.8,1.05]},
  {p:[-1.85,-.25,-1.65], rotation:[.6,1.2,-.3]},
  {p:[.15,2.05,.8], rotation:[-1.05,.35,-.9]},
  {p:[.85,-1.65,-.5], rotation:[.9,-1.1,.5]}
];
records=records.map((record,i)=>({...record,...arrangement[i]}));
const projectId=document.body.dataset.project;
if(projectId) records=records.filter(r=>r.id===projectId).map(r=>({...r,p:[0,0,0],s:1.25}));

const canvas=document.querySelector('#construct');
const detail=document.querySelector('#detail');
const inspector=document.querySelector('.inspector');
function display(i){inspector.hidden=i<0;if(i<0){detail.innerHTML='';return;}const r=records[i];detail.innerHTML=`<p class="detail-number">${r.id}<span style="font-size:12px;letter-spacing:0"> / 08</span></p><span class="detail-type">${r.type}</span><h2>${r.title}</h2><dl><div><dt>PERIOD</dt><dd>${r.year}</dd></div><div><dt>CONTEXT</dt><dd>${r.place}</dd></div></dl><p class="description">${r.text}</p>${r.link&&!projectId?`<a class="project-action" href="${r.link}">OPEN PROJECT ↗</a>`:''}`;}
function geometry(type, coarse=false){let v=[],faces=[];if(type==='box'){v=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];faces=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[0,3,7,4],[1,2,6,5]];}else if(type==='pyramid'){v=[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],[0,1.4,0]];faces=[[0,1,2,3],[0,1,4],[1,2,4],[2,3,4],[3,0,4]];}else{const rows=coarse?4:12,cols=coarse?8:24;for(let j=0;j<=rows;j++){const a=j/rows*Math.PI*(type==='torus'?2:1);for(let k=0;k<cols;k++){const b=k/cols*Math.PI*2;v.push(type==='torus'?[(.85+.28*Math.cos(a))*Math.cos(b),(.85+.28*Math.cos(a))*Math.sin(b),.28*Math.sin(a)]:[Math.sin(a)*Math.cos(b),Math.cos(a),Math.sin(a)*Math.sin(b)]);}}for(let j=0;j<rows;j++)for(let k=0;k<cols;k++){const n=j*cols+k,m=j*cols+(k+1)%cols;faces.push([n,m,m+cols,n+cols]);}}
const edges=new Map();faces.forEach(f=>f.forEach((a,i)=>{const b=f[(i+1)%f.length];edges.set([Math.min(a,b),Math.max(a,b)].join(','),[a,b]);}));
// Subdivide planar surfaces with wire lines, retaining the original faces for picking.
const mix=(a,b,t)=>a.map((value,i)=>value+(b[i]-value)*t);
function wire(a,b){const n=v.length;v.push(a,b);edges.set('grid-'+n,[n,n+1]);}
if(type==='box'||type==='pyramid'){
  faces.forEach(face=>{
    const points=face.map(i=>v[i]);
    for(let step=1;step<9;step++){
      const t=step/9;
      if(points.length===4){
        wire(mix(points[0],points[1],t),mix(points[3],points[2],t));
        wire(mix(points[0],points[3],t),mix(points[1],points[2],t));
      }else{
        // Three families of lines form a triangular lattice on pyramid faces.
        for(let side=0;side<3;side++){
          wire(mix(points[side],points[(side+1)%3],t),mix(points[side],points[(side+2)%3],t));
        }
      }
    }
  });
}
return {v,faces,edges:[...edges.values()]};}
// Each research fragment is a small inhabitable machine: a core, pods,
// collars, antennae and articulated supports. All parts share one pick target.
function assembly(r, coarse=false){
  const result={v:[],faces:[],edges:[]};
  function part(type,position,scale,angle=0){
    const g=geometry(type,coarse),offset=result.v.length;
    g.v.forEach(([x,y,z])=>{
      x*=scale[0];y*=scale[1];z*=scale[2];
      result.v.push([x*Math.cos(angle)-y*Math.sin(angle)+position[0],x*Math.sin(angle)+y*Math.cos(angle)+position[1],z+position[2]]);
    });
    g.faces.forEach(f=>result.faces.push(f.map(i=>i+offset)));
    g.edges.forEach(e=>result.edges.push(e.map(i=>i+offset)));
  }
  function strut(a,b){
    const n=result.v.length;result.v.push(a,b);result.edges.push([n,n+1]);
  }
  part(r.shape,[0,0,0],r.shape==='sphere'?[1,.68,.8]:[.78,.78,.78]);
  part('torus',[0,-.38,0],[1.04,.38,1.04],.15);
  // Asymmetric satellite pods and projecting gantries.
  const flip=Number(r.id)%2?1:-1;
  for(let k=0;k<3;k++){
    const x=flip*(.65+k*.25),y=.4+k*.36,z=(k-1)*.48;
    part(k===1?'box':'sphere',[x,y,z],[.28,.2,.25],k*.25);
    strut([0,.1,0],[x,y,z]);
    part('box',[x*.5,y*.5,z*.5],[.035,.035,.5],.6);
  }
  for(let side of [-1,1]){
    const a=[side*.5,-.45,.15],b=[side*1.02,-1.1,.25],c=[side*.82,-1.5,.65];
    strut(a,b);strut(b,c);
    strut([a[0]+.09,a[1],a[2]],[b[0]+.09,b[1],b[2]]);
    strut([b[0]+.09,b[1],b[2]],[c[0]+.09,c[1],c[2]]);
    part('sphere',b,[.1,.1,.1]);
    part('box',c,[.25,.045,.25]);
  }
  strut([-.3,.4,0],[-.5,1.75,.1]);
  part('torus',[-.5,1.75,.1],[.28,.28,.12],.5);
  const rotation=new THREE.Euler(...r.rotation,'XYZ');
  const transform=new THREE.Matrix4().compose(
    new THREE.Vector3(...r.p),
    new THREE.Quaternion().setFromEuler(rotation),
    new THREE.Vector3(r.s,r.s,r.s)
  );
  result.v=result.v.map(point=>new THREE.Vector3(...point).applyMatrix4(transform).toArray());
  return result;
}

function start(){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(55,1,.1,100);
  camera.position.set(4.8,3.1,9.8);
  const controls=new OrbitControls(camera,canvas);
  controls.enablePan=false;
  controls.enableDamping=false;
  controls.minDistance=4;
  controls.maxDistance=19;
  const root=new THREE.Group();scene.add(root);
  const fragments=[],targets=[],surfaces=[];
  const cursor=document.createElement('div');
  cursor.className='construct-cursor';cursor.setAttribute('aria-hidden','true');document.body.append(cursor);
  const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
  document.body.classList.add('has-construct-cursor');
  document.addEventListener('pointermove',e=>{
    if(!finePointer.matches||e.pointerType==='touch')return;
    cursor.style.transform=`translate3d(${e.clientX}px,${e.clientY}px,0)`;
    cursor.classList.add('is-visible');
    cursor.classList.toggle('is-link',!!e.target.closest('a,button'));
  });
  document.addEventListener('pointerleave',()=>cursor.classList.remove('is-visible'));
  window.addEventListener('blur',()=>cursor.classList.remove('is-visible'));
  // Small textures are uploaded once; no per-frame painting or geometry rebuilds.
  function colourTexture(index){
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
  const pickMaterial=new THREE.MeshBasicMaterial({side:THREE.DoubleSide});
  records.forEach((r,index)=>{
    const mesh=assembly(r),positions=[];
    mesh.edges.forEach(([a,b])=>positions.push(...mesh.v[a],...mesh.v[b]));
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
    const material=new THREE.LineBasicMaterial({color:0x4191dc,transparent:true,opacity:.48,depthWrite:false});
    const lines=new THREE.LineSegments(geometry,material);root.add(lines);fragments.push(lines);
    const solidPositions=[],uvs=[];
    mesh.faces.forEach(face=>{
      // Project each polygon onto its own plane, keeping the pattern attached to it.
      const points=face.map(i=>new THREE.Vector3(...mesh.v[i]));
      const origin=points[0],u=points[1].clone().sub(origin).normalize();
      const normal=new THREE.Vector3();
      for(let k=2;k<points.length&&normal.lengthSq()<1e-12;k++)normal.crossVectors(u,points[k].clone().sub(origin));
      if(normal.lengthSq()<1e-12)return;
      const v=new THREE.Vector3().crossVectors(normal.normalize(),u).normalize();
      const coords=points.map(p=>{const d=p.clone().sub(origin);return [d.dot(u),d.dot(v)];});
      const xs=coords.map(p=>p[0]),ys=coords.map(p=>p[1]);
      const minX=Math.min(...xs),minY=Math.min(...ys),dx=Math.max(...xs)-minX||1,dy=Math.max(...ys)-minY||1;
      for(let k=1;k<face.length-1;k++)for(const n of [0,k,k+1]){
        solidPositions.push(...mesh.v[face[n]]);uvs.push((coords[n][0]-minX)/dx,(coords[n][1]-minY)/dy);
      }
    });
    const solidGeometry=new THREE.BufferGeometry();
    solidGeometry.setAttribute('position',new THREE.Float32BufferAttribute(solidPositions,3));
    solidGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
    const solid=new THREE.Mesh(solidGeometry,new THREE.MeshBasicMaterial({map:colourTexture(index),side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}));
    solid.visible=false;root.add(solid);surfaces.push(solid);
    const proxy=assembly(r,true),triangles=[];
    proxy.faces.forEach(face=>{for(let k=1;k<face.length-1;k++) triangles.push(...proxy.v[face[0]],...proxy.v[face[k]],...proxy.v[face[k+1]]);});
    const pickGeometry=new THREE.BufferGeometry();
    pickGeometry.setAttribute('position',new THREE.Float32BufferAttribute(triangles,3));
    pickGeometry.computeBoundingSphere();
    const target=new THREE.Mesh(pickGeometry,pickMaterial);
    target.userData.index=index;
    // Pick meshes never enter the rendered scene.
    target.updateMatrixWorld();targets.push(target);
  });
  let selected=-1,frame=0,pendingPointer=null,dragging=false;
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  function highlight(index){
    surfaces.forEach((surface,i)=>surface.visible=i===index);
    fragments.forEach((f,i)=>{f.material.color.setHex(i===index?0x17212c:0x4191dc);f.material.opacity=i===index?.28:.48;});
    cursor.classList.toggle('is-target',index>=0);
  }
  function select(index){
    highlight(index);
    if(index===selected){requestRender();return;}
    selected=index;

    if(!projectId)display(index);
    requestRender();
  }
  function requestRender(){if(!frame)frame=requestAnimationFrame(render);}
  function render(){
    frame=0;
    if(pendingPointer&&!dragging){
      const rect=canvas.getBoundingClientRect();
      pointer.set((pendingPointer.x-rect.left)/rect.width*2-1,-(pendingPointer.y-rect.top)/rect.height*2+1);
      camera.updateMatrixWorld();
      raycaster.setFromCamera(pointer,camera);
      const hit=raycaster.intersectObjects(targets,false)[0];
      if(hit)select(hit.object.userData.index);else highlight(-1);
      canvas.style.cursor=hit?'pointer':'grab';
      pendingPointer=null;
    }
    renderer.render(scene,camera);
  }
  function resize(){
    const rect=canvas.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    camera.aspect=rect.width/rect.height;
    // Keep the full assembly visible on narrow screens.
    camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(55/2))/Math.min(1,camera.aspect)));
    camera.updateProjectionMatrix();renderer.setSize(rect.width,rect.height,false);requestRender();
  }
  controls.addEventListener('change',requestRender);
  controls.addEventListener('start',()=>{dragging=true;pendingPointer=null;cursor.classList.add('is-dragging');});
  controls.addEventListener('end',()=>{dragging=false;cursor.classList.remove('is-dragging');});
  canvas.addEventListener('pointermove',e=>{if(!dragging){pendingPointer={x:e.clientX,y:e.clientY};requestRender();}});
  let down=null,moved=false;
  canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};moved=false;});
  canvas.addEventListener('pointermove',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>5)moved=true;});
  canvas.addEventListener('pointerup',e=>{if(down&&!moved){pendingPointer={x:e.clientX,y:e.clientY};requestRender();}down=null;});
  canvas.addEventListener('pointercancel',()=>{down=null;pendingPointer=null;});
  canvas.addEventListener('pointerleave',()=>{pendingPointer=null;highlight(-1);requestRender();});
  function close(){select(-1);canvas.focus();}
  document.querySelector('#close-detail').onclick=close;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  canvas.addEventListener('keydown',e=>{
    if(e.key==='Enter'){e.preventDefault();select((selected+1)%records.length);return;}
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'].includes(e.key))return;
    e.preventDefault();
    const offset=camera.position.clone().sub(controls.target);
    const spherical=new THREE.Spherical().setFromVector3(offset);
    if(e.key==='ArrowLeft')spherical.theta-=.12;
    if(e.key==='ArrowRight')spherical.theta+=.12;
    if(e.key==='ArrowUp')spherical.phi-=.12;
    if(e.key==='ArrowDown')spherical.phi+=.12;
    if(e.key==='+'||e.key==='=')spherical.radius/=1.1;
    if(e.key==='-')spherical.radius*=1.1;
    spherical.radius=THREE.MathUtils.clamp(spherical.radius,controls.minDistance,controls.maxDistance);
    spherical.makeSafe();camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));controls.update();requestRender();
  });
  const observer=new ResizeObserver(resize);observer.observe(canvas);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();});
  canvas.addEventListener('webglcontextrestored',requestRender);
  display(-1);resize();
}
try{start();}catch(error){
  console.error('Unable to start the research construct',error);
  const message=document.createElement('p');message.className='renderer-error';message.textContent='The 3D construct needs WebGL. Please enable graphics acceleration or try another browser.';canvas.after(message);
}
