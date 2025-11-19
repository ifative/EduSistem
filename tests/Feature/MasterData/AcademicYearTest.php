<?php

use App\Models\User;
use App\Models\Master\AcademicYear;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    $this->admin = User::factory()->create();

    $permissions = [
        'master.academic-years.view',
        'master.academic-years.create',
        'master.academic-years.edit',
        'master.academic-years.delete',
    ];

    foreach ($permissions as $permission) {
        Permission::firstOrCreate(['name' => $permission]);
    }

    $this->admin->givePermissionTo($permissions);
});

test('can view academic years index', function () {
    AcademicYear::factory()->count(3)->create();

    $response = $this->actingAs($this->admin)
        ->get('/admin/master/academic-years');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/master/academic-years/index')
        ->has('academicYears.data', 3)
    );
});

test('can create academic year', function () {
    $response = $this->actingAs($this->admin)
        ->post('/admin/master/academic-years', [
            'name' => '2024/2025',
            'start_date' => '2024-07-01',
            'end_date' => '2025-06-30',
            'is_active' => true,
        ]);

    $response->assertRedirect('/admin/master/academic-years');
    $this->assertDatabaseHas('academic_years', [
        'name' => '2024/2025',
        'is_active' => true,
    ]);
});

test('can update academic year', function () {
    $year = AcademicYear::factory()->create(['name' => 'Old Name']);

    $response = $this->actingAs($this->admin)
        ->put("/admin/master/academic-years/{$year->id}", [
            'name' => 'New Name',
            'start_date' => '2024-07-01',
            'end_date' => '2025-06-30',
            'is_active' => false,
        ]);

    $response->assertRedirect('/admin/master/academic-years');
    $this->assertDatabaseHas('academic_years', [
        'id' => $year->id,
        'name' => 'New Name',
    ]);
});

test('can delete academic year', function () {
    $year = AcademicYear::factory()->create();

    $response = $this->actingAs($this->admin)
        ->delete("/admin/master/academic-years/{$year->id}");

    $response->assertRedirect('/admin/master/academic-years');
    $this->assertDatabaseMissing('academic_years', ['id' => $year->id]);
});

test('can activate academic year', function () {
    $year1 = AcademicYear::factory()->create(['is_active' => true]);
    $year2 = AcademicYear::factory()->create(['is_active' => false]);

    $response = $this->actingAs($this->admin)
        ->post("/admin/master/academic-years/{$year2->id}/activate");

    $response->assertRedirect();
    $this->assertDatabaseHas('academic_years', ['id' => $year1->id, 'is_active' => false]);
    $this->assertDatabaseHas('academic_years', ['id' => $year2->id, 'is_active' => true]);
});

test('validates required fields on create', function () {
    $response = $this->actingAs($this->admin)
        ->post('/admin/master/academic-years', []);

    $response->assertSessionHasErrors(['name', 'start_date', 'end_date']);
});
