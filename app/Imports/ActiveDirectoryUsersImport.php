<?php

namespace App\Imports;

use App\Models\ActiveDirectoryUser;
use App\Models\Department;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ActiveDirectoryUsersImport implements ToModel, WithHeadingRow, WithValidation
{
    private const EMAIL_DOMAIN = 'mov.gov.af';

    /** @var array<string, int> */
    private array $departmentIdsByName = [];

    public function __construct(
        private readonly int $createdBy,
    ) {}

    /**
     * @param  array<array-key, mixed>  $row
     */
    public function model(array $row): ?Model
    {
        $username = trim((string) ($row['username'] ?? ''));

        if ($username === '') {
            return null;
        }

        $attributes = [
            'name' => trim((string) ($row['name'] ?? '')),
            'lastname' => trim((string) ($row['lastname'] ?? '')),
            'username' => $username,
            'email' => $username.'@'.self::EMAIL_DOMAIN,
            'department_id' => $this->resolveDepartmentId($row['department'] ?? null),
            'job' => $this->nullableString($row['job'] ?? null),
            'pbx' => $this->nullableString($row['pbx'] ?? null),
            'phone' => $this->nullableString($row['phone'] ?? null),
            'date' => $this->resolveDate($row['date'] ?? null),
        ];

        $user = ActiveDirectoryUser::query()->firstOrNew([
            'username' => $username,
        ]);

        $user->fill($attributes);

        if (! $user->exists) {
            $user->created_by = $this->createdBy;
        }

        return $user;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'max:255'],
            'lastname' => ['required', 'max:255'],
            'username' => ['required', 'max:255'],
            'department' => ['nullable', 'max:255'],
            'job' => ['nullable', 'max:255'],
            'pbx' => ['nullable', 'max:255'],
            'phone' => ['nullable', 'max:255'],
            'date' => ['nullable', 'date'],
        ];
    }

    private function resolveDepartmentId(mixed $department): ?int
    {
        $name = trim((string) ($department ?? ''));

        if ($name === '') {
            return null;
        }

        $key = mb_strtolower($name);

        if (array_key_exists($key, $this->departmentIdsByName)) {
            return $this->departmentIdsByName[$key];
        }

        $id = Department::query()
            ->whereRaw('LOWER(name) = ?', [$key])
            ->value('id');

        $this->departmentIdsByName[$key] = $id ? (int) $id : 0;

        return $this->departmentIdsByName[$key] ?: null;
    }

    private function nullableString(mixed $value): ?string
    {
        $string = trim((string) ($value ?? ''));

        return $string === '' ? null : $string;
    }

    private function resolveDate(mixed $value): string
    {
        if (blank($value)) {
            return now()->toDateString();
        }

        try {
            return Carbon::parse($value)->toDateString();
        } catch (\Throwable) {
            return now()->toDateString();
        }
    }
}
