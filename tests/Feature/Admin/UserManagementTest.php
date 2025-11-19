<?php

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $this->withoutVite();

    // Create permissions
    Permission::create(['name' => 'users.view']);
    Permission::create(['name' => 'users.create']);
    Permission::create(['name' => 'users.edit']);
    Permission::create(['name' => 'users.delete']);

    // Create admin role with all permissions
    $adminRole = Role::create(['name' => 'admin']);
    $adminRole->givePermissionTo(Permission::all());
});

test('admin can view users list', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $response = $this->actingAs($admin)->get('/admin/users');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('admin/users/index'));
});

test('admin can create a user', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $response = $this->actingAs($admin)->post('/admin/users', [
        'name' => 'New User',
        'email' => 'newuser@example.com',
        'password' => 'password123',
        'roles' => ['admin'],
    ]);

    $response->assertRedirect('/admin/users');
    $this->assertDatabaseHas('users', ['email' => 'newuser@example.com']);
});

test('admin can update a user', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $user = User::factory()->create();

    $response = $this->actingAs($admin)->put("/admin/users/{$user->id}", [
        'name' => 'Updated Name',
        'email' => $user->email,
        'roles' => [],
    ]);

    $response->assertRedirect('/admin/users');
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
    ]);
});

test('admin can delete a user', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $user = User::factory()->create();

    $response = $this->actingAs($admin)->delete("/admin/users/{$user->id}");

    $response->assertRedirect('/admin/users');
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

test('admin cannot delete themselves', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $response = $this->actingAs($admin)->delete("/admin/users/{$admin->id}");

    $response->assertRedirect();
    $this->assertDatabaseHas('users', ['id' => $admin->id]);
});

test('user without permission cannot access users list', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/admin/users');

    $response->assertStatus(403);
});
