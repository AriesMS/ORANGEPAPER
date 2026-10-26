import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export function showPhotogrammetry(){
  const host=document.querySelector('.photogrammetry-viewer');
  if(!host)return;
  const canvas=host.querySelector('canvas'),status=host.querySelector('[role="status"]');
  const buttons=[...host.querySelectorAll('button')];
  const observer=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();load();}
  },{rootMargin:'250px'});
  observer.observe(host);
  async function load(){
    let renderer,controls,resizeObserver;
    try{
      status.textContent='Loading 3D building model…';
      renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.01,1000);
      controls=new OrbitControls(camera,canvas);
      controls.enableDamping=false;
      controls.screenSpacePanning=true;
      const render=()=>renderer.render(scene,camera);
      const gltf=await new GLTFLoader().loadAsync(host.dataset.modelSrc,event=>{
        if(event.total)status.textContent=`Loading 3D building model… ${Math.round(event.loaded/event.total*100)}%`;
      });
      const model=gltf.scene;
      scene.add(model);
      const bounds=new THREE.Box3().setFromObject(model);
      const centre=bounds.getCenter(new THREE.Vector3());
      const radius=bounds.getBoundingSphere(new THREE.Sphere()).radius;
      if(!Number.isFinite(radius)||radius<=0)throw new Error('Empty model');
      const direction=new THREE.Vector3(-1,.65,-1.3).normalize();
      let distance;
      function reset(){
        const halfAngle=Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*Math.min(1,camera.aspect));
        distance=radius/Math.sin(halfAngle)*1.12;
        camera.position.copy(centre).addScaledVector(direction,distance);
        camera.near=radius/1000;camera.far=radius*100;camera.updateProjectionMatrix();
        controls.target.copy(centre);controls.minDistance=radius*.08;controls.maxDistance=radius*15;
        controls.update();render();
      }
      function resize(){
        const {width,height}=canvas.getBoundingClientRect();
        if(!width||!height)return;
        camera.aspect=width/height;camera.updateProjectionMatrix();
        renderer.setSize(width,height,false);render();
      }
      function zoom(factor){
        const offset=camera.position.clone().sub(controls.target);
        offset.setLength(THREE.MathUtils.clamp(offset.length()*factor,controls.minDistance,controls.maxDistance));
        camera.position.copy(controls.target).add(offset);controls.update();render();
      }
      controls.addEventListener('change',render);
      resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);
      resize();reset();
      host.querySelector('[data-view="reset"]').addEventListener('click',reset);
      host.querySelector('[data-view="in"]').addEventListener('click',()=>zoom(.8));
      host.querySelector('[data-view="out"]').addEventListener('click',()=>zoom(1.25));
      canvas.addEventListener('keydown',event=>{
        if(['+','=','-','_','Home','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))event.preventDefault();
        if(['+','='].includes(event.key))zoom(.8);
        if(['-','_'].includes(event.key))zoom(1.25);
        if(event.key==='Home')reset();
        if(event.key.startsWith('Arrow')){
          const offset=camera.position.clone().sub(controls.target);
          const spherical=new THREE.Spherical().setFromVector3(offset);
          if(event.key==='ArrowLeft')spherical.theta-=.12;
          if(event.key==='ArrowRight')spherical.theta+=.12;
          if(event.key==='ArrowUp')spherical.phi-=.12;
          if(event.key==='ArrowDown')spherical.phi+=.12;
          spherical.makeSafe();camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
          controls.update();render();
        }
      });
      buttons.forEach(button=>button.disabled=false);
      status.textContent='';
      host.dataset.state='ready';
      canvas.addEventListener('webglcontextlost',event=>{
        event.preventDefault();status.textContent='The 3D view was interrupted. Reload the page to restore it.';
        buttons.forEach(button=>button.disabled=true);host.dataset.state='error';
      });
    }catch(error){
      console.error('Photogrammetry viewer unavailable',error);
      resizeObserver?.disconnect();controls?.dispose();renderer?.dispose();
      status.textContent='The 3D model could not be loaded. Please reload to try again.';
      host.dataset.state='error';
    }
  }
}
