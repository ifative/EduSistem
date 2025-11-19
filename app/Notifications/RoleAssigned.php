<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Spatie\Permission\Models\Role;

class RoleAssigned extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public User $user,
        public Role $role
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Role Assigned',
            'message' => "Role '{$this->role->name}' has been assigned to {$this->user->name}.",
            'user_id' => $this->user->id,
            'role_id' => $this->role->id,
            'action_url' => "/admin/users/{$this->user->id}/edit",
        ];
    }
}
