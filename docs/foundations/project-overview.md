---
id: project-overview
title: Project Overview
sidebar_label: Project Overview
---

# Mehmiro — AI-Powered Educational Assessment Platform

## Product Summary

Mehmiro helps teachers streamline student evaluation, track progress, and generate insights through AI-powered automation. The platform combines class administration, lesson planning, and performance analytics into a cohesive, privacy-first experience.

## Core Value Propositions

### 🤖 AI-Powered Assessment

- Automated analysis of teacher, student, family, and AI-submitted assessments.
- Context-aware suggestions tailored to class variables and scales.
- Actionable feedback aligned with student history and lesson objectives.

### 📊 Student Progress Tracking

- Interactive visualizations (radar, linear, polar charts) covering multiple periods.
- Trend detection, comparative analytics, and cumulative performance summaries.
- Fast filtering by assessment source, variable, session, or time range.

### 👥 Class & Lesson Management

- Class dashboards with roster, assessment variables, lesson planning, and scheduling.
- Student profiles with historical context, AI insights, and intervention flags.
- Integrated lesson planning that ties learning objectives to assessment outcomes.

### 🔐 Privacy-First Design

- Students use secret aliases; personal identifiers are excluded from storage.
- Strict access control for teachers, administrators, assistants, and family members.
- Compliance-ready design aligned with educational data protection.

## Technology Stack

| Layer          | Tooling                                      | Notes                                                        |
| -------------- | -------------------------------------------- | ------------------------------------------------------------ |
| Frontend       | **Next.js 15**, **React 19**, **TypeScript** | App Router, server components, mobile-first UI.              |
| Styling        | **Tailwind CSS**, shadcn/ui                  | Utility-first styling with reusable primitives.              |
| Visualization  | **Chart.js**                                 | Radar/linear/polar charts embedded in student dashboards.    |
| Backend & Data | **Supabase (PostgreSQL)**                    | Row Level Security (RLS), real-time updates, migrations.     |
| Authentication | **NextAuth**                                 | Session management, role-based access.                       |
| AI Integration | Google Gemini (planned)                      | Structured prompts for assessments, diagnostics, onboarding. |
| Testing        | **Vitest**, **Playwright**, **Cucumber**     | Unit, integration, BDD, and E2E coverage.                    |
| Tooling        | **ESLint**, **Prettier**, **PNPM**           | Consistent formatting, linting, and package management.      |

## Development Principles

### Mobile-First Experience

- Design components for phone layouts first, optimizing for touch interactions.
- Ensure skeleton/loading states exist for every major UI view.

### Consistent Component Patterns

- Reuse shared components and hooks rather than creating duplicates.
- Keep component responsibilities focused and limit prop surface area.

### Testing Discipline

- Follow TDD/BDD workflow: define scenarios, write failing tests, implement, refactor.
- Maintain ≥80% code coverage and ensure scenarios are reflected in automated suites.
- Include targeted Playwright tests for critical user flows.

### Documentation & Governance

- Treat documentation as a first-class deliverable.
- Update related documents, feature specs, and diagrams with every change.
- Run documentation validation (`pnpm docs:build` & `pnpm docs:test`) before PR submission.

## User Roles

| Role                    | Description           | Capabilities                                                  |
| ----------------------- | --------------------- | ------------------------------------------------------------- |
| Teachers                | Primary users         | Manage classes, assess students, view insights, plan lessons. |
| Administrators          | Operational oversight | Manage rosters, monitor analytics, configure system behavior. |
| Assistants / Tutors     | Support staff         | Limited access to class dashboards and lesson context.        |
| Family Members (Future) | Guardians             | Read-only access to student summaries and insights.           |
| Students                | Protected             | No direct access (aliases only).                              |

## Security & Compliance

- HTTPS enforced across environments.
- Environment variables managed via Next.js conventions and Supabase project settings.
- Audit-ready logging for AI interactions and assessment changes.
- Integration with Supabase RLS for granular data access policies.

## Performance Considerations

- SSR or static rendering for SEO-critical pages.
- Intelligent caching at service layer, with invalidation tied to assessment updates.
- Batched Supabase queries, database indexes, and consistent pagination.
- Turbopack-enabled development builds for rapid feedback.

## Product Roadmap (Highlights)

| Phase      | Focus                    | Summary                                                     |
| ---------- | ------------------------ | ----------------------------------------------------------- |
| Short Term | i18n & Multi-language UI | Add Spanish/English support, language preferences.          |
| Short Term | Advanced Analytics       | Predictive performance metrics, cohort comparisons.         |
| Mid Term   | Integrations             | LMS connectors, parent portal, external assessment imports. |
| Mid Term   | Real-time Collaboration  | Shared lesson planning, teacher messaging.                  |
| Long Term  | Mobile & Offline         | PWA capabilities and native app exploration.                |

## Referenced Documentation

- [System Architecture](../architecture/system-architecture.md)
- [Coding Standards](../standards/coding-standards.md)
- [Feature Lifecycle](../processes/feature-lifecycle.md)
- [Student Assessment Insights](../features/student-assessment-insights/overview.md)
- [Student Monitoring System](../features/student-monitoring-system/overview)

---
