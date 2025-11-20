<?php

namespace Database\Factories\Ppdb;

use App\Models\Ppdb\Registration;
use App\Models\Ppdb\Selection;
use Illuminate\Database\Eloquent\Factories\Factory;

class SelectionFactory extends Factory
{
    protected $model = Selection::class;

    public function definition(): array
    {
        return [
            'registration_id' => Registration::factory(),
            'final_score' => $this->faker->randomFloat(2, 50, 100),
            'rank' => $this->faker->numberBetween(1, 100),
            'status' => $this->faker->randomElement(['pending', 'passed', 'failed', 'reserve']),
            'score_breakdown' => [
                'academic_score' => $this->faker->randomFloat(2, 60, 100),
                'age_score' => $this->faker->randomFloat(2, 0, 10),
            ],
            'notes' => $this->faker->optional()->sentence(),
        ];
    }

    public function passed(): static
    {
        return $this->state(fn () => [
            'status' => 'passed',
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn () => [
            'status' => 'failed',
        ]);
    }
}
