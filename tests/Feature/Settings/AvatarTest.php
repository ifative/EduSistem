<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('user can upload avatar', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('profile.avatar.update'), [
            'avatar' => UploadedFile::fake()->image('avatar.jpg', 200, 200),
        ]);

    $response->assertRedirect();
    expect($user->fresh()->getFirstMediaUrl('avatar'))->not->toBeEmpty();
});

test('avatar upload requires image file', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('profile.avatar.update'), [
            'avatar' => UploadedFile::fake()->create('document.pdf', 100),
        ]);

    $response->assertSessionHasErrors('avatar');
});

test('avatar upload validates file size', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('profile.avatar.update'), [
            'avatar' => UploadedFile::fake()->image('large.jpg')->size(3000), // 3MB
        ]);

    $response->assertSessionHasErrors('avatar');
});

test('user can delete avatar', function () {
    $user = User::factory()->create();

    // First upload an avatar
    $user->addMedia(UploadedFile::fake()->image('avatar.jpg'))
        ->toMediaCollection('avatar');

    expect($user->getFirstMediaUrl('avatar'))->not->toBeEmpty();

    $response = $this->actingAs($user)
        ->delete(route('profile.avatar.destroy'));

    $response->assertRedirect();
    expect($user->fresh()->getFirstMediaUrl('avatar'))->toBeEmpty();
});

test('guest cannot upload avatar', function () {
    $response = $this->post(route('profile.avatar.update'), [
        'avatar' => UploadedFile::fake()->image('avatar.jpg'),
    ]);

    $response->assertRedirect(route('login'));
});

test('guest cannot delete avatar', function () {
    $response = $this->delete(route('profile.avatar.destroy'));

    $response->assertRedirect(route('login'));
});
