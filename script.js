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
const links = $$('.nav__links a[href^="#"]:not(.btn)');
const spy = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle('is-active', l.hash === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

/* ---------- Hero: "imagine o site do seu negócio" ---------- */
const BIZ = {
  restaurante: { prep: 'do seu', word: 'restaurante', url: 'bistrosabor.com.br', name: 'Bistrô Sabor', kicker: 'Cozinha artesanal', title: 'Sabores que viram memória.', sub: 'Reserve sua mesa em segundos e conheça o cardápio da estação.', cta: 'Reservar mesa', c0: 'Cardápio', c1: 'Reservas', c2: 'Delivery', t0: 'Nova reserva', t1: 'Mesa para 4 · hoje, 20h' },
  clinica: { prep: 'da sua', word: 'clínica', url: 'clinicavitta.com.br', name: 'Clínica Vitta', kicker: 'Saúde & bem-estar', title: 'Cuidado de verdade, perto de você.', sub: 'Agende sua consulta online com nossos especialistas.', cta: 'Agendar consulta', c0: 'Especialidades', c1: 'Convênios', c2: 'Agendamento', t0: 'Consulta agendada', t1: 'Dermatologia · amanhã, 14h' },
  advocacia: { prep: 'do seu', word: 'escritório', url: 'moreiraadvocacia.com.br', name: 'Moreira Advocacia', kicker: 'Advocacia & consultoria', title: 'Seus direitos, nossa causa.', sub: 'Atendimento próximo e transparente em cada etapa do seu processo.', cta: 'Falar com um advogado', c0: 'Áreas de atuação', c1: 'Equipe', c2: 'Artigos', t0: 'Novo contato', t1: 'Consulta trabalhista · via site' },
  loja: { prep: 'da sua', word: 'loja', url: 'lojaaurora.com.br', name: 'Aurora', kicker: 'Nova coleção', title: 'Estilo que chega na sua porta.', sub: 'Peças selecionadas com entrega para todo o Brasil.', cta: 'Ver coleção', c0: 'Vestidos', c1: 'Acessórios', c2: 'Promoções', t0: 'Novo pedido', t1: 'R$ 189,90 · pago via Pix' },
};
const browser = $('.browser');
const demo = $('.demo');
const toast = $('.toast');
const typeEl = $('.type');
const pickBtns = $$('.picker button');
let typed = 'do seu site', split = 7, typeToken = 0, toastTimer;

const renderType = () => { typeEl.innerHTML = `${typed.slice(0, split)}<span class="hl">${typed.slice(split)}</span>`; };

async function typeTo(prep, word) {
  const token = ++typeToken, target = `${prep} ${word}`;
  if (reduced) { typed = target; split = prep.length + 1; return renderType(); }
  let i = 0;
  while (i < typed.length && typed[i] === target[i]) i++;
  while (typed.length > i) {
    typed = typed.slice(0, -1); renderType();
    await wait(30);
    if (token !== typeToken) return;
  }
  split = prep.length + 1;
  while (typed.length < target.length) {
    typed = target.slice(0, typed.length + 1); renderType();
    await wait(65);
    if (token !== typeToken) return;
  }
}

function setBiz(key) {
  const b = BIZ[key];
  pickBtns.forEach(btn => btn.setAttribute('aria-pressed', btn.dataset.biz === key));
  typeTo(b.prep, b.word);
  demo.classList.add('is-swapping');
  toast.classList.remove('show');
  setTimeout(() => {
    demo.dataset.biz = key;
    $$('[data-k]', browser).forEach(el => { el.textContent = b[el.dataset.k]; });
    demo.classList.remove('is-swapping');
  }, 260);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    $('[data-k="t0"]', toast).textContent = b.t0;
    $('[data-k="t1"]', toast).textContent = b.t1;
    toast.classList.add('show');
  }, 1400);
}

let autoBiz = true;
const order = Object.keys(BIZ);
(async () => {
  await wait(3200);
  for (let i = 0; autoBiz; i++) {
    setBiz(order[i % order.length]);
    await wait(5200);
  }
})();
pickBtns.forEach(btn => btn.addEventListener('click', () => { autoBiz = false; setBiz(btn.dataset.biz); }));

/* ---------- Hero circuit: pulses light the node when they arrive ---------- */
$$('.circuit').forEach((svg, side) => {
  const ns = 'http://www.w3.org/2000/svg';
  const off = { fill: '#0a0e1a', stroke: 'rgba(77,168,255,.4)', filter: 'drop-shadow(0 0 0 transparent)' };
  const on = { fill: '#8fd3ff', stroke: '#8fd3ff', filter: 'drop-shadow(0 0 8px #4da8ff)' };
  $$('.circuit__traces path', svg).forEach((p, i) => {
    const L = p.getTotalLength(), end = p.getPointAtLength(L);
    const node = document.createElementNS(ns, 'circle');
    node.setAttribute('class', 'node');
    node.setAttribute('cx', end.x); node.setAttribute('cy', end.y); node.setAttribute('r', 4.5);
    if (!reduced) {
      const pulse = p.cloneNode();
      pulse.setAttribute('class', 'pulse');
      pulse.style.strokeDasharray = `60 ${L * 3}`; // one dash, gap long enough that it never repeats
      pulse.style.strokeDashoffset = 60;
      svg.append(pulse);
      // travel takes 60% of the cycle; the dash head reaches the node at `hit`
      const dur = 2400 + L * 5, delay = i * 1100 + side * 650, hit = .6 * L / (L + 120);
      const opts = { duration: dur, delay, iterations: Infinity };
      pulse.animate([{ strokeDashoffset: 60 }, { strokeDashoffset: -(L + 60), offset: .6 }, { strokeDashoffset: -(L + 60) }], opts);
      node.animate([{ ...off }, { ...off, offset: hit }, { ...on, offset: hit + .02 }, { ...off, offset: hit + .3 }, { ...off }], opts);
    }
    svg.append(node);
  });
});

/* ---------- Hero pixel cloud ---------- */
(() => {
  const cv = $('.hero__pixels'), ctx = cv.getContext('2d'), hero = $('.hero');
  const S = 22, R = 170;
  let W, H, cells = [], mouse = { x: -1e3, y: -1e3 }, running = false;
  function size() {
    const d = Math.min(devicePixelRatio, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * d; cv.height = H * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    cells = [];
    for (let y = S / 2; y < H; y += S)
      for (let x = S / 2; x < W; x += S)
        cells.push({ x, y, a: Math.random() * .3, p: Math.random() * 6.28, s: .4 + Math.random() * 1.4 });
  }
  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    for (const c of cells) {
      const near = Math.max(0, 1 - Math.hypot(c.x - mouse.x, c.y - mouse.y) / R);
      const a = c.a * (Math.sin(t * .001 * c.s + c.p) + 1) / 2 + near * .85;
      if (a < .03) continue;
      const sz = 2 + near * 5;
      // blue -> violet as the cursor gets closer
      ctx.fillStyle = `rgba(${77 + 62 * near | 0},${168 - 76 * near | 0},255,${a})`;
      ctx.fillRect(c.x - sz / 2, c.y - sz / 2, sz, sz);
    }
    if (running) requestAnimationFrame(draw);
  }
  size();
  addEventListener('resize', size);
  hero.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect();
    mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
  });
  hero.addEventListener('pointerleave', () => { mouse = { x: -1e3, y: -1e3 }; });
  if (reduced) return draw(0);
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; requestAnimationFrame(draw); }
    else if (!e.isIntersecting) running = false;
  }).observe(hero);
})();

/* ---------- Statement words ---------- */
const words = (() => {
  const el = $('[data-words]');
  el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  return { el, spans: $$('.w', el) };
})();

/* ---------- Services: horizontal pinned scroll ---------- */
const hs = $('.hs'), hsTrack = $('.hs__track'), svcs = $$('.svc', hsTrack);
let hsDist = 0;
function sizeHs() {
  // travel until the last card sits with the same margin the first one starts with
  const first = svcs[0], last = svcs.at(-1);
  hsDist = Math.max(0, last.offsetLeft + last.offsetWidth + first.offsetLeft - hsTrack.clientWidth);
  hs.style.height = mobile.matches ? '' : innerHeight + hsDist + 'px';
}

// site institucional: tabs
$$('.v-inst').forEach(el => {
  let p = 0, hold = 0;
  $$('button', el).forEach((b, i) => b.addEventListener('click', () => { p = i; el.dataset.p = i; hold = Date.now() + 8000; }));
  setInterval(() => { if (Date.now() > hold) el.dataset.p = p = (p + 1) % 4; }, 2400);
});
// landing: leads chegando
(() => {
  const box = $('.leads');
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
})();
// portfólio: filtros
$$('.v-port').forEach(el => {
  const fs = ['all', 'prod', 'proj'];
  let i = 0, hold = 0;
  $$('button', el).forEach(b => b.addEventListener('click', () => { el.dataset.f = b.dataset.f; hold = Date.now() + 8000; }));
  setInterval(() => { if (Date.now() > hold) el.dataset.f = fs[i = (i + 1) % 3]; }, 2600);
});

/* ---------- Process: pinned story ---------- */
const proc = $('.proc'), art = $('.art'), psteps = $('.psteps');
const pItems = $$('.pstep'), pDots = $$('.pstep__dot'), artUrl = $('.art__url');
const URLS = ['briefing · doce encanto', 'figma.com/proto/doce-encanto', 'localhost:5500', 'doceencanto.com.br'];

function updateProc() {
  const r = proc.getBoundingClientRect();
  const p = reduced ? 1 : clamp(-r.top / (proc.offsetHeight - innerHeight));
  const t = Math.min(p * 4, 3), stage = Math.floor(t);
  const vertical = !mobile.matches;
  const c = pDots.map(d => vertical ? d.offsetTop + d.offsetHeight / 2 : d.offsetLeft + d.offsetWidth / 2);
  // the line reaches dot i exactly when stage i starts, so the dot lights as the line touches it
  const head = c[stage] + (c[Math.min(3, stage + 1)] - c[stage]) * (t - stage);
  psteps.style.setProperty('--f0', c[0] + 'px');
  psteps.style.setProperty('--fill', head - c[0] + 'px');
  pItems.forEach((it, i) => { it.classList.toggle('is-lit', i <= stage); it.classList.toggle('is-active', i === stage); });
  if (art.dataset.stage !== String(stage)) { art.dataset.stage = stage; artUrl.textContent = URLS[stage]; }
}

/* ---------- Scroll loop ---------- */
const showcase = $('.showcase');
function onScroll() {
  const y = scrollY, vh = innerHeight;
  document.documentElement.style.setProperty('--p', y / (document.documentElement.scrollHeight - vh));
  nav.classList.toggle('is-scrolled', y > 30);

  const sr = showcase.getBoundingClientRect();
  browser.style.setProperty('--hp', reduced ? 1 : clamp((vh - sr.top) / (vh * .7)));

  const wr = words.el.getBoundingClientRect();
  const lit = Math.round(clamp((vh * .85 - wr.top) / (wr.height + vh * .3)) * words.spans.length);
  words.spans.forEach((s, i) => s.classList.toggle('on', reduced || i < lit));

  if (!mobile.matches) {
    const hr = hs.getBoundingClientRect();
    const hp = clamp(-hr.top / (hs.offsetHeight - vh));
    hsTrack.style.transform = `translate3d(${-hp * hsDist}px,0,0)`;
    hs.style.setProperty('--hsp', hp);
  }
  updateProc();
}
let ticking = false;
addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); }
}, { passive: true });
addEventListener('resize', () => { sizeHs(); onScroll(); });
sizeHs();
onScroll();

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

/* ---------- Before / after ---------- */
(() => {
  const ba = $('.ba'), input = $('input', ba);
  let touched = false;
  const set = v => { ba.style.setProperty('--pos', v + '%'); input.value = v; };
  input.addEventListener('input', () => { touched = true; set(+input.value); });
  if (reduced) return;
  // one-time hint so people notice it can be dragged
  new IntersectionObserver(([e], obs) => {
    if (!e.isIntersecting) return;
    obs.disconnect();
    const keys = [50, 78, 24, 50], seg = 800, t0 = performance.now();
    const step = now => {
      if (touched) return;
      const k = (now - t0) / seg, i = Math.floor(k);
      if (i >= keys.length - 1) return set(50);
      const f = k - i, ease = f < .5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
      set(keys[i] + (keys[i + 1] - keys[i]) * ease);
      requestAnimationFrame(step);
    };
    setTimeout(() => requestAnimationFrame(step), 400);
  }, { threshold: .5 }).observe(ba);
})();

/* ---------- Team panels ---------- */
(() => {
  const mates = $$('.mate');
  const open = m => mates.forEach(x => {
    x.classList.toggle('is-open', x === m);
    $('.mate__tab', x).setAttribute('aria-expanded', x === m);
  });
  mates.forEach(m => {
    $('.mate__tab', m).addEventListener('click', () => open(m));
    if (!finePointer) return;
    m.addEventListener('mouseenter', () => open(m));
  });
})();

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
