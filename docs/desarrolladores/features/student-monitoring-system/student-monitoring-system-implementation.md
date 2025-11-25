---
id: student-monitoring-system-implementation-detailed
title: Implementation Guide - Student Monitoring System
sidebar_label: Implementation Guide Detailed
---

# Implementation Guide - Student Monitoring System

## Overview

This guide provides step-by-step instructions for implementing the student monitoring system with traffic light prioritization.

## Prerequisites

- Next.js 15+ with App Router
- Supabase PostgreSQL database
- Google Generative AI API access
- Existing assessment and student services

## Implementation Phases

---

## Phase 1: Database Setup ✅

**Estimated Time**: 1-2 hours

### Steps

1. **Create Migration File**
   - File: `supabase/migrations/20250117000000_add_student_monitoring_system.sql`
   - Include all three tables from DATABASE_SCHEMA.md
   - Add indexes, comments, and default config

2. **Run Migration**

   ```bash
   # Using Supabase CLI
   supabase db push

   # Or apply manually in Supabase dashboard
   ```

3. **Verify Tables**

   ```sql
   -- Check tables exist
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name LIKE 'monitoring%';

   -- Verify default config
   SELECT * FROM monitoring_config;
   ```

4. **Update TypeScript Types**
   - File: `app/lib/database.types.ts`
   - Run: `supabase gen types typescript --local > app/lib/database.types.ts`
   - Or manually add table types

### Deliverables

- [ ] Migration file created
- [ ] Tables created in database
- [ ] Default config inserted
- [ ] TypeScript types updated

---

## Phase 2: Type Definitions & Schemas 📝

**Estimated Time**: 2-3 hours

### Steps

1. **Add Types to `app/lib/types.ts`**

```typescript
// Monitoring Status Types
export type PriorityFlag = 'red' | 'yellow' | 'green';

export interface StudentMonitoringStatus {
  id: string;
  studentId: string;
  classId: string;
  priorityFlag: PriorityFlag;
  priorityScore: number;
  observationScore: number;
  trendScore: number;
  homeworkScore: number;
  diagnosisSummary?: string;
  analyzedAt: Date;
  analysisPeriodStart: Date;
  analysisPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonitoringPattern {
  type:
    | 'declining_trend'
    | 'missing_observations'
    | 'homework_issues'
    | 'specific_variable';
  description: string;
  severity: 'high' | 'medium' | 'low';
  variablesAffected: string[];
}

export interface MonitoringIntervention {
  priority: 'immediate' | 'soon' | 'monitor';
  action: string;
  targetArea: string;
  expectedOutcome: string;
}

export interface MonitoringDiagnosis {
  id: string;
  statusId: string;
  diagnosisText: string;
  confidence: number;
  patterns?: MonitoringPattern[];
  interventions: MonitoringIntervention[];
  aiModel?: string;
  aiTemperature?: number;
  aiTokensUsed?: number;
  createdAt: Date;
}

export interface MonitoringConfig {
  id: string;
  analysisTime: string; // HH:MM:SS format
  timezone: string;
  enabled: boolean;
  analysisDays: number;
  weightObservation: number;
  weightTrend: number;
  weightHomework: number;
  redThreshold: number;
  yellowThreshold: number;
  homeworkVariableName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScoreComponents {
  observation: number;
  trend: number;
  homework: number;
}

export interface MonitoringAnalysisContext {
  student: {
    id: string;
    name: string;
    age: number;
    grade: number;
  };
  class: {
    name: string;
    grade: number;
    section: string;
  };
  analysisWindow: {
    startDate: string;
    endDate: string;
  };
  scores: ScoreComponents & { final: number };
  assessmentData: {
    variables: Array<{
      id: string;
      name: string;
      description: string;
      recentValues: Array<{
        date: string;
        value: number;
        comments?: string;
      }>;
      trend: 'improving' | 'stable' | 'declining';
      average: number;
    }>;
  };
}
```

2. **Add Validation Schemas to `app/lib/schemas.ts`**

```typescript
import { z } from 'zod';

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
    (data) =>
      data.weightObservation + data.weightTrend + data.weightHomework === 100,
    { message: 'Weights must sum to 100' }
  )
  .refine((data) => data.yellowThreshold < data.redThreshold, {
    message: 'Yellow threshold must be less than red threshold'
  });

export type UpdateMonitoringConfigData = z.infer<typeof MonitoringConfigSchema>;
```

### Deliverables

- [ ] Types added to types.ts
- [ ] Schemas added to schemas.ts
- [ ] Types exported and available

---

## Phase 3: Scoring Algorithm Implementation 🧮

**Estimated Time**: 4-5 hours

### Steps

1. **Create Scoring Utility**
   - File: `app/lib/utils/monitoring-scores.ts`

2. **Implement Scoring Functions**

```typescript
// app/lib/utils/monitoring-scores.ts

import { Assessment } from '@/app/lib/types';

export function calculateObservationScore(
  daysSinceLastObservation: number
): number {
  if (daysSinceLastObservation === 0) return 0;
  if (daysSinceLastObservation <= 3) return 20;
  if (daysSinceLastObservation <= 7) return 50;
  if (daysSinceLastObservation <= 10) return 75;
  return 100;
}

export function calculateTrendScore(
  variableAssessments: Map<string, Assessment[]>
): number {
  // Implementation for trend analysis using linear regression
  // See ARCHITECTURE.md for detailed algorithm
}

export function calculateHomeworkScore(
  homeworkAssessments: Assessment[],
  expectedCount: number = 5
): number {
  // Implementation for homework compliance scoring
}

export function calculateFinalScore(
  scores: ScoreComponents,
  weights: { observation: number; trend: number; homework: number }
): number {
  return (
    (scores.observation * weights.observation) / 100 +
    (scores.trend * weights.trend) / 100 +
    (scores.homework * weights.homework) / 100
  );
}

export function getPriorityFlag(
  score: number,
  thresholds: { red: number; yellow: number }
): 'red' | 'yellow' | 'green' {
  if (score >= thresholds.red) return 'red';
  if (score >= thresholds.yellow) return 'yellow';
  return 'green';
}
```

3. **Write Unit Tests**
   - File: `tests/services/monitoring-scores.test.ts`

### Deliverables

- [ ] Scoring functions implemented
- [ ] Unit tests passing
- [ ] Edge cases handled

---

## Phase 4: AI Diagnosis Service Extension 🤖

**Estimated Time**: 3-4 hours

### Steps

1. **Extend AI Service**
   - File: `app/lib/services/assessment-ai.ts`

2. **Add Diagnosis Method**

```typescript
// In AssessmentAI class

async analyzeStudentMonitoring(
    context: MonitoringAnalysisContext
): Promise<MonitoringDiagnosis> {
    const prompt = this.createMonitoringPrompt(context);
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse and validate JSON response
    const diagnosis = this.parseMonitoringResponse(text);
    this.validateMonitoringDiagnosis(diagnosis);

    return diagnosis;
}

private createMonitoringPrompt(context: MonitoringAnalysisContext): string {
    // See ARCHITECTURE.md for full prompt template
}
```

### Deliverables

- [ ] AI service extended
- [ ] Prompt template implemented
- [ ] Response parsing and validation
- [ ] Error handling

---

## Phase 5: Monitoring Service Implementation 🔧

**Estimated Time**: 6-8 hours

### Steps

1. **Create Monitoring Service**
   - File: `app/lib/services/student-monitoring-service.ts`

2. **Implement Core Methods**

```typescript
export class StudentMonitoringService {
  constructor(
    private assessmentService: AssessmentService,
    private studentService: StudentService,
    private ai: AssessmentAI,
    private supabase: SupabaseClient
  ) {}

  async analyzeStudent(
    studentId: string,
    classId: string
  ): Promise<StudentMonitoringStatus> {
    // 1. Fetch student and class data
    // 2. Get assessment history for analysis period
    // 3. Calculate scores
    // 4. Generate AI diagnosis
    // 5. Save/update status
    // 6. Save diagnosis
    // 7. Return status
  }

  async analyzeClass(classId: string): Promise<void> {
    // Batch process all students in class
  }

  async getClassMonitoringStatus(
    classId: string
  ): Promise<StudentMonitoringStatus[]> {
    // Fetch current status for all students
  }

  async getStudentDiagnoses(
    studentId: string,
    limit?: number
  ): Promise<MonitoringDiagnosis[]> {
    // Fetch diagnosis history
  }
}
```

3. **Create Configuration Service**
   - File: `app/lib/services/monitoring-config-service.ts`

```typescript
export class MonitoringConfigService {
  async getConfig(): Promise<MonitoringConfig> {
    // Fetch singleton config
  }

  async updateConfig(
    updates: Partial<UpdateMonitoringConfigData>
  ): Promise<MonitoringConfig> {
    // Validate and update config
  }
}
```

### Deliverables

- [ ] Monitoring service implemented
- [ ] Config service implemented
- [ ] Database queries optimized
- [ ] Error handling robust

---

## Phase 6: API Endpoints 🌐

**Estimated Time**: 4-5 hours

### Steps

1. **Analysis Endpoint**
   - File: `app/api/monitoring/analyze/route.ts`

```typescript
export async function POST(request: Request) {
  const { classId, studentId } = await request.json();

  if (studentId) {
    const status = await monitoringService.analyzeStudent(studentId, classId);
    return Response.json({ success: true, status });
  } else {
    await monitoringService.analyzeClass(classId);
    const summary = await getClassSummary(classId);
    return Response.json({ success: true, summary });
  }
}
```

2. **Status Endpoint**
   - File: `app/api/monitoring/status/[classId]/route.ts`

3. **Diagnoses Endpoint**
   - File: `app/api/monitoring/student/[studentId]/diagnoses/route.ts`

4. **Config Endpoints**
   - File: `app/api/monitoring/config/route.ts` (GET, PUT)

5. **Cron Endpoint**
   - File: `app/api/monitoring/cron/route.ts`

### Deliverables

- [ ] All endpoints implemented
- [ ] Request validation
- [ ] Error responses
- [ ] API tests written

---

## Phase 7: Scheduled Jobs Setup ⏰

**Estimated Time**: 2-3 hours

### Steps

1. **Choose Scheduling Method**

   **Option A: Vercel Cron (Production)**

   ```json
   // vercel.json
   {
     "crons": [
       {
         "path": "/api/monitoring/cron",
         "schedule": "0 22 * * *"
       }
     ]
   }
   ```

   **Option B: GitHub Actions (Alternative)**

   ```yaml
   # .github/workflows/monitoring-cron.yml
   name: Student Monitoring Analysis
   on:
     schedule:
       - cron: '0 22 * * *'
   jobs:
     analyze:
       runs-on: ubuntu-latest
       steps:
         - name: Trigger Analysis
           run: |
             curl -X GET ${{ secrets.APP_URL }}/api/monitoring/cron \
               -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
   ```

2. **Environment Variables**

   ```env
   CRON_SECRET=your-secure-random-string
   ```

3. **Manual Trigger UI**
   - Add button in admin interface
   - Call `/api/monitoring/analyze` endpoint

### Deliverables

- [ ] Scheduling configured
- [ ] Cron endpoint secured
- [ ] Manual trigger available
- [ ] Monitoring/logging in place

---

## Phase 8: UI Updates - Class Page 🎨

**Estimated Time**: 4-5 hours

### Steps

1. **Update Class Page Data Fetching**
   - File: `app/(routes)/class/[id]/page.tsx`

```typescript
async function ClassPage({ params }: { params: { id: string } }) {
    const students = await getStudents(params.id);
    const monitoringStatuses = await getMonitoringStatuses(params.id);

    // Merge data
    const studentsWithStatus = students.map(student => ({
        ...student,
        monitoringStatus: monitoringStatuses.find(s => s.studentId === student.id)
    }));

    return <ClassRosterClient students={studentsWithStatus} />;
}
```

2. **Update Client Component**
   - File: `app/(routes)/class/[id]/client.tsx`

```typescript
interface StudentWithMonitoring extends Student {
    monitoringStatus?: {
        priorityFlag: 'red' | 'yellow' | 'green';
        priorityScore: number;
        diagnosisSummary?: string;
    };
}

function StudentAvatar({ student }: { student: StudentWithMonitoring }) {
    const bgColorClass = {
        red: 'bg-red-50 ring-2 ring-red-400',
        yellow: 'bg-yellow-50 ring-2 ring-yellow-400',
        green: 'bg-green-50 ring-2 ring-green-400',
        undefined: ''
    }[student.monitoringStatus?.priorityFlag || 'undefined'];

    return (
        <Link href={`/student/${student.id}`}>
            <div className={`rounded-lg p-2 transition-all ${bgColorClass}`}>
                {/* Existing avatar content */}
            </div>
        </Link>
    );
}
```

3. **Add Sorting and Filtering**

```typescript
function ClassRosterClient({ students }: Props) {
    const [sortBy, setSortBy] = useState<'priority' | 'name'>('priority');
    const [filterFlag, setFilterFlag] = useState<'all' | 'red' | 'yellow' | 'green'>('all');

    const sortedStudents = useMemo(() => {
        let filtered = students;
        if (filterFlag !== 'all') {
            filtered = students.filter(
                s => s.monitoringStatus?.priorityFlag === filterFlag
            );
        }

        if (sortBy === 'priority') {
            return filtered.sort((a, b) =>
                (b.monitoringStatus?.priorityScore || 0) -
                (a.monitoringStatus?.priorityScore || 0)
            );
        }
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }, [students, sortBy, filterFlag]);

    return (
        <div>
            {/* Controls */}
            {/* Student grid */}
        </div>
    );
}
```

### Deliverables

- [ ] Color-coded avatars
- [ ] Sorting functionality
- [ ] Filtering by priority
- [ ] Visual indicators clear

---

## Phase 9: UI Updates - Student Profile 📊

**Estimated Time**: 3-4 hours

### Steps

1. **Create Diagnosis Component**
   - File: `app/components/StudentDiagnosis.tsx`

```typescript
export function StudentDiagnosis({ studentId }: { studentId: string }) {
    const [diagnoses, setDiagnoses] = useState<MonitoringDiagnosis[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/monitoring/student/${studentId}/diagnoses?limit=3`)
            .then(res => res.json())
            .then(data => {
                setDiagnoses(data.diagnoses || []);
                setLoading(false);
            });
    }, [studentId]);

    if (loading) return <LoadingSkeleton />;
    if (!diagnoses.length) return null;

    const latest = diagnoses[0];

    return (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
                Diagnóstico y Recomendaciones
            </h3>

            {/* Diagnosis summary */}
            {/* Patterns section */}
            {/* Interventions section */}
        </div>
    );
}
```

2. **Integrate into Student Profile**
   - File: `app/(routes)/student/[id]/client.tsx`

```typescript
import { StudentDiagnosis } from '@/app/components/StudentDiagnosis';

export default function StudentProfileClient({ student, ... }: Props) {
    return (
        <div>
            {/* Existing profile content */}

            <StudentDiagnosis studentId={student.id} />
        </div>
    );
}
```

### Deliverables

- [ ] Diagnosis component created
- [ ] Integrated into profile
- [ ] Patterns displayed
- [ ] Interventions formatted

---

## Phase 10: Admin Configuration UI ⚙️

**Estimated Time**: 3-4 hours

### Steps

1. **Create Config Page**
   - File: `app/(routes)/admin/monitoring/page.tsx`

2. **Implement Configuration Form**

```typescript
function MonitoringConfigPage() {
    const [config, setConfig] = useState<MonitoringConfig | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (updates: Partial<MonitoringConfig>) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/monitoring/config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            const data = await response.json();
            setConfig(data);
        } finally {
            setIsSaving(false);
        }
    };

    const handleManualAnalysis = async (classId: string) => {
        await fetch('/api/monitoring/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classId })
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Configuration form */}
            {/* Manual trigger section */}
        </div>
    );
}
```

### Deliverables

- [ ] Config page created
- [ ] Form validation
- [ ] Manual trigger button
- [ ] Success/error feedback

---

## Phase 11: Testing 🧪

**Estimated Time**: 4-6 hours

### Steps

1. **Unit Tests**

   ```typescript
   // tests/services/monitoring-scores.test.ts
   // tests/services/student-monitoring-service.test.ts
   ```

2. **Integration Tests**

   ```typescript
   // tests/api/monitoring.spec.ts
   ```

3. **E2E Tests**
   ```typescript
   // tests/e2e/student-monitoring.spec.ts
   ```

### Deliverables

- [ ] Scoring algorithm tests
- [ ] Service tests
- [ ] API endpoint tests
- [ ] UI component tests
- [ ] All tests passing

---

## Phase 12: Documentation & Deployment 📚

**Estimated Time**: 2-3 hours

### Steps

1. **Create User Documentation**
   - File: `features/student-monitoring-system/USER_GUIDE.md`

2. **Update README**
   - Add monitoring system section
   - Document environment variables
   - Explain configuration options

3. **Deployment Checklist**
   - [ ] Environment variables set
   - [ ] Migration applied
   - [ ] Cron configured
   - [ ] Default config verified
   - [ ] Initial analysis run
   - [ ] Monitoring in place

### Deliverables

- [ ] User guide complete
- [ ] README updated
- [ ] Deployment documented
- [ ] System deployed

---

## Testing Strategy

### Manual Testing Checklist

- [ ] Create test class with multiple students
- [ ] Add assessments with varying patterns
- [ ] Run manual analysis
- [ ] Verify scores calculated correctly
- [ ] Check priority flags assigned properly
- [ ] Verify diagnoses generated
- [ ] Test UI displays correctly
- [ ] Test sorting and filtering
- [ ] Verify interventions display
- [ ] Test configuration updates
- [ ] Verify scheduled job runs

### Performance Testing

- [ ] Analyze large class (30+ students)
- [ ] Measure analysis time
- [ ] Check database query performance
- [ ] Verify AI API rate limits respected
- [ ] Test concurrent analysis requests

---

## Troubleshooting

### Common Issues

1. **AI Rate Limits**
   - Solution: Implement exponential backoff
   - Add delay between student analyses

2. **Slow Analysis**
   - Solution: Batch database queries
   - Implement caching for repeated data

3. **Invalid Scores**
   - Solution: Add validation before saving
   - Log calculation details for debugging

4. **Missing Diagnoses**
   - Solution: Check AI prompt format
   - Verify JSON parsing logic

---

## Monitoring & Observability

### What to Monitor

1. **Analysis Success Rate**
2. **Average Analysis Duration**
3. **AI API Costs**
4. **Database Query Performance**
5. **Cron Job Execution**

### Logging Strategy

```typescript
// Log structure
{
    timestamp: ISO8601,
    type: 'analysis_started' | 'analysis_completed' | 'analysis_failed',
    classId: string,
    studentId?: string,
    duration: number,
    scores?: ScoreComponents,
    error?: string
}
```

---

## Next Steps After Implementation

1. **Gather Teacher Feedback**
2. **Tune Scoring Weights**
3. **Adjust Thresholds**
4. **Add Email Notifications**
5. **Create Dashboard for Overview**
6. **Implement Trend Visualization**

---

## Support & Resources

- Architecture: `ARCHITECTURE.md`
- Database Schema: `DATABASE_SCHEMA.md`
- API Documentation: Auto-generated from endpoints
- Issue Tracker: GitHub Issues
