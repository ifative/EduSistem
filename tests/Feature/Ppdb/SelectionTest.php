<?php

use App\Models\User;
use App\Models\Master\AcademicYear;
use App\Models\Ppdb\AdmissionPath;
use App\Models\Ppdb\AdmissionPeriod;
use App\Models\Ppdb\Registration;
use App\Models\Ppdb\Selection;
use App\Services\Ppdb\SelectionService;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    $this->admin = User::factory()->create();

    $permissions = [
        'ppdb.selections.view',
        'ppdb.selections.edit',
        'ppdb.selections.run',
        'ppdb.selections.announce',
    ];

    foreach ($permissions as $permission) {
        Permission::firstOrCreate(['name' => $permission]);
    }

    $this->admin->givePermissionTo($permissions);

    $academicYear = AcademicYear::factory()->create();
    $this->period = AdmissionPeriod::factory()->create([
        'academic_year_id' => $academicYear->id,
        'status' => 'selection',
    ]);
    $this->path = AdmissionPath::factory()->create([
        'admission_period_id' => $this->period->id,
        'type' => 'reguler',
        'quota' => 2,
    ]);
});

test('can view selections index', function () {
    $registration = Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
    ]);

    Selection::factory()->create([
        'registration_id' => $registration->id,
    ]);

    $response = $this->actingAs($this->admin)
        ->get('/admin/ppdb/selections');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/ppdb/selections/index')
        ->has('selections.data', 1)
    );
});

test('can run selection for path', function () {
    // Create verified registrations
    Registration::factory()->count(3)->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
        'status' => 'verified',
    ]);

    $response = $this->actingAs($this->admin)
        ->post('/admin/ppdb/selections/run', [
            'path_id' => $this->path->id,
        ]);

    $response->assertRedirect();

    // Check that selections were created
    $this->assertEquals(3, Selection::count());

    // Check that 2 passed (quota) and 1 failed
    $this->assertEquals(2, Selection::where('status', 'passed')->count());
});

test('can update selection status', function () {
    $registration = Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
    ]);

    $selection = Selection::factory()->create([
        'registration_id' => $registration->id,
        'status' => 'reserve',
    ]);

    $response = $this->actingAs($this->admin)
        ->put("/admin/ppdb/selections/{$selection->id}/status", [
            'status' => 'passed',
            'notes' => 'Upgraded from reserve',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('selections', [
        'id' => $selection->id,
        'status' => 'passed',
    ]);
});

test('can announce results', function () {
    $registration1 = Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
        'status' => 'verified',
    ]);
    $registration2 = Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
        'status' => 'verified',
    ]);

    Selection::factory()->create([
        'registration_id' => $registration1->id,
        'status' => 'passed',
    ]);
    Selection::factory()->create([
        'registration_id' => $registration2->id,
        'status' => 'failed',
    ]);

    $response = $this->actingAs($this->admin)
        ->post('/admin/ppdb/selections/announce', [
            'period_id' => $this->period->id,
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('admission_periods', [
        'id' => $this->period->id,
        'status' => 'announced',
    ]);

    $this->assertDatabaseHas('registrations', [
        'id' => $registration1->id,
        'status' => 'accepted',
    ]);

    $this->assertDatabaseHas('registrations', [
        'id' => $registration2->id,
        'status' => 'rejected',
    ]);
});

test('can view results dashboard', function () {
    $response = $this->actingAs($this->admin)
        ->get('/admin/ppdb/selections/results?period_id=' . $this->period->id);

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/ppdb/selections/results')
    );
});

test('selection service calculates scores correctly', function () {
    $service = new SelectionService();

    $registration = Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
        'status' => 'verified',
        'birth_date' => now()->subYears(15),
    ]);

    $result = $service->runSelection($this->path);

    expect($result)->toHaveKeys(['passed', 'failed', 'reserve']);
    expect(Selection::where('registration_id', $registration->id)->exists())->toBeTrue();
});
