---
id: ui-guidelines
title: UI Guidelines & Design System
sidebar_label: UI Guidelines
---

# UI Guidelines & Design System

These conventions ensure Mehmiro delivers a consistent, accessible, and mobile-first experience.

## Design Principles

### Mobile-First

- Design layouts for phone viewports first, then scale up.
- Optimize touch targets (≥44px) and gesture interactions.
- Prioritize content hierarchy for narrow screens.

### Accessibility

- Target WCAG 2.1 AA compliance.
- Ensure keyboard navigation for all interactive elements.
- Provide visible focus outlines and logical tab order.
- Add semantic HTML, ARIA attributes, and screen reader labels.
- Maintain ≥4.5:1 contrast for normal text, ≥3:1 for large text.

## Component Stack

### shadcn/ui Primitives

- Button, Dialog, Tabs, RadioGroup, Textarea, Input, Switch.
- Extend via wrapper components to enforce domain-specific behavior.

### Custom Components

- `StudentCard`, `AssessmentChart`, `FormField`, `LoadingSkeleton`.
- Compose primitives and add Tailwind theming.

## Color System

```css
:root {
  --primary: 59 130 246; /* blue-500 */
  --primary-foreground: 255 255 255;
  --secondary: 107 114 128; /* gray-500 */
  --secondary-foreground: 255 255 255;

  --success: 34 197 94; /* green-500 */
  --warning: 245 158 11; /* amber-500 */
  --error: 239 68 68; /* red-500 */
  --info: 59 130 246; /* blue-500 */

  --student-green: 34 197 94;
  --student-yellow: 245 158 11;
  --student-red: 239 68 68;
}
```

Dark mode overrides (prefers-color-scheme) live in `app/globals.css`.

## Typography

- Base font: **Inter** (sans-serif).
- Code/monospace: **JetBrains Mono**.
- Font scale:
  - `--text-xs`: 0.75rem
  - `--text-sm`: 0.875rem
  - `--text-base`: 1rem
  - `--text-lg`: 1.125rem
  - `--text-xl`: 1.25rem
  - `--text-2xl`: 1.5rem
  - `--text-3xl`: 1.875rem

Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold).

## Spacing Scale

```css
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.25rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-10: 2.5rem;
--space-12: 3rem;
--space-16: 4rem;
```

Usage:

- Component padding: `space-4`.
- Vertical rhythm between sections: `space-6`.
- Page gutters: `space-4` mobile, `space-8` desktop.

## Layout & Patterns

### Cards

```tsx
<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
  <header className="mb-4 flex items-center justify-between">
    <h3 className="text-lg font-semibold text-gray-900">Título</h3>
    <StatusBadge status="success" />
  </header>
  <p className="text-sm text-gray-600">Contenido...</p>
</div>
```

### Forms

```tsx
<div className="space-y-2">
  <Label htmlFor="alias">Alias</Label>
  <Input
    id="alias"
    className="w-full"
    autoComplete="off"
    aria-invalid={Boolean(error)}
  />
  {error && <p className="text-sm text-red-600">{error}</p>}
</div>
```

### Buttons

```tsx
<Button className="bg-blue-600 hover:bg-blue-700 text-white">Guardar</Button>
<Button variant="outline" className="text-gray-700">Cancelar</Button>
<Button className="bg-red-600 hover:bg-red-700 text-white">Eliminar</Button>
```

## Responsive Behavior

Breakpoints (Tailwind defaults):

| Name | Min Width |
| ---- | --------- |
| `sm` | 640px     |
| `md` | 768px     |
| `lg` | 1024px    |
| `xl` | 1280px    |

Example:

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* responsive grid */}
</div>
```

## Iconography

- Use **Lucide** icons (consistent weight & style).
- Sizes: 16px (inline), 20px (default), 24px (emphasis).
- Pair with textual labels or tooltips.
- Apply semantic colors (`text-gray-500`, `text-blue-500`, etc.).

## Loading & Empty States

Skeleton example:

```tsx
<div className="animate-pulse rounded-lg border p-4">
  <div className="mb-4 h-4 w-2/3 rounded bg-gray-200" />
  <div className="h-3 w-1/2 rounded bg-gray-200" />
</div>
```

Empty state copy must include:

- Illustration or icon.
- Brief explanation.
- Primary action.

## Error Handling

Inline error:

```tsx
<p className="mt-1 text-sm text-red-600" role="alert">
  No pudimos guardar los cambios. Intenta nuevamente.
</p>
```

Alert pattern:

```tsx
<div className="rounded-md border border-red-200 bg-red-50 p-4">
  <div className="flex">
    <AlertTriangle className="h-5 w-5 text-red-400" />
    <div className="ml-3 space-y-1">
      <h3 className="text-sm font-medium text-red-800">Error al analizar</h3>
      <p className="text-sm text-red-700">
        Revisa la conexión e inténtalo otra vez.
      </p>
    </div>
  </div>
</div>
```

## Motion & Transitions

- Duration 150–300ms; easing `ease-out`.
- Prefer `transition-colors`, `transition-opacity`, `transition-transform`.

```tsx
<button className="transition-colors duration-200 hover:bg-blue-700">
  Continuar
</button>
```

## Dark Mode

Use Tailwind `dark:` variants:

```tsx
<div className="bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-50">
  Contenido
</div>
```

Include component-specific overrides when contrast differs.

## Accessibility Checklist

- ✅ Semantic HTML structure.
- ✅ ARIA labels for icons/buttons without text.
- ✅ `aria-live` or toast notifications for asynchronous completions.
- ✅ Skip links at top-level layouts.
- ✅ Test via keyboard, screen readers (VoiceOver/NVDA), and high-contrast mode.

---

**Related References**

- [Coding Standards](coding-standards.md)
- [Testing Strategy](testing-strategy.md)
- [Storybook Instance](https://mehmiro-storybook.vercel.app) for live components.
