<?php

use App\Models\User;
use App\Models\Master\Student;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    $this->admin = User::factory()->create();

    $permissions = [
        'master.students.view',
        'master.students.create',
        'master.students.edit',
        'master.students.delete',
    ];

    foreach ($permissions as $permission) {
        Permission::firstOrCreate(['name' => $permission]);
    }

    $this->admin->givePermissionTo($permissions);
});

test('can view students index', function () {
    Student::factory()->count(3)->create();

    $response = $this->actingAs($this->admin)
        ->get('/admin/master/students');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/master/students/index')
        ->has('students.data', 3)
    );
});

test('can create student', function () {
    $response = $this->actingAs($this->admin)
        ->post('/admin/master/students', [
            'nis' => '12345',
            'nisn' => '1234567890',
            'name' => 'John Doe',
            'gender' => 'male',
            'birth_place' => 'Jakarta',
            'birth_date' => '2010-01-01',
            'address' => '123 Main St',
            'parent_name' => 'Jane Doe',
            'parent_phone' => '08123456789',
            'entry_year' => 2024,
            'status' => 'active',
        ]);

    $response->assertRedirect('/admin/master/students');
    $this->assertDatabaseHas('students', [
        'nis' => '12345',
        'nisn' => '1234567890',
        'name' => 'John Doe',
    ]);
});

test('can view student detail', function () {
    $student = Student::factory()->create();

    $response = $this->actingAs($this->admin)
        ->get("/admin/master/students/{$student->id}");

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/master/students/show')
        ->has('student')
    );
});

test('can update student', function () {
    $student = Student::factory()->create();

    $response = $this->actingAs($this->admin)
        ->put("/admin/master/students/{$student->id}", [
            'nis' => $student->nis,
            'nisn' => $student->nisn,
            'name' => 'Updated Name',
            'gender' => 'male',
            'birth_place' => 'Jakarta',
            'birth_date' => '2010-01-01',
            'address' => '123 Main St',
            'parent_name' => 'Jane Doe',
            'parent_phone' => '08123456789',
            'entry_year' => 2024,
            'status' => 'active',
        ]);

    $response->assertRedirect('/admin/master/students');
    $this->assertDatabaseHas('students', [
        'id' => $student->id,
        'name' => 'Updated Name',
    ]);
});

test('can delete student', function () {
    $student = Student::factory()->create();

    $response = $this->actingAs($this->admin)
        ->delete("/admin/master/students/{$student->id}");

    $response->assertRedirect('/admin/master/students');
    $this->assertDatabaseMissing('students', ['id' => $student->id]);
});

test('validates unique nis on create', function () {
    Student::factory()->create(['nis' => '12345']);

    $response = $this->actingAs($this->admin)
        ->post('/admin/master/students', [
            'nis' => '12345',
            'nisn' => '1234567890',
            'name' => 'John Doe',
            'gender' => 'male',
            'birth_place' => 'Jakarta',
            'birth_date' => '2010-01-01',
            'address' => '123 Main St',
            'parent_name' => 'Jane Doe',
            'parent_phone' => '08123456789',
            'entry_year' => 2024,
            'status' => 'active',
        ]);

    $response->assertSessionHasErrors(['nis']);
});

test('can filter students by status', function () {
    Student::factory()->count(2)->create(['status' => 'active']);
    Student::factory()->create(['status' => 'graduated']);

    $response = $this->actingAs($this->admin)
        ->get('/admin/master/students?status=active');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->has('students.data', 2)
    );
});
