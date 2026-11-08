import * as THREE from './vendor/three.module.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {MeshoptDecoder} from './vendor/meshopt_decoder.module.js';

const canvas=document.getElementById('scene'),loaderBar=document.getElementById('loader'),dots=[...document.querySelectorAll('.dots button')];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.92;
renderer.shadowMap.enabled=false;

const scene=new THREE.Scene();scene.background=new THREE.Color(0x090909);
const camera=new THREE.PerspectiveCamera(50,1,.02,60);

/* light: soft ambient + warm desk lamp + cool monitor glow */
scene.add(new THREE.HemisphereLight(0xfff4e6,0x2a2018,2.2));
const lamp=new THREE.PointLight(0xffb36b,3.5,4,1.6);lamp.position.set(-1.05,1.75,-1.05);scene.add(lamp);
const glow=new THREE.PointLight(0x9fb8ff,2,3,1.8);glow.position.set(.2,1.3,-.9);scene.add(glow);
const fill=new THREE.DirectionalLight(0xffffff,1.2);fill.position.set(2,3,3);scene.add(fill);

/* camera points: 0 = room overview, 1 = laptop, 2 = desk */
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const POINTS=[
  {pos:V(2.15,2.15,2.25),look:V(-.2,.8,-.8),fov:50},
  {pos:V(-.78,1.12,-.6), look:V(-.96,.99,-.99),fov:45},
  {pos:V(.22,1.72,.12), look:V(.18,.92,-1.02),fov:50},
];
const LAPTOP={x:-.95,z:-.98,width:.36,turn:.3};

const gltf=new GLTFLoader();gltf.setMeshoptDecoder(MeshoptDecoder);
const progress={room:0,laptop:0};
const setBar=()=>{const p=progress.room*.8+progress.laptop*.2;loaderBar.style.width=(p*100)+'%';if(p>=1)loaderBar.classList.add('done')};
const onProg=key=>e=>{if(e.total){progress[key]=e.loaded/e.total;setBar()}};

gltf.load('models/basement-office.glb',g=>{
  g.scene.traverse(o=>{if(o.isMesh&&o.material){
    const m=o.material;if(m.map)m.map.anisotropy=renderer.capabilities.getMaxAnisotropy();
    // the two monitor screens glow a little so the desk reads as "on"
    if(/^screen/.test(m.name)&&m.map){m.emissive=new THREE.Color(0xffffff);m.emissiveMap=m.map;m.emissiveIntensity=.6}
  }});
  scene.add(g.scene);progress.room=1;setBar();
},onProg('room'),err=>console.error(err));

gltf.load('models/asus-tuf-dash-f15.glb',g=>{
  const lap=g.scene;
  if(g.animations.length)new THREE.AnimationMixer(lap).clipAction(g.animations[0]).play().getMixer().setTime(0);
  lap.traverse(o=>{if(o.isMesh)o.frustumCulled=false});
  lap.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(lap),size=box.getSize(V(0,0,0)),c=box.getCenter(V(0,0,0));
  const k=LAPTOP.width/size.z,inner=new THREE.Group(),holder=new THREE.Group();
  lap.position.set(-c.x,-box.min.y,-c.z);inner.add(lap);inner.scale.setScalar(k);
  holder.add(inner);holder.rotation.y=-Math.PI/2+LAPTOP.turn; // model faces +X → face the room
  holder.position.set(LAPTOP.x,.881,LAPTOP.z);scene.add(holder);
  // laptop screen light spilling on the desk
  const spill=new THREE.PointLight(0x7fd8ff,.6,.8,2);spill.position.set(LAPTOP.x+.05,1.05,LAPTOP.z+.12);scene.add(spill);
  progress.laptop=1;setBar();
},onProg('laptop'),err=>console.error(err));

/* sizing: widen fov on portrait screens so the scene stays framed */
let fovScale=1;
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;fovScale=camera.aspect<1?Math.min(1.75,1.25/camera.aspect*.85):1;camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();

/* scroll → camera point (smoothstep between points, damped) */
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function target(){const max=document.documentElement.scrollHeight-innerHeight;const s=Math.max(0,Math.min(1,scrollY/Math.max(1,max)))*(POINTS.length-1);const i=Math.min(POINTS.length-2,Math.floor(s)),t=ease(s-i);
  const a=POINTS[i],b=POINTS[i+1];return {pos:a.pos.clone().lerp(b.pos,t),look:a.look.clone().lerp(b.look,t),fov:a.fov+(b.fov-a.fov)*t,idx:Math.round(s)}}
dots.forEach(d=>d.addEventListener('click',()=>{const max=document.documentElement.scrollHeight-innerHeight;scrollTo({top:max*(+d.dataset.i)/(POINTS.length-1),behavior:reduce?'auto':'smooth'})}));

/* pointer parallax keeps the page feeling 3D while idle */
const mouse=V(0,0,0),mouseS=V(0,0,0);
addEventListener('pointermove',e=>{mouse.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight*2-1),0)});

const cur=target(),pos=cur.pos.clone(),look=cur.look.clone();let fov=cur.fov,last=-1,prev=performance.now();
const right=V(0,0,0),up=V(0,1,0);
function frame(now){
  requestAnimationFrame(frame);
  const dt=Math.min(.05,(now-prev)/1000);prev=now;
  const tg=target(),k=reduce?1:1-Math.exp(-dt*5);
  pos.lerp(tg.pos,k);look.lerp(tg.look,k);fov+=(tg.fov-fov)*k;
  mouseS.lerp(mouse,reduce?0:1-Math.exp(-dt*3));
  // parallax shrinks as we get closer to a subject
  const dist=pos.distanceTo(look),amt=.06*dist;
  right.subVectors(look,pos).cross(up).normalize();
  camera.position.copy(pos).addScaledVector(right,mouseS.x*amt).addScaledVector(up,mouseS.y*amt*.6);
  camera.fov=fov*fovScale;camera.updateProjectionMatrix();camera.lookAt(look);
  if(tg.idx!==last){last=tg.idx;dots.forEach((d,i)=>d.classList.toggle('on',i===last))}
  renderer.render(scene,camera);
}
requestAnimationFrame(frame);
