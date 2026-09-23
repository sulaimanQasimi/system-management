<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateActiveDirectoryUserRequest extends FormRequest
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
            'department_id' => filled($departmentId) ? $departmentId : null,
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $activeDirectoryUser = $this->route('activeDirectoryUser');

        return [
            'name' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('active_directory_users', 'username')->ignore($activeDirectoryUser),
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('active_directory_users', 'email')->ignore($activeDirectoryUser),
            ],
            'department_id' => ['nullable', 'exists:departments,id'],
            'job' => ['nullable', 'string', 'max:255'],
            'pbx' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
        ];
    }
}
