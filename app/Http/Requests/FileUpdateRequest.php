<?php

namespace App\Http\Requests;

use App\Models\Folder;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * @property ?string $name
 * @property ?array<int> $folders
 */
class FileUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255', 'regex:/^[a-zA-Z0-9._\-\s]+$/', 'not_regex:/^[.\s]+$/'],
            'folders' => 'nullable|array',
            'folders.*' => [
                function (string $attribute, string $value, Closure $fail) {
                    $userId = auth()->id();
                    $folderExists = Folder::where('id', $value)
                        ->where('user_id', $userId)
                        ->exists();

                    if (! $folderExists) {
                        $fail('Je kan enkel mappen van jezelf toevoegen.');
                    }
                },
            ],
        ];
    }
}
