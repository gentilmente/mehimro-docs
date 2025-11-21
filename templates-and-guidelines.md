# Content Templates & Guidelines

## 1. User Guide Templates

### 1.1 Tutorial Template
**Filename:** `tutorial-name.md`
**Location:** `docs/user/tutorials/`

```markdown
---
id: tutorial-name
title: [Action-Oriented Title, e.g., "Creating Your First Assessment"]
sidebar_label: [Short Label]
description: [Brief description of what the user will achieve]
---

# [Title]

## Goal
Briefly explain what you will learn to do in this tutorial.

## Prerequisites
*   [Requirement 1]
*   [Requirement 2]

## Step 1: [Action Name]
Instructions...

![Screenshot description](./img/screenshot-name.png)

:::tip
Helpful advice for this step.
:::

## Step 2: [Action Name]
Instructions...

## Conclusion
You have successfully [achieved goal]. Next, try [link to next tutorial].
```

### 1.2 Feature Guide Template
**Filename:** `feature-name.md`
**Location:** `docs/user/guides/`

```markdown
---
id: feature-name
title: [Feature Name]
sidebar_label: [Feature Name]
---

# [Feature Name]

## Overview
What is this feature and why should I use it? (Non-technical language)

## Key Capabilities
*   **Capability A**: Description
*   **Capability B**: Description

## How to Use
1.  Go to...
2.  Click...

## Common Use Cases
*   **Scenario 1**: Description
*   **Scenario 2**: Description
```

---

## 2. Research Templates

### 2.1 Research Paper / Article Template
**Filename:** `paper-slug.md`
**Location:** `docs/research/papers/`

```markdown
---
id: paper-slug
title: [Academic Title]
authors: [Author Names]
publish_date: YYYY-MM-DD
tags: [pedagogy, ai, assessment]
---

# [Title]

**Abstract**
*Brief summary of the research or article.*

## Introduction
Context and problem statement.

## Methodology
Explanation of the pedagogical approach or research method.

## Findings / Discussion
Analysis of results or theoretical discussion.

## Conclusion
Summary of implications for education.

## References
1.  [Citation 1]
2.  [Citation 2]
```

---

## 3. Developer Hub Guidelines (Updates)

### 3.1 Technical Feature Spec (Existing but Refined)
**Location:** `docs/developer/features/`

*   **Must Include**:
    *   Link to User Guide version of the feature (Cross-linking).
    *   Architecture Diagram (Mermaid).
    *   BDD Scenarios (Gherkin).
    *   Data Model changes.

---

## 4. General Style Guidelines

*   **Voice & Tone**:
    *   *User Guide*: Encouraging, simple, direct. Avoid jargon.
    *   *Developer Hub*: Precise, technical, concise.
    *   *Research*: Academic, formal, evidence-based.
*   **Images**: Use screenshots for User Guides. Use diagrams (Mermaid) for Developer docs.
*   **Admonitions**: Use `:::note`, `:::tip`, and `:::warning` generously to break up text.