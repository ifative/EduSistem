<?php

use App\Models\User;
use App\Models\Master\AcademicYear;
use App\Models\Ppdb\AdmissionPath;
use App\Models\Ppdb\AdmissionPeriod;
use App\Models\Ppdb\Registration;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    $this->admin = User::factory()->create();

    $permissions = [
        'ppdb.registrations.view',
        'ppdb.registrations.edit',
        'ppdb.registrations.verify',
    ];

    foreach ($permissions as $permission) {
        Permission::firstOrCreate(['name' => $permission]);
    }

    $this->admin->givePermissionTo($permissions);

    $academicYear = AcademicYear::factory()->create();
    $this->period = AdmissionPeriod::factory()->create([
        'academic_year_id' => $academicYear->id,
        'status' => 'open',
        'is_active' => true,
    ]);
    $this->path = AdmissionPath::factory()->create([
        'admission_period_id' => $this->period->id,
    ]);
});

test('can view registrations index', function () {
    Registration::factory()->count(3)->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
    ]);

    $response = $this->actingAs($this->admin)
        ->get('/admin/ppdb/registrations');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/ppdb/registrations/index')
        ->has('registrations.data', 3)
    );
});

test('can view registration details', function () {
    $registration = Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
    ]);

    $response = $this->actingAs($this->admin)
        ->get("/admin/ppdb/registrations/{$registration->id}");

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/ppdb/registrations/show')
        ->has('registration')
    );
});

test('can verify registration', function () {
    $registration = Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
        'status' => 'submitted',
    ]);

    $response = $this->actingAs($this->admin)
        ->post("/admin/ppdb/registrations/{$registration->id}/verify", [
            'status' => 'verified',
            'notes' => 'All documents are complete',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('registrations', [
        'id' => $registration->id,
        'status' => 'verified',
    ]);
});

test('can update registration status', function () {
    $registration = Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
        'status' => 'verified',
    ]);

    $response = $this->actingAs($this->admin)
        ->put("/admin/ppdb/registrations/{$registration->id}/status", [
            'status' => 'accepted',
            'notes' => 'Congratulations!',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('registrations', [
        'id' => $registration->id,
        'status' => 'accepted',
    ]);
});

test('can filter registrations by status', function () {
    Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
        'status' => 'submitted',
    ]);
    Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
        'status' => 'verified',
    ]);

    $response = $this->actingAs($this->admin)
        ->get('/admin/ppdb/registrations?status=submitted');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->has('registrations.data', 1)
    );
});

test('can search registrations', function () {
    Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
        'name' => 'John Doe',
    ]);
    Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
        'name' => 'Jane Smith',
    ]);

    $response = $this->actingAs($this->admin)
        ->get('/admin/ppdb/registrations?search=John');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->has('registrations.data', 1)
    );
});

test('can view statistics', function () {
    Registration::factory()->count(5)->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
    ]);

    $response = $this->actingAs($this->admin)
        ->get('/admin/ppdb/registrations/statistics');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/ppdb/registrations/statistics')
        ->has('statistics')
    );
});
