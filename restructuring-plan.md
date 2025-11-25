# Mehmiro Documentation Restructuring Plan

## ✅ Implementation Status: COMPLETED

This document describes the restructuring that has been implemented for the Mehmiro documentation site.

---

## 1. Executive Summary

The documentation has been restructured to:
- **Eliminate URL redundancy** - No more `/docs/` prefix since the domain is `docs.mehmiro.com`
- **Spanish-first URLs** - Folder names use Spanish (`guia`, `investigacion`, `desarrolladores`)
- **Priority-based navigation** - User Guide > Research > Developers
- **Foundations nested under developers** - Technical foundations moved inside the developer section

---

## 2. New URL Structure

| Section | URL (Spanish Default) | English URL |
|---------|----------------------|-------------|
| **Home** | `docs.mehmiro.com/` | `docs.mehmiro.com/en/` |
| **User Guide** | `/guia/...` | `/en/guia/...` |
| **Research** | `/investigacion/...` | `/en/investigacion/...` |
| **Developers** | `/desarrolladores/...` | `/en/desarrolladores/...` |

### Key URLs:
- User Guide Intro: `/guia/user-intro`
- Research Intro: `/investigacion/research-intro`
- Developer Intro: `/desarrolladores/developer-intro`

---

## 3. Directory Structure (Implemented)

```
docs/
├── intro.md                     # Landing page (slug: /)
├── guia/                        # User Guide (Priority 1)
│   ├── intro.md                 # id: user-intro
│   ├── getting-started/
│   │   ├── quick-start.md
│   │   ├── teacher-setup.md
│   │   └── student-access.md
│   ├── tutorials/
│   │   └── creating-your-first-assessment.md
│   └── guides/
│       └── faq.md               # id: frequently-asked-questions
├── investigacion/               # Research (Priority 2)
│   ├── intro.md                 # id: research-intro
│   ├── methodology/
│   │   └── formative-feedback-methodology.md
│   └── papers/
│       └── realtime-assessment-impact.md
└── desarrolladores/             # Developers (Priority 3)
    ├── intro.md                 # id: developer-intro
    ├── contributing.md          # id: contributing-to-mehmiro
    ├── fundamentos/             # Moved from docs/foundations/
    │   ├── project-overview.md
    │   ├── persona.md
    │   ├── glossary.md
    │   └── core-guidelines.md
    ├── architecture/
    ├── standards/
    ├── processes/
    └── features/
```

---

## 4. Configuration Changes Made

### 4.1 docusaurus.config.ts

```typescript
// Changed routeBasePath from '/docs' to '/'
docs: {
  sidebarPath: './sidebars.ts',
  routeBasePath: '/',  // ← Clean URLs, no /docs/ prefix
  // ...
},
pages: false,  // ← Disabled pages, docs is root

// Navbar reordered by priority
items: [
  { type: 'docSidebar', sidebarId: 'guiaSidebar', label: 'Guía de Usuario' },
  { type: 'docSidebar', sidebarId: 'investigacionSidebar', label: 'Investigación' },
  { type: 'docSidebar', sidebarId: 'desarrolladoresSidebar', label: 'Centro de Desarrollo' },
  // ...
]
```

### 4.2 sidebars.ts

Three separate sidebars in priority order:
1. `guiaSidebar` - User Guide
2. `investigacionSidebar` - Research
3. `desarrolladoresSidebar` - Developer Hub (includes `fundamentos/`)

### 4.3 i18n Structure

English translations mirror the Spanish folder structure:
```
i18n/en/docusaurus-plugin-content-docs/current/
├── intro.md
├── guia/
├── investigacion/
└── desarrolladores/
    └── fundamentos/
```

---

## 5. Landing Page

The root URL (`/`) now displays a comprehensive landing page with:
- Section cards for each audience
- Quick links to popular pages
- Priority ordering: User Guide → Research → Developers

---

## 6. Changes Summary

| What Changed | Before | After |
|-------------|--------|-------|
| URL prefix | `/docs/user/...` | `/guia/...` |
| Folder names | `user`, `research`, `developer` | `guia`, `investigacion`, `desarrolladores` |
| Foundations | Separate top-level folder | Nested in `/desarrolladores/fundamentos/` |
| Navbar order | User, Dev, Research | User, Research, Dev |
| routeBasePath | `/docs` | `/` |
| Landing page | Custom React page | Docs intro.md with `slug: /` |

---

## 7. Migration Notes

- All internal links updated to use new paths
- Footer links updated in docusaurus.config.ts
- Old `src/pages/index.tsx` removed (docs serves as root)
- i18n folder structure renamed to match source

---

_Last updated: November 2024_