<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AcademicYear extends Model
{
    use LogsActivity;

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'start_date', 'end_date', 'is_active'])
            ->logOnlyDirty();
    }

    public function semesters(): HasMany
    {
        return $this->hasMany(Semester::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public static function getActive(): ?self
    {
        return static::active()->first();
    }
}
