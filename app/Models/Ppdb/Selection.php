<?php

namespace App\Models\Ppdb;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Selection extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'registration_id',
        'final_score',
        'rank',
        'status',
        'score_breakdown',
        'notes',
    ];

    protected $casts = [
        'final_score' => 'decimal:2',
        'score_breakdown' => 'array',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'rank', 'final_score'])
            ->logOnlyDirty();
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class);
    }

    public function scopePassed($query)
    {
        return $query->where('status', 'passed');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeReserve($query)
    {
        return $query->where('status', 'reserve');
    }
}
