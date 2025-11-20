<?php

namespace Database\Factories\Ppdb;

use App\Models\Ppdb\AdmissionPath;
use App\Models\Ppdb\AdmissionPeriod;
use App\Models\Ppdb\Registration;
use Illuminate\Database\Eloquent\Factories\Factory;

class RegistrationFactory extends Factory
{
    protected $model = Registration::class;

    public function definition(): array
    {
        return [
            'registration_number' => 'REG-' . date('Y') . '-' . str_pad($this->faker->unique()->numberBetween(1, 9999), 4, '0', STR_PAD_LEFT),
            'admission_period_id' => AdmissionPeriod::factory(),
            'admission_path_id' => AdmissionPath::factory(),
            'nisn' => $this->faker->numerify('##########'),
            'nik' => $this->faker->numerify('################'),
            'name' => $this->faker->name(),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'birth_place' => $this->faker->city(),
            'birth_date' => $this->faker->dateTimeBetween('-18 years', '-12 years'),
            'religion' => $this->faker->randomElement(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha']),
            'address' => $this->faker->address(),
            'village' => $this->faker->word(),
            'district' => $this->faker->word(),
            'city' => $this->faker->city(),
            'province' => $this->faker->state(),
            'postal_code' => $this->faker->postcode(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->safeEmail(),
            'previous_school' => $this->faker->company() . ' School',
            'previous_school_address' => $this->faker->address(),
            'graduation_year' => date('Y'),
            'father_name' => $this->faker->name('male'),
            'father_occupation' => $this->faker->jobTitle(),
            'father_phone' => $this->faker->phoneNumber(),
            'mother_name' => $this->faker->name('female'),
            'mother_occupation' => $this->faker->jobTitle(),
            'mother_phone' => $this->faker->phoneNumber(),
            'latitude' => $this->faker->latitude(-8, -6),
            'longitude' => $this->faker->longitude(106, 108),
            'distance' => $this->faker->randomFloat(2, 0.5, 15),
            'status' => 'draft',
        ];
    }

    public function submitted(): static
    {
        return $this->state(fn () => [
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);
    }

    public function verified(): static
    {
        return $this->state(fn () => [
            'status' => 'verified',
            'submitted_at' => now()->subDay(),
            'verified_at' => now(),
        ]);
    }
}
