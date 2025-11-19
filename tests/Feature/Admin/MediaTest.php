<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    Storage::fake('public');
    Permission::firstOrCreate(['name' => 'settings.view']);
    Permission::firstOrCreate(['name' => 'settings.edit']);
});

test('user with permission can view media index', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('settings.view');

    $response = $this->actingAs($user)
        ->get(route('admin.media.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/media/index')
        ->has('media')
        ->has('filters')
    );
});

test('user without permission cannot view media index', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get(route('admin.media.index'));

    $response->assertForbidden();
});

test('media index can be searched by name', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('settings.view');

    // Upload media with specific names
    $user->addMedia(UploadedFile::fake()->image('searchable-image.jpg'))
        ->toMediaCollection('test');
    $user->addMedia(UploadedFile::fake()->image('other-image.jpg'))
        ->toMediaCollection('test');

    $response = $this->actingAs($user)
        ->get(route('admin.media.index', ['search' => 'searchable']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/media/index')
        ->has('media.data')
    );
});

test('media index can be filtered by type', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('settings.view');

    // Upload image
    $user->addMedia(UploadedFile::fake()->image('test.jpg'))
        ->toMediaCollection('test');

    $response = $this->actingAs($user)
        ->get(route('admin.media.index', ['type' => 'image']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/media/index')
        ->has('media.data')
    );
});

test('user with permission can delete media', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('settings.view');
    $user->givePermissionTo('settings.edit');

    // Upload media
    $user->addMedia(UploadedFile::fake()->image('to-delete.jpg'))
        ->toMediaCollection('test');

    $media = $user->getFirstMedia('test');

    $response = $this->actingAs($user)
        ->delete(route('admin.media.destroy', $media));

    $response->assertRedirect();
    expect(Media::find($media->id))->toBeNull();
});

test('user without permission cannot delete media', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('settings.view');

    // Upload media
    $user->addMedia(UploadedFile::fake()->image('test.jpg'))
        ->toMediaCollection('test');

    $media = $user->getFirstMedia('test');

    $response = $this->actingAs($user)
        ->delete(route('admin.media.destroy', $media));

    $response->assertForbidden();
});

test('guest cannot view media index', function () {
    $response = $this->get(route('admin.media.index'));

    $response->assertRedirect(route('login'));
});

test('guest cannot delete media', function () {
    $user = User::factory()->create();
    $user->addMedia(UploadedFile::fake()->image('test.jpg'))
        ->toMediaCollection('test');
    $media = $user->getFirstMedia('test');

    $response = $this->delete(route('admin.media.destroy', $media));

    $response->assertRedirect(route('login'));
});
