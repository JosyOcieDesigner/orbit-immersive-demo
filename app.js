import * as THREE from './vendor/three.module.js';
const canvas=document.querySelector('#scene'),hero=document.querySelector('#home'),button=document.querySelector('#motion'),pref=matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});}catch{canvas.style.display='none';button.hidden=true;}
if(renderer){
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.z=9;
scene.add(new THREE.HemisphereLight(0xffffff,0x141530,3));
[[0xd7ff2f,65,[-2,4,4]],[0x3434ff,85,[4,-2,3]],[0xffffff,45,[3,5,-3]]].forEach(([c,i,p])=>{const l=new THREE.PointLight(c,i,30);l.position.set(...p);scene.add(l)});
const group=new THREE.Group();scene.add(group);
const core=new THREE.Mesh(new THREE.BoxGeometry(1.8,1.8,1.8),new THREE.MeshStandardMaterial({color:0x15171a,metalness:.65,roughness:.28}));group.add(core);
const outline=new THREE.LineSegments(new THREE.EdgesGeometry(core.geometry),new THREE.LineBasicMaterial({color:0xd7ff2f}));outline.scale.setScalar(1.015);group.add(outline);
for(let i=0;i<5;i++){const mesh=new THREE.Mesh(new THREE.TorusGeometry(1.65+i*.08,.012,8,100),new THREE.MeshStandardMaterial({color:i%2?0x3434ff:0xd7ff2f,emissive:i%2?0x1717d9:0x526a00,metalness:.5,roughness:.3}));mesh.rotation.x=Math.PI/2+.2;mesh.position.y=-1.65-i*.08;group.add(mesh)}
const texCanvas=document.createElement('canvas');texCanvas.width=512;texCanvas.height=512;const ctx=texCanvas.getContext('2d');ctx.fillStyle='#111111';ctx.fillRect(0,0,512,512);ctx.fillStyle='#d7ff2f';ctx.font='900 74px Arial';ctx.textAlign='center';ctx.fillText('CEK',256,235);ctx.fillText('ARTIS',256,320);ctx.font='16px Arial';ctx.fillText('CREATIVE ART SOLUTIONS',256,365);const tex=new THREE.CanvasTexture(texCanvas);tex.colorSpace=THREE.SRGBColorSpace;
const face=new THREE.Mesh(new THREE.PlaneGeometry(1.65,1.65),new THREE.MeshStandardMaterial({map:tex,roughness:.45}));face.position.z=.906;group.add(face);
let paused=pref.matches,dragging=false,last=0,offset=0,t=0,prev=0,visible=true;
function resize(){const w=hero.clientWidth,h=hero.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();const mobile=w<700;group.position.set(mobile?0:2.2,mobile?-2.6:-.1,0);group.scale.setScalar(mobile?.85:1)}resize();addEventListener('resize',resize);
new IntersectionObserver(entries=>visible=entries[0].isIntersecting).observe(hero);
canvas.addEventListener('pointerdown',e=>{dragging=true;last=e.clientX;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(dragging){offset+=(e.clientX-last)*.01;last=e.clientX}});['pointerup','pointercancel'].forEach(event=>canvas.addEventListener(event,()=>dragging=false));
function sync(){button.textContent=paused?'Resume motion ▷':'Pause motion Ⅱ';button.setAttribute('aria-pressed',String(paused));document.querySelectorAll('video').forEach(v=>{if(paused)v.pause();else v.play().catch(()=>{})});document.body.classList.toggle('motion-paused',paused)}button.onclick=()=>{paused=!paused;sync()};pref.addEventListener('change',e=>{paused=e.matches;sync()});sync();
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-prev)/1000,.05);prev=now;if(!visible||document.hidden)return;if(!paused)t+=dt;group.rotation.set(.18+Math.sin(t*.4)*.08,offset+Math.sin(t*.3)*.55+scrollY*.001,.12);renderer.render(scene,camera)}requestAnimationFrame(frame);
}
