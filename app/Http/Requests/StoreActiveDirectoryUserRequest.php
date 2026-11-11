<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreActiveDirectoryUserRequest extends FormRequest
{
    private const EMAIL_DOMAIN = 'mov.gov.af';

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $users = $this->input('users');

        if (! is_array($users)) {
            return;
        }

        $prepared = [];

        foreach ($users as $user) {
            if (! is_array($user)) {
                continue;
            }

            $username = trim((string) ($user['username'] ?? ''));
            $departmentId = $user['department_id'] ?? null;

            $prepared[] = [
                ...$user,
                'username' => $username,
                'email' => $username !== ''
                    ? $username.'@'.self::EMAIL_DOMAIN
                    : null,
                'date' => now()->toDateString(),
                'department_id' => filled($departmentId) ? $departmentId : null,
            ];
        }

        $this->merge([
            'users' => $prepared,
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'users' => ['required', 'array', 'min:1'],
            'users.*.name' => ['required', 'string', 'max:255'],
            'users.*.lastname' => ['required', 'string', 'max:255'],
            'users.*.username' => [
                'required',
                'string',
                'max:255',
                'distinct',
                'unique:active_directory_users,username',
            ],
            'users.*.email' => [
                'required',
                'email',
                'max:255',
                'distinct',
                'unique:active_directory_users,email',
            ],
            'users.*.department_id' => ['nullable', 'exists:departments,id'],
            'users.*.job' => ['nullable', 'string', 'max:255'],
            'users.*.pbx' => ['nullable', 'string', 'max:255'],
            'users.*.phone' => ['nullable', 'string', 'max:255'],
            'users.*.date' => ['required', 'date'],
        ];
    }
}
