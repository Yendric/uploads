<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @mixin \App\Models\File
 */
class FileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, string|int|null|\App\Enums\FileType>
     */
    #[\Override]
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'size' => $this->size(),
            'date' => $this->date(),
            'type' => $this->type(),
            'url' => Storage::url($this->path()),
            'folders' => $this->folders->pluck('id'),
            'id' => $this->id,
            'uuid' => $this->uuid,
        ];
    }
}
