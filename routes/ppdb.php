<?php

use App\Http\Controllers\Admin\Ppdb\AdmissionPathController;
use App\Http\Controllers\Admin\Ppdb\AdmissionPeriodController;
use App\Http\Controllers\Admin\Ppdb\DocumentVerificationController;
use App\Http\Controllers\Admin\Ppdb\RegistrationController;
use App\Http\Controllers\Admin\Ppdb\SelectionController;
use App\Http\Controllers\Ppdb\PublicRegistrationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public PPDB Routes
|--------------------------------------------------------------------------
*/

Route::prefix('ppdb')->name('ppdb.')->group(function () {
    Route::get('/', [PublicRegistrationController::class, 'index'])->name('index');
    Route::post('/', [PublicRegistrationController::class, 'store'])->name('store');
    Route::get('/success/{registration}', [PublicRegistrationController::class, 'success'])->name('success');
    Route::get('/check', [PublicRegistrationController::class, 'check'])->name('check');
    Route::post('/status', [PublicRegistrationController::class, 'status'])->name('status');
    Route::post('/{registration}/documents', [PublicRegistrationController::class, 'uploadDocument'])->name('documents.upload');
    Route::post('/{registration}/scores', [PublicRegistrationController::class, 'addScore'])->name('scores.add');
    Route::post('/{registration}/achievements', [PublicRegistrationController::class, 'addAchievement'])->name('achievements.add');
    Route::post('/{registration}/submit', [PublicRegistrationController::class, 'submit'])->name('submit');
});

/*
|--------------------------------------------------------------------------
| PPDB Routes
|--------------------------------------------------------------------------
|
| Routes for the Student Admission (PPDB) module.
|
*/

Route::middleware(['auth', 'verified'])->prefix('admin/ppdb')->name('admin.ppdb.')->group(function () {

    // Admission Periods
    Route::get('periods', [AdmissionPeriodController::class, 'index'])
        ->name('periods.index')
        ->middleware('permission:ppdb.periods.view');

    Route::get('periods/create', [AdmissionPeriodController::class, 'create'])
        ->name('periods.create')
        ->middleware('permission:ppdb.periods.create');

    Route::post('periods', [AdmissionPeriodController::class, 'store'])
        ->name('periods.store')
        ->middleware('permission:ppdb.periods.create');

    Route::get('periods/{period}/edit', [AdmissionPeriodController::class, 'edit'])
        ->name('periods.edit')
        ->middleware('permission:ppdb.periods.edit');

    Route::put('periods/{period}', [AdmissionPeriodController::class, 'update'])
        ->name('periods.update')
        ->middleware('permission:ppdb.periods.edit');

    Route::delete('periods/{period}', [AdmissionPeriodController::class, 'destroy'])
        ->name('periods.destroy')
        ->middleware('permission:ppdb.periods.delete');

    Route::post('periods/{period}/toggle-active', [AdmissionPeriodController::class, 'toggleActive'])
        ->name('periods.toggle-active')
        ->middleware('permission:ppdb.periods.edit');

    // Admission Paths
    Route::get('paths', [AdmissionPathController::class, 'index'])
        ->name('paths.index')
        ->middleware('permission:ppdb.paths.view');

    Route::get('paths/create', [AdmissionPathController::class, 'create'])
        ->name('paths.create')
        ->middleware('permission:ppdb.paths.create');

    Route::post('paths', [AdmissionPathController::class, 'store'])
        ->name('paths.store')
        ->middleware('permission:ppdb.paths.create');

    Route::get('paths/{path}/edit', [AdmissionPathController::class, 'edit'])
        ->name('paths.edit')
        ->middleware('permission:ppdb.paths.edit');

    Route::put('paths/{path}', [AdmissionPathController::class, 'update'])
        ->name('paths.update')
        ->middleware('permission:ppdb.paths.edit');

    Route::delete('paths/{path}', [AdmissionPathController::class, 'destroy'])
        ->name('paths.destroy')
        ->middleware('permission:ppdb.paths.delete');

    // Registrations
    Route::get('registrations', [RegistrationController::class, 'index'])
        ->name('registrations.index')
        ->middleware('permission:ppdb.registrations.view');

    Route::get('registrations/statistics', [RegistrationController::class, 'statistics'])
        ->name('registrations.statistics')
        ->middleware('permission:ppdb.registrations.view');

    Route::get('registrations/export', [RegistrationController::class, 'export'])
        ->name('registrations.export')
        ->middleware('permission:ppdb.registrations.export');

    Route::get('registrations/{registration}', [RegistrationController::class, 'show'])
        ->name('registrations.show')
        ->middleware('permission:ppdb.registrations.view');

    Route::post('registrations/{registration}/verify', [RegistrationController::class, 'verify'])
        ->name('registrations.verify')
        ->middleware('permission:ppdb.registrations.verify');

    Route::put('registrations/{registration}/status', [RegistrationController::class, 'updateStatus'])
        ->name('registrations.update-status')
        ->middleware('permission:ppdb.registrations.edit');

    // Document Verification
    Route::get('documents', [DocumentVerificationController::class, 'index'])
        ->name('documents.index')
        ->middleware('permission:ppdb.documents.view');

    Route::post('documents/{document}/verify', [DocumentVerificationController::class, 'verify'])
        ->name('documents.verify')
        ->middleware('permission:ppdb.documents.verify');

    Route::post('documents/bulk-verify', [DocumentVerificationController::class, 'bulkVerify'])
        ->name('documents.bulk-verify')
        ->middleware('permission:ppdb.documents.verify');

    // Selection
    Route::get('selections', [SelectionController::class, 'index'])
        ->name('selections.index')
        ->middleware('permission:ppdb.selections.view');

    Route::get('selections/results', [SelectionController::class, 'results'])
        ->name('selections.results')
        ->middleware('permission:ppdb.selections.view');

    Route::post('selections/run', [SelectionController::class, 'run'])
        ->name('selections.run')
        ->middleware('permission:ppdb.selections.run');

    Route::put('selections/{selection}/status', [SelectionController::class, 'updateStatus'])
        ->name('selections.update-status')
        ->middleware('permission:ppdb.selections.edit');

    Route::post('selections/announce', [SelectionController::class, 'announce'])
        ->name('selections.announce')
        ->middleware('permission:ppdb.selections.announce');
});
