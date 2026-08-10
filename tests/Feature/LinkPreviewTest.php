<?php

namespace Tests\Feature;

use App\Models\File;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LinkPreviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_image_pages_have_open_graph_tags(): void
    {
        $file = File::factory()->create(['name' => 'photo.jpg']);

        $this->get(route('file.show', $file->uuid))
            ->assertOk()
            ->assertSee('property="og:title" content="photo.jpg"', false)
            ->assertSee('property="og:image"', false)
            ->assertSee('name="twitter:card" content="summary_large_image"', false);
    }

    public function test_video_pages_have_open_graph_video_tags(): void
    {
        $file = File::factory()->video()->create();

        $this->get(route('file.show', $file->uuid))
            ->assertOk()
            ->assertSee('property="og:video"', false)
            ->assertSee('content="video/mp4"', false);
    }

    public function test_other_file_pages_have_no_image_tags(): void
    {
        $file = File::factory()->text()->create();

        $this->get(route('file.show', $file->uuid))
            ->assertOk()
            ->assertSee('property="og:title"', false)
            ->assertDontSee('og:image', false);
    }
}
