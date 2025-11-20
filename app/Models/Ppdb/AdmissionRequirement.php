<?php

namespace App\Models\Ppdb;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AdmissionRequirement extends Model
{
    use HasFactory;

    protected $fillable = [
        'admission_path_id',
        'name',
        'description',
        'type',
        'is_required',
        'file_types',
        'max_file_size',
        'sort_order',
    ];

    protected $casts = [
        'is_required' => 'boolean',
    ];

    public function path(): BelongsTo
    {
        return $this->belongsTo(AdmissionPath::class, 'admission_path_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(RegistrationDocument::class, 'requirement_id');
    }
}
