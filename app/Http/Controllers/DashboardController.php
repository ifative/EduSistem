<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_users' => User::count(),
            'total_roles' => Role::count(),
            'total_permissions' => Permission::count(),
            'recent_users' => User::where('created_at', '>=', now()->subDays(7))->count(),
        ];

        $recentActivities = Activity::with('causer')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'description' => $activity->description,
                    'subject_type' => $activity->subject_type ? class_basename($activity->subject_type) : null,
                    'subject_id' => $activity->subject_id,
                    'causer_name' => $activity->causer?->name ?? 'System',
                    'created_at' => $activity->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
        ]);
    }
}
