<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $activities = Activity::with('causer')
            ->when($request->search, fn ($query, $search) => $query->where('description', 'like', "%{$search}%"))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/activity-logs/index', [
            'activities' => $activities,
            'filters' => $request->only('search'),
        ]);
    }
}
