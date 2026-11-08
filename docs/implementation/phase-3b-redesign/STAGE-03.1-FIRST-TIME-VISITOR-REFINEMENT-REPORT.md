# Stage 03.1 — First-Time Visitor Refinement Report

**Date:** 2026-11-09  
**Project:** Archex Studio  
**Review branch:** `stage-03-1-visitor-clarity-review`  
**Production changes:** None. No commit, push, merge, or deployment was made during this stage.

## 1. Stage objective

Review the site from a first-time founder or business owner’s perspective. Clarify what Archex Studio does, make its available project easy to understand, remove internal production language, keep the enquiry status honest, and verify the experience at desktop and mobile sizes while preserving The Living Grid design.

## 2. Local source and public preview reconciliation

**Before Stage 03.1 edits:** The working tree was clean on `main` at `e981c4c`, which was also the `origin/main` tracking commit. That commit contains the Stage 03 content and Playwright work. The package version at this baseline is `1.0.0`. The Stage 03 completion report describes the state when it was written, when its changes were uncommitted; it does not describe the current Git history.

**Public check:** Read-only HTTP requests to `https://archex-studio.vercel.app/` and all five subroutes returned HTTP 200. Each route’s title and main heading matched the local source. The same Stage 03-era wording was present both publicly and locally, including “Archex Studio / 01—05”, “One reference. Held honestly.”, “Open project framework”, “Choose a side of the system”, the visible indexing/evidence notes on Archex Web, and the repeated Contact preparation CTA. No content discrepancy was found in the checked page text. This was a route/title/heading/copy comparison, not a byte-for-byte comparison of generated bundles or hashed assets.

**Version used for this stage:** The local Stage 03 source was refined on the new review branch. The public preview was left untouched and therefore still shows the pre-03.1 wording. No production website was used as the implementation-test target.

## 3. Initial first-time visitor findings

The site already explained that Archex Studio works across identities and digital experiences, but the hero’s “Living Grid” and “01—05” labels read as internal art direction. Several hero annotations read like a specification. The Archex Web sections were accurate but defensive and hard to scan because they emphasized evidence limitations. Work sounded like an incomplete archive, Capabilities described the specimen more than the visitor benefit, and Contact repeated the unavailable-channel status in multiple places.

The separate live site link was valid but used a host that redirected to its canonical `www` host. A read-only request confirmed the final `https://www.archexweb.in/` destination returns HTTP 200.

## 4. Files inspected

Inspected the package manifest/lockfile and Git history; Playwright configuration and tests; all six Astro route files; `BaseLayout.astro`, `Header.astro`, `Footer.astro`, and `ProjectStatus.astro`; `src/data/projects.ts`; `src/scripts/site.js`; `src/styles/global.css`; robots and sitemap generation; Astro configuration; the Stage 03 completion report; and existing route/project screenshots.

## 5–6. Files created and modified

**Created:**

- `docs/implementation/phase-3b-redesign/STAGE-03.1-FIRST-TIME-VISITOR-REFINEMENT-REPORT.md` (this report)
- `artifacts/stage-03.1/playwright/` screenshots, Playwright HTML report, test-results directory, and visual-review contact sheet

**Modified:**

- `.gitignore` — exact exception for this required report
- `playwright.config.ts` — Stage 03.1 report and test-results paths
- `src/pages/index.astro`, `work.astro`, `capabilities.astro`, `studio.astro`, `contact.astro`, and `archex-web.astro`
- `src/scripts/site.js` and `src/styles/global.css`
- `src/data/projects.ts` and `src/components/ProjectStatus.astro`
- `tests/e2e/stage-03.spec.ts` and `tests/projects.test.mjs`

`package.json` and `package-lock.json` were not changed. The `1.0.0` package version, existing scripts, and installed Playwright setup were preserved; no dependency was added.

## 7. Homepage copy improvements

**Implemented:** The browser title now describes Archex Studio as “Identity to Interface”. The public hero descriptor is “Identity-to-Interface Studio”; “Living Grid” and “01—05” were removed from visitor-facing hero copy. The headline and core description were preserved. The homepage’s first-project section now leads with “Our first project. Archex Web.” and explains that it is a separate website made by the same owner and team, not an external client engagement. Visitors get separate “View the project overview” and “Visit the live website” links. The three homepage future positions now use simple future-work language.

## 8. Hero annotation review

**Implemented:** Replaced the specification-like dimensions and coordinates with “Brand identity”, “Responsive by design”, “Desktop → mobile”, “Type scale”, “Interaction”, and “Interface specimen”. The specimen now labels the digital experience and its ready-to-explore state. Abstract “FIELD NOTE / FORM / SIGNAL / USE” wording became “BRAND → DIGITAL / IDENTITY / INTERACTION / EXPERIENCE”. The stage control now says “Explore the system”; after activation it changes to “Return to the starting point”. It remains a real button controlling the existing visual.

**Implemented and visually verified:** Browser inspection showed the sticky composition was not staying in frame during scroll because `overflow-x:hidden` on the body (and hidden overflow on the hero) created a scroll container. The existing 280vh scroll sequence then left later captures as background grid only. The CSS now uses clipping (`overflow-x:clip` and `overflow:clip`) so horizontal containment remains while the sticky hero stays in the viewport. Playwright checks the hero remains in frame and reaches each of its four existing scroll states; new screenshots show the headline and specimen through the sequence. No hero redesign or new effect was introduced.

## 9. Work archive and reserved positions

**Implemented:** The page now says the archive begins with Archex Web, the studio’s first project, and that three positions remain open for what comes next. The internal “project framework” CTA became “View project overview”; the external link is clearly “Visit the live website”. The archive still has exactly four positions. The three future positions are non-links, have no hover lift that could imply clickability, and say “Future work” / “Position reserved for a future project.” No project details or active-work claims were added.

## 10. Archex Web project presentation

**Implemented:** Removed visible “evidence pending”, “not indexable”, “Known carefully”, “NOT PROVIDED”, and similar production-record text. The route now identifies Archex Web as the first project, explains that it is a separate website made by the same owner and team, and states that it was not made for an external client. It notes briefly that a fuller account is being prepared, then provides a direct live-site link and a return-to-Work link. The project is presented with an existing typographic graphic composition, not a simulated website screenshot. The page’s HTML robots directive remains `noindex,nofollow`; the route remains excluded from the sitemap.

## 11. Capabilities improvements

**Implemented:** The specimen now has two clear controls: “Brand Identity” and “Digital Experience”. Selecting either changes the visual and its explanation; progress is `01 / 02` or `02 / 02`. Helper copy explains the visitor benefit and how to interact. Creative Direction still connects the two equally weighted disciplines, UI/UX remains within Digital Experience, and grouped practical capabilities are retained. The earlier repeated engagement disclaimer was replaced with a short statement that these are capabilities Archex Studio can bring to a project.

## 12. Studio refinements

**Implemented:** Kept the exact statement “Distinctive is not enough. It has to hold together.” and the full Recognise, Translate, Test, Carry method with its existing descriptions. Replaced “building a practice around judgement” with “Our approach is guided by judgement…”. No history, experience, team-size, award, or client-credential claims were added.

## 13. Contact refinements

**Implemented:** Contact navigation and all Contact CTAs use the label “Contact”. The page contains one clear status statement: “Our enquiry channel is being prepared. This page is not accepting enquiries yet.” Repeated availability disclaimers were removed. No form, email, phone, WhatsApp, endpoint, or submission control was introduced. The page retains its complete two-column editorial composition.

## 14. First-time visitor journey audit

| Route | Studio / capabilities clarity | Work / process clarity | Enquiry and navigation |
|---|---|---|---|
| Home | The first viewport identifies an identity-to-interface studio; the lead copy names identities and digital experiences. | Archex Web is identified as the first project; the method section links to Studio. | “See the work”, “Explore capabilities”, and “Contact” have real destinations. |
| Work | The page makes clear this is the beginning of the portfolio. | One first project and three future positions are distinct; no fake work appears. | Overview, live site, archive navigation, and Contact links work. |
| Capabilities | Brand Identity and Digital Experience are named as equal disciplines; Creative Direction connects them. | Interactive specimen changes on either discipline; capability groups are practical. | Controls are labeled and keyboard-operable; navigation destinations resolve. |
| Studio | The opening text gives the studio point of view. | Four named, explained stages remain available and operable. | Method control and route navigation work. |
| Archex Web | The page identifies what the site is and why it appears in the archive. | It is the studio’s own first project; no unsupported case-study details are presented. | Live website and Return to Work links are separate and clear. |
| Contact | The destination is clear from navigation and heading. | The page explains what a useful project conversation considers without repeating status. | Status is honest: the page is not accepting enquiries yet. |

**Review finding:** No visible indexing instruction, dead route, fake contact flow, repeated contact-preparation CTA, or reserved-project link remains. The enquiry limitation is still a material business-launch blocker.

## 15. Playwright route and interaction results

**Tested and passed:** `npm run test:e2e` completed with **13 passed**. The suite checks all six route responses and headings, internal destinations, the hero control and both Contact CTAs, exactly four Work positions and their destinations, both capability modes, all four Studio stages, Contact status/no form, visitor-facing copy, mobile-menu navigation/Escape, Archex Web noindex/sitemap rules, reduced motion, scroll reveals, and screenshot generation.

The route/viewport sweep visited all 36 route and viewport combinations. Browser console errors, uncaught page errors, failed first-party requests, first-party HTTP errors, and broken internal destinations were not observed. The external Archex Web destination was checked read-only: the non-`www` host redirects (308) to `www`; the final host returns 200. It was not navigated as part of local application E2E tests.

## 16. Responsive test matrix

**Tested and passed:** Every route at each width and height below; document and body widths stayed within the viewport, headings remained visible, and navigation matched the responsive layout.

| Class | Viewport | Result |
|---|---:|---|
| Small mobile | 375 × 812 | Passed |
| Mobile | 390 × 844 | Passed |
| Tablet | 768 × 1024 | Passed |
| Small desktop | 1024 × 768 | Passed |
| Desktop | 1440 × 900 | Passed |
| Wide desktop | 1800 × 1000 | Passed |

Visual screenshots were captured at desktop and mobile for all six routes. The contact sheet was inspected; individual mobile Work, Capabilities, Archex Web, and Contact screenshots and the final scroll-stage hero were also inspected.

## 17. Reduced-motion results

**Tested and passed:** With `prefers-reduced-motion: reduce`, the homepage hero resolves to its final state, reveal content stays visible, Contact navigation remains available, and the page remains usable. This is a focused behaviour check, not a formal accessibility audit.

## 18. Console and network findings

**Tested and passed:** The browser tests observed no console errors, uncaught page errors, failed first-party assets, first-party HTTP errors, or unresolved internal links. No third-party service failures were observed. The live external website was status-checked separately and was not loaded into the local E2E suite.

## 19. SEO and sitemap verification

**Tested and passed against generated HTML:** The restored default local build emits `noindex,nofollow` and no canonical on preview routes; preview `robots.txt` says `Disallow: /`, and its sitemap is empty. A separate production-like build with `VERCEL_ENV=production`, `PUBLIC_ALLOW_INDEXING=true`, and `PUBLIC_SITE_URL=https://studio.archexweb.in` emitted `index,follow` and matching canonicals for Home, Work, Capabilities, Studio, and Contact. Archex Web remained `noindex,nofollow` without a canonical and was absent from the five-URL sitemap. The production-like build also emitted `Allow: /` and the configured sitemap URL in `robots.txt`. The environment was cleared and the default local build was restored after inspection.

Titles and descriptions are meaningful for each route. No technical indexing instructions are visible in the Archex Web page body.

## 20. Lint investigation

**Tested and failed:** `npm run lint` reports Prettier warnings in nine existing files:

- `src/components/CapabilityExplorer.astro`
- `src/components/Footer.astro`
- `src/components/Handoff.astro`
- `src/env.d.ts`
- `src/layouts/BaseLayout.astro`
- `src/pages/404.astro`
- `src/pages/robots.txt.ts`
- `src/pages/sitemap.xml.ts`
- `astro.config.mjs`

**Baseline comparison:** The Stage 03 report recorded 11 warnings before this stage: the nine above plus `src/components/ProjectStatus.astro` and `src/data/projects.ts`. Those two were modified for visitor-facing project labels and formatted; they now pass. The Stage 03.1 edits also introduced an interim formatting warning in `src/pages/index.astro`; it was formatted and now passes. All nine remaining lint warnings are outside this stage’s changed files and match the pre-existing baseline list. No mass-formatting of those unrelated files was done.

## 21. Build and automated test results

- `npm run build` — **passed**, seven static pages generated. A default local build was restored after the production-like SEO check.
- `npm run typecheck` — **passed**, 20 files checked, zero errors, warnings, or hints.
- `npm test` — **passed**, 3/3 tests.
- `npm run test:e2e` — **passed**, 13/13 tests.
- `npm run lint` — **failed** with the nine baseline warnings listed above.

## 22–23. Screenshot evidence and contact sheet

All visual evidence is saved under `artifacts/stage-03.1/playwright/`:

- `home-desktop-first.png`, `home-desktop-full.png`
- `home-mobile-first.png`, `home-mobile-full.png`
- `home-hero-stage-01.png` through `home-hero-stage-04.png`
- `work-desktop.png`, `work-mobile.png`
- `capabilities-desktop.png`, `capabilities-mobile.png`
- `studio-desktop.png`, `studio-mobile.png`
- `archex-web-desktop.png`, `archex-web-mobile.png`
- `contact-desktop.png`, `contact-mobile.png`
- `navigation-mobile-open.png`, `home-reduced-motion.png`
- Playwright HTML report: `report/index.html`
- Test output: `test-results/`

**Contact sheet:** `artifacts/stage-03.1/playwright/STAGE-03.1-VISUAL-REVIEW.png`. It places the requested route, viewport, hero-stage, navigation, and reduced-motion screenshots together. Screenshots are unaltered; the contact sheet only scales them into labeled cells. No screenshot baseline comparison was used. The final E2E run passed, so no failure trace was produced; configuration retains traces on failure.

**Visual review:** The desktop and mobile layouts preserve the existing typography, grid, editorial structure, colors, and interaction style. The refreshed hero captures show all four existing scroll states in frame. The Work page’s three future positions read as static reserved spaces; Capabilities visibly separates its two choices; Archex Web reads as a typographic project introduction; Contact is complete while its status remains explicit. Screenshot generation and overflow tests were supplemented with visual inspection; no claim of pixel-perfect design is made.

## 24. Remaining issues

- Nine pre-existing Prettier warnings remain; details are in section 20.
- No enquiry channel is connected. The site correctly says it is not accepting enquiries.
- No additional Archex Web contribution, design, technology, or outcome detail was supplied, so the overview remains brief and factual.
- A formal screen-reader/accessibility audit, performance audit, and live preview visual comparison were not performed.

## 25. Public launch blockers

**Blocker:** A real enquiry channel must be connected and tested before Archex Studio’s public business launch. This site is not ready to receive enquiries. This stage did not invent contact details or conceal the limitation.

A fuller Archex Web case study remains deferred until approved screenshots and contribution details are available. The three future portfolio positions remain intentionally unbuilt.

## 26–27. Git status and deployment safety

**At start:** `main` was clean at `e981c4c` and pointed to `origin/main`. **Now:** Changes are uncommitted on `stage-03-1-visitor-clarity-review`; no commit was created. Stage 03.1 changes include the listed page copy, capability interaction labels/state, hero overflow and annotation refinements, project metadata/test updates, Playwright evidence paths, screenshots, and reports.

**No deployment or production change occurred.** Nothing was pushed, merged, or deployed. DNS, domain settings, the Archex Web deployment, analytics, and contact integrations were not changed. The public Vercel preview still shows the pre-03.1 content checked before edits.

## Status summary

- **Implemented:** Visitor-facing copy refinements, two-discipline specimen labels, clean Contact CTAs, factual first-project presentation, and sticky hero scroll correction.
- **Tested and passed:** Build, typecheck, unit tests, 13 Playwright tests, all 36 route/viewport combinations, reduced-motion behaviour, SEO output checks, link checks, screenshot generation, and visual inspection.
- **Tested and failed:** Repo-wide lint, due to nine pre-existing warnings in untouched files.
- **Not tested:** Deployment, formal screen-reader and performance audits, or byte-for-byte local/public bundle equivalence.
- **Deferred:** Real enquiry-channel integration and any expanded Archex Web case-study claims pending approved evidence.
