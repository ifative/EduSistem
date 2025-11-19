<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Subject extends Model
{
    use LogsActivity;

    protected $fillable = [
        'name',
        'code',
        'group',
        'credits',
    ];

    protected $casts = [
        'credits' => 'integer',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'code', 'group', 'credits'])
            ->logOnlyDirty();
    }

    public function classrooms(): BelongsToMany
    {
        return $this->belongsToMany(Classroom::class, 'classroom_subjects')
            ->withPivot('teacher_id')
            ->withTimestamps();
    }
}
