<?php

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->withoutVite();

    // Create permissions
    Permission::create(['name' => 'roles.view']);
    Permission::create(['name' => 'roles.create']);
    Permission::create(['name' => 'roles.edit']);
    Permission::create(['name' => 'roles.delete']);
    Permission::create(['name' => 'users.view']);

    // Create admin role with all permissions
    $adminRole = Role::create(['name' => 'admin']);
    $adminRole->givePermissionTo(Permission::all());
});

test('admin can view roles list', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $response = $this->actingAs($admin)->get('/admin/roles');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('admin/roles/index'));
});

test('admin can create a role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $response = $this->actingAs($admin)->post('/admin/roles', [
        'name' => 'editor',
        'permissions' => ['users.view'],
    ]);

    $response->assertRedirect('/admin/roles');
    $this->assertDatabaseHas('roles', ['name' => 'editor']);

    $role = Role::findByName('editor');
    $this->assertTrue($role->hasPermissionTo('users.view'));
});

test('admin can update a role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $role = Role::create(['name' => 'editor']);

    $response = $this->actingAs($admin)->put("/admin/roles/{$role->id}", [
        'name' => 'super-editor',
        'permissions' => ['users.view'],
    ]);

    $response->assertRedirect('/admin/roles');
    $this->assertDatabaseHas('roles', [
        'id' => $role->id,
        'name' => 'super-editor',
    ]);
});

test('admin cannot delete admin role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $adminRole = Role::findByName('admin');

    $response = $this->actingAs($admin)->delete("/admin/roles/{$adminRole->id}");

    $response->assertRedirect();
    $this->assertDatabaseHas('roles', ['name' => 'admin']);
});

test('admin can delete other roles', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $role = Role::create(['name' => 'editor']);

    $response = $this->actingAs($admin)->delete("/admin/roles/{$role->id}");

    $response->assertRedirect('/admin/roles');
    $this->assertDatabaseMissing('roles', ['name' => 'editor']);
});
