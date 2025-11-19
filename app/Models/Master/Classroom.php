<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Classroom extends Model
{
    use LogsActivity;

    protected $fillable = [
        'name',
        'code',
        'level_id',
        'major_id',
        'capacity',
        'homeroom_teacher_id',
    ];

    protected $casts = [
        'capacity' => 'integer',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'code', 'level_id', 'major_id', 'capacity', 'homeroom_teacher_id'])
            ->logOnlyDirty();
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class);
    }

    public function homeroomTeacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'homeroom_teacher_id');
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'classroom_students')
            ->withPivot(['academic_year_id', 'semester_id'])
            ->withTimestamps();
    }

    public function subjects(): BelongsToMany
    {
        return $this->belongsToMany(Subject::class, 'classroom_subjects')
            ->withPivot('teacher_id')
            ->withTimestamps();
    }

    public function currentStudents()
    {
        $activeSemester = Semester::getActive();
        if (!$activeSemester) {
            return $this->students()->whereRaw('1 = 0');
        }

        return $this->students()
            ->wherePivot('semester_id', $activeSemester->id);
    }

    public function getStudentCountAttribute(): int
    {
        return $this->currentStudents()->count();
    }
}
