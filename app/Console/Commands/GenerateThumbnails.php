<?php

namespace App\Console\Commands;

use App\Jobs\GenerateThumbnail;
use App\Models\File;
use Illuminate\Console\Command;

class GenerateThumbnails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'uploads:generate-thumbnails';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Genereer ontbrekende thumbnails voor bestaande afbeeldingen en video\'s';

    public function handle(): int
    {
        $files = File::query()
            ->mediaFiles()
            ->where('has_thumbnail', false)
            ->get();

        $this->withProgressBar($files, fn (File $file) => (new GenerateThumbnail($file))->handle());

        $this->newLine();
        $this->info($files->count().' bestanden verwerkt.');

        return self::SUCCESS;
    }
}
