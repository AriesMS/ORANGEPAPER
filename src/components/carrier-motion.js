import * as THREE from 'three';

// Reusable geometry: animate transforms, never rebuild meshes per frame.
export function createCarrierMotion(scene, targets, {heart,ground}, assemblies=[]) {
  const rig=new THREE.Group();scene.add(rig);
  const yellow=new THREE.MeshBasicMaterial({color:0xf2c928,wireframe:true});
  const red=new THREE.MeshBasicMaterial({color:0xe34b32,wireframe:true});
  const cream=new THREE.MeshBasicMaterial({color:0xeee9da,wireframe:true});
  const cylinder=new THREE.CylinderGeometry(.035,.035,1,5,1);
  const jointGeometry=new THREE.IcosahedronGeometry(.09,0);
  const wheelGeometry=new THREE.TorusGeometry(.27,.028,4,18);
  const axle=new THREE.Vector3(0,1,0);
  function mesh(geometry,material,parent=rig){
    const object=new THREE.Mesh(geometry,material);parent.add(object);
    object.userData.index=0;targets.push(object);return object;
  }
  function link(object,a,b){
    const delta=b.clone().sub(a);object.position.copy(a).add(b).multiplyScalar(.5);
    object.scale.y=delta.length();object.quaternion.setFromUnitVectors(axle,delta.normalize());
  }
  const legs=Array.from({length:3},(_,i)=>{
    const angle=i*Math.PI*2/3+.35;
    const hip=new THREE.Vector3(...heart).add(new THREE.Vector3(Math.cos(angle)*.18,-.1,Math.sin(angle)*.18));
    const size=[1.3,.72,1.05][i];
    const leg={size,angle,hip,upper:mesh(cylinder,yellow),lower:mesh(cylinder,red),joint:mesh(jointGeometry,cream),foot:mesh(new THREE.BoxGeometry(.28,.055,.38),cream)};
    for(const part of [leg.upper,leg.lower,leg.joint,leg.foot])part.scale.set(size,1,size);
    return leg;
  });
  const wheels=[-1,1].map(side=>{
    const radius=side<0?.39:.21;
    const group=new THREE.Group();group.scale.setScalar(radius/.27);group.position.set(heart[0]+side*.65,ground-.31+radius,heart[2]-.15);group.rotation.y=Math.PI/2;rig.add(group);
    mesh(wheelGeometry,yellow,group);
    for(let i=0;i<6;i++){
      const spoke=mesh(new THREE.BoxGeometry(.49,.016,.016),i%2?red:cream,group);spoke.rotation.z=i*Math.PI/6;
    }
    const strut=mesh(cylinder,red);link(strut,new THREE.Vector3(...heart),group.position);
    return {group,radius,strut};
  });
  // Flat strips give reliable line thickness on WebGL implementations.
  const vertices=[];
  function strip(x0,z0,x1,z1){vertices.push(x0,0,z0,x1,0,z0,x1,0,z1,x0,0,z0,x1,0,z1,x0,0,z1);}
  for(let i=-50;i<=50;i++){const half=i%5===0?.022:.012;strip(i-half,-50,i+half,50);strip(-50,i-half,50,i+half);}
  const gridGeometry=new THREE.BufferGeometry();gridGeometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  const grid=new THREE.Mesh(gridGeometry,new THREE.MeshBasicMaterial({color:0x5cafff,transparent:true,opacity:.58,side:THREE.DoubleSide,depthWrite:false}));
  grid.position.y=ground-.31;scene.add(grid);
  let previousTime=0;
  const suspension=assemblies.map((objects,i)=>({objects,y:0,velocity:0,mass:1+i*.22}));
  const body={y:0,velocity:0};
  function spring(state,target,dt,stiffness=30){
    const steps=Math.max(1,Math.ceil(dt/(1/120))),h=dt/steps;
    for(let i=0;i<steps;i++){state.velocity+=((target-state.y)*stiffness-state.velocity*7)/(state.mass||1)*h;state.y+=state.velocity*h;}
  }
  // Incommensurate terrain waves make irregular, repeatable road impulses.
  function terrain(t,phase=0){return .045*Math.sin(t*2.13+phase)+.023*Math.sin(t*4.71+phase*1.7)+.014*Math.sin(t*7.37+phase*.3);}
  const fog=new THREE.FogExp2(0x000000,.027);scene.fog=fog;
  function update(time){
    const dt=Math.min(.05,Math.max(0,time-previousTime));previousTime=time;
    spring(body,terrain(time),dt);
    suspension.forEach((state,i)=>{
      spring(state,i?terrain(time,i*1.37)*.55:0,dt,22+i*2);
      for(const object of state.objects){object.position.y=body.y+state.y;object.position.x=i?state.y*.18:0;object.updateMatrixWorld(true);}
    });
    const cycle=time*1.7;
    legs.forEach((leg,i)=>{
      const phase=cycle+i*Math.PI*2/3;
      const foot=new THREE.Vector3(heart[0]+Math.cos(leg.angle)*1.03*leg.size,ground-.27+Math.max(0,Math.sin(phase))*.23*leg.size,heart[2]+Math.sin(leg.angle)*1.03*leg.size+Math.cos(phase)*.22);
      const hip=leg.hip.clone();hip.y+=body.y;
      const knee=hip.clone().lerp(foot,.55);knee.x+=Math.cos(leg.angle)*.25;knee.z+=Math.sin(leg.angle)*.25;knee.y+=.12;
      link(leg.upper,hip,knee);link(leg.lower,knee,foot);leg.joint.position.copy(knee);leg.foot.position.copy(foot);
    });
    wheels.forEach(({group,radius,strut},i)=>{
      group.rotation.z=-time*.65/radius;
      group.position.y=ground-.31+radius+terrain(time,i*.9)*.25;
      const hip=new THREE.Vector3(...heart);hip.y+=body.y;link(strut,hip,group.position);
    });
    grid.position.z=(time*.65)%1;
    rig.updateMatrixWorld(true);
  }
  update(0);
  return {update};
}
