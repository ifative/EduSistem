<?php

namespace App\Http\Controllers\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\Level;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LevelController extends Controller
{
    public function index(Request $request)
    {
        $query = Level::query()
            ->withCount('classrooms');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $levels = $query->orderBy('name')->paginate(10)->withQueryString();

        return Inertia::render('admin/master/levels/index', [
            'levels' => $levels,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/master/levels/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:levels',
        ]);

        Level::create($validated);

        return redirect()->route('admin.master.levels.index')
            ->with('success', 'Level created successfully.');
    }

    public function edit(Level $level)
    {
        return Inertia::render('admin/master/levels/edit', [
            'level' => $level,
        ]);
    }

    public function update(Request $request, Level $level)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:levels,code,' . $level->id,
        ]);

        $level->update($validated);

        return redirect()->route('admin.master.levels.index')
            ->with('success', 'Level updated successfully.');
    }

    public function destroy(Level $level)
    {
        if ($level->classrooms()->exists()) {
            return back()->with('error', 'Cannot delete level with classrooms.');
        }

        $level->delete();

        return redirect()->route('admin.master.levels.index')
            ->with('success', 'Level deleted successfully.');
    }
}
