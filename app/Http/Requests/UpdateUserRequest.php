<?php

namespace App\Http\Requests;

use App\Support\AppPermissions;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
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
        $user = $this->route('user');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user),
            ],
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'roles' => ['nullable', 'array'],
            'roles.*' => [
                'string',
                Rule::in([
                    AppPermissions::ROLE_SUPER_ADMIN,
                    AppPermissions::ROLE_ADMIN,
                    AppPermissions::ROLE_OPERATOR,
                    AppPermissions::ROLE_VIEWER,
                ]),
            ],
        ];
    }
}
