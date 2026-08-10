<?php

namespace Database\Factories;

use App\Models\File;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<File>
 */
class FileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word().'.jpg',
            'mime_type' => 'image/jpeg',
            'size' => fake()->numberBetween(1_000, 5_000_000),
            'user_id' => User::factory(),
        ];
    }

    public function video(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => fake()->unique()->word().'.mp4',
            'mime_type' => 'video/mp4',
        ]);
    }

    public function text(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => fake()->unique()->word().'.txt',
            'mime_type' => 'text/plain',
        ]);
    }
}
