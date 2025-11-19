# Master Data Module

Core data management for schools including students, teachers, classrooms, and academic structure.

## Database Tables

### Academic Structure

#### `academic_years`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | e.g., "2024/2025" |
| start_date | date | Year start |
| end_date | date | Year end |
| is_active | boolean | Current active year |

#### `semesters`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| academic_year_id | foreign | Academic year |
| name | string | "Odd" / "Even" |
| is_active | boolean | Current semester |

#### `levels`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | e.g., "Grade 10" |
| code | string | e.g., "X" |

#### `majors`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | e.g., "Science" |
| code | string | e.g., "IPA" |

#### `subjects`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | Subject name |
| code | string | Subject code |
| group | enum | A/B/C/Elective/Local |
| credits | integer | Credit hours |

### People

#### `students`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| user_id | foreign | User account |
| nis | string | School ID |
| nisn | string(10) | National ID |
| name | string | Full name |
| gender | enum | male/female |
| birth_place | string | Birth place |
| birth_date | date | Birth date |
| religion | string | Religion |
| phone | string | Phone number |
| address | text | Full address |
| photo | string | Photo path |
| parent_name | string | Parent/guardian name |
| parent_phone | string | Parent phone |
| parent_email | string | Parent email |
| entry_year | year | Entry year |
| previous_school | string | Previous school |
| status | enum | active/graduated/transferred/dropped |

#### `teachers`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| user_id | foreign | User account |
| nip | string | Government ID |
| nuptk | string | Teacher ID |
| name | string | Full name |
| gender | enum | male/female |
| email | string | Email |
| phone | string | Phone |
| address | text | Address |
| photo | string | Photo path |
| position | string | Position/title |
| status | enum | active/inactive |

### Classes

#### `classrooms`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | e.g., "X IPA 1" |
| code | string | Class code |
| level_id | foreign | Grade level |
| major_id | foreign | Major (nullable) |
| capacity | integer | Max students |
| homeroom_teacher_id | foreign | Wali kelas |

#### `classroom_students`
| Column | Type | Description |
|--------|------|-------------|
| classroom_id | foreign | Classroom |
| student_id | foreign | Student |
| academic_year_id | foreign | Academic year |
| semester_id | foreign | Semester |

#### `classroom_subjects`
| Column | Type | Description |
|--------|------|-------------|
| classroom_id | foreign | Classroom |
| subject_id | foreign | Subject |
| teacher_id | foreign | Subject teacher |

### Extracurricular

#### `extracurriculars`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | string | Activity name |
| description | text | Description |
| instructor_id | foreign | Teacher/instructor |

## Features

### Academic Years & Semesters
- CRUD operations
- Set active year/semester
- Copy structure to new year

### Students
- Full CRUD with validation
- Import from Excel (bulk)
- Export to Excel
- Photo upload
- Search & filter
- Status management

### Teachers
- Full CRUD
- Import from Excel
- Subject assignment
- Class assignment (homeroom)

### Classrooms
- Create with level & major
- Assign homeroom teacher
- Enroll students
- Assign subject teachers
- Copy to new semester

### Subjects
- CRUD with grouping
- Credit hour management
- Assign to classrooms

## API Endpoints

```
# Academic Years
GET    /api/academic-years
POST   /api/academic-years
PUT    /api/academic-years/{id}
DELETE /api/academic-years/{id}
POST   /api/academic-years/{id}/activate

# Students
GET    /api/students
POST   /api/students
GET    /api/students/{id}
PUT    /api/students/{id}
DELETE /api/students/{id}
POST   /api/students/import
GET    /api/students/export

# Teachers
GET    /api/teachers
POST   /api/teachers
GET    /api/teachers/{id}
PUT    /api/teachers/{id}
DELETE /api/teachers/{id}
POST   /api/teachers/import

# Classrooms
GET    /api/classrooms
POST   /api/classrooms
GET    /api/classrooms/{id}
PUT    /api/classrooms/{id}
DELETE /api/classrooms/{id}
POST   /api/classrooms/{id}/students
POST   /api/classrooms/{id}/subjects

# Subjects
GET    /api/subjects
POST   /api/subjects
PUT    /api/subjects/{id}
DELETE /api/subjects/{id}
```

## Permissions

```
master.academic-years.view
master.academic-years.create
master.academic-years.edit
master.academic-years.delete

master.students.view
master.students.create
master.students.edit
master.students.delete
master.students.import

master.teachers.view
master.teachers.create
master.teachers.edit
master.teachers.delete

master.classrooms.view
master.classrooms.create
master.classrooms.edit
master.classrooms.delete

master.subjects.view
master.subjects.create
master.subjects.edit
master.subjects.delete
```
