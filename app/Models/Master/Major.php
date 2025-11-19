<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Major extends Model
{
    use LogsActivity;

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
