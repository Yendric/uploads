<?php

namespace App\Jobs;

use App\Enums\FileType;
use App\Models\File;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;

class GenerateThumbnail
{
    use Dispatchable;

    private const int MAX_DIMENSION = 640;

    // gd needs ~5 bytes per pixel to decode, which has to fit in memory_limit
    private const int MAX_PIXELS = 30_000_000;

    public function __construct(private readonly File $file) {}

    public function handle(): void
    {
        $file = $this->file;

        if (! in_array($file->type(), [FileType::Image, FileType::Video], true)
            || str_contains($file->mime_type, 'svg')) {
            return;
        }

        try {
            $frame = $file->type() === FileType::Video
                ? $this->videoFrame($file)
                : Storage::get($file->path()) ?? '';

            $size = getimagesizefromstring($frame);
            if ($size === false || $size[0] * $size[1] > self::MAX_PIXELS) {
                return;
            }

            // animated gifs are split into frames otherwise, all held in memory
            $thumbnail = (new ImageManager(GdDriver::class, decodeAnimation: false))
                ->decodeBinary($frame)
                ->scaleDown(self::MAX_DIMENSION, self::MAX_DIMENSION)
                ->encode(new WebpEncoder(quality: 75));

            Storage::put($file->thumbnailPath(), $thumbnail->toString(), [
                'ContentType' => 'image/webp',
            ]);
        } catch (\Throwable $e) {
            report($e);

            return;
        }

        $file->has_thumbnail = true;
        $file->save();
    }

    /**
     * Extract a poster frame as png. ffmpeg reads s3 over http with range
     * requests, so large videos are never downloaded in full.
     */
    private function videoFrame(File $file): string
    {
        $source = config('filesystems.default') === 's3'
            ? Storage::temporaryUrl($file->path(), now()->addMinutes(5))
            : Storage::path($file->path());

        // videos shorter than a second have no frame at -ss 1
        $error = '';
        foreach ([1, 0] as $offset) {
            $result = Process::timeout(60)->run([
                config()->string('services.ffmpeg.path'),
                '-nostdin', '-v', 'error',
                '-ss', (string) $offset, '-i', $source,
                '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-',
            ]);

            if ($result->successful() && $result->output() !== '') {
                return $result->output();
            }

            $error = $result->errorOutput();
        }

        throw new \RuntimeException('ffmpeg could not extract a frame: '.$error);
    }
}
