---
id: multi-app-monorepo
title: Multi-App Monorepo Architecture
sidebar_label: Multi-App Monorepo
description: Architecture plan for hosting landing, product, and docs within one Next.js monorepo and one Vercel project.
---

# Multi-App Monorepo Architecture

## Context
- Current Next.js app renders [`LandingPage`](app/components/LandingPage.tsx:1) inside [`RootLayout`](app/layout.tsx:1).
- Marketing CTA directs users to `app.mehmiro.com`, which is not yet provisioned.
- Documentation lives in [`docs-portal`](docs-portal/package.json:1) as a standalone Docusaurus site.

## Objectives
1. Serve marketing landing (`mehmiro.com`), product app (`app.mehmiro.com`), and docs (`docs.mehmiro.com`) from a single Vercel project.
2. Adopt a monorepo structure that enables shared UI, config, and tooling.
3. Preserve independent dev workflows for marketing, product, and docs teams.

## Proposed Repository Blueprint
```text
mehmiro/
├─ package.json
├─ pnpm-workspace.yaml
├─ apps/
│  ├─ web/                 # Next app with host-aware routing
│  └─ docs/                # Docusaurus portal (existing docs-portal)
├─ packages/
│  ├─ shared-ui/           # Cross-app React components
│  ├─ config/              # Tailwind, ESLint, tsconfig presets
│  └─ toolkit/             # Utilities, hooks, feature flags (optional)
└─ turbo.json              # Optional task orchestration
```

### Next App Route Groups
- `app/(marketing)` → landing experience.
- `app/(product)` → application routes currently under [`app/(routes)`](app/(routes)/dashboard/page.tsx:1).
- `middleware.ts` rewrites `Host` headers to the right group.

### Shared Packages
| Package | Purpose | Notes |
| --- | --- | --- |
| `packages/shared-ui` | Components reused by marketing and product (e.g., [`PhoneWrapper`](app/components/PhoneWrapper.tsx:1)). | Export via `index.ts` for tree-shaking. |
| `packages/config` | Centralizes Tailwind preset, ESLint config, env typings. | Reference via `extends` in app configs. |
| `packages/toolkit` | Optional utilities, types, constants. | Keep domain logic minimal to avoid tight coupling. |

## Vercel & Runtime Flow
```mermaid
graph TD
  DomainLanding[mehmiro.com] --> VercelProject[Single Vercel project]
  DomainProduct[app.mehmiro.com] --> VercelProject
  DomainDocs[docs.mehmiro.com] --> VercelProject
  VercelProject --> NextApp[apps/web]
  NextApp --> MarketingGroup[app/(marketing)]
  NextApp --> ProductGroup[app/(product)]
  VercelProject --> DocsStatic[public/docs build]
  SharedPackages[packages shared-*] --> MarketingGroup
  SharedPackages --> ProductGroup
  SharedPackages --> DocsStatic
```

## Build & Deployment Workflow
- Install dependencies with `pnpm install` at repo root.
- Build docs: `pnpm --filter docs build` outputs to `apps/docs/build`.
- Copy docs into Next static path during `pnpm --filter web build` (e.g., via script `pnpm docs:export`).
- Next build produces `.next` for deployment; static docs served from `/docs`.
- One Vercel project configured with domains `mehmiro.com`, `app.mehmiro.com`, `docs.mehmiro.com`.

## Middleware Routing Strategy
1. Create `middleware.ts` that inspects `request.headers.get('host')`.
2. For `app.mehmiro.com`, rewrite to `/product${pathname}`.
3. For `docs.mehmiro.com`, rewrite to `/docs${pathname}` where `/docs` serves the static build.
4. Default route serves marketing pages.
5. Ensure static assets use absolute URLs or `next/image` remotePatterns to avoid host leakage.

## Migration Checklist
1. Add `pnpm-workspace.yaml` registering `apps/*` and `packages/*`.
2. Move existing `app/` tree into `apps/web/app/(product)` and rebuild marketing screens under `app/(marketing)`.
3. Extract landing components into `packages/shared-ui`.
4. Relocate `docs-portal` to `apps/docs` without altering its internal structure.
5. Update root scripts: `pnpm dev --filter web`, `pnpm dev --filter docs`.
6. Implement middleware and validate host routing locally via `/etc/hosts`.
7. Configure Vercel build command `pnpm build` and output directory `.next`.
8. Document DNS changes and cutover plan.

## Open Questions
- Confirm SEO requirements for docs vs marketing.
- Decide whether docs should also be reachable under `/docs` on the root domain.
- Evaluate impact on existing Playwright and Vitest suites when routes move.

## Next Steps
- Align stakeholders on this architecture.
- Update feature catalog entry pointing to this document.
- Begin implementation sprint once plan is approved.