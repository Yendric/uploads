<?php

namespace App\Http\Controllers;

use App\Enums\FileType;
use App\Http\Requests\CompleteUploadRequest;
use App\Http\Requests\FileUpdateRequest;
use App\Http\Resources\FileResource;
use App\Models\File;
use App\Support\MimeType;
use Auth;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Str;
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
            ),
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
            ),
        ]);
    }

    public function completeUpload(CompleteUploadRequest $request): RedirectResponse
    {
        /** @var string */
        $uuid = $request->input('uuid');
        /** @var string */
        $name = $request->input('name');
        /** @var ?string */
        $mime = $request->input('mime');

        $tmpKey = 'tmp/'.$uuid;

        if (! Storage::exists($tmpKey)) {
            return redirect()->back()->with('error', 'Er is iets misgegaan bij het uploaden van het bestand (Upload niet gevonden).');
        }

        $size = Storage::size($tmpKey);

        // browsers send an empty mime for unknown file types
        if ($mime === null) {
            $mime = MimeType::detect($tmpKey);
        }

        $file = Auth::user()?->files()->create([
            'name' => $name,
            'mime_type' => $mime,
            'size' => $size,
        ]);

        if (is_null($file)) {
            return redirect()->back()->with('error', 'Er is iets misgegaan bij het uploaden van het bestand.');
        }

        try {
            Storage::getDriver()->move($tmpKey, strval($file->uuid).'/'.$name, [
                'ContentType' => $mime,
                'MetadataDirective' => 'REPLACE',
            ]);
        } catch (\Throwable $e) {
            report($e);
            $file->delete();

            return redirect()->back()->with('error', 'Er is iets misgegaan bij het uploaden van het bestand.');
        }

        return redirect()->to(route('file.show', $file->uuid))->with(['success' => 'Bestand succesvol geüpload.']);
    }

    public function presignUpload(): JsonResponse
    {
        $uuid = Str::uuid();

        $tmpKey = 'tmp/'.$uuid;

        /** @phpstan-ignore-next-line */
        $url = Storage::temporaryUploadUrl(
            $tmpKey,
            now()->addMinutes(30)
        )['url'];

        return response()->json([
            'url' => $url,
            'uuid' => $uuid,
            'expires_in' => 30 * 60,
        ]);
    }

    public function all(): Response
    {
        return Inertia::render('files/index', [
            'files' => FileResource::collection(Auth::user()?->files()->latest()->paginate(12)),
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
        ])->withViewData(['meta' => $this->linkPreviewTags($file)]);
    }

    /**
     * Meta tags for link previews on Discord, Twitter, etc. Crawlers don't run
     * javascript, so these have to be rendered into the root blade view.
     *
     * @return array<string, string>
     */
    private function linkPreviewTags(File $file): array
    {
        $tags = [
            'og:title' => $file->name,
            'og:type' => 'website',
            'og:url' => route('file.show', $file->uuid),
            'og:site_name' => config()->string('app.name'),
            'og:description' => $file->size().' • '.$file->date(),
            'twitter:card' => 'summary',
            'twitter:title' => $file->name,
        ];

        // crawlers need an absolute url, but Storage::url() is relative for local disks
        $url = Storage::url($file->path());
        if (! Str::startsWith($url, ['http://', 'https://'])) {
            $url = url($url);
        }

        if ($file->type() === FileType::Image) {
            $tags['og:image'] = $url;
            $tags['og:image:type'] = $file->mime_type;
            $tags['twitter:card'] = 'summary_large_image';
            $tags['twitter:image'] = $url;
        } elseif ($file->type() === FileType::Video) {
            $tags['og:type'] = 'video.other';
            $tags['og:video'] = $url;
            $tags['og:video:type'] = $file->mime_type;
        }

        return $tags;
    }

    public function download(Request $request, File $file): StreamedResponse|RedirectResponse
    {
        // s3 can serve files directly, so they don't have to go through php
        if (config('filesystems.default') === 's3') {
            return redirect()->away(Storage::temporaryUrl(
                $file->path(),
                now()->addMinutes(5),
                ['ResponseContentDisposition' => 'attachment; filename="'.$file->name.'"']
            ));
        }

        return Storage::download($file->path());
    }

    public function update(FileUpdateRequest $request, File $file): RedirectResponse
    {
        if (isset($request->name) && $request->name !== $file->name) {
            $oldPath = $file->path();
            $file->name = $request->name;

            try {
                Storage::move($oldPath, $file->path());
            } catch (\Throwable $e) {
                report($e);

                return redirect()->back()->with('error', 'Er is iets misgegaan bij het hernoemen van het bestand.');
            }

            $file->save();
        }

        if (isset($request->folders)) {
            $file->folders()->sync($request->folders);
        }

        return redirect()->back()->with(['success' => 'Bestand succesvol aangepast.']);
    }
}
