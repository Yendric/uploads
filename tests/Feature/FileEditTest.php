<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileEditTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_update_text_file_content(): void
    {
        Storage::fake();
        $user = User::factory()->create();
        $file = File::factory()->for($user)->text()->create(['name' => 'notes.txt']);
        Storage::put($file->path(), 'old content');

        $this->actingAs($user)
            ->put(route('file.update', $file->uuid), ['content' => 'new content'])
            ->assertRedirect()
            ->assertSessionHas('success');

        $this->assertSame('new content', Storage::get($file->path()));
        $this->assertSame(strlen('new content'), (int) $file->refresh()->size);
    }

    public function test_content_update_bumps_updated_at_for_same_size_content(): void
    {
        Storage::fake();
        $user = User::factory()->create();
        $file = File::factory()->for($user)->text()->create(['name' => 'notes.txt']);
        Storage::put($file->path(), 'aaaa');
        File::where('id', $file->id)->update(['updated_at' => now()->subDay()]);
        $before = $file->refresh()->updated_at;

        $this->actingAs($user)->put(route('file.update', $file->uuid), ['content' => 'bbbb']);

        $this->assertTrue($file->refresh()->updated_at?->greaterThan($before));
    }

    public function test_rename_and_content_update_write_to_new_path(): void
    {
        Storage::fake();
        $user = User::factory()->create();
        $file = File::factory()->for($user)->text()->create(['name' => 'old.txt']);
        Storage::put($file->path(), 'old content');

        $this->actingAs($user)->put(route('file.update', $file->uuid), [
            'name' => 'new.txt',
            'content' => 'new content',
        ]);

        $file->refresh();
        $this->assertSame('new.txt', $file->name);
        $this->assertSame('new content', Storage::get($file->path()));
        Storage::assertMissing($file->uuid.'/old.txt');
    }

    public function test_content_update_is_rejected_for_non_text_files(): void
    {
        Storage::fake();
        $user = User::factory()->create();
        $file = File::factory()->for($user)->create(['name' => 'photo.jpg']);
        Storage::put($file->path(), 'binary');

        $this->actingAs($user)
            ->put(route('file.update', $file->uuid), ['content' => 'overwritten'])
            ->assertSessionHas('error');

        $this->assertSame('binary', Storage::get($file->path()));
    }

    public function test_content_update_requires_ownership(): void
    {
        Storage::fake();
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $file = File::factory()->for($owner)->text()->create(['name' => 'notes.txt']);
        Storage::put($file->path(), 'old content');

        $this->actingAs($other)
            ->put(route('file.update', $file->uuid), ['content' => 'hacked'])
            ->assertForbidden();

        $this->assertSame('old content', Storage::get($file->path()));
    }
}
