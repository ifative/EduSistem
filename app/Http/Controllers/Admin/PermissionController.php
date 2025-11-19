<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $permissions = Permission::latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('admin/permissions/index', [
            'permissions' => $permissions,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/permissions/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:permissions'],
        ]);

        Permission::create(['name' => $validated['name']]);

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission created successfully.');
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission deleted successfully.');
    }
}
