(() => {
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
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
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu();
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) revealItems.forEach((item) => item.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); instance.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .08 });
    revealItems.forEach((item) => observer.observe(item));
  }

  const visual = document.querySelector('[data-resolving-field]');
  const hero = document.querySelector('.hero-field');
  if (reducedMotion && visual) {
    visual.classList.add('is-resolved');
    hero?.style.setProperty('--hero-p', '1');
    if (hero) hero.dataset.stage = '3';
  }
  let ticking = false;
  const updateScroll = () => {
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty('--page-progress', `${scrollMax ? (window.scrollY / scrollMax) * 100 : 0}%`);
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
    if (hero && !reducedMotion && window.innerWidth > 800) {
      const rect = hero.getBoundingClientRect();
      const range = Math.max(1, hero.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / range));
      hero.style.setProperty('--hero-p', progress.toFixed(3));
      hero.dataset.stage = String(Math.min(3, Math.floor(progress * 4)));
    }
    ticking = false;
  };
  const requestScroll = () => { if (!ticking) { window.requestAnimationFrame(updateScroll); ticking = true; } };
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll, { passive: true });
  updateScroll();
  const applyReducedMotion = (enabled) => {
    reducedMotion = enabled;
    if (enabled) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      visual?.classList.add('is-resolved');
      hero?.style.setProperty('--hero-p', '1');
      if (hero) hero.dataset.stage = '3';
    } else {
      visual?.classList.remove('is-resolved');
      requestScroll();
    }
  };
  reducedMotionQuery.addEventListener?.('change', (event) => applyReducedMotion(event.matches));

  if (visual && !reducedMotion) {
    visual.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const rect = visual.getBoundingClientRect();
      visual.style.setProperty('--mx', (((event.clientX - rect.left) / rect.width) - .5).toFixed(3));
      visual.style.setProperty('--my', (((event.clientY - rect.top) / rect.height) - .5).toFixed(3));
    });
    visual.addEventListener('pointerleave', () => { visual.style.setProperty('--mx', '0'); visual.style.setProperty('--my', '0'); });
  }

  const stageButton = document.querySelector('[data-stage-toggle]');
  if (stageButton && visual) stageButton.addEventListener('click', () => {
    const resolved = visual.classList.toggle('is-resolved');
    stageButton.setAttribute('aria-pressed', String(resolved));
    stageButton.querySelector('[data-stage-label]').textContent = resolved ? 'Return to mark' : 'Resolve the field';
  });

  const capabilityCopy = {
    identity: ['Make it recognisable.', 'Direction, type, colour and visual communication give an idea a shape people can remember.', '01 / 03'],
    translation: ['Carry the character through.', 'Rules, relationships and a visual grammar translate the identity into a system people can use.', '02 / 03'],
    interface: ['Make it usable.', 'Websites, interfaces and interaction carry that idea into the places people actually use it.', '03 / 03']
  };
  const capabilityFrame = document.querySelector('[data-capability-frame]');
  document.querySelectorAll('[data-capability]').forEach((control) => control.addEventListener('click', () => {
    const mode = control.dataset.capability;
    document.querySelectorAll('[data-capability]').forEach((item) => item.setAttribute('aria-pressed', String(item === control)));
    if (capabilityFrame) capabilityFrame.dataset.mode = mode;
    const [title, copy, progress] = capabilityCopy[mode];
    document.querySelector('[data-capability-title]')?.replaceChildren(document.createTextNode(title));
    document.querySelector('[data-capability-copy]')?.replaceChildren(document.createTextNode(copy));
    const progressNode = document.querySelector('[data-capability-progress]');
    if (progressNode) progressNode.textContent = progress;
  }));

  const studioSteps = [...document.querySelectorAll('[data-studio-step]')];
  const studioButtons = [...document.querySelectorAll('[data-studio-stage]')];
  const methodIndex = document.querySelector('[data-method-index]');
  const methodWord = document.querySelector('[data-method-word]');
  const activateStudio = (index) => {
    studioSteps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    studioButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    if (methodIndex) methodIndex.textContent = `0${index + 1}`;
    if (methodWord) methodWord.textContent = ['Recognise', 'Translate', 'Test', 'Carry through'][index];
  };
  studioButtons.forEach((button) => button.addEventListener('click', () => activateStudio(Number(button.dataset.studioStage))));
  if (studioSteps.length && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) activateStudio(Number(entry.target.dataset.studioStep));
    }), { threshold: .55 });
    studioSteps.forEach((step) => observer.observe(step));
  } else if (studioSteps.length) activateStudio(0);
})();
