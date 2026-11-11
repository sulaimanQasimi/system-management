<?php

namespace App\Http\Controllers;

use App\Exports\ActiveDirectoryUsersExport;
use App\Http\Requests\ImportActiveDirectoryUsersRequest;
use App\Http\Requests\StoreActiveDirectoryUserRequest;
use App\Http\Requests\UpdateActiveDirectoryUserRequest;
use App\Imports\ActiveDirectoryUsersImport;
use App\Models\ActiveDirectoryUser;
use App\Models\Department;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\ValidationException as ExcelValidationException;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ActiveDirectoryUserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:ad_user.view', only: ['index', 'show', 'export', 'template']),
            new Middleware('permission:ad_user.create', only: ['create', 'store', 'import']),
            new Middleware('permission:ad_user.update', only: ['edit', 'update']),
            new Middleware('permission:ad_user.delete', only: ['destroy']),
        ];
    }

    /** @var list<int> */
    private const PER_PAGE_OPTIONS = [10, 15, 25, 50, 100];

    /** @var list<string> */
    private const SORTABLE = [
        'name',
        'lastname',
        'username',
        'email',
        'job',
        'pbx',
        'phone',
        'date',
        'created_at',
    ];

    public function index(Request $request): Response
    {
        $filters = $this->validatedFilters($request);
        $sort = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';
        $perPage = (int) ($filters['per_page'] ?? 15);

        $users = $this->filteredQuery($filters)
            ->with(['creator:id,name', 'department:id,name'])
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (ActiveDirectoryUser $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'lastname' => $user->lastname,
                'username' => $user->username,
                'email' => $user->email,
                'department' => $user->department?->name,
                'job' => $user->job,
                'pbx' => $user->pbx,
                'phone' => $user->phone,
                'date' => $user->date?->toDateString(),
                'created_by' => $user->creator?->name,
                'created_at' => $user->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('ad-users/index', [
            'users' => $users,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'job' => $filters['job'] ?? '',
                'department_id' => isset($filters['department_id'])
                    ? (string) $filters['department_id']
                    : '',
                'date_from' => $filters['date_from'] ?? '',
                'date_to' => $filters['date_to'] ?? '',
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
            'perPageOptions' => self::PER_PAGE_OPTIONS,
            'departments' => Department::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function export(Request $request): BinaryFileResponse
    {
        $filters = $this->validatedFilters($request);
        $sort = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';

        $query = $this->filteredQuery($filters)->orderBy($sort, $direction);

        return Excel::download(
            new ActiveDirectoryUsersExport($query),
            'ad-users-'.now()->format('Y-m-d-His').'.xlsx',
        );
    }

    public function template(): BinaryFileResponse
    {
        return Excel::download(
            new ActiveDirectoryUsersExport(headingsOnly: true),
            'ad-users-import-template.xlsx',
        );
    }

    public function import(ImportActiveDirectoryUsersRequest $request): RedirectResponse
    {
        try {
            Excel::import(
                new ActiveDirectoryUsersImport($request->user()->id),
                $request->file('file'),
            );
        } catch (ExcelValidationException $exception) {
            $failures = $exception->failures();
            $messages = collect($failures)
                ->take(5)
                ->map(fn ($failure) => __('Row :row: :errors', [
                    'row' => $failure->row(),
                    'errors' => implode(' ', $failure->errors()),
                ]))
                ->implode(' ');

            return back()->withErrors([
                'file' => $messages !== ''
                    ? $messages
                    : __('The Excel file could not be imported.'),
            ]);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Active Directory users imported.'),
        ]);

        return to_route('ad-users.index');
    }

    public function create(): Response
    {
        return Inertia::render('ad-users/create', [
            'departments' => Department::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreActiveDirectoryUserRequest $request): RedirectResponse
    {
        ActiveDirectoryUser::create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Active Directory user created.'),
        ]);

        return to_route('ad-users.index');
    }

    public function show(ActiveDirectoryUser $activeDirectoryUser): Response
    {
        $activeDirectoryUser->load(['creator:id,name', 'department:id,name']);

        return Inertia::render('ad-users/show', [
            'user' => [
                'id' => $activeDirectoryUser->id,
                'name' => $activeDirectoryUser->name,
                'lastname' => $activeDirectoryUser->lastname,
                'username' => $activeDirectoryUser->username,
                'email' => $activeDirectoryUser->email,
                'department' => $activeDirectoryUser->department?->name,
                'job' => $activeDirectoryUser->job,
                'pbx' => $activeDirectoryUser->pbx,
                'phone' => $activeDirectoryUser->phone,
                'date' => $activeDirectoryUser->date?->toDateString(),
                'created_by' => $activeDirectoryUser->creator?->name,
                'created_at' => $activeDirectoryUser->created_at?->toDateTimeString(),
                'updated_at' => $activeDirectoryUser->updated_at?->toDateTimeString(),
            ],
        ]);
    }

    public function edit(ActiveDirectoryUser $activeDirectoryUser): Response
    {
        return Inertia::render('ad-users/edit', [
            'user' => [
                'id' => $activeDirectoryUser->id,
                'name' => $activeDirectoryUser->name,
                'lastname' => $activeDirectoryUser->lastname,
                'username' => $activeDirectoryUser->username,
                'email' => $activeDirectoryUser->email,
                'department_id' => $activeDirectoryUser->department_id,
                'job' => $activeDirectoryUser->job,
                'pbx' => $activeDirectoryUser->pbx,
                'phone' => $activeDirectoryUser->phone,
            ],
            'departments' => Department::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(
        UpdateActiveDirectoryUserRequest $request,
        ActiveDirectoryUser $activeDirectoryUser,
    ): RedirectResponse {
        $activeDirectoryUser->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Active Directory user updated.'),
        ]);

        return to_route('ad-users.index');
    }

    public function destroy(ActiveDirectoryUser $activeDirectoryUser): RedirectResponse
    {
        $activeDirectoryUser->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Active Directory user deleted.'),
        ]);

        return to_route('ad-users.index');
    }

    /**
     * @return array{
     *     search?: string|null,
     *     job?: string|null,
     *     department_id?: int|null,
     *     date_from?: string|null,
     *     date_to?: string|null,
     *     sort?: string|null,
     *     direction?: string|null,
     *     per_page?: int|null
     * }
     */
    private function validatedFilters(Request $request): array
    {
        return $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'job' => ['nullable', 'string', 'max:255'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'sort' => ['nullable', 'string', Rule::in(self::SORTABLE)],
            'direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'per_page' => ['nullable', 'integer', Rule::in(self::PER_PAGE_OPTIONS)],
        ]);
    }

    /**
     * @param  array{
     *     search?: string|null,
     *     job?: string|null,
     *     department_id?: int|null,
     *     date_from?: string|null,
     *     date_to?: string|null
     * }  $filters
     * @return Builder<ActiveDirectoryUser>
     */
    private function filteredQuery(array $filters): Builder
    {
        return ActiveDirectoryUser::query()
            ->search($filters['search'] ?? null)
            ->when(
                $filters['job'] ?? null,
                fn (Builder $query, string $job) => $query->whereLike('job', '%'.$job.'%'),
            )
            ->when(
                $filters['department_id'] ?? null,
                fn (Builder $query, int $departmentId) => $query->where('department_id', $departmentId),
            )
            ->when(
                $filters['date_from'] ?? null,
                fn (Builder $query, string $dateFrom) => $query->whereDate('date', '>=', $dateFrom),
            )
            ->when(
                $filters['date_to'] ?? null,
                fn (Builder $query, string $dateTo) => $query->whereDate('date', '<=', $dateTo),
            );
    }
}
