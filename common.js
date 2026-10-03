const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const mobile = window.matchMedia('(max-width: 900px)');
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ui = {
  nav: $('#nav'),
  toggle: $('.nav__toggle'),
  menuLinks: $$('#menu a'),
  year: $('.year'),
};

function setMenuState(isOpen) {
  ui.nav.classList.toggle('is-open', isOpen);
  ui.toggle.setAttribute('aria-expanded', String(isOpen));
  ui.toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
}

if (ui.toggle) {
  ui.toggle.addEventListener('click', () => setMenuState(!ui.nav.classList.contains('is-open')));
}

ui.menuLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (!ui.nav) return;
    ui.nav.classList.remove('is-open');
    if (ui.toggle) ui.toggle.setAttribute('aria-expanded', 'false');
  });
});

function updatePageProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

  document.documentElement.style.setProperty('--p', progress);
  if (ui.nav) ui.nav.classList.toggle('is-scrolled', window.scrollY > 30);
}

window.addEventListener('scroll', updatePageProgress, { passive: true });
updatePageProgress();

function setupAutoplayTabs() {
  $$('.v-inst').forEach((el) => {
    let current = 0;
    let hold = 0;

    $$('button', el).forEach((button, index) => {
      button.addEventListener('click', () => {
        current = index;
        el.dataset.p = String(index);
        hold = Date.now() + 8000;
      });
    });

    setInterval(() => {
      if (Date.now() > hold) {
        current = (current + 1) % 4;
        el.dataset.p = String(current);
      }
    }, 2400);
  });
}

function setupLeadCards() {
  $$('.leads').forEach((box) => {
    const people = [
      ['A', 'Ana', 'via landing page'],
      ['B', 'Bruno', 'pelo WhatsApp'],
      ['C', 'Carla', 'formulário enviado'],
      ['D', 'Diego', 'via landing page'],
    ];

    let index = 0;
    const addLead = () => {
      const [initials, name, subtitle] = people[index++ % people.length];
      const card = document.createElement('div');
      card.className = 'lead';
      card.innerHTML = `<i>${initials}</i><div><b>Novo contato · ${name}</b><small>${subtitle}</small></div>`;
      box.prepend(card);
      while (box.children.length > 3) box.lastChild.remove();
    };

    setTimeout(() => {
      addLead();
      setInterval(addLead, 3000);
    }, 1400);
  });
}

function setupPortfolioFilters() {
  $$('.v-port').forEach((el) => {
    const modes = ['all', 'prod', 'proj'];
    let modeIndex = 0;
    let hold = 0;

    $$('button', el).forEach((button) => {
      button.addEventListener('click', () => {
        el.dataset.f = button.dataset.f;
        hold = Date.now() + 8000;
      });
    });

    setInterval(() => {
      if (Date.now() > hold) {
        el.dataset.f = modes[modeIndex = (modeIndex + 1) % modes.length];
      }
    }, 2600);
  });
}

function countUp(element) {
  const target = Number(element.dataset.to);
  const duration = reduced ? 0 : 1600;
  const initialTime = performance.now();

  const tick = (now) => {
    const progress = duration ? clamp((now - initialTime) / duration) : 1;
    const value = Math.round(target * (1 - Math.pow(1 - progress, 3)));
    element.textContent = value;

    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function scramble(element) {
  if (reduced) {
    element.textContent = element.textContent;
    return;
  }

  const finalText = element.textContent;
  const glyphs = '01<>/{}#_▮';
  const duration = 700;
  const initialTime = performance.now();

  const run = (now) => {
    const progress = (now - initialTime) / duration;
    if (progress >= 1) {
      element.textContent = finalText;
      return;
    }

    element.textContent = [...finalText]
      .map((character, index) => character === ' ' || index < progress * finalText.length
        ? character
        : glyphs[Math.random() * glyphs.length | 0])
      .join('');

    requestAnimationFrame(run);
  };

  requestAnimationFrame(run);
}

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const element = entry.target;
    if (element.matches('.count')) countUp(element);
    else if (element.matches('[data-scramble]')) scramble(element);
    else element.classList.add('is-in');

    scrollObserver.unobserve(element);
  });
}, { threshold: 0.15 });

$$('.reveal, .count, [data-scramble]').forEach((element) => scrollObserver.observe(element));

if (finePointer && !reduced) {
  const glow = $('.cursor-glow');
  window.addEventListener('pointermove', (event) => {
    glow.style.setProperty('--cx', event.clientX + 'px');
    glow.style.setProperty('--cy', event.clientY + 'px');
  }, { passive: true });

  $$('.spot').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty('--mx', event.clientX - rect.left + 'px');
      element.style.setProperty('--my', event.clientY - rect.top + 'px');
    });
  });

  $$('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.35;
      element.style.transform = `translate(${x}px, ${y}px)`;
    });

    element.addEventListener('pointerleave', () => {
      element.style.transform = '';
    });
  });
}

if (ui.year) ui.year.textContent = new Date().getFullYear();

setupAutoplayTabs();
setupLeadCards();
setupPortfolioFilters();
