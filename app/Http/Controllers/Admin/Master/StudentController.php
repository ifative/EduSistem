<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\Student;
use App\Models\Master\Classroom;
use App\Models\Master\Semester;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\StudentsExport;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::query()
            ->with(['classrooms' => function ($q) {
                $activeSemester = Semester::getActive();
                if ($activeSemester) {
                    $q->wherePivot('semester_id', $activeSemester->id);
                }
            }]);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('nis', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('classroom_id')) {
            $activeSemester = Semester::getActive();
            if ($activeSemester) {
                $query->whereHas('classrooms', function ($q) use ($request, $activeSemester) {
                    $q->where('classrooms.id', $request->classroom_id)
                        ->wherePivot('semester_id', $activeSemester->id);
                });
            }
        }

        $students = $query->orderBy('name')->paginate(10)->withQueryString();

        $classrooms = Classroom::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/master/students/index', [
            'students' => $students,
            'classrooms' => $classrooms,
            'filters' => $request->only(['search', 'status', 'classroom_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/master/students/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nis' => 'required|string|max:50|unique:students',
            'nisn' => 'required|string|size:10|unique:students',
            'name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'birth_place' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'religion' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:20',
            'address' => 'required|string',
            'parent_name' => 'required|string|max:255',
            'parent_phone' => 'required|string|max:20',
            'parent_email' => 'nullable|email|max:255',
            'entry_year' => 'required|integer|min:2000|max:' . (date('Y') + 1),
            'previous_school' => 'nullable|string|max:255',
            'status' => 'required|in:active,graduated,transferred,dropped',
        ]);

        $student = Student::create($validated);

        if ($request->hasFile('photo')) {
            $student->addMediaFromRequest('photo')->toMediaCollection('photo');
        }

        return redirect()->route('admin.master.students.index')
            ->with('success', 'Student created successfully.');
    }

    public function show(Student $student)
    {
        $student->load(['classrooms.level', 'classrooms.major', 'user']);

        return Inertia::render('admin/master/students/show', [
            'student' => $student,
        ]);
    }

    public function edit(Student $student)
    {
        return Inertia::render('admin/master/students/edit', [
            'student' => $student,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'nis' => 'required|string|max:50|unique:students,nis,' . $student->id,
            'nisn' => 'required|string|size:10|unique:students,nisn,' . $student->id,
            'name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'birth_place' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'religion' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:20',
            'address' => 'required|string',
            'parent_name' => 'required|string|max:255',
            'parent_phone' => 'required|string|max:20',
            'parent_email' => 'nullable|email|max:255',
            'entry_year' => 'required|integer|min:2000|max:' . (date('Y') + 1),
            'previous_school' => 'nullable|string|max:255',
            'status' => 'required|in:active,graduated,transferred,dropped',
        ]);

        $student->update($validated);

        if ($request->hasFile('photo')) {
            $student->addMediaFromRequest('photo')->toMediaCollection('photo');
        }

        return redirect()->route('admin.master.students.index')
            ->with('success', 'Student updated successfully.');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()->route('admin.master.students.index')
            ->with('success', 'Student deleted successfully.');
    }

    public function export(Request $request)
    {
        return Excel::download(new StudentsExport($request->all()), 'students.xlsx');
    }
}
