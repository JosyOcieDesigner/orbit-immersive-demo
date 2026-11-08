import * as THREE from './vendor/three.module.js';

/* ==========================================================
   CEK ARTIS — DEPTH LAYER
   Code-only 3D upgrades for the main page:
   1. 3D crossing ribbons
   2. Section titles that flip up in 3D as they enter
   3. Pointer tilt on cards (services, stats, works, journey)
   4. Client logos on two counter-rotating 3D rings (drag to spin)
   5. Particle "CEK ARTIS" that assembles behind the CTA
   ========================================================== */

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const root = document.documentElement;
root.classList.add('depth-ready');

let motionPaused = false;
const motionBtn = document.getElementById('motion');
if (motionBtn) {
  motionBtn.addEventListener('click', () => {
    // the existing toggle flips aria-pressed; read it on the next tick
    setTimeout(() => { motionPaused = motionBtn.getAttribute('aria-pressed') === 'true'; }, 0);
  });
}

/* ---------- 1. ribbons ---------- */
(function ribbons() {
  const ribbon = document.querySelector('.ribbon');
  if (!ribbon) return;
  const text = ribbon.textContent.replace(/\s+/g, ' ').trim();
  const wrap = document.createElement('div');
  wrap.className = 'ribbon-3d';
  ribbon.replaceWith(wrap);
  const make = (cls, dir) => {
    const r = document.createElement('div');
    r.className = `ribbon-band ${cls}`;
    if (cls !== 'band-main') r.setAttribute('aria-hidden', 'true');
    const track = document.createElement('div');
    track.className = 'ribbon-track';
    track.style.setProperty('--dir', dir);
    const chunk = `${text} ✦ `;
    track.innerHTML = `<span>${chunk.repeat(3)}</span><span aria-hidden="true">${chunk.repeat(3)}</span>`;
    r.appendChild(track);
    return r;
  };
  wrap.append(make('band-back', 'normal'), make('band-main', 'reverse'));
})();

/* ---------- 2. 3D title reveal ---------- */
(function titles() {
  const titles = document.querySelectorAll(
    '#showreel h2, #creativeJourney .journey-title, #services .clients-title, #work .section-head h2, #contact h2'
  );
  if (reduce || !('IntersectionObserver' in window)) return;
  titles.forEach(t => t.classList.add('flip-title'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.25 });
  titles.forEach(t => io.observe(t));
})();

/* ---------- 2b. scroll-driven 3D ---------- */
(function scrollDepth() {
  if (reduce) return;
  const small = () => innerWidth < 700;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  // whole sections tilt up from the floor as they arrive, and recede as they leave
  // re-resolved on every update: other scripts rebuild some sections after load
  const SECTION_IDS = ['#showreel', '#creativeJourney', '#services', '#work', '#contact'];
  const getSections = () => SECTION_IDS.map(s => document.querySelector(s)).filter(Boolean)
    .map(s => (s.classList.add('depth-section'), s));

  // hero copy falls back into depth as you scroll away
  const heroCopy = document.querySelector('#home .hero-copy');
  const bands = document.querySelector('.ribbon-3d');

  // items that rise out of depth one by one
  const itemSel = [
    '#showreel article', '#showreel .showreel-stats > div', '#showreel .featured-project, #showreel .showreel-object-scene',
    '#creativeJourney .journey-image', '#creativeJourney .journey-step', '#creativeJourney .journey-bottom',
    '#clientsLogoGrid .cl-row', '.wk-card', '.wk-filters', '#contact .cta-actions, #contact .btn'
  ].join(',');
  let items = [];
  const collect = () => {
    items = [...document.querySelectorAll(itemSel)].filter(el => !el.closest('.wk-card[hidden]'));
    items.forEach((el, i) => {
      el.classList.add('depth-item');
      if (!el.dataset.side) el.dataset.side = String(i % 2 ? 1 : -1);
    });
  };
  collect();
  const grid = document.getElementById('videoGrid');
  if (grid) new MutationObserver(collect).observe(grid, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });

  let ticking = false;
  function update() {
    ticking = false;
    const vh = innerHeight, k = small() ? 0.55 : 1;
    const sections = getSections();
    if (items.some(el => !el.isConnected) || !document.querySelector('#creativeJourney .depth-item')) collect();

    // sections: enter (0→1) while the top travels from 100% to 45% of the viewport,
    // leave (0→1) while the bottom travels from 35% to -10%
    sections.forEach(sec => {
      const r = sec.getBoundingClientRect();
      const enter = clamp((vh - r.top) / (vh * 0.55));
      const leave = clamp((vh * 0.35 - r.bottom) / (vh * 0.45));
      const e = 1 - enter;
      sec.style.setProperty('--sec-rx', `${(e * 16 - leave * 10) * k}deg`);
      sec.style.setProperty('--sec-z', `${(-e * 160 - leave * 120) * k}px`);
      sec.style.setProperty('--sec-o', (1 - e * 0.55 - leave * 0.35).toFixed(3));
    });

    if (heroCopy) {
      const p = clamp(scrollY / (vh * 0.9));
      heroCopy.style.setProperty('--hero-rx', `${p * 28 * k}deg`);
      heroCopy.style.setProperty('--hero-z', `${-p * 260 * k}px`);
      heroCopy.style.setProperty('--hero-o', (1 - p * 0.85).toFixed(3));
    }

    if (bands) {
      const r = bands.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh + r.height)) - 0.5; // -0.5 .. 0.5
      bands.style.setProperty('--band-tilt', `${p * 10}deg`);
      bands.style.setProperty('--band-x', `${p * -120}px`);
    }

    // items: rise from depth with a slight swing to alternating sides
    items.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const p = clamp((vh - r.top) / (vh * 0.42));
      const e = 1 - p;
      const side = +el.dataset.side || 1;
      el.style.setProperty('--sy', `${(e * 70 * k).toFixed(1)}px`);
      el.style.setProperty('--sz', `${(-e * 220 * k).toFixed(1)}px`);
      el.style.setProperty('--srx', `${(e * 38 * k).toFixed(2)}deg`);
      el.style.setProperty('--sry', `${(e * 16 * side * k).toFixed(2)}deg`);
      el.style.setProperty('--so', (0.05 + p * 0.95).toFixed(3));
    });
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  update();
})();

/* ---------- 3. pointer tilt ---------- */
function bindTilt(el, max = 8) {
  if (el.dataset.tilt) return;
  el.dataset.tilt = '1';
  el.classList.add('tilt');
  let raf = 0;
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
      el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
    });
  });
  el.addEventListener('pointerleave', () => {
    cancelAnimationFrame(raf);
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  });
}
(function tilts() {
  if (reduce || !finePointer) return;
  const pick = () => {
    document.querySelectorAll('#showreel article').forEach(el => bindTilt(el, 7));
    document.querySelectorAll('#showreel .showreel-stats > div').forEach(el => bindTilt(el, 10));
    document.querySelectorAll('.wk-card').forEach(el => bindTilt(el, 9));
    const img = document.querySelector('#creativeJourney .journey-image');
    if (img) bindTilt(img, 5);
  };
  pick();
  // works cards are rebuilt when filters change
  const grid = document.getElementById('videoGrid');
  if (grid) new MutationObserver(pick).observe(grid, { childList: true });
})();

/* ---------- 4. client logo rings ---------- */
(function clientRings() {
  const grid = document.getElementById('clientsLogoGrid');
  if (!grid) return;
  const items = [...grid.querySelectorAll('.client-logo')];
  if (items.length < 6) return;

  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half)];
  grid.classList.add('is-3d');
  grid.setAttribute('aria-label', 'Client logos — drag to spin');

  const rings = rows.map((list, ri) => {
    const row = document.createElement('div');
    row.className = 'cl-row';
    const ring = document.createElement('div');
    ring.className = 'cl-ring';
    row.appendChild(ring);
    list.forEach(item => ring.appendChild(item));
    grid.appendChild(row);
    return { row, ring, list, rot: ri * 12, speed: ri ? -7 : 7, vel: 0 };
  });

  function layout() {
    const mobile = innerWidth < 700;
    const cell = mobile ? 140 : 215;
    rings.forEach(r => {
      const n = r.list.length;
      r.step = 360 / n;
      r.radius = Math.round((cell * n) / (2 * Math.PI));
      r.ring.style.setProperty('--radius', `${r.radius}px`);
      r.list.forEach((item, i) => {
        item.style.setProperty('--a', `${(i * r.step).toFixed(3)}deg`);
      });
    });
  }
  layout();
  addEventListener('resize', layout);

  // drag / swipe to spin
  let drag = null;
  rings.forEach(r => {
    r.row.addEventListener('pointerdown', e => {
      drag = { r, x: e.clientX, last: e.clientX, t: performance.now() };
      r.row.setPointerCapture(e.pointerId);
      r.row.classList.add('dragging');
    });
    r.row.addEventListener('pointermove', e => {
      if (!drag || drag.r !== r) return;
      const dx = e.clientX - drag.last;
      const now = performance.now();
      r.rot += dx * 0.25;
      r.vel = (dx * 0.25) / Math.max(1, now - drag.t) * 16;
      drag.last = e.clientX; drag.t = now;
    });
    const end = () => { if (drag && drag.r === r) { drag = null; r.row.classList.remove('dragging'); } };
    r.row.addEventListener('pointerup', end);
    r.row.addEventListener('pointercancel', end);
  });

  let hover = false;
  grid.addEventListener('pointerenter', () => (hover = true));
  grid.addEventListener('pointerleave', () => (hover = false));

  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(grid);
  }

  let last = performance.now();
  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (visible) {
      rings.forEach(r => {
        const auto = reduce || motionPaused || hover || drag ? 0 : r.speed;
        r.rot += auto * dt + r.vel;
        r.vel *= 0.92;
        r.ring.style.transform = `translateZ(calc(var(--radius) * -1)) rotateY(${r.rot.toFixed(3)}deg)`;
        // fade & shrink logos turning away
        r.list.forEach((item, i) => {
          const ang = ((i * r.step + r.rot) * Math.PI) / 180;
          const face = (Math.cos(ang) + 1) / 2; // 1 = front, 0 = back
          // show the front arc only; logos fade out as they turn away
          const o = Math.min(1, Math.max(0, (face - 0.28) / 0.42));
          item.style.opacity = o.toFixed(3);
          item.style.visibility = o < 0.01 ? 'hidden' : 'visible';
        });
      });
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* ---------- 5. CTA particle logo ---------- */
(function ctaParticles() {
  const section = document.getElementById('contact');
  if (!section) return;
  let renderer;
  const canvas = document.createElement('canvas');
  canvas.className = 'cta-particles';
  canvas.setAttribute('aria-hidden', 'true');
  section.prepend(canvas);
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  } catch (e) { canvas.remove(); return; }

  const mobile = () => innerWidth < 700;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 14;

  // sample target points from text drawn on a 2D canvas
  function sample() {
    const c = document.createElement('canvas');
    c.width = 900; c.height = 420;
    const g = c.getContext('2d');
    g.fillStyle = '#fff';
    g.font = '900 190px Inter, "Arial Black", Arial, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('CEK', 450, 112);
    g.fillText('ARTIS', 450, 300);
    const data = g.getImageData(0, 0, c.width, c.height).data;
    const pts = [];
    const step = 4;
    for (let y = 0; y < c.height; y += step) {
      for (let x = 0; x < c.width; x += step) {
        if (data[(y * c.width + x) * 4 + 3] > 128) pts.push((x - 450) / 70, -(y - 210) / 70);
      }
    }
    return pts;
  }
  const targets = sample();
  const N = targets.length / 2;
  const pos = new Float32Array(N * 3);
  const start = new Float32Array(N * 3);
  const goal = new Float32Array(N * 3);
  const seed = new Float32Array(N);
  const colors = new Float32Array(N * 3);
  const orange = new THREE.Color(0xff6a1a), white = new THREE.Color(0xffffff), blue = new THREE.Color(0xffc9a6);
  for (let i = 0; i < N; i++) {
    goal[i * 3] = targets[i * 2];
    goal[i * 3 + 1] = targets[i * 2 + 1];
    goal[i * 3 + 2] = (Math.random() - 0.5) * 0.35;
    const r = 6 + Math.random() * 10, a = Math.random() * Math.PI * 2, b = (Math.random() - 0.5) * Math.PI;
    start[i * 3] = Math.cos(a) * Math.cos(b) * r;
    start[i * 3 + 1] = Math.sin(b) * r;
    start[i * 3 + 2] = Math.sin(a) * Math.cos(b) * r - 4;
    seed[i] = Math.random();
    const c = seed[i] < 0.55 ? white : seed[i] < 0.9 ? orange : blue;
    colors.set([c.r, c.g, c.b], i * 3);
  }
  pos.set(start);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const dot = document.createElement('canvas');
  dot.width = dot.height = 64;
  const dg = dot.getContext('2d');
  const grd = dg.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.35, 'rgba(255,255,255,.7)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
  dg.fillStyle = grd; dg.fillRect(0, 0, 64, 64);
  const mat = new THREE.PointsMaterial({
    size: 0.24, vertexColors: true, map: new THREE.CanvasTexture(dot),
    transparent: true, depthWrite: false
  });
  const points = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  function resize() {
    const w = section.clientWidth, h = section.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const m = mobile();
    const unitsPerPx = (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / h;
    // desktop: sit between the headline and the button; mobile: centred, faint
    group.position.x = m ? 0 : (0.685 - 0.5) * w * unitsPerPx;
    group.position.y = 0;
    const fitH = (m ? 0.55 : 0.68) * h * unitsPerPx; // world-units tall
    const fitW = (m ? 0.9 : 0.28) * w * unitsPerPx;
    group.scale.setScalar(Math.min(fitH / 6, fitW / 12.9));
    mat.opacity = m ? 0.3 : 1;
  }
  resize();
  addEventListener('resize', resize);

  let mx = 0, my = 0, smx = 0, smy = 0, prog = reduce ? 1 : 0, active = false, visible = false;
  section.addEventListener('pointermove', e => {
    const r = section.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - 0.5;
    my = (e.clientY - r.top) / r.height - 0.5;
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) active = true;
    }, { threshold: 0.2 }).observe(section);
  } else { visible = active = true; }

  const ease = t => 1 - Math.pow(1 - t, 3);
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (visible) {
      const t = now / 1000;
      if (active && prog < 1) prog = Math.min(1, prog + dt / 2.2);
      smx += (mx - smx) * 0.06; smy += (my - smy) * 0.06;
      const still = reduce || motionPaused;
      for (let i = 0; i < N; i++) {
        const k = ease(Math.min(1, Math.max(0, prog * 1.35 - seed[i] * 0.35)));
        const wob = still ? 0 : 0.04;
        const j = i * 3;
        pos[j] = start[j] + (goal[j] - start[j]) * k + Math.sin(t * 1.3 + seed[i] * 20) * wob;
        pos[j + 1] = start[j + 1] + (goal[j + 1] - start[j + 1]) * k + Math.cos(t * 1.1 + seed[i] * 17) * wob;
        pos[j + 2] = start[j + 2] + (goal[j + 2] - start[j + 2]) * k;
      }
      geo.attributes.position.needsUpdate = true;
      group.rotation.y = smx * 0.5 + (still ? 0 : Math.sin(t * 0.4) * 0.08);
      group.rotation.x = -smy * 0.35;
      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
