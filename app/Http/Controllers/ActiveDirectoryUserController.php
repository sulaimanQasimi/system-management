<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreActiveDirectoryUserRequest;
use App\Http\Requests\UpdateActiveDirectoryUserRequest;
use App\Models\ActiveDirectoryUser;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ActiveDirectoryUserController extends Controller
{
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
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'job' => ['nullable', 'string', 'max:255'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'sort' => ['nullable', 'string', Rule::in(self::SORTABLE)],
            'direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'per_page' => ['nullable', 'integer', Rule::in(self::PER_PAGE_OPTIONS)],
        ]);

        $search = $filters['search'] ?? null;
        $job = $filters['job'] ?? null;
        $dateFrom = $filters['date_from'] ?? null;
        $dateTo = $filters['date_to'] ?? null;
        $sort = $filters['sort'] ?? 'created_at';
        $direction = $filters['direction'] ?? 'desc';
        $perPage = (int) ($filters['per_page'] ?? 15);

        $users = ActiveDirectoryUser::query()
            ->with('creator:id,name')
            ->search($search)
            ->when($job, fn ($query) => $query->where('job', 'like', '%'.$job.'%'))
            ->when($dateFrom, fn ($query) => $query->whereDate('date', '>=', $dateFrom))
            ->when($dateTo, fn ($query) => $query->whereDate('date', '<=', $dateTo))
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (ActiveDirectoryUser $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'lastname' => $user->lastname,
                'username' => $user->username,
                'email' => $user->email,
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
                'search' => $search ?? '',
                'job' => $job ?? '',
                'date_from' => $dateFrom ?? '',
                'date_to' => $dateTo ?? '',
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
            'perPageOptions' => self::PER_PAGE_OPTIONS,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('ad-users/create');
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

    public function edit(ActiveDirectoryUser $activeDirectoryUser): Response
    {
        return Inertia::render('ad-users/edit', [
            'user' => [
                'id' => $activeDirectoryUser->id,
                'name' => $activeDirectoryUser->name,
                'lastname' => $activeDirectoryUser->lastname,
                'username' => $activeDirectoryUser->username,
                'email' => $activeDirectoryUser->email,
                'job' => $activeDirectoryUser->job,
                'pbx' => $activeDirectoryUser->pbx,
                'phone' => $activeDirectoryUser->phone,
                'date' => $activeDirectoryUser->date?->toDateString(),
            ],
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
}
