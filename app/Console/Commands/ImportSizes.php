<?php

namespace App\Console\Commands;

use App\Models\File;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ImportSizes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sizes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import file sizes';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->info('Importing files...');

        $user = User::first();
        assert($user !== null);
        $files = Storage::disk('local')->listContents('var/www/upload.yendric.be/uploads')->toArray();

        foreach ($files as $file) {
            echo $file->path().PHP_EOL;

            $size = Storage::disk('local')->size($file->path());
            $file = File::firstWhere('name', basename($file->path()));

            if (is_null($file)) {
                throw new \Exception('File not found');
            }
            $file->size = $size;
            $file->save();
        }

        $this->info('Files imported');
    }
}
