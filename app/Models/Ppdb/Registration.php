<?php

namespace App\Models\Ppdb;

use App\Models\Master\Level;
use App\Models\Master\Major;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Registration extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'registration_number',
        'admission_period_id',
        'admission_path_id',
        'level_id',
        'major_id',
        'nisn',
        'nik',
        'name',
        'gender',
        'birth_place',
        'birth_date',
        'religion',
        'address',
        'village',
        'district',
        'city',
        'province',
        'postal_code',
        'phone',
        'email',
        'previous_school',
        'previous_school_address',
        'graduation_year',
        'father_name',
        'father_occupation',
        'father_phone',
        'mother_name',
        'mother_occupation',
        'mother_phone',
        'guardian_name',
        'guardian_phone',
        'latitude',
        'longitude',
        'distance',
        'status',
        'notes',
        'submitted_at',
        'verified_at',
        'verified_by',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'distance' => 'decimal:2',
        'submitted_at' => 'datetime',
        'verified_at' => 'datetime',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['registration_number', 'name', 'status'])
            ->logOnlyDirty();
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(AdmissionPeriod::class, 'admission_period_id');
    }

    public function path(): BelongsTo
    {
        return $this->belongsTo(AdmissionPath::class, 'admission_path_id');
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(RegistrationDocument::class);
    }

    public function scores(): HasMany
    {
        return $this->hasMany(RegistrationScore::class);
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(RegistrationAchievement::class);
    }

    public function selection(): HasOne
    {
        return $this->hasOne(Selection::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(AdmissionPayment::class);
    }

    public function scopeSubmitted($query)
    {
        return $query->where('status', 'submitted');
    }

    public function scopeVerified($query)
    {
        return $query->where('status', 'verified');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    public static function generateRegistrationNumber(int $periodId): string
    {
        $year = date('Y');
        $count = static::where('admission_period_id', $periodId)
            ->whereYear('created_at', $year)
            ->count() + 1;

        return sprintf('REG-%s-%04d', $year, $count);
    }
}
