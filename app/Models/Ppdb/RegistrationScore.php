<?php

namespace App\Models\Ppdb;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RegistrationScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_id',
        'subject',
        'score',
        'type',
        'semester',
    ];

    protected $casts = [
        'score' => 'decimal:2',
    ];

    public function registration(): BelongsTo
    {
        return $this->belongsTo(Registration::class);
    }
}
