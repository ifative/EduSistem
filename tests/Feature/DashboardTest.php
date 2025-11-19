<?php

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertOk();
});

test('dashboard displays stats correctly', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('stats')
        ->has('recentActivities')
    );
});

test('dashboard stats counts users correctly', function () {
    // Create users
    User::factory()->count(5)->create();
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('stats.total_users', 6) // 5 + 1 acting user
    );
});

test('dashboard stats counts roles correctly', function () {
    $user = User::factory()->create();
    Role::create(['name' => 'test-role']);

    $response = $this->actingAs($user)
        ->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('stats.total_roles')
    );
});

test('dashboard stats counts permissions correctly', function () {
    $user = User::factory()->create();
    Permission::create(['name' => 'test-permission']);

    $response = $this->actingAs($user)
        ->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('stats.total_permissions')
    );
});

test('dashboard shows recent users count', function () {
    $user = User::factory()->create();

    // Create users within the last 7 days
    User::factory()->count(3)->create([
        'created_at' => now()->subDays(3),
    ]);

    // Create users older than 7 days
    User::factory()->count(2)->create([
        'created_at' => now()->subDays(10),
    ]);

    $response = $this->actingAs($user)
        ->get(route('dashboard'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->where('stats.recent_users', 4) // 3 recent + acting user
    );
});
