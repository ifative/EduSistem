<?php

namespace Database\Factories\Master;

use App\Models\Master\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition(): array
    {
        return [
            'nis' => $this->faker->unique()->numerify('######'),
            'nisn' => $this->faker->unique()->numerify('##########'),
            'name' => $this->faker->name(),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'birth_place' => $this->faker->city(),
            'birth_date' => $this->faker->date('Y-m-d', '-10 years'),
            'religion' => $this->faker->randomElement(['Islam', 'Christian', 'Catholic', 'Hindu', 'Buddhist']),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'parent_name' => $this->faker->name(),
            'parent_phone' => $this->faker->phoneNumber(),
            'parent_email' => $this->faker->email(),
            'entry_year' => $this->faker->year(),
            'previous_school' => $this->faker->company() . ' School',
            'status' => 'active',
        ];
    }
}
