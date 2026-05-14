/* ── CURSOR ── */
const cur = document.getElementById('cur');
const cur2 = document.getElementById('cur2');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let tx = mx, ty = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top = my + 'px';
});

(function animTrail() {
  tx += (mx - tx) * 0.18;
  ty += (my - ty) * 0.18;
  cur2.style.left = tx + 'px';
  cur2.style.top = ty + 'px';
  requestAnimationFrame(animTrail);
})();

document.querySelectorAll('a, .btn-main, .btn-dark, .work-item, .cap-item, .camp-card, .reel-stat, .ai-strip').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.width = '6px'; cur.style.height = '6px';
    cur2.style.width = '54px'; cur2.style.height = '54px';
    cur2.style.borderColor = 'rgba(255,224,0,.7)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.width = '10px'; cur.style.height = '10px';
    cur2.style.width = '36px'; cur2.style.height = '36px';
    cur2.style.borderColor = 'rgba(255,224,0,.5)';
  });
});

/* ── HERO CANVAS PARTICLE NETWORK ── */
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let W, H, pts = [];

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
  pts = [];
  for (let i = 0; i < 85; i++) {
    pts.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.5 + 0.5
    });
  }
}
resize();
window.addEventListener('resize', resize);

let hmx = W / 2, hmy = H / 2;
document.querySelector('.hero').addEventListener('mousemove', e => {
  const r = e.currentTarget.getBoundingClientRect();
  hmx = e.clientX - r.left;
  hmy = e.clientY - r.top;
});

(function draw() {
  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, W, H);
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
  });
  pts.forEach((a, i) => {
    pts.slice(i + 1).forEach(b => {
      const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) {
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(255,224,0,${(1 - d / 130) * 0.18})`;
        ctx.lineWidth = 0.5; ctx.stroke();
      }
    });
    const dm = Math.sqrt((a.x - hmx) ** 2 + (a.y - hmy) ** 2);
    const glow = Math.max(0, 1 - dm / 200);
    ctx.beginPath(); ctx.arc(a.x, a.y, a.r + glow * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,224,0,${0.3 + glow * 0.5})`; ctx.fill();
  });
})();

/* ── REEL STAT HOVER ── */
document.querySelectorAll('.reel-stat').forEach(s => {
  s.addEventListener('mouseenter', () => { s.style.background = '#0e0e0e'; });
  s.addEventListener('mouseleave', () => { s.style.background = '#0a0a0a'; });
});

/* ── SCROLL FADE-IN ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.ai-strip, .reel-stat, .camp-card, .work-item, .cap-item, .cert').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  observer.observe(el);
});
