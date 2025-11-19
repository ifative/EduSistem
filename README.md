# Laravel React Admin Boilerplate

A modern, full-featured admin boilerplate built with Laravel 12 and React 19. Features complete authentication, role-based access control, activity logging, and a beautiful admin UI powered by shadcn/ui components.

## Features

### Authentication & Security
- Complete authentication system (Login, Register, Forgot Password)
- Two-Factor Authentication (2FA) with QR code
- Email verification
- Password confirmation for sensitive actions
- API authentication with Laravel Sanctum

### User Management
- Full CRUD operations for users
- User avatar upload with Spatie MediaLibrary
- Role assignment per user
- Paginated user listing with search
- Export users to Excel

### Role & Permission Management
- Role-based access control (RBAC) with Spatie Permission
- Visual permission matrix for role management
- Module-based permission organization
- Permission indicators in role listing
- Export roles to Excel

### Dashboard
- Statistics widgets (Users, Roles, Permissions, Growth)
- Recent activity feed
- Quick action shortcuts

### Activity Logging
- Automatic activity logging with Spatie Activitylog
- Searchable activity logs
- Filter by event type
- Export activity logs to Excel

### Notification System
- Database notifications
- Real-time notification dropdown with polling
- Mark as read / Mark all as read
- Click-to-navigate functionality

### Media Manager
- Grid view with thumbnails
- File type filtering (Images, Documents, Videos)
- Search functionality
- Image preview modal
- Download and delete actions

### Additional Features
- Dark/Light mode theme switching
- Responsive sidebar navigation
- Breadcrumb navigation
- Internationalization (i18n) support
- Toast notifications
- Confirmation dialogs

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
   git clone https://github.com/ifative/laravel-boilerplate.git
   cd laravel-boilerplate
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

The boilerplate includes the following default permissions organized by module:

| Module | Permissions |
|--------|-------------|
| Users | `users.view`, `users.create`, `users.edit`, `users.delete` |
| Roles | `roles.view`, `roles.create`, `roles.edit`, `roles.delete` |
| Permissions | `permissions.view`, `permissions.create`, `permissions.delete` |
| Activity Logs | `activity-logs.view` |
| Settings | `settings.view`, `settings.edit` |

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

## Adding New Features

### Creating a New Admin Module

1. Create the model and migration
2. Create the controller in `app/Http/Controllers/Admin/`
3. Add routes in `routes/admin.php` with permissions
4. Create React pages in `resources/js/pages/admin/`
5. Add navigation item in `resources/js/components/app-sidebar.tsx`
6. Create permissions in seeder

### Adding New Permissions

1. Add to `database/seeders/RoleAndPermissionSeeder.php`
2. Run `php artisan db:seed --class=RoleAndPermissionSeeder`
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
