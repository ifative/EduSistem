<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicYearController extends Controller
{
    public function index(Request $request)
    {
        $query = AcademicYear::query()
            ->withCount('semesters')
            ->orderBy('start_date', 'desc');

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $academicYears = $query->paginate(10)->withQueryString();

        return Inertia::render('admin/master/academic-years/index', [
            'academicYears' => $academicYears,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/master/academic-years/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:academic_years',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        // If setting as active, deactivate others
        if ($validated['is_active'] ?? false) {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
        }

        AcademicYear::create($validated);

        return redirect()->route('admin.master.academic-years.index')
            ->with('success', 'Academic year created successfully.');
    }

    public function edit(AcademicYear $academicYear)
    {
        return Inertia::render('admin/master/academic-years/edit', [
            'academicYear' => $academicYear,
        ]);
    }

    public function update(Request $request, AcademicYear $academicYear)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:academic_years,name,' . $academicYear->id,
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        // If setting as active, deactivate others
        if (($validated['is_active'] ?? false) && !$academicYear->is_active) {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
        }

        $academicYear->update($validated);

        return redirect()->route('admin.master.academic-years.index')
            ->with('success', 'Academic year updated successfully.');
    }

    public function destroy(AcademicYear $academicYear)
    {
        if ($academicYear->semesters()->exists()) {
            return back()->with('error', 'Cannot delete academic year with semesters.');
        }

        $academicYear->delete();

        return redirect()->route('admin.master.academic-years.index')
            ->with('success', 'Academic year deleted successfully.');
    }

    public function activate(AcademicYear $academicYear)
    {
        AcademicYear::where('is_active', true)->update(['is_active' => false]);
        $academicYear->update(['is_active' => true]);

        return back()->with('success', 'Academic year activated successfully.');
    }
}
