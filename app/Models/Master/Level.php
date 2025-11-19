<?php

namespace App\Models\Master;

use Database\Factories\Master\LevelFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Level extends Model
{
    use HasFactory, LogsActivity;

    protected static function newFactory()
    {
        return LevelFactory::new();
    }

    protected $fillable = [
        'name',
        'code',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'code'])
            ->logOnlyDirty();
    }

    public function classrooms(): HasMany
    {
        return $this->hasMany(Classroom::class);
    }
}
