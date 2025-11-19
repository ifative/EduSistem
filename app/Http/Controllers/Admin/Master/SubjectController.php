<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Subject::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('group')) {
            $query->where('group', $request->group);
        }

        $subjects = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('admin/master/subjects/index', [
            'subjects' => $subjects,
            'filters' => $request->only(['search', 'group']),
            'groups' => ['A', 'B', 'C', 'Elective', 'Local'],
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/master/subjects/create', [
            'groups' => ['A', 'B', 'C', 'Elective', 'Local'],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:subjects',
            'group' => 'required|in:A,B,C,Elective,Local',
            'credits' => 'required|integer|min:1|max:10',
        ]);

        Subject::create($validated);

        return redirect()->route('admin.master.subjects.index')
            ->with('success', 'Subject created successfully.');
    }

    public function edit(Subject $subject)
    {
        return Inertia::render('admin/master/subjects/edit', [
            'subject' => $subject,
            'groups' => ['A', 'B', 'C', 'Elective', 'Local'],
        ]);
    }

    public function update(Request $request, Subject $subject)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:subjects,code,' . $subject->id,
            'group' => 'required|in:A,B,C,Elective,Local',
            'credits' => 'required|integer|min:1|max:10',
        ]);

        $subject->update($validated);

        return redirect()->route('admin.master.subjects.index')
            ->with('success', 'Subject updated successfully.');
    }

    public function destroy(Subject $subject)
    {
        if ($subject->classrooms()->exists()) {
            return back()->with('error', 'Cannot delete subject assigned to classrooms.');
        }

        $subject->delete();

        return redirect()->route('admin.master.subjects.index')
            ->with('success', 'Subject deleted successfully.');
    }
}
