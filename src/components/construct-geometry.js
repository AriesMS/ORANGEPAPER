import * as THREE from 'three';
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
export function assembly(r, coarse=false, stage=null){
  const result={v:[],faces:[],edges:[]};
  // Stage groups partition the original geometry without changing the full assembly.
  let currentStage=3;
  function part(type,position,scale,angle=0){
    if(stage!==null && stage!==currentStage)return;
    const g=geometry(type,coarse),offset=result.v.length;
    g.v.forEach(([x,y,z])=>{
      x*=scale[0];y*=scale[1];z*=scale[2];
      result.v.push([x*Math.cos(angle)-y*Math.sin(angle)+position[0],x*Math.sin(angle)+y*Math.cos(angle)+position[1],z+position[2]]);
    });
    g.faces.forEach(f=>result.faces.push(f.map(i=>i+offset)));
    g.edges.forEach(e=>result.edges.push(e.map(i=>i+offset)));
  }
  function strut(a,b){
    if(stage!==null && stage!==currentStage)return;
    const n=result.v.length;result.v.push(a,b);result.edges.push([n,n+1]);
  }
  part(r.shape,[0,0,0],r.shape==='sphere'?[1,.68,.8]:[.78,.78,.78]);
  currentStage=2;
  part('torus',[0,-.38,0],[1.04,.38,1.04],.15);
  // Asymmetric satellite pods and projecting gantries.
  currentStage=1;
  const flip=Number(r.id)%2?1:-1;
  for(let k=0;k<3;k++){
    const x=flip*(.65+k*.25),y=.4+k*.36,z=(k-1)*.48;
    part(k===1?'box':'sphere',[x,y,z],[.28,.2,.25],k*.25);
    strut([0,.1,0],[x,y,z]);
    part('box',[x*.5,y*.5,z*.5],[.035,.035,.5],.6);
  }
  currentStage=4;
  for(let side of [-1,1]){
    const a=[side*.5,-.45,.15],b=[side*1.02,-1.1,.25],c=[side*.82,-1.5,.65];
    strut(a,b);strut(b,c);
    strut([a[0]+.09,a[1],a[2]],[b[0]+.09,b[1],b[2]]);
    strut([b[0]+.09,b[1],b[2]],[c[0]+.09,c[1],c[2]]);
    part('sphere',b,[.1,.1,.1]);
    part('box',c,[.25,.045,.25]);
  }
  currentStage=1;
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


// An eccentric walking-tree carrier: structure grows under each research fragment.
export function researchCarrier(records) {
  const result={v:[],faces:[],edges:[],colours:[],futureSockets:[]};
  const palette=[0xf2c928,0xe34b32,0x368cce,0xeee9da];
  let colour=palette[0];
  function beam(a,b,width=.045) {
    const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b);
    const direction=end.clone().sub(start),length=direction.length();
    if(length<1e-8)return;
    const rotation=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize());
    const center=start.add(end).multiplyScalar(.5),offset=result.v.length;
    const corners=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
    corners.forEach(([x,y,z])=>result.v.push(new THREE.Vector3(x*width,y*length/2,z*width).applyQuaternion(rotation).add(center).toArray()));
    for(let i=0;i<8;i++)result.colours.push(colour);
    const faces=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[0,3,7,4],[1,2,6,5]];
    faces.forEach(face=>result.faces.push(face.map(i=>i+offset)));
    [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(edge=>result.edges.push(edge.map(i=>i+offset)));
  }
  const feet=records.map(r=>assembly(r).v.reduce((lowest,p)=>p[1]<lowest[1]?p:lowest));
  const ground=Math.min(...feet.map(p=>p[1]))-.55;
  const heart=[-.25,ground+1.05,-.35];
  // Retain the original pod, collar, antenna, and articulated-machine vocabulary.
  const core=assembly({id:'01',shape:'sphere',p:heart,s:.48,rotation:[.15,-.3,-.18]},true);
  result.v.push(...core.v);result.faces.push(...core.faces);result.edges.push(...core.edges);
  result.colours.push(...core.v.map(()=>palette[3]));
  function path(points,width=.014){
    for(let i=1;i<points.length;i++)beam(points[i-1],points[i],width);
  }
  const spine=[heart,[-.48,ground+1.7,-.42],[.08,-.9,-.55],[-.2,.05,-.38],[.08,.85,-.35]];
  path(spine,.035);
  path(spine.map(([x,y,z])=>[x+.12,y,z-.08]),.018);
  spine.forEach(p=>beam(p,[p[0]+.12,p[1],p[2]-.08],.012));
  result.motion={heart,ground};
  const bounds=new THREE.Box3().setFromPoints(records.flatMap(r=>assembly(r).v.map(p=>new THREE.Vector3(...p))));
  const future=[[bounds.min.x-.65,.25,.15],[bounds.max.x+.65,-.65,.2],[.35,bounds.max.y+.55,-.65]];
  result.futureSockets=future;
  [...feet,...future].forEach(([x,y,z],i)=>{
    const isFuture=i>=feet.length;
    colour=palette[i%3];
    // Branches terminate at the actual lowest point of each transformed construct.
    const attachY=Math.min(y-.55,Math.max(heart[1],y-1.25));
    let segment=0;
    while(segment<spine.length-2&&spine[segment+1][1]<attachY)segment++;
    const a=new THREE.Vector3(...spine[segment]),b=new THREE.Vector3(...spine[segment+1]);
    const t=THREE.MathUtils.clamp((attachY-a.y)/(b.y-a.y),0,1);
    const root=a.lerp(b,t);
    const end=new THREE.Vector3(x,y-.09,z);
    const elbow=root.clone().lerp(end,.55);elbow.y=Math.min(root.y,end.y)-.15;
    elbow.z+=(i%2?-.16:.16);
    const curve=new THREE.CatmullRomCurve3([root,elbow,end]);
    const points=curve.getPoints(6).map(p=>p.toArray());
    path(points,isFuture?.022:.035);
    // An airy under-slung arch reads as a bridge, with just a handful of ties.
    const arch=points.map(([px,py,pz],j)=>[px,py-.30*Math.sin(j/6*Math.PI),pz+.07*Math.sin(j/6*Math.PI)]);
    path(arch,isFuture?.012:.018);
    for(let j=1;j<6;j++)beam(points[j],arch[j],.012);
    colour=palette[3];
    beam([x-.23,y-.09,z],[x+.23,y-.09,z],.027);
    beam([x,y-.09,z-.16],[x,y-.09,z+.16],.022);
    if(isFuture){
      // Open docking forks mark available space without inventing a project.
      for(const side of [-1,1])beam([x+side*.23,y-.09,z],[x+side*.23,y+.19,z],.02);
    }else beam([x,y-.09,z],[x,y,z],.028);
  });
  colour=palette[1];
  // One incomplete aerial stair: Piranesian circulation as a delicate gesture.
  for(let i=0;i<9;i++){
    const angle=i*.24,cy=heart[1]+.15+i*.105;
    const x=heart[0]+Math.cos(angle)*.36,z=heart[2]+Math.sin(angle)*.36;
    beam([x,cy,z],[x+.19*Math.cos(angle),cy,z+.19*Math.sin(angle)],.012);
    if(i){const prev=angle-.24;beam([heart[0]+Math.cos(prev)*.36,cy-.105,heart[2]+Math.sin(prev)*.36],[x,cy,z],.01);}
  }
  return result;
}
