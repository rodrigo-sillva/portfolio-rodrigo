document.getElementById('year').textContent = new Date().getFullYear();

/* ---------------- Preloader ---------------- */
window.addEventListener('load', () => {
  const statusEl = document.getElementById('preStatus');
  const messages = ['compilando…', 'resolvendo dependências…', 'renderizando interface…', 'pronto.'];
  let i = 0;
  const interval = setInterval(() => {
    i++;
    if (i < messages.length) statusEl.textContent = messages[i];
  }, 400);

  setTimeout(() => {
    clearInterval(interval);
    document.getElementById('preloader').classList.add('done');
    document.body.classList.remove('locked');
  }, 1700);
});

/* ---------------- Header scroll state ---------------- */
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

/* ---------------- Mobile nav ---------------- */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mainNav.classList.remove('open');
  navToggle.classList.remove('open');
}));

/* ---------------- Scroll reveal (Intersection Observer) ---------------- */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => io.observe(el));

/* ---------------- Hero typewriter ---------------- */
const typeTarget = document.getElementById('typeLine');
const fullText = typeTarget.textContent;
typeTarget.textContent = '';
let charIndex = 0;
function typeWriter(){
  if (charIndex <= fullText.length){
    typeTarget.textContent = fullText.slice(0, charIndex);
    charIndex++;
    setTimeout(typeWriter, 38);
  }
}
setTimeout(typeWriter, 1750);

/* ---------------- Button ripple effect ---------------- */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e){
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

/* ---------------- Particle network background ---------------- */
const canvas = document.getElementById('net');
const ctx = canvas.getContext('2d');
let w, h, particles = [];
const mouse = { x: null, y: null, radius: 140 };
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

function initParticles(){
  const count = Math.min(70, Math.floor((w * h) / 22000));
  particles = [];
  for (let i = 0; i < count; i++){
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6
    });
  }
}
initParticles();
window.addEventListener('resize', initParticles);

function drawParticles(){
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < particles.length; i++){
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > w) p.vx *= -1;
    if (p.y < 0 || p.y > h) p.vy *= -1;

    if (mouse.x !== null){
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < mouse.radius){
        const force = (mouse.radius - dist) / mouse.radius;
        p.x += (dx / dist) * force * 0.6;
        p.y += (dy / dist) * force * 0.6;
      }
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 210, 255, 0.45)';
    ctx.fill();
  }

  for (let i = 0; i < particles.length; i++){
    for (let j = i + 1; j < particles.length; j++){
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 130){
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(30, 144, 255, ${0.14 * (1 - dist / 130)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawParticles);
}

if (!prefersReducedMotion){
  drawParticles();
} else {
  ctx.clearRect(0,0,w,h);
}
