# Database Schema

Complete database structure for EduSistem.

## Overview

Total: 40+ tables organized by module.

## Core Tables

### Users & Authentication

```sql
users
├── id (bigint, PK)
├── name (string)
├── email (string, unique)
├── email_verified_at (timestamp, nullable)
├── password (string)
├── two_factor_secret (text, nullable)
├── two_factor_recovery_codes (text, nullable)
├── remember_token (string, nullable)
└── timestamps

roles
├── id (bigint, PK)
├── name (string)
├── guard_name (string)
└── timestamps

permissions
├── id (bigint, PK)
├── name (string)
├── guard_name (string)
└── timestamps

model_has_roles
├── role_id (foreign)
├── model_type (string)
└── model_id (bigint)

role_has_permissions
├── role_id (foreign)
└── permission_id (foreign)
```

### Activity & Notifications

```sql
activity_log
├── id (bigint, PK)
├── log_name (string, nullable)
├── description (text)
├── subject_type (string, nullable)
├── subject_id (bigint, nullable)
├── causer_type (string, nullable)
├── causer_id (bigint, nullable)
├── properties (json, nullable)
├── event (string, nullable)
├── batch_uuid (uuid, nullable)
└── timestamps

notifications
├── id (uuid, PK)
├── type (string)
├── notifiable_type (string)
├── notifiable_id (bigint)
├── data (text)
├── read_at (timestamp, nullable)
└── timestamps
```

## Master Data Tables

```sql
academic_years
├── id (bigint, PK)
├── name (string)
├── start_date (date)
├── end_date (date)
├── is_active (boolean)
└── timestamps

semesters
├── id (bigint, PK)
├── academic_year_id (foreign)
├── name (string)
├── is_active (boolean)
└── timestamps

levels
├── id (bigint, PK)
├── name (string)
├── code (string)
└── timestamps

majors
├── id (bigint, PK)
├── name (string)
├── code (string)
└── timestamps

subjects
├── id (bigint, PK)
├── name (string)
├── code (string)
├── group (enum: A/B/C/Elective/Local)
├── credits (integer)
└── timestamps

students
├── id (bigint, PK)
├── user_id (foreign, nullable)
├── nis (string)
├── nisn (string, 10)
├── name (string)
├── gender (enum: male/female)
├── birth_place (string)
├── birth_date (date)
├── religion (string)
├── phone (string, nullable)
├── address (text)
├── photo (string, nullable)
├── parent_name (string)
├── parent_phone (string)
├── parent_email (string, nullable)
├── entry_year (year)
├── previous_school (string, nullable)
├── status (enum: active/graduated/transferred/dropped)
└── timestamps

teachers
├── id (bigint, PK)
├── user_id (foreign, nullable)
├── nip (string, nullable)
├── nuptk (string, nullable)
├── name (string)
├── gender (enum: male/female)
├── email (string)
├── phone (string)
├── address (text)
├── photo (string, nullable)
├── position (string, nullable)
├── status (enum: active/inactive)
└── timestamps

classrooms
├── id (bigint, PK)
├── name (string)
├── code (string)
├── level_id (foreign)
├── major_id (foreign, nullable)
├── capacity (integer)
├── homeroom_teacher_id (foreign, nullable)
└── timestamps

classroom_students
├── classroom_id (foreign)
├── student_id (foreign)
├── academic_year_id (foreign)
└── semester_id (foreign)

classroom_subjects
├── classroom_id (foreign)
├── subject_id (foreign)
└── teacher_id (foreign)

extracurriculars
├── id (bigint, PK)
├── name (string)
├── description (text, nullable)
├── instructor_id (foreign, nullable)
└── timestamps
```

## PPDB Tables

```sql
admission_periods
├── id (bigint, PK)
├── academic_year_id (foreign)
├── name (string)
├── start_date (datetime)
├── end_date (datetime)
├── quota (integer)
├── registration_fee (decimal)
├── is_active (boolean)
└── timestamps

admission_paths
├── id (bigint, PK)
├── period_id (foreign)
├── name (string)
├── type (enum: zonasi/achievement/affirmation)
├── quota (integer)
├── description (text, nullable)
└── timestamps

admission_requirements
├── id (bigint, PK)
├── period_id (foreign)
├── name (string)
├── is_required (boolean)
├── file_type (string)
└── timestamps

registrations
├── id (bigint, PK)
├── period_id (foreign)
├── path_id (foreign)
├── registration_number (string, unique)
├── name (string)
├── nisn (string)
├── gender (enum: male/female)
├── birth_place (string)
├── birth_date (date)
├── previous_school (string)
├── address (text)
├── distance_km (decimal)
├── parent_name (string)
├── parent_phone (string)
├── parent_email (string, nullable)
├── status (enum: pending/verified/accepted/rejected/enrolled)
└── timestamps

registration_documents
├── id (bigint, PK)
├── registration_id (foreign)
├── requirement_id (foreign)
├── file_path (string)
├── status (enum: pending/approved/rejected)
├── notes (text, nullable)
└── timestamps

registration_scores
├── id (bigint, PK)
├── registration_id (foreign)
├── subject (string)
├── score (decimal)
└── timestamps

registration_achievements
├── id (bigint, PK)
├── registration_id (foreign)
├── name (string)
├── level (enum: school/district/province/national/international)
├── year (year)
├── certificate (string, nullable)
└── timestamps

admission_selections
├── id (bigint, PK)
├── period_id (foreign)
├── path_id (foreign)
├── selected_at (timestamp)
├── announced_at (timestamp, nullable)
└── timestamps

admission_payments
├── id (bigint, PK)
├── registration_id (foreign)
├── amount (decimal)
├── method (string)
├── status (enum: pending/paid/failed)
├── paid_at (timestamp, nullable)
├── reference (string, nullable)
└── timestamps
```

## Attendance Tables

```sql
attendances
├── id (bigint, PK)
├── classroom_id (foreign)
├── student_id (foreign)
├── date (date)
├── status (enum: present/sick/permit/absent)
├── check_in_time (time, nullable)
├── check_out_time (time, nullable)
├── method (enum: manual/qr/face)
├── notes (text, nullable)
├── recorded_by (foreign)
└── timestamps

attendance_permits
├── id (bigint, PK)
├── student_id (foreign)
├── type (enum: sick/permission/dispensation)
├── start_date (date)
├── end_date (date)
├── reason (text)
├── attachment (string, nullable)
├── status (enum: pending/approved/rejected)
├── approved_by (foreign, nullable)
├── approved_at (timestamp, nullable)
├── notes (text, nullable)
└── timestamps

attendance_settings
├── id (bigint, PK)
├── academic_year_id (foreign)
├── check_in_start (time)
├── check_in_end (time)
├── check_out_start (time)
├── minimum_attendance (integer)
├── qr_enabled (boolean)
├── face_enabled (boolean)
└── timestamps
```

## LMS Tables

```sql
materials
├── id (bigint, PK)
├── classroom_id (foreign)
├── subject_id (foreign)
├── teacher_id (foreign)
├── title (string)
├── description (text, nullable)
├── type (enum: document/video/link/quiz)
├── is_published (boolean)
├── published_at (timestamp, nullable)
└── timestamps

material_files
├── id (bigint, PK)
├── material_id (foreign)
├── file_path (string)
├── file_name (string)
├── file_type (string)
├── file_size (integer)
└── timestamps

material_views
├── id (bigint, PK)
├── material_id (foreign)
├── student_id (foreign)
├── viewed_at (timestamp)
├── last_viewed_at (timestamp)
├── duration_seconds (integer)
└── timestamps

assignments
├── id (bigint, PK)
├── classroom_id (foreign)
├── subject_id (foreign)
├── teacher_id (foreign)
├── title (string)
├── description (text)
├── type (enum: file/text/quiz)
├── max_score (integer)
├── due_date (datetime)
├── allow_late (boolean)
├── late_penalty (integer)
├── is_published (boolean)
├── published_at (timestamp, nullable)
└── timestamps

assignment_files
├── id (bigint, PK)
├── assignment_id (foreign)
├── file_path (string)
├── file_name (string)
├── file_type (string)
└── timestamps

submissions
├── id (bigint, PK)
├── assignment_id (foreign)
├── student_id (foreign)
├── status (enum: draft/submitted/graded/returned)
├── submitted_at (timestamp, nullable)
├── is_late (boolean)
├── content (text, nullable)
├── score (decimal, nullable)
├── feedback (text, nullable)
├── graded_by (foreign, nullable)
├── graded_at (timestamp, nullable)
└── timestamps

submission_files
├── id (bigint, PK)
├── submission_id (foreign)
├── file_path (string)
├── file_name (string)
├── file_type (string)
├── file_size (integer)
├── uploaded_at (timestamp)
└── timestamps

discussions
├── id (bigint, PK)
├── classroom_id (foreign)
├── subject_id (foreign)
├── user_id (foreign)
├── title (string)
├── content (text)
├── is_pinned (boolean)
└── timestamps

discussion_replies
├── id (bigint, PK)
├── discussion_id (foreign)
├── user_id (foreign)
├── parent_id (foreign, nullable)
├── content (text)
└── timestamps
```

## CBT Tables

```sql
question_banks
├── id (bigint, PK)
├── name (string)
├── subject_id (foreign)
├── teacher_id (foreign)
├── description (text, nullable)
├── is_shared (boolean)
└── timestamps

questions
├── id (bigint, PK)
├── bank_id (foreign)
├── type (enum: multiple_choice/complex_choice/matching/short_answer/essay)
├── content (text)
├── explanation (text, nullable)
├── difficulty (enum: easy/medium/hard)
├── points (integer)
└── timestamps

question_options
├── id (bigint, PK)
├── question_id (foreign)
├── label (string)
├── content (text)
├── is_correct (boolean)
├── order (integer)
└── timestamps

question_matchings
├── id (bigint, PK)
├── question_id (foreign)
├── premise (text)
├── response (text)
├── order (integer)
└── timestamps

exams
├── id (bigint, PK)
├── name (string)
├── subject_id (foreign)
├── teacher_id (foreign)
├── exam_type (enum: daily/midterm/final/practice)
├── description (text, nullable)
├── duration_minutes (integer)
├── passing_score (integer)
├── show_result (boolean)
├── show_answers (boolean)
├── shuffle_questions (boolean)
├── shuffle_options (boolean)
└── timestamps

exam_questions
├── exam_id (foreign)
├── question_id (foreign)
├── order (integer)
└── points (integer, nullable)

exam_schedules
├── id (bigint, PK)
├── exam_id (foreign)
├── classroom_id (foreign)
├── start_time (datetime)
├── end_time (datetime)
├── token (string)
├── is_active (boolean)
└── timestamps

exam_sessions
├── id (bigint, PK)
├── schedule_id (foreign)
├── student_id (foreign)
├── status (enum: not_started/in_progress/submitted/graded)
├── started_at (timestamp, nullable)
├── submitted_at (timestamp, nullable)
├── time_remaining (integer, nullable)
├── ip_address (string, nullable)
├── user_agent (string, nullable)
├── total_score (decimal, nullable)
├── is_passed (boolean, nullable)
└── timestamps

exam_answers
├── id (bigint, PK)
├── session_id (foreign)
├── question_id (foreign)
├── answer (text, nullable)
├── is_correct (boolean, nullable)
├── score (decimal, nullable)
├── graded_by (foreign, nullable)
├── feedback (text, nullable)
└── timestamps

exam_logs
├── id (bigint, PK)
├── session_id (foreign)
├── event (string)
├── data (json, nullable)
└── created_at (timestamp)
```

## Academic Tables

```sql
grade_components
├── id (bigint, PK)
├── academic_year_id (foreign)
├── subject_id (foreign)
├── name (string)
├── type (enum: knowledge/skill/attitude)
├── weight (decimal)
└── timestamps

competencies
├── id (bigint, PK)
├── subject_id (foreign)
├── code (string)
├── description (text)
├── type (enum: core/basic)
└── timestamps

student_grades
├── id (bigint, PK)
├── student_id (foreign)
├── classroom_id (foreign)
├── subject_id (foreign)
├── semester_id (foreign)
├── component_id (foreign)
├── score (decimal)
├── grade (string)
├── notes (text, nullable)
├── graded_by (foreign)
├── graded_at (timestamp)
└── timestamps

competency_grades
├── id (bigint, PK)
├── student_id (foreign)
├── competency_id (foreign)
├── semester_id (foreign)
├── score (decimal)
├── description (text, nullable)
└── timestamps

attendance_summaries
├── id (bigint, PK)
├── student_id (foreign)
├── semester_id (foreign)
├── present (integer)
├── sick (integer)
├── permit (integer)
├── absent (integer)
└── timestamps

character_grades
├── id (bigint, PK)
├── student_id (foreign)
├── semester_id (foreign)
├── category (string)
├── predicate (enum: A/B/C/D)
├── description (text, nullable)
└── timestamps

extracurricular_grades
├── id (bigint, PK)
├── student_id (foreign)
├── extracurricular_id (foreign)
├── semester_id (foreign)
├── predicate (enum: A/B/C/D)
├── description (text, nullable)
└── timestamps

report_cards
├── id (bigint, PK)
├── student_id (foreign)
├── classroom_id (foreign)
├── semester_id (foreign)
├── status (enum: draft/published)
├── ranking (integer, nullable)
├── total_score (decimal, nullable)
├── average (decimal, nullable)
├── notes (text, nullable)
├── generated_at (timestamp)
├── published_at (timestamp, nullable)
└── timestamps

promotions
├── id (bigint, PK)
├── student_id (foreign)
├── academic_year_id (foreign)
├── from_classroom_id (foreign)
├── to_classroom_id (foreign, nullable)
├── status (enum: promoted/retained/graduated)
├── notes (text, nullable)
├── decided_at (timestamp)
└── timestamps
```

## Indexes

Key indexes for performance:

```sql
-- Students
CREATE INDEX idx_students_nis ON students(nis);
CREATE INDEX idx_students_nisn ON students(nisn);
CREATE INDEX idx_students_status ON students(status);

-- Attendance
CREATE INDEX idx_attendances_date ON attendances(date);
CREATE INDEX idx_attendances_student_date ON attendances(student_id, date);
CREATE INDEX idx_attendances_classroom_date ON attendances(classroom_id, date);

-- Exams
CREATE INDEX idx_exam_sessions_student ON exam_sessions(student_id);
CREATE INDEX idx_exam_sessions_status ON exam_sessions(status);

-- Grades
CREATE INDEX idx_student_grades_semester ON student_grades(semester_id);
CREATE INDEX idx_student_grades_subject ON student_grades(subject_id);
```

## Relationships Diagram

```
users
  └── has many → students (user_id)
  └── has many → teachers (user_id)

academic_years
  └── has many → semesters
  └── has many → admission_periods

classrooms
  └── belongs to → levels
  └── belongs to → majors
  └── belongs to → teachers (homeroom)
  └── has many → classroom_students
  └── has many → classroom_subjects

students
  └── has many → attendances
  └── has many → submissions
  └── has many → exam_sessions
  └── has many → student_grades
  └── has many → report_cards

teachers
  └── has many → materials
  └── has many → assignments
  └── has many → exams
  └── has many → question_banks
```
