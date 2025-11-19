<?php

use App\Models\User;
use App\Models\Master\Classroom;
use App\Models\Master\Level;
use App\Models\Master\Major;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    $this->admin = User::factory()->create();

    $permissions = [
        'master.classrooms.view',
        'master.classrooms.create',
        'master.classrooms.edit',
        'master.classrooms.delete',
    ];

    foreach ($permissions as $permission) {
        Permission::firstOrCreate(['name' => $permission]);
    }

    $this->admin->givePermissionTo($permissions);
});

test('can view classrooms index', function () {
    $level = Level::factory()->create();
    Classroom::factory()->count(3)->create(['level_id' => $level->id]);

    $response = $this->actingAs($this->admin)
        ->get('/admin/master/classrooms');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/master/classrooms/index')
        ->has('classrooms.data', 3)
    );
});

test('can create classroom', function () {
    $level = Level::factory()->create();

    $response = $this->actingAs($this->admin)
        ->post('/admin/master/classrooms', [
            'name' => 'X IPA 1',
            'code' => 'X-IPA-1',
            'level_id' => $level->id,
            'capacity' => 30,
        ]);

    $response->assertRedirect('/admin/master/classrooms');
    $this->assertDatabaseHas('classrooms', [
        'name' => 'X IPA 1',
        'code' => 'X-IPA-1',
    ]);
});

test('can update classroom', function () {
    $level = Level::factory()->create();
    $classroom = Classroom::factory()->create(['level_id' => $level->id]);

    $response = $this->actingAs($this->admin)
        ->put("/admin/master/classrooms/{$classroom->id}", [
            'name' => 'Updated Name',
            'code' => $classroom->code,
            'level_id' => $level->id,
            'capacity' => 35,
        ]);

    $response->assertRedirect('/admin/master/classrooms');
    $this->assertDatabaseHas('classrooms', [
        'id' => $classroom->id,
        'name' => 'Updated Name',
        'capacity' => 35,
    ]);
});

test('can delete classroom', function () {
    $level = Level::factory()->create();
    $classroom = Classroom::factory()->create(['level_id' => $level->id]);

    $response = $this->actingAs($this->admin)
        ->delete("/admin/master/classrooms/{$classroom->id}");

    $response->assertRedirect('/admin/master/classrooms');
    $this->assertDatabaseMissing('classrooms', ['id' => $classroom->id]);
});
