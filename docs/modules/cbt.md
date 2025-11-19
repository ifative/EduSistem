# CBT Module (Computer Based Test)

Online examination system with question banks, auto-grading, and anti-cheat features.

## Overview

Complete computer-based testing system supporting:
- Question bank management
- 5 question types
- Exam scheduling
- Auto and manual grading
- Anti-cheat measures
- Detailed analytics

## Database Tables

### Question Banks

#### `question_banks`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | Bank name |
| subject_id | foreign | Subject |
| teacher_id | foreign | Creator |
| description | text | Description |
| is_shared | boolean | Shared with others |
| created_at | timestamp | Created time |

#### `questions`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| bank_id | foreign | Question bank |
| type | enum | multiple_choice/complex_choice/matching/short_answer/essay |
| content | text | Question text (HTML) |
| explanation | text | Answer explanation |
| difficulty | enum | easy/medium/hard |
| points | integer | Point value |
| created_at | timestamp | Created time |

#### `question_options`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| question_id | foreign | Question |
| label | string | Option label (A, B, C...) |
| content | text | Option text |
| is_correct | boolean | Correct answer |
| order | integer | Display order |

#### `question_matchings`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| question_id | foreign | Question |
| premise | text | Left side item |
| response | text | Right side match |
| order | integer | Display order |

### Exams

#### `exams`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | Exam name |
| subject_id | foreign | Subject |
| teacher_id | foreign | Creator |
| exam_type | enum | daily/midterm/final/practice |
| description | text | Instructions |
| duration_minutes | integer | Time limit |
| passing_score | integer | Minimum pass |
| show_result | boolean | Show score after |
| show_answers | boolean | Show correct answers |
| shuffle_questions | boolean | Randomize order |
| shuffle_options | boolean | Randomize options |
| created_at | timestamp | Created time |

#### `exam_questions`
| Column | Type | Description |
|--------|------|-------------|
| exam_id | foreign | Exam |
| question_id | foreign | Question |
| order | integer | Display order |
| points | integer | Override points |

### Scheduling

#### `exam_schedules`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| exam_id | foreign | Exam |
| classroom_id | foreign | Target classroom |
| start_time | datetime | Exam opens |
| end_time | datetime | Exam closes |
| token | string | Access token |
| is_active | boolean | Currently active |

### Sessions

#### `exam_sessions`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| schedule_id | foreign | Schedule |
| student_id | foreign | Student |
| status | enum | not_started/in_progress/submitted/graded |
| started_at | timestamp | Start time |
| submitted_at | timestamp | Submit time |
| time_remaining | integer | Seconds left |
| ip_address | string | Student IP |
| user_agent | string | Browser info |
| total_score | decimal | Final score |
| is_passed | boolean | Passed exam |

#### `exam_answers`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| session_id | foreign | Session |
| question_id | foreign | Question |
| answer | text | Student answer |
| is_correct | boolean | Auto-graded result |
| score | decimal | Points earned |
| graded_by | foreign | Manual grader |
| feedback | text | Grader feedback |

### Logs

#### `exam_logs`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| session_id | foreign | Session |
| event | string | Event type |
| data | json | Event data |
| created_at | timestamp | Event time |

## Question Types

### 1. Multiple Choice
Single correct answer from options.
```json
{
  "type": "multiple_choice",
  "content": "What is the capital of Indonesia?",
  "options": [
    {"label": "A", "content": "Jakarta", "is_correct": true},
    {"label": "B", "content": "Surabaya", "is_correct": false},
    {"label": "C", "content": "Bandung", "is_correct": false},
    {"label": "D", "content": "Medan", "is_correct": false}
  ]
}
```

### 2. Complex Choice
Multiple correct answers (checkbox).
```json
{
  "type": "complex_choice",
  "content": "Select all prime numbers:",
  "options": [
    {"label": "A", "content": "2", "is_correct": true},
    {"label": "B", "content": "3", "is_correct": true},
    {"label": "C", "content": "4", "is_correct": false},
    {"label": "D", "content": "5", "is_correct": true}
  ]
}
```

### 3. Matching
Connect premises with responses.
```json
{
  "type": "matching",
  "content": "Match the country with its capital:",
  "matchings": [
    {"premise": "Indonesia", "response": "Jakarta"},
    {"premise": "Malaysia", "response": "Kuala Lumpur"},
    {"premise": "Thailand", "response": "Bangkok"}
  ]
}
```

### 4. Short Answer
Text input with keyword matching.
```json
{
  "type": "short_answer",
  "content": "What is H2O commonly known as?",
  "answer": "water"
}
```

### 5. Essay
Long-form text requiring manual grading.
```json
{
  "type": "essay",
  "content": "Explain the process of photosynthesis.",
  "points": 10
}
```

## Features

### Teacher Features

#### Question Bank Management
- Create question banks per subject
- Add questions with rich text editor
- Insert images, tables, equations
- Set difficulty and points
- Import questions from Excel/Word
- Share banks with other teachers
- Copy questions between banks

#### Exam Creation
- Select questions from banks
- Set question order or shuffle
- Configure time limit
- Set passing score
- Preview exam as student

#### Scheduling
- Schedule exam for classrooms
- Generate access tokens
- Set exam window (start/end time)
- Monitor active sessions
- Reset student session if needed

#### Grading
- Auto-graded: MC, Complex MC, Matching, Short Answer
- Manual grading for essays
- View student responses
- Provide feedback
- Adjust scores
- Export grades

#### Analytics
- Question difficulty analysis
- Discrimination index
- Average scores by question
- Time analysis
- Student performance trends

### Student Features

#### Taking Exams
- Enter access token
- View exam info and rules
- Navigate questions
- Flag questions for review
- Auto-save answers
- View remaining time
- Submit exam

#### Interface
- One question per page or all at once
- Question navigation sidebar
- Answered/unanswered indicators
- Timer display
- Confirmation before submit

#### Results
- View score (if enabled)
- View correct answers (if enabled)
- Review attempt history

### Admin Features

#### Exam Monitoring
- View active sessions
- Monitor suspicious activity
- Force submit session
- Reset student session
- View exam logs

#### Reports
- Exam statistics
- Student rankings
- Question analysis
- Comparative reports

## Anti-Cheat Measures

### Active Protection
- **Tab switching detection**: Logs when student leaves exam window
- **Copy/paste disabled**: Prevents text copying
- **Right-click disabled**: Blocks context menu
- **Full-screen mode**: Locks browser to exam
- **Token-based access**: Unique per schedule
- **IP logging**: Records student IP
- **Single session**: Only one active session per student

### Monitoring
- Live session tracking
- Event logging (blur, focus, paste attempts)
- Time anomaly detection
- Answer pattern analysis

## Grading Algorithm

### Auto-Grading

```
Multiple Choice:
  Correct = full points
  Incorrect = 0 points

Complex Choice:
  Score = (correct_selected / total_correct) - (wrong_selected / total_wrong)
  Score = max(0, Score) × points

Matching:
  Score = (correct_matches / total_matches) × points

Short Answer:
  Exact match or keyword present = full points
  Otherwise = 0 points (or manual review)

Essay:
  Manual grading required
```

### Final Score Calculation
```
Total Score = Σ(question_score)
Percentage = (Total Score / Max Score) × 100
Passed = Percentage >= passing_score
```

## Notifications

| Event | Recipients | Channel |
|-------|------------|---------|
| Exam scheduled | Students | App, Email |
| Exam starts soon | Students | App |
| Exam graded | Students, Parents | App, Email |
| Suspicious activity | Teacher | App |

## API Endpoints

```
# Question Banks
GET    /api/cbt/banks
POST   /api/cbt/banks
GET    /api/cbt/banks/{id}
PUT    /api/cbt/banks/{id}
DELETE /api/cbt/banks/{id}

# Questions
GET    /api/cbt/banks/{id}/questions
POST   /api/cbt/banks/{id}/questions
PUT    /api/cbt/questions/{id}
DELETE /api/cbt/questions/{id}
POST   /api/cbt/questions/import

# Exams
GET    /api/cbt/exams
POST   /api/cbt/exams
GET    /api/cbt/exams/{id}
PUT    /api/cbt/exams/{id}
DELETE /api/cbt/exams/{id}
POST   /api/cbt/exams/{id}/questions

# Schedules
GET    /api/cbt/schedules
POST   /api/cbt/schedules
PUT    /api/cbt/schedules/{id}
DELETE /api/cbt/schedules/{id}
POST   /api/cbt/schedules/{id}/generate-token

# Student Exam
POST   /api/cbt/exams/verify-token
GET    /api/cbt/sessions/{id}
POST   /api/cbt/sessions/{id}/start
PUT    /api/cbt/sessions/{id}/answer
POST   /api/cbt/sessions/{id}/submit
GET    /api/cbt/sessions/{id}/result

# Grading
GET    /api/cbt/schedules/{id}/sessions
GET    /api/cbt/sessions/{id}/answers
PUT    /api/cbt/answers/{id}/grade

# Reports
GET    /api/cbt/reports/exam/{id}
GET    /api/cbt/reports/questions/{examId}
GET    /api/cbt/reports/export
```

## Permissions

```
cbt.banks.view
cbt.banks.create
cbt.banks.edit
cbt.banks.delete

cbt.questions.view
cbt.questions.create
cbt.questions.edit
cbt.questions.delete
cbt.questions.import

cbt.exams.view
cbt.exams.create
cbt.exams.edit
cbt.exams.delete

cbt.schedules.view
cbt.schedules.create
cbt.schedules.edit
cbt.schedules.delete

cbt.sessions.view
cbt.sessions.monitor
cbt.sessions.reset

cbt.grade.view
cbt.grade.edit

cbt.reports.view
cbt.reports.export
```
