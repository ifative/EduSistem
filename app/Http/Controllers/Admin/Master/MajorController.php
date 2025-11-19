<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\Major;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MajorController extends Controller
{
    public function index(Request $request)
    {
        $query = Major::query()
            ->withCount('classrooms');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $majors = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('admin/master/majors/index', [
            'majors' => $majors,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/master/majors/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:majors',
        ]);

        Major::create($validated);

        return redirect()->route('admin.master.majors.index')
            ->with('success', 'Major created successfully.');
    }

    public function edit(Major $major)
    {
        return Inertia::render('admin/master/majors/edit', [
            'major' => $major,
        ]);
    }

    public function update(Request $request, Major $major)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:majors,code,' . $major->id,
        ]);

        $major->update($validated);

        return redirect()->route('admin.master.majors.index')
            ->with('success', 'Major updated successfully.');
    }

    public function destroy(Major $major)
    {
        if ($major->classrooms()->exists()) {
            return back()->with('error', 'Cannot delete major with classrooms.');
        }

        $major->delete();

        return redirect()->route('admin.master.majors.index')
            ->with('success', 'Major deleted successfully.');
    }
}
