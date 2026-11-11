<?php

namespace App\Exports;

use App\Models\ActiveDirectoryUser;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Enumerable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

/**
 * @implements WithMapping<ActiveDirectoryUser>
 */
class ActiveDirectoryUsersExport implements FromCollection, WithHeadings, WithMapping
{
    /**
     * @param  Builder<ActiveDirectoryUser>|null  $query
     */
    public function __construct(
        private readonly ?Builder $query = null,
        private readonly bool $headingsOnly = false,
    ) {}

    /**
     * @return Enumerable<int, ActiveDirectoryUser>
     */
    public function collection(): Enumerable
    {
        if ($this->headingsOnly) {
            return new Collection;
        }

        $query = $this->query ?? ActiveDirectoryUser::query();

        return $query
            ->with(['creator:id,name', 'department:id,name'])
            ->orderBy('name')
            ->orderBy('lastname')
            ->get();
    }

    /**
     * @return list<string>
     */
    public function headings(): array
    {
        return [
            'name',
            'lastname',
            'username',
            'email',
            'department',
            'job',
            'pbx',
            'phone',
            'date',
            'created_by',
            'created_at',
        ];
    }

    /**
     * @param  ActiveDirectoryUser  $row
     * @return list<string|null>
     */
    public function map(mixed $row): array
    {
        return [
            $row->name,
            $row->lastname,
            $row->username,
            $row->email,
            $row->department?->name,
            $row->job,
            $row->pbx,
            $row->phone,
            $row->date?->toDateString(),
            $row->creator?->name,
            $row->created_at?->toDateTimeString(),
        ];
    }
}
