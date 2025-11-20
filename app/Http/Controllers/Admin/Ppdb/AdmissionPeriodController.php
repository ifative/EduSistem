<?php

namespace App\Http\Controllers\Admin\Ppdb;

use App\Http\Controllers\Controller;
use App\Models\Master\AcademicYear;
use App\Models\Ppdb\AdmissionPeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdmissionPeriodController extends Controller
{
    public function index(Request $request)
    {
        $query = AdmissionPeriod::with('academicYear')
            ->withCount('registrations');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $periods = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/ppdb/periods/index', [
            'periods' => $periods,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        $academicYears = AcademicYear::orderBy('name', 'desc')->get();

        return Inertia::render('admin/ppdb/periods/create', [
            'academicYears' => $academicYears,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'registration_start' => 'required|date',
            'registration_end' => 'required|date|after:registration_start',
            'selection_date' => 'nullable|date|after:registration_end',
            'announcement_date' => 'nullable|date|after_or_equal:selection_date',
            'enrollment_start' => 'nullable|date|after_or_equal:announcement_date',
            'enrollment_end' => 'nullable|date|after:enrollment_start',
            'quota' => 'required|integer|min:0',
            'status' => 'required|in:draft,open,closed,selection,announced,enrollment,completed',
            'is_active' => 'boolean',
        ]);

        AdmissionPeriod::create($validated);

        return redirect()->route('admin.ppdb.periods.index')
            ->with('success', 'Admission period created successfully.');
    }

    public function edit(AdmissionPeriod $period)
    {
        $academicYears = AcademicYear::orderBy('name', 'desc')->get();

        return Inertia::render('admin/ppdb/periods/edit', [
            'period' => $period,
            'academicYears' => $academicYears,
        ]);
    }

    public function update(Request $request, AdmissionPeriod $period)
    {
        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'registration_start' => 'required|date',
            'registration_end' => 'required|date|after:registration_start',
            'selection_date' => 'nullable|date|after:registration_end',
            'announcement_date' => 'nullable|date|after_or_equal:selection_date',
            'enrollment_start' => 'nullable|date|after_or_equal:announcement_date',
            'enrollment_end' => 'nullable|date|after:enrollment_start',
            'quota' => 'required|integer|min:0',
            'status' => 'required|in:draft,open,closed,selection,announced,enrollment,completed',
            'is_active' => 'boolean',
        ]);

        $period->update($validated);

        return redirect()->route('admin.ppdb.periods.index')
            ->with('success', 'Admission period updated successfully.');
    }

    public function destroy(AdmissionPeriod $period)
    {
        $period->delete();

        return redirect()->route('admin.ppdb.periods.index')
            ->with('success', 'Admission period deleted successfully.');
    }

    public function toggleActive(AdmissionPeriod $period)
    {
        // Deactivate all other periods first
        if (!$period->is_active) {
            AdmissionPeriod::where('id', '!=', $period->id)->update(['is_active' => false]);
        }

        $period->update(['is_active' => !$period->is_active]);

        return back()->with('success', 'Period status updated successfully.');
    }
}
