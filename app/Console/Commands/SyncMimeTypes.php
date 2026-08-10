<?php

namespace App\Console\Commands;

use App\Models\File;
use App\Support\MimeType;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class SyncMimeTypes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'uploads:sync-mimes {--dry-run : Toon wijzigingen zonder ze op te slaan}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Corrigeer mime types in de database op basis van de opgeslagen objecten';

    public function handle(): int
    {
        $updated = 0;

        foreach (File::query()->lazy() as $file) {
            if (! Storage::exists($file->path())) {
                continue;
            }

            $detected = MimeType::detect($file->path());

            if ($detected === $file->mime_type) {
                continue;
            }

            $this->line("{$file->name}: {$file->mime_type} -> {$detected}");

            if (! $this->option('dry-run')) {
                $file->mime_type = $detected;
                $file->save();
            }

            $updated++;
        }

        $this->info($this->option('dry-run') ? "{$updated} bestand(en) zouden aangepast worden." : "{$updated} bestand(en) aangepast.");

        return self::SUCCESS;
    }
}
