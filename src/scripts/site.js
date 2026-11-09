(() => {
  const reducedMotionQuery = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  );
  let reducedMotion = reducedMotionQuery.matches;
  const header = document.querySelector('.site-header');
  const pageProgress = document.createElement('div');
  pageProgress.className = 'page-progress';
  pageProgress.innerHTML = '<i aria-hidden="true"></i>';
  document.body.prepend(pageProgress);

  const menu = document.querySelector('.menu');
  const nav = document.querySelector('#primary-nav');
  let menuReturn;
  const closeMenu = () => {
    if (!menu || !nav) return;
    menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    if (menuReturn) menuReturn.focus();
  };
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') === 'true';
      menuReturn = menu;
      menu.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      if (!open) nav.querySelector('a')?.focus();
    });
    nav
      .querySelectorAll('a')
      .forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'Escape' &&
        menu.getAttribute('aria-expanded') === 'true'
      )
        closeMenu();
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window))
    revealItems.forEach((item) => item.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver(
      (entries, instance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            instance.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );
    revealItems.forEach((item) => observer.observe(item));
  }

  const visual = document.querySelector('[data-resolving-field]');
  let ticking = false;
  const updateScroll = () => {
    const scrollMax =
      document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty(
      '--page-progress',
      `${scrollMax ? (window.scrollY / scrollMax) * 100 : 0}%`,
    );
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
    ticking = false;
  };
  const requestScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScroll);
      ticking = true;
    }
  };
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll, { passive: true });
  updateScroll();
  const applyReducedMotion = (enabled) => {
    reducedMotion = enabled;
    if (enabled) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      visual?.style.setProperty('--mx', '0');
      visual?.style.setProperty('--my', '0');
    } else {
      visual?.classList.remove('is-resolved');
      requestScroll();
    }
  };
  reducedMotionQuery.addEventListener?.('change', (event) =>
    applyReducedMotion(event.matches),
  );

  if (visual && !reducedMotion) {
    visual.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const rect = visual.getBoundingClientRect();
      visual.style.setProperty(
        '--mx',
        ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3),
      );
      visual.style.setProperty(
        '--my',
        ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3),
      );
    });
    visual.addEventListener('pointerleave', () => {
      visual.style.setProperty('--mx', '0');
      visual.style.setProperty('--my', '0');
    });
  }

  const capabilityCopy = {
    identity: [
      'Build a recognisable identity.',
      'Brand strategy, visual identity, typography and colour give an idea a clear and consistent expression.',
      '01 / 02',
    ],
    digital: [
      'Carry the identity into use.',
      'Website design, UI/UX and interaction bring the same character into a clear digital experience.',
      '02 / 02',
    ],
  };
  const capabilityFrame = document.querySelector('[data-capability-frame]');
  document.querySelectorAll('[data-capability]').forEach((control) =>
    control.addEventListener('click', () => {
      const mode = control.dataset.capability;
      document
        .querySelectorAll('[data-capability]')
        .forEach((item) =>
          item.setAttribute('aria-pressed', String(item === control)),
        );
      if (capabilityFrame) capabilityFrame.dataset.mode = mode;
      const [title, copy, progress] = capabilityCopy[mode];
      document
        .querySelector('[data-capability-title]')
        ?.replaceChildren(document.createTextNode(title));
      document
        .querySelector('[data-capability-copy]')
        ?.replaceChildren(document.createTextNode(copy));
      const progressNode = document.querySelector('[data-capability-progress]');
      if (progressNode) progressNode.textContent = progress;
    }),
  );

  const studioSteps = [...document.querySelectorAll('[data-studio-step]')];
  const studioButtons = [...document.querySelectorAll('[data-studio-stage]')];
  const methodIndex = document.querySelector('[data-method-index]');
  const methodWord = document.querySelector('[data-method-word]');
  const methodVisual = document.querySelector('.method-visual');
  const activateStudio = (index) => {
    studioSteps.forEach((step, i) =>
      step.classList.toggle('is-active', i === index),
    );
    studioButtons.forEach((button, i) =>
      button.setAttribute('aria-pressed', String(i === index)),
    );
    if (methodIndex) methodIndex.textContent = `0${index + 1}`;
    if (methodWord)
      methodWord.textContent = ['Recognise', 'Translate', 'Test', 'Carry'][
        index
      ];
    if (methodVisual) methodVisual.dataset.active = String(index);
  };
  studioButtons.forEach((button) =>
    button.addEventListener('click', () =>
      activateStudio(Number(button.dataset.studioStage)),
    ),
  );
  if (studioSteps.length && !reducedMotion) {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            activateStudio(Number(entry.target.dataset.studioStep));
        }),
      { threshold: 0.55 },
    );
    studioSteps.forEach((step) => observer.observe(step));
  } else if (studioSteps.length) activateStudio(0);
})();
