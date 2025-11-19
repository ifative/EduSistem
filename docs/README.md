# EduSistem Documentation

Comprehensive documentation for EduSistem - Modern School Management System.

## Table of Contents

### Overview
- [System Architecture](./architecture.md) - Modular design & tech stack

### Modules
- [Master Data](./modules/master-data.md) - Students, teachers, classrooms, subjects
- [PPDB (Student Admission)](./modules/ppdb.md) - Online registration & selection
- [Attendance](./modules/attendance.md) - Daily attendance & permits
- [LMS](./modules/lms.md) - Learning materials & assignments
- [CBT (Computer Based Test)](./modules/cbt.md) - Online exams & grading
- [Academic](./modules/academic.md) - Grades & report cards

### Technical
- [Database Schema](./database/schema.md) - Complete table structures
- [Development Roadmap](./development/roadmap.md) - Implementation phases

## Quick Links

- [Main README](../README.md)
- [CLAUDE.md](../CLAUDE.md) - AI coding guidelines
- [GitHub Repository](https://github.com/ifative/EduSistem)

## Tech Stack

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Bridge**: Inertia.js
- **UI Components**: shadcn/ui
- **Database**: MySQL/PostgreSQL/SQLite

## Key Features

| Module | Description |
|--------|-------------|
| Master Data | Core school data management |
| PPDB | Online student admission with auto-selection |
| Attendance | Multi-method attendance tracking |
| LMS | Learning materials & assignment submission |
| CBT | Computer-based testing with anti-cheat |
| Academic | Grading & digital report cards |

## Getting Started

```bash
# Clone repository
git clone https://github.com/ifative/EduSistem.git

# Install & setup
composer setup

# Run development server
composer dev
```

Default admin login:
- Email: `admin@example.com`
- Password: `password`
