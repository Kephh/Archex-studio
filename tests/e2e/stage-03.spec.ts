import { expect, test, type Page } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';

const routes = [
  { path: '/', heading: /identity into interface/i, name: 'home' },
  { path: '/work/', heading: 'Work.', name: 'work' },
  { path: '/capabilities/', heading: 'Capabilities.', name: 'capabilities' },
  { path: '/studio/', heading: 'Studio.', name: 'studio' },
  { path: '/archex-web/', heading: 'Archex Web.', name: 'archex-web' },
  { path: '/contact/', heading: 'Contact.', name: 'contact' },
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
      ).toHaveText('Contact');
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
    page.getByRole('heading', { name: /identity into interface/i }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /our first project.*archex web/i }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /two sides/i })).toBeVisible();
  await expect(page.locator('.hero-label')).toContainText(
    'Identity-to-Interface Studio',
  );
  await expect(page.locator('.hero-label')).not.toContainText(
    /Living Grid|01—05/,
  );
  await expect(page.locator('.hero-field')).not.toContainText(
    /conceptual specimen|field note|form\s*\/\s*signal\s*\/\s*use|X\s*\/\s*04|Y\s*\/\s*18/i,
  );

  const contactLink = page
    .locator('.site-header')
    .getByRole('link', { name: 'Contact', exact: true });
  await expect(contactLink).toHaveAttribute('href', '/contact/');
  await contactLink.click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.locator('main h1')).toHaveText('Contact.');

  await page.goto('/');
  const exploreSystem = page.locator('[data-stage-toggle]');
  const exploreSystemLabel = page.locator('[data-stage-label]');
  await expect(exploreSystemLabel).toHaveText('Explore the system');
  await exploreSystem.click();
  await expect(exploreSystem).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-stage-toggle]')).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(exploreSystemLabel).toHaveText('Return to the starting point');
  await page
    .locator('.cta-band')
    .getByRole('link', { name: 'Contact', exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact\/$/);
  expect(errors).toEqual([]);
});

test('Work exposes one available first project and exactly three inert reserved positions', async ({
  page,
}) => {
  await page.goto('/work/');
  await expect(page.locator('.archive-lead .eyebrow')).toContainText(
    "Archex Studio's first project",
  );
  await expect(
    page.locator('.archive-grid .archive-lead a[href="/archex-web/"]'),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'View project overview' }),
  ).toHaveAttribute('href', '/archex-web/');
  await expect(
    page.getByRole('link', { name: 'Visit the live website' }),
  ).toHaveAttribute('href', 'https://www.archexweb.in');
  await expect(page.locator('.archive-grid .archive-lead')).toHaveCount(1);
  const reserved = page.locator('.archive-reserved article');
  await expect(reserved).toHaveCount(3);
  await expect(reserved.nth(0)).toContainText('Future position 01');
  await expect(reserved.nth(1)).toContainText('Future position 02');
  await expect(reserved.nth(2)).toContainText('Future position 03');
  for (const position of await reserved.all()) {
    await expect(position).toContainText(
      'Position reserved for a future project.',
    );
  }
  await expect(
    page.locator('.archive-reserved a, .archive-reserved button'),
  ).toHaveCount(0);
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

test('Contact explains the unavailable enquiry channel without a fake form', async ({
  page,
}) => {
  await page.goto('/contact/');
  await expect(
    page.getByText(/enquiry channel is being prepared/i),
  ).toBeVisible();
  await expect(
    page.getByText(
      /our enquiry channel is being prepared.*not accepting enquiries yet/i,
    ),
  ).toBeVisible();
  await expect(page.locator('main')).not.toContainText(
    /not connected|no form|submission service|no contact method|response promise/i,
  );
  await expect(page.locator('.site-header a.nav-cta')).toHaveText('Contact');
  await expect(
    page.locator(
      'main form, main input, main textarea, main button[type="submit"]',
    ),
  ).toHaveCount(0);
  await expect(page.locator('a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(
    0,
  );
});

test('first-time visitor copy avoids internal status and implementation language', async ({
  page,
}) => {
  for (const route of [
    '/',
    '/work/',
    '/capabilities/',
    '/studio/',
    '/archex-web/',
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

test('Archex Web remains noindex and excluded from the sitemap; preview pages stay non-indexable', async ({
  page,
  request,
}) => {
  for (const route of routes) {
    await page.goto(route.path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex,nofollow',
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  }
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).not.toContain('archex-web');
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Disallow: /');
  await page.goto('/archex-web/');
  await expect(page.locator('main')).toContainText('Our first project.');
  await expect(page.locator('main')).not.toContainText(
    /indexable|evidence pending|not provided/i,
  );
  await expect(
    page.getByRole('link', { name: 'Visit the live website' }),
  ).toHaveAttribute('href', 'https://www.archexweb.in');
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
  await expect(page.locator('.hero-field')).toHaveAttribute('data-stage', '3');
  await expect(
    page.getByRole('heading', { name: /identity into interface/i }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /two sides/i })).toBeVisible();
  await expect(
    page
      .locator('.site-header')
      .getByRole('link', { name: 'Contact', exact: true }),
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
  const cases = [
    { route: '/', name: 'home' },
    { route: '/work/', name: 'work' },
    { route: '/capabilities/', name: 'capabilities' },
    { route: '/studio/', name: 'studio' },
    { route: '/archex-web/', name: 'archex-web' },
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
  await settleRevealsForScreenshot(page);
  await page.screenshot({ path: `${evidenceDir}/home-desktop-first.png` });
  await page.screenshot({
    path: `${evidenceDir}/home-desktop-full.png`,
    fullPage: true,
  });
  const hero = page.locator('.hero-field');
  const heroTop = await hero.evaluate(
    (element) => (element as HTMLElement).offsetTop,
  );
  const heroRange = await hero.evaluate(
    (element) => (element as HTMLElement).offsetHeight - window.innerHeight,
  );
  for (const [index, progress] of [0.125, 0.375, 0.625, 0.875].entries()) {
    await page.evaluate(
      ({ top, range, progress: value }) =>
        window.scrollTo(0, top + range * value),
      { top: heroTop, range: heroRange, progress },
    );
    await expect(hero).toHaveAttribute('data-stage', String(index));
    const innerBox = await page.locator('.hero-inner').boundingBox();
    expect(innerBox).not.toBeNull();
    expect(innerBox!.y).toBeGreaterThan(60);
    expect(innerBox!.y).toBeLessThan(100);
    await page.screenshot({
      path: `${evidenceDir}/home-hero-stage-0${index + 1}.png`,
    });
  }
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
    ['Homepage · identity to interface 01', 'home-hero-stage-01.png'],
    ['Homepage · identity to interface 02', 'home-hero-stage-02.png'],
    ['Homepage · identity to interface 03', 'home-hero-stage-03.png'],
    ['Homepage · identity to interface 04', 'home-hero-stage-04.png'],
    ['Homepage · mobile first viewport', 'home-mobile-first.png'],
    ['Homepage · mobile full page', 'home-mobile-full.png'],
    ['Work · desktop', 'work-desktop.png'],
    ['Work · mobile', 'work-mobile.png'],
    ['Capabilities · desktop', 'capabilities-desktop.png'],
    ['Capabilities · mobile', 'capabilities-mobile.png'],
    ['Studio · desktop', 'studio-desktop.png'],
    ['Studio · mobile', 'studio-mobile.png'],
    ['Archex Web · desktop', 'archex-web-desktop.png'],
    ['Archex Web · mobile', 'archex-web-mobile.png'],
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
