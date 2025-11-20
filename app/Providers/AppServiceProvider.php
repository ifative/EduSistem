<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Load migrations from subdirectories
        $this->loadMigrationsFrom([
            database_path('migrations'),
            database_path('migrations/master'),
            database_path('migrations/ppdb'),
        ]);
    }
}
