/* ===== CURSOR (minimal, Apple-like) ===== */
const cursorDot = document.createElement('div');
cursorDot.id = 'cursor-dot';
cursorDot.style.cssText = 'position:fixed;width:6px;height:6px;background:#0071e3;border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:width 0.2s,height 0.2s,opacity 0.2s;display:none';
document.body.appendChild(cursorDot);

const cursorRing = document.createElement('div');
cursorRing.id = 'cursor-ring';
cursorRing.style.cssText = 'position:fixed;width:32px;height:32px;border:1px solid rgba(0,113,227,0.25);border-radius:50%;pointer-events:none;z-index:9997;transform:translate(-50%,-50%);transition:width 0.3s,height 0.3s,border-color 0.3s;display:none';
document.body.appendChild(cursorRing);

let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px'; cursorDot.style.top = my + 'px';
  cursorDot.style.display = 'block'; cursorRing.style.display = 'block';
});
(function ringLoop() {
  rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
  cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px';
  requestAnimationFrame(ringLoop);
})();

document.querySelectorAll('a,button,.service-card,select,input,textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.width = '12px'; cursorDot.style.height = '12px';
    cursorRing.style.width = '48px'; cursorRing.style.height = '48px';
    cursorRing.style.borderColor = 'rgba(0,113,227,0.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.style.width = '6px'; cursorDot.style.height = '6px';
    cursorRing.style.width = '32px'; cursorRing.style.height = '32px';
    cursorRing.style.borderColor = 'rgba(0,113,227,0.25)';
  });
});

/* ===== NAV SCROLL ===== */
const nav = document.getElementById('nav');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

/* ===== MOBILE MENU ===== */
const burger = document.querySelector('.nav-burger');
const mobileNav = document.querySelector('.mobile-nav');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open'); mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ===== REVEAL ===== */
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
reveals.forEach(r => obs.observe(r));

/* ===== HERO THREE.JS — Apple-blue particle sphere ===== */
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = () => canvas.parentElement.offsetWidth;
  const H = () => canvas.parentElement.offsetHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W(), H());

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W() / H(), 0.1, 200);
  camera.position.set(0, 0, 18);

  // Main particle sphere
  const N = 2200;
  const pos = new Float32Array(N * 3), orig = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(Math.random() * 2 - 1);
    const r = 5;
    const x = r * Math.sin(ph) * Math.cos(th);
    const y = r * Math.sin(ph) * Math.sin(th);
    const z = r * Math.cos(ph);
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    orig[i*3]=x; orig[i*3+1]=y; orig[i*3+2]=z;
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pm = new THREE.PointsMaterial({ color: 0x2997ff, size: 0.035, transparent: true, opacity: 0.7 });
  const sphere = new THREE.Points(pg, pm);
  scene.add(sphere);

  // Orbit ring particles
  const RC = 500;
  const rp = new Float32Array(RC * 3);
  for (let i = 0; i < RC; i++) {
    const a = (i / RC) * Math.PI * 2;
    rp[i*3] = Math.cos(a) * 8;
    rp[i*3+1] = (Math.random() - 0.5) * 0.2;
    rp[i*3+2] = Math.sin(a) * 8;
  }
  const rg = new THREE.BufferGeometry();
  rg.setAttribute('position', new THREE.BufferAttribute(rp, 3));
  const rm = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02, transparent: true, opacity: 0.2 });
  const ring = new THREE.Points(rg, rm);
  ring.rotation.x = Math.PI / 3.5;
  scene.add(ring);

  // Thin torus accent
  const tr = new THREE.Mesh(
    new THREE.TorusGeometry(9.5, 0.01, 2, 140),
    new THREE.MeshBasicMaterial({ color: 0x0071e3, transparent: true, opacity: 0.08 })
  );
  tr.rotation.x = Math.PI / 4; tr.rotation.z = Math.PI / 7;
  scene.add(tr);

  // Floating wireframes
  const shapes = [];
  const geos = [new THREE.IcosahedronGeometry(0.5,1), new THREE.OctahedronGeometry(0.4,0), new THREE.TetrahedronGeometry(0.45)];
  for (let i = 0; i < 7; i++) {
    const m = new THREE.Mesh(geos[i%geos.length],
      new THREE.MeshBasicMaterial({ color: 0x0071e3, wireframe: true, transparent: true, opacity: 0.04 + Math.random()*0.04 }));
    m.position.set((Math.random()-0.5)*30, (Math.random()-0.5)*18, (Math.random()-0.5)*8);
    m.userData = {
      rx: (0.001+Math.random()*0.002)*(Math.random()>0.5?1:-1),
      ry: (0.001+Math.random()*0.002)*(Math.random()>0.5?1:-1),
      by: m.position.y, amp: 0.3+Math.random()*0.6, ph: Math.random()*Math.PI*2
    };
    scene.add(m); shapes.push(m);
  }

  let mouse = {x:0,y:0};
  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX/innerWidth-0.5)*2;
    mouse.y = -(e.clientY/innerHeight-0.5)*2;
  });

  window.addEventListener('resize', () => {
    renderer.setSize(W(), H());
    camera.aspect = W()/H(); camera.updateProjectionMatrix();
  });

  let t = 0;
  (function anim() {
    requestAnimationFrame(anim); t += 0.003;
    const pa = pg.attributes.position.array;
    for (let i = 0; i < N; i++) {
      const ox=orig[i*3],oy=orig[i*3+1],oz=orig[i*3+2];
      const d = Math.sin(t*2+ox*1.2)*0.25+Math.cos(t*1.5+oy)*0.2;
      const mi = mouse.x*0.12*ox+mouse.y*0.12*oy;
      pa[i*3]=ox*(1+d*0.12+mi*0.015);
      pa[i*3+1]=oy*(1+d*0.12+mi*0.015);
      pa[i*3+2]=oz*(1+d*0.12);
    }
    pg.attributes.position.needsUpdate = true;
    sphere.rotation.y = t*0.12+mouse.x*0.06;
    sphere.rotation.x = t*0.06+mouse.y*0.04;
    ring.rotation.z = t*0.1;
    tr.rotation.z = t*0.04+Math.PI/7;
    shapes.forEach(s => {
      s.rotation.x+=s.userData.rx; s.rotation.y+=s.userData.ry;
      s.position.y=s.userData.by+Math.sin(t+s.userData.ph)*s.userData.amp;
    });
    camera.position.x+=(mouse.x*0.6-camera.position.x)*0.025;
    camera.position.y+=(mouse.y*0.4-camera.position.y)*0.025;
    renderer.render(scene,camera);
  })();
})();

/* ===== CTA THREE.JS ===== */
(function() {
  const canvas = document.getElementById('cta-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  const W=()=>canvas.parentElement.offsetWidth, H=()=>canvas.parentElement.offsetHeight;
  const renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(W(),H());
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55,W()/H(),0.1,200);
  camera.position.z = 20;

  const pn=600,pp=new Float32Array(pn*3);
  for(let i=0;i<pn;i++){pp[i*3]=(Math.random()-0.5)*40;pp[i*3+1]=(Math.random()-0.5)*20;pp[i*3+2]=(Math.random()-0.5)*20}
  const pg=new THREE.BufferGeometry(); pg.setAttribute('position',new THREE.BufferAttribute(pp,3));
  scene.add(new THREE.Points(pg,new THREE.PointsMaterial({color:0x2997ff,size:0.025,transparent:true,opacity:0.3})));

  const shapes=[];
  const geos=[new THREE.IcosahedronGeometry(0.9,1),new THREE.OctahedronGeometry(0.7,0),new THREE.BoxGeometry(1,1,1,3,3,3)];
  for(let i=0;i<8;i++){
    const m=new THREE.Mesh(geos[i%geos.length],
      new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true,transparent:true,opacity:0.04+Math.random()*0.05}));
    m.position.set((Math.random()-0.5)*24,(Math.random()-0.5)*12,(Math.random()-0.5)*10);
    m.userData={sp:0.002+Math.random()*0.003,off:Math.random()*Math.PI*2,by:m.position.y};
    scene.add(m); shapes.push(m);
  }
  window.addEventListener('resize',()=>{renderer.setSize(W(),H());camera.aspect=W()/H();camera.updateProjectionMatrix()});
  let t=0;
  (function anim(){requestAnimationFrame(anim);t+=0.005;
    shapes.forEach(s=>{s.rotation.x+=s.userData.sp;s.rotation.y+=s.userData.sp*0.7;s.position.y=s.userData.by+Math.sin(t+s.userData.off)*2});
    renderer.render(scene,camera);
  })();
})();

/* ===== SERVICES PAGE CANVAS ===== */
(function() {
  const canvas = document.getElementById('services-page-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  const W=()=>canvas.parentElement.offsetWidth, H=()=>canvas.parentElement.offsetHeight;
  const renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(W(),H());
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55,W()/H(),0.1,200);
  camera.position.z = 14;

  const n=900,p=new Float32Array(n*3);
  for(let i=0;i<n;i++){
    const a=(i/n)*Math.PI*2+(Math.random()-0.5)*0.15;
    const r=5+(Math.random()-0.5)*1.8;
    p[i*3]=Math.cos(a)*r; p[i*3+1]=(Math.random()-0.5)*1.2; p[i*3+2]=Math.sin(a)*r;
  }
  const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(p,3));
  const pts=new THREE.Points(g,new THREE.PointsMaterial({color:0x2997ff,size:0.035,transparent:true,opacity:0.45}));
  scene.add(pts);

  const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.2,2),
    new THREE.MeshBasicMaterial({color:0x0071e3,wireframe:true,transparent:true,opacity:0.08}));
  scene.add(core);

  let mouse={x:0,y:0};
  document.addEventListener('mousemove',e=>{mouse.x=(e.clientX/innerWidth-0.5)*2;mouse.y=-(e.clientY/innerHeight-0.5)*2});
  window.addEventListener('resize',()=>{renderer.setSize(W(),H());camera.aspect=W()/H();camera.updateProjectionMatrix()});
  let t=0;
  (function anim(){requestAnimationFrame(anim);t+=0.003;
    pts.rotation.y=t*0.12; pts.rotation.x=mouse.y*0.08;
    core.rotation.x=t*0.2+mouse.y*0.08; core.rotation.y=t*0.25+mouse.x*0.08;
    renderer.render(scene,camera);
  })();
})();

/* ===== CONTACT CANVAS ===== */
(function() {
  const canvas = document.getElementById('contact-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  const W=()=>canvas.parentElement.offsetWidth, H=()=>canvas.parentElement.offsetHeight;
  const renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(W(),H());
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55,W()/H(),0.1,200);
  camera.position.z = 14;

  const shapes=[];
  const geos=[new THREE.IcosahedronGeometry(0.7,1),new THREE.OctahedronGeometry(0.6,0),new THREE.TorusGeometry(0.5,0.12,6,20)];
  for(let i=0;i<8;i++){
    const m=new THREE.Mesh(geos[i%geos.length],
      new THREE.MeshBasicMaterial({color:0x0071e3,wireframe:true,transparent:true,opacity:0.04+Math.random()*0.04}));
    m.position.set((Math.random()-0.5)*18,(Math.random()-0.5)*14,(Math.random()-0.5)*6);
    m.userData={rx:(0.001+Math.random()*0.002)*(Math.random()>0.5?1:-1),ry:(0.001+Math.random()*0.002)*(Math.random()>0.5?1:-1),
      by:m.position.y,amp:0.3+Math.random()*0.4,ph:Math.random()*Math.PI*2};
    scene.add(m); shapes.push(m);
  }
  window.addEventListener('resize',()=>{renderer.setSize(W(),H());camera.aspect=W()/H();camera.updateProjectionMatrix()});
  let t=0;
  (function anim(){requestAnimationFrame(anim);t+=0.004;
    shapes.forEach(s=>{s.rotation.x+=s.userData.rx;s.rotation.y+=s.userData.ry;s.position.y=s.userData.by+Math.sin(t+s.userData.ph)*s.userData.amp});
    renderer.render(scene,camera);
  })();
})();

/* ===== WORK MINI CANVASES ===== */
document.querySelectorAll('.work-item-canvas,.work-page-canvas').forEach((canvas,idx) => {
  if (typeof THREE === 'undefined') return;
  const renderer = new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setPixelRatio(1); renderer.setSize(canvas.offsetWidth||400,canvas.offsetHeight||300);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x050505);
  const camera = new THREE.PerspectiveCamera(70,(canvas.offsetWidth||400)/(canvas.offsetHeight||300),0.1,100);
  camera.position.z = 5;
  const cfgs=[
    {geo:new THREE.OctahedronGeometry(1.3,2),col:0x2997ff},
    {geo:new THREE.TorusGeometry(1.1,0.35,16,50),col:0x0071e3},
    {geo:new THREE.IcosahedronGeometry(1.2,1),col:0x2997ff},
    {geo:new THREE.BoxGeometry(1.6,1.6,1.6,4,4,4),col:0x0071e3}
  ];
  const c=cfgs[idx%cfgs.length];
  const mesh=new THREE.Mesh(c.geo,new THREE.MeshBasicMaterial({color:c.col,wireframe:true,transparent:true,opacity:0.3}));
  scene.add(mesh);
  let t=0;
  (function anim(){requestAnimationFrame(anim);t+=0.005;mesh.rotation.x=t*0.35;mesh.rotation.y=t*0.5;renderer.render(scene,camera)})();
});
