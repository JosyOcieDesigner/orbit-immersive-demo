import * as THREE from '../vendor/three.module.js';

/* ============================================================
   CEK ARTIS — THE JOURNEY
   A scroll-driven flight: dawn above the clouds → dive through
   the cloud layer → night city → live stage → brand cube → CTA.
   Every asset is generated procedurally at runtime.
   ============================================================ */

const ACCENT = new THREE.Color(0xff6a1a);
const BLUE = new THREE.Color(0x3d4bff);
const canvas = document.getElementById('world');
const isMobile = Math.min(innerWidth, innerHeight) < 700;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand = mulberry32(7);

function mulberry32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const lerp=(a,b,t)=>a+(b-a)*t;
const clamp01=v=>Math.min(1,Math.max(0,v));
const smooth=(a,b,v)=>{const t=clamp01((v-a)/(b-a));return t*t*(3-2*t)};

let renderer;
try{
  renderer = new THREE.WebGLRenderer({canvas, antialias:!isMobile, powerPreference:'high-performance'});
}catch(e){
  document.body.classList.add('loaded');
  setupPanelsOnly();
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 1.75));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(isMobile ? 62 : 48, innerWidth/innerHeight, 0.5, 2200);
scene.fog = new THREE.Fog(0xf0c8a8, 80, 700);

/* ---------- procedural textures ---------- */
function canvasTex(w,h,draw,opts={}){
  const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;Object.assign(t,opts);return t;
}
const cloudTex = canvasTex(256,256,(g,w,h)=>{
  for(let i=0;i<34;i++){
    const r=20+rand()*60, a=rand()*Math.PI*2, d=rand()*58;
    const x=w/2+Math.cos(a)*d, y=h/2+Math.sin(a)*d*0.62;
    const grd=g.createRadialGradient(x,y,0,x,y,r);
    grd.addColorStop(0,'rgba(255,255,255,0.22)');grd.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle=grd;g.fillRect(0,0,w,h);
  }
});
const glowTex = canvasTex(128,128,(g,w,h)=>{
  const grd=g.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);
  grd.addColorStop(0,'rgba(255,255,255,1)');grd.addColorStop(.25,'rgba(255,255,255,.45)');grd.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=grd;g.fillRect(0,0,w,h);
});
const _unusedWindowTex = canvasTex(64,128,(g,w,h)=>{
  g.fillStyle='#000';g.fillRect(0,0,w,h);
  const cols=['#ffb36b','#ffd9a8','#fff1d6','#ff7a2e','#9fb4ff'];
  for(let y=4;y<h-2;y+=6)for(let x=3;x<w-2;x+=6){
    if(rand()<0.36){g.fillStyle=cols[(rand()*cols.length)|0];g.globalAlpha=.35+rand()*.65;g.fillRect(x,y,3,3)}
  }
  g.globalAlpha=1;
},{magFilter:THREE.NearestFilter});

/* ---------- sky dome ---------- */
const sunDir = new THREE.Vector3(0, 0.06, -1).normalize();
const skyMat = new THREE.ShaderMaterial({
  side:THREE.BackSide, depthWrite:false, fog:false,
  uniforms:{uDay:{value:1}, uSun:{value:sunDir}, uTime:{value:0}},
  vertexShader:`varying vec3 vDir;void main(){vDir=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`
    varying vec3 vDir;uniform float uDay;uniform vec3 uSun;
    void main(){
      vec3 d=normalize(vDir);float h=d.y;
      vec3 dayTop=vec3(.20,.33,.58), dayHor=vec3(1.,.62,.38), dayLow=vec3(.95,.82,.74);
      vec3 day=mix(dayHor,dayTop,smoothstep(-.02,.55,h));
      day=mix(dayLow,day,smoothstep(-.25,.0,h));
      float s=max(dot(d,uSun),0.);
      day+=vec3(1.,.55,.25)*pow(s,6.)*.55+vec3(1.,.85,.6)*pow(s,90.)*1.4;
      vec3 nTop=vec3(.008,.01,.025), nHor=vec3(.16,.06,.04);
      vec3 night=mix(nHor,nTop,smoothstep(-.05,.35,h));
      gl_FragColor=vec4(mix(night,day,uDay),1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`
});
const sky = new THREE.Mesh(new THREE.SphereGeometry(1500,48,24), skyMat);
sky.renderOrder=-10;scene.add(sky);

const sun = new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffd2a0,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,transparent:true}));
sun.scale.set(260,260,1);scene.add(sun);

/* ---------- cloud layer ---------- */
const CLOUD_Y=34;
const clouds=new THREE.Group();scene.add(clouds);
const cloudMats=[];
for(let i=0;i<4;i++){
  const m=new THREE.SpriteMaterial({map:cloudTex,transparent:true,depthWrite:false,opacity:.9});
  cloudMats.push(m);
}
const CLOUD_COUNT=isMobile?260:420;
for(let i=0;i<CLOUD_COUNT;i++){
  const s=new THREE.Sprite(cloudMats[i%4]);
  const x=(rand()-.5)*560, z=-420+rand()*520;
  s.position.set(x, CLOUD_Y+(rand()-.5)*6, z);
  const k=40+rand()*80;s.scale.set(k*2.2,k*.5,1);
  s.userData.drift=(rand()-.5)*1.4;
  clouds.add(s);
}
// a soft cloud floor so the city stays hidden from above
const floorTex=cloudTex.clone();floorTex.wrapS=floorTex.wrapT=THREE.RepeatWrapping;floorTex.repeat.set(14,14);floorTex.needsUpdate=true;
const cloudFloor=new THREE.Mesh(new THREE.PlaneGeometry(1800,1800),new THREE.MeshBasicMaterial({color:0xe2bfa8,map:floorTex,transparent:true,opacity:1,depthWrite:false,side:THREE.DoubleSide}));
cloudFloor.rotation.x=-Math.PI/2;cloudFloor.position.y=CLOUD_Y-3;scene.add(cloudFloor);
const floorUnder=new THREE.Mesh(new THREE.PlaneGeometry(1800,1800),new THREE.MeshBasicMaterial({color:0xb89a8c,fog:true}));
floorUnder.rotation.x=-Math.PI/2;floorUnder.position.y=CLOUD_Y-4;scene.add(floorUnder);

/* ---------- night city ---------- */
const STAGE=new THREE.Vector3(0,0,-160);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(1600,1600),new THREE.MeshStandardMaterial({color:0x07080b,roughness:.85,metalness:.2}));
ground.rotation.x=-Math.PI/2;scene.add(ground);

const BUILD_COUNT=isMobile?900:1600;
const bGeo=new THREE.BoxGeometry(1,1,1);bGeo.translate(0,.5,0);
const bMat=new THREE.MeshStandardMaterial({color:0x0c0d12,roughness:.55,metalness:.4});
bMat.onBeforeCompile=sh=>{
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vWP;varying vec3 vWN;')
    .replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvWP=(modelMatrix*instanceMatrix*vec4(transformed,1.)).xyz;vWN=normalize(mat3(modelMatrix*instanceMatrix)*objectNormal);');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vWP;varying vec3 vWN;float h21(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}')
    .replace('#include <emissivemap_fragment>',`
      if(abs(vWN.y)<.5){
        float u=abs(vWN.x)>.5?vWP.z:vWP.x;
        vec2 g=vec2(u/1.4,vWP.y/2.1);vec2 f=fract(g);vec2 id=floor(g)+floor(vWP.xz/9.)*17.;
        float win=step(.22,f.x)*step(f.x,.78)*step(.28,f.y)*step(f.y,.78)*step(1.,vWP.y);
        float r=h21(id),r2=h21(id+3.7);
        float lit=step(.64,r);
        vec3 wc=r2<.55?vec3(1.,.62,.32):r2<.9?vec3(1.,.88,.7):vec3(.55,.62,1.);
        totalEmissiveRadiance+=wc*win*lit*(1.1+r*0.9);
      }`);
};
const buildings=new THREE.InstancedMesh(bGeo,bMat,BUILD_COUNT);
{
  const m=new THREE.Matrix4(),q=new THREE.Quaternion(),p=new THREE.Vector3(),s=new THREE.Vector3();let n=0;
  while(n<BUILD_COUNT){
    const gx=Math.round((rand()-.5)*44), gz=Math.round(-rand()*46+8);
    const x=gx*12+(rand()-.5)*3, z=gz*12+(rand()-.5)*3;
    const dx=x-STAGE.x, dz=z-STAGE.z;
    if(Math.hypot(dx,dz)<78) continue;
    if(Math.abs(x)<48 && z>STAGE.z) continue; // wide boulevard = camera flight corridor
    const far=Math.hypot(dx,dz);
    const h=Math.min(26,4+Math.pow(rand(),1.8)*(far<200?26:18)+(rand()<.05?8:0));
    p.set(x,0,z);s.set(5+rand()*5,h,5+rand()*5);
    m.compose(p,q,s);buildings.setMatrixAt(n++,m);
  }
}
scene.add(buildings);

// street lights + avenue glow
{
  const pts=[];
  for(let i=-22;i<=22;i++)for(let z=-46;z<=8;z+=.5){pts.push(i*12+6,.6,z*12)}
  for(let j=-46;j<=8;j++)for(let x=-22;x<=22;x+=.5){pts.push(x*12,.6,j*12+6)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
  scene.add(new THREE.Points(g,new THREE.PointsMaterial({map:glowTex,color:0xff8a3a,size:2.6,transparent:true,opacity:.85,depthWrite:false,blending:THREE.AdditiveBlending})));
  const av=[];for(let z=40;z>-80;z-=1.5){av.push(-7,.4,z,7,.4,z)}
  const ag=new THREE.BufferGeometry();ag.setAttribute('position',new THREE.Float32BufferAttribute(av,3));
  scene.add(new THREE.Points(ag,new THREE.PointsMaterial({map:glowTex,color:0xffe0b8,size:3.2,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})));
}

/* ---------- arena + stage ---------- */
const arena=new THREE.Group();arena.position.copy(STAGE);scene.add(arena);
const plaza=new THREE.Mesh(new THREE.CircleGeometry(74,64),new THREE.MeshStandardMaterial({color:0x101116,roughness:.35,metalness:.7}));
plaza.rotation.x=-Math.PI/2;plaza.position.y=.05;arena.add(plaza);
const ring=new THREE.Mesh(new THREE.RingGeometry(73,74.5,96),new THREE.MeshBasicMaterial({color:ACCENT,transparent:true,opacity:.8,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));
ring.rotation.x=-Math.PI/2;ring.position.y=.1;arena.add(ring);

const metal=new THREE.MeshStandardMaterial({color:0x26272c,roughness:.4,metalness:.85});
const deck=new THREE.Mesh(new THREE.BoxGeometry(40,2.4,16),new THREE.MeshStandardMaterial({color:0x0d0d10,roughness:.6,metalness:.5}));
deck.position.set(0,1.2,-6);arena.add(deck);
const deckEdge=new THREE.Mesh(new THREE.BoxGeometry(40.2,.18,.18),new THREE.MeshBasicMaterial({color:ACCENT}));
deckEdge.position.set(0,2.4,2.05);arena.add(deckEdge);

function truss(x,y,z,w,h,d){const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),metal);b.position.set(x,y,z);arena.add(b);return b}
[-19,19].forEach(x=>{[-13,0].forEach(z=>truss(x,12,z,1,24,1))});
truss(0,24,0,39,1,1);truss(0,24,-13,39,1,1);truss(-19,24,-6.5,1,1,13);truss(19,24,-6.5,1,1,13);
truss(0,18.5,-1,37,.5,.5);

// LED wall (animated canvas)
const ledCanvas=document.createElement('canvas');ledCanvas.width=1024;ledCanvas.height=448;
const led=ledCanvas.getContext('2d');
const ledTex=new THREE.CanvasTexture(ledCanvas);ledTex.colorSpace=THREE.SRGBColorSpace;
const ledWall=new THREE.Mesh(new THREE.PlaneGeometry(32,14),new THREE.MeshBasicMaterial({map:ledTex,toneMapped:false}));
ledWall.position.set(0,11,-12.4);arena.add(ledWall);
const sideMat=new THREE.MeshBasicMaterial({map:ledTex,toneMapped:false});
[-1,1].forEach(sd=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(7,14),sideMat);p.position.set(sd*23.5,11,-9);p.rotation.y=-sd*.45;arena.add(p)});
const ledGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xff7a33,blending:THREE.AdditiveBlending,transparent:true,opacity:.55,depthWrite:false}));
ledGlow.scale.set(80,46,1);ledGlow.position.set(0,11,-10);arena.add(ledGlow);

let ledLabel='CEK ARTIS';
function drawLED(t){
  const W=ledCanvas.width,H=ledCanvas.height;
  const g=led.createLinearGradient(0,0,W,H);
  g.addColorStop(0,'#120603');g.addColorStop(.5,'#2a0d02');g.addColorStop(1,'#07081a');
  led.fillStyle=g;led.fillRect(0,0,W,H);
  for(let i=0;i<14;i++){
    const x=((i*97+t*120)%(W+200))-100, hh=H*(.25+.6*Math.abs(Math.sin(t*1.7+i)));
    led.fillStyle=i%3?'rgba(255,106,26,.28)':'rgba(70,90,255,.25)';
    led.fillRect(x,H-hh,38,hh);
  }
  led.save();led.translate(W/2,H/2);
  led.fillStyle='#fff';led.font='900 150px Inter, Arial Black, Arial, sans-serif';led.textAlign='center';led.textBaseline='middle';
  led.shadowColor='#ff6a1a';led.shadowBlur=40;
  led.fillText(ledLabel,0,0);led.restore();
  led.fillStyle='rgba(0,0,0,.28)';for(let y=0;y<H;y+=4)led.fillRect(0,y,W,1.4);
  ledTex.needsUpdate=true;
}

// volumetric beams
const beamMat=c=>new THREE.ShaderMaterial({
  transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
  uniforms:{uColor:{value:c},uI:{value:1}},
  vertexShader:`varying float vY;varying vec3 vN;varying vec3 vV;void main(){vY=uv.y;vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
  fragmentShader:`uniform vec3 uColor;uniform float uI;varying float vY;varying vec3 vN;varying vec3 vV;void main(){float edge=pow(abs(dot(vN,vV)),1.6);float a=pow(vY,1.4)*edge*.28*uI;gl_FragColor=vec4(uColor*a,a);}`
});
const beams=[];
const beamGeo=new THREE.CylinderGeometry(.35,7,60,32,1,true);beamGeo.translate(0,-30,0);
for(let i=0;i<10;i++){
  const c=i%3===1?new THREE.Color(0xffffff):i%3===2?BLUE.clone():ACCENT.clone();
  const pivot=new THREE.Group();pivot.position.set(-17+i*(34/9),23.3,0);
  const b=new THREE.Mesh(beamGeo,beamMat(c));pivot.add(b);arena.add(pivot);
  const head=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:c,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
  head.scale.set(4,4,1);pivot.add(head);
  beams.push({pivot,mat:b.material,phase:i*.7});
}
// sky searchlights
const search=[];
const sGeo=new THREE.CylinderGeometry(.5,9,260,24,1,true);sGeo.translate(0,-130,0);
for(let i=0;i<4;i++){
  const m=beamMat(i%2?new THREE.Color(0xffd9b0):ACCENT.clone());
  const s=new THREE.Mesh(sGeo,m);s.position.set((i<2?-1:1)*(30+(i%2)*14),0,-20+(i%2)*10);arena.add(s);
  search.push({mesh:s,mat:m,phase:i*1.3});
}
// lasers
const lasers=[];
const lGeo=new THREE.CylinderGeometry(.06,.06,140,6,1,true);lGeo.translate(0,70,0);
for(let i=0;i<12;i++){
  const m=new THREE.MeshBasicMaterial({color:i%2?0xff6a1a:0x6b7bff,transparent:true,opacity:.0,blending:THREE.AdditiveBlending,depthWrite:false});
  const l=new THREE.Mesh(lGeo,m);l.position.set(0,20,-8);arena.add(l);lasers.push({l,m,phase:i/12*Math.PI*2});
}

// crowd
const CROWD=isMobile?900:1800;
const crowdGeo=new THREE.CapsuleGeometry(.32,1.1,2,6);crowdGeo.translate(0,.87,0);
const crowd=new THREE.InstancedMesh(crowdGeo,new THREE.MeshStandardMaterial({color:0x0a0a0c,roughness:.8}),CROWD);
const crowdData=[];
for(let i=0;i<CROWD;i++){
  const x=(rand()-.5)*62, z=6+rand()*48;
  if(Math.abs(x)<2.5&&z>34){i--;continue}
  crowdData.push({x,z,ph:rand()*Math.PI*2,sp:2.5+rand()*3,s:.9+rand()*.25});
}
arena.add(crowd);
const phonePts=[];for(let i=0;i<(isMobile?160:320);i++){const c=crowdData[(rand()*crowdData.length)|0];phonePts.push(c.x+.2,2.3,c.z)}
const phoneGeo=new THREE.BufferGeometry();phoneGeo.setAttribute('position',new THREE.Float32BufferAttribute(phonePts,3));
const phones=new THREE.Points(phoneGeo,new THREE.PointsMaterial({map:glowTex,color:0xfff2dd,size:1.1,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
arena.add(phones);

// stage lights
const stageLights=[
  new THREE.PointLight(0xff6a1a,900,90,1.6),
  new THREE.PointLight(0x4455ff,700,90,1.6),
  new THREE.PointLight(0xffe2c4,500,70,1.6)
];
stageLights[0].position.set(-14,14,6);stageLights[1].position.set(14,14,6);stageLights[2].position.set(0,8,20);
stageLights.forEach(l=>arena.add(l));
scene.add(new THREE.HemisphereLight(0x8899cc,0x110805,.35));
const sunLight=new THREE.DirectionalLight(0xffd0a0,2.2);sunLight.position.set(0,60,-300);scene.add(sunLight);

// floating brand cube (nod to the main site)
const cube=new THREE.Group();cube.position.set(0,40,-8);arena.add(cube);
const cubeMesh=new THREE.Mesh(new THREE.BoxGeometry(10,10,10),new THREE.MeshStandardMaterial({color:0x111216,metalness:.9,roughness:.22,emissive:0x1a0700}));
cube.add(cubeMesh);
const cubeEdges=new THREE.LineSegments(new THREE.EdgesGeometry(cubeMesh.geometry),new THREE.LineBasicMaterial({color:0xff6a1a}));
cubeEdges.scale.setScalar(1.01);cube.add(cubeEdges);
const logoTex=canvasTex(512,512,(g,w,h)=>{g.fillStyle='#0d0d10';g.fillRect(0,0,w,h);g.fillStyle='#ff6a1a';g.font='900 120px Inter, Arial Black, Arial, sans-serif';g.textAlign='center';g.fillText('CEK',w/2,232);g.fillText('ARTIS',w/2,350);g.font='700 30px Arial';g.fillStyle='#fff';g.fillText('CREATIVE ART SOLUTIONS',w/2,420)});
[[0,0,5.02,0],[0,0,-5.02,Math.PI],[5.02,0,0,Math.PI/2],[-5.02,0,0,-Math.PI/2]].forEach(([x,y,z,r])=>{
  const f=new THREE.Mesh(new THREE.PlaneGeometry(9.4,9.4),new THREE.MeshBasicMaterial({map:logoTex,toneMapped:false}));f.position.set(x,y,z);f.rotation.y=r;cube.add(f);
});
const cubeRings=[];
for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(10+i*2.2,.08,8,120),new THREE.MeshBasicMaterial({color:i%2?0x4455ff:0xff6a1a,transparent:true,opacity:.9,blending:THREE.AdditiveBlending}));cube.add(r);cubeRings.push(r)}
const cubeGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xff6a1a,blending:THREE.AdditiveBlending,transparent:true,opacity:.6,depthWrite:false}));
cubeGlow.scale.set(60,60,1);cube.add(cubeGlow);

// haze / embers around arena
{
  const n=isMobile?300:600,pts=[];
  for(let i=0;i<n;i++){pts.push((rand()-.5)*120,rand()*60,(rand()-.5)*120)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
  var embers=new THREE.Points(g,new THREE.PointsMaterial({map:glowTex,color:0xffa060,size:.7,transparent:true,opacity:.7,depthWrite:false,blending:THREE.AdditiveBlending}));
  arena.add(embers);
}

/* ---------- camera path ---------- */
const S=STAGE;
const keys=[
  [0.00,[0,64,70],[0,58,-300]],
  [0.10,[0,60,25],[0,54,-300]],
  [0.21,[0,50,-10],[0,8,-150]],
  [0.30,[0,26,-40],[0,0,-160]],
  [0.40,[24,20,-58],[0,4,-160]],
  [0.50,[0,8,-88],[0,9,-175]],
  [0.61,[-22,5,-112],[0,8,-170]],
  [0.70,[9,6.5,-120],[0,10,-172]],
  [0.80,[22,17,-114],[10,25,-168]],
  [0.90,[0,15,-104],[0,20,-170]],
  [1.00,[0,11,-98],[0,15,-172]]
];
const posCurve=new THREE.CatmullRomCurve3(keys.map(k=>new THREE.Vector3(...k[1])),false,'centripetal');
const lookCurve=new THREE.CatmullRomCurve3(keys.map(k=>new THREE.Vector3(...k[2])),false,'centripetal');
function pathT(p){
  for(let i=0;i<keys.length-1;i++){
    if(p<=keys[i+1][0]){const u=(p-keys[i][0])/(keys[i+1][0]-keys[i][0]);return (i+u)/(keys.length-1)}
  }
  return 1;
}

/* ---------- HTML overlay ---------- */
const panels=[...document.querySelectorAll('.panel')];
const railItems=[...document.querySelectorAll('#railList li')];
const railFill=document.getElementById('railFill');
const sectionStarts=[0,0.2,0.41,0.6,0.79,0.96];
railItems.forEach((li,i)=>li.addEventListener('click',()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  scrollTo({top:sectionStarts[i]*max,behavior:'smooth'});
}));
function updatePanels(p){
  panels.forEach(el=>{
    const a=+el.dataset.from,b=+el.dataset.to,f=.035;
    const o=Math.min(a<=0?1:smooth(a,a+f,p),b>1?1:1-smooth(b-f,b,p));
    el.style.opacity=o.toFixed(3);
    el.classList.toggle('on',o>.01);
    const y=(1-o)*(p<(a+b)/2?40:-40);
    el.style.translate=`0 ${y.toFixed(1)}px`;
  });
  let active=0;sectionStarts.forEach((s,i)=>{if(p>=s-.05)active=i});
  railItems.forEach((li,i)=>li.classList.toggle('on',i===active));
  railFill.style.height=(p*100).toFixed(2)+'%';
  ledLabel=['CEK ARTIS','CEK ARTIS','CEK ARTIS','LIVE','ACTIVATE',''][active];
}
function setupPanelsOnly(){
  const tick=()=>{const max=document.documentElement.scrollHeight-innerHeight;updatePanelsBasic(max>0?scrollY/max:0);requestAnimationFrame(tick)};
  function updatePanelsBasic(p){document.querySelectorAll('.panel').forEach(el=>{const a=+el.dataset.from,b=+el.dataset.to;const on=p>=a&&p<=b;el.style.opacity=on?1:0;el.classList.toggle('on',on)})}
  tick();
}

/* ---------- loop ---------- */
let target=0,progress=0,mx=0,my=0,smx=0,smy=0;
function readScroll(){const max=document.documentElement.scrollHeight-innerHeight;target=max>0?clamp01(scrollY/max):0}
addEventListener('scroll',readScroll,{passive:true});readScroll();progress=target;
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}
addEventListener('resize',resize);resize();

const tmpM=new THREE.Matrix4(),tmpQ=new THREE.Quaternion(),tmpP=new THREE.Vector3(),tmpS=new THREE.Vector3(),look=new THREE.Vector3();
const fogDay=new THREE.Color(0xf0c8a8),fogNight=new THREE.Color(0x07070c),cDay=new THREE.Color(1,.94,.9),cNight=new THREE.Color(.1,.085,.12);
const clock=new THREE.Clock();let frame=0;

function render(){
  const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;
  progress+= (target-progress)*(reduce?1:1-Math.pow(.0016,dt));
  smx+=(mx-smx)*.05;smy+=(my-smy)*.05;
  const p=progress;

  // camera
  const pt=pathT(p);
  posCurve.getPoint(pt,camera.position);lookCurve.getPoint(pt,look);
  const sway=reduce?0:1;
  camera.position.x+=smx*4*sway+Math.sin(t*.4)*.4*sway;
  camera.position.y+=-smy*2.5*sway+Math.sin(t*.55)*.3*sway;
  camera.lookAt(look);
  if(p>.33&&p<.5)camera.rotateZ(Math.sin((p-.33)/.17*Math.PI)*-.08);

  // altitude-driven atmosphere
  const day=smooth(27,44,camera.position.y);
  const inCloud=1-Math.min(Math.abs(camera.position.y-CLOUD_Y)/9,1);
  skyMat.uniforms.uDay.value=day;
  sky.position.copy(camera.position);
  sun.position.copy(camera.position).addScaledVector(sunDir,900);sun.material.opacity=day;
  scene.fog.color.copy(fogNight).lerp(fogDay,day);
  scene.fog.near=lerp(30,90,day);scene.fog.far=lerp(420,760,day)*(1-inCloud*.8);
  renderer.toneMappingExposure=lerp(1.15,1.0,day);
  const cc=cNight.clone().lerp(cDay,day);
  cloudMats.forEach(m=>{m.color.copy(cc);m.opacity=lerp(.4,.95,day)});
  cloudFloor.material.color.copy(cc).multiplyScalar(.82);
  cloudFloor.material.opacity=day;floorUnder.visible=day>.98;
  cloudFloor.visible=day>.01;
  clouds.visible=camera.position.y>14;
  sunLight.intensity=2.2*day;
  if(!reduce)clouds.children.forEach(s=>{s.position.x+=s.userData.drift*dt;if(s.position.x>290)s.position.x=-290;if(s.position.x<-290)s.position.x=290});

  // stage show intensity grows as we approach
  const show=smooth(.36,.6,p), finale=smooth(.86,.98,p);
  beams.forEach(b=>{
    b.pivot.rotation.z=Math.sin(t*.9+b.phase)*.55;
    b.pivot.rotation.x=-.35+Math.sin(t*.7+b.phase*1.3)*.3;
    b.mat.uniforms.uI.value=show*(.7+.3*Math.sin(t*3+b.phase));
  });
  search.forEach(s=>{
    s.mesh.rotation.z=Math.sin(t*.3+s.phase)*.35;s.mesh.rotation.x=Math.PI+Math.cos(t*.25+s.phase)*.25;
    s.mat.uniforms.uI.value=smooth(.2,.42,p)*.55;
  });
  const laserOn=Math.max(smooth(.6,.68,p)*(1-smooth(.74,.8,p)),finale);
  lasers.forEach(L=>{
    const a=L.phase+t*.6;L.l.rotation.z=Math.sin(a)*1.05;L.l.rotation.x=-.5+Math.cos(a*1.3)*.35;
    L.m.opacity=laserOn*(.55+.45*Math.sin(t*8+L.phase*3));
  });
  stageLights[0].intensity=900*show*(.7+.3*Math.sin(t*2.2));
  stageLights[1].intensity=700*show*(.7+.3*Math.cos(t*1.9));
  ledGlow.material.opacity=.25+.4*show;
  ring.material.opacity=.4+.4*Math.sin(t*1.5)**2;

  // crowd bounce
  const hype=.15+show*.85;
  for(let i=0;i<crowdData.length;i++){
    const c=crowdData[i];
    const jump=Math.max(0,Math.sin(t*c.sp+c.ph))*.45*hype*(reduce?0:1);
    tmpP.set(c.x,jump,c.z);tmpS.setScalar(c.s);tmpM.compose(tmpP,tmpQ,tmpS);crowd.setMatrixAt(i,tmpM);
  }
  crowd.instanceMatrix.needsUpdate=true;
  phones.material.opacity=.4+.6*show;

  // brand cube
  const cubeIn=smooth(.7,.8,p);
  cube.scale.setScalar(.35+.65*cubeIn);
  cube.position.y=lerp(32,27,cubeIn)+Math.sin(t*.8)*.8;
  cube.rotation.y=t*.25+p*4;cube.rotation.x=Math.sin(t*.3)*.15;
  cubeRings.forEach((r,i)=>{r.rotation.x=Math.PI/2+Math.sin(t*.5+i)*.4;r.rotation.y=t*(.2+i*.1)});
  cubeGlow.material.opacity=.25+.45*cubeIn;
  embers.rotation.y=t*.03;

  if(frame++%2===0)drawLED(t);
  updatePanels(p);
  renderer.render(scene,camera);
  requestAnimationFrame(render);
}
drawLED(0);
requestAnimationFrame(()=>{render();setTimeout(()=>document.body.classList.add('loaded'),350)});
