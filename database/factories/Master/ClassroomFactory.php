<?php

namespace Database\Factories\Master;

use App\Models\Master\Classroom;
use App\Models\Master\Level;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClassroomFactory extends Factory
{
    protected $model = Classroom::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->numerify('Class ###'),
            'code' => $this->faker->unique()->lexify('???-###'),
            'level_id' => Level::factory(),
            'capacity' => $this->faker->numberBetween(25, 40),
        ];
    }
}
