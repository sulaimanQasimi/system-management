<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateActiveDirectoryUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
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
            'job' => ['nullable', 'string', 'max:255'],
            'pbx' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'date' => ['nullable', 'date'],
        ];
    }
}
