<?php

namespace App\Enums;

use App\Models\File;

/**
 * @param string $haystack
 * @param array<string> $needles
 * @return bool
 */
function contains_any(string $haystack, array $needles): bool
{
    foreach ($needles as $needle) {
        if (str_contains($haystack, $needle)) {
            return true;
        }
    }

    return false;
}

enum FileType: string
{
    public static function fromFile(File $file): FileType
    {
        $mime = $file->mime_type;
        $ext = pathinfo($file->name, PATHINFO_EXTENSION);

        if (str_contains($mime, "image")) {
            return FileType::Image;
        } elseif (str_contains($mime, "video")) {
            return FileType::Video;
        } elseif (str_contains($mime, "pdf")) {
            return FileType::Pdf;
        } elseif (contains_any($ext, ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"])) {
            return FileType::OFFICE;
        } elseif (contains_any($mime, ["text"])) {
            return FileType::Text;
        } else {
            return FileType::Other;
        }
    }

    case Image = "IMAGE";
    case Video = "VIDEO";
    case Text = "TEXT";
    case Other = "OTHER";
    case Pdf = "PDF";
    case OFFICE = "OFFICE";
}
