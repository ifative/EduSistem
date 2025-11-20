<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\Extracurricular;
use App\Models\Master\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExtracurricularController extends Controller
{
    public function index(Request $request)
    {
        $query = Extracurricular::with('instructor');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $extracurriculars = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('admin/master/extracurriculars/index', [
            'extracurriculars' => $extracurriculars,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        $teachers = Teacher::where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('admin/master/extracurriculars/create', [
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:extracurriculars',
            'description' => 'nullable|string',
            'instructor_id' => 'nullable|exists:teachers,id',
        ]);

        Extracurricular::create($validated);

        return redirect()->route('admin.master.extracurriculars.index')
            ->with('success', 'Extracurricular created successfully.');
    }

    public function edit(Extracurricular $extracurricular)
    {
        $teachers = Teacher::where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('admin/master/extracurriculars/edit', [
            'extracurricular' => $extracurricular,
            'teachers' => $teachers,
        ]);
    }

    public function update(Request $request, Extracurricular $extracurricular)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:extracurriculars,name,' . $extracurricular->id,
            'description' => 'nullable|string',
            'instructor_id' => 'nullable|exists:teachers,id',
        ]);

        $extracurricular->update($validated);

        return redirect()->route('admin.master.extracurriculars.index')
            ->with('success', 'Extracurricular updated successfully.');
    }

    public function destroy(Extracurricular $extracurricular)
    {
        $extracurricular->delete();

        return redirect()->route('admin.master.extracurriculars.index')
            ->with('success', 'Extracurricular deleted successfully.');
    }
}
