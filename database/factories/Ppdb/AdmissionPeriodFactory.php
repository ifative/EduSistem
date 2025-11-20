<?php

namespace Database\Factories\Ppdb;

use App\Models\Master\AcademicYear;
use App\Models\Ppdb\AdmissionPeriod;
use Illuminate\Database\Eloquent\Factories\Factory;

class AdmissionPeriodFactory extends Factory
{
    protected $model = AdmissionPeriod::class;

    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('+1 week', '+1 month');
        $endDate = $this->faker->dateTimeBetween($startDate, '+2 months');

        return [
            'academic_year_id' => AcademicYear::factory(),
            'name' => 'PPDB ' . $this->faker->year(),
            'description' => $this->faker->sentence(),
            'registration_start' => $startDate,
            'registration_end' => $endDate,
            'selection_date' => $this->faker->dateTimeBetween($endDate, '+3 months'),
            'announcement_date' => $this->faker->dateTimeBetween('+3 months', '+4 months'),
            'quota' => $this->faker->numberBetween(50, 200),
            'status' => $this->faker->randomElement(['draft', 'open', 'closed']),
            'is_active' => $this->faker->boolean(30),
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => [
            'is_active' => true,
            'status' => 'open',
        ]);
    }
}
