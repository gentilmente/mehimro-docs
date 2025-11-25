---
id: feature-catalog
title: Feature Catalog
sidebar_label: Feature Catalog
---

# 🌐 Feature Catalog

This catalog centralizes Mehmiro’s feature documentation so every capability follows the same discovery → BDD → TDD lifecycle. Use it to explore delivered features, understand ownership, and bootstrap new initiatives with the provided templates and processes.

---

## ✅ Delivered Features

### Student Assessment Insights

- **Business Goal**: Give teachers a holistic, AI-augmented view of each student’s trajectory.
- **Highlights**: Reuses dashboard components, adds trend and comparison analytics, offers export formats, and ships with full BDD/TDD coverage.
- **Docs**:
  - [Overview](student-assessment-insights/overview.md)
  - [Architecture Diagram](student-assessment-insights/architecture.md)
  - [BDD Scenarios](student-assessment-insights/bdd-scenarios.md)

### Student Monitoring System (Traffic Light Prioritization)

- **Business Goal**: Automatically spotlight students needing intervention via weighted scoring and AI diagnoses.
- **Highlights**: Scheduled analysis, configurable weights/thresholds, Supabase-backed persistence, roster & profile integrations.
- **Docs**:
  - [Overview](student-monitoring-system/overview)
  - [Architecture & Service Design](student-monitoring-system/architecture)
  - [Database Schema](student-monitoring-system/database)
  - [Implementation Guide](student-monitoring-system/implementation-guide)

---

## 🧭 Planning a New Feature

Follow the [Feature Lifecycle](../processes/feature-lifecycle.md) to add a new entry:

1. **Discovery**: Clarify personas, goals, and success metrics.
2. **Documentation**: Create a folder under `features/<feature-name>/` with:
   - `overview.md`
   - `architecture.md`
   - Optional supporting docs (`bdd-scenarios.md`, `implementation-guide.md`, etc.)
3. **BDD First**: Draft scenarios and step definitions in `tests/bdd/features/<feature-name>.feature`.
4. **TDD Delivery**: Implement minimal code to pass tests, then refactor.
5. **Portal Update**: Add your feature to this catalog and ensure sidebar navigation points to the new pages.

> Tip: Duplicate the structure of an existing feature (e.g., Student Monitoring System) as a starting point.

---

## 📚 Supporting References

- [Feature Lifecycle Process](../processes/feature-lifecycle.md)
- [Testing Strategy](../standards/testing-strategy.md)
- [Architecture Overview](../architecture/system-architecture.md)
- [Documentation Governance (TBD)](../processes/documentation-governance.md)

Keep this catalog updated whenever a feature reaches the “documented” milestone so the docs portal remains the single source of truth.
