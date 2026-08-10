<?php

namespace App\Http\Controllers;

use App\Http\Requests\FolderStoreRequest;
use App\Http\Resources\FileResource;
use App\Models\Folder;
use Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use ZipStream\ZipStream;

class FolderController extends Controller
{
    public function store(FolderStoreRequest $request): RedirectResponse
    {
        $folderName = $request->name;

        Auth::user()?->folders()->create(['name' => $folderName]);

        return redirect()->back()->with('success', 'Map succesvol aangemaakt');
    }

    public function destroy(Request $request, Folder $folder): RedirectResponse
    {
        $folder->delete();

        if ($request->has('redirect')) {
            return redirect()->to(route('media'))->with(['success' => 'Map succesvol verwijderd.']);
        }

        return redirect()->back()->with(['success' => 'Map succesvol verwijderd.']);
    }

    public function show(Folder $folder): Response
    {
        return Inertia::render('folder/show', [
            'folder' => $folder,
            'files' => FileResource::collection($folder->files()->paginate(12)),
            'mediaOnly' => $folder->files()->count() === $folder->files()->mediaFiles()->count(),
        ]);
    }

    public function update(FolderStoreRequest $request, Folder $folder): RedirectResponse
    {
        $folder->update(['name' => $request->name]);

        return redirect()->back()->with('success', 'Map succesvol bijgewerkt');
    }

    public function zip(Folder $folder): void
    {
        $zip = new ZipStream(
            outputName: $folder->name.'.zip',
            sendHttpHeaders: true
        );

        /** @var array<string, int> $nameCounts */
        $nameCounts = [];

        foreach ($folder->files()->get() as $file) {
            $stream = Storage::readStream($file->path());
            if (is_null($stream)) {
                // don't send corrupt file
                report(new \RuntimeException("Kon {$file->path()} niet lezen bij het zippen van map {$folder->uuid}"));

                continue;
            }

            $name = $file->name;
            $nameCounts[$name] = ($nameCounts[$name] ?? 0) + 1;
            if ($nameCounts[$name] > 1) {
                $info = pathinfo($name);
                $name = $info['filename'].' ('.($nameCounts[$name] - 1).')'
                    .(isset($info['extension']) ? '.'.$info['extension'] : '');
            }

            $zip->addFileFromStream($name, $stream);
        }

        $zip->finish();
    }
}
