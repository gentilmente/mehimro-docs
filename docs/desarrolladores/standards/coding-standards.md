---
id: coding-standards
title: Coding Standards
sidebar_label: Coding Standards
---

# Coding Standards

These standards keep the Mehmiro codebase consistent, maintainable, and production-ready.

## TypeScript Discipline

- `tsconfig.json` must use `strict: true`.
- Prohibit `any`; prefer discriminated unions, generics, or `unknown` with type guards.
- Model API payloads and domain objects with dedicated interfaces/types.
- Annotate complex types using JSDoc for clarity.

```typescript
interface Student {
  id: string;
  alias: string;
  classId: string;
  createdAt: Date;
}

function isStudent(candidate: unknown): candidate is Student {
  return (
    typeof candidate === 'object' &&
    candidate !== null &&
    'id' in candidate &&
    typeof (candidate as Student).id === 'string'
  );
}
```

## React Component Guidelines

- Default to functional components with explicit prop typings.
- Enforce single-responsibility; extract sub-components when logic grows.
- Provide sensible defaults via destructuring.
- Wrap expensive components in `React.memo` when beneficial.
- Use error boundaries for critical failure points.

```typescript
interface StudentCardProps {
  student: Student;
  onEdit?: (student: Student) => void;
  className?: string;
}

export function StudentCard({ student, onEdit, className }: StudentCardProps) {
  return (
    <article className={cn('rounded-lg border p-4 shadow-sm', className)}>
      <header className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{student.alias}</h3>
        {onEdit && (
          <button onClick={() => onEdit(student)} className="text-sm text-blue-600 hover:underline">
            Editar
          </button>
        )}
      </header>
    </article>
  );
}
```

## Styling & Layout

- TailwindCSS is the default; avoid bespoke CSS unless necessary.
- Follow mobile-first class ordering (`p-4 md:p-6`).
- Use design tokens defined in `globals.css` (colors, spacing).
- Keep layout consistent with flex/grid utilities.
- For custom CSS, follow BEM (e.g., `.student-card__title`).

```tsx
<button
  className={cn(
    'rounded-md border px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
    variant === 'primary' &&
      'border-transparent bg-blue-600 text-white hover:bg-blue-700',
    variant === 'secondary' &&
      'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
  )}
>
  Guardar
</button>
```

## State & Data Fetching

- Local UI state: `useState`, `useReducer`.
- Shared domain state: custom hooks (see `/app/hooks`).
- Always expose `{ data, isLoading, error, refetch }` pattern.
- Handle async errors with try/catch and user-friendly messages.
- Keep hook dependencies stable via `useCallback`/`useMemo`.

```typescript
export function useStudents(classId: string) {
  const [students, setStudents] = useState<Student[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setMessage(null);
    try {
      const response = await fetch(`/api/class/${classId}/students`);
      if (!response.ok) throw new Error('Failed to load students');
      const payload = (await response.json()) as Student[];
      setStudents(payload);
      setStatus('idle');
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : 'Unexpected error');
      setStatus('error');
    }
  }, [classId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { students, status, message, reload: load };
}
```

## Error Handling Patterns

- Create domain-specific error classes (`ApplicationError`, `ValidationError`).
- Log errors with context using `app/lib/logger`.
- Never surface raw error objects to users.
- Integrate fallback UI states (toasts, error banners, skeletons).

```typescript
try {
  const payload = assessmentSchema.parse(input);
  return await assessmentService.createAssessment(payload);
} catch (error) {
  logger.error('Assessment creation failed', { error, input });
  if (error instanceof ZodError) {
    throw new ValidationError('Invalid assessment data', error.issues);
  }
  throw new ApplicationError(
    'We could not guardar la evaluación, intenta nuevamente.',
    { cause: error }
  );
}
```

## Testing Expectations

- TDD whenever feasible: write failing test → implement → refactor.
- Maintain ≥80% coverage; include edge cases and negative flows.
- Unit tests (Vitest) for services, utilities, hooks.
- Integration/E2E (Playwright) for feature flows.
- BDD (Cucumber) scenarios aligned with documentation.

```typescript
describe('AssessmentInsightsService', () => {
  it('calculates average score excluding null values', async () => {
    const assessments = [
      { value: 8 },
      { value: null },
      { value: 7 }
    ] as unknown as Assessment[];
    const service = new AssessmentInsightsService(mockSupabase);

    const average = await service.calculateAverage(assessments);

    expect(average).toBeCloseTo(7.5);
  });
});
```

## File & Import Organization

- Use `PascalCase` for components, `camelCase` for utilities, `kebab-case` for file names.
- Top-level directories align with domain (e.g., `app/(routes)/student/[id]`).
- Imports ordered: React/next, third-party, absolute aliases, relative modules, types last.

```typescript
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useStudents } from '@/hooks/useStudents';
import { StudentCard } from '@/components/student/StudentCard';
import { formatDate } from '@/lib/utils';

import type { Student } from '@/app/lib/types';
```

## Documentation & Comments

- Document non-trivial logic with JSDoc.
- Keep README/docs synchronized with code changes.
- Link PRs to relevant documentation updates in `docs-portal`.

```typescript
/**
 * Normalizes assessment scores into a 0-1 range using variable scale bounds.
 * @param assessment - Raw assessment entry with value and variable info.
 * @returns Score between 0 and 1, or null when value is missing.
 */
export function normalizeAssessment(
  assessment: AssessmentWithVariable
): number | null {
  if (assessment.value === null) return null;
  const span = assessment.variable.scaleMax - assessment.variable.scaleMin;
  return (assessment.value - assessment.variable.scaleMin) / span;
}
```

## Performance Awareness

- Memoize expensive computations with `useMemo`.
- Debounce user inputs that trigger network calls.
- Lazy-load heavy components/charts.
- Profile regularly using React DevTools and browser profiler.

```typescript
const sortedStudents = useMemo(
  () => [...students].sort((a, b) => a.alias.localeCompare(b.alias)),
  [students]
);
```

---

**Related Standards**

- [UI Guidelines](ui-guidelines.md)
- [Testing Strategy](testing-strategy.md)
- [Core Guidelines](../foundations/core-guidelines.md)
