# LMS Module (Learning Management System)

Digital learning platform for materials, assignments, and student submissions.

## Overview

Complete learning management supporting:
- Teacher material uploads
- Student assignment submissions
- Grading and feedback
- Learning progress tracking

## Database Tables

### Materials

#### `materials`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| classroom_id | foreign | Target classroom |
| subject_id | foreign | Subject |
| teacher_id | foreign | Creator |
| title | string | Material title |
| description | text | Material description |
| type | enum | document/video/link/quiz |
| is_published | boolean | Visibility status |
| published_at | timestamp | When published |
| created_at | timestamp | Created time |

#### `material_files`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| material_id | foreign | Material |
| file_path | string | File location |
| file_name | string | Original filename |
| file_type | string | MIME type |
| file_size | integer | Size in bytes |

#### `material_views`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| material_id | foreign | Material |
| student_id | foreign | Student |
| viewed_at | timestamp | First view |
| last_viewed_at | timestamp | Last view |
| duration_seconds | integer | Time spent |

### Assignments

#### `assignments`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| classroom_id | foreign | Target classroom |
| subject_id | foreign | Subject |
| teacher_id | foreign | Creator |
| title | string | Assignment title |
| description | text | Instructions |
| type | enum | file/text/quiz |
| max_score | integer | Maximum points |
| due_date | datetime | Submission deadline |
| allow_late | boolean | Accept late submissions |
| late_penalty | integer | Penalty % per day |
| is_published | boolean | Visibility |
| published_at | timestamp | When published |

#### `assignment_files`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| assignment_id | foreign | Assignment |
| file_path | string | File location |
| file_name | string | Original filename |
| file_type | string | MIME type |

### Submissions

#### `submissions`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| assignment_id | foreign | Assignment |
| student_id | foreign | Student |
| status | enum | draft/submitted/graded/returned |
| submitted_at | timestamp | Submission time |
| is_late | boolean | Past deadline |
| content | text | Text submission |
| score | decimal | Grade received |
| feedback | text | Teacher feedback |
| graded_by | foreign | Grading teacher |
| graded_at | timestamp | When graded |

#### `submission_files`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| submission_id | foreign | Submission |
| file_path | string | File location |
| file_name | string | Original filename |
| file_type | string | MIME type |
| file_size | integer | Size in bytes |
| uploaded_at | timestamp | Upload time |

#### `submission_revisions`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| submission_id | foreign | Submission |
| content | text | Previous content |
| files | json | Previous files |
| created_at | timestamp | Revision time |

### Discussions

#### `discussions`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| classroom_id | foreign | Classroom |
| subject_id | foreign | Subject |
| user_id | foreign | Creator |
| title | string | Topic title |
| content | text | Topic content |
| is_pinned | boolean | Pinned to top |
| created_at | timestamp | Created time |

#### `discussion_replies`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| discussion_id | foreign | Topic |
| user_id | foreign | Reply author |
| parent_id | foreign | Reply to (nullable) |
| content | text | Reply content |
| created_at | timestamp | Posted time |

## Features

### Teacher Features

#### Material Management
- Create materials with rich text editor
- Upload multiple files per material
  - Documents: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX
  - Videos: MP4, AVI, MOV
  - Images: JPG, PNG, GIF
- Embed external links (YouTube, etc.)
- Set visibility (draft/published)
- Target specific classrooms
- View student engagement analytics

#### Assignment Management
- Create assignments with detailed instructions
- Attach reference files
- Set due dates with timezone support
- Configure late submission policy
- Multiple submission types:
  - **File upload**: Students upload documents
  - **Text entry**: Online text submission
  - **Quiz**: Linked to CBT module
- View submission status overview

#### Grading
- View all submissions per assignment
- Download student files
- Grade with rubric or direct score
- Provide written feedback
- Return for revision
- Bulk download submissions
- Export grades to Excel

### Student Features

#### Learning
- View available materials by class/subject
- Download material files
- Track viewed materials
- Mark as complete

#### Assignment Submission
- View assignment details and due date
- Submit text or upload files
- Multiple file uploads supported
- Save draft before submitting
- Resubmit if returned for revision
- View submission history
- View grade and feedback

#### Discussions
- Create discussion topics
- Reply to topics
- Reply to specific comments
- View class discussions

### Parent Features

#### Monitoring
- View child's assignments
- Check submission status
- View grades and feedback
- Track learning progress

## Notifications

| Event | Recipients | Channel |
|-------|------------|---------|
| New material posted | Students | App, Email |
| New assignment | Students, Parents | App, Email |
| Assignment due soon | Students | App |
| Assignment overdue | Students, Parents | App, Email |
| Submission graded | Students, Parents | App, Email |
| Returned for revision | Students | App, Email |

## API Endpoints

```
# Materials (Teacher)
GET    /api/lms/materials
POST   /api/lms/materials
GET    /api/lms/materials/{id}
PUT    /api/lms/materials/{id}
DELETE /api/lms/materials/{id}
POST   /api/lms/materials/{id}/files
DELETE /api/lms/materials/{id}/files/{fileId}
POST   /api/lms/materials/{id}/publish

# Materials (Student)
GET    /api/lms/my-materials
GET    /api/lms/materials/{id}/view
POST   /api/lms/materials/{id}/complete

# Assignments (Teacher)
GET    /api/lms/assignments
POST   /api/lms/assignments
GET    /api/lms/assignments/{id}
PUT    /api/lms/assignments/{id}
DELETE /api/lms/assignments/{id}
GET    /api/lms/assignments/{id}/submissions
POST   /api/lms/submissions/{id}/grade
POST   /api/lms/submissions/{id}/return

# Assignments (Student)
GET    /api/lms/my-assignments
GET    /api/lms/assignments/{id}
POST   /api/lms/assignments/{id}/submit
PUT    /api/lms/submissions/{id}
POST   /api/lms/submissions/{id}/files
DELETE /api/lms/submissions/{id}/files/{fileId}

# Discussions
GET    /api/lms/discussions
POST   /api/lms/discussions
GET    /api/lms/discussions/{id}
POST   /api/lms/discussions/{id}/replies
DELETE /api/lms/discussions/{id}
DELETE /api/lms/discussion-replies/{id}

# Reports
GET    /api/lms/reports/student-progress
GET    /api/lms/reports/assignment-summary
GET    /api/lms/reports/export
```

## Permissions

```
lms.materials.view
lms.materials.create
lms.materials.edit
lms.materials.delete

lms.assignments.view
lms.assignments.create
lms.assignments.edit
lms.assignments.delete
lms.assignments.grade

lms.discussions.view
lms.discussions.create
lms.discussions.moderate

lms.reports.view
lms.reports.export
```

## File Storage

### Configuration
- Max file size: 50MB per file
- Max total per submission: 200MB
- Allowed types configured per assignment
- Files stored in private storage
- Temporary signed URLs for access

### File Structure
```
storage/app/
├── materials/
│   └── {material_id}/
│       └── {file_name}
└── submissions/
    └── {submission_id}/
        └── {file_name}
```
