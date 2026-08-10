<?php

namespace App\Http\Resources;

use App\Enums\FileType;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin File
 */
class FileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, string|int|null|FileType>
     */
    #[\Override]
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'size' => $this->size(),
            'size_bytes' => $this->size,
            'date' => $this->date(),
            'type' => $this->type(),
            'url' => Storage::url($this->path()),
            'folders' => $this->folders->pluck('id'),
            'id' => $this->id,
            'uuid' => $this->uuid,
        ];
    }
}
