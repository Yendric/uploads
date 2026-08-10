<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_cannot_delete_files_of_others(): void
    {
        Storage::fake();
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $file = File::factory()->for($owner)->create();

        $this->actingAs($other)
            ->delete(route('file.destroy', $file->uuid))
            ->assertForbidden();

        $this->assertNotNull($file->fresh());
    }

    public function test_users_cannot_rename_files_of_others(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $file = File::factory()->for($owner)->create(['name' => 'original.jpg']);

        $this->actingAs($other)
            ->put(route('file.update', $file->uuid), ['name' => 'hijacked.jpg'])
            ->assertForbidden();

        $this->assertSame('original.jpg', $file->fresh()?->name);
    }

    public function test_guests_can_view_shared_files(): void
    {
        $file = File::factory()->create();

        $this->get(route('file.show', $file->uuid))->assertOk();
    }
}
