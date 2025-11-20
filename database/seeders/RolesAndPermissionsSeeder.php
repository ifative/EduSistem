<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // User management
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',

            // Role management
            'roles.view',
            'roles.create',
            'roles.edit',
            'roles.delete',

            // Permission management
            'permissions.view',
            'permissions.create',
            'permissions.edit',
            'permissions.delete',

            // Activity logs
            'activity-logs.view',

            // Settings
            'settings.view',
            'settings.edit',

            // Master Data - Academic Years
            'master.academic-years.view',
            'master.academic-years.create',
            'master.academic-years.edit',
            'master.academic-years.delete',

            // Master Data - Levels
            'master.levels.view',
            'master.levels.create',
            'master.levels.edit',
            'master.levels.delete',

            // Master Data - Majors
            'master.majors.view',
            'master.majors.create',
            'master.majors.edit',
            'master.majors.delete',

            // Master Data - Subjects
            'master.subjects.view',
            'master.subjects.create',
            'master.subjects.edit',
            'master.subjects.delete',

            // Master Data - Students
            'master.students.view',
            'master.students.create',
            'master.students.edit',
            'master.students.delete',
            'master.students.import',

            // Master Data - Teachers
            'master.teachers.view',
            'master.teachers.create',
            'master.teachers.edit',
            'master.teachers.delete',

            // Master Data - Classrooms
            'master.classrooms.view',
            'master.classrooms.create',
            'master.classrooms.edit',
            'master.classrooms.delete',

            // Master Data - Extracurriculars
            'master.extracurriculars.view',
            'master.extracurriculars.create',
            'master.extracurriculars.edit',
            'master.extracurriculars.delete',

            // PPDB - Periods
            'ppdb.periods.view',
            'ppdb.periods.create',
            'ppdb.periods.edit',
            'ppdb.periods.delete',

            // PPDB - Paths
            'ppdb.paths.view',
            'ppdb.paths.create',
            'ppdb.paths.edit',
            'ppdb.paths.delete',

            // PPDB - Registrations
            'ppdb.registrations.view',
            'ppdb.registrations.edit',
            'ppdb.registrations.verify',
            'ppdb.registrations.export',

            // PPDB - Documents
            'ppdb.documents.view',
            'ppdb.documents.verify',

            // PPDB - Selections
            'ppdb.selections.view',
            'ppdb.selections.edit',
            'ppdb.selections.run',
            'ppdb.selections.announce',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        $userRole = Role::firstOrCreate(['name' => 'user']);
        // Users have no admin permissions by default
    }
}
