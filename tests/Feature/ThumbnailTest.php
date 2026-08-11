<?php

namespace Tests\Feature;

use App\Jobs\GenerateThumbnail;
use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Gif\Builder;
use Tests\TestCase;

class ThumbnailTest extends TestCase
{
    use RefreshDatabase;

    private function pngContents(int $width, int $height): string
    {
        $image = imagecreatetruecolor($width, $height);
        ob_start();
        imagepng($image);

        return (string) ob_get_clean();
    }

    private function mp4Contents(float $duration): string
    {
        $ffmpeg = config()->string('services.ffmpeg.path');

        if (Process::run(['which', $ffmpeg])->failed()) {
            $this->markTestSkipped('ffmpeg is not installed');
        }

        $tmp = (string) tempnam(sys_get_temp_dir(), 'thumbtest');

        // mpeg4 is built into every ffmpeg, unlike libx264
        Process::run([
            $ffmpeg, '-y', '-v', 'error',
            '-f', 'lavfi', '-i', "testsrc=duration=$duration:size=320x240:rate=10",
            '-c:v', 'mpeg4', '-f', 'mp4', $tmp,
        ])->throw();

        $contents = (string) file_get_contents($tmp);
        unlink($tmp);

        return $contents;
    }

    public function test_completing_an_image_upload_generates_a_thumbnail(): void
    {
        Storage::fake();
        $user = User::factory()->create();
        $uuid = Str::uuid()->toString();
        Storage::put('tmp/'.$uuid, $this->pngContents(1600, 800));

        $this->actingAs($user)->post(route('file.complete'), [
            'uuid' => $uuid,
            'name' => 'photo.png',
            'mime' => 'image/png',
        ]);

        $file = $user->files()->firstOrFail();
        $this->assertTrue($file->refresh()->has_thumbnail);
        Storage::assertExists($file->thumbnailPath());

        // scaled down to at most 640px on the longest side, aspect ratio kept
        $size = getimagesizefromstring((string) Storage::get($file->thumbnailPath()));
        $this->assertSame([640, 320], [$size[0] ?? null, $size[1] ?? null]);
    }

    public function test_videos_get_a_poster_frame_thumbnail(): void
    {
        Storage::fake();
        $video = File::factory()->video()->create();
        Storage::put($video->path(), $this->mp4Contents(2));

        (new GenerateThumbnail($video))->handle();

        $this->assertTrue($video->refresh()->has_thumbnail);
        $size = getimagesizefromstring((string) Storage::get($video->thumbnailPath()));
        // scaleDown never upscales, so the 320x240 source keeps its size
        $this->assertSame([320, 240, 'image/webp'], [$size[0] ?? null, $size[1] ?? null, $size['mime'] ?? null]);
    }

    public function test_videos_shorter_than_the_seek_offset_still_get_a_thumbnail(): void
    {
        Storage::fake();
        $video = File::factory()->video()->create();
        Storage::put($video->path(), $this->mp4Contents(0.5));

        (new GenerateThumbnail($video))->handle();

        $this->assertTrue($video->refresh()->has_thumbnail);
        Storage::assertExists($video->thumbnailPath());
    }

    public function test_animated_gifs_get_a_first_frame_thumbnail(): void
    {
        Storage::fake();
        $gd = imagecreatetruecolor(50, 50);
        ob_start();
        imagegif($gd);
        $frame = (string) ob_get_clean();

        $builder = Builder::canvas(50, 50);
        foreach (range(1, 3) as $i) {
            $builder->addFrame($frame, 0.1);
        }

        $file = File::factory()->create(['name' => 'anim.gif', 'mime_type' => 'image/gif']);
        Storage::put($file->path(), $builder->encode());

        (new GenerateThumbnail($file))->handle();

        $this->assertTrue($file->refresh()->has_thumbnail);
        Storage::assertExists($file->thumbnailPath());
    }

    public function test_images_too_large_to_decode_safely_are_skipped(): void
    {
        Storage::fake();
        // a tiny png whose header claims 20000x20000 (~2GB once decoded by gd)
        $png = substr_replace($this->pngContents(1, 1), pack('N2', 20000, 20000), 16, 8);

        $file = File::factory()->create(['name' => 'bomb.png', 'mime_type' => 'image/png']);
        Storage::put($file->path(), $png);

        (new GenerateThumbnail($file))->handle();

        $this->assertFalse($file->refresh()->has_thumbnail);
        Storage::assertMissing($file->thumbnailPath());
    }

    public function test_non_images_and_broken_images_get_no_thumbnail(): void
    {
        Storage::fake();
        $text = File::factory()->text()->create();
        Storage::put($text->path(), 'hello');

        $broken = File::factory()->create();
        Storage::put($broken->path(), 'not really an image');

        (new GenerateThumbnail($text))->handle();
        (new GenerateThumbnail($broken))->handle();

        $this->assertFalse($text->refresh()->has_thumbnail);
        $this->assertFalse($broken->refresh()->has_thumbnail);
        Storage::assertMissing($text->thumbnailPath());
        Storage::assertMissing($broken->thumbnailPath());
    }

    public function test_deleting_a_file_also_deletes_its_thumbnail(): void
    {
        Storage::fake();
        $file = File::factory()->create();
        Storage::put($file->path(), $this->pngContents(100, 100));
        (new GenerateThumbnail($file))->handle();
        Storage::assertExists($file->thumbnailPath());

        $file->delete();

        Storage::assertMissing($file->path());
        Storage::assertMissing($file->thumbnailPath());
    }

    public function test_backfill_command_generates_missing_thumbnails(): void
    {
        Storage::fake();
        $image = File::factory()->create();
        Storage::put($image->path(), $this->pngContents(100, 100));

        $text = File::factory()->text()->create();
        Storage::put($text->path(), 'hello');

        $this->artisan('uploads:generate-thumbnails')->assertSuccessful();

        $this->assertTrue($image->refresh()->has_thumbnail);
        Storage::assertExists($image->thumbnailPath());
        Storage::assertMissing($text->thumbnailPath());
    }
}
