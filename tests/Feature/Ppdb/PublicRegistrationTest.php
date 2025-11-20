<?php

use App\Models\Master\AcademicYear;
use App\Models\Master\Level;
use App\Models\Master\Major;
use App\Models\Ppdb\AdmissionPath;
use App\Models\Ppdb\AdmissionPeriod;
use App\Models\Ppdb\Registration;

beforeEach(function () {
    $academicYear = AcademicYear::factory()->create();
    $this->period = AdmissionPeriod::factory()->create([
        'academic_year_id' => $academicYear->id,
        'status' => 'open',
        'is_active' => true,
    ]);
    $this->path = AdmissionPath::factory()->create([
        'admission_period_id' => $this->period->id,
        'is_active' => true,
    ]);
});

test('can view registration page when period is open', function () {
    $response = $this->get('/ppdb');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('ppdb/register')
        ->has('period')
        ->has('paths')
    );
});

test('shows closed page when no active period', function () {
    // Deactivate period
    $this->period->update(['is_active' => false]);

    $response = $this->get('/ppdb');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('ppdb/closed')
    );
});

test('shows closed page when period is not open', function () {
    $this->period->update(['status' => 'closed']);

    $response = $this->get('/ppdb');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('ppdb/closed')
    );
});

test('can submit registration', function () {
    $response = $this->post('/ppdb', [
        'admission_path_id' => $this->path->id,
        'name' => 'John Doe',
        'gender' => 'male',
        'birth_place' => 'Jakarta',
        'birth_date' => '2010-01-15',
        'address' => 'Jl. Test No. 123',
        'phone' => '08123456789',
        'email' => 'john@example.com',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('registrations', [
        'name' => 'John Doe',
        'admission_path_id' => $this->path->id,
        'status' => 'draft',
    ]);
});

test('generates unique registration number', function () {
    $this->post('/ppdb', [
        'admission_path_id' => $this->path->id,
        'name' => 'Student 1',
        'gender' => 'female',
        'birth_place' => 'Bandung',
        'birth_date' => '2010-05-20',
        'address' => 'Jl. Test No. 1',
    ]);

    $this->post('/ppdb', [
        'admission_path_id' => $this->path->id,
        'name' => 'Student 2',
        'gender' => 'male',
        'birth_place' => 'Surabaya',
        'birth_date' => '2010-06-10',
        'address' => 'Jl. Test No. 2',
    ]);

    $registrations = Registration::all();
    expect($registrations)->toHaveCount(2);
    expect($registrations[0]->registration_number)->not->toBe($registrations[1]->registration_number);
});

test('can view success page', function () {
    $registration = Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
    ]);

    $response = $this->get("/ppdb/success/{$registration->registration_number}");

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('ppdb/success')
        ->has('registration')
    );
});

test('can view check status page', function () {
    $response = $this->get('/ppdb/check');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('ppdb/check')
    );
});

test('can check registration status', function () {
    $registration = Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
        'birth_date' => '2010-01-15',
    ]);

    $response = $this->post('/ppdb/status', [
        'registration_number' => $registration->registration_number,
        'birth_date' => '2010-01-15',
    ]);

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('ppdb/status')
        ->has('registration')
    );
});

test('returns error for invalid registration number', function () {
    $response = $this->post('/ppdb/status', [
        'registration_number' => 'INVALID-123',
        'birth_date' => '2010-01-15',
    ]);

    $response->assertSessionHasErrors('error');
});

test('returns error for mismatched birth date', function () {
    $registration = Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
        'birth_date' => '2010-01-15',
    ]);

    $response = $this->post('/ppdb/status', [
        'registration_number' => $registration->registration_number,
        'birth_date' => '2010-12-31', // Wrong date
    ]);

    $response->assertSessionHasErrors('error');
});

test('can submit draft registration', function () {
    $registration = Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
        'status' => 'draft',
    ]);

    $response = $this->post("/ppdb/{$registration->id}/submit");

    $response->assertRedirect();
    $this->assertDatabaseHas('registrations', [
        'id' => $registration->id,
        'status' => 'submitted',
    ]);
});

test('cannot submit already submitted registration', function () {
    $registration = Registration::factory()->create([
        'admission_period_id' => $this->period->id,
        'admission_path_id' => $this->path->id,
        'status' => 'submitted',
    ]);

    $response = $this->post("/ppdb/{$registration->id}/submit");

    $response->assertSessionHasErrors('error');
});

test('validates required fields on registration', function () {
    $response = $this->post('/ppdb', [
        'admission_path_id' => $this->path->id,
        // Missing required fields
    ]);

    $response->assertSessionHasErrors(['name', 'gender', 'birth_place', 'birth_date', 'address']);
});

test('cannot register when period is closed', function () {
    $this->period->update(['status' => 'closed']);

    $response = $this->post('/ppdb', [
        'admission_path_id' => $this->path->id,
        'name' => 'Test Student',
        'gender' => 'male',
        'birth_place' => 'Jakarta',
        'birth_date' => '2010-01-15',
        'address' => 'Jl. Test',
    ]);

    $response->assertSessionHasErrors('error');
});
