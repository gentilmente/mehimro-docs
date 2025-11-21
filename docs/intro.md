---
id: intro
title: Mehmiro Documentation Hub
sidebar_label: Overview
---

# Mehmiro Documentation Hub

Welcome to the centralized knowledge base for Mehmiro, the AI-powered educational assessment platform. This Docusaurus portal consolidates architectural rules, development standards, feature specifications, and BDD/TDD workflows into a single, continuously updated site.

## Documentation Structure

### Foundations

Core principles, vocabulary, and project context that guide all deliverables.

- [Development Persona & Approach](foundations/persona.md)
- [Project Overview](foundations/project-overview.md)
- [Glossary](foundations/glossary.md)
- [Core Guidelines](foundations/core-guidelines.md)

### Architecture

System blueprints, data modeling, and non-functional requirements.

- [System Architecture](architecture/system-architecture.md)
- [Data Model](architecture/data-model.md)
- [Performance & Security](architecture/performance-security.md)

### Standards

Engineering guidelines for consistent, production-ready delivery.

- [Coding Standards](standards/coding-standards.md)
- [UI Guidelines](standards/ui-guidelines.md)
- [Testing Strategy](standards/testing-strategy.md)

### Processes

Operational playbooks, governance, and feature lifecycle definitions.

- [Feature Lifecycle](processes/feature-lifecycle.md)
- [Documentation Governance](processes/documentation-governance.md)

### Features

Detailed feature specifications, including BDD scenarios, implementation notes, and test assets.

- [Student Assessment Insights](features/student-assessment-insights/overview.md)
- [Student Monitoring System](features/student-monitoring-system/overview.md)

### Reference

API, hooks, and service documentation that support implementation details.

_Coming soon — API, hooks, and service references will be documented alongside code generation tooling._

## Quick Navigation

| Goal                          | Path                                                       |
| ----------------------------- | ---------------------------------------------------------- |
| Understand the product vision | [Project Overview](foundations/project-overview.md)        |
| Align on engineering persona  | [Development Persona & Approach](foundations/persona.md)   |
| Start a new feature           | [Feature Lifecycle](processes/feature-lifecycle.md)        |
| Write BDD scenarios           | [Testing Strategy](standards/testing-strategy.md)          |
| Check coding rules            | [Coding Standards](standards/coding-standards.md)          |
| Review system architecture    | [System Architecture](architecture/system-architecture.md) |

## Keeping Documentation in Sync

Follow the rules below to ensure the portal stays aligned with the codebase:

1. Update relevant documentation alongside every code change.
2. Use the provided templates in each section when adding new content.
3. Validate links and cross-references before merging.
4. Run `pnpm docs:build` and `pnpm docs:test` (see [Documentation Governance](processes/documentation-governance.md)) prior to submitting pull requests.

## Related Resources

- [Repository README](https://github.com/gentilmente/mehimro-docs#readme)
- [Tests Suite](https://github.com/gentilmente/mehimro-docs/tree/main/tests)
- [Component Library](https://github.com/gentilmente/mehimro-docs/tree/main/components)
- [Storybook](https://mehmiro-storybook.vercel.app)

---

_This site is built with Docusaurus 3.9 and is intended to serve as the living source of truth for Mehmiro’s architecture, standards, and feature documentation._
