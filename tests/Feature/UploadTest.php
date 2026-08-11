<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class UploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_complete_upload_creates_record_and_moves_object(): void
    {
        Storage::fake();
        $user = User::factory()->create();
        $uuid = Str::uuid()->toString();
        Storage::put('tmp/'.$uuid, 'file contents');

        $response = $this->actingAs($user)->post(route('file.complete'), [
            'uuid' => $uuid,
            'name' => 'photo.jpg',
            'mime' => 'image/jpeg',
        ]);

        $file = $user->files()->first();
        $this->assertNotNull($file);
        $response->assertRedirect(route('file.show', $file->uuid));
        $this->assertSame('photo.jpg', $file->name);
        $this->assertSame('image/jpeg', $file->mime_type);
        $this->assertSame(strlen('file contents'), (int) $file->size);
        Storage::assertExists($file->uuid.'/photo.jpg');
        Storage::assertMissing('tmp/'.$uuid);
    }

    public function test_complete_upload_rejects_non_uuid_keys(): void
    {
        Storage::fake();
        $user = User::factory()->create();
        Storage::put('secret/target', 'contents');

        $this->actingAs($user)
            ->from('/')
            ->post(route('file.complete'), [
                'uuid' => '../secret/target',
                'name' => 'stolen.txt',
            ])
            ->assertSessionHasErrors('uuid');

        $this->assertSame(0, $user->files()->count());
    }

    public function test_complete_upload_rejects_names_with_path_segments(): void
    {
        Storage::fake();
        $user = User::factory()->create();
        $uuid = Str::uuid()->toString();
        Storage::put('tmp/'.$uuid, 'contents');

        foreach (['../evil.jpg', 'a/b.jpg', '..'] as $name) {
            $this->actingAs($user)
                ->from('/')
                ->post(route('file.complete'), [
                    'uuid' => $uuid,
                    'name' => $name,
                ])
                ->assertSessionHasErrors('name');
        }

        $this->assertSame(0, $user->files()->count());
    }

    public function test_unknown_mime_falls_back_to_detected_type(): void
    {
        Storage::fake();
        $user = User::factory()->create();
        $uuid = Str::uuid()->toString();
        Storage::put('tmp/'.$uuid, "\x00\x01\x02\x03binary");

        $this->actingAs($user)->post(route('file.complete'), [
            'uuid' => $uuid,
            'name' => 'unixbinary',
        ]);

        $file = $user->files()->first();
        $this->assertNotNull($file);
        $this->assertSame('application/octet-stream', $file->mime_type);
    }

    public function test_extensionless_text_files_are_detected_as_text(): void
    {
        Storage::fake();
        $user = User::factory()->create();
        $uuid = Str::uuid()->toString();
        Storage::put('tmp/'.$uuid, "all:\n\techo 'building'\n\nclean:\n\trm -rf dist\n");

        $this->actingAs($user)->post(route('file.complete'), [
            'uuid' => $uuid,
            'name' => 'Makefile',
        ]);

        $file = $user->files()->first();
        $this->assertNotNull($file);
        $this->assertStringContainsString('text', $file->mime_type);
    }

    public function test_complete_upload_returns_json_for_batch_uploads(): void
    {
        Storage::fake();
        $user = User::factory()->create();
        $uuid = Str::uuid()->toString();
        Storage::put('tmp/'.$uuid, 'file contents');

        $response = $this->actingAs($user)->postJson(route('file.complete'), [
            'uuid' => $uuid,
            'name' => 'photo.jpg',
            'mime' => 'image/jpeg',
        ]);

        $file = $user->files()->first();
        $this->assertNotNull($file);
        $response->assertOk()->assertJson(['uuid' => (string) $file->uuid]);
        Storage::assertExists($file->uuid.'/photo.jpg');
    }

    public function test_complete_upload_returns_json_error_for_missing_upload(): void
    {
        Storage::fake();
        $user = User::factory()->create();

        $this->actingAs($user)->postJson(route('file.complete'), [
            'uuid' => Str::uuid()->toString(),
            'name' => 'photo.jpg',
        ])->assertStatus(422);

        $this->assertSame(0, $user->files()->count());
    }

    public function test_presign_requires_authentication(): void
    {
        $this->post(route('file.presign'))->assertRedirect(route('login'));
    }

    public function test_deleting_a_file_removes_the_stored_object(): void
    {
        Storage::fake();
        $user = User::factory()->create();
        $file = File::factory()->for($user)->create(['name' => 'photo.jpg']);
        Storage::put($file->path(), 'contents');

        $this->actingAs($user)
            ->delete(route('file.destroy', $file->uuid))
            ->assertRedirect();

        Storage::assertMissing($file->path());
        $this->assertNull($file->fresh());
    }

    public function test_clean_tmp_command_only_deletes_old_uploads(): void
    {
        Storage::fake();
        Storage::put('tmp/old', 'x');
        Storage::put('tmp/new', 'y');
        touch(Storage::path('tmp/old'), now()->subHours(48)->getTimestamp());

        $this->artisan('uploads:clean-tmp')->assertSuccessful();

        Storage::assertMissing('tmp/old');
        Storage::assertExists('tmp/new');
    }
}
