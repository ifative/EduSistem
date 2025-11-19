# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Laravel 12 + React 19 boilerplate with Inertia.js, featuring:
- Complete authentication (Laravel Fortify with 2FA)
- Role-based access control (Spatie Permission)
- Activity logging (Spatie Activitylog)
- Media management (Spatie Medialibrary)
- Application settings (Spatie Settings)
- API authentication (Laravel Sanctum)
- Internationalization (react-i18next)
- Full admin UI for users, roles, permissions, activity logs, settings
- shadcn/ui components with TypeScript strict mode

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
- **app/Http/Requests/** - Form validation classes
- **app/Settings/** - Settings classes (GeneralSettings)
- **routes/web.php** - Main routes
- **routes/settings.php** - Settings routes
- **routes/admin.php** - Admin routes (protected by permissions)
- **routes/api.php** - API routes (Sanctum)

### Frontend Structure
- **resources/js/pages/** - Inertia pages (auto-routed)
- **resources/js/pages/admin/** - Admin pages (users, roles, permissions, activity-logs, settings)
- **resources/js/components/ui/** - shadcn/ui components
- **resources/js/components/** - Custom components (language-switcher)
- **resources/js/layouts/** - App, Auth, Settings layouts
- **resources/js/hooks/** - React hooks (appearance, 2FA)
- **resources/js/routes/** - Auto-generated type-safe routes (Wayfinder)
- **resources/js/lib/** - Library configs (i18n)
- **resources/js/locales/** - Translation files (en, id)

### Key Integrations
- **Inertia.js** - Server-side routing with React SPA behavior
- **Laravel Wayfinder** - Auto-generates TypeScript route helpers in `resources/js/routes/`
- **Fortify** - Handles auth, 2FA, email verification, password reset
- **Spatie Permission** - Role and permission management
- **Spatie Activitylog** - Automatic activity logging for models
- **Spatie Medialibrary** - File uploads and media management
- **Spatie Settings** - Strongly-typed application settings
- **Laravel Sanctum** - API token authentication
- **react-i18next** - Internationalization with English and Indonesian translations

### Admin Features
- **User Management** - CRUD with role assignment
- **Role Management** - CRUD with permission assignment
- **Permission Management** - Create and delete permissions
- **Activity Logs** - View all model activity with search/pagination
- **Settings** - Manage site name, description, timezone, date format, locale

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
