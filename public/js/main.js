/* ===== CURSOR ===== */
const cursor = document.createElement('div');
cursor.id = 'cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button, .service-card, .work-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
});

/* ===== NAV SCROLL ===== */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ===== REVEAL ON SCROLL ===== */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.12 });
reveals.forEach(r => revealObs.observe(r));

/* ===== HERO THREE.JS ===== */
(function initHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 200);
  camera.position.set(0, 0, 14);

  // Wireframe torus knot
  const knotGeo = new THREE.TorusKnotGeometry(3.5, 0.9, 180, 24, 2, 3);
  const knotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, opacity: 0.12, transparent: true });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  scene.add(knot);

  // Inner solid knot
  const knotGeo2 = new THREE.TorusKnotGeometry(3.5, 0.9, 80, 12, 2, 3);
  const knotMat2 = new THREE.MeshBasicMaterial({ color: 0x111111, wireframe: false });
  const knot2 = new THREE.Mesh(knotGeo2, knotMat2);
  scene.add(knot2);

  // Particle system
  const particleCount = 600;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const r = 6 + Math.random() * 6;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.5 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Ring
  const ringGeo = new THREE.TorusGeometry(7, 0.03, 2, 100);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.5;
  scene.add(ring);

  let mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.004;
    knot.rotation.x = t * 0.3 + mouse.y * 0.2;
    knot.rotation.y = t * 0.5 + mouse.x * 0.2;
    knot2.rotation.x = knot.rotation.x;
    knot2.rotation.y = knot.rotation.y;
    particles.rotation.y = t * 0.1;
    ring.rotation.z = t * 0.08;
    renderer.render(scene, camera);
  }
  animate();
})();

/* ===== CTA THREE.JS ===== */
(function initCta() {
  const canvas = document.getElementById('cta-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 200);
  camera.position.z = 20;

  const gridHelper = new THREE.GridHelper(60, 30, 0x222222, 0x222222);
  gridHelper.position.y = -5;
  scene.add(gridHelper);

  const spheres = [];
  for (let i = 0; i < 8; i++) {
    const geo = new THREE.IcosahedronGeometry(0.5 + Math.random() * 1.2, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.15 + Math.random() * 0.2 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 10);
    mesh.userData.speed = 0.003 + Math.random() * 0.005;
    mesh.userData.offset = Math.random() * Math.PI * 2;
    scene.add(mesh);
    spheres.push(mesh);
  }

  window.addEventListener('resize', () => {
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    spheres.forEach(s => {
      s.rotation.x += s.userData.speed;
      s.rotation.y += s.userData.speed * 0.7;
      s.position.y = Math.sin(t + s.userData.offset) * 3;
    });
    renderer.render(scene, camera);
  }
  animate();
})();

/* ===== WORK MINI CANVASES ===== */
document.querySelectorAll('.work-item-canvas, .work-page-canvas').forEach((canvas, idx) => {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(1);
  renderer.setSize(canvas.offsetWidth || 400, canvas.offsetHeight || 300);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111);
  const camera = new THREE.PerspectiveCamera(70, (canvas.offsetWidth || 400) / (canvas.offsetHeight || 300), 0.1, 100);
  camera.position.z = 5;

  const configs = [
    { geo: new THREE.OctahedronGeometry(1.4, 2), col: 0xffffff, wireframe: true },
    { geo: new THREE.TorusGeometry(1.2, 0.4, 16, 50), col: 0xeeeeee, wireframe: true },
    { geo: new THREE.IcosahedronGeometry(1.3, 1), col: 0xdddddd, wireframe: true },
    { geo: new THREE.BoxGeometry(1.8, 1.8, 1.8, 4, 4, 4), col: 0xffffff, wireframe: true },
  ];
  const cfg = configs[idx % configs.length];
  const mat = new THREE.MeshBasicMaterial({ color: cfg.col, wireframe: cfg.wireframe, transparent: true, opacity: 0.6 });
  const mesh = new THREE.Mesh(cfg.geo, mat);
  scene.add(mesh);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;
    mesh.rotation.x = t * 0.5;
    mesh.rotation.y = t * 0.7;
    renderer.render(scene, camera);
  }
  animate();
});

/* ===== SERVICES PAGE CANVAS ===== */
(function initServicesHero() {
  const canvas = document.getElementById('services-page-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 200);
  camera.position.z = 12;

  const count = 200;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 30;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.4 });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.003;
    pts.rotation.y = t * 0.2;
    renderer.render(scene, camera);
  }
  animate();
  window.addEventListener('resize', () => {
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
  });
})();
