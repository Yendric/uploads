<?php

namespace App\Http\Controllers;

use App\Http\Requests\FileUpdateRequest;
use App\Http\Requests\FileUploadRequest;
use App\Http\Resources\FileResource;
use App\Models\File;
use Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileController extends Controller
{
    public function media(): Response
    {
        return Inertia::render('media/index', [
            'media' => FileResource::collection(
                Auth::user()?->files()
                    ->latest()
                    ->mediaFiles()
                    ->paginate(12)
            )
        ]);
    }

    public function code(): Response
    {
        return Inertia::render('code/index', [
            'files' => FileResource::collection(
                Auth::user()?->files()
                    ->latest()
                    ->codeFiles()
                    ->paginate(12)
            )
        ]);
    }

    public function upload(FileUploadRequest $request): RedirectResponse
    {
        $uploadedFile = $request->file('file');

        if (!$uploadedFile instanceof UploadedFile) {
            return redirect()->back()->with('error', 'Er is iets misgegaan bij het uploaden van het bestand.');
        }
        $name = $uploadedFile->getClientOriginalName();


        $file = Auth::user()?->files()->create([
            'name' => $name,
            'mime_type' => $uploadedFile->getMimeType(),
            'size' => $uploadedFile->getSize(),
        ]);

        if (is_null($file)) {
            return redirect()->back()->with('error', 'Er is iets misgegaan bij het uploaden van het bestand.');
        }

        $uploadedFile->storeAs(strval($file->uuid), $name);

        return redirect()->to(route('file.show', $file->uuid))->with(['success' => 'Bestand succesvol geüpload.']);
    }

    public function all(): Response
    {
        return Inertia::render('files/index', [
            'files' => FileResource::collection(Auth::user()?->files()->latest()->paginate(12))
        ]);
    }

    public function destroy(Request $request, File $file): RedirectResponse
    {
        $file->delete();

        if ($request->has('redirect')) {
            return redirect()->to(route('media'))->with(['success' => 'Bestand succesvol verwijderd.']);
        }

        return redirect()->back()->with(['success' => 'Bestand succesvol verwijderd.']);
    }

    public function show(Request $request, File $file): Response
    {
        return Inertia::render('files/show', [
            'file' => (new FileResource($file))->toArray($request),
        ]);
    }

    public function download(Request $request, File $file): StreamedResponse
    {
        return Storage::download($file->path());
    }

    public function update(FileUpdateRequest $request, File $file): RedirectResponse
    {
        if (isset($request->name)) {
            $oldPath = $file->path();
            $file->name = $request->name;
            Storage::move($oldPath, $file->path());
        }

        if (isset($request->folders)) {
            $file->folders()->sync($request->folders);
        }

        $file->save();

        return redirect()->back()->with(['success' => 'Bestand succesvol aangepast.']);
    }
}

