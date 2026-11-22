import { expect, test, type Page } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';

const routes = [
  { path: '/', heading: /A clear brand|identity into interface/i, name: 'home' },
  { path: '/work/', heading: /Work/i, name: 'work' },
  { path: '/capabilities/', heading: 'Capabilities.', name: 'capabilities' },
  { path: '/studio/', heading: 'Studio.', name: 'studio' },
  { path: '/archex-craft/', heading: /Archex Craft/i, name: 'archex-craft' },
  { path: '/contact/', heading: /contact|conversation/i, name: 'contact' },
];

const viewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1800, height: 1000 },
];

const evidenceDir = 'artifacts/stage-03.1/playwright';

async function settleRevealsForScreenshot(page: Page) {
  await page.locator('.reveal').evaluateAll((sections) => {
    sections.forEach((section) => section.classList.add('is-visible'));
  });
  await page.addStyleTag({
    content: '.reveal { opacity: 1 !important; transform: none !important; }',
  });
  await page.waitForTimeout(700);
}

async function collectPageErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('response', (response) => {
    if (
      response.status() >= 400 &&
      new URL(response.url()).origin === new URL(page.url()).origin
    ) {
      errors.push(`HTTP ${response.status()}: ${response.url()}`);
    }
  });
  page.on('requestfailed', (request) => {
    const failure = request.failure()?.errorText ?? 'unknown request failure';
    if (
      new URL(request.url()).origin === new URL(page.url()).origin &&
      !failure.includes('ERR_ABORTED')
    ) {
      errors.push(`request failed: ${request.url()} (${failure})`);
    }
  });
  return errors;
}

test.beforeAll(async () => {
  await mkdir(evidenceDir, { recursive: true });
});

test('all six routes render at every requested viewport without overflow', async ({
  page,
}) => {
  const errors = await collectPageErrors(page);

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      const response = await page.goto(route.path);
      expect(response?.status(), `${route.path} at ${viewport.width}px`).toBe(
        200,
      );
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('main h1')).toContainText(route.heading);
      await expect(
        page.locator('.site-header .nav-cta'),
        `${route.path} header Contact label`,
      ).toContainText(/Discuss a Project|Contact/i);
      if (viewport.width <= 800) {
        await expect(page.locator('.site-header .menu')).toBeVisible();
        await expect(page.locator('#primary-nav')).not.toBeVisible();
      } else {
        await expect(page.locator('#primary-nav')).toBeVisible();
      }

      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      expect(
        dimensions.document,
        `${route.path} document overflow at ${viewport.width}px`,
      ).toBeLessThanOrEqual(viewport.width);
      expect(
        dimensions.body,
        `${route.path} body overflow at ${viewport.width}px`,
      ).toBeLessThanOrEqual(viewport.width);
      expect(dimensions.viewport).toBe(viewport.width);
    }
  }

  expect(errors, 'browser console, page, or first-party HTTP errors').toEqual(
    [],
  );
});

test('all internal links resolve to a page', async ({ page, request }) => {
  const destinations = new Set<string>();
  for (const route of routes) {
    await page.goto(route.path);
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).href),
      );
    hrefs.forEach((href) => destinations.add(new URL(href).pathname));
  }
  for (const path of destinations) {
    const response = await request.get(path);
    expect(response.status(), `internal destination ${path}`).toBe(200);
  }
});

test('homepage CTAs and story sections lead to real destinations', async ({
  page,
}) => {
  const errors = await collectPageErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { level: 1 }),
  ).toContainText(/A clear brand/i);
  await expect(
    page.getByRole('heading', { name: /Brand & Interface|our first project/i }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /two sides/i })).toBeVisible();
  await expect(page.locator('.hero-label')).toContainText(
    /Identity-to-Interface|Brand Identity/i,
  );
  await expect(page.locator('.hero-label')).not.toContainText(
    /Living Grid|01—05/,
  );
  await expect(page.locator('.hero-field')).not.toContainText(
    /conceptual specimen|field note|form\s*\/\s*signal\s*\/\s*use|X\s*\/\s*04|Y\s*\/\s*18/i,
  );

  const contactLink = page
    .locator('.site-header')
    .getByRole('link', { name: /Discuss a Project|Contact/i });
  await expect(contactLink).toHaveAttribute('href', '/contact/');
  await contactLink.click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.locator('main h1')).toContainText(/contact|conversation/i);

  await page.goto('/');
  await expect(page.locator('.hero-field')).not.toHaveAttribute('data-stage');
  await page
    .locator('.cta-band')
    .getByRole('link', { name: /Discuss a project|Contact/i })
    .click();
  await expect(page).toHaveURL(/\/contact\/$/);
  expect(errors).toEqual([]);
});

test('Work exposes featured case study and upcoming commissions', async ({
  page,
}) => {
  await page.goto('/work/');
  await expect(page.locator('.archive-lead .eyebrow')).toContainText(
    /Archex Studio's first project|FEATURED CASE STUDY/i,
  );
  await expect(
    page.locator('.archive-grid .archive-lead a[href="/archex-craft/"]'),
  ).toBeVisible();
  await expect(
    page.locator('.archive-grid').getByRole('link', { name: /View project overview|View case study/i }),
  ).toHaveAttribute('href', '/archex-craft/');
  await expect(
    page.locator('.archive-grid').getByRole('link', { name: /Visit the live website|Visit live website/i }),
  ).toHaveAttribute('href', 'https://craft.archexweb.in');
  await expect(page.locator('.archive-grid .archive-lead')).toHaveCount(1);
  await expect(page.locator('.archive-commission')).toBeVisible();
  await expect(page.locator('.archive-commission')).toContainText('Collaborate with Archex Studio');
});

test('Capabilities explains the two equal disciplines and the connecting direction', async ({
  page,
}) => {
  await page.goto('/capabilities/');
  await expect(page.getByText('Brand Identity', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Digital Experience', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Creative Direction', { exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('.section-header .section-intro').first(),
  ).toContainText(
    /select Brand Identity or Digital Experience.*see how.*carries/i,
  );
  await expect(
    page.locator('.capability-groups li').filter({ hasText: 'UI/UX design' }),
  ).toBeVisible();
  await page.getByRole('button', { name: /digital experience/i }).click();
  await expect(page.locator('[data-capability-frame]')).toHaveAttribute(
    'data-mode',
    'digital',
  );
  await expect(page.locator('[data-capability-progress]')).toHaveText(
    '02 / 02',
  );
  await expect(page.locator('[data-capability-title]')).toHaveText(
    'Carry the identity into use.',
  );
});

test('Studio presents the four method stages and their explanations', async ({
  page,
}) => {
  await page.goto('/studio/');
  await expect(
    page.getByRole('heading', {
      name: /distinctive is not enough.*hold together/i,
    }),
  ).toBeVisible();
  const stages = [
    ['Recognise', /underlying idea, context, and identity/i],
    ['Translate', /coherent visual and experiential language/i],
    ['Test', /behave across interfaces and applications/i],
    ['Carry', /coherent across situations and interactions/i],
  ] as const;
  for (const [name, description] of stages) {
    const step = page
      .locator('.method-step')
      .filter({ has: page.getByRole('heading', { name, exact: true }) });
    await expect(step).toBeVisible();
    await expect(step).toContainText(description);
  }
  await page.getByRole('button', { name: 'Test', exact: true }).click();
  await expect(page.locator('.method-visual')).toHaveAttribute(
    'data-active',
    '2',
  );
});

test('Contact presents the design enquiry channel and direct touchpoints', async ({
  page,
}) => {
  await page.goto('/contact/');
  await expect(page.locator('.form-card')).toBeVisible();
  await expect(page.locator('#studioEnquiryForm')).toBeVisible();
  await expect(page.locator('a[href^="mailto:hello@archexweb.in"]')).toBeVisible();
  await expect(page.locator('.direct-channels-card a[href*="archexweb.in/contact"]')).toBeVisible();
});

test('Contact form submits design enquiry to Formspree and shows confirmation', async ({
  page,
}) => {
  let submittedRequest: { method: string; url: string; hasPostData: boolean } | null = null;

  await page.route('https://formspree.io/f/moedkeal', async (route) => {
    submittedRequest = {
      method: route.request().method(),
      url: route.request().url(),
      hasPostData: Boolean(route.request().postData()),
    };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto('/contact/');
  await page.selectOption('#designRequirement', 'brand-identity');
  await page.fill('#fullName', 'Aarav Mehta');
  await page.fill('#email', 'aarav@company.com');
  await page.fill('#companyName', 'Studio Craft Ltd.');
  await page.fill('#projectBrief', 'Looking to craft a new identity and brand system.');

  await page.click('#studioSubmitBtn');

  await expect(page.locator('#studioFormAlert')).toBeVisible();
  await expect(page.locator('#studioFormAlert')).toContainText(/Brief received with thanks/i);
  expect(submittedRequest).not.toBeNull();
  expect(submittedRequest?.method).toBe('POST');
  expect(submittedRequest?.url).toBe('https://formspree.io/f/moedkeal');

  // Form should be reset
  await expect(page.locator('#fullName')).toHaveValue('');
  await expect(page.locator('#email')).toHaveValue('');
});

test('Contact form displays error alert when submission fails', async ({
  page,
}) => {
  await page.route('https://formspree.io/f/moedkeal', async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        errors: [{ message: 'Rate limit reached or invalid address' }],
      }),
    });
  });

  await page.goto('/contact/');
  await page.selectOption('#designRequirement', 'brand-identity');
  await page.fill('#fullName', 'Aarav Mehta');
  await page.fill('#email', 'aarav@company.com');
  await page.fill('#projectBrief', 'Brief test content.');

  await page.click('#studioSubmitBtn');

  await expect(page.locator('#studioFormErrorAlert')).toBeVisible();
  await expect(page.locator('#studioFormErrorAlert')).toContainText(/Rate limit reached or invalid address/i);
  await expect(page.locator('#studioFormAlert')).not.toBeVisible();
});

test('first-time visitor copy avoids internal status and implementation language', async ({
  page,
}) => {
  for (const route of [
    '/',
    '/work/',
    '/capabilities/',
    '/studio/',
    '/archex-craft/',
    '/contact/',
  ]) {
    await page.goto(route);
    const visiblePage = page.locator('main');
    await expect(visiblePage).not.toContainText(
      /Living Grid|evidence pending|not indexable|not provided|open project framework|contact \/ channel in preparation/i,
    );
  }
});

test('mobile navigation opens, navigates, closes, and responds to Escape', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const menu = page
    .locator('.site-header')
    .getByRole('button', { name: 'Menu' });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  await page.screenshot({ path: `${evidenceDir}/navigation-mobile-open.png` });
  await page
    .getByRole('navigation', { name: 'Primary' })
    .getByRole('link', { name: 'Work' })
    .click();
  await expect(page).toHaveURL(/\/work\/$/);

  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
});

test('Archex Craft remains noindex and excluded from the sitemap; public routes are indexable', async ({
  page,
  request,
}) => {
  for (const route of routes) {
    await page.goto(route.path);
    if (route.path === '/archex-craft/') {
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex,nofollow',
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    } else {
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'index,follow',
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    }
  }
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).not.toContain('archex-craft');
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Allow: /');
  expect(await robots.text()).toContain('Disallow: /archex-craft/');
  await page.goto('/archex-craft/');
  await expect(page.locator('main')).not.toContainText(
    /indexable|evidence pending|not provided/i,
  );
  await expect(
    page.getByRole('link', { name: 'Visit the live website' }),
  ).toHaveAttribute('href', 'https://craft.archexweb.in');
  await expect(
    page.getByRole('link', { name: 'Return to Work' }),
  ).toHaveAttribute('href', '/work/');
});

test('reduced motion keeps the homepage complete and navigable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await expect(page.locator('.hero-field')).not.toHaveAttribute('data-stage');
  await expect(
    page.getByRole('heading', { name: /identity into interface/i }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /two sides/i })).toBeVisible();
  await expect(
    page
      .locator('.site-header')
      .getByRole('link', { name: /Discuss a Project|Contact/i }),
  ).toBeVisible();
  await page.screenshot({
    path: `${evidenceDir}/home-reduced-motion.png`,
    fullPage: true,
  });
});

test('homepage editorial sections reveal when scrolled into view', async ({
  page,
}) => {
  await page.goto('/');
  const section = page.locator('section.reveal').first();
  await expect(section).not.toHaveClass(/is-visible/);
  await section.evaluate((element) => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({
      top: (element as HTMLElement).offsetTop,
      behavior: 'instant',
    });
  });
  await expect(section).toHaveClass(/is-visible/);
});

test('homepage and affected routes produce requested visual evidence', async ({
  page,
}) => {
  test.setTimeout(60000);
  const cases = [
    { route: '/', name: 'home' },
    { route: '/work/', name: 'work' },
    { route: '/capabilities/', name: 'capabilities' },
    { route: '/studio/', name: 'studio' },
    { route: '/archex-craft/', name: 'archex-craft' },
    { route: '/contact/', name: 'contact' },
  ];
  for (const { route, name } of cases) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    await settleRevealsForScreenshot(page);
    await page.screenshot({
      path: `${evidenceDir}/${name}-desktop.png`,
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await settleRevealsForScreenshot(page);
    await page.screenshot({
      path: `${evidenceDir}/${name}-mobile.png`,
      fullPage: true,
    });
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('.specimen').waitFor({ state: 'visible' });
  await settleRevealsForScreenshot(page);
  await page.screenshot({ path: `${evidenceDir}/home-desktop-first.png` });
  await page.screenshot({
    path: `${evidenceDir}/home-desktop-full.png`,
    fullPage: true,
  });
  const diagnostics: Record<string, unknown> = {};
  const measureHero = async (width: number, height: number, name: string) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.locator('.specimen').waitFor({ state: 'visible' });
    const metrics = await page.evaluate(() => {
      const heroNode = document.querySelector<HTMLElement>('.hero-field')!;
      const wrapper = document.querySelector<HTMLElement>('.hero-inner')!;
      const heading = document.querySelector<HTMLElement>('.hero-copy h1')!;
      const support = document.querySelector<HTMLElement>('.hero-copy p')!;
      const actions = document.querySelector<HTMLElement>('.hero-actions')!;
      const specimen = document.querySelector<HTMLElement>('.specimen')!;
      const next = heroNode.nextElementSibling as HTMLElement;
      const box = (node: HTMLElement) => {
        const rect = node.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      };
      return {
        viewport: { width: innerWidth, height: innerHeight },
        hero: box(heroNode),
        wrapper: box(wrapper),
        nextSection: box(next),
        heading: box(heading),
        supportingText: box(support),
        actions: box(actions),
        specimen: box(specimen),
        heroPosition: getComputedStyle(heroNode).position,
        wrapperPosition: getComputedStyle(wrapper).position,
        heroScrollDistance: heroNode.offsetHeight,
        documentScrollHeight: document.documentElement.scrollHeight,
      };
    });
    const flowAllowance = width <= 800 ? 1.3 : 1.1;
    expect(metrics.hero.height).toBeLessThanOrEqual(height * flowAllowance);
    expect(metrics.wrapperPosition).not.toBe('sticky');
    expect(metrics.heroPosition).not.toBe('fixed');
    expect(metrics.heading.y + metrics.heading.height).toBeLessThan(height);
    expect(
      metrics.supportingText.y + metrics.supportingText.height,
    ).toBeLessThan(height);
    expect(metrics.actions.y + metrics.actions.height).toBeLessThan(height);
    expect(metrics.specimen.y).toBeLessThan(height);
    expect(metrics.nextSection.y).toBeLessThanOrEqual(height * 1.25);
    diagnostics[name] = metrics;
    await page.screenshot({ path: `${evidenceDir}/hero-${name}.png` });
    return metrics;
  };
  await measureHero(1440, 900, '1440x900');
  await page.evaluate(() =>
    window.scrollTo({ top: innerHeight * 0.5, behavior: 'instant' }),
  );
  await page.screenshot({
    path: `${evidenceDir}/home-after-half-viewport.png`,
  });
  diagnostics.afterHalfViewport = await page.evaluate(() => ({
    scrollY: scrollY,
    heroTop: document.querySelector('.hero-field')!.getBoundingClientRect().top,
    headingTop: document.querySelector('.hero-copy h1')!.getBoundingClientRect()
      .top,
  }));
  await page.evaluate(() =>
    window.scrollTo({ top: innerHeight, behavior: 'instant' }),
  );
  await page.screenshot({ path: `${evidenceDir}/home-after-one-viewport.png` });
  diagnostics.afterOneViewport = await page.evaluate(() => ({
    scrollY: scrollY,
    heroTop: document.querySelector('.hero-field')!.getBoundingClientRect().top,
    headingTop: document.querySelector('.hero-copy h1')!.getBoundingClientRect()
      .top,
  }));
  await page.evaluate(() =>
    window.scrollTo({
      top: document.querySelector('.hero-field')!.clientHeight,
      behavior: 'instant',
    }),
  );
  await page.screenshot({
    path: `${evidenceDir}/home-first-following-section.png`,
  });
  diagnostics.firstFollowingSection = await page
    .locator('.hero-field')
    .evaluate((node) => ({
      heroHeight: node.clientHeight,
      nextSectionTop: node.nextElementSibling!.getBoundingClientRect().top,
    }));
  await measureHero(1024, 768, '1024x768');
  await measureHero(1800, 1000, '1800x1000');
  await measureHero(390, 844, '390x844');
  await measureHero(375, 812, '375x812');
  await measureHero(768, 1024, '768x1024');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('.specimen').waitFor({ state: 'visible' });
  await page.screenshot({
    path: `${evidenceDir}/home-reduced-motion.png`,
    fullPage: true,
  });
  diagnostics.reducedMotion = await page
    .locator('.hero-field')
    .evaluate((node) => ({
      heroHeight: node.clientHeight,
      position: getComputedStyle(node).position,
      wrapperPosition: getComputedStyle(node.querySelector('.hero-inner')!)
        .position,
    }));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await settleRevealsForScreenshot(page);
  await page.screenshot({ path: `${evidenceDir}/home-1440x900.png` });
  await page.screenshot({
    path: `${evidenceDir}/home-desktop-initial-viewport.png`,
  });
  await readFile(`${evidenceDir}/home-desktop-full.png`);
  const { writeFile } = await import('node:fs/promises');
  await writeFile(
    `${evidenceDir}/hero-diagnostics.json`,
    JSON.stringify(diagnostics, null, 2),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await settleRevealsForScreenshot(page);
  await page.screenshot({ path: `${evidenceDir}/home-mobile-first.png` });
  await page.screenshot({
    path: `${evidenceDir}/home-mobile-full.png`,
    fullPage: true,
  });

  const visualReview = [
    ['Homepage · desktop first viewport', 'home-desktop-first.png'],
    ['Homepage · desktop full page', 'home-desktop-full.png'],
    ['Hero · 1440 × 900 initial', 'hero-1440x900.png'],
    ['Hero · half viewport scroll', 'home-after-half-viewport.png'],
    ['Hero · one viewport scroll', 'home-after-one-viewport.png'],
    ['Hero · following section', 'home-first-following-section.png'],
    ['Hero · 1024 × 768', 'hero-1024x768.png'],
    ['Hero · 1800 × 1000', 'hero-1800x1000.png'],
    ['Hero · 390 × 844', 'hero-390x844.png'],
    ['Hero · 375 × 812', 'hero-375x812.png'],
    ['Hero · 768 × 1024', 'hero-768x1024.png'],
    ['Homepage · mobile first viewport', 'home-mobile-first.png'],
    ['Homepage · mobile full page', 'home-mobile-full.png'],
    ['Work · desktop', 'work-desktop.png'],
    ['Work · mobile', 'work-mobile.png'],
    ['Capabilities · desktop', 'capabilities-desktop.png'],
    ['Capabilities · mobile', 'capabilities-mobile.png'],
    ['Studio · desktop', 'studio-desktop.png'],
    ['Studio · mobile', 'studio-mobile.png'],
    ['Archex Craft · desktop', 'archex-craft-desktop.png'],
    ['Archex Craft · mobile', 'archex-craft-mobile.png'],
    ['Contact · desktop', 'contact-desktop.png'],
    ['Contact · mobile', 'contact-mobile.png'],
    ['Mobile navigation · open', 'navigation-mobile-open.png'],
    ['Homepage · reduced motion', 'home-reduced-motion.png'],
  ];
  const cards = await Promise.all(
    visualReview.map(async ([title, filename]) => {
      const image = await readFile(`${evidenceDir}/${filename}`);
      return `<figure><figcaption>${title}</figcaption><img alt="${title}" src="data:image/png;base64,${image.toString('base64')}" /></figure>`;
    }),
  );
  const contactSheet = await page.context().newPage();
  await contactSheet.setViewportSize({ width: 1680, height: 1000 });
  await contactSheet.setContent(
    `<!doctype html><html lang="en"><meta charset="utf-8"><title>Stage 03.1 Visual Review</title><style>body{margin:0;padding:28px;background:#e8e5dd;color:#171717;font:16px Arial,sans-serif}h1{margin:0 0 20px;font:32px Georgia,serif}main{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}figure{margin:0;padding:14px;background:#f7f5ef;border:1px solid #c8c3b7}figcaption{margin-bottom:10px;font-size:15px;font-weight:600}img{display:block;width:100%;height:640px;object-fit:contain;background:#dedbd4}</style><h1>Archex Studio · Stage 03.1 visual review</h1><main>${cards.join('')}</main></html>`,
  );
  await contactSheet.screenshot({
    path: `${evidenceDir}/STAGE-03.1-VISUAL-REVIEW.png`,
    fullPage: true,
  });
  await contactSheet.close();
});
