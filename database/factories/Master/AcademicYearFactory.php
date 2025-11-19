<?php

namespace Database\Factories\Master;

use App\Models\Master\AcademicYear;
use Illuminate\Database\Eloquent\Factories\Factory;

class AcademicYearFactory extends Factory
{
    protected $model = AcademicYear::class;

    public function definition(): array
    {
        $year = $this->faker->year();
        $nextYear = $year + 1;

        return [
            'name' => "{$year}/{$nextYear}",
            'start_date' => "{$year}-07-01",
            'end_date' => "{$nextYear}-06-30",
            'is_active' => false,
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }
}
