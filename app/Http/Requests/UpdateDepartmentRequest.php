<?php

namespace App\Http\Requests;

use App\Models\Department;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (! $this->filled('parent_id')) {
            $this->merge(['parent_id' => null]);
        }
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('departments', 'name')->ignore($this->route('department')),
            ],
            'parent_id' => ['nullable', 'integer', 'exists:departments,id'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            /** @var Department|null $department */
            $department = $this->route('department');
            $parentId = $this->input('parent_id');

            if (! $department instanceof Department || $parentId === null) {
                return;
            }

            if (Department::wouldCreateCycle($department->id, (int) $parentId)) {
                $validator->errors()->add(
                    'parent_id',
                    __('A department cannot be nested under itself or one of its children.'),
                );
            }
        });
    }
}
