import { expect, test, type Page } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const routes = [
  { path: '/', name: 'home' },
  { path: '/work/', name: 'work' },
  { path: '/capabilities/', name: 'capabilities' },
  { path: '/studio/', name: 'studio' },
  { path: '/archex-web/', name: 'archex-web' },
  { path: '/contact/', name: 'contact' },
];

const viewports = [
  { width: 320, height: 700, scale: 3, mobile: true },
  { width: 360, height: 800, scale: 3, mobile: true },
  { width: 375, height: 812, scale: 3, mobile: true },
  { width: 390, height: 844, scale: 3, mobile: true },
  { width: 414, height: 896, scale: 3, mobile: true },
  { width: 430, height: 932, scale: 3, mobile: true },
  { width: 768, height: 1024, scale: 2, mobile: true },
  { width: 820, height: 1180, scale: 2, mobile: true },
  { width: 844, height: 390, scale: 2, mobile: true },
  { width: 915, height: 412, scale: 2, mobile: true },
  { width: 1024, height: 768, scale: 1, mobile: false },
  { width: 1280, height: 800, scale: 1, mobile: false },
  { width: 1440, height: 900, scale: 1, mobile: false },
  { width: 1800, height: 1000, scale: 1, mobile: false },
];

const output = 'artifacts/stage-03.2/responsive-review';

async function settleForVisualReview(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach((section) => {
      section.classList.add('is-visible');
    });
  });
  await page.addStyleTag({
    content: `
      .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
      .hero-label span:last-child { animation: none !important; }
      .nav.is-open a { opacity: 1 !important; transform: none !important; animation: none !important; }
    `,
  });
}

test('responsive layout audit across all routes and requested viewports', async ({
  browser,
}) => {
  test.setTimeout(120_000);
  await mkdir(`${output}/home`, { recursive: true });
  await mkdir(`${output}/routes`, { recursive: true });
  const diagnostics: Record<string, unknown> = {};

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: viewport.scale,
      isMobile: viewport.mobile,
      hasTouch: viewport.mobile,
    });
    const page = await context.newPage();
    const browserErrors: string[] = [];
    page.on('pageerror', (error) =>
      browserErrors.push(`pageerror: ${error.message}`),
    );
    page.on('console', (message) => {
      if (message.type() === 'error')
        browserErrors.push(`console: ${message.text()}`);
    });
    page.on('response', (response) => {
      if (
        response.status() >= 400 &&
        new URL(response.url()).origin === new URL(page.url()).origin
      ) {
        browserErrors.push(`HTTP ${response.status()}: ${response.url()}`);
      }
    });
    page.on('requestfailed', (request) => {
      if (new URL(request.url()).origin === new URL(page.url()).origin) {
        browserErrors.push(`request failed: ${request.url()}`);
      }
    });

    for (const route of routes) {
      const response = await page.goto(route.path, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const metrics = await page.evaluate(() => {
        const box = (selector: string) => {
          const element = document.querySelector<HTMLElement>(selector);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            x: rect.x,
            y: rect.y,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
            position: style.position,
            fontSize: style.fontSize,
            overflow: style.overflow,
          };
        };
        const overflowCandidates = Array.from(
          document.querySelectorAll<HTMLElement>('*'),
        )
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return {
              selector: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${element.classList.length ? `.${Array.from(element.classList).join('.')}` : ''}`,
              x: Math.round(rect.x * 10) / 10,
              right: Math.round(rect.right * 10) / 10,
              width: Math.round(rect.width * 10) / 10,
              scrollWidth: element.scrollWidth,
              clientWidth: element.clientWidth,
              position: style.position,
            };
          })
          .filter((element) => element.x < -1 || element.right > innerWidth + 1)
          .slice(0, 20);
        const smallControls = Array.from(
          document.querySelectorAll<HTMLElement>('a,button'),
        )
          .filter((element) => {
            const style = getComputedStyle(element);
            return (
              style.display !== 'none' &&
              style.visibility !== 'hidden' &&
              Number(style.opacity) > 0.01 &&
              element.getClientRects().length > 0
            );
          })
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              text: (
                element.innerText ||
                element.getAttribute('aria-label') ||
                ''
              )
                .trim()
                .slice(0, 60),
              selector: `${element.tagName.toLowerCase()}${element.className ? `.${String(element.className).replaceAll(' ', '.')}` : ''}`,
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            };
          })
          .filter((element) => element.width < 44 || element.height < 44);
        const touchTargets = Array.from(
          document.querySelectorAll<HTMLElement>(
            '.menu, .nav a, .button, .method-control, .cap-tab, .method-mobile-controls button, .case-aside a, .archive-side a, .meta-list a, .site-footer nav a',
          ),
        )
          .filter((element) => element.getClientRects().length > 0)
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return {
              text: (
                element.innerText ||
                element.getAttribute('aria-label') ||
                ''
              )
                .trim()
                .slice(0, 60),
              selector: `${element.tagName.toLowerCase()}${element.className ? `.${String(element.className).replaceAll(' ', '.')}` : ''}`,
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              visibility: style.visibility,
              opacity: style.opacity,
            };
          });
        const clippedText = Array.from(
          document.querySelectorAll<HTMLElement>(
            'h1,h2,h3,p,small,strong,span',
          ),
        )
          .filter((element) => element.scrollWidth > element.clientWidth + 1)
          .map((element) => ({
            text: (element.innerText || '').trim().slice(0, 80),
            width: element.clientWidth,
            scrollWidth: element.scrollWidth,
          }))
          .slice(0, 20);
        const previousHtmlOverflow = document.documentElement.style.overflowX;
        const previousBodyOverflow = document.body.style.overflowX;
        document.documentElement.style.overflowX = 'visible';
        document.body.style.overflowX = 'visible';
        const unclippedDimensions = {
          documentScrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
        };
        document.documentElement.style.overflowX = previousHtmlOverflow;
        document.body.style.overflowX = previousBodyOverflow;
        return {
          viewport: {
            width: innerWidth,
            height: innerHeight,
            devicePixelRatio,
          },
          document: {
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            bodyScrollWidth: document.body.scrollWidth,
            bodyClientWidth: document.body.clientWidth,
            scrollHeight: document.documentElement.scrollHeight,
          },
          header: box('.site-header'),
          wordmark: box('.site-header .wordmark'),
          menu: box('.site-header .menu'),
          nav: box('.site-header .nav'),
          heading: box('main h1'),
          hero: box('.hero-field'),
          heroInner: box('.hero-inner'),
          heroHeading: box('.hero-copy h1'),
          heroCopy: box('.hero-copy p'),
          heroActions: box('.hero-actions'),
          specimen: box('.specimen'),
          pageIntro: box('.page-intro'),
          sectionHeader: box('.section-header'),
          archive: box('.archive-grid'),
          capabilityDemo: box('.capability-demo'),
          methodPage: box('.method-page'),
          methodVisual: box('.method-visual'),
          capabilitySpecimenCopy: box('.demo-copy'),
          capabilityTitle: box('.demo-copy strong'),
          capabilityDescription: box('.demo-copy p'),
          capabilitySpecimenLayout: (() => {
            const element = document.querySelector<HTMLElement>('.demo-copy');
            if (!element) return null;
            const style = getComputedStyle(element);
            return {
              display: style.display,
              gridTemplateColumns: style.gridTemplateColumns,
            };
          })(),
          studioControls: box('.method-mobile-controls'),
          caseLayout: box('.case-layout'),
          contactGrid: box('.contact-grid'),
          footer: box('.site-footer'),
          unclippedDimensions,
          clippedText,
          pageTitleOverflow: (() => {
            const heading =
              document.querySelector<HTMLElement>('.page-intro h1');
            return heading
              ? heading.scrollWidth > heading.clientWidth + 1
              : false;
          })(),
          heroCopySpecimenOverlap: (() => {
            const copy = document
              .querySelector('.hero-copy')
              ?.getBoundingClientRect();
            const specimen = document
              .querySelector('.specimen')
              ?.getBoundingClientRect();
            return Boolean(
              copy &&
              specimen &&
              copy.left < specimen.right &&
              copy.right > specimen.left &&
              copy.top < specimen.bottom &&
              copy.bottom > specimen.top,
            );
          })(),
          overflowCandidates,
          smallControls,
          touchTargets,
        };
      });
      diagnostics[`${route.name}@${viewport.width}x${viewport.height}`] = {
        status: response?.status(),
        ...metrics,
      };

      expect(
        response?.status(),
        `${route.name} at ${viewport.width}x${viewport.height}`,
      ).toBe(200);
      await expect(page.locator('main h1')).toBeVisible();
      expect(metrics.document.scrollWidth).toBe(viewport.width);
      expect(metrics.document.bodyScrollWidth).toBe(viewport.width);
      expect(metrics.unclippedDimensions.documentScrollWidth).toBe(
        viewport.width,
      );
      expect(metrics.unclippedDimensions.bodyScrollWidth).toBe(viewport.width);
      expect(
        metrics.pageTitleOverflow,
        `${route.name} heading at ${viewport.width}px`,
      ).toBe(false);
      if (route.name === 'home') {
        expect(
          metrics.heroCopySpecimenOverlap,
          `hero copy/specimen overlap at ${viewport.width}px`,
        ).toBe(false);
        expect(metrics.heroInner?.position).not.toBe('sticky');
        expect(metrics.heroInner?.position).not.toBe('fixed');
      }
      if (route.name === 'studio' && viewport.height < 600) {
        expect(metrics.methodVisual?.position).not.toBe('sticky');
        expect(metrics.methodVisual?.height).toBeLessThan(viewport.height);
      }
      for (const target of metrics.touchTargets as Array<{
        width: number;
        height: number;
        text: string;
        selector: string;
      }>) {
        expect(
          target.width,
          `${route.name} touch target ${target.text} (${target.selector}, ${target.width}x${target.height}) width`,
        ).toBeGreaterThanOrEqual(44);
        expect(
          target.height,
          `${route.name} touch target ${target.text} height`,
        ).toBeGreaterThanOrEqual(44);
      }

      if (route.name === 'home') {
        await page.screenshot({
          path: `${output}/home/home-${viewport.width}x${viewport.height}-initial.png`,
        });
        if (viewport.width === 390 || viewport.width === 1440) {
          await page.evaluate(() => {
            document
              .querySelector('.hero-field')
              ?.nextElementSibling?.scrollIntoView({
                block: 'start',
                behavior: 'instant',
              });
          });
          await page.screenshot({
            path: `${output}/home/home-next-section-${viewport.width}.png`,
          });
          await page.evaluate(() =>
            window.scrollTo({ top: 0, behavior: 'instant' }),
          );
        }
      }
      if ([390, 768, 1440].includes(viewport.width)) {
        await settleForVisualReview(page);
        const prefix = `${output}/routes/${route.name}-${viewport.width}x${viewport.height}`;
        await page.screenshot({ path: `${prefix}-viewport.png` });
        await page.screenshot({
          path: `${prefix}-full.png`,
          fullPage: true,
        });
      }
    }
    expect(
      browserErrors,
      `browser/network errors at ${viewport.width}x${viewport.height}`,
    ).toEqual([]);
    diagnostics[`browserErrors@${viewport.width}x${viewport.height}`] =
      browserErrors;
    await context.close();
  }

  await writeFile(
    `${output}/responsive-diagnostics.json`,
    JSON.stringify(diagnostics, null, 2),
  );
});

test('mobile navigation, capabilities and Studio controls respond to touch', async ({
  browser,
}) => {
  test.setTimeout(30_000);
  await mkdir(`${output}/interactions`, { recursive: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  await page.goto('/');
  const menu = page.locator('.site-header .menu');
  await menu.tap();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#primary-nav')).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator('#primary-nav a')
        .first()
        .evaluate((element) => getComputedStyle(element).opacity),
    )
    .toBe('1');
  await page.screenshot({
    path: `${output}/interactions/mobile-menu-open.png`,
  });
  const scrollBeforeTouch = await page.evaluate(() => window.scrollY);
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 350, y: 780 }],
  });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ x: 350, y: 360 }],
  });
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBeforeTouch);
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  await menu.tap();
  await page.locator('#primary-nav a[href="/work/"]').tap();
  await expect(page).toHaveURL(/\/work\/$/);

  await page.goto('/capabilities/');
  await settleForVisualReview(page);
  await page.screenshot({
    path: `${output}/interactions/capabilities-identity-touch.png`,
    fullPage: true,
  });
  const digital = page.locator('.cap-tab[data-capability="digital"]');
  await digital.tap();
  await expect(digital).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.cap-demo-frame')).toHaveAttribute(
    'data-mode',
    'digital',
  );
  await settleForVisualReview(page);
  await page.screenshot({
    path: `${output}/interactions/capabilities-digital-touch.png`,
    fullPage: true,
  });

  await page.goto('/studio/');
  for (const [index, name] of [
    'Recognise',
    'Translate',
    'Test',
    'Carry',
  ].entries()) {
    const control = page.locator(`[data-studio-stage="${index}"]`);
    await control.tap();
    await expect(control).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.method-visual')).toHaveAttribute(
      'data-active',
      String(index),
    );
    await settleForVisualReview(page);
    await page.screenshot({
      path: `${output}/interactions/studio-${name.toLowerCase()}-touch.png`,
      fullPage: true,
    });
  }
  await context.close();
});

test('reduced motion preserves complete page content and hero', async ({
  browser,
}) => {
  test.setTimeout(30_000);
  await mkdir(`${output}/home`, { recursive: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.hero-copy h1')).toBeVisible();
  await expect(page.locator('.specimen')).toBeVisible();
  await settleForVisualReview(page);
  await page.screenshot({
    path: `${output}/home/reduced-motion-hero.png`,
    fullPage: true,
  });
  await page.locator('.site-header .menu').tap();
  await expect(page.locator('#primary-nav')).toBeVisible();
  await page.goto('/studio/');
  await expect(page.locator('.method-step').first()).toBeVisible();
  await context.close();
});

test('responsive visual evidence contact sheet is generated', async ({
  browser,
}) => {
  test.setTimeout(60_000);
  const screenshots = [
    ...viewports.map(
      (viewport) =>
        [
          `Homepage · ${viewport.width} × ${viewport.height}`,
          `home/home-${viewport.width}x${viewport.height}-initial.png`,
        ] as const,
    ),
    [
      'Homepage · following section at mobile',
      'home/home-next-section-390.png',
    ],
    [
      'Homepage · following section at desktop',
      'home/home-next-section-1440.png',
    ],
    ...routes.flatMap((route) =>
      [390, 768, 1440].map((width) => {
        const viewport = viewports.find((item) => item.width === width)!;
        return [
          `${route.name} · ${width} × ${viewport.height}`,
          `routes/${route.name}-${width}x${viewport.height}-viewport.png`,
        ] as const;
      }),
    ),
    ['Mobile navigation · open', 'interactions/mobile-menu-open.png'],
    [
      'Capabilities · Brand Identity selected',
      'interactions/capabilities-identity-touch.png',
    ],
    [
      'Capabilities · Digital Experience selected',
      'interactions/capabilities-digital-touch.png',
    ],
    ...['recognise', 'translate', 'test', 'carry'].map(
      (stage) =>
        [
          `Studio · ${stage}`,
          `interactions/studio-${stage}-touch.png`,
        ] as const,
    ),
    ['Homepage · reduced motion', 'home/reduced-motion-hero.png'],
  ];
  const figures = await Promise.all(
    screenshots.map(async ([label, filename]) => {
      const data = await readFile(`${output}/${filename}`);
      return `<figure><figcaption>${label}</figcaption><img alt="${label}" src="data:image/png;base64,${data.toString('base64')}" /></figure>`;
    }),
  );
  const context = await browser.newContext({
    viewport: { width: 1680, height: 1000 },
  });
  const page = await context.newPage();
  await page.setContent(
    `<!doctype html><html lang="en"><meta charset="utf-8"><title>Stage 03.2 Responsive Review</title><style>body{margin:0;padding:24px;background:#e8e5dd;color:#171717;font:14px Arial,sans-serif}h1{margin:0 0 18px;font:32px Georgia,serif}main{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}figure{min-width:0;margin:0;padding:10px;background:#f7f5ef;border:1px solid #c8c3b7}figcaption{min-height:34px;margin-bottom:8px;font-weight:600}img{display:block;width:100%;height:280px;object-fit:contain;background:#dedbd4}</style><h1>Archex Studio · Stage 03.2 responsive review</h1><main>${figures.join('')}</main></html>`,
  );
  await page
    .locator('img')
    .evaluateAll((images) =>
      Promise.all(images.map((image) => (image as HTMLImageElement).decode())),
    );
  await page.screenshot({
    path: `${output}/RESPONSIVE-REVIEW-CONTACT-SHEET.png`,
    fullPage: true,
  });
  await context.close();
});
