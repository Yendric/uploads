<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use App\Enums\FileType;
use Illuminate\Support\Number;

class File extends Model
{
    use HasUuids;

    protected $with = ['folders'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<Folder, $this>
     */
    public function folders(): BelongsToMany
    {
        return $this->belongsToMany(Folder::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function size(): string
    {
        return Number::fileSize($this->size);
    }


    public function date(): string
    {
        return $this->created_at?->format('d-m-Y H:i') ?? "Onbekend";
    }


    public function path(): string
    {
        return $this->uuid . '/' . $this->name;
    }

    public function type(): FileType
    {
        return FileType::fromFile($this);
    }

    public function scopeMediaFiles(Builder $query): void
    {
        $query->where('mime_type', 'like', '%image%')
            ->orWhere('mime_type', 'like', '%video%');
    }

    public function scopeCodeFiles(Builder $query): void
    {
        $query->where('mime_type', 'like', '%text%')
            ->orWhere('mime_type', 'like', '%script%');
    }

    /**
     * @return array<string>
     */
    #[\Override]
    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    #[\Override]
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
