<?php

namespace App\Console\Commands;

use App\Models\File;
use Illuminate\Console\Command;
use Illuminate\Filesystem\AwsS3V3Adapter;
use Illuminate\Support\Facades\Storage;

class SyncObjectMimes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'uploads:sync-object-mimes {--dry-run : Toon wijzigingen zonder ze op te slaan}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Zet het Content-Type van de opgeslagen S3-objecten gelijk aan het mime type in de database';

    public function handle(): int
    {
        if (config('filesystems.default') !== 's3') {
            $this->warn('Objecten hebben alleen een Content-Type op de s3 disk, er valt niets te synchroniseren.');

            return self::SUCCESS;
        }

        $bucket = config('filesystems.disks.s3.bucket');

        if (! is_string($bucket) || $bucket === '') {
            $this->error('AWS_BUCKET is niet geconfigureerd.');

            return self::FAILURE;
        }

        /** @var AwsS3V3Adapter $disk */
        $disk = Storage::disk('s3');
        $client = $disk->getClient();

        $updated = 0;

        foreach (File::query()->lazy() as $file) {
            if (! Storage::exists($file->path())) {
                continue;
            }

            $stored = Storage::mimeType($file->path());

            if ($stored === $file->mime_type) {
                continue;
            }

            $this->line("{$file->name}: ".($stored !== false ? $stored : 'onbekend')." -> {$file->mime_type}");

            if (! $this->option('dry-run')) {
                // copy the object onto itself, only replacing its metadata
                $client->copyObject([
                    'Bucket' => $bucket,
                    'Key' => $file->path(),
                    'CopySource' => $bucket.'/'.implode('/', array_map('rawurlencode', explode('/', $file->path()))),
                    'ContentType' => $file->mime_type,
                    'MetadataDirective' => 'REPLACE',
                ]);
            }

            $updated++;
        }

        $this->info($this->option('dry-run') ? "{$updated} object(en) zouden aangepast worden." : "{$updated} object(en) aangepast.");

        return self::SUCCESS;
    }
}
