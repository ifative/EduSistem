<?php

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    // Create permissions
    Permission::firstOrCreate(['name' => 'users.view']);
    Permission::firstOrCreate(['name' => 'roles.view']);
    Permission::firstOrCreate(['name' => 'activity-logs.view']);
});

test('user with permission can export users', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('users.view');

    $response = $this->actingAs($user)
        ->get(route('admin.export.users'));

    $response->assertOk();
    $response->assertDownload();
});

test('user without permission cannot export users', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get(route('admin.export.users'));

    $response->assertForbidden();
});

test('user with permission can export roles', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('roles.view');

    // Create some roles
    Role::create(['name' => 'test-role']);

    $response = $this->actingAs($user)
        ->get(route('admin.export.roles'));

    $response->assertOk();
    $response->assertDownload();
});

test('user without permission cannot export roles', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get(route('admin.export.roles'));

    $response->assertForbidden();
});

test('user with permission can export activity logs', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('activity-logs.view');

    $response = $this->actingAs($user)
        ->get(route('admin.export.activity-logs'));

    $response->assertOk();
    $response->assertDownload();
});

test('user without permission cannot export activity logs', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get(route('admin.export.activity-logs'));

    $response->assertForbidden();
});

test('guest cannot export users', function () {
    $response = $this->get(route('admin.export.users'));

    $response->assertRedirect(route('login'));
});

test('guest cannot export roles', function () {
    $response = $this->get(route('admin.export.roles'));

    $response->assertRedirect(route('login'));
});

test('guest cannot export activity logs', function () {
    $response = $this->get(route('admin.export.activity-logs'));

    $response->assertRedirect(route('login'));
});
