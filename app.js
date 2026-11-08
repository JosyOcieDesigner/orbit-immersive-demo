import * as THREE from './vendor/three.module.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
const canvas=document.querySelector('#scene'),hero=document.querySelector('#home'),button=document.querySelector('#motion'),pref=matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});}catch{canvas.style.display='none';button.hidden=true;}
if(renderer){
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.z=9;
const hemi=new THREE.HemisphereLight(0xffffff,0x141530,3);scene.add(hemi);const points=[[0xff7a2e,65,[-2,4,4]],[0x3434ff,85,[4,-2,3]],[0xffffff,45,[3,5,-3]]].map(([c,i,p])=>{const l=new THREE.PointLight(c,i,30);l.position.set(...p);scene.add(l);return l});
const group=new THREE.Group();scene.add(group);
const rings=new THREE.Group();group.add(rings);
for(let i=0;i<5;i++){const mesh=new THREE.Mesh(new THREE.TorusGeometry(1.65+i*.08,.012,8,100),new THREE.MeshStandardMaterial({color:i%2?0x3434ff:0xff7a2e,emissive:i%2?0x1717d9:0x6a2600,metalness:.5,roughness:.3}));mesh.rotation.x=Math.PI/2+.2;mesh.position.y=-1.65-i*.08;rings.add(mesh)}

/* fallback: the original Cek Artis cube, used only if the laptop model fails to load */
function addCube(){const cubeGroup=new THREE.Group();group.add(cubeGroup);
const core=new THREE.Mesh(new THREE.BoxGeometry(1.8,1.8,1.8),new THREE.MeshStandardMaterial({color:0x15171a,metalness:.65,roughness:.28}));cubeGroup.add(core);
const outline=new THREE.LineSegments(new THREE.EdgesGeometry(core.geometry),new THREE.LineBasicMaterial({color:0xff7a2e}));outline.scale.setScalar(1.015);cubeGroup.add(outline);
const texCanvas=document.createElement('canvas');texCanvas.width=512;texCanvas.height=512;const ctx=texCanvas.getContext('2d');ctx.fillStyle='#111111';ctx.fillRect(0,0,512,512);ctx.fillStyle='#ff7a2e';ctx.font='900 74px Arial';ctx.textAlign='center';ctx.fillText('CEK',256,235);ctx.fillText('ARTIS',256,320);ctx.font='16px Arial';ctx.fillText('CREATIVE ART SOLUTIONS',256,365);const tex=new THREE.CanvasTexture(texCanvas);tex.colorSpace=THREE.SRGBColorSpace;
const face=new THREE.Mesh(new THREE.PlaneGeometry(1.65,1.65),new THREE.MeshStandardMaterial({map:tex,roughness:.45}));face.position.z=.906;cubeGroup.add(face);
}
/* ASUS TUF Dash F15 laptop (models/asus-tuf-dash-f15.glb) */
let laptop=null,reveal=0;
new GLTFLoader().load('models/asus-tuf-dash-f15.glb',gltf=>{
  laptop=gltf.scene;
  // the file ships an 8.5s tumbling showcase clip; the hero keeps the open rest pose so drag/scroll stay in control
  if(gltf.animations.length)new THREE.AnimationMixer(laptop).clipAction(gltf.animations[0]).play().getMixer().setTime(0);
  laptop.traverse(o=>{if(o.isMesh)o.frustumCulled=false});
  laptop.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(laptop),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
  const k=2.85/Math.max(size.x,size.z);
  const pivot=new THREE.Group();laptop.position.set(-center.x*k,-box.min.y*k,-center.z*k);laptop.scale.setScalar(k);
  laptop.rotation.y=-Math.PI/2-.4; // model faces +X: turn the screen toward the viewer, angled to the headline
  laptop.position.applyAxisAngle(new THREE.Vector3(0,1,0),laptop.rotation.y);
  pivot.add(laptop);pivot.position.y=-1.15;group.add(pivot);rings.position.y=.3;
  // softer, warmer light so the gunmetal shell and RGB keys read instead of washing out
  hemi.intensity=1.4;points.forEach((l,i)=>l.intensity*=[.45,.3,.5][i]);
  pivot.scale.setScalar(pref.matches?1:.001);laptop.userData.pivot=pivot;
},undefined,()=>addCube());
let paused=pref.matches,dragging=false,last=0,offset=0,t=0,prev=0,visible=true;
function resize(){const w=hero.clientWidth,h=hero.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();const mobile=w<700;const half=camera.position.z*Math.tan(THREE.MathUtils.degToRad(camera.fov/2));group.position.set(mobile?0:2.2,mobile?-half+(210/h)*2*half:-.1,0);group.scale.setScalar(mobile?.62:1)}resize();addEventListener('resize',resize);
new IntersectionObserver(entries=>visible=entries[0].isIntersecting).observe(hero);
canvas.addEventListener('pointerdown',e=>{dragging=true;last=e.clientX;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(dragging){offset+=(e.clientX-last)*.01;last=e.clientX}});['pointerup','pointercancel'].forEach(event=>canvas.addEventListener(event,()=>dragging=false));
function sync(){button.textContent=paused?'Resume motion ▷':'Pause motion Ⅱ';button.setAttribute('aria-pressed',String(paused));document.querySelectorAll('video').forEach(v=>{if(paused)v.pause();else v.play().catch(()=>{})});document.body.classList.toggle('motion-paused',paused)}button.onclick=()=>{paused=!paused;sync()};pref.addEventListener('change',e=>{paused=e.matches;sync()});sync();
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-prev)/1000,.05);prev=now;if(!visible||document.hidden)return;if(!paused)t+=dt;const hs=Math.min(1,scrollY/Math.max(1,innerHeight));group.rotation.set(.18+Math.sin(t*.4)*.08+hs*1.1,offset+Math.sin(t*.3)*.55+scrollY*.0016,.12+hs*.35);group.position.z=-hs*5;if(laptop){const p=laptop.userData.pivot;if(reveal<1){reveal=Math.min(1,reveal+dt*1.6);const e=1-Math.pow(1-reveal,3);p.scale.setScalar(Math.max(.001,e))}}renderer.render(scene,camera)}requestAnimationFrame(frame);
}
