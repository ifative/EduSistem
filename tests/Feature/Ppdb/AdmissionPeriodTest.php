<?php

use App\Models\User;
use App\Models\Master\AcademicYear;
use App\Models\Ppdb\AdmissionPeriod;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    $this->admin = User::factory()->create();

    $permissions = [
        'ppdb.periods.view',
        'ppdb.periods.create',
        'ppdb.periods.edit',
        'ppdb.periods.delete',
    ];

    foreach ($permissions as $permission) {
        Permission::firstOrCreate(['name' => $permission]);
    }

    $this->admin->givePermissionTo($permissions);
    $this->academicYear = AcademicYear::factory()->create();
});

test('can view admission periods index', function () {
    AdmissionPeriod::factory()->count(3)->create([
        'academic_year_id' => $this->academicYear->id,
    ]);

    $response = $this->actingAs($this->admin)
        ->get('/admin/ppdb/periods');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/ppdb/periods/index')
        ->has('periods.data', 3)
    );
});

test('can create admission period', function () {
    $response = $this->actingAs($this->admin)
        ->post('/admin/ppdb/periods', [
            'academic_year_id' => $this->academicYear->id,
            'name' => 'PPDB 2024/2025',
            'description' => 'Student admission period',
            'registration_start' => '2024-06-01',
            'registration_end' => '2024-06-30',
            'quota' => 100,
            'status' => 'draft',
            'is_active' => false,
        ]);

    $response->assertRedirect('/admin/ppdb/periods');
    $this->assertDatabaseHas('admission_periods', [
        'name' => 'PPDB 2024/2025',
        'quota' => 100,
    ]);
});

test('can update admission period', function () {
    $period = AdmissionPeriod::factory()->create([
        'academic_year_id' => $this->academicYear->id,
    ]);

    $response = $this->actingAs($this->admin)
        ->put("/admin/ppdb/periods/{$period->id}", [
            'academic_year_id' => $this->academicYear->id,
            'name' => 'Updated Period',
            'registration_start' => '2024-06-01',
            'registration_end' => '2024-06-30',
            'quota' => 200,
            'status' => 'open',
            'is_active' => true,
        ]);

    $response->assertRedirect('/admin/ppdb/periods');
    $this->assertDatabaseHas('admission_periods', [
        'id' => $period->id,
        'name' => 'Updated Period',
        'quota' => 200,
    ]);
});

test('can delete admission period', function () {
    $period = AdmissionPeriod::factory()->create([
        'academic_year_id' => $this->academicYear->id,
    ]);

    $response = $this->actingAs($this->admin)
        ->delete("/admin/ppdb/periods/{$period->id}");

    $response->assertRedirect('/admin/ppdb/periods');
    $this->assertDatabaseMissing('admission_periods', [
        'id' => $period->id,
    ]);
});

test('can toggle period active status', function () {
    $period = AdmissionPeriod::factory()->create([
        'academic_year_id' => $this->academicYear->id,
        'is_active' => false,
    ]);

    $response = $this->actingAs($this->admin)
        ->post("/admin/ppdb/periods/{$period->id}/toggle-active");

    $response->assertRedirect();
    $this->assertDatabaseHas('admission_periods', [
        'id' => $period->id,
        'is_active' => true,
    ]);
});

test('validates registration dates', function () {
    $response = $this->actingAs($this->admin)
        ->post('/admin/ppdb/periods', [
            'academic_year_id' => $this->academicYear->id,
            'name' => 'Invalid Period',
            'registration_start' => '2024-06-30',
            'registration_end' => '2024-06-01', // End before start
            'quota' => 100,
            'status' => 'draft',
        ]);

    $response->assertSessionHasErrors('registration_end');
});
