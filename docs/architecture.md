# System Architecture

## Modular Design

EduSistem uses a modular architecture where each feature is an independent module that can be enabled or disabled.

```
EduSistem
├── Core (Required)
│   ├── Authentication & Authorization
│   ├── User Management
│   ├── Settings & Configuration
│   └── Notifications
│
├── Module: Master Data (Required)
│   ├── Students
│   ├── Teachers
│   ├── Classrooms
│   ├── Subjects
│   └── Academic Years
│
├── Module: PPDB ← Optional
├── Module: Attendance ← Optional
├── Module: LMS ← Optional
├── Module: CBT ← Optional
└── Module: Academic ← Optional
```

## Module Configuration

```php
// config/modules.php
return [
    'ppdb' => [
        'name' => 'Student Admission (PPDB)',
        'description' => 'Online registration and selection',
        'enabled' => true,
        'routes' => 'routes/modules/ppdb.php',
        'migrations' => 'database/migrations/ppdb',
    ],
    'attendance' => [
        'name' => 'Attendance',
        'enabled' => true,
    ],
    'lms' => [
        'name' => 'Learning Management System',
        'enabled' => true,
    ],
    'cbt' => [
        'name' => 'Computer Based Test',
        'enabled' => true,
    ],
    'academic' => [
        'name' => 'Academic & Report Cards',
        'enabled' => true,
    ],
];
```

## Directory Structure

```
app/
├── Http/
│   └── Controllers/
│       ├── Admin/           # Admin controllers
│       ├── Teacher/         # Teacher controllers
│       ├── Student/         # Student controllers
│       └── Modules/
│           ├── PPDB/
│           ├── Attendance/
│           ├── LMS/
│           ├── CBT/
│           └── Academic/
├── Models/
│   ├── User.php
│   ├── Student.php
│   ├── Teacher.php
│   └── Modules/
│       ├── PPDB/
│       ├── Attendance/
│       ├── LMS/
│       ├── CBT/
│       └── Academic/
└── Services/
    └── Modules/

database/migrations/
├── core/
├── master/
├── ppdb/
├── attendance/
├── lms/
├── cbt/
└── academic/

resources/js/pages/
├── admin/
├── teacher/
├── student/
├── parent/
└── modules/
    ├── ppdb/
    ├── attendance/
    ├── lms/
    ├── cbt/
    └── academic/

routes/
├── web.php
├── admin.php
└── modules/
    ├── ppdb.php
    ├── attendance.php
    ├── lms.php
    ├── cbt.php
    └── academic.php
```

## User Roles

| Role | Access |
|------|--------|
| Admin | Full system access, module management |
| Teacher | Classes, materials, exams, grading |
| Student | Learning, exams, submissions |
| Parent | View child progress, attendance |

## Permission Structure

Permissions are grouped by module:

```php
// PPDB Module
'ppdb.periods.view'
'ppdb.periods.create'
'ppdb.registrations.verify'
'ppdb.selection.run'

// Attendance Module
'attendance.view'
'attendance.create'
'attendance.permits.approve'

// LMS Module
'lms.materials.create'
'lms.assignments.grade'

// CBT Module
'cbt.banks.create'
'cbt.exams.schedule'
'cbt.exams.grade'

// Academic Module
'academic.grades.entry'
'academic.reports.generate'
```

## Database Strategy

- Each module has separate migration files
- Foreign keys connect modules to core tables
- Soft deletes for data preservation
- Activity logging on all models

## API Design

All modules follow RESTful conventions:

```
GET    /api/{module}           # List
POST   /api/{module}           # Create
GET    /api/{module}/{id}      # Show
PUT    /api/{module}/{id}      # Update
DELETE /api/{module}/{id}      # Delete
```

## Frontend Architecture

- **Inertia.js** for server-side routing with React SPA
- **TypeScript** for type safety
- **shadcn/ui** for consistent UI components
- **TanStack Table** for data tables
- **React Hook Form** for form handling

## Real-time Features

- WebSocket support for:
  - Exam timer synchronization
  - Live notifications
  - Attendance updates
