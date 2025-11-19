<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\Classroom;
use App\Models\Master\Level;
use App\Models\Master\Major;
use App\Models\Master\Teacher;
use App\Models\Master\Student;
use App\Models\Master\Semester;
use App\Models\Master\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassroomController extends Controller
{
    public function index(Request $request)
    {
        $query = Classroom::query()
            ->with(['level', 'major', 'homeroomTeacher'])
            ->withCount(['students' => function ($q) {
                $activeSemester = Semester::getActive();
                if ($activeSemester) {
                    $q->wherePivot('semester_id', $activeSemester->id);
                }
            }]);

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->filled('level_id')) {
            $query->where('level_id', $request->level_id);
        }

        if ($request->filled('major_id')) {
            $query->where('major_id', $request->major_id);
        }

        $classrooms = $query->orderBy('name')->paginate(10)->withQueryString();

        $levels = Level::orderBy('name')->get(['id', 'name']);
        $majors = Major::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/master/classrooms/index', [
            'classrooms' => $classrooms,
            'levels' => $levels,
            'majors' => $majors,
            'filters' => $request->only(['search', 'level_id', 'major_id']),
        ]);
    }

    public function create()
    {
        $levels = Level::orderBy('name')->get(['id', 'name', 'code']);
        $majors = Major::orderBy('name')->get(['id', 'name', 'code']);
        $teachers = Teacher::active()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/master/classrooms/create', [
            'levels' => $levels,
            'majors' => $majors,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
            'level_id' => 'required|exists:levels,id',
            'major_id' => 'nullable|exists:majors,id',
            'capacity' => 'required|integer|min:1|max:100',
            'homeroom_teacher_id' => 'nullable|exists:teachers,id',
        ]);

        Classroom::create($validated);

        return redirect()->route('admin.master.classrooms.index')
            ->with('success', 'Classroom created successfully.');
    }

    public function show(Classroom $classroom)
    {
        $classroom->load(['level', 'major', 'homeroomTeacher', 'subjects.pivot.teacher']);

        $activeSemester = Semester::getActive();
        $students = $activeSemester
            ? $classroom->students()
                ->wherePivot('semester_id', $activeSemester->id)
                ->orderBy('name')
                ->get()
            : collect();

        return Inertia::render('admin/master/classrooms/show', [
            'classroom' => $classroom,
            'students' => $students,
            'activeSemester' => $activeSemester,
        ]);
    }

    public function edit(Classroom $classroom)
    {
        $levels = Level::orderBy('name')->get(['id', 'name', 'code']);
        $majors = Major::orderBy('name')->get(['id', 'name', 'code']);
        $teachers = Teacher::active()->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/master/classrooms/edit', [
            'classroom' => $classroom,
            'levels' => $levels,
            'majors' => $majors,
            'teachers' => $teachers,
        ]);
    }

    public function update(Request $request, Classroom $classroom)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50',
            'level_id' => 'required|exists:levels,id',
            'major_id' => 'nullable|exists:majors,id',
            'capacity' => 'required|integer|min:1|max:100',
            'homeroom_teacher_id' => 'nullable|exists:teachers,id',
        ]);

        $classroom->update($validated);

        return redirect()->route('admin.master.classrooms.index')
            ->with('success', 'Classroom updated successfully.');
    }

    public function destroy(Classroom $classroom)
    {
        if ($classroom->students()->exists()) {
            return back()->with('error', 'Cannot delete classroom with enrolled students.');
        }

        $classroom->delete();

        return redirect()->route('admin.master.classrooms.index')
            ->with('success', 'Classroom deleted successfully.');
    }

    public function enrollStudents(Request $request, Classroom $classroom)
    {
        $validated = $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:students,id',
        ]);

        $activeSemester = Semester::getActive();
        $activeYear = AcademicYear::getActive();

        if (!$activeSemester || !$activeYear) {
            return back()->with('error', 'No active semester or academic year.');
        }

        foreach ($validated['student_ids'] as $studentId) {
            $classroom->students()->syncWithoutDetaching([
                $studentId => [
                    'academic_year_id' => $activeYear->id,
                    'semester_id' => $activeSemester->id,
                ],
            ]);
        }

        return back()->with('success', 'Students enrolled successfully.');
    }

    public function removeStudent(Classroom $classroom, Student $student)
    {
        $activeSemester = Semester::getActive();

        if ($activeSemester) {
            $classroom->students()->wherePivot('semester_id', $activeSemester->id)->detach($student->id);
        }

        return back()->with('success', 'Student removed from classroom.');
    }
}
