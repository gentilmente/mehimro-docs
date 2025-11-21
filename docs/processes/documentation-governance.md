---
id: documentation-governance
title: Documentation Governance
sidebar_label: Documentation Governance
---

# Documentation Governance

This governance model keeps the Mehmiro documentation portal aligned with the codebase. Every change must preserve accuracy, traceability, and quality.

## Ownership & Responsibilities

| Area         | Owner                        | Responsibilities                |
| ------------ | ---------------------------- | ------------------------------- |
| Foundations  | Product & Architecture Leads | Vision, personas, glossary      |
| Architecture | Tech Leads                   | Diagrams, data models, NFRs     |
| Standards    | Engineering Owners           | Coding, UI, testing conventions |
| Processes    | Engineering Productivity     | Workflows, governance           |
| Features     | Feature Squads               | Specs, scenarios, release notes |
| Reference    | Service/Hook Owners          | API details, type contracts     |

## Update Policy

1. **Documentation-first mindset**: Draft or update docs before merging code.
2. **Single-source of truth**: All project policies reside in this portal.
3. **Change sets**: Code + tests + docs must ship in the same PR.
4. **Review**: Docs require review from at least one area owner.
5. **Audit trail**: Link merged PRs to documentation history (frontmatter `last_updated_by` optional).

## Page Template

Every page should include:

1. **Frontmatter**

   ```yaml
   ---
   id: unique-id
   title: Human-readable title
   sidebar_label: Short nav label
   ---
   ```

2. **Overview**: 1–2 paragraphs describing purpose and audience.
3. **Key tables or bullet lists**: Ownership, responsibilities, KPIs.
4. **Process or architecture sections**: Steps, diagrams, commands.
5. **Links**: Related pages and external resources.

## Change Workflow

1. **Identify gap**: Create an issue or note referencing outdated content.
2. **Draft update**: Use `docs-portal` template (Markdown + frontmatter).
3. **Run validation**
   ```bash
   pnpm docs:build
   pnpm docs:test
   ```
4. **Submit PR**: Include doc links and summary.
5. **Review**: Owner sign-off, verify accuracy.
6. **Merge**: Release notes (if applicable) should mention documentation updates.

## Automation

### Local Commands

```bash
# Live preview
pnpm --filter docs-portal dev

# Type check / lint markdown (if configured)
pnpm --filter docs-portal lint

# CI commands (run in root project)
pnpm docs:build
pnpm docs:test
```

### CI Integration

- `docs:build`: ensures Docusaurus site builds without warnings.
- `docs:test`: placeholder script to add markdown linting or link checking.
- Add docs jobs to main pipeline (fail build on errors).

## Versioning (Future)

- Adopt Docusaurus doc versioning when releasing major milestones.
- Archive prior versions under `/docs/versioned_docs`.
- Provide release notes summarizing documentation changes.

## Quality Checklist

- Content is current and references latest code paths.
- Links resolve (internal and external).
- Mermaid diagrams render after `docs:build`.
- Tables and code blocks are accessible (descriptive headers, language tags).
- Screenshots (if any) include alt text and are stored under `/static/img`.

## Review Cadence

- **Monthly audit**: Owners verify assigned sections.
- **Post-release**: Ensure new features have overview + scenarios.
- **Quarterly clean-up**: Remove deprecated references, restructure if needed.

## Incident Response

If documentation fell out of sync:

1. File a “Documentation Debt” issue tagged with affected area.
2. Assign to corresponding owner.
3. Develop remediation plan (update docs, add automated checks).
4. Retrospective to prevent recurrence.

---

**Related Pages**

- [Feature Lifecycle](feature-lifecycle.md)
- [Testing Strategy](../standards/testing-strategy.md)
- [Coding Standards](../standards/coding-standards.md)
