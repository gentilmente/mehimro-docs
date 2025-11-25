---
id: testing-strategy
title: Testing Strategy
sidebar_label: Testing Strategy
---

# Testing Strategy

Mehmiro relies on a disciplined mix of BDD, TDD, unit, integration, and E2E testing to keep features reliable while maintaining fast iteration. This document defines tooling, workflows, and verification requirements.

## Testing Pyramid

```
      ┌─────────────────────────┐
      │ End-to-End (Playwright) │  Critical journeys, UI + API + DB
      └──────────▲──────────────┘
                 │
      ┌──────────┴──────────────┐
      │ Integration (Playwright │  Next.js API routes, Supabase, services
      │   + direct API tests)   │
      └──────────▲──────────────┘
                 │
      ┌──────────┴──────────────┐
      │ Unit (Vitest)           │  Pure logic, services, hooks, utils
      └──────────▲──────────────┘
                 │
      ┌──────────┴──────────────┐
      │ BDD (Cucumber)          │  Executable feature documentation
      └─────────────────────────┘
```

## Tooling Overview

| Layer       | Tooling                         | Path                    |
| ----------- | ------------------------------- | ----------------------- |
| Unit        | Vitest + @testing-library/react | `pnpm test:unit`        |
| Integration | Playwright API tests            | `pnpm test:integration` |
| End-to-End  | Playwright UI specs             | `pnpm test:e2e`         |
| BDD         | Cucumber + Playwright glue      | `pnpm test:bdd`         |
| Coverage    | Vitest coverage reporters       | `pnpm test:coverage`    |

## BDD Workflow

1. **Feature Kickoff**
   - Document user story and acceptance criteria.
   - Create feature directory under `tests/bdd/features/<feature-name>/`.

2. **Scenario Definition** (`*.feature`)

   ```gherkin
   @smoke @student-insights
   Scenario: Teacher views assessment overview
     Given I am an authenticated teacher
     And the student has historical assessments
     When I open the student insights page
     Then I see the latest assessments
     And I see AI insights with confidence scores
   ```

3. **Step Definitions** (`given.ts`, `when.ts`, `then.ts`)

   ```typescript
   Given('I am an authenticated teacher', async function () {
     await this.authenticatedContext.loginTeacher();
   });
   ```

4. **Test Data Builders** (`test-data/builders.ts`)
   - Use faker for randomized but deterministic data.
   - Share builders between BDD and other suites when possible.

5. **Execution & Reporting**
   - `pnpm test:bdd -- --tags @smoke`
   - Scenarios double as living documentation within Docusaurus.

## TDD & Unit Testing

### Expectations

- Write failing test before implementation (red).
- Implement minimal logic to pass (green).
- Refactor with tests locked (refactor).

### Sample

```typescript
describe('normalizeAssessment', () => {
  it('normalizes values within bounds', () => {
    const normalized = normalizeAssessment({
      value: 8,
      variable: { scaleMin: 0, scaleMax: 10 }
    } as AssessmentWithVariable);

    expect(normalized).toBeCloseTo(0.8);
  });

  it('returns null when value missing', () => {
    const normalized = normalizeAssessment({
      value: null,
      variable: { scaleMin: 0, scaleMax: 10 }
    } as AssessmentWithVariable);

    expect(normalized).toBeNull();
  });
});
```

### Guidelines

- Keep tests deterministic (no network, random seeds).
- Mock Supabase/AI via dedicated mocks in `tests/services/mocks`.
- Break large services into test-friendly units.

## Integration Testing

- Covers API routes (`app/api/**/route.ts`) interacting with Supabase (mocked or local).
- Validates schema enforcement and error states.
- Ensures API contracts match documentation.

Example (Playwright API test):

```typescript
test('creates assessment and returns persisted payload', async ({
  request
}) => {
  const response = await request.post('/api/students/assessments', {
    data: createAssessmentPayload()
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.assessment.value).toBe(8.5);
  expect(body.assessment.assessorType).toBe('teacher');
});
```

## End-to-End Testing

- Simulate teacher flows (onboarding, assessments, insights).
- Use SSR pages with seeded data or API fixtures.
- Implement Page Objects under `tests/e2e/page-objects` for maintainability.

```typescript
test('teacher reviews AI insight for student', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.login();
  await dashboard.openStudent('Alias 1');

  const insights = new StudentInsightsPage(page);
  await expect(insights.aiInsightCard).toContainText('Recomendación');
  await insights.acceptSuggestion();
});
```

## Coverage Requirements

| Metric                                      | Minimum                                                       |
| ------------------------------------------- | ------------------------------------------------------------- |
| Overall statements/branches/functions/lines | 80%                                                           |
| Services layer                              | 85%                                                           |
| Hooks/components critical path              | 80%                                                           |
| BDD scenario coverage                       | 90% for in-scope features                                     |
| E2E regression flows                        | Cover core use cases (dashboard, student profile, onboarding) |

Vitest configuration (`vitest.config.ts`) enforces global thresholds; CI fails on regressions.

## Test Data & Fixtures

- Use `tests/hooks/test-utils.ts` and `tests/services/test-utils.ts` for shared setup.
- Supabase seeded via `supabase/seed.sql` for integration runs.
- For E2E, prefer deterministic fixtures (JSON) or API bootstrapping.

## Mocking Strategy

- AI services: `tests/services/mocks/google-ai.mock.ts`.
- Supabase client: `tests/services/mocks/supabase.mock.ts`.
- Keep mocks close to real behavior; validate contract via typing.

## CI Pipeline

```yaml
# .github/workflows/ci.yml
jobs:
  verify:
    steps:
      - run: pnpm install
      - run: pnpm run format
      - run: pnpm run lint -- --max-warnings=0
      - run: pnpm run type-check
      - run: pnpm test:unit --coverage
      - run: pnpm test:integration
      - run: pnpm test:bdd -- --tags @smoke
      - run: pnpm test:e2e --project chromium
```

- Smoke subsets run on every PR; full suites on main merges or nightly cron.
- Reports uploaded to Codecov or artifact storage.

## Running Locally

```bash
# Unit + integration
pnpm test
pnpm test:unit --watch
pnpm test:integration --headed
pnpm test:e2e --ui

# BDD
cd tests/bdd
pnpm install
pnpm run test:bdd -- --tags @regression
```

Ensure Supabase local instance or mock server is running for integration tests.

## Failure Protocol

1. Investigate logs (Vitest snapshots, Playwright traces).
2. Reproduce locally with same flags (CI uses `CI=1`).
3. Fix root cause, update tests, rerun suite.
4. Document findings in PR (root cause, mitigation, follow-ups).

---

**Related References**

- [Feature Lifecycle](../processes/feature-lifecycle.md)
- [Coding Standards](coding-standards.md)
- [Student Assessment Insights Feature](../features/student-assessment-insights/overview.md)
