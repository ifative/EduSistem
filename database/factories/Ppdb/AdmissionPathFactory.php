<?php

namespace Database\Factories\Ppdb;

use App\Models\Ppdb\AdmissionPath;
use App\Models\Ppdb\AdmissionPeriod;
use Illuminate\Database\Eloquent\Factories\Factory;

class AdmissionPathFactory extends Factory
{
    protected $model = AdmissionPath::class;

    public function definition(): array
    {
        return [
            'admission_period_id' => AdmissionPeriod::factory(),
            'name' => $this->faker->words(3, true),
            'code' => strtoupper($this->faker->unique()->bothify('???-###')),
            'description' => $this->faker->sentence(),
            'type' => $this->faker->randomElement(['zonasi', 'prestasi', 'afirmasi', 'perpindahan', 'reguler']),
            'quota' => $this->faker->numberBetween(10, 50),
            'min_score' => $this->faker->optional()->randomFloat(2, 60, 80),
            'max_distance' => $this->faker->optional()->randomFloat(2, 1, 10),
            'requires_test' => $this->faker->boolean(30),
            'requires_documents' => true,
            'selection_criteria' => null,
            'sort_order' => $this->faker->numberBetween(1, 10),
            'is_active' => true,
        ];
    }
}
