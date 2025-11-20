<?php

namespace App\Models\Ppdb;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegistrationAchievement extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_id',
        'name',
        'type',
        'level',
        'rank',
        'year',
        'organizer',
        'certificate_path',
        'points',
    ];

    protected $casts = [
        'points' => 'decimal:2',
    ];

    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class);
    }

    /**
     * Calculate points based on level and rank
     */
    public static function calculatePoints(string $level, string $rank): float
    {
        $levelPoints = [
            'international' => 100,
            'national' => 80,
            'province' => 60,
            'city' => 40,
            'district' => 20,
            'school' => 10,
        ];

        $rankMultiplier = [
            'first' => 1.0,
            'second' => 0.8,
            'third' => 0.6,
            'finalist' => 0.4,
            'participant' => 0.2,
        ];

        $basePoints = $levelPoints[$level] ?? 10;
        $multiplier = $rankMultiplier[$rank] ?? 0.2;

        return $basePoints * $multiplier;
    }
}
