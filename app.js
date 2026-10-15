import * as THREE from './vendor/three.module.js';
const canvas=document.querySelector('#scene'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});}catch(e){document.querySelector('#fallback').hidden=false;canvas.hidden=true;document.querySelector('#motion').hidden=true;}
if(renderer){
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.1,100);camera.position.z=9;
scene.add(new THREE.HemisphereLight(0xffeedb,0x21170f,3));
[[0xffbb80,45,[-3,4,5]],[0xffffff,65,[4,2,3]],[0xf06a25,35,[0,-3,-2]]].forEach(([color,intensity,pos])=>{const light=new THREE.PointLight(color,intensity,30);light.position.set(...pos);scene.add(light)});
const object=new THREE.Group();scene.add(object);
const material=new THREE.MeshStandardMaterial({color:'#d76c35',metalness:.73,roughness:.26});
const ring=new THREE.Mesh(new THREE.TorusGeometry(1.3,.32,48,140),material);object.add(ring);
const inner=new THREE.Mesh(new THREE.TorusGeometry(1.29,.16,32,120),new THREE.MeshStandardMaterial({color:0x241914,metalness:.6,roughness:.45}));inner.position.z=-.23;object.add(inner);
const grooveMat=new THREE.MeshStandardMaterial({color:0x7c3e22,metalness:.8,roughness:.4});
[-.16,.16].forEach(z=>{const seam=new THREE.Mesh(new THREE.TorusGeometry(1.3,.325,8,140),grooveMat);seam.scale.z=.025;seam.position.z=z;object.add(seam)});
const positions=new Float32Array(160*3);for(let i=0;i<positions.length;i++)positions[i]=(Math.random()-.5)*24;
const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));const stars=new THREE.Points(geo,new THREE.PointsMaterial({color:0xb9a18c,size:.018,transparent:true,opacity:.45}));scene.add(stars);
let paused=reduced.matches,drag=false,lastX=0,rotation=0,targetX=0,targetY=0;
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}resize();addEventListener('resize',resize);
canvas.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);
addEventListener('pointermove',e=>{targetX=(e.clientX/innerWidth-.5)*.22;targetY=(e.clientY/innerHeight-.5)*.15;if(drag){rotation+=(e.clientX-lastX)*.008;lastX=e.clientX}});
const motion=document.querySelector('#motion');function updatePause(){motion.textContent=paused?'Putar animasi ▷':'Jeda animasi Ⅱ';motion.setAttribute('aria-pressed',String(paused))}updatePause();motion.onclick=()=>{paused=!paused;updatePause()};reduced.addEventListener('change',e=>{paused=e.matches;updatePause()});
document.querySelector('#wire').onclick=e=>{material.wireframe=!material.wireframe;e.currentTarget.setAttribute('aria-pressed',String(material.wireframe));e.currentTarget.textContent=material.wireframe?'Kembali ke permukaan ↗':'Lihat struktur ↗'};
document.querySelectorAll('[data-color]').forEach((button,i)=>button.onclick=()=>{material.color.set(button.dataset.color);document.querySelectorAll('[data-color]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button))});document.querySelector('#color-label').textContent=['01 — COPPER','02 — SILVER','03 — SAGE'][i]});document.querySelector('#reset').onclick=()=>rotation=0;
let t=0,previous=0;function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-previous)/1000,.05);previous=now;if(!paused&&!document.hidden)t+=dt;
const progress=scrollY/innerHeight,mobile=innerWidth<700;
const x=mobile?0:progress<1?1.8:progress<2?1.8-(progress-1)*3.7:progress<3?-1.9+(progress-2)*3.7:1.8;
object.position.x=THREE.MathUtils.lerp(object.position.x,x,.045);object.position.y=mobile?-1.75:progress<.7?-.75:0;object.position.y+=Math.sin(t*.8)*.06;
object.rotation.set(.3+targetY+Math.sin(t*.35)*.12,rotation+progress*1.25+targetX+t*.08,-.2+progress*.13);
const size=mobile?.6:1;object.scale.setScalar(size);object.visible=progress<3.9;stars.rotation.y=t*.009;renderer.render(scene,camera)}requestAnimationFrame(frame);
}
