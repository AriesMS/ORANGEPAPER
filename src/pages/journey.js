import { createCarrierMotion } from '../components/carrier-motion.js';
import { assembly, researchCarrier } from '../components/construct-geometry.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
let records = [
  {id:'01',title:'PhD / Computational architecture',year:'Ongoing',type:'OVERARCHING RESEARCH',place:'National University of Singapore',text:'The overarching research framework connecting generative design, AI-assisted design modelling, graph-based spatial inference, and computational architecture. A branching, walking research construct carries the projects, collaborations, teaching, and practice as an evolving city of ideas. Three open docking arms reach into empty space for future work.',shape:'sphere',p:[0,0,0],s:1.25},
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

function start(){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(55,1,.1,100);
  camera.position.set(4.8,3.1,9.8);
  if(!projectId)camera.position.multiplyScalar(1.3);
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
  const carrier=projectId?null:researchCarrier(records.filter(r=>r.id!=='01'));
  records.forEach((r,index)=>{
    const isCarrier=r.id==='01'&&carrier;
    const mesh=isCarrier?carrier:assembly(r),positions=[],lineColours=[];
    mesh.edges.forEach(([a,b])=>{positions.push(...mesh.v[a],...mesh.v[b]);if(isCarrier)for(const i of [a,b])lineColours.push(...new THREE.Color(mesh.colours[i]).toArray());});
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
    if(isCarrier)geometry.setAttribute('color',new THREE.Float32BufferAttribute(lineColours,3));
    const material=new THREE.LineBasicMaterial({color:isCarrier?0xffffff:0x4191dc,vertexColors:!!isCarrier,transparent:true,opacity:isCarrier?.55:.48,depthWrite:false});
    const lines=new THREE.LineSegments(geometry,material);root.add(lines);fragments.push(lines);
    const solidPositions=[],uvs=[],solidColours=[];
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
        solidPositions.push(...mesh.v[face[n]]);if(isCarrier)solidColours.push(...new THREE.Color(mesh.colours[face[n]]).toArray());uvs.push((coords[n][0]-minX)/dx,(coords[n][1]-minY)/dy);
      }
    });
    const solidGeometry=new THREE.BufferGeometry();
    solidGeometry.setAttribute('position',new THREE.Float32BufferAttribute(solidPositions,3));
    solidGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
    if(isCarrier)solidGeometry.setAttribute('color',new THREE.Float32BufferAttribute(solidColours,3));
    const solid=new THREE.Mesh(solidGeometry,new THREE.MeshBasicMaterial({map:isCarrier?null:colourTexture(index),color:0xffffff,vertexColors:!!isCarrier,transparent:!!isCarrier,opacity:isCarrier?.28:1,depthWrite:!isCarrier,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}));
    solid.visible=false;root.add(solid);surfaces.push(solid);
    const proxy=isCarrier?carrier:assembly(r,true),triangles=[];
    proxy.faces.forEach(face=>{for(let k=1;k<face.length-1;k++) triangles.push(...proxy.v[face[0]],...proxy.v[face[k]],...proxy.v[face[k+1]]);});
    const pickGeometry=new THREE.BufferGeometry();
    pickGeometry.setAttribute('position',new THREE.Float32BufferAttribute(triangles,3));
    pickGeometry.computeBoundingSphere();
    const target=new THREE.Mesh(pickGeometry,pickMaterial);
    target.userData.index=index;
    // Pick meshes never enter the rendered scene.
    target.updateMatrixWorld();targets.push(target);
  });
  const motion=carrier?createCarrierMotion(scene,targets,carrier.motion,fragments.map((wire,i)=>[wire,surfaces[i],targets[i]])):null;
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused=reducedMotion.matches,time=0,lastTime=null,contextLost=false;
  const motionButton=motion?document.createElement('button'):null;
  function updateMotionButton(){if(motionButton){motionButton.textContent=paused?'Resume motion':'Pause motion';motionButton.setAttribute('aria-pressed',String(paused));}}
  if(motionButton){
    motionButton.className='motion-toggle';document.querySelector('main').append(motionButton);
    motionButton.addEventListener('click',()=>{paused=!paused;lastTime=null;updateMotionButton();requestRender();});updateMotionButton();
  }
  reducedMotion.addEventListener('change',()=>{paused=reducedMotion.matches;lastTime=null;updateMotionButton();requestRender();});
  document.addEventListener('visibilitychange',()=>{lastTime=null;if(document.hidden){cancelAnimationFrame(frame);frame=0;}else requestRender();});
  let selected=-1,pinned=-1,hovered=-1,frame=0,pendingPointer=null,dragging=false;
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  function highlight(index){
    hovered=index;
    surfaces.forEach((surface,i)=>surface.visible=i===index||i===pinned);
    fragments.forEach((f,i)=>{const carrierLine=!projectId&&records[i].id==='01',active=i===index||i===pinned;f.material.color.setHex(carrierLine?0xffffff:active?0x17212c:0x4191dc);f.material.opacity=carrierLine?(active?.85:.55):(active?.28:.48);});
    cursor.classList.toggle('is-target',index>=0);
  }
  function select(index){
    pinned=index;
    highlight(-1);
    if(index===selected){requestRender();return;}
    selected=index;

    if(!projectId)display(index);
    requestRender();
  }
  function requestRender(){if(!frame&&!document.hidden&&!contextLost)frame=requestAnimationFrame(render);}
  function render(now){
    frame=0;
    if(motion){
      if(!paused&&lastTime!==null)time+=Math.min((now-lastTime)/1000,.05);
      lastTime=now;motion.update(time);
    }
    if(pendingPointer&&!dragging){
      const rect=canvas.getBoundingClientRect();
      pointer.set((pendingPointer.x-rect.left)/rect.width*2-1,-(pendingPointer.y-rect.top)/rect.height*2+1);
      camera.updateMatrixWorld();
      raycaster.setFromCamera(pointer,camera);
      const hit=raycaster.intersectObjects(targets,false)[0];
      const index=hit?hit.object.userData.index:-1;
      if(pendingPointer.click)select(index);
      else{
        highlight(index);
        // A hover previews colour without replacing the pinned inspector.
        if(pinned<0&&index>=0){selected=index;if(!projectId)display(index);}
      }
      canvas.style.cursor=hit?'pointer':'grab';
      pendingPointer=null;
    }
    renderer.render(scene,camera);
    if(motion&&!paused)requestRender();
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
  canvas.addEventListener('pointerup',e=>{if(down&&!moved&&e.button===0){pendingPointer={x:e.clientX,y:e.clientY,click:true};requestRender();}down=null;});
  canvas.addEventListener('pointercancel',()=>{down=null;pendingPointer=null;});
  canvas.addEventListener('pointerleave',()=>{pendingPointer=null;highlight(-1);requestRender();});
  document.addEventListener('click',event=>{if(event.target!==canvas&&!event.target.closest('.inspector')&&pinned>=0)select(-1);});
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
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;cancelAnimationFrame(frame);frame=0;lastTime=null;});
  canvas.addEventListener('webglcontextrestored',()=>{contextLost=false;requestRender();});
  display(-1);resize();
}
try{start();}catch(error){
  console.error('Unable to start the research construct',error);
  const message=document.createElement('p');message.className='renderer-error';message.textContent='The 3D construct needs WebGL. Please enable graphics acceleration or try another browser.';canvas.after(message);
}
