<?php

namespace Database\Factories\Master;

use App\Models\Master\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeacherFactory extends Factory
{
    protected $model = Teacher::class;

    public function definition(): array
    {
        return [
            'nip' => $this->faker->unique()->numerify('##################'),
            'nuptk' => $this->faker->unique()->numerify('################'),
            'name' => $this->faker->name(),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'position' => $this->faker->randomElement(['Teacher', 'Senior Teacher', 'Head Teacher']),
            'status' => 'active',
        ];
    }
}
