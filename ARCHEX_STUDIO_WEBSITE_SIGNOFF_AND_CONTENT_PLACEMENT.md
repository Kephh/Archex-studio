# Archex Studio Website — Signoff and Content Placement

## Current production structure

The Astro site lives at the repository root. Routes are implemented at:

- `/`
- `/work/`
- `/capabilities/`
- `/studio/`
- `/archex-web/`
- `/contact/`

The Phase 3A.1 prototype remains preserved at `prototypes/phase-3a/index.html`.

## Archex Web evidence placement

The Archex Web route is intentionally `noindex,nofollow` and is excluded from the sitemap until sufficient evidence is available.

When evidence is approved:

1. Add verified project data to `src/data/projects.ts` only for the existing Archex Web position.
2. Replace the evidence-pending sections in `src/pages/archex-web.astro` with factual objective, contribution, process, identity evidence, interface evidence, credits and supported outcomes.
3. Add approved screenshots under a production asset directory with width, height, responsive sources and contextual alt text.
4. Keep unsupported technologies, metrics, timelines, credits and results omitted.
5. Reassess the route's `noindex` status only after the page contains substantial original evidence.

## Reserved concept positions

Keep exactly three reserved entries after Archex Web:

- Reserved concept project 01
- Reserved concept project 02
- Reserved concept project 03

Each remains non-clickable, has no detail route, and must not receive invented identity, imagery, description or case-study content. When a future project is genuinely ready, replace one reserved data entry with verified content and add its route only as part of a separately reviewed release.

## Contact placement

Contact integration is deferred. Do not add a form endpoint, email address, CRM destination or submission confirmation until the destination and response workflow are approved. The current `/contact/` page is intentionally informative rather than a non-working form.

## Launch controls

- Set `PUBLIC_SITE_URL=https://studio.archexweb.in`.
- Keep `PUBLIC_ALLOW_INDEXING=false` for previews and until the custom domain is verified.
- Set `PUBLIC_ALLOW_INDEXING=true` only after the production domain and site have been confirmed.
- Configure only the `studio` DNS host record using the exact CNAME target returned by Vercel.
- Do not modify the separate `https://archexweb.in` deployment, root-domain routing, email records or nameservers.
