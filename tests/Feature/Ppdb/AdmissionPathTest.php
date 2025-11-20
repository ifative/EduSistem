<?php

use App\Models\User;
use App\Models\Master\AcademicYear;
use App\Models\Ppdb\AdmissionPath;
use App\Models\Ppdb\AdmissionPeriod;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    $this->admin = User::factory()->create();

    $permissions = [
        'ppdb.paths.view',
        'ppdb.paths.create',
        'ppdb.paths.edit',
        'ppdb.paths.delete',
    ];

    foreach ($permissions as $permission) {
        Permission::firstOrCreate(['name' => $permission]);
    }

    $this->admin->givePermissionTo($permissions);

    $academicYear = AcademicYear::factory()->create();
    $this->period = AdmissionPeriod::factory()->create([
        'academic_year_id' => $academicYear->id,
    ]);
});

test('can view admission paths index', function () {
    AdmissionPath::factory()->count(3)->create([
        'admission_period_id' => $this->period->id,
    ]);

    $response = $this->actingAs($this->admin)
        ->get('/admin/ppdb/paths');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/ppdb/paths/index')
        ->has('paths.data', 3)
    );
});

test('can create admission path', function () {
    $response = $this->actingAs($this->admin)
        ->post('/admin/ppdb/paths', [
            'admission_period_id' => $this->period->id,
            'name' => 'Jalur Zonasi',
            'code' => 'ZON-001',
            'description' => 'Distance-based selection',
            'type' => 'zonasi',
            'quota' => 50,
            'max_distance' => 5.0,
            'requires_test' => false,
            'requires_documents' => true,
            'sort_order' => 1,
            'is_active' => true,
        ]);

    $response->assertRedirect('/admin/ppdb/paths');
    $this->assertDatabaseHas('admission_paths', [
        'name' => 'Jalur Zonasi',
        'code' => 'ZON-001',
        'type' => 'zonasi',
    ]);
});

test('can update admission path', function () {
    $path = AdmissionPath::factory()->create([
        'admission_period_id' => $this->period->id,
    ]);

    $response = $this->actingAs($this->admin)
        ->put("/admin/ppdb/paths/{$path->id}", [
            'admission_period_id' => $this->period->id,
            'name' => 'Updated Path',
            'code' => $path->code,
            'type' => 'prestasi',
            'quota' => 30,
            'requires_test' => true,
            'requires_documents' => true,
            'sort_order' => 2,
            'is_active' => true,
        ]);

    $response->assertRedirect('/admin/ppdb/paths');
    $this->assertDatabaseHas('admission_paths', [
        'id' => $path->id,
        'name' => 'Updated Path',
        'type' => 'prestasi',
    ]);
});

test('can delete admission path', function () {
    $path = AdmissionPath::factory()->create([
        'admission_period_id' => $this->period->id,
    ]);

    $response = $this->actingAs($this->admin)
        ->delete("/admin/ppdb/paths/{$path->id}");

    $response->assertRedirect('/admin/ppdb/paths');
    $this->assertDatabaseMissing('admission_paths', [
        'id' => $path->id,
    ]);
});

test('validates unique code', function () {
    AdmissionPath::factory()->create([
        'admission_period_id' => $this->period->id,
        'code' => 'EXISTING',
    ]);

    $response = $this->actingAs($this->admin)
        ->post('/admin/ppdb/paths', [
            'admission_period_id' => $this->period->id,
            'name' => 'New Path',
            'code' => 'EXISTING',
            'type' => 'reguler',
            'quota' => 50,
            'requires_test' => false,
            'requires_documents' => true,
            'sort_order' => 1,
            'is_active' => true,
        ]);

    $response->assertSessionHasErrors('code');
});

test('can filter paths by type', function () {
    AdmissionPath::factory()->create([
        'admission_period_id' => $this->period->id,
        'type' => 'zonasi',
    ]);
    AdmissionPath::factory()->create([
        'admission_period_id' => $this->period->id,
        'type' => 'prestasi',
    ]);

    $response = $this->actingAs($this->admin)
        ->get('/admin/ppdb/paths?type=zonasi');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->has('paths.data', 1)
    );
});
