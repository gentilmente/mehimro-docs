---
id: student-monitoring-system-database-detailed
title: Database Schema - Student Monitoring System
sidebar_label: Database Schema Detailed
---

# Database Schema - Student Monitoring System

## Overview

This document provides the complete database schema for the student monitoring system.

## Tables

### 1. student_monitoring_status

Stores the current monitoring status for each student in each class.

```sql
CREATE TABLE student_monitoring_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,

    -- Priority flag (traffic light)
    priority_flag VARCHAR(10) NOT NULL CHECK (priority_flag IN ('red', 'yellow', 'green')),

    -- Weighted score (0-100)
    priority_score NUMERIC(5,2) NOT NULL,

    -- Score components
    observation_score NUMERIC(5,2),
    trend_score NUMERIC(5,2),
    homework_score NUMERIC(5,2),

    -- AI diagnosis
    diagnosis_summary TEXT,

    -- Analysis metadata
    analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    analysis_period_start DATE NOT NULL,
    analysis_period_end DATE NOT NULL,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure one status per student per class
    UNIQUE(student_id, class_id)
);

-- Indexes for performance
CREATE INDEX idx_student_monitoring_priority
    ON student_monitoring_status(priority_flag, priority_score DESC);

CREATE INDEX idx_student_monitoring_class
    ON student_monitoring_status(class_id, priority_flag);

CREATE INDEX idx_student_monitoring_analyzed
    ON student_monitoring_status(analyzed_at);

CREATE INDEX idx_student_monitoring_student
    ON student_monitoring_status(student_id);

-- Comments
COMMENT ON TABLE student_monitoring_status IS
    'Stores current monitoring status and scores for each student';

COMMENT ON COLUMN student_monitoring_status.priority_flag IS
    'Traffic light priority: red (urgent), yellow (attention needed), green (good)';

COMMENT ON COLUMN student_monitoring_status.priority_score IS
    'Weighted final score (0-100) determining priority flag';

COMMENT ON COLUMN student_monitoring_status.diagnosis_summary IS
    'Brief AI-generated summary of student status';
```

### 2. monitoring_diagnoses

Stores detailed AI-generated diagnoses and intervention suggestions.

```sql
CREATE TABLE monitoring_diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status_id UUID NOT NULL REFERENCES student_monitoring_status(id) ON DELETE CASCADE,

    -- Diagnosis details
    diagnosis_text TEXT NOT NULL,
    confidence NUMERIC(3,2) CHECK (confidence >= 0 AND confidence <= 1),

    -- Detected patterns (JSONB array)
    patterns JSONB,

    -- Intervention suggestions (JSONB array)
    interventions JSONB NOT NULL,

    -- AI metadata
    ai_model VARCHAR(100),
    ai_temperature NUMERIC(3,2),
    ai_tokens_used INTEGER,
    ai_response_time_ms INTEGER,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_interventions CHECK (jsonb_typeof(interventions) = 'array'),
    CONSTRAINT valid_patterns CHECK (
        patterns IS NULL OR jsonb_typeof(patterns) = 'array'
    )
);

-- Indexes
CREATE INDEX idx_monitoring_diagnoses_status
    ON monitoring_diagnoses(status_id);

CREATE INDEX idx_monitoring_diagnoses_created
    ON monitoring_diagnoses(created_at DESC);

-- Comments
COMMENT ON TABLE monitoring_diagnoses IS
    'Stores detailed AI-generated diagnoses with intervention suggestions';

COMMENT ON COLUMN monitoring_diagnoses.patterns IS
    'Array of detected patterns in student behavior/performance';

COMMENT ON COLUMN monitoring_diagnoses.interventions IS
    'Array of suggested interventions with priorities and expected outcomes';
```

### 3. monitoring_config

Stores system configuration (singleton table).

```sql
CREATE TABLE monitoring_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Scheduling
    analysis_time TIME NOT NULL DEFAULT '22:00:00',
    timezone VARCHAR(50) DEFAULT 'America/Buenos_Aires',
    enabled BOOLEAN DEFAULT true,

    -- Analysis window
    analysis_days INTEGER DEFAULT 14 CHECK (analysis_days > 0 AND analysis_days <= 90),

    -- Scoring weights (must sum to 100)
    weight_observation NUMERIC(5,2) DEFAULT 40.00 CHECK (weight_observation >= 0 AND weight_observation <= 100),
    weight_trend NUMERIC(5,2) DEFAULT 35.00 CHECK (weight_trend >= 0 AND weight_trend <= 100),
    weight_homework NUMERIC(5,2) DEFAULT 25.00 CHECK (weight_homework >= 0 AND weight_homework <= 100),

    -- Thresholds for flags (0-100 scale)
    red_threshold NUMERIC(5,2) DEFAULT 70.00 CHECK (red_threshold > 0 AND red_threshold <= 100),
    yellow_threshold NUMERIC(5,2) DEFAULT 40.00 CHECK (yellow_threshold > 0 AND yellow_threshold <= 100),

    -- Homework variable name (for identifying homework assessments)
    homework_variable_name VARCHAR(100) DEFAULT 'Tareas',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT single_config CHECK (id = '00000000-0000-0000-0000-000000000001'::uuid),
    CONSTRAINT valid_weights CHECK (
        weight_observation + weight_trend + weight_homework = 100
    ),
    CONSTRAINT valid_thresholds CHECK (
        yellow_threshold < red_threshold
    )
);

-- Insert default configuration
INSERT INTO monitoring_config (id)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid)
ON CONFLICT (id) DO NOTHING;

-- Comments
COMMENT ON TABLE monitoring_config IS
    'System configuration for student monitoring (singleton table)';

COMMENT ON COLUMN monitoring_config.analysis_time IS
    'Time of day to run scheduled analysis (in timezone specified)';

COMMENT ON COLUMN monitoring_config.weight_observation IS
    'Weight % for observation gap score (days since last teacher observation)';

COMMENT ON COLUMN monitoring_config.weight_trend IS
    'Weight % for trend analysis score (declining assessment patterns)';

COMMENT ON COLUMN monitoring_config.weight_homework IS
    'Weight % for homework compliance score';
```

## JSONB Structure Specifications

### patterns Field in monitoring_diagnoses

```json
[
    {
        "type": "declining_trend" | "missing_observations" | "homework_issues" | "specific_variable",
        "description": "Human-readable description of the pattern",
        "severity": "high" | "medium" | "low",
        "variablesAffected": ["Variable Name 1", "Variable Name 2"]
    }
]
```

### interventions Field in monitoring_diagnoses

```json
[
    {
        "priority": "immediate" | "soon" | "monitor",
        "action": "Specific action to take (1-2 sentences)",
        "targetArea": "Skill or variable to address",
        "expectedOutcome": "What this intervention should achieve"
    }
]
```

## Example Queries

### Get all red-flagged students for a class

```sql
SELECT
    s.id,
    s.name,
    sms.priority_flag,
    sms.priority_score,
    sms.diagnosis_summary,
    sms.analyzed_at
FROM student_monitoring_status sms
JOIN students s ON s.id = sms.student_id
WHERE sms.class_id = 'your-class-id'
    AND sms.priority_flag = 'red'
ORDER BY sms.priority_score DESC;
```

### Get student with latest diagnosis

```sql
SELECT
    s.id,
    s.name,
    sms.priority_flag,
    sms.priority_score,
    md.diagnosis_text,
    md.interventions,
    md.patterns,
    md.confidence,
    md.created_at
FROM students s
JOIN student_monitoring_status sms ON sms.student_id = s.id
LEFT JOIN monitoring_diagnoses md ON md.status_id = sms.id
WHERE s.id = 'your-student-id'
ORDER BY md.created_at DESC
LIMIT 1;
```

### Get monitoring summary for class

```sql
SELECT
    priority_flag,
    COUNT(*) as count,
    AVG(priority_score) as avg_score
FROM student_monitoring_status
WHERE class_id = 'your-class-id'
GROUP BY priority_flag
ORDER BY
    CASE priority_flag
        WHEN 'red' THEN 1
        WHEN 'yellow' THEN 2
        WHEN 'green' THEN 3
    END;
```

### Get diagnosis history for student

```sql
SELECT
    md.id,
    md.diagnosis_text,
    md.interventions,
    md.patterns,
    md.confidence,
    md.created_at,
    sms.priority_flag,
    sms.priority_score
FROM monitoring_diagnoses md
JOIN student_monitoring_status sms ON sms.id = md.status_id
WHERE sms.student_id = 'your-student-id'
ORDER BY md.created_at DESC
LIMIT 10;
```

## Migration File

Create file: `supabase/migrations/20250117000000_add_student_monitoring_system.sql`

Include:

1. All three table definitions
2. All indexes
3. All comments
4. Default config insert
5. Grant permissions to appropriate roles

## Rollback Strategy

To rollback this migration:

```sql
-- Drop tables in reverse order
DROP TABLE IF EXISTS monitoring_diagnoses;
DROP TABLE IF EXISTS student_monitoring_status;
DROP TABLE IF EXISTS monitoring_config;
```

## Performance Considerations

1. **Indexes**: All frequently queried columns have indexes
2. **JSONB**: Use JSONB for flexible pattern/intervention storage with indexing support if needed
3. **Partitioning**: Consider partitioning `monitoring_diagnoses` by `created_at` if table grows very large
4. **Archiving**: Implement archiving strategy for old diagnoses (>90 days)

## Security

1. **Row Level Security (RLS)**: Implement RLS policies based on user roles
2. **Permissions**: Grant appropriate permissions to authenticated users only
3. **Audit**: All tables include timestamps for audit trail

## Future Enhancements

1. Add `monitoring_history` table to track status changes over time
2. Add `monitoring_alerts` table for notification management
3. Add indexes on JSONB fields if specific queries are needed
4. Consider materialized views for complex aggregations
