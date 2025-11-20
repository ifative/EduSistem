<?php

namespace App\Models\Ppdb;

use App\Models\Master\AcademicYear;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AdmissionPeriod extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'academic_year_id',
        'name',
        'description',
        'registration_start',
        'registration_end',
        'selection_date',
        'announcement_date',
        'enrollment_start',
        'enrollment_end',
        'quota',
        'status',
        'is_active',
    ];

    protected $casts = [
        'registration_start' => 'date',
        'registration_end' => 'date',
        'selection_date' => 'date',
        'announcement_date' => 'date',
        'enrollment_start' => 'date',
        'enrollment_end' => 'date',
        'is_active' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'status', 'is_active', 'quota'])
            ->logOnlyDirty();
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function paths(): HasMany
    {
        return $this->hasMany(AdmissionPath::class);
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }
}
