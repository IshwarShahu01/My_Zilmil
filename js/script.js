/* ============================================================
   ZILMIL — interactions
   ============================================================ */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- ambient starry sky (background canvas) ---------- */
(function ambientSky(){
  const canvas = document.getElementById('sky');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }

  function makeStars(){
    const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005
    }));
  }

  function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = performance.now() * 0.001;
    for (const s of stars){
      const twinkle = prefersReduced ? 1 : 0.55 + Math.sin(t * s.speed * 60 + s.phase) * 0.45;
      ctx.globalAlpha = Math.max(0.08, twinkle);
      ctx.fillStyle = '#f4ecd5';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!prefersReduced) requestAnimationFrame(draw);
  }

  resize();
  makeStars();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); makeStars(); if (prefersReduced) draw(); }, 200);
  });
})();

/* ---------- reveal on scroll ---------- */
(function revealOnScroll(){
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => observer.observe(el));
})();

/* ---------- constellation nav: active dot + fill progress ---------- */
(function constellationNav(){
  const sections = document.querySelectorAll('main .section');
  const links = document.querySelectorAll('.constellation-nav a');
  const fill = document.getElementById('constellationFill');
  const isMobile = () => window.innerWidth <= 860;

  function onScroll(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (isMobile()){
      fill.style.width = progress + '%';
    } else {
      fill.style.height = progress + '%';
    }

    let activeIndex = 0;
    sections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.4) activeIndex = i;
    });
    links.forEach((l, i) => l.classList.toggle('active', i === activeIndex));
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- polaroid fallback when no real photo exists yet ---------- */
(function polaroidFallback(){
  document.querySelectorAll('.polaroid img, .moment-photo img').forEach(img => {
    const wrap = img.closest('.polaroid, .moment-photo');
    img.addEventListener('error', () => wrap.classList.add('missing'));
    img.addEventListener('load', () => {
      if (img.naturalWidth === 0){
        wrap.classList.add('missing');
      } else {
        img.classList.add('loaded');
      }
    });
    if (img.complete && img.naturalWidth > 0) img.classList.add('loaded');
  });
})();

/* ---------- sweet nothings: quote cards ---------- */
(function quotes(){
  const lines = [
      "My little Chimdu – always making faces, always making my day better ",
     "Scientific fact: my heart rate doubles when you walk into a room. Peer review pending — by you, obviously.",
    "Tharki ho tum… par cute wale category mein",
    "Jhilpe Jadu – kaam baad mein, baatein pehle",
    "You called me trouble. Sir, with respect, you started it the day you wore red.",
    "Dhebarpotli – muh kabhi khaali nahi, bas snacks ready rehna chahiye!",
    "Bail Mundi: discussion ho ya argument… seedha takkar!",
    "You're the reason 'just five more minutes' on a call has never once meant five minutes.",
    "Some people count sheep to fall asleep. I count the days till our next food trip.",
    "Akadu by name, akadu by nature — and somehow still my favourite person to argue with.",
    "Every time you call me nakhrebaaz's biggest rival, I take it as the compliment it clearly is."
  ];

  const grid = document.getElementById('quotesGrid');
  lines.forEach(text => {
    const card = document.createElement('div');
    card.className = 'quote-card reveal';
    card.style.setProperty('--tilt', (Math.random() * 4 - 2) + 'deg');
    card.innerHTML = `<span class="mark">“</span> ${text}`;
    grid.appendChild(card);
  });

  // re-run the reveal observer on the newly added cards
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  grid.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ---------- catch the falling stars: mini game ---------- */
(function starGame(){
  const canvas = document.getElementById('starGame');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('startGame');
  const scoreEl = document.getElementById('score');
  const unlockEl = document.getElementById('gameUnlock');
  const TARGET = parseInt(document.getElementById('targetScore').textContent, 10);

  let stars = [];
  let score = 0;
  let running = false;
  let spawnTimer = 0;
  let rafId = null;

  let CSS_HEIGHT = 420;

  function resizeCanvas(){
    const ratio = window.devicePixelRatio || 1;
    CSS_HEIGHT = canvas.clientHeight || 420;
    const width = canvas.clientWidth;
    canvas.width = width * ratio;
    canvas.height = CSS_HEIGHT * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  window.addEventListener('resize', resizeCanvas);

  function spawnStar(){
    const w = canvas.clientWidth;
    stars.push({
      x: Math.random() * (w - 30) + 15,
      y: -20,
      r: Math.random() * 6 + 8,
      speed: Math.random() * 1.4 + 1.4,
      caught: false
    });
  }

  function drawStar(s){
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.beginPath();
    for (let i = 0; i < 5; i++){
      ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * s.r, -Math.sin((18 + i * 72) * Math.PI / 180) * s.r);
      ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * s.r * 0.45, -Math.sin((54 + i * 72) * Math.PI / 180) * s.r * 0.45);
    }
    ctx.closePath();
    ctx.fillStyle = '#f4c95d';
    ctx.shadowColor = '#f4c95d';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
  }

  function tick(){
    if (!running) return;
    ctx.clearRect(0, 0, canvas.clientWidth, CSS_HEIGHT);

    spawnTimer++;
    if (spawnTimer > 38){ spawnStar(); spawnTimer = 0; }

    stars.forEach(s => { s.y += s.speed; drawStar(s); });
    stars = stars.filter(s => s.y < CSS_HEIGHT + 20);

    if (score >= TARGET){
      finish();
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  function catchAt(x, y){
    for (const s of stars){
      const d = Math.hypot(s.x - x, s.y - y);
      if (d < s.r + 14 && !s.caught){
        s.caught = true;
        score++;
        scoreEl.textContent = score;
        stars = stars.filter(st => st !== s);
        break;
      }
    }
  }

  function pointerPos(e){
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (!running) return;
    const p = pointerPos(e);
    catchAt(p.x, p.y);
  });

  function finish(){
    running = false;
    cancelAnimationFrame(rafId);
    unlockEl.classList.remove('hidden');
    startBtn.textContent = 'play again';
  }

  function startGame(){
    score = 0;
    scoreEl.textContent = '0';
    stars = [];
    unlockEl.classList.add('hidden');
    resizeCanvas();
    running = true;
    startBtn.textContent = 'restart';
    cancelAnimationFrame(rafId);
    tick();
  }

  startBtn.addEventListener('click', startGame);
  resizeCanvas();
})();

/* ---------- her song: hide the placeholder note once a real file exists ---------- */
(function songCheck(){
  const audio = document.getElementById('songAudio');
  const note = document.querySelector('.player-note');
  audio.addEventListener('loadedmetadata', () => { if (note) note.style.display = 'none'; });
  audio.addEventListener('error', () => {}); // stays silent, placeholder note remains
})();

/* ---------- the wish: candle blow + confetti ---------- */
(function wishReveal(){
  const candleBtn = document.getElementById('candleBtn');
  const wishCopy = document.getElementById('wishCopy');
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let confettiRunning = false;

  function sizeCanvas(){
    const section = document.getElementById('wish');
    canvas.width = section.clientWidth;
    canvas.height = section.clientHeight;
  }
  window.addEventListener('resize', sizeCanvas);
  sizeCanvas();

  function burst(){
    sizeCanvas();
    const colors = ['#f4c95d', '#ffac57', '#e8617e', '#f6f1e4'];
    particles = Array.from({ length: 80 }, () => ({
      x: canvas.width / 2,
      y: canvas.height * 0.3,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -6 - 2,
      g: 0.18,
      size: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 100
    }));
    confettiRunning = true;
    requestAnimationFrame(animateConfetti);
  }

  function animateConfetti(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.g;
      p.life--;
      ctx.globalAlpha = Math.max(p.life / 100, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1;
    particles = particles.filter(p => p.life > 0);
    if (particles.length > 0 && confettiRunning){
      requestAnimationFrame(animateConfetti);
    }
  }

  candleBtn.addEventListener('click', () => {
    candleBtn.classList.add('blown');
    wishCopy.classList.remove('hidden');
    if (!prefersReduced) burst();
    candleBtn.disabled = true;
  }, { once: true });
})();
