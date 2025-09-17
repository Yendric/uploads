<?php

namespace App\Http\Controllers;

use App\Http\Requests\FolderStoreRequest;
use App\Http\Resources\FileResource;
use App\Models\Folder;
use Auth;
use DateTime;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use ZipArchive;
use Illuminate\Support\Str;
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
            'files' => FileResource::collection($folder->files()->paginate()),
            'mediaOnly' => $folder->files->count() === $folder->files()->mediaFiles()->count()
        ]);
    }

    public function update(FolderStoreRequest $request, Folder $folder): RedirectResponse
    {
        $folder->update(['name' => $request->name]);

        return redirect()->back()->with('success', 'Map succesvol bijgewerkt');
    }

    public function zip(Folder $folder): ?RedirectResponse
    {
        $zip = new ZipStream(
            outputName: $folder->name . '.zip',
            sendHttpHeaders: true
        );

        foreach ($folder->files as $file) {
            $stream = Storage::readStream($file->path());
            if (is_null($stream)) {
                return redirect()->back()->with('error', 'Er is iets misgegaan bij het zippen van de map');
            }
            $zip->addFileFromStream($file->name, $stream);
        }

        $zip->finish();

        return null;
    }
}
