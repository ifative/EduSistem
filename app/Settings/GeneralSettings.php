<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class GeneralSettings extends Settings
{
    public string $site_name;
    public string $site_description;
    public string $timezone;
    public string $date_format;
    public string $locale;

    public static function group(): string
    {
        return 'general';
    }
}
