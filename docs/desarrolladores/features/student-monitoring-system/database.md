---
id: student-monitoring-system-database
title: Database Schema
sidebar_label: Database
slug: /features/student-monitoring-system/database
---

# 🗄️ Student Monitoring System — Database Schema

This page documents the relational model that powers the Student Monitoring System. Use it when planning migrations, updating Supabase types, or troubleshooting data issues.

---

## 📚 Tables Overview

Three new tables extend the Supabase/PostgreSQL schema:

1. `student_monitoring_status` — latest monitoring snapshot per student/class.
2. `monitoring_diagnoses` — AI-generated diagnoses linked to status records.
3. `monitoring_config` — singleton configuration for scheduling, weights, and thresholds.

These tables live alongside existing `students`, `classes`, and assessment-related tables. Apply them via the migration file `supabase/migrations/20250117000000_add_student_monitoring_system.sql` (see [Implementation Guide](implementation-guide.md)).

---

## 1. `student_monitoring_status`

Stores the computed priority score, flag, and score breakdown for each student/class pair.

```sql
CREATE TABLE student_monitoring_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,

    priority_flag VARCHAR(10) NOT NULL CHECK (priority_flag IN ('red', 'yellow', 'green')),
    priority_score NUMERIC(5,2) NOT NULL,

    observation_score NUMERIC(5,2),
    trend_score NUMERIC(5,2),
    homework_score NUMERIC(5,2),

    diagnosis_summary TEXT,

    analyzed_at TIMESTAMPTZ NOT NULL,
    analysis_period_start DATE NOT NULL,
    analysis_period_end DATE NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(student_id, class_id)
);
```

### Suggested Indexes

```sql
CREATE INDEX idx_student_monitoring_priority
  ON student_monitoring_status(priority_flag, priority_score DESC);

CREATE INDEX idx_student_monitoring_class
  ON student_monitoring_status(class_id, priority_flag);

CREATE INDEX idx_student_monitoring_analyzed
  ON student_monitoring_status(analyzed_at);

CREATE INDEX idx_student_monitoring_student
  ON student_monitoring_status(student_id);
```

### Notes

- `priority_flag` is derived from the weighted score and thresholds in `monitoring_config`.
- `diagnosis_summary` stores a concise AI summary; full details live in `monitoring_diagnoses`.
- `analysis_period_start`/`analysis_period_end` capture the window (e.g., last 14 days).

---

## 2. `monitoring_diagnoses`

Persists AI responses, including patterns and intervention suggestions.

```sql
CREATE TABLE monitoring_diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status_id UUID NOT NULL REFERENCES student_monitoring_status(id) ON DELETE CASCADE,

    diagnosis_text TEXT NOT NULL,
    confidence NUMERIC(3,2) CHECK (confidence BETWEEN 0 AND 1),

    patterns JSONB,
    interventions JSONB NOT NULL,

    ai_model VARCHAR(100),
    ai_temperature NUMERIC(3,2),
    ai_tokens_used INTEGER,
    ai_response_time_ms INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_interventions CHECK (jsonb_typeof(interventions) = 'array'),
    CONSTRAINT valid_patterns CHECK (patterns IS NULL OR jsonb_typeof(patterns) = 'array')
);
```

### Indexes

```sql
CREATE INDEX idx_monitoring_diagnoses_status
  ON monitoring_diagnoses(status_id);

CREATE INDEX idx_monitoring_diagnoses_created
  ON monitoring_diagnoses(created_at DESC);
```

### JSONB Shapes

- **Patterns**:
  ```json
  {
    "type": "declining_trend" | "missing_observations" | "homework_issues" | "specific_variable",
    "description": "...",
    "severity": "high" | "medium" | "low",
    "variablesAffected": ["Participación", "Deberes"]
  }
  ```
- **Interventions**:
  ```json
  {
    "priority": "immediate" | "soon" | "monitor",
    "action": "...",
    "targetArea": "...",
    "expectedOutcome": "..."
  }
  ```

---

## 3. `monitoring_config`

Singleton record governing scheduling and scoring parameters.

```sql
CREATE TABLE monitoring_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    analysis_time TIME NOT NULL DEFAULT '22:00:00',
    timezone VARCHAR(50) DEFAULT 'America/Buenos_Aires',
    enabled BOOLEAN DEFAULT true,

    analysis_days INTEGER DEFAULT 14 CHECK (analysis_days > 0 AND analysis_days <= 90),

    weight_observation NUMERIC(5,2) DEFAULT 40.00,
    weight_trend NUMERIC(5,2) DEFAULT 35.00,
    weight_homework NUMERIC(5,2) DEFAULT 25.00,

    red_threshold NUMERIC(5,2) DEFAULT 70.00,
    yellow_threshold NUMERIC(5,2) DEFAULT 40.00,

    homework_variable_name VARCHAR(100) DEFAULT 'Tareas',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT single_config CHECK (id = '00000000-0000-0000-0000-000000000001'),
    CONSTRAINT valid_weights CHECK (
        weight_observation + weight_trend + weight_homework = 100
    ),
    CONSTRAINT valid_thresholds CHECK (
        yellow_threshold < red_threshold
    )
);
```

### Default Seed

```sql
INSERT INTO monitoring_config (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;
```

### Validation

- Update requests must enforce:
  - Weights sum to 100.
  - Thresholds between 0–100 with `yellow < red`.
  - `analysis_time` format `HH:MM:SS`.
- Use `MonitoringConfigSchema` (Zod) in `app/lib/schemas.ts`.

---

## 🔐 Row Level Security (RLS)

Enable RLS on each table and tie access to teacher ownership.

```sql
ALTER TABLE student_monitoring_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_config ENABLE ROW LEVEL SECURITY;
```

Example policy for statuses:

```sql
CREATE POLICY "Teachers view their class statuses"
ON student_monitoring_status
FOR SELECT USING (
  class_id IN (
    SELECT id FROM classes WHERE teacher_id = auth.uid()
  )
);
```

- Mirror policies for diagnoses (via join on `status_id`).
- Restrict configuration updates to admins (custom role or group).

---

## 🔄 Migration & Rollback

### Migration Checklist

1. Add all table definitions, indexes, constraints, and comments.
2. Insert default config row.
3. Grant permissions to relevant roles (`authenticated`, service role, etc.).
4. Regenerate Supabase TypeScript definitions:

   ```bash
   supabase gen types typescript --local > app/lib/database.types.ts
   ```

### Rollback

```sql
DROP TABLE IF EXISTS monitoring_diagnoses;
DROP TABLE IF EXISTS student_monitoring_status;
DROP TABLE IF EXISTS monitoring_config;
```

---

## 📈 Performance Considerations

- Indexes optimize common lookups (by class, flag, student, recency).
- Use `LIMIT` when fetching diagnosis history to avoid large payloads.
- Consider future partitioning of `monitoring_diagnoses` by date if volume grows.
- Archive or aggregate older diagnosis records to maintain performance.

---

## 📊 Example Queries

### Red-flagged Students per Class

```sql
SELECT
  s.id AS student_id,
  s.alias,
  sms.priority_flag,
  sms.priority_score,
  sms.diagnosis_summary,
  sms.analyzed_at
FROM student_monitoring_status sms
JOIN students s ON s.id = sms.student_id
WHERE sms.class_id = :classId
  AND sms.priority_flag = 'red'
ORDER BY sms.priority_score DESC;
```

### Latest Diagnosis for a Student

```sql
SELECT
  md.diagnosis_text,
  md.confidence,
  md.patterns,
  md.interventions,
  md.created_at,
  sms.priority_flag,
  sms.priority_score
FROM student_monitoring_status sms
JOIN monitoring_diagnoses md ON md.status_id = sms.id
WHERE sms.student_id = :studentId
ORDER BY md.created_at DESC
LIMIT 1;
```

### Class Summary

```sql
SELECT
  priority_flag,
  COUNT(*) AS count,
  AVG(priority_score) AS avg_score
FROM student_monitoring_status
WHERE class_id = :classId
GROUP BY priority_flag
ORDER BY
  CASE priority_flag
    WHEN 'red' THEN 1
    WHEN 'yellow' THEN 2
    ELSE 3
  END;
```

---

## 🔍 Troubleshooting Tips

| Symptom                    | Possible Cause                                    | Diagnostic Query                                                            |
| -------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------- |
| Missing status entries     | Student lacks assessments or analysis failed      | Check cron logs & `monitoring_diagnoses` for recent timestamps.             |
| Duplicate rows per student | Unique constraint missing or migration failed     | Verify `UNIQUE(student_id, class_id)` and reapply migration.                |
| Scores look incorrect      | Stale weights/config or missing homework variable | Inspect `monitoring_config` and confirm `homework_variable_name`.           |
| AI diagnosis absent        | Insufficient data or AI error                     | Check `diagnosis_summary` & `monitoring_diagnoses`; log AI response errors. |

---

## 📚 Related Documentation

- [Overview](overview.md)
- [Architecture & Service Design](architecture.md)
- [Implementation Guide](implementation-guide.md)
- [Feature Lifecycle Process](../../processes/feature-lifecycle.md)
- [Testing Strategy](../../standards/testing-strategy.md)

Use this schema as the authoritative reference when evolving the Student Monitoring System.
