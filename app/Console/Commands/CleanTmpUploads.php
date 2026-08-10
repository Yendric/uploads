<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanTmpUploads extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'uploads:clean-tmp {--hours=24 : Delete tmp uploads older than this many hours}';

    /**
     * The console command description.
     *
     * @var string|null
     */
    protected $description = 'Verwijder achtergebleven uploads in tmp/ die nooit voltooid zijn';

    public function handle(): int
    {
        $cutoff = now()->subHours((int) $this->option('hours'))->getTimestamp();
        $deleted = 0;

        /** @var list<string> $paths */
        $paths = Storage::files('tmp');

        foreach ($paths as $path) {
            if (Storage::lastModified($path) < $cutoff) {
                Storage::delete($path);
                $deleted++;
            }
        }

        $this->info("{$deleted} tmp upload(s) verwijderd.");

        return self::SUCCESS;
    }
}
