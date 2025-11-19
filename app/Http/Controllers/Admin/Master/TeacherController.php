<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $query = Teacher::query()
            ->withCount('homeroomClassrooms');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('nip', 'like', "%{$search}%")
                    ->orWhere('nuptk', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $teachers = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('admin/master/teachers/index', [
            'teachers' => $teachers,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/master/teachers/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nip' => 'nullable|string|max:50|unique:teachers',
            'nuptk' => 'nullable|string|max:50|unique:teachers',
            'name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'position' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        $teacher = Teacher::create($validated);

        if ($request->hasFile('photo')) {
            $teacher->addMediaFromRequest('photo')->toMediaCollection('photo');
        }

        return redirect()->route('admin.master.teachers.index')
            ->with('success', 'Teacher created successfully.');
    }

    public function show(Teacher $teacher)
    {
        $teacher->load(['homeroomClassrooms.level', 'extracurriculars', 'user']);

        return Inertia::render('admin/master/teachers/show', [
            'teacher' => $teacher,
        ]);
    }

    public function edit(Teacher $teacher)
    {
        return Inertia::render('admin/master/teachers/edit', [
            'teacher' => $teacher,
        ]);
    }

    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'nip' => 'nullable|string|max:50|unique:teachers,nip,' . $teacher->id,
            'nuptk' => 'nullable|string|max:50|unique:teachers,nuptk,' . $teacher->id,
            'name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'position' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
        ]);

        $teacher->update($validated);

        if ($request->hasFile('photo')) {
            $teacher->addMediaFromRequest('photo')->toMediaCollection('photo');
        }

        return redirect()->route('admin.master.teachers.index')
            ->with('success', 'Teacher updated successfully.');
    }

    public function destroy(Teacher $teacher)
    {
        if ($teacher->homeroomClassrooms()->exists()) {
            return back()->with('error', 'Cannot delete teacher assigned as homeroom teacher.');
        }

        $teacher->delete();

        return redirect()->route('admin.master.teachers.index')
            ->with('success', 'Teacher deleted successfully.');
    }
}
