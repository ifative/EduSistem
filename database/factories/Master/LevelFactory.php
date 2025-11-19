<?php

namespace Database\Factories\Master;

use App\Models\Master\Level;
use Illuminate\Database\Eloquent\Factories\Factory;

class LevelFactory extends Factory
{
    protected $model = Level::class;

    public function definition(): array
    {
        $grades = ['X', 'XI', 'XII'];
        $grade = $this->faker->randomElement($grades);

        return [
            'name' => "Grade {$grade}",
            'code' => $grade,
        ];
    }
}
