<?php

namespace App\Http\Controllers\Admin\Ppdb;

use App\Http\Controllers\Controller;
use App\Models\Ppdb\AdmissionPath;
use App\Models\Ppdb\AdmissionPeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdmissionPathController extends Controller
{
    public function index(Request $request)
    {
        $query = AdmissionPath::with('period')
            ->withCount('registrations');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('period_id')) {
            $query->where('admission_period_id', $request->period_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $paths = $query->orderBy('sort_order')
            ->paginate(10)
            ->withQueryString();

        $periods = AdmissionPeriod::orderBy('name', 'desc')->get();

        return Inertia::render('admin/ppdb/paths/index', [
            'paths' => $paths,
            'periods' => $periods,
            'filters' => $request->only(['search', 'period_id', 'type']),
        ]);
    }

    public function create()
    {
        $periods = AdmissionPeriod::orderBy('name', 'desc')->get();

        return Inertia::render('admin/ppdb/paths/create', [
            'periods' => $periods,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'admission_period_id' => 'required|exists:admission_periods,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:admission_paths,code',
            'description' => 'nullable|string',
            'type' => 'required|in:zonasi,prestasi,afirmasi,perpindahan,reguler',
            'quota' => 'required|integer|min:0',
            'min_score' => 'nullable|numeric|min:0|max:100',
            'max_distance' => 'nullable|numeric|min:0',
            'requires_test' => 'boolean',
            'requires_documents' => 'boolean',
            'selection_criteria' => 'nullable|array',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        AdmissionPath::create($validated);

        return redirect()->route('admin.ppdb.paths.index')
            ->with('success', 'Admission path created successfully.');
    }

    public function edit(AdmissionPath $path)
    {
        $periods = AdmissionPeriod::orderBy('name', 'desc')->get();
        $path->load('requirements');

        return Inertia::render('admin/ppdb/paths/edit', [
            'path' => $path,
            'periods' => $periods,
        ]);
    }

    public function update(Request $request, AdmissionPath $path)
    {
        $validated = $request->validate([
            'admission_period_id' => 'required|exists:admission_periods,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:admission_paths,code,' . $path->id,
            'description' => 'nullable|string',
            'type' => 'required|in:zonasi,prestasi,afirmasi,perpindahan,reguler',
            'quota' => 'required|integer|min:0',
            'min_score' => 'nullable|numeric|min:0|max:100',
            'max_distance' => 'nullable|numeric|min:0',
            'requires_test' => 'boolean',
            'requires_documents' => 'boolean',
            'selection_criteria' => 'nullable|array',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $path->update($validated);

        return redirect()->route('admin.ppdb.paths.index')
            ->with('success', 'Admission path updated successfully.');
    }

    public function destroy(AdmissionPath $path)
    {
        $path->delete();

        return redirect()->route('admin.ppdb.paths.index')
            ->with('success', 'Admission path deleted successfully.');
    }
}
