# Academic Module

Grade management and digital report card generation system.

## Overview

Complete academic management supporting:
- Grade entry by teachers
- Competency-based grading
- Report card generation
- Academic analytics
- Promotion decisions

## Database Tables

### Grade Configuration

#### `grade_components`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| academic_year_id | foreign | Academic year |
| subject_id | foreign | Subject |
| name | string | e.g., "Daily Test" |
| type | enum | knowledge/skill/attitude |
| weight | decimal | Percentage weight |

#### `competencies`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| subject_id | foreign | Subject |
| code | string | Competency code |
| description | text | Competency description |
| type | enum | core/basic |

### Student Grades

#### `student_grades`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| student_id | foreign | Student |
| classroom_id | foreign | Classroom |
| subject_id | foreign | Subject |
| semester_id | foreign | Semester |
| component_id | foreign | Grade component |
| score | decimal | Numeric score |
| grade | string | Letter grade |
| notes | text | Teacher notes |
| graded_by | foreign | Teacher |
| graded_at | timestamp | Entry time |

#### `competency_grades`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| student_id | foreign | Student |
| competency_id | foreign | Competency |
| semester_id | foreign | Semester |
| score | decimal | Achievement score |
| description | text | Description |

### Attendance Summary

#### `attendance_summaries`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| student_id | foreign | Student |
| semester_id | foreign | Semester |
| present | integer | Days present |
| sick | integer | Days sick |
| permit | integer | Days with permit |
| absent | integer | Days absent |

### Character Assessment

#### `character_grades`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| student_id | foreign | Student |
| semester_id | foreign | Semester |
| category | string | e.g., "Discipline" |
| predicate | enum | A/B/C/D |
| description | text | Notes |

### Extracurricular Assessment

#### `extracurricular_grades`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| student_id | foreign | Student |
| extracurricular_id | foreign | Activity |
| semester_id | foreign | Semester |
| predicate | enum | A/B/C/D |
| description | text | Notes |

### Report Cards

#### `report_cards`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| student_id | foreign | Student |
| classroom_id | foreign | Classroom |
| semester_id | foreign | Semester |
| status | enum | draft/published |
| ranking | integer | Class rank |
| total_score | decimal | Total points |
| average | decimal | Average score |
| notes | text | Teacher notes |
| generated_at | timestamp | Generation time |
| published_at | timestamp | Publish time |

### Promotion

#### `promotions`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| student_id | foreign | Student |
| academic_year_id | foreign | Year |
| from_classroom_id | foreign | Previous class |
| to_classroom_id | foreign | Next class |
| status | enum | promoted/retained/graduated |
| notes | text | Reason |
| decided_at | timestamp | Decision time |

## Grade Calculation

### Score to Letter Grade
```
A  = 90-100 (Excellent)
B  = 80-89  (Good)
C  = 70-79  (Satisfactory)
D  = 60-69  (Needs Improvement)
E  = <60    (Failing)
```

### Final Grade Formula
```
Knowledge Score = Σ(component_score × weight) for type='knowledge'
Skill Score = Σ(component_score × weight) for type='skill'

Final Score = (Knowledge × 0.5) + (Skill × 0.5)

Or weighted by school policy
```

### Minimum Completion Criteria (KKM)
```
Subject KKM = 70 (default, configurable)
Passed = Final Score >= KKM
```

## Features

### Teacher Features

#### Grade Entry
- Select classroom and subject
- View student list
- Enter grades by component
- Auto-calculate final grades
- Add notes per student
- Save progress
- Submit for review

#### Bulk Entry
- Import grades from Excel
- Template download
- Validation before import
- Error reporting

#### Competency Assessment
- Enter scores per competency
- Generate descriptions
- Preview report format

### Homeroom Teacher Features

#### Report Card Management
- View all subjects for class
- Enter attendance summary
- Enter character grades
- Enter extracurricular grades
- Add general notes
- Generate report cards
- Preview before publish
- Publish report cards

#### Promotion Decisions
- Review student performance
- Recommend promotion status
- Add notes/reasons
- Submit recommendations

### Admin Features

#### Grade Configuration
- Define grade components
- Set component weights
- Configure KKM values
- Set up letter grades

#### Report Card Templates
- Design report card format
- Configure sections
- Add school header/logo
- Preview template

#### Reports
- Grade distribution
- Subject analytics
- Class comparisons
- Year-over-year trends

#### Promotion Management
- Review all recommendations
- Approve/modify decisions
- Generate promotion letters
- Update student status

### Student Features

#### View Grades
- View grades by subject
- View all components
- See teacher notes
- Track progress over time

#### Report Card
- View digital report card
- Download PDF
- View ranking
- View attendance summary

### Parent Features

#### Grade Monitoring
- View child's grades
- Real-time updates
- Compare to KKM
- Receive alerts for low grades

#### Report Card
- View report card when published
- Download PDF
- Digital signature acknowledgment

## Report Card Sections

### 1. Identity
- Student name, NIS, NISN
- Class, academic year, semester
- School name and address

### 2. Academic Grades
| Subject | Knowledge | Skill | Notes |
|---------|-----------|-------|-------|
| Mathematics | 85 (B) | 88 (B) | Good progress |
| Science | 90 (A) | 85 (B) | Excellent |

### 3. Character Assessment
| Aspect | Predicate | Description |
|--------|-----------|-------------|
| Spiritual | A | Excellent religious practice |
| Social | B | Good cooperation |
| Discipline | A | Always on time |

### 4. Extracurricular
| Activity | Predicate | Description |
|----------|-----------|-------------|
| Basketball | A | Team captain |
| English Club | B | Active participant |

### 5. Attendance
- Present: 85 days
- Sick: 3 days
- Permit: 2 days
- Absent: 0 days

### 6. Notes & Signatures
- Homeroom teacher notes
- Principal signature
- Parent acknowledgment

## Notifications

| Event | Recipients | Channel |
|-------|------------|---------|
| Grade entered | Students, Parents | App |
| Low grade alert | Parents | App, Email |
| Report card published | Parents, Students | App, Email |
| Promotion decision | Parents | Email |

## API Endpoints

```
# Grade Components
GET    /api/academic/components
POST   /api/academic/components
PUT    /api/academic/components/{id}
DELETE /api/academic/components/{id}

# Grade Entry
GET    /api/academic/grades/classroom/{id}
POST   /api/academic/grades
PUT    /api/academic/grades/{id}
POST   /api/academic/grades/import
GET    /api/academic/grades/export

# Competencies
GET    /api/academic/competencies
POST   /api/academic/competencies
GET    /api/academic/competency-grades/{studentId}
POST   /api/academic/competency-grades

# Report Cards
GET    /api/academic/report-cards
GET    /api/academic/report-cards/{id}
POST   /api/academic/report-cards/generate
POST   /api/academic/report-cards/{id}/publish
GET    /api/academic/report-cards/{id}/pdf

# Character & Extracurricular
POST   /api/academic/character-grades
POST   /api/academic/extracurricular-grades
GET    /api/academic/attendance-summaries/{studentId}
POST   /api/academic/attendance-summaries

# Student View
GET    /api/academic/my-grades
GET    /api/academic/my-report-card

# Promotions
GET    /api/academic/promotions
POST   /api/academic/promotions
PUT    /api/academic/promotions/{id}
GET    /api/academic/promotions/export

# Reports
GET    /api/academic/reports/grade-distribution
GET    /api/academic/reports/subject-analysis
GET    /api/academic/reports/rankings
```

## Permissions

```
academic.components.view
academic.components.create
academic.components.edit
academic.components.delete

academic.grades.view
academic.grades.create
academic.grades.edit
academic.grades.import

academic.competencies.view
academic.competencies.create
academic.competencies.edit

academic.report-cards.view
academic.report-cards.generate
academic.report-cards.publish
academic.report-cards.print

academic.promotions.view
academic.promotions.create
academic.promotions.approve

academic.reports.view
academic.reports.export
```

## PDF Generation

Report cards are generated as PDF using:
- **Library**: laravel-dompdf or laravel-snappy
- **Template**: Blade view with CSS styling
- **Features**:
  - School letterhead
  - Student photo
  - Grade tables
  - QR code for verification
  - Digital signatures
