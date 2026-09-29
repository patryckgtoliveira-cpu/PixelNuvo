const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const mobile = matchMedia('(max-width: 900px)');
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ---------- Nav ---------- */
const nav = $('#nav');
const toggle = $('.nav__toggle');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
$$('#menu a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', false);
}));

/* ---------- Progress bar + nav background ---------- */
function onPageScroll() {
  const y = scrollY;
  document.documentElement.style.setProperty('--p', y / (document.documentElement.scrollHeight - innerHeight));
  nav.classList.toggle('is-scrolled', y > 30);
}
addEventListener('scroll', onPageScroll, { passive: true });
onPageScroll();

/* ---------- Service demos ---------- */
// site institucional: tabs
$$('.v-inst').forEach(el => {
  let p = 0, hold = 0;
  $$('button', el).forEach((b, i) => b.addEventListener('click', () => { p = i; el.dataset.p = i; hold = Date.now() + 8000; }));
  setInterval(() => { if (Date.now() > hold) el.dataset.p = p = (p + 1) % 4; }, 2400);
});
// landing: leads chegando
$$('.leads').forEach(box => {
  const people = [['A', 'Ana', 'via landing page'], ['B', 'Bruno', 'pelo WhatsApp'], ['C', 'Carla', 'formulário enviado'], ['D', 'Diego', 'via landing page']];
  let n = 0;
  const add = () => {
    const [ini, name, sub] = people[n++ % people.length];
    const d = document.createElement('div');
    d.className = 'lead';
    d.innerHTML = `<i>${ini}</i><div><b>Novo contato · ${name}</b><small>${sub}</small></div>`;
    box.prepend(d);
    while (box.children.length > 3) box.lastChild.remove();
  };
  setTimeout(() => { add(); setInterval(add, 3000); }, 1400);
});
// portfólio: filtros
$$('.v-port').forEach(el => {
  const fs = ['all', 'prod', 'proj'];
  let i = 0, hold = 0;
  $$('button', el).forEach(b => b.addEventListener('click', () => { el.dataset.f = b.dataset.f; hold = Date.now() + 8000; }));
  setInterval(() => { if (Date.now() > hold) el.dataset.f = fs[i = (i + 1) % 3]; }, 2600);
});

/* ---------- Reveal, counters, scramble ---------- */
function countUp(el) {
  const to = +el.dataset.to, dur = reduced ? 0 : 1600, t0 = performance.now();
  const tick = now => {
    const k = dur ? clamp((now - t0) / dur) : 1;
    el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
function scramble(el) {
  if (reduced) return;
  const final = el.textContent, chars = '01<>/{}#_▮', t0 = performance.now(), dur = 700;
  const run = now => {
    const k = (now - t0) / dur;
    if (k >= 1) return (el.textContent = final);
    el.textContent = [...final].map((c, i) => c === ' ' || i < k * final.length ? c : chars[Math.random() * chars.length | 0]).join('');
    requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target;
  if (el.matches('.count')) countUp(el);
  else if (el.matches('[data-scramble]')) scramble(el);
  else el.classList.add('is-in');
  io.unobserve(el);
}), { threshold: .15 });
$$('.reveal, .count, [data-scramble]').forEach(el => io.observe(el));

/* ---------- Pointer effects (desktop only) ---------- */
if (finePointer && !reduced) {
  const glow = $('.cursor-glow');
  addEventListener('pointermove', e => {
    glow.style.setProperty('--cx', e.clientX + 'px');
    glow.style.setProperty('--cy', e.clientY + 'px');
  }, { passive: true });
  $$('.spot').forEach(el => el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', e.clientX - r.left + 'px');
    el.style.setProperty('--my', e.clientY - r.top + 'px');
  }));
  $$('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* ---------- Year ---------- */
$('.year').textContent = new Date().getFullYear();
