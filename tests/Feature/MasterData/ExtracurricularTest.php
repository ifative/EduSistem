<?php

use App\Models\User;
use App\Models\Master\Extracurricular;
use App\Models\Master\Teacher;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    $this->admin = User::factory()->create();

    $permissions = [
        'master.extracurriculars.view',
        'master.extracurriculars.create',
        'master.extracurriculars.edit',
        'master.extracurriculars.delete',
    ];

    foreach ($permissions as $permission) {
        Permission::firstOrCreate(['name' => $permission]);
    }

    $this->admin->givePermissionTo($permissions);
});

test('can view extracurriculars index', function () {
    Extracurricular::factory()->count(3)->create();

    $response = $this->actingAs($this->admin)
        ->get('/admin/master/extracurriculars');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/master/extracurriculars/index')
        ->has('extracurriculars.data', 3)
    );
});

test('can create extracurricular', function () {
    $response = $this->actingAs($this->admin)
        ->post('/admin/master/extracurriculars', [
            'name' => 'Basketball Club',
            'description' => 'School basketball team',
        ]);

    $response->assertRedirect('/admin/master/extracurriculars');
    $this->assertDatabaseHas('extracurriculars', [
        'name' => 'Basketball Club',
        'description' => 'School basketball team',
    ]);
});

test('can create extracurricular with instructor', function () {
    $teacher = Teacher::factory()->create(['status' => 'active']);

    $response = $this->actingAs($this->admin)
        ->post('/admin/master/extracurriculars', [
            'name' => 'Music Club',
            'description' => 'School music ensemble',
            'instructor_id' => $teacher->id,
        ]);

    $response->assertRedirect('/admin/master/extracurriculars');
    $this->assertDatabaseHas('extracurriculars', [
        'name' => 'Music Club',
        'instructor_id' => $teacher->id,
    ]);
});

test('can update extracurricular', function () {
    $extracurricular = Extracurricular::factory()->create();

    $response = $this->actingAs($this->admin)
        ->put("/admin/master/extracurriculars/{$extracurricular->id}", [
            'name' => 'Updated Name',
            'description' => 'Updated description',
        ]);

    $response->assertRedirect('/admin/master/extracurriculars');
    $this->assertDatabaseHas('extracurriculars', [
        'id' => $extracurricular->id,
        'name' => 'Updated Name',
        'description' => 'Updated description',
    ]);
});

test('can delete extracurricular', function () {
    $extracurricular = Extracurricular::factory()->create();

    $response = $this->actingAs($this->admin)
        ->delete("/admin/master/extracurriculars/{$extracurricular->id}");

    $response->assertRedirect('/admin/master/extracurriculars');
    $this->assertDatabaseMissing('extracurriculars', [
        'id' => $extracurricular->id,
    ]);
});

test('validates unique name on create', function () {
    Extracurricular::factory()->create(['name' => 'Existing Club']);

    $response = $this->actingAs($this->admin)
        ->post('/admin/master/extracurriculars', [
            'name' => 'Existing Club',
        ]);

    $response->assertSessionHasErrors('name');
});

test('can search extracurriculars', function () {
    Extracurricular::factory()->create(['name' => 'Basketball']);
    Extracurricular::factory()->create(['name' => 'Football']);
    Extracurricular::factory()->create(['name' => 'Music']);

    $response = $this->actingAs($this->admin)
        ->get('/admin/master/extracurriculars?search=ball');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/master/extracurriculars/index')
        ->has('extracurriculars.data', 2)
    );
});
