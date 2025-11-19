<?php

use App\Models\User;
use App\Notifications\UserCreated;
use Illuminate\Support\Facades\Notification;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

test('user can fetch their notifications', function () {
    $user = User::factory()->create();

    // Create a notification
    $user->notify(new UserCreated(User::factory()->create()));

    $response = $this->actingAs($user)
        ->getJson(route('notifications.index'));

    $response->assertOk();
    $response->assertJsonStructure([
        'notifications' => [
            '*' => ['id', 'title', 'message', 'action_url', 'read_at', 'created_at'],
        ],
        'unread_count',
    ]);
});

test('user can mark notification as read', function () {
    $user = User::factory()->create();

    // Create a notification
    $user->notify(new UserCreated(User::factory()->create()));
    $notification = $user->notifications()->first();

    expect($notification->read_at)->toBeNull();

    $response = $this->actingAs($user)
        ->postJson(route('notifications.read', $notification->id));

    $response->assertOk();
    expect($notification->fresh()->read_at)->not->toBeNull();
});

test('user can mark all notifications as read', function () {
    $user = User::factory()->create();

    // Create multiple notifications
    $user->notify(new UserCreated(User::factory()->create()));
    $user->notify(new UserCreated(User::factory()->create()));

    expect($user->unreadNotifications()->count())->toBe(2);

    $response = $this->actingAs($user)
        ->postJson(route('notifications.read-all'));

    $response->assertOk();
    expect($user->fresh()->unreadNotifications()->count())->toBe(0);
});

test('notification is created when user is created by admin', function () {
    Permission::firstOrCreate(['name' => 'users.create']);
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $adminRole->givePermissionTo('users.create');

    $admin = User::factory()->create();
    $admin->assignRole('admin');

    // Create another admin to receive notification
    $otherAdmin = User::factory()->create();
    $otherAdmin->assignRole('admin');

    $response = $this->actingAs($admin)
        ->post(route('admin.users.store'), [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'roles' => [],
        ]);

    $response->assertRedirect(route('admin.users.index'));

    // Other admin should have received notification
    expect($otherAdmin->notifications()->count())->toBe(1);
});

test('unread count returns correct number', function () {
    $user = User::factory()->create();

    // Create 3 notifications
    $user->notify(new UserCreated(User::factory()->create()));
    $user->notify(new UserCreated(User::factory()->create()));
    $user->notify(new UserCreated(User::factory()->create()));

    // Mark one as read
    $user->notifications()->first()->markAsRead();

    $response = $this->actingAs($user)
        ->getJson(route('notifications.index'));

    $response->assertOk();
    $response->assertJsonPath('unread_count', 2);
});

test('guest cannot access notifications', function () {
    $response = $this->getJson(route('notifications.index'));

    $response->assertUnauthorized();
});
