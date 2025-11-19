<?php

namespace App\Models\Master;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Student extends Model implements HasMedia
{
    use LogsActivity, InteractsWithMedia;

    protected $fillable = [
        'user_id',
        'nis',
        'nisn',
        'name',
        'gender',
        'birth_place',
        'birth_date',
        'religion',
        'phone',
        'address',
        'photo',
        'parent_name',
        'parent_phone',
        'parent_email',
        'entry_year',
        'previous_school',
        'status',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'entry_year' => 'integer',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['nis', 'nisn', 'name', 'status'])
            ->logOnlyDirty();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('photo')
            ->singleFile();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function classrooms(): BelongsToMany
    {
        return $this->belongsToMany(Classroom::class, 'classroom_students')
            ->withPivot(['academic_year_id', 'semester_id'])
            ->withTimestamps();
    }

    public function currentClassroom()
    {
        $activeSemester = Semester::getActive();
        if (!$activeSemester) {
            return null;
        }

        return $this->classrooms()
            ->wherePivot('semester_id', $activeSemester->id)
            ->first();
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
