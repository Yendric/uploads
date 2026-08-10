<?php

namespace App\Support;

use finfo;
use Illuminate\Support\Facades\Storage;

class MimeType
{
    /**
     * Detect the mime type of a stored object by sniffing its content with
     * libmagic, so extensionless files (Makefile, README, unix binaries) are
     * classified correctly. Only the first 64 KB is read.
     */
    public static function detect(string $key): string
    {
        $stream = Storage::readStream($key);

        if (is_null($stream)) {
            return 'application/octet-stream';
        }

        $head = fread($stream, 64 * 1024);
        fclose($stream);

        if ($head === false || $head === '') {
            return 'application/octet-stream';
        }

        $mime = (new finfo(FILEINFO_MIME_TYPE))->buffer($head);

        return $mime === false ? 'application/octet-stream' : $mime;
    }
}
