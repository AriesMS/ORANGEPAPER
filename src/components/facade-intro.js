import {colourTexture} from './modernist-material.js';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {assembly} from './construct-geometry.js';

export function showFacadeIntro(){
  const canvas=document.querySelector('#facade-intro-construct');
  const links=[...document.querySelectorAll('.project-stage-nav a')];
  try{
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(45,1,.1,100);
    camera.position.set(4.8,3.1,9.8);
    const controls=new OrbitControls(camera,canvas);
    controls.enableZoom=true;controls.enablePan=true;
    controls.minDistance=4;controls.maxDistance=24;
    // Reuse homepage fragment 02 exactly, centred as one intact construct.
    const record={id:'02',shape:'box',rotation:[.85,-.65,-.55],p:[0,0,0],s:1.1};
    const full=assembly(record);
    const centre=new THREE.Box3().setFromPoints(full.v.map(p=>new THREE.Vector3(...p))).getCenter(new THREE.Vector3());
    const texture=colourTexture(renderer,1); // Homepage fragment 02 palette and pattern.
    const targets=[],fragments=[];
    links.forEach((link,index)=>{
      const mesh=assembly(record,false,index+1);
      mesh.v=mesh.v.map(p=>new THREE.Vector3(...p).sub(centre).toArray());
      const lines=[],triangles=[],uvs=[];
      mesh.edges.forEach(([a,b])=>lines.push(...mesh.v[a],...mesh.v[b]));
      mesh.faces.forEach(face=>{
        // Match the homepage's face-local projection of the modernist blocks.
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
          triangles.push(...mesh.v[face[n]]);uvs.push((coords[n][0]-minX)/dx,(coords[n][1]-minY)/dy);
        }
      });
      const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(lines,3));
      const wire=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0xa7afb8,transparent:true,opacity:.55}));
      const surfaceGeometry=new THREE.BufferGeometry();surfaceGeometry.setAttribute('position',new THREE.Float32BufferAttribute(triangles,3));
      surfaceGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
      const surface=new THREE.Mesh(surfaceGeometry,new THREE.MeshBasicMaterial({map:texture,color:0xffffff,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}));
      surface.visible=false;scene.add(wire,surface);
      const target=new THREE.Mesh(surfaceGeometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));
      target.userData.index=index;target.updateMatrixWorld();targets.push(target);fragments.push({wire,surface});
    });
    function render(){renderer.render(scene,camera);}
    function highlight(index){
      fragments.forEach(({wire,surface},i)=>{surface.visible=i===index;wire.material.color.setHex(i===index?0x17212c:0xa7afb8);});
      links.forEach((link,i)=>link.classList.toggle('is-hovered',i===index));
      canvas.style.cursor=index<0?'grab':'pointer';render();
    }
    const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
    function pick(event){
      const rect=canvas.getBoundingClientRect();
      pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
      camera.updateMatrixWorld();raycaster.setFromCamera(pointer,camera);
      return raycaster.intersectObjects(targets,false)[0]?.object.userData.index??-1;
    }
    let down=null;
    canvas.addEventListener('pointerdown',event=>{down={id:event.pointerId,x:event.clientX,y:event.clientY,moved:!event.isPrimary};highlight(-1);});
    canvas.addEventListener('pointermove',event=>{
      if(down){if(Math.hypot(event.clientX-down.x,event.clientY-down.y)>5)down.moved=true;return;}
      if(event.pointerType!=='touch')highlight(pick(event));
    });
    canvas.addEventListener('pointerup',event=>{
      if(down&&down.id===event.pointerId&&!down.moved&&event.button===0){const index=pick(event);if(index>=0)links[index].click();}
      down=null;highlight(-1);
    });
    canvas.addEventListener('pointercancel',()=>{down=null;highlight(-1);});
    canvas.addEventListener('pointerleave',()=>highlight(-1));
    window.addEventListener('pointerup',()=>{down=null;});
    links.forEach((link,index)=>{
      link.addEventListener('pointerenter',()=>highlight(index));link.addEventListener('pointerleave',()=>highlight(-1));
      link.addEventListener('focus',()=>highlight(index));link.addEventListener('blur',()=>highlight(-1));
    });
    function resize(){const {width,height}=canvas.getBoundingClientRect();if(!width||!height)return;camera.aspect=width/height;camera.fov=THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(22.5))/Math.min(1,camera.aspect)));camera.updateProjectionMatrix();renderer.setSize(width,height,false);render();}
    controls.addEventListener('change',()=>highlight(-1));
    new ResizeObserver(resize).observe(canvas);resize();
    canvas.addEventListener('webglcontextlost',event=>event.preventDefault());
    canvas.addEventListener('webglcontextrestored',resize);
  }catch(error){
    console.error('Facade introduction preview unavailable',error);
    canvas.hidden=true;
    document.querySelector('.project-stage-nav').classList.add('is-fallback');
  }
}
