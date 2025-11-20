<?php

namespace App\Http\Controllers\Admin\Ppdb;

use App\Exports\Ppdb\RegistrationsExport;
use App\Http\Controllers\Controller;
use App\Models\Ppdb\AdmissionPath;
use App\Models\Ppdb\AdmissionPeriod;
use App\Models\Ppdb\Registration;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class RegistrationController extends Controller
{
    public function index(Request $request)
    {
        $query = Registration::with(['period', 'path', 'level', 'major']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('registration_number', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('period_id')) {
            $query->where('admission_period_id', $request->period_id);
        }

        if ($request->filled('path_id')) {
            $query->where('admission_path_id', $request->path_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $registrations = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $periods = AdmissionPeriod::orderBy('name', 'desc')->get();
        $paths = AdmissionPath::orderBy('name')->get();

        return Inertia::render('admin/ppdb/registrations/index', [
            'registrations' => $registrations,
            'periods' => $periods,
            'paths' => $paths,
            'filters' => $request->only(['search', 'period_id', 'path_id', 'status']),
        ]);
    }

    public function show(Registration $registration)
    {
        $registration->load([
            'period',
            'path',
            'level',
            'major',
            'documents.requirement',
            'scores',
            'achievements',
            'selection',
            'payments',
            'verifier',
        ]);

        return Inertia::render('admin/ppdb/registrations/show', [
            'registration' => $registration,
        ]);
    }

    public function verify(Request $request, Registration $registration)
    {
        $validated = $request->validate([
            'status' => 'required|in:verified,revision,rejected',
            'notes' => 'nullable|string',
        ]);

        $registration->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'],
            'verified_at' => now(),
            'verified_by' => auth()->id(),
        ]);

        return back()->with('success', 'Registration status updated successfully.');
    }

    public function updateStatus(Request $request, Registration $registration)
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,submitted,verified,revision,accepted,rejected,enrolled,withdrawn',
            'notes' => 'nullable|string',
        ]);

        $registration->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'],
        ]);

        return back()->with('success', 'Registration status updated successfully.');
    }

    public function export(Request $request)
    {
        $filters = $request->only(['search', 'period_id', 'path_id', 'status']);
        $filename = 'ppdb-registrations-' . now()->format('Y-m-d-His') . '.xlsx';

        return Excel::download(new RegistrationsExport($filters), $filename);
    }

    public function statistics(Request $request)
    {
        $periodId = $request->period_id;

        $query = Registration::query();

        if ($periodId) {
            $query->where('admission_period_id', $periodId);
        }

        // Build by_status as array of objects
        $statuses = ['draft', 'submitted', 'verified', 'revision', 'accepted', 'rejected', 'enrolled', 'withdrawn'];
        $byStatus = [];
        foreach ($statuses as $status) {
            $count = (clone $query)->where('status', $status)->count();
            if ($count > 0) {
                $byStatus[] = ['status' => $status, 'count' => $count];
            }
        }

        // Build by_gender as array of objects
        $byGender = [];
        $maleCount = (clone $query)->where('gender', 'male')->count();
        $femaleCount = (clone $query)->where('gender', 'female')->count();
        if ($maleCount > 0) {
            $byGender[] = ['gender' => 'male', 'count' => $maleCount];
        }
        if ($femaleCount > 0) {
            $byGender[] = ['gender' => 'female', 'count' => $femaleCount];
        }

        $stats = [
            'total' => $query->count(),
            'by_status' => $byStatus,
            'by_gender' => $byGender,
            'by_path' => [],
        ];

        if ($periodId) {
            $stats['by_path'] = AdmissionPath::where('admission_period_id', $periodId)
                ->withCount('registrations')
                ->get()
                ->map(fn ($path) => [
                    'path_id' => $path->id,
                    'path_name' => $path->name,
                    'count' => $path->registrations_count,
                ])
                ->toArray();
        }

        $periods = AdmissionPeriod::orderBy('name', 'desc')->get();

        return Inertia::render('admin/ppdb/registrations/statistics', [
            'statistics' => $stats,
            'periods' => $periods,
            'selected_period_id' => $periodId,
        ]);
    }
}
