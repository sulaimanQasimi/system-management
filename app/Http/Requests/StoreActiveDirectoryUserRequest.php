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
        $username = trim((string) $this->input('username', ''));
        $departmentId = $this->input('department_id');

        $this->merge([
            'username' => $username,
            'email' => $username !== ''
                ? $username.'@'.self::EMAIL_DOMAIN
                : null,
            'date' => now()->toDateString(),
            'department_id' => filled($departmentId) ? $departmentId : null,
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:active_directory_users,username'],
            'email' => ['required', 'email', 'max:255', 'unique:active_directory_users,email'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'job' => ['nullable', 'string', 'max:255'],
            'pbx' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'date' => ['required', 'date'],
        ];
    }
}
