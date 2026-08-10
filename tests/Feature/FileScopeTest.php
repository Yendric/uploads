<?php

namespace Tests\Feature;

use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FileScopeTest extends TestCase
{
    use RefreshDatabase;

    public function test_media_scope_does_not_leak_other_users_files(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $image = File::factory()->for($userA)->create();
        File::factory()->for($userA)->text()->create();
        File::factory()->for($userB)->create();
        File::factory()->for($userB)->video()->create();

        $media = $userA->files()->mediaFiles()->get();

        $this->assertCount(1, $media);
        $this->assertTrue($media->first()?->is($image));
    }

    public function test_code_scope_does_not_leak_other_users_files(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $text = File::factory()->for($userA)->text()->create();
        File::factory()->for($userA)->create();
        File::factory()->for($userB)->text()->create();

        $code = $userA->files()->codeFiles()->get();

        $this->assertCount(1, $code);
        $this->assertTrue($code->first()?->is($text));
    }

    public function test_media_page_only_shows_own_files(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        File::factory()->for($userA)->create(['name' => 'mine.jpg']);
        File::factory()->for($userB)->video()->create(['name' => 'theirs.mp4']);

        $this->actingAs($userA)
            ->get(route('media'))
            ->assertOk()
            ->assertSee('mine.jpg')
            ->assertDontSee('theirs.mp4');
    }
}
