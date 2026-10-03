const pixelNuvoHome = (() => {
  const links = $$('.nav__links a[href^="#"]:not(.btn)');
  const browser = $('.browser');
  const demo = $('.demo');
  const toast = $('.toast');
  const typeElement = $('.type');
  const pickButtons = $$('.picker button');
  const showcase = $('.showcase');
  const hs = $('.hs');
  const hsTrack = $('.hs__track');
  const services = $$('.svc', hsTrack);
  const proc = $('.proc');
  const art = $('.art');
  const processSteps = $('.psteps');
  const processItems = $$('.pstep');
  const processDots = $$('.pstep__dot');
  const artUrl = $('.art__url');
  const wordsRoot = $('[data-words]');

  const BIZ = {
    restaurante: { prep: 'do seu', word: 'restaurante', url: 'bistrosabor.com.br', name: 'Bistrô Sabor', kicker: 'Cozinha artesanal', title: 'Sabores que viram memória.', sub: 'Reserve sua mesa em segundos e conheça o cardápio da estação.', cta: 'Reservar mesa', c0: 'Cardápio', c1: 'Reservas', c2: 'Delivery', t0: 'Nova reserva', t1: 'Mesa para 4 · hoje, 20h' },
    clinica: { prep: 'da sua', word: 'clínica', url: 'clinicavitta.com.br', name: 'Clínica Vitta', kicker: 'Saúde & bem-estar', title: 'Cuidado de verdade, perto de você.', sub: 'Agende sua consulta online com nossos especialistas.', cta: 'Agendar consulta', c0: 'Especialidades', c1: 'Convênios', c2: 'Agendamento', t0: 'Consulta agendada', t1: 'Dermatologia · amanhã, 14h' },
    advocacia: { prep: 'do seu', word: 'escritório', url: 'moreiraadvocacia.com.br', name: 'Moreira Advocacia', kicker: 'Advocacia & consultoria', title: 'Seus direitos, nossa causa.', sub: 'Atendimento próximo e transparente em cada etapa do seu processo.', cta: 'Falar com um advogado', c0: 'Áreas de atuação', c1: 'Equipe', c2: 'Artigos', t0: 'Novo contato', t1: 'Consulta trabalhista · via site' },
    loja: { prep: 'da sua', word: 'loja', url: 'lojaaurora.com.br', name: 'Aurora', kicker: 'Nova coleção', title: 'Estilo que chega na sua porta.', sub: 'Peças selecionadas com entrega para todo o Brasil.', cta: 'Ver coleção', c0: 'Vestidos', c1: 'Acessórios', c2: 'Promoções', t0: 'Novo pedido', t1: 'R$ 189,90 · pago via Pix' },
  };

  const state = {
    typed: 'do seu site',
    split: 7,
    typeToken: 0,
    toastTimer: 0,
    autoBiz: true,
  };

  const URLS = ['briefing · doce encanto', 'figma.com/proto/doce-encanto', 'localhost:5500', 'doceencanto.com.br'];

  function renderType() {
    typeElement.innerHTML = `${state.typed.slice(0, state.split)}<span class="hl">${state.typed.slice(state.split)}</span>`;
  }

  async function typeTo(prep, word) {
    const token = ++state.typeToken;
    const target = `${prep} ${word}`;

    if (reduced) {
      state.typed = target;
      state.split = prep.length + 1;
      renderType();
      return;
    }

    let index = 0;
    while (index < state.typed.length && state.typed[index] === target[index]) index += 1;

    while (state.typed.length > index) {
      state.typed = state.typed.slice(0, -1);
      renderType();
      await wait(30);
      if (token !== state.typeToken) return;
    }

    state.split = prep.length + 1;
    while (state.typed.length < target.length) {
      state.typed = target.slice(0, state.typed.length + 1);
      renderType();
      await wait(65);
      if (token !== state.typeToken) return;
    }
  }

  function setBiz(key) {
    const business = BIZ[key];
    pickButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.biz === key));
    });

    typeTo(business.prep, business.word);
    demo.classList.add('is-swapping');
    toast.classList.remove('show');

    setTimeout(() => {
      demo.dataset.biz = key;
      $$('[data-k]', browser).forEach((element) => {
        element.textContent = business[element.dataset.k];
      });
      demo.classList.remove('is-swapping');
    }, 260);

    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => {
      $('[data-k="t0"]', toast).textContent = business.t0;
      $('[data-k="t1"]', toast).textContent = business.t1;
      toast.classList.add('show');
    }, 1400);
  }

  function initScrollSpy() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle('is-active', link.hash === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    $$('main section[id]').forEach((section) => observer.observe(section));
  }

  function initHeroInteraction() {
    const order = Object.keys(BIZ);

    (async () => {
      await wait(3200);
      for (let index = 0; state.autoBiz; index += 1) {
        setBiz(order[index % order.length]);
        await wait(5200);
      }
    })();

    pickButtons.forEach((button) => {
      button.addEventListener('click', () => {
        state.autoBiz = false;
        setBiz(button.dataset.biz);
      });
    });
  }

  function initHeroCircuit() {
    $$('.circuit').forEach((svg, side) => {
      const namespace = 'http://www.w3.org/2000/svg';
      const off = { fill: '#0a0e1a', stroke: 'rgba(77,168,255,.4)', filter: 'drop-shadow(0 0 0 transparent)' };
      const on = { fill: '#8fd3ff', stroke: '#8fd3ff', filter: 'drop-shadow(0 0 8px #4da8ff)' };

      $$('.circuit__traces path', svg).forEach((path, index) => {
        const length = path.getTotalLength();
        const end = path.getPointAtLength(length);
        const node = document.createElementNS(namespace, 'circle');

        node.setAttribute('class', 'node');
        node.setAttribute('cx', end.x);
        node.setAttribute('cy', end.y);
        node.setAttribute('r', 4.5);

        if (!reduced) {
          const pulse = path.cloneNode();
          pulse.setAttribute('class', 'pulse');
          pulse.style.strokeDasharray = `60 ${length * 3}`;
          pulse.style.strokeDashoffset = 60;
          svg.append(pulse);

          const duration = 2400 + length * 5;
          const delay = index * 1100 + side * 650;
          const hit = 0.6 * length / (length + 120);
          const opts = { duration, delay, iterations: Infinity };

          pulse.animate([
            { strokeDashoffset: 60 },
            { strokeDashoffset: -(length + 60), offset: 0.6 },
            { strokeDashoffset: -(length + 60) },
          ], opts);

          node.animate([
            { ...off },
            { ...off, offset: hit },
            { ...on, offset: hit + 0.02 },
            { ...off, offset: hit + 0.3 },
            { ...off },
          ], opts);
        }

        svg.append(node);
      });
    });
  }

  function initPixelCloud() {
    const canvas = $('.hero__pixels');
    const context = canvas.getContext('2d');
    const hero = $('.hero');
    const spacing = 22;
    const radius = 170;
    let width = 0;
    let height = 0;
    let cells = [];
    let mouse = { x: -1e3, y: -1e3 };
    let running = false;

    function resizeCanvas() {
      const ratio = Math.min(window.devicePixelRatio, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      cells = [];

      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          cells.push({
            x,
            y,
            alpha: Math.random() * 0.3,
            phase: Math.random() * 6.28,
            speed: 0.4 + Math.random() * 1.4,
          });
        }
      }
    }

    function draw(time) {
      context.clearRect(0, 0, width, height);
      for (const cell of cells) {
        const distance = Math.max(0, 1 - Math.hypot(cell.x - mouse.x, cell.y - mouse.y) / radius);
        const alpha = cell.alpha * (Math.sin(time * 0.001 * cell.speed + cell.phase) + 1) / 2 + distance * 0.85;
        if (alpha < 0.03) continue;

        const size = 2 + distance * 5;
        const red = Math.floor(77 + 62 * distance);
        const green = Math.floor(168 - 76 * distance);
        context.fillStyle = `rgba(${red}, ${green}, 255, ${alpha})`;
        context.fillRect(cell.x - size / 2, cell.y - size / 2, size, size);
      }

      if (running) requestAnimationFrame(draw);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    hero.addEventListener('pointermove', (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    });

    hero.addEventListener('pointerleave', () => {
      mouse = { x: -1e3, y: -1e3 };
    });

    if (reduced) {
      draw(0);
      return;
    }

    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        requestAnimationFrame(draw);
      } else if (!entry.isIntersecting) {
        running = false;
      }
    }).observe(hero);
  }

  function initStatementWords() {
    wordsRoot.innerHTML = wordsRoot.textContent.trim().split(/\s+/)
      .map((word) => `<span class="w">${word}</span>`)
      .join(' ');
  }

  function initServiceScroll() {
    let scrollDistance = 0;

    function updateScroll() {
      if (!hs || !hsTrack || services.length === 0) return;

      const first = services[0];
      const last = services[services.length - 1];
      scrollDistance = Math.max(0, last.offsetLeft + last.offsetWidth + first.offsetLeft - hsTrack.clientWidth);
      hs.style.height = mobile.matches ? '' : window.innerHeight + scrollDistance + 'px';
    }

    function onScroll() {
      const viewportHeight = window.innerHeight;
      const sectionRect = showcase.getBoundingClientRect();
      browser.style.setProperty('--hp', reduced ? 1 : clamp((viewportHeight - sectionRect.top) / (viewportHeight * 0.7)));

      const words = $$('.w', wordsRoot);
      const textRect = wordsRoot.getBoundingClientRect();
      const litIndex = Math.round(clamp((viewportHeight * 0.85 - textRect.top) / (textRect.height + viewportHeight * 0.3)) * words.length);
      words.forEach((word, index) => word.classList.toggle('on', reduced || index < litIndex));

      if (!mobile.matches) {
        const sectionRectHS = hs.getBoundingClientRect();
        const progress = clamp(-sectionRectHS.top / (hs.offsetHeight - viewportHeight));
        hsTrack.style.transform = `translate3d(${-progress * scrollDistance}px, 0, 0)`;
        hs.style.setProperty('--hsp', progress);
      }

      updateProcess();
    }

    updateScroll();
    onScroll();
    window.addEventListener('scroll', () => {
      if (window.__pixelNuvoScrollFrame) return;
      window.__pixelNuvoScrollFrame = requestAnimationFrame(() => {
        onScroll();
        window.__pixelNuvoScrollFrame = null;
      });
    }, { passive: true });
    window.addEventListener('resize', () => {
      updateScroll();
      onScroll();
    });
  }

  function updateProcess() {
    if (!proc || !art || !processSteps || !processItems.length) return;

    const rect = proc.getBoundingClientRect();
    const progress = reduced ? 1 : clamp(-rect.top / (proc.offsetHeight - window.innerHeight));
    const timelineProgress = Math.min(progress * 4, 3);
    const stage = Math.floor(timelineProgress);
    const vertical = !mobile.matches;
    const positions = processDots.map((dot) => vertical ? dot.offsetTop + dot.offsetHeight / 2 : dot.offsetLeft + dot.offsetWidth / 2);
    const head = positions[stage] + (positions[Math.min(3, stage + 1)] - positions[stage]) * (timelineProgress - stage);

    processSteps.style.setProperty('--f0', positions[0] + 'px');
    processSteps.style.setProperty('--fill', head - positions[0] + 'px');
    processItems.forEach((item, index) => {
      item.classList.toggle('is-lit', index <= stage);
      item.classList.toggle('is-active', index === stage);
    });

    if (art.dataset.stage !== String(stage)) {
      art.dataset.stage = String(stage);
      artUrl.textContent = URLS[stage];
    }
  }

  function initCompareSlider() {
    const compare = $('.ba');
    const rangeInput = $('input', compare);
    if (!compare || !rangeInput) return;

    let touched = false;

    const setPosition = (value) => {
      compare.style.setProperty('--pos', value + '%');
      rangeInput.value = value;
    };

    rangeInput.addEventListener('input', () => {
      touched = true;
      setPosition(Number(rangeInput.value));
    });

    if (reduced) return;

    const observer = new IntersectionObserver(([entry], obs) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();

      const keyframes = [50, 78, 24, 50];
      const segmentDuration = 800;
      const startTime = performance.now();

      const animate = (now) => {
        if (touched) return;
        const progress = (now - startTime) / segmentDuration;
        const frameIndex = Math.floor(progress);
        if (frameIndex >= keyframes.length - 1) return setPosition(50);

        const localProgress = progress - frameIndex;
        const eased = localProgress < 0.5
          ? 2 * localProgress * localProgress
          : 1 - Math.pow(-2 * localProgress + 2, 2) / 2;

        const nextValue = keyframes[frameIndex] + (keyframes[frameIndex + 1] - keyframes[frameIndex]) * eased;
        setPosition(nextValue);
        requestAnimationFrame(animate);
      };

      setTimeout(() => requestAnimationFrame(animate), 400);
    }, { threshold: 0.5 });

    observer.observe(compare);
  }

  function initTeamPanels() {
    const mates = $$('.mate');
    if (!mates.length) return;

    const open = (mate) => {
      mates.forEach((item) => {
        const isOpen = item === mate;
        item.classList.toggle('is-open', isOpen);
        $('.mate__tab', item).setAttribute('aria-expanded', String(isOpen));
      });
    };

    mates.forEach((mate) => {
      $('.mate__tab', mate).addEventListener('click', () => open(mate));
      if (!finePointer) return;
      mate.addEventListener('mouseenter', () => open(mate));
    });
  }

  function init() {
    initScrollSpy();
    initHeroInteraction();
    initHeroCircuit();
    initPixelCloud();
    initStatementWords();
    initServiceScroll();
    initCompareSlider();
    initTeamPanels();
  }

  return { init };
})();

pixelNuvoHome.init();
