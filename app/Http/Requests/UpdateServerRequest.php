<?php

namespace App\Http\Requests;

use App\Enums\ServerStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $isVm = $this->boolean('is_vm');

        $merged = ['is_vm' => $isVm];

        if ($isVm) {
            $merged = [
                ...$merged,
                'it_support_id' => null,
                'it_support_phone' => null,
                'idrac_ip_address' => null,
                'idrac_subnet_mask' => null,
                'idrac_default_gateway' => null,
                'username' => null,
                'password' => null,
            ];
        }

        $this->merge($merged);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $server = $this->route('server');

        return [
            'site_name' => ['required', 'string', 'max:255'],
            'department_id' => ['required', 'exists:departments,id'],
            'server_model_id' => ['required', 'exists:server_models,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('servers', 'name')
                    ->where(fn ($query) => $query->where('site_name', $this->input('site_name')))
                    ->ignore($server),
            ],
            'ip_address' => ['required', 'ip'],
            'subnet_mask' => ['nullable', 'string', 'max:45'],
            'default_gateway' => ['nullable', 'ip'],
            'description' => ['nullable', 'string'],
            'it_support_id' => ['nullable', 'exists:it_supports,id'],
            'it_support_phone' => ['nullable', 'string', 'max:255'],
            'idrac_ip_address' => ['nullable', 'ip'],
            'idrac_subnet_mask' => ['nullable', 'string', 'max:45'],
            'idrac_default_gateway' => ['nullable', 'ip'],
            'username' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::enum(ServerStatus::class)],
            'is_vm' => ['required', 'boolean'],
            'service_ids' => ['nullable', 'array'],
            'service_ids.*' => ['integer', 'exists:server_services,id'],
        ];
    }
}
