<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.site_name', 'Laravel Boilerplate');
        $this->migrator->add('general.site_description', 'A modern Laravel application');
        $this->migrator->add('general.timezone', 'UTC');
        $this->migrator->add('general.date_format', 'Y-m-d');
        $this->migrator->add('general.locale', 'en');
    }
};
