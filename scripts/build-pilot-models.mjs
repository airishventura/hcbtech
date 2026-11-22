import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { mkdir, writeFile } from 'node:fs/promises';

// Exterior-form studies from supplied photos. Coordinates are visual units,
// not measured machine dimensions. No hidden working mechanisms are modeled.
class NodeFileReader {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.(); }); }
}
globalThis.FileReader ??= NodeFileReader;
const steel = new THREE.MeshStandardMaterial({ color: '#a6acb0', metalness: .72, roughness: .36 });
const frameSteel = new THREE.MeshStandardMaterial({ color: '#7b858a', metalness: .5, roughness: .47 });
const red = new THREE.MeshStandardMaterial({ color: '#c72929', metalness: .25, roughness: .4 });
const black = new THREE.MeshStandardMaterial({ color: '#292d30', metalness: .2, roughness: .6 });
const green = new THREE.MeshStandardMaterial({ color: '#47633e', metalness: .35, roughness: .5 });
function mesh(group, name, geometry, material, position, rotation) {
  const part = new THREE.Mesh(geometry, material); part.name = name;
  part.position.set(...position); if (rotation) part.rotation.set(...rotation);
  group.add(part); return part;
}
const box = (g,n,size,p,mat=steel,rot) => mesh(g,n,new THREE.BoxGeometry(...size),mat,p,rot);
const cylinder = (g,n,r,length,p,mat=steel) => mesh(g,n,new THREE.CylinderGeometry(r,r,length,24),mat,p,[0,0,Math.PI/2]);
function beam(g,n,start,end,width=.055) {
  const a=new THREE.Vector3(...start),b=new THREE.Vector3(...end),delta=b.clone().sub(a);
  const part=mesh(g,n,new THREE.BoxGeometry(width,delta.length(),width),frameSteel,a.clone().add(b).multiplyScalar(.5).toArray());
  part.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());
}
function frame(g, height=1.12, width=1.4, depth=.86, angled=false) {
  const group=new THREE.Group();group.name='frame';g.add(group);
  for(const x of [-1,1]) for(const z of [-1,1]) beam(group,'leg', [x*width/2,.03,z*depth/2],[x*(width/2-(angled?.09:0)),height,z*(depth/2-(angled?.04:0))]);
  for(const y of [.14,height]) {
    for(const z of [-depth/2,depth/2]) beam(group,'cross-member',[-width/2,y,z],[width/2,y,z]);
    for(const x of [-width/2,width/2]) beam(group,'side-member',[x,y,-depth/2],[x,y,depth/2]);
  }
}
function motor(g, position) {
  const group=new THREE.Group();group.name='electric-drive-reference';group.position.set(...position);g.add(group);
  cylinder(group,'motor-body',.2,.46,[0,0,0],frameSteel);
  cylinder(group,'fan-cover',.215,.07,[-.27,0,0],black);
  for(const x of [-.16,-.08,0,.08,.16]) mesh(group,'cooling-fin',new THREE.TorusGeometry(.205,.01,5,24),steel,[x,0,0],[0,Math.PI/2,0]);
  box(group,'terminal-box',[.27,.13,.25],[0,.24,0]);
  box(group,'mounting-foot',[.5,.06,.46],[0,-.22,0],frameSteel);
}
function chute(g, y=1.08, width=.75, length=.8) {
  const group=new THREE.Group();group.name='discharge-chute';group.position.set(0,y,.15);group.rotation.x=.42;g.add(group);
  box(group,'chute-floor',[width,.025,length],[0,0,length/2]);
  for(const side of [-1,1])box(group,'chute-side',[.024,.17,length],[side*width/2,.07,length/2]);
}
function shellPeeler() {
  const g=new THREE.Group();g.name='shell-peeler-exterior-study';frame(g);
  const transmission=new THREE.Group();transmission.name='gearbox-and-shaft';g.add(transmission);
  box(transmission,'gearbox-body',[.42,.47,.46],[-.1,1.4,0],green);
  box(transmission,'gearbox-top',[.37,.05,.43],[-.1,1.66,0],green);
  for(const x of [-.23,-.15,-.07,.01])box(transmission,'gearbox-rib',[.025,.35,.025],[x,1.4,.245],green);
  cylinder(transmission,'external-shaft',.065,.52,[.35,1.42,0]);
  motor(g,[-.62,1.42,0]);
  cylinder(g,'disc-reference',.45,.035,[.64,1.42,0],frameSteel);
  cylinder(g,'disc-hub',.10,.10,[.69,1.42,0],steel);
  box(g,'red-guide',[.075,.11,.72],[.54,1.05,.18],red);
  chute(g,.95,.83,.8);
  return g;
}
function grater() {
  const g=new THREE.Group();g.name='coconut-grater-exterior-study';frame(g,1.15,1.25,.84,true);
  const profile=new THREE.Shape();profile.moveTo(-.42,-.23);profile.lineTo(-.42,.05);profile.absarc(0,.05,.42,Math.PI,0,true);profile.lineTo(.42,-.23);profile.closePath();
  const housing=mesh(g,'enclosed-housing',new THREE.ExtrudeGeometry(profile,{depth:1.1,bevelEnabled:false,steps:1,curveSegments:24}),steel,[-.55,1.48,0],[0,Math.PI/2,0]);
  housing.userData.description='Exterior housing only; internal mechanism unspecified';
  for(const x of [-.56,.56]) {
    const points=[new THREE.Vector3(x,1.25,.42),new THREE.Vector3(x,1.53,.42)];
    for(let i=0;i<=24;i++){const a=Math.PI-i*Math.PI/24;points.push(new THREE.Vector3(x,1.53+Math.sin(a)*.42,-Math.cos(a)*.42));}
    points.push(new THREE.Vector3(x,1.25,-.42));
    mesh(g,'red-cover-trim',new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),48,.014,6,false),red,[0,0,0]);
  }
  box(g,'top-access-lid',[.76,.035,.48],[0,1.92,0]);
  cylinder(g,'lid-hinge',.025,.6,[0,1.93,-.25]);
  cylinder(g,'external-upper-pulley',.16,.06,[.63,1.49,0],black);
  motor(g,[0,.39,0]);cylinder(g,'external-lower-pulley',.1,.06,[.63,.39,0],black);
  for(const z of [-.1,.1])box(g,'visible-belt',[.025,1.1,.025],[.66,.94,z],black);
  box(g,'switch-enclosure',[.16,.2,.1],[-.47,.91,.44],frameSteel);box(g,'switch-face',[.08,.08,.015],[-.47,.93,.5],red);
  chute(g,1.26,.65,.62);
  return g;
}
function milkPress() {
  const g=new THREE.Group();g.name='milk-press-exterior-study';frame(g,1.14,1.55,.88);
  for(const x of [-.775,.775])for(const z of [-.44,.44]) {
    const wheel=mesh(g,'caster',new THREE.CylinderGeometry(.075,.075,.045,16),black,[x,.035,z],[Math.PI/2,0,0]);
    wheel.userData.description='Visible wheel reference, unmeasured';
  }
  box(g,'machine-deck',[1.55,.045,.88],[0,1.16,0]);
  box(g,'transmission-cover',[.52,.57,.65],[.45,1.48,0]);
  cylinder(g,'cover-cap',.07,.045,[.45,1.79,0],green).rotation.z=0;
  const hopper=new THREE.Group();hopper.name='open-hopper';hopper.position.set(.10,1.9,0);g.add(hopper);
  // Four open tapered sheet surfaces, no concealed working geometry.
  const top=[[-.62,.30,-.49],[.62,.30,-.49],[.62,.30,.49],[-.62,.30,.49]];
  const bottom=[[-.2,-.26,-.17],[.2,-.26,-.17],[.2,-.26,.17],[-.2,-.26,.17]];
  const sheet=steel.clone();sheet.side=THREE.DoubleSide;
  for(let i=0;i<4;i++) {
    const j=(i+1)%4,geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute([...top[i],...bottom[i],...top[j],...top[j],...bottom[i],...bottom[j]],3));geo.computeVertexNormals();
    mesh(hopper,'hopper-sheet',geo,sheet,[0,0,0]);beam(hopper,'hopper-rim',top[i],top[j],.035);
  }
  beam(hopper,'visible-hopper-divider',[-.62,.30,0],[.62,.30,0],.025);
  box(g,'hopper-neck',[.4,.22,.34],[.1,1.56,0]);
  for(const y of [1.43,1.08]) {
    cylinder(g,'visible-external-roller',.12,.67,[-.42,y,0]);
    cylinder(g,'roller-end',.14,.035,[-.77,y,0],frameSteel);
    for(const x of [-.65,-.50,-.35,-.2])mesh(g,'roller-surface-band',new THREE.TorusGeometry(.121,.006,4,20),frameSteel,[x,y,0],[0,Math.PI/2,0]);
  }
  box(g,'front-guard',[.045,.78,.59],[-.8,1.08,0]);
  const outlet=new THREE.Group();outlet.name='outlet-offset';outlet.position.x=-.4;g.add(outlet);chute(outlet,.95,.67,.83);
  const orange=new THREE.MeshStandardMaterial({color:'#e85d13',metalness:.12,roughness:.5});
  box(g,'engine-body',[.54,.4,.55],[.35,.46,0],black);
  box(g,'fuel-tank',[.60,.20,.56],[.35,.76,0],orange);
  mesh(g,'recoil-cover',new THREE.CylinderGeometry(.205,.205,.085,20),steel,[.35,.45,.32],[Math.PI/2,0,0]);
  box(g,'engine-base',[.68,.05,.65],[.35,.23,0],frameSteel);
  return g;
}
const studies=[{id:'pilot-parut-kelapa-v1',build:grater,photoIds:['photo-47'],family:'parut-kelapa'},{id:'pilot-kupas-batok-v1',build:shellPeeler,photoIds:['photo-36'],family:'kupas-batok-kelapa'},{id:'pilot-peras-santan-v1',build:milkPress,photoIds:['photo-04'],family:'peras-santan'}];
await mkdir(new URL('../public/models/',import.meta.url),{recursive:true});
const registry=[];
for(const study of studies) {
  const scene=new THREE.Scene();scene.name=study.id;scene.userData={accuracy:'visual-approximation',scaleStatus:'unmeasured',sourcePhotoIds:study.photoIds,scope:'Exterior layout only; not a variant-specific engineering model'};scene.add(study.build());
  const binary=await new GLTFExporter().parseAsync(scene,{binary:true});
  await writeFile(new URL(`../public/models/${study.id}.glb`,import.meta.url),Buffer.from(binary));
  let triangles=0,meshes=0;scene.traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;}});
  registry.push({id:study.id,family:study.family,sourcePhotoIds:study.photoIds,path:`/models/${study.id}.glb`,accuracy:'approximation',measuredDimensions:null,variantIds:[],bytes:binary.byteLength,meshes,triangles});
}
await writeFile(new URL('../models/pilots.json',import.meta.url),JSON.stringify(registry,null,2)+'\n');
console.log(registry.map(r=>`${r.id}: ${r.bytes} bytes, ${r.triangles} triangles`).join('\n'));
