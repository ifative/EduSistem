<?php

use App\Http\Controllers\Admin\Master\AcademicYearController;
use App\Http\Controllers\Admin\Master\ClassroomController;
use App\Http\Controllers\Admin\Master\LevelController;
use App\Http\Controllers\Admin\Master\MajorController;
use App\Http\Controllers\Admin\Master\StudentController;
use App\Http\Controllers\Admin\Master\SubjectController;
use App\Http\Controllers\Admin\Master\TeacherController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin/master')->name('admin.master.')->group(function () {
    // Academic Years
    Route::get('academic-years', [AcademicYearController::class, 'index'])
        ->name('academic-years.index')
        ->middleware('permission:master.academic-years.view');
    Route::get('academic-years/create', [AcademicYearController::class, 'create'])
        ->name('academic-years.create')
        ->middleware('permission:master.academic-years.create');
    Route::post('academic-years', [AcademicYearController::class, 'store'])
        ->name('academic-years.store')
        ->middleware('permission:master.academic-years.create');
    Route::get('academic-years/{academicYear}/edit', [AcademicYearController::class, 'edit'])
        ->name('academic-years.edit')
        ->middleware('permission:master.academic-years.edit');
    Route::put('academic-years/{academicYear}', [AcademicYearController::class, 'update'])
        ->name('academic-years.update')
        ->middleware('permission:master.academic-years.edit');
    Route::delete('academic-years/{academicYear}', [AcademicYearController::class, 'destroy'])
        ->name('academic-years.destroy')
        ->middleware('permission:master.academic-years.delete');
    Route::post('academic-years/{academicYear}/activate', [AcademicYearController::class, 'activate'])
        ->name('academic-years.activate')
        ->middleware('permission:master.academic-years.edit');

    // Levels
    Route::get('levels', [LevelController::class, 'index'])
        ->name('levels.index')
        ->middleware('permission:master.levels.view');
    Route::get('levels/create', [LevelController::class, 'create'])
        ->name('levels.create')
        ->middleware('permission:master.levels.create');
    Route::post('levels', [LevelController::class, 'store'])
        ->name('levels.store')
        ->middleware('permission:master.levels.create');
    Route::get('levels/{level}/edit', [LevelController::class, 'edit'])
        ->name('levels.edit')
        ->middleware('permission:master.levels.edit');
    Route::put('levels/{level}', [LevelController::class, 'update'])
        ->name('levels.update')
        ->middleware('permission:master.levels.edit');
    Route::delete('levels/{level}', [LevelController::class, 'destroy'])
        ->name('levels.destroy')
        ->middleware('permission:master.levels.delete');

    // Majors
    Route::get('majors', [MajorController::class, 'index'])
        ->name('majors.index')
        ->middleware('permission:master.majors.view');
    Route::get('majors/create', [MajorController::class, 'create'])
        ->name('majors.create')
        ->middleware('permission:master.majors.create');
    Route::post('majors', [MajorController::class, 'store'])
        ->name('majors.store')
        ->middleware('permission:master.majors.create');
    Route::get('majors/{major}/edit', [MajorController::class, 'edit'])
        ->name('majors.edit')
        ->middleware('permission:master.majors.edit');
    Route::put('majors/{major}', [MajorController::class, 'update'])
        ->name('majors.update')
        ->middleware('permission:master.majors.edit');
    Route::delete('majors/{major}', [MajorController::class, 'destroy'])
        ->name('majors.destroy')
        ->middleware('permission:master.majors.delete');

    // Subjects
    Route::get('subjects', [SubjectController::class, 'index'])
        ->name('subjects.index')
        ->middleware('permission:master.subjects.view');
    Route::get('subjects/create', [SubjectController::class, 'create'])
        ->name('subjects.create')
        ->middleware('permission:master.subjects.create');
    Route::post('subjects', [SubjectController::class, 'store'])
        ->name('subjects.store')
        ->middleware('permission:master.subjects.create');
    Route::get('subjects/{subject}/edit', [SubjectController::class, 'edit'])
        ->name('subjects.edit')
        ->middleware('permission:master.subjects.edit');
    Route::put('subjects/{subject}', [SubjectController::class, 'update'])
        ->name('subjects.update')
        ->middleware('permission:master.subjects.edit');
    Route::delete('subjects/{subject}', [SubjectController::class, 'destroy'])
        ->name('subjects.destroy')
        ->middleware('permission:master.subjects.delete');

    // Students
    Route::get('students', [StudentController::class, 'index'])
        ->name('students.index')
        ->middleware('permission:master.students.view');
    Route::get('students/create', [StudentController::class, 'create'])
        ->name('students.create')
        ->middleware('permission:master.students.create');
    Route::post('students', [StudentController::class, 'store'])
        ->name('students.store')
        ->middleware('permission:master.students.create');
    Route::get('students/export', [StudentController::class, 'export'])
        ->name('students.export')
        ->middleware('permission:master.students.view');
    Route::get('students/{student}', [StudentController::class, 'show'])
        ->name('students.show')
        ->middleware('permission:master.students.view');
    Route::get('students/{student}/edit', [StudentController::class, 'edit'])
        ->name('students.edit')
        ->middleware('permission:master.students.edit');
    Route::put('students/{student}', [StudentController::class, 'update'])
        ->name('students.update')
        ->middleware('permission:master.students.edit');
    Route::delete('students/{student}', [StudentController::class, 'destroy'])
        ->name('students.destroy')
        ->middleware('permission:master.students.delete');

    // Teachers
    Route::get('teachers', [TeacherController::class, 'index'])
        ->name('teachers.index')
        ->middleware('permission:master.teachers.view');
    Route::get('teachers/create', [TeacherController::class, 'create'])
        ->name('teachers.create')
        ->middleware('permission:master.teachers.create');
    Route::post('teachers', [TeacherController::class, 'store'])
        ->name('teachers.store')
        ->middleware('permission:master.teachers.create');
    Route::get('teachers/{teacher}', [TeacherController::class, 'show'])
        ->name('teachers.show')
        ->middleware('permission:master.teachers.view');
    Route::get('teachers/{teacher}/edit', [TeacherController::class, 'edit'])
        ->name('teachers.edit')
        ->middleware('permission:master.teachers.edit');
    Route::put('teachers/{teacher}', [TeacherController::class, 'update'])
        ->name('teachers.update')
        ->middleware('permission:master.teachers.edit');
    Route::delete('teachers/{teacher}', [TeacherController::class, 'destroy'])
        ->name('teachers.destroy')
        ->middleware('permission:master.teachers.delete');

    // Classrooms
    Route::get('classrooms', [ClassroomController::class, 'index'])
        ->name('classrooms.index')
        ->middleware('permission:master.classrooms.view');
    Route::get('classrooms/create', [ClassroomController::class, 'create'])
        ->name('classrooms.create')
        ->middleware('permission:master.classrooms.create');
    Route::post('classrooms', [ClassroomController::class, 'store'])
        ->name('classrooms.store')
        ->middleware('permission:master.classrooms.create');
    Route::get('classrooms/{classroom}', [ClassroomController::class, 'show'])
        ->name('classrooms.show')
        ->middleware('permission:master.classrooms.view');
    Route::get('classrooms/{classroom}/edit', [ClassroomController::class, 'edit'])
        ->name('classrooms.edit')
        ->middleware('permission:master.classrooms.edit');
    Route::put('classrooms/{classroom}', [ClassroomController::class, 'update'])
        ->name('classrooms.update')
        ->middleware('permission:master.classrooms.edit');
    Route::delete('classrooms/{classroom}', [ClassroomController::class, 'destroy'])
        ->name('classrooms.destroy')
        ->middleware('permission:master.classrooms.delete');
    Route::post('classrooms/{classroom}/enroll', [ClassroomController::class, 'enrollStudents'])
        ->name('classrooms.enroll')
        ->middleware('permission:master.classrooms.edit');
    Route::delete('classrooms/{classroom}/students/{student}', [ClassroomController::class, 'removeStudent'])
        ->name('classrooms.remove-student')
        ->middleware('permission:master.classrooms.edit');
});
