import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

const canvas=document.getElementById('scene'),loaderBar=document.getElementById('loader'),dots=[...document.querySelectorAll('.dots button')];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const Q=new URLSearchParams(location.search);
const small=Math.min(innerWidth,innerHeight)<700||matchMedia('(pointer: coarse)').matches;

/* ---------- renderer ---------- */
const renderer=new THREE.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,small?1.5:1.75));
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.9;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate=false; // the room is static: shadows are baked once after everything loads

const scene=new THREE.Scene();scene.background=new THREE.Color(0x0b0a09);
const camera=new THREE.PerspectiveCamera(50,1,.02,60);

/* image-based light: soft studio reflections for glossy plastic, metal and glass */
const pmrem=new THREE.PMREMGenerator(renderer);
scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;
scene.environmentIntensity=.38;

/* ---------- lights placed on the real fixtures in the model ---------- */
const BULB={desk:[-.92,1.38,-1.01],pendant:[.25,2.53,.53],floor:[-1.22,1.58,2.05]};
scene.add(new THREE.HemisphereLight(0xfff1df,0x1c140e,.35));

const pendant=new THREE.SpotLight(0xffe4c8,14,7,1.15,.8,2);
pendant.position.set(...BULB.pendant).add(new THREE.Vector3(0,-.18,0));pendant.target.position.set(.25,0,.3);
pendant.castShadow=true;pendant.shadow.mapSize.set(small?1024:2048,small?1024:2048);pendant.shadow.bias=-.0004;pendant.shadow.normalBias=.02;pendant.shadow.radius=6;pendant.shadow.camera.near=.1;pendant.shadow.camera.far=6;
scene.add(pendant,pendant.target);
const pendantFill=new THREE.PointLight(0xffe0bd,1.4,6,2);pendantFill.position.set(...BULB.pendant).add(new THREE.Vector3(0,-.25,0));scene.add(pendantFill);

const deskLamp=new THREE.SpotLight(0xffd6ae,1.8,3.2,.95,.7,2);
deskLamp.position.set(...BULB.desk).add(new THREE.Vector3(0,-.04,0));deskLamp.target.position.set(-.75,.88,-.75);
deskLamp.castShadow=true;deskLamp.shadow.mapSize.set(1024,1024);deskLamp.shadow.bias=-.0003;deskLamp.shadow.normalBias=.01;deskLamp.shadow.radius=4;deskLamp.shadow.camera.near=.03;deskLamp.shadow.camera.far=3;
scene.add(deskLamp,deskLamp.target);

const floorLamp=new THREE.PointLight(0xffd2a6,2.6,4.5,2);floorLamp.position.set(...BULB.floor);scene.add(floorLamp);
const screenSpill=new THREE.PointLight(0xc9d8ff,.5,1.8,2);screenSpill.position.set(.22,1.25,-1.0);scene.add(screenSpill);
const neonSpill=new THREE.PointLight(0xff3df0,1.2,2.2,2);neonSpill.position.set(.4,1.65,2.35);scene.add(neonSpill);
const pcSpill=new THREE.PointLight(0xff3a2a,.5,1.2,2);pcSpill.position.set(1.62,.4,-1.0);scene.add(pcSpill);

/* ---------- triplanar detail: real surface texture without touching geometry or UVs ---------- */
const texLoader=new THREE.TextureLoader(),TEX={};
const tex=n=>TEX[n]||(TEX[n]=texLoader.load(`textures/${n}.webp`,t=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.NoColorSpace;t.anisotropy=8}));
function detail(mat,name,{scale=4,albedo=1,bump=1,rough=1}={}){
  const u={uDetail:{value:tex(name)},uScale:{value:scale},uAlb:{value:albedo},uBump:{value:bump*(Q.has('bump')?+Q.get('bump'):.004)},uRough:{value:rough}};
  mat.onBeforeCompile=sh=>{
    Object.assign(sh.uniforms,u);
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vTriPos;varying vec3 vTriNrm;')
      .replace('#include <project_vertex>','#include <project_vertex>\nvTriPos=(modelMatrix*vec4(transformed,1.)).xyz;vTriNrm=normalize(mat3(modelMatrix)*objectNormal);');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>',`#include <common>
varying vec3 vTriPos;varying vec3 vTriNrm;uniform sampler2D uDetail;uniform float uScale,uAlb,uBump,uRough;vec4 triD;
vec4 tri(){vec3 w=pow(abs(normalize(vTriNrm)),vec3(4.));w/=w.x+w.y+w.z;vec3 p=vTriPos*uScale;
 return texture2D(uDetail,p.zy)*w.x+texture2D(uDetail,p.xz)*w.y+texture2D(uDetail,p.xy)*w.z;}
vec3 triBump(vec3 pos,vec3 n,float h){vec3 sx=dFdx(pos),sy=dFdy(pos),r1=cross(sy,n),r2=cross(n,sx);float det=dot(sx,r1);
 vec2 dh=vec2(dFdx(h),dFdy(h))*uBump;vec3 g=sign(det)*(dh.x*r1+dh.y*r2);return normalize(abs(det)*n-g);}`)
      .replace('#include <map_fragment>','#include <map_fragment>\ntriD=tri();diffuseColor.rgb*=mix(1.,triD.r*1.06,uAlb);')
      .replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor*mix(1.,triD.b*2.,uRough),.04,1.);')
      .replace('#include <normal_fragment_maps>','#include <normal_fragment_maps>\nnormal=triBump(-vViewPosition,normal,triD.g);');
  };
  mat.customProgramCacheKey=()=>'tri';
}

/* ---------- per-material finishing (name → real-world surface) ---------- */
const C=c=>new THREE.Color(c);
const LOOK=[
  // floors & wood
  [/^floor_wood$/,      {tex:'floorgrain',scale:.6,bump:1.0,rough:.9,set:{roughness:.42,color:C(0x5e4636)},clearcoat:.15}],
  [/^desk_wood$/,       {tex:'veneer',scale:2.5,albedo:.25,bump:.25,rough:.6,set:{roughness:.36}}],
  [/^door(\.001)?$/,    {tex:'veneer',scale:2.2,bump:.8,set:{roughness:.55}}],
  [/^coffee_table$/,    {tex:'veneer',scale:3,albedo:.6,bump:.3,set:{roughness:.28},clearcoat:.4}],
  // walls
  [/^walls/,            {tex:'plaster',scale:1.4,bump:1.5,rough:.6,set:{roughness:.92}}],
  // soft goods
  [/^sofa$/,            {tex:'fabric',scale:7,bump:1.2,set:{roughness:.95},sheen:[.6,.75,0x262626]}],
  [/^material$/,        {tex:'fabric',scale:7,bump:1.0,set:{roughness:.9},sheen:[.5,.75,0x2a2a2a]}],
  [/^Material\.006$/,   {tex:'cloth',scale:5,bump:1.6,set:{roughness:1},sheen:[.5,.9,0x3a2a20]}],   // rug
  [/^Material\.021$/,   {tex:'cloth',scale:6,bump:.8,set:{roughness:.85}}],                         // floor mat
  [/^mausepad$/,        {tex:'cloth',scale:14,bump:.9,set:{roughness:.92},sheen:[.4,.8,0x444444]}],
  [/^banner/,           {tex:'cloth',scale:8,bump:1.0,set:{roughness:.95},sheen:[.5,.8,0xffffff]}],
  // metals
  [/^lamba$|^clapper_3$|^material_63$/, {tex:'brushed',scale:6,bump:.4,set:{metalness:1,roughness:.32}}],
  [/^lamba\.2$|^lambaa$/,{tex:'brushed',scale:6,bump:.3,set:{metalness:.85,roughness:.38,color:C(0x1a1a1a)}}],
  [/^Material\.022$/,   {tex:'brushed',scale:6,bump:.3,set:{metalness:1,roughness:.3}}],            // desk legs
  [/^monitor_bar$/,     {tex:'brushed',scale:5,bump:.3,set:{metalness:.9,roughness:.34}}],
  [/^case$/,            {tex:'plastic',scale:8,bump:.2,set:{metalness:.55,roughness:.32}}],
  [/^case_\.001$/,      {tex:'brushed',scale:6,bump:.3,set:{metalness:.8,roughness:.4}}],
  // plastics & electronics
  [/^04_-_CoronaMtl$|^Material\.019$/, {tex:'plastic',scale:20,bump:.3,set:{roughness:.55}}],      // keyboard
  [/^mouse$|^Material_1233$/,          {tex:'plastic',scale:20,bump:.15,set:{roughness:.3},clearcoat:.5}],
  [/^monitor_1$|^Material\.017$/,      {tex:'plastic',scale:12,bump:.2,set:{roughness:.42}}],
  [/^speaker_2$|^Material\.018$|^switch$|^trash/, {tex:'plastic',scale:12,bump:.25,set:{roughness:.45}}],
  [/^headphone/,        {tex:'plastic',scale:16,bump:.3,set:{roughness:.5}}],
  [/^frame$/,           {tex:'plastic',scale:10,bump:.15,set:{roughness:.3},clearcoat:.4}],
  [/^frame\.001$/,      {tex:'veneer',scale:4,bump:.5,set:{roughness:.6}}],
  [/^cable/,            {tex:'plastic',scale:30,bump:.2,set:{roughness:.6}}],
  [/^drink/,            {tex:'paper',scale:20,bump:.2,set:{roughness:.55}}],
  [/^coffee$/,          {set:{roughness:.08},clearcoat:1}],
  [/^clapper/,          {tex:'plastic',scale:12,bump:.2,set:{roughness:.45}}],
  // paper goods
  [/^book|^box_|^tape$|^Material\.003$/, {tex:'paper',scale:10,bump:.8,set:{roughness:.85}}],
  [/^paper|^canvas$/,   {tex:'paper',scale:8,bump:1.2,set:{roughness:.9}}],
  [/^fear_the_dark|^obey_the_god|^mad_max/, {tex:'paper',scale:6,bump:.6,albedo:.4,set:{roughness:.6}}],
];
const GLOW={bulp:[0xfff0d8,14],lamba_effaf:[0xffd9a6,3],neon_sign:[null,7],fan_led:[null,6]};

function finish(m){
  m.envMapIntensity=1;if('ior' in m)m.ior=1.5;if('specularIntensity' in m){m.specularIntensity=1;m.specularColor?.set(0xffffff)}
  const n=m.name;
  if(GLOW[n]){const [c,i]=GLOW[n];if(c)m.emissive.set(c);m.emissiveIntensity=i;m.toneMapped=true;return 'glow'}
  if(/^screen/.test(n)&&m.map){m.emissive.set(0xffffff);m.emissiveMap=m.map;m.emissiveIntensity=.8;m.roughness=.12;if('clearcoat' in m){m.clearcoat=1;m.clearcoatRoughness=.05}return 'screen'}
  if(n==='pc_glass'){m.transparent=true;m.opacity=.18;m.roughness=.04;m.metalness=0;m.color.set(0x0a0a0a);m.depthWrite=false;return 'glass'}
  const rule=LOOK.find(([re])=>re.test(n));
  const cfg=rule?rule[1]:{tex:'plastic',scale:10,bump:.2};
  if(cfg.set)for(const k in cfg.set){if(m[k]?.isColor)m[k].copy(cfg.set[k]);else m[k]=cfg.set[k]}
  m.roughness=Math.max(m.roughness,.08);
  if(cfg.clearcoat&&'clearcoat' in m){m.clearcoat=cfg.clearcoat;m.clearcoatRoughness=.12}
  if(cfg.sheen&&'sheen' in m){m.sheen=cfg.sheen[0];m.sheenRoughness=cfg.sheen[1];m.sheenColor.set(cfg.sheen[2])}
  if(cfg.tex&&!Q.has('notex'))detail(m,cfg.tex,cfg);
  return 'solid';
}

/* ---------- loading ---------- */
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const LAPTOP={x:-.95,z:-.98,width:.36,turn:.3};
const gltf=new GLTFLoader();gltf.setMeshoptDecoder(MeshoptDecoder);
const progress={room:0,laptop:0};let pending=2;
const setBar=()=>{const p=progress.room*.8+progress.laptop*.2;loaderBar.style.width=(p*100)+'%';if(p>=1)loaderBar.classList.add('done')};
const onProg=key=>e=>{if(e.total){progress[key]=e.loaded/e.total;setBar()}};
const loaded=()=>{if(--pending===0)renderer.shadowMap.needsUpdate=true};

gltf.load('models/basement-office.glb',g=>{
  const done=new Map();
  g.scene.traverse(o=>{if(!o.isMesh||!o.material)return;
    const m=o.material;if(!done.has(m))done.set(m,finish(m));
    const kind=done.get(m);
    o.castShadow=kind==='solid'||kind==='screen';o.receiveShadow=kind!=='glow';
    if(m.map)m.map.anisotropy=renderer.capabilities.getMaxAnisotropy();
  });
  scene.add(g.scene);progress.room=1;setBar();loaded();
},onProg('room'),err=>console.error(err));

gltf.load('models/asus-tuf-dash-f15.glb',g=>{
  const lap=g.scene;
  if(g.animations.length)new THREE.AnimationMixer(lap).clipAction(g.animations[0]).play().getMixer().setTime(0);
  lap.traverse(o=>{if(o.isMesh){o.frustumCulled=false;o.castShadow=true;o.receiveShadow=true;
    const m=o.material;if('transmission' in m)m.transmission=0; // avoids a second full-scene render; shape unchanged
    m.envMapIntensity=1.2;}});
  lap.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(lap),size=box.getSize(V(0,0,0)),c=box.getCenter(V(0,0,0));
  const k=LAPTOP.width/size.z,inner=new THREE.Group(),holder=new THREE.Group();
  lap.position.set(-c.x,-box.min.y,-c.z);inner.add(lap);inner.scale.setScalar(k);
  holder.add(inner);holder.rotation.y=-Math.PI/2+LAPTOP.turn;
  holder.position.set(LAPTOP.x,.881,LAPTOP.z);scene.add(holder);
  const spill=new THREE.PointLight(0x9fdcff,.5,.7,2);spill.position.set(LAPTOP.x+.05,1.05,LAPTOP.z+.12);scene.add(spill);
  progress.laptop=1;setBar();loaded();
},onProg('laptop'),err=>console.error(err));

/* ---------- post: ambient occlusion, light bloom, filmic output ---------- */
const rt=new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType,samples:4});
const composer=new EffectComposer(renderer,rt);
composer.addPass(new RenderPass(scene,camera));
let gtao=null;
if(!small&&!Q.has('noao')){gtao=new GTAOPass(scene,camera,1,1);gtao.updateGtaoMaterial({radius:.35,distanceExponent:1.4,thickness:1,scale:1.2,samples:12});gtao.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:6,rings:2,samples:12});gtao.blendIntensity=.9;composer.addPass(gtao)}
const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.35,.35,2.4);composer.addPass(bloom);
composer.addPass(new OutputPass());

/* ---------- camera points: 0 = room, 1 = laptop, 2 = desk ---------- */
const POINTS=[
  {pos:V(2.15,2.15,2.25),look:V(-.2,.8,-.8),fov:50},
  {pos:V(-.78,1.12,-.6), look:V(-.96,.99,-.99),fov:45},
  {pos:V(.22,1.72,.12),  look:V(.18,.92,-1.02),fov:50},
];
let fovScale=1;
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);composer.setSize(w,h);camera.aspect=w/h;fovScale=camera.aspect<1?Math.min(1.75,1.25/camera.aspect*.85):1;camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();

const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function target(){const max=document.documentElement.scrollHeight-innerHeight;const s=Math.max(0,Math.min(1,scrollY/Math.max(1,max)))*(POINTS.length-1);const i=Math.min(POINTS.length-2,Math.floor(s)),t=ease(s-i);
  const a=POINTS[i],b=POINTS[i+1];return {pos:a.pos.clone().lerp(b.pos,t),look:a.look.clone().lerp(b.look,t),fov:a.fov+(b.fov-a.fov)*t,idx:Math.round(s)}}
dots.forEach(d=>d.addEventListener('click',()=>{const max=document.documentElement.scrollHeight-innerHeight;scrollTo({top:max*(+d.dataset.i)/(POINTS.length-1),behavior:reduce?'auto':'smooth'})}));

const mouse=V(0,0,0),mouseS=V(0,0,0);
addEventListener('pointermove',e=>{mouse.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight*2-1),0)});

const cur=target(),pos=cur.pos.clone(),look=cur.look.clone();let fov=cur.fov,last=-1,prev=performance.now(),slow=0;
const right=V(0,0,0),up=V(0,1,0);
function frame(now){
  requestAnimationFrame(frame);
  const dt=Math.min(.05,(now-prev)/1000),raw=(now-prev)/1000;prev=now;
  // if the device can't keep up, drop ambient occlusion first
  if(gtao&&raw>1/28){if(++slow>90){gtao.enabled=false;gtao=null}}else slow=Math.max(0,slow-1);
  const tg=target(),k=reduce?1:1-Math.exp(-dt*5);
  pos.lerp(tg.pos,k);look.lerp(tg.look,k);fov+=(tg.fov-fov)*k;
  mouseS.lerp(mouse,reduce?0:1-Math.exp(-dt*3));
  const amt=.06*pos.distanceTo(look);
  right.subVectors(look,pos).cross(up).normalize();
  camera.position.copy(pos).addScaledVector(right,mouseS.x*amt).addScaledVector(up,mouseS.y*amt*.6);
  camera.fov=fov*fovScale;camera.updateProjectionMatrix();camera.lookAt(look);
  if(tg.idx!==last){last=tg.idx;dots.forEach((d,i)=>d.classList.toggle('on',i===last))}
  if(Q.has('nopost'))renderer.render(scene,camera);else composer.render();
}
requestAnimationFrame(frame);
