<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class Import extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import';

    /**
     * The console command description.
     *
     * @var string|null
     */
    protected $description = 'Import files';

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

            $lastModified = Storage::disk("local")->lastModified(strval($file['path']));
            $dbfile = $user->files()->create([
                'name' => basename(strval($file->path())),
                'mime_type' => Storage::disk("local")->mimeType(strval($file['path'])),
                'created_at' => new Carbon($lastModified),
                'updated_at' => new Carbon($lastModified),
            ]);

            $contents = Storage::disk("local")->read(strval($file['path']));

            Storage::put(strval($dbfile->uuid) . '/' . basename(strval($file->path())), $contents);
        }


        $this->info('Files imported');
    }
}
