<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\ExportController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Users
    Route::get('users', [UserController::class, 'index'])->name('users.index')->middleware('permission:users.view');
    Route::get('users/create', [UserController::class, 'create'])->name('users.create')->middleware('permission:users.create');
    Route::post('users', [UserController::class, 'store'])->name('users.store')->middleware('permission:users.create');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit')->middleware('permission:users.edit');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update')->middleware('permission:users.edit');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy')->middleware('permission:users.delete');

    // Roles
    Route::get('roles', [RoleController::class, 'index'])->name('roles.index')->middleware('permission:roles.view');
    Route::get('roles/create', [RoleController::class, 'create'])->name('roles.create')->middleware('permission:roles.create');
    Route::post('roles', [RoleController::class, 'store'])->name('roles.store')->middleware('permission:roles.create');
    Route::get('roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit')->middleware('permission:roles.edit');
    Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update')->middleware('permission:roles.edit');
    Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy')->middleware('permission:roles.delete');

    // Permissions
    Route::get('permissions', [PermissionController::class, 'index'])->name('permissions.index')->middleware('permission:permissions.view');
    Route::get('permissions/create', [PermissionController::class, 'create'])->name('permissions.create')->middleware('permission:permissions.create');
    Route::post('permissions', [PermissionController::class, 'store'])->name('permissions.store')->middleware('permission:permissions.create');
    Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy')->middleware('permission:permissions.delete');

    // Activity Logs
    Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index')->middleware('permission:activity-logs.view');

    // Settings
    Route::get('settings', [SettingsController::class, 'index'])->name('settings.index')->middleware('permission:settings.view');
    Route::put('settings', [SettingsController::class, 'update'])->name('settings.update')->middleware('permission:settings.edit');

    // Media
    Route::get('media', [MediaController::class, 'index'])->name('media.index')->middleware('permission:settings.view');
    Route::delete('media/{medium}', [MediaController::class, 'destroy'])->name('media.destroy')->middleware('permission:settings.edit');

    // Exports
    Route::get('export/users', [ExportController::class, 'users'])->name('export.users')->middleware('permission:users.view');
    Route::get('export/roles', [ExportController::class, 'roles'])->name('export.roles')->middleware('permission:roles.view');
    Route::get('export/activity-logs', [ExportController::class, 'activityLogs'])->name('export.activity-logs')->middleware('permission:activity-logs.view');
});
