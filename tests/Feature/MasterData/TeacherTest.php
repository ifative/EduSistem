<?php

use App\Models\User;
use App\Models\Master\Teacher;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    $this->admin = User::factory()->create();

    $permissions = [
        'master.teachers.view',
        'master.teachers.create',
        'master.teachers.edit',
        'master.teachers.delete',
    ];

    foreach ($permissions as $permission) {
        Permission::firstOrCreate(['name' => $permission]);
    }

    $this->admin->givePermissionTo($permissions);
});

test('can view teachers index', function () {
    Teacher::factory()->count(3)->create();

    $response = $this->actingAs($this->admin)
        ->get('/admin/master/teachers');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/master/teachers/index')
        ->has('teachers.data', 3)
    );
});

test('can create teacher', function () {
    $response = $this->actingAs($this->admin)
        ->post('/admin/master/teachers', [
            'name' => 'John Teacher',
            'gender' => 'male',
            'email' => 'john@school.com',
            'phone' => '08123456789',
            'address' => '123 School St',
            'status' => 'active',
        ]);

    $response->assertRedirect('/admin/master/teachers');
    $this->assertDatabaseHas('teachers', [
        'name' => 'John Teacher',
        'email' => 'john@school.com',
    ]);
});

test('can update teacher', function () {
    $teacher = Teacher::factory()->create();

    $response = $this->actingAs($this->admin)
        ->put("/admin/master/teachers/{$teacher->id}", [
            'name' => 'Updated Name',
            'gender' => 'male',
            'email' => 'updated@school.com',
            'phone' => '08123456789',
            'address' => '123 School St',
            'status' => 'active',
        ]);

    $response->assertRedirect('/admin/master/teachers');
    $this->assertDatabaseHas('teachers', [
        'id' => $teacher->id,
        'name' => 'Updated Name',
    ]);
});

test('can delete teacher', function () {
    $teacher = Teacher::factory()->create();

    $response = $this->actingAs($this->admin)
        ->delete("/admin/master/teachers/{$teacher->id}");

    $response->assertRedirect('/admin/master/teachers');
    $this->assertDatabaseMissing('teachers', ['id' => $teacher->id]);
});
