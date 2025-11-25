---
id: feature-lifecycle
title: Feature Lifecycle (BDD + TDD)
sidebar_label: Feature Lifecycle
---

# Feature Lifecycle

This workflow keeps feature delivery disciplined, traceable, and synchronized with documentation and tests.

## 1. Discovery & Documentation

1. Capture the product goal, user persona, and acceptance criteria.
2. Update or create relevant docs in this portal:
   - [Feature Catalog entry](../features/index.md) (add or expand your feature section)
   - [BDD Scenarios](../standards/testing-strategy.md#bdd-workflow)
   - Architecture and data model impacts.

3. Define **success metrics** and non-functional requirements (performance, security, accessibility).

## 2. Scenario & Test Planning (BDD First)

1. Write Gherkin scenarios in `tests/bdd/features/<feature>/feature.feature`.
2. Tag scenarios (`@smoke`, `@regression`, etc.) for CI orchestration.
3. Add step definitions (`given.ts`, `when.ts`, `then.ts`) referencing shared helpers.
4. Draft data builders and fixtures.

> Scenarios serve as the living spec for both engineers and stakeholders. Keep them concise and executable.

## 3. Technical Design

1. Extend diagrams or docs (architecture, data model) as needed.
2. Identify reusable components, hooks, and services.
3. Specify migrations, API updates, and edge cases.
4. Document AI prompt changes if applicable.

## 4. Implementation (TDD)

Follow **Red → Green → Refactor**:

1. Write failing unit/integration tests.
2. Implement minimal logic to pass.
3. Refactor for readability and reuse.
4. Update Storybook or docs for UI work.

### Code Expectations

- Adhere to [Coding Standards](../standards/coding-standards.md) and [UI Guidelines](../standards/ui-guidelines.md).
- Update skeleton states and accessibility audits.
- Keep changes scoped and self-contained.

## 5. Verification

Run the complete verification matrix:

```bash
pnpm run format
pnpm run lint -- --fix
pnpm run type-check
pnpm run build

pnpm test:unit
pnpm test:integration
pnpm test:bdd -- --tags @smoke
pnpm test:e2e --project chromium

pnpm docs:build
pnpm docs:test
```

- Record coverage deltas.
- Attach Playwright traces or Vitest snapshots for failures.
- Update BDD tags executed during CI.

## 6. Pull Request Checklist

- ✅ Code + tests + docs updated together.
- ✅ Docusaurus content linked in PR description.
- ✅ Screenshots / recordings for UI features.
- ✅ DB migrations reviewed, reversible, and tested locally.
- ✅ Feature flags or rollout plan documented.

Include PR template sections:

```
## Summary
- ...

## Tests
- pnpm test:unit
- pnpm test:integration
- pnpm test:bdd -- --tags @smoke
- pnpm test:e2e --project chromium
- pnpm docs:build

## Documentation
- Updated docs-portal/docs/... (link)
```

## 7. Deployment & Rollout

1. Merge to main once PR checks pass.
2. Verify preview/staging environment:
   - Run smoke BDD/E2E suites.
   - Validate Supabase migrations.
3. Update release notes and changelog.
4. Coordinate rollout with product (feature flags, announcements).

## 8. Post-Release

- Monitor metrics, logs, and AI usage.
- Collect user feedback.
- Schedule retrospective if needed.
- Close documentation loop with learnings or follow-up tasks.

---

**Related References**

- [Testing Strategy](../standards/testing-strategy.md)
- [Coding Standards](../standards/coding-standards.md)
- [System Architecture](../architecture/system-architecture.md)
- [Documentation Governance](documentation-governance.md) _(add once authored)_
