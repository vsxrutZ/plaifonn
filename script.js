/* ===== แก้ข้อความตรงนี้ได้เลย ===== */
const CFG = {
  name: 'ปลายฝน',
  plaque: '“คิดถึงนะ”',
  year: 2026,
  letter: [
    'ปีนี้เธอเก่งมากเลยนะ\nไอเห็นอยู่ว่ายูเหนื่อย แต่ไม่ค่อยได้พูด',
    'ปีหน้าขอให้เบาลงกว่านี้หน่อยก็ยังดี\nแล้วไอจะอยู่ข้าง ๆ ยูเหมือนเดิม',
    'ขอบคุณที่อยู่ด้วยกันนะ'
  ],
  sign: '— จากคนที่รักเธอ'
};
/* =================================== */

const $ = id => document.getElementById(id);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let page = 0, shaken = 0, fogReady = false;

$('tag').textContent = 'ถึง ' + CFG.name;
$('plaque').textContent = CFG.plaque;
$('est').textContent = '★ EST. ' + CFG.year + ' ★';
$('paper').innerHTML = '<h2>ถึง' + CFG.name + '</h2>' +
  CFG.letter.map(t => '<p>' + t.replace(/\n/g, '<br>') + '</p>').join('') +
  '<p class="sign">' + CFG.sign + '</p>';

// ฟองฟุ้งลอยพื้นหลัง
for (let i = 0; i < 22; i++) {
  const s = document.createElement('i'), z = 6 + Math.random() * 22;
  s.style.cssText = `left:${Math.random()*100}%;width:${z}px;height:${z}px;animation-duration:${14+Math.random()*16}s;animation-delay:-${Math.random()*20}s`;
  $('bk').appendChild(s);
}

/* ---------- เอฟเฟกต์ ---------- */
function fx(x, y, list, n, dist) {
  if (reduce) return;
  for (let i = 0; i < n; i++) {
    const el = document.createElement('span'), a = Math.random() * 6.283, d = dist * (.5 + Math.random() * .7);
    el.textContent = list[i % list.length];
    el.style.cssText = `position:fixed;left:${x}px;top:${y}px;font-size:${14+Math.random()*14}px;pointer-events:none;z-index:50`;
    document.body.appendChild(el);
    el.animate([
      { transform: 'translate(-50%,-50%) scale(.3)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d - 20}px)) scale(1.1) rotate(${Math.random()*60-30}deg)`, opacity: 0 }
    ], { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => el.remove();
  }
}
function puff(b) {   // ฟุ้ง ๆ รอบปุ่ม
  if (reduce) return;
  const r = b.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('div'), z = 50 + Math.random() * 50,
      x = cx + (Math.random() - .5) * r.width, y = cy + (Math.random() - .5) * r.height,
      a = Math.random() * 6.283, d = 30 + Math.random() * 40;
    el.style.cssText = `position:fixed;left:${x-z/2}px;top:${y-z/2}px;width:${z}px;height:${z}px;border-radius:50%;pointer-events:none;z-index:49;
      background:radial-gradient(circle,#ff9fc8cc,#ffc2dc66 45%,#fff0 70%);filter:blur(5px)`;
    document.body.appendChild(el);
    el.animate([
      { transform: 'translate(0,0) scale(.3)', opacity: .95 },
      { transform: `translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px) scale(1.9)`, opacity: 0 }
    ], { duration: 850 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => el.remove();
  }
  fx(cx, cy, ['💗', '✨', '🌸', '🤍'], 8, 90);
}
document.addEventListener('click', e => { const b = e.target.closest('.btn,.again'); if (b) puff(b); }, true);

/* ---------- ขั้นตอน ---------- */
const secOf = [0, 1, 2, 2, 3];
function show(p) {
  page = p;
  document.querySelectorAll('.step').forEach((el, i) => el.classList.toggle('on', i === secOf[p]));
  [...$('dots').children].forEach((d, i) => d.classList.toggle('on', i === p));
  if (p === 2) setupFog();
  if (p === 3) {
    $('ghint').textContent = 'ลองเขย่าดูสิ ❄️';
    $('globe').classList.remove('wob'); $('globe').classList.add('pop'); burst(50);
    const r = $('globe').getBoundingClientRect(); fx(r.left + r.width / 2, r.top + r.height / 2, ['✨', '❄️', '💗'], 12, 140);
  }
  if (p === 4) setTimeout(() => fx(innerWidth / 2, innerHeight / 2, ['💗', '🌸', '✨', '🤍'], 16, 170), 3300);
}
$('go').onclick = () => setTimeout(() => show(1), 350);
$('gift').onclick = () => {
  const g = $('gift'); if (g.classList.contains('open')) return;
  g.classList.add('open');
  const r = g.getBoundingClientRect(); fx(r.left + r.width / 2, r.top + r.height / 3, ['💗', '✨', '🌸', '⭐', '🤍'], 18, 150);
  setTimeout(() => show(2), 1700);
};

/* ---------- เช็ดกระจกหมอก (แปรงนุ่ม ๆ) ---------- */
const fog = $('fog'), fctx = fog.getContext('2d'), globe = $('globe');
let fw = 0;
function setupFog() {
  if (fogReady) return; fogReady = true;
  const dpr = Math.min(devicePixelRatio || 1, 2); fw = globe.clientWidth;
  fog.width = fog.height = fw * dpr; fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  fctx.globalCompositeOperation = 'source-over';
  const g = fctx.createLinearGradient(0, 0, fw, fw); g.addColorStop(0, '#fff3f9'); g.addColorStop(1, '#ffd0e6');
  fctx.fillStyle = g; fctx.fillRect(0, 0, fw, fw);
  for (let i = 0; i < 16; i++) {
    fctx.fillStyle = `rgba(255,255,255,${Math.random()*.35})`;
    fctx.beginPath(); fctx.arc(Math.random() * fw, Math.random() * fw, 20 + Math.random() * 50, 0, 7); fctx.fill();
  }
  fctx.globalCompositeOperation = 'destination-out';
}
function stamp(x, y) {
  const r = fw * .09, g = fctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.6, 'rgba(0,0,0,.8)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  fctx.fillStyle = g; fctx.beginPath(); fctx.arc(x, y, r, 0, 7); fctx.fill();
}
let last = null, lastCheck = 0, lastFx = 0;
const pos = e => { const r = fog.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
function wipe(a, b, e) {
  $('fogtxt').style.opacity = 0;
  const d = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(d / (fw * .03)));
  for (let i = 1; i <= n; i++) stamp(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n);
  const t = performance.now();
  if (t - lastFx > 140) { lastFx = t; fx(e.clientX, e.clientY, ['✨', '·'], 1, 26); }
  if (t - lastCheck > 250) checkFog();
}
fog.addEventListener('pointerdown', e => { fog.setPointerCapture(e.pointerId); last = pos(e); wipe(last, last, e); });
fog.addEventListener('pointermove', e => { if (!last) return; const p = pos(e); wipe(last, p, e); last = p; });
['pointerup', 'pointercancel'].forEach(t => fog.addEventListener(t, () => { last = null; checkFog(); }));
function checkFog() {
  lastCheck = performance.now();
  if (fog.classList.contains('gone')) return;
  const t = document.createElement('canvas'); t.width = t.height = 30;
  const c = t.getContext('2d'); c.drawImage(fog, 0, 0, 30, 30);
  const d = c.getImageData(0, 0, 30, 30).data; let clear = 0;
  for (let i = 3; i < d.length; i += 4) if (d[i] < 40) clear++;
  if (clear / 900 > 0.4) { fog.classList.add('gone'); setTimeout(() => show(3), 800); }
}

/* ---------- หิมะ + เขย่า ---------- */
const sc = $('snow'), sx = sc.getContext('2d'); let flakes = [], W = 0;
function sizeSnow() { W = globe.clientWidth; sc.width = sc.height = W; }
addEventListener('resize', sizeSnow); sizeSnow();
function burst(n) {
  for (let i = 0; i < n; i++) flakes.push({
    x: Math.random() * W, y: Math.random() * W * .45, vx: (Math.random() - .5) * 3, vy: Math.random() * 2 + .5,
    r: 1.6 + Math.random() * 3, life: 150 + Math.random() * 170, star: Math.random() < .3
  });
}
function tick() {
  sx.clearRect(0, 0, W, W);
  if (page === 3 && !reduce && Math.random() < .3) burst(1);
  flakes = flakes.filter(f => (f.life -= 1) > 0);
  sx.shadowColor = '#fff'; sx.shadowBlur = 6;
  for (const f of flakes) {
    f.x += f.vx; f.y += f.vy; f.vx *= .985; f.vy = Math.min(f.vy + .02, 1.5);
    if (f.y > W * .85) f.life -= 6;
    sx.globalAlpha = Math.min(1, f.life / 40); sx.fillStyle = '#fff';
    if (f.star) { sx.font = (f.r * 4) + 'px sans-serif'; sx.fillText('✦', f.x, f.y); }
    else { sx.beginPath(); sx.arc(f.x, f.y, f.r, 0, 7); sx.fill(); }
  }
  requestAnimationFrame(tick);
}
tick();

function addShake(v) {
  if (page !== 3) return;
  shaken += v; burst(Math.ceil(v / 2));
  if (shaken > 70) $('next').classList.add('show');
}
let gl = null;
function wobble() { const g = $('globe'); g.classList.remove('wob', 'pop'); void g.offsetWidth; g.classList.add('wob'); }
globe.addEventListener('pointerdown', e => { gl = [e.clientX, e.clientY]; if (page === 3) { addShake(10); wobble(); } });
globe.addEventListener('pointermove', e => {
  if (!gl) return;
  const d = Math.hypot(e.clientX - gl[0], e.clientY - gl[1]); gl = [e.clientX, e.clientY];
  addShake(d * .25);
  if (d > 14 && page === 3 && !$('globe').classList.contains('wob')) wobble();
});
globe.addEventListener('animationend', () => $('globe').classList.remove('wob', 'pop'));
['pointerup', 'pointercancel', 'pointerleave'].forEach(t => globe.addEventListener(t, () => gl = null));
addEventListener('devicemotion', e => {
  const a = e.accelerationIncludingGravity; if (!a) return;
  if (Math.hypot(a.x || 0, a.y || 0, a.z || 0) > 22) { addShake(12); wobble(); }
});

$('next').onclick = () => setTimeout(() => show(4), 350);
$('again').onclick = () => {
  $('gift').classList.remove('open'); fog.classList.remove('gone'); $('fogtxt').style.opacity = 1;
  fogReady = false; shaken = 0; flakes = []; $('next').classList.remove('show'); $('ghint').textContent = 'ใช้นิ้วลากเช็ดกระจก';
  show(0);
};
show(0);