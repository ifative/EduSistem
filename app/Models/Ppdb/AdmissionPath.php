<?php

namespace App\Models\Ppdb;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class AdmissionPath extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'admission_period_id',
        'name',
        'code',
        'description',
        'type',
        'quota',
        'min_score',
        'max_distance',
        'requires_test',
        'requires_documents',
        'selection_criteria',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'min_score' => 'decimal:2',
        'max_distance' => 'decimal:2',
        'requires_test' => 'boolean',
        'requires_documents' => 'boolean',
        'selection_criteria' => 'array',
        'is_active' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'code', 'type', 'quota', 'is_active'])
            ->logOnlyDirty();
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(AdmissionPeriod::class, 'admission_period_id');
    }

    public function requirements(): HasMany
    {
        return $this->hasMany(AdmissionRequirement::class)->orderBy('sort_order');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
