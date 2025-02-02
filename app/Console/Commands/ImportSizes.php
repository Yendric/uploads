<?php

namespace App\Console\Commands;

use App\Models\{User, File};
use Carbon\Carbon;
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
     * @var string|null
     */
    protected $description = 'Import file sizes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Importing files...');

        $user = User::first();
        assert($user !== null);
        $files = Storage::disk("local")->listContents('var/www/upload.yendric.be/uploads')->toArray();


        foreach ($files as $file) {
            echo $file->path() . PHP_EOL;

            $size = Storage::disk("local")->size(strval($file['path']));
            $file = File::firstWhere("name", basename(strval($file->path())));

            if (is_null($file))
                throw new \Exception("File not found");
            $file->size = $size;
            $file->save();
        }


        $this->info('Files imported');
    }
}
