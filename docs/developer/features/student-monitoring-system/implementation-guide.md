---
id: student-monitoring-system-implementation
title: Implementation Guide
sidebar_label: Implementation
slug: /features/student-monitoring-system/implementation-guide
---

# 🚀 Student Monitoring System — Implementation Guide

This guide provides a phase-by-phase roadmap to build, verify, and ship the Student Monitoring System using Mehmiro’s BDD-first, TDD-driven workflow. Each phase lists goals, tasks, code touchpoints, and acceptance criteria so cross-functional contributors can stay aligned.

---

## 📋 Overview

- **Feature Goal**: Automatically prioritize students who need attention using traffic-light flags, weighted scores, and AI diagnoses.
- **Audience**: Engineers, testers, and product owners coordinating implementation.
- **Dependencies**: Supabase database, assessment services, existing teacher/class data, AI provider credentials.

---

## 🧭 Phase Breakdown

| Phase | Focus                       | Primary Owner  | Acceptance Criteria                  |
| ----- | --------------------------- | -------------- | ------------------------------------ |
| 1     | Database Foundations        | Backend        | Tables, indexes, config seeded       |
| 2     | Types & Schemas             | Backend        | TypeScript types + Zod validators    |
| 3     | Scoring Utilities           | Backend        | Deterministic functions + unit tests |
| 4     | AI Integration              | Backend        | Prompt template + JSON validation    |
| 5     | Monitoring Service          | Backend        | Orchestration logic implemented      |
| 6     | API Surface                 | Backend        | REST endpoints + integration tests   |
| 7     | Scheduling                  | Backend/DevOps | Cron, secrets, manual trigger        |
| 8     | Class UI Integration        | Frontend       | Roster surfaces flags & sorting      |
| 9     | Student Profile Integration | Frontend       | Diagnosis panel renders data         |
| 10    | Admin Config UX             | Frontend       | Form to adjust weights/thresholds    |
| 11    | Testing & Verification      | QA             | Unit, integration, BDD, e2e passing  |
| 12    | Documentation & Rollout     | DevRel         | Docs, changelog, rollout plan        |

Each phase can be tackled iteratively or in parallel (e.g., UI work can stub APIs with mocks during backend development).

---

## ✅ Phase 1 — Database Foundations

**Objective**: Create persistent structures for monitoring status, diagnoses, and configuration.

- [ ] Author migration file `supabase/migrations/20250117000000_add_student_monitoring_system.sql`.
  - Tables: `student_monitoring_status`, `monitoring_diagnoses`, `monitoring_config`.
  - Indexes, constraints, comments.
  - Seed singleton config row.
- [ ] Apply migration locally via `supabase db push`.
- [ ] Regenerate TypeScript types:

  ```bash
  supabase gen types typescript --local > app/lib/database.types.ts
  ```

- [ ] Verify tables exist and default config inserted.
- [ ] Enable RLS and draft policies (see [Database Schema](database.md)).

**Artifacts**: Migration file, updated types, documentation references.

---

## ✅ Phase 2 — Types & Schemas

**Objective**: Define TypeScript contracts and validation schemas.

- [ ] Update `app/lib/types.ts`:

  ```typescript
  export type PriorityFlag = 'red' | 'yellow' | 'green';

  export interface StudentMonitoringStatus { ... }
  export interface MonitoringDiagnosis { ... }
  export interface MonitoringConfig { ... }
  export interface MonitoringAnalysisContext { ... }
  export interface ScoreComponents { observation: number; trend: number; homework: number; }
  ```

- [ ] Extend `app/lib/schemas.ts` with `MonitoringConfigSchema`, `AnalyzeRequestSchema`, etc.

  ```typescript
  export const MonitoringConfigSchema = z
    .object({
      analysisTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
      timezone: z.string(),
      enabled: z.boolean(),
      analysisDays: z.number().int().min(1).max(90),
      weightObservation: z.number().min(0).max(100),
      weightTrend: z.number().min(0).max(100),
      weightHomework: z.number().min(0).max(100),
      redThreshold: z.number().min(0).max(100),
      yellowThreshold: z.number().min(0).max(100),
      homeworkVariableName: z.string()
    })
    .refine(
      (d) => d.weightObservation + d.weightTrend + d.weightHomework === 100,
      'Weights must sum to 100'
    )
    .refine(
      (d) => d.yellowThreshold < d.redThreshold,
      'Yellow threshold must be less than red threshold'
    );
  ```

- [ ] Export schemas for API routes to consume.

**Acceptance Criteria**: All new types referenced by services and tests; schemas enforce business rules.

---

## ✅ Phase 3 — Scoring Utilities

**Objective**: Implement deterministic scoring functions with unit tests.

- [ ] Create `app/lib/utils/monitoring-scores.ts`:

  ```typescript
  export function calculateObservationScore(days: number): number { ... }
  export function calculateTrendScore(variables: VariableTrend[]): number { ... }
  export function calculateHomeworkScore(assessments: Assessment[], expected = 5): number { ... }
  export function calculateFinalScore(scores: ScoreComponents, weights: MonitoringConfigWeights): number { ... }
  export function getPriorityFlag(score: number, thresholds: MonitoringConfigThresholds): PriorityFlag { ... }
  ```

  - `calculateTrendScore` should perform linear regression per variable, weight declines, and normalize to 0–100.
  - Accept a structure like:

    ```typescript
    interface VariableTrend {
      id: string;
      name: string;
      points: Array<{ date: Date; value: number }>;
    }
    ```

- [ ] Write unit tests under `tests/services/monitoring-scores.test.ts` covering:
  - Edge cases (no data, all improving, heavy decline).
  - Weight and threshold combos.

**Acceptance Criteria**: Functions return expected outputs; tests cover edge scenarios.

---

## ✅ Phase 4 — AI Integration

**Objective**: Extend assessment AI service to generate diagnoses.

- [ ] Modify `app/lib/services/assessment-ai.ts` (or create dedicated `monitoring-ai.ts`) with:

  ```typescript
  export class AssessmentAI {
    async analyzeStudentMonitoring(context: MonitoringAnalysisContext): Promise<MonitoringDiagnosis> {
      const prompt = this.createMonitoringPrompt(context);
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      const parsed = MonitoringDiagnosisSchema.parse(JSON.parse(text));
      return { ...parsed, ...metadata };
    }

    private createMonitoringPrompt(context: MonitoringAnalysisContext): string { ... }
  }
  ```

- [ ] Implement `createMonitoringPrompt` using the template from [Architecture](architecture.md#🤖-ai-diagnosis-workflow).
- [ ] Handle JSON parse errors and AI failures gracefully (retry? fallback?).
- [ ] Log prompt + response metadata for observability (redact sensitive info).

**Acceptance Criteria**: Unit tests confirm prompt structure and JSON parsing logic; AI service returns validated object.

---

## ✅ Phase 5 — Monitoring Service

**Objective**: Orchestrate monitoring pipeline.

- [ ] Create `app/lib/services/student-monitoring-service.ts`:

  ```typescript
  export class StudentMonitoringService {
    constructor(
      private assessmentService: AssessmentService,
      private studentService: StudentService,
      private ai: AssessmentAI,
      private supabase: SupabaseClient,
      private configService: MonitoringConfigService,
    ) {}

    async analyzeClass(classId: string): Promise<ClassSummary> { ... }
    async analyzeStudent(studentId: string, classId?: string): Promise<StudentMonitoringStatus> { ... }
    async getClassMonitoringStatus(classId: string): Promise<StudentMonitoringStatusWithStudent[]> { ... }
    async getStudentDiagnoses(studentId: string, limit = 5): Promise<MonitoringDiagnosis[]> { ... }

    private async buildAnalysisContext(studentId: string, config: MonitoringConfig): Promise<MonitoringAnalysisContext> { ... }
  }
  ```

- [ ] Responsibilities:
  - Fetch config, roster, assessments.
  - Calculate scores and final flag.
  - Conditionally invoke AI (skip if insufficient data or config disables).
  - Upsert `student_monitoring_status` and insert `monitoring_diagnoses`.
  - Return status/detailed summary.
  - Batch processing with concurrency control (e.g., `p-limit`).

- [ ] Unit/integration tests:
  - Use mocks for services & AI.
  - Validate database mutations and returned objects.

**Acceptance Criteria**: Service handles happy paths + failure modes (AI error, no assessments). Tests pass.

---

## ✅ Phase 6 — API Surface

**Objective**: Expose REST endpoints.

- [ ] Implement Next.js App Router handlers:
  - `app/api/monitoring/analyze/route.ts`:
    - Validate body `{ classId: string, studentId?: string }`.
    - Authorize teacher (match `classId` ownership).
    - Call `monitoringService.analyzeClass()` or `.analyzeStudent()`.
    - Return summary with counts (`red/yellow/green`, duration, timestamp).

  - `app/api/monitoring/cron/route.ts`:
    - Require `Authorization: Bearer ${CRON_SECRET}`.
    - Skip if `config.enabled` false.
    - Iterate all classes (or targeted subset), capture successes/errors.

  - `app/api/monitoring/status/[classId]/route.ts`:
    - Validate access, return statuses sorted by score descending.

  - `app/api/monitoring/student/[studentId]/diagnoses/route.ts`:
    - Accept `limit` query param.
    - Return ordered diagnosis history.

  - `app/api/monitoring/config/route.ts`:
    - `GET`: return current config.
    - `PUT`: validate with schema, update fields, return new config.

- [ ] Add integration tests under `tests/api/monitoring.spec.ts` covering:
  - Permission enforcement.
  - Valid/invalid payloads.
  - Cron route secret enforcement.
  - Response shapes.

**Acceptance Criteria**: All handlers return expected status codes and payloads; tests pass.

---

## ✅ Phase 7 — Scheduling & Ops

**Objective**: Automate nightly analysis and manual triggers.

- [ ] Configure scheduling:
  - **Vercel**: add to `vercel.json`:

    ```json
    {
      "crons": [
        {
          "path": "/api/monitoring/cron",
          "schedule": "0 22 * * *"
        }
      ]
    }
    ```

  - **Alternative**: GitHub Actions workflow calling cron route.

- [ ] Store secrets:
  - `CRON_SECRET` in environment variables.
  - `GOOGLE_AI_API_KEY` (if not already set).
- [ ] Update README / docs with environment requirements.
- [ ] Optional: create local script `scripts/monitoring-cron.ts` for dev testing.

**Acceptance Criteria**: Cron route rejects unauthorized calls, logs successful runs, manual `POST /api/monitoring/analyze` works.

---

## ✅ Phase 8 — Class UI Integration

**Objective**: Surface flags on class roster.

- [ ] Update `app/(routes)/class/[id]/page.tsx` to fetch monitoring statuses (server component).
- [ ] Extend `app/(routes)/class/[id]/client.tsx`:
  - Merge statuses into student list.
  - Render color-coded avatars, tooltips, score badges.
  - Sorting (priority vs name) and filtering controls.
- [ ] Add skeleton states while data loads.
- [ ] Update relevant CSS/Tailwind for visual alignment.
- [ ] Write UI unit tests (Vitest + React Testing Library) for sorting/filtering logic.

**Acceptance Criteria**: Roster shows accurate colors, sorted by priority by default, filter toggles work.

---

## ✅ Phase 9 — Student Profile Integration

**Objective**: Display latest diagnosis and history.

- [ ] Create component `app/components/monitoring/StudentDiagnosisPanel.tsx`.
- [ ] Fetch diagnoses via React query or direct fetch in client component.
- [ ] Display:
  - Latest diagnosis summary, confidence.
  - Pattern list with severity icons (🔴/🟡/🟢).
  - Intervention cards (priority badge, actions, expected outcome).
  - Link/button to view history (modal or collapsible list).
- [ ] Handle loading, empty, and error states.
- [ ] Add unit tests for rendering logic.

**Acceptance Criteria**: Student profile shows panel when data available; updates reactively when new analysis runs.

---

## ✅ Phase 10 — Admin Configuration Page (Optional Initial Release)

**Objective**: Allow admins to tweak schedule and weights.

- [ ] Add route `app/(routes)/admin/monitoring/page.tsx`.
- [ ] Build form with fields:
  - Analysis time (time picker)
  - Timezone
  - Enabled toggle
  - Analysis window days
  - Weights (with sum validation)
  - Thresholds
  - Homework variable name
- [ ] Use `MonitoringConfigSchema` for client-side validation.
- [ ] Display next scheduled run, last run result.
- [ ] Include “Run Analysis Now” button (optionally with class dropdown).
- [ ] Protect route with appropriate authorization (admin role check).

**Acceptance Criteria**: Config updates persist, invalid inputs blocked, manual trigger works.

---

## ✅ Phase 11 — Testing & Verification

**Objective**: Ensure quality across layers.

1. **Unit Tests**
   - `tests/services/monitoring-scores.test.ts`
   - `tests/services/student-monitoring-service.test.ts`
   - `tests/lib/assessment-ai-monitoring.test.ts` (if separated)

2. **Integration Tests**
   - `tests/api/monitoring.spec.ts`
   - `tests/services/monitoring-config-service.test.ts`

3. **BDD Scenarios**
   - Author feature file (e.g., `tests/bdd/features/student-monitoring-system.feature`).
   - Include scenarios for red/yellow/green flags, AI diagnostics, config updates.
   - Implement step definitions under `tests/bdd/features/student-monitoring-system/step-definitions/`.

   ```gherkin
   @monitoring @smoke
   Scenario: Flag student as red when observation gap is high
     Given a class with a student missing observations for 12 days
     When the monitoring analysis runs
     Then the student is flagged as red
     And a diagnosis is stored for that student
   ```

4. **End-to-End Tests**
   - Add Playwright spec `tests/e2e/student-monitoring-system.spec.ts`.
   - Cover UI flows (class roster shows flags, student panel displays diagnosis, config change persists).

5. **Verification Script**

   ```bash
   pnpm run format
   pnpm run lint -- --fix
   pnpm run type-check
   pnpm run build

   pnpm test:unit
   pnpm test:integration
   pnpm test:bdd -- --tags @monitoring
   pnpm test:e2e --project chromium

   pnpm docs:build
   pnpm docs:test
   ```

**Acceptance Criteria**: All suites pass; coverage meets project standards (update coverage thresholds if needed).

---

## ✅ Phase 12 — Documentation & Rollout

**Objective**: Finalize knowledge base and release plan.

- [ ] Update:
  - `docs-portal/docs/features/student-monitoring-system/*`
  - `docs-portal/docs/standards/testing-strategy.md` (reference new BDD tags/tests)
  - `README.md` (environment variables, scripts)
  - Release notes / changelog.

- [ ] Add feature entry to product roadmap (if applicable).
- [ ] Communicate rollout plan:
  - Feature flags or gradual enablement.
  - Teacher training or support materials.
  - Monitoring checklist (alerts configured, dashboards ready).

- [ ] Coordinate with product to gather beta feedback before full rollout.

**Acceptance Criteria**: Documentation published, release checklist completed, stakeholders informed.

---

## 🔁 Ongoing Maintenance

- Monitor AI costs and adjust analysis frequency as needed.
- Tune weights/thresholds based on teacher feedback.
- Extend system with notifications, trend charts, or parent-facing reports.
- Review RLS policies and audits quarterly.

---

## 🗂️ Reference Index

- [Overview](overview.md)
- [Architecture & Service Design](architecture.md)
- [Database Schema](database.md)
- [Feature Lifecycle Process](../../processes/feature-lifecycle.md)
- [Testing Strategy](../../standards/testing-strategy.md)
- [Student Assessment Insights](../student-assessment-insights/overview.md) — example of previous feature documentation.

Use this guide as the implementation contract: keep it updated as tasks evolve, and reference it in pull requests to demonstrate coverage of each phase.
