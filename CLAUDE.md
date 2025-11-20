# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Documentation Lookup & Best Practices

### Always Query Context7 MCP First
Before implementing any feature or making changes involving frameworks/libraries, **always query Context7 MCP** to get the latest documentation:

1. Use `mcp__context7__resolve-library-id` to find the correct library ID
2. Use `mcp__context7__get-library-docs` to fetch up-to-date documentation

**Libraries to query for this project:**
- Laravel 12 (`/laravel/docs`)
- React 19 (`/facebook/react`)
- Inertia.js (`/inertiajs/inertia`)
- Tailwind CSS (`/tailwindlabs/tailwindcss`)
- shadcn/ui (`/shadcn-ui/ui`)
- Spatie Permission (`/spatie/laravel-permission`)
- Spatie Activitylog (`/spatie/laravel-activitylog`)
- Spatie Medialibrary (`/spatie/laravel-medialibrary`)
- react-i18next (`/i18next/react-i18next`)
- Pest PHP (`/pestphp/pest`)

### Follow Best Practices
Always adhere to the best practices of each framework and library:

**Laravel Best Practices:**
- Use Form Request classes for validation
- Follow repository/service pattern for business logic
- Use Eloquent relationships and eager loading
- Implement proper error handling with try-catch
- Use database transactions for multiple operations
- Follow Laravel naming conventions (snake_case for DB, camelCase for methods)

**React Best Practices:**
- Use functional components with hooks
- Implement proper state management
- Follow component composition patterns
- Use TypeScript for type safety
- Implement proper error boundaries
- Memoize expensive computations with useMemo/useCallback

**Inertia.js Best Practices:**
- Use shared data for common props
- Implement proper form handling with useForm
- Use partial reloads when appropriate
- Handle validation errors properly
- Use preserveState/preserveScroll when needed

**TypeScript Best Practices:**
- Define proper interfaces and types
- Avoid `any` type - use proper typing
- Use generics when appropriate
- Export types from dedicated type files

**Testing Best Practices:**
- Write tests for all CRUD operations
- Test validation rules
- Test authorization/permissions
- Use factories for test data
- Follow AAA pattern (Arrange, Act, Assert)

## Project Overview

EduSistem - Modern School Management System built with Laravel 12 + React 19 + Inertia.js.

### Core Features
- Complete authentication (Laravel Fortify with 2FA)
- Role-based access control (Admin, Teacher, Student, Parent)
- Activity logging (Spatie Activitylog)
- Media management (Spatie Medialibrary)
- Notification system
- API authentication (Laravel Sanctum)
- Internationalization (react-i18next)
- shadcn/ui components with TypeScript strict mode

### Modules
- **Master Data**: Students, teachers, classrooms, subjects, academic years
- **PPDB**: Online student admission with selection algorithms
- **Attendance**: Daily attendance, QR scanning, permits
- **LMS**: Materials, assignments, submissions, grading
- **CBT**: Question banks, exams, auto-grading, anti-cheat
- **Academic**: Grades, report cards, promotions

## Common Commands

### Development
```bash
composer setup          # Full setup: install deps, .env, key, migrate, npm install, build
composer dev            # Run Laravel server + queue + Vite dev concurrently
composer test           # Run Pest tests
```

### Frontend
```bash
npm run dev             # Vite dev server
npm run build           # Production build
npm run lint            # ESLint with auto-fix
npm run format          # Prettier formatting
npm run types           # TypeScript type check
```

### Running Single Test
```bash
php artisan test --filter=TestName
php artisan test tests/Feature/Auth/LoginTest.php
```

## Architecture

### Backend Structure
- **app/Actions/Fortify/** - User actions (registration, password validation)
- **app/Http/Controllers/Settings/** - Profile, Password, 2FA controllers
- **app/Http/Controllers/Admin/** - Admin controllers (Users, Roles, Permissions, ActivityLogs, Settings)
- **app/Http/Controllers/Modules/** - Module controllers (PPDB, Attendance, LMS, CBT, Academic)
- **app/Http/Requests/** - Form validation classes
- **app/Models/** - Core models
- **app/Models/Modules/** - Module models organized by module
- **app/Services/Modules/** - Business logic services
- **routes/web.php** - Main routes
- **routes/admin.php** - Admin routes (protected by permissions)
- **routes/modules/** - Module-specific routes
- **routes/api.php** - API routes (Sanctum)

### Frontend Structure
- **resources/js/pages/** - Inertia pages (auto-routed)
- **resources/js/pages/admin/** - Admin pages (users, roles, permissions, activity-logs, settings)
- **resources/js/pages/teacher/** - Teacher pages
- **resources/js/pages/student/** - Student pages
- **resources/js/pages/modules/** - Module pages organized by module
- **resources/js/components/ui/** - shadcn/ui components
- **resources/js/components/** - Custom components
- **resources/js/layouts/** - App, Auth, Settings layouts
- **resources/js/hooks/** - React hooks
- **resources/js/routes/** - Auto-generated type-safe routes (Wayfinder)
- **resources/js/lib/** - Library configs (i18n)
- **resources/js/locales/** - Translation files (en, id)

### Database Structure
- **database/migrations/core/** - Core tables (users, roles, etc.)
- **database/migrations/master/** - Master data tables
- **database/migrations/ppdb/** - PPDB module tables
- **database/migrations/attendance/** - Attendance module tables
- **database/migrations/lms/** - LMS module tables
- **database/migrations/cbt/** - CBT module tables
- **database/migrations/academic/** - Academic module tables

### Key Integrations
- **Inertia.js** - Server-side routing with React SPA behavior
- **Laravel Wayfinder** - Auto-generates TypeScript route helpers
- **Fortify** - Handles auth, 2FA, email verification, password reset
- **Spatie Permission** - Role and permission management
- **Spatie Activitylog** - Automatic activity logging for models
- **Spatie Medialibrary** - File uploads and media management
- **Maatwebsite Excel** - Import/export Excel files
- **Laravel Sanctum** - API token authentication
- **react-i18next** - Internationalization with English and Indonesian

### Module Configuration
Modules can be enabled/disabled in `config/modules.php`:
```php
return [
    'ppdb' => ['name' => 'Student Admission', 'enabled' => true],
    'attendance' => ['name' => 'Attendance', 'enabled' => true],
    'lms' => ['name' => 'Learning Management', 'enabled' => true],
    'cbt' => ['name' => 'Computer Based Test', 'enabled' => true],
    'academic' => ['name' => 'Academic & Reports', 'enabled' => true],
];
```

### User Roles
- **Admin**: Full system access, module management
- **Teacher**: Classes, materials, exams, grading
- **Student**: Learning, exams, submissions
- **Parent**: View child progress, attendance

### Default Admin Account
- Email: `admin@example.com`
- Password: `password`
- Role: `admin` (has all permissions)

### Shared Props (HandleInertiaRequests middleware)
User data, app name, sidebar state, and appearance theme are automatically passed to all React pages.

## Testing

Pest PHP with SQLite in-memory. Tests located in `tests/Feature/` covering:
- Auth flows (login, register, 2FA, password reset, email verification)
- Settings (profile, password, 2FA management)
- Admin features (user management, role management with permissions)
- Module features (PPDB, Attendance, LMS, CBT, Academic)

## Configuration Notes

- **Database**: SQLite default (configurable to MySQL/PostgreSQL)
- **Sessions/Cache/Queue**: Database driver
- **Auth redirect**: `/dashboard`
- **SSR**: Configured but disabled by default (enable with `composer dev:ssr`)

## Code Style

- TypeScript strict mode enabled
- Prettier: 80 char width, 4-space tabs, semicolons, single quotes
- ESLint: React hooks rules enabled
- Tailwind CSS v4 with oklch() colors for dark mode
- All database columns and variables in English

## Internationalization (i18n)

This project uses **react-i18next** for internationalization with Indonesian as the default language.

### Translation File Structure
```
resources/js/locales/
├── en/
│   ├── common.json     # Shared translations (auth, settings, actions, table, pagination, status, dialog)
│   └── admin.json      # Admin-specific translations (dashboard, users, roles, permissions, master data)
└── id/
    ├── common.json     # Indonesian translations
    └── admin.json      # Indonesian admin translations
```

### Namespaces
- **common**: Shared UI elements (auth, settings, actions, table, pagination, status, dialog, export)
- **admin**: Admin module translations (dashboard, users, roles, permissions, activity_logs, settings, media, students, teachers, classrooms, subjects, academic_years, levels, majors)

### Usage Pattern
```typescript
import { useTranslation } from 'react-i18next';

export default function MyComponent() {
    const { t } = useTranslation(['admin', 'common']);

    // Single namespace
    const title = t('users.title');

    // Cross-namespace
    const cancelBtn = t('common:actions.cancel');

    // With interpolation
    const message = t('dashboard.by_user', { name: userName });

    return <h1>{title}</h1>;
}
```

### Translation Key Conventions
- Use dot notation for nesting: `users.created_success`
- Group by feature/module: `students.`, `teachers.`, `classrooms.`
- Common patterns:
  - `{module}.title` - Page title
  - `{module}.add` / `{module}.edit` / `{module}.create` - Action buttons
  - `{module}.search_placeholder` - Search input placeholder
  - `{module}.empty_title` - Empty state title
  - `{module}.delete_title` / `{module}.delete_description` - Delete dialog
  - `{module}.created_success` / `{module}.updated_success` / `{module}.deleted_success` - Toast messages
  - `{module}.creating` / `{module}.updating` - Loading states

### Breadcrumbs Translation
Breadcrumbs must be defined inside the component to access the `t()` function:
```typescript
export default function MyPage() {
    const { t } = useTranslation('admin');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.users'), href: '/admin/users' },
    ];

    return <AppLayout breadcrumbs={breadcrumbs}>...</AppLayout>;
}
```

### Adding New Translations
1. Add keys to both `en/*.json` and `id/*.json`
2. Follow existing key naming patterns
3. Use interpolation `{{variable}}` for dynamic content
4. Keep translations concise but clear

## Documentation

Full documentation is available in `docs/`:
- [Architecture](./docs/architecture.md)
- [Module Documentation](./docs/modules/)
- [Database Schema](./docs/database/schema.md)
- [Development Roadmap](./docs/development/roadmap.md)

## Naming Conventions

### Database Tables
- Use English names (e.g., `students`, not `siswa`)
- Snake_case for table and column names
- Plural for table names

### Models
- Singular PascalCase (e.g., `Student`, `Teacher`)
- Place in `app/Models/Modules/{Module}/` for module-specific models

### Controllers
- Plural PascalCase with Controller suffix
- Place in `app/Http/Controllers/Modules/{Module}/`

### Permissions
- Format: `module.resource.action`
- Examples: `ppdb.registrations.verify`, `cbt.exams.schedule`
