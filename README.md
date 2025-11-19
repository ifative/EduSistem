# EduSistem

Modern School Management System built with Laravel 12 and React 19. A comprehensive solution for Indonesian schools featuring student admission (PPDB), attendance, learning management (LMS), computer-based testing (CBT), and academic reporting.

## Features

### Core Features (Included)
- Complete authentication system (Login, Register, 2FA)
- Role-based access control (Admin, Teacher, Student, Parent)
- Activity logging and audit trail
- Notification system
- Media management
- Data export to Excel

### Module: Master Data
- Academic years and semesters
- Students with full profile and import/export
- Teachers management
- Classrooms with enrollment
- Subjects and extracurriculars

### Module: PPDB (Student Admission)
- Online registration with multi-step form
- Multiple admission paths (Zonasi, Achievement, Affirmation)
- Document upload and verification
- Automated selection algorithms
- Payment tracking

### Module: Attendance
- Daily attendance by teacher
- QR code scanning
- Leave/permit management
- Attendance reports

### Module: LMS (Learning Management)
- Teacher material upload
- Assignment creation
- Student submission with file upload
- Grading and feedback
- Discussion forums

### Module: CBT (Computer Based Test)
- Question bank management
- 5 question types (MC, Complex MC, Matching, Short Answer, Essay)
- Exam scheduling with tokens
- Auto-grading
- Anti-cheat protection

### Module: Academic
- Grade entry by component
- Report card generation
- PDF export
- Promotion management

## Tech Stack

### Backend
- **Laravel 12** - PHP Framework
- **Laravel Fortify** - Authentication backend
- **Laravel Sanctum** - API authentication
- **Spatie Permission** - Role & permission management
- **Spatie Activitylog** - Activity logging
- **Spatie MediaLibrary** - File uploads & media management
- **Spatie Settings** - Application settings
- **Maatwebsite Excel** - Excel exports

### Frontend
- **React 19** - UI library
- **Inertia.js** - SPA without API
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS
- **shadcn/ui** - UI component library
- **TanStack Table** - Data table
- **Lucide React** - Icons
- **react-i18next** - Internationalization

## Requirements

- PHP >= 8.2
- Composer
- Node.js >= 20
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ifative/EduSistem.git
   cd EduSistem
   ```

2. **Run the setup command**
   ```bash
   composer setup
   ```
   This will:
   - Install PHP dependencies
   - Copy `.env.example` to `.env`
   - Generate application key
   - Run database migrations
   - Seed the database
   - Install NPM dependencies
   - Build frontend assets

3. **Start the development server**
   ```bash
   composer dev
   ```
   This runs Laravel server, queue worker, and Vite dev server concurrently.

4. **Access the application**
   - URL: `http://localhost:8000`
   - Admin Email: `admin@example.com`
   - Password: `password`

## Development Commands

### Backend
```bash
composer dev          # Run all development servers
composer test         # Run Pest tests
php artisan migrate   # Run migrations
php artisan db:seed   # Seed database
```

### Frontend
```bash
npm run dev           # Vite dev server
npm run build         # Production build
npm run lint          # ESLint with auto-fix
npm run format        # Prettier formatting
npm run types         # TypeScript type check
```

### Running Tests
```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/Auth/LoginTest.php

# Run tests with filter
php artisan test --filter=DashboardTest
```

## Project Structure

```
├── app/
│   ├── Exports/              # Excel export classes
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/        # Admin controllers
│   │   │   └── Settings/     # User settings controllers
│   │   └── Middleware/
│   ├── Models/
│   ├── Notifications/        # Notification classes
│   └── Settings/             # Settings classes
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   └── js/
│       ├── components/       # React components
│       │   └── ui/          # shadcn/ui components
│       ├── hooks/           # Custom React hooks
│       ├── layouts/         # Layout components
│       ├── lib/             # Utility libraries
│       ├── locales/         # i18n translations
│       ├── pages/           # Inertia pages
│       │   ├── admin/       # Admin pages
│       │   ├── auth/        # Auth pages
│       │   └── settings/    # Settings pages
│       ├── routes/          # Auto-generated routes
│       └── types/           # TypeScript types
├── routes/
│   ├── admin.php            # Admin routes
│   ├── settings.php         # Settings routes
│   └── web.php              # Web routes
└── tests/
    └── Feature/             # Feature tests
```

## Default Permissions

Permissions are organized by module:

| Module | Permissions |
|--------|-------------|
| Users | `users.view`, `users.create`, `users.edit`, `users.delete` |
| Roles | `roles.view`, `roles.create`, `roles.edit`, `roles.delete` |
| Master Data | `master.students.view`, `master.students.create`, etc. |
| PPDB | `ppdb.periods.view`, `ppdb.registrations.verify`, etc. |
| Attendance | `attendance.view`, `attendance.create`, `attendance.permits.approve` |
| LMS | `lms.materials.create`, `lms.assignments.grade`, etc. |
| CBT | `cbt.banks.create`, `cbt.exams.schedule`, `cbt.grade.edit` |
| Academic | `academic.grades.entry`, `academic.reports.generate`, etc. |

See [docs/modules](./docs) for complete permission lists per module.

## Configuration

### Database
By default, the boilerplate uses SQLite. To use MySQL or PostgreSQL, update your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Mail
Configure mail settings in `.env` for email verification and password reset:

```env
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_FROM_ADDRESS=noreply@example.com
```

### Storage
For file uploads, ensure the storage link is created:

```bash
php artisan storage:link
```

## Documentation

Comprehensive documentation is available in the `docs/` folder:

- [Architecture](./docs/architecture.md) - System design and module structure
- [Master Data](./docs/modules/master-data.md) - Students, teachers, classrooms
- [PPDB](./docs/modules/ppdb.md) - Student admission system
- [Attendance](./docs/modules/attendance.md) - Attendance tracking
- [LMS](./docs/modules/lms.md) - Learning management
- [CBT](./docs/modules/cbt.md) - Computer-based testing
- [Academic](./docs/modules/academic.md) - Grades and report cards
- [Database Schema](./docs/database/schema.md) - Complete table structures
- [Roadmap](./docs/development/roadmap.md) - Development phases

## Adding New Features

### Creating a New Module

1. Create migrations in `database/migrations/{module}/`
2. Create models in `app/Models/Modules/{Module}/`
3. Create controllers in `app/Http/Controllers/Modules/{Module}/`
4. Add routes in `routes/modules/{module}.php`
5. Create React pages in `resources/js/pages/modules/{module}/`
6. Add to module config in `config/modules.php`
7. Create permissions in seeder

### Adding New Permissions

1. Add to `database/seeders/RolesAndPermissionsSeeder.php`
2. Run `php artisan db:seed --class=RolesAndPermissionsSeeder`
3. Assign to roles as needed

## Testing

The boilerplate includes comprehensive tests for all features:

- Authentication tests
- Dashboard tests
- Export tests
- Notification tests
- Media manager tests
- Avatar upload tests
- User/Role management tests

Run the test suite:

```bash
php artisan test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-sourced software licensed under the [MIT license](LICENSE).

## Credits

- [Laravel](https://laravel.com)
- [React](https://react.dev)
- [Inertia.js](https://inertiajs.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Spatie](https://spatie.be/open-source)
- [Maatwebsite](https://laravel-excel.com)
