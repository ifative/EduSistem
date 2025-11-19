<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Settings\GeneralSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index(GeneralSettings $settings)
    {
        return Inertia::render('admin/settings/index', [
            'settings' => [
                'site_name' => $settings->site_name,
                'site_description' => $settings->site_description,
                'timezone' => $settings->timezone,
                'date_format' => $settings->date_format,
                'locale' => $settings->locale,
            ],
        ]);
    }

    public function update(Request $request, GeneralSettings $settings)
    {
        $validated = $request->validate([
            'site_name' => ['required', 'string', 'max:255'],
            'site_description' => ['required', 'string', 'max:500'],
            'timezone' => ['required', 'string', 'timezone'],
            'date_format' => ['required', 'string', 'max:50'],
            'locale' => ['required', 'string', 'max:10'],
        ]);

        $settings->site_name = $validated['site_name'];
        $settings->site_description = $validated['site_description'];
        $settings->timezone = $validated['timezone'];
        $settings->date_format = $validated['date_format'];
        $settings->locale = $validated['locale'];
        $settings->save();

        return redirect()->route('admin.settings.index')
            ->with('success', 'Settings updated successfully.');
    }
}
