<?php

namespace Database\Factories\Master;

use App\Models\Master\Extracurricular;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExtracurricularFactory extends Factory
{
    protected $model = Extracurricular::class;

    public function definition(): array
    {
        $activities = [
            'Basketball Club',
            'Football Club',
            'Music Club',
            'Art Club',
            'Science Club',
            'Drama Club',
            'Debate Club',
            'Photography Club',
            'Dance Club',
            'Chess Club',
        ];

        return [
            'name' => $this->faker->unique()->randomElement($activities),
            'description' => $this->faker->sentence(),
            'instructor_id' => null,
        ];
    }
}
