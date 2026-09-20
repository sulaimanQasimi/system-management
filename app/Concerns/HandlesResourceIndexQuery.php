<?php

namespace App\Concerns;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

trait HandlesResourceIndexQuery
{
    /** @var list<int> */
    protected const PER_PAGE_OPTIONS = [10, 15, 25, 50, 100];

    /**
     * @param  list<string>  $sortable
     * @return array{
     *     search: string|null,
     *     sort: string,
     *     direction: string,
     *     per_page: int,
     *     created_from: string|null,
     *     created_to: string|null
     * }
     */
    protected function indexFilters(Request $request, array $sortable, string $defaultSort = 'created_at'): array
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', 'string', Rule::in($sortable)],
            'direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'per_page' => ['nullable', 'integer', Rule::in(self::PER_PAGE_OPTIONS)],
            'created_from' => ['nullable', 'date'],
            'created_to' => ['nullable', 'date', 'after_or_equal:created_from'],
        ]);

        return [
            'search' => $filters['search'] ?? null,
            'sort' => $filters['sort'] ?? $defaultSort,
            'direction' => $filters['direction'] ?? 'desc',
            'per_page' => (int) ($filters['per_page'] ?? 15),
            'created_from' => $filters['created_from'] ?? null,
            'created_to' => $filters['created_to'] ?? null,
        ];
    }

    /**
     * @param  array{
     *     search: string|null,
     *     sort: string,
     *     direction: string,
     *     per_page: int,
     *     created_from: string|null,
     *     created_to: string|null
     * }  $filters
     * @return array{
     *     search: string,
     *     sort: string,
     *     direction: string,
     *     per_page: int,
     *     created_from: string,
     *     created_to: string
     * }
     */
    protected function indexFilterProps(array $filters): array
    {
        return [
            'search' => $filters['search'] ?? '',
            'sort' => $filters['sort'],
            'direction' => $filters['direction'],
            'per_page' => $filters['per_page'],
            'created_from' => $filters['created_from'] ?? '',
            'created_to' => $filters['created_to'] ?? '',
        ];
    }
}
