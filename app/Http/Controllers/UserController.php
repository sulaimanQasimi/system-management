<?php

namespace App\Http\Controllers;

use App\Concerns\HandlesResourceIndexQuery;
use App\Http\Controllers\Concerns\HasModelPermissionMiddleware;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Support\AppPermissions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller implements HasMiddleware
{
    use HandlesResourceIndexQuery;
    use HasModelPermissionMiddleware;

    public static function middleware(): array
    {
        return self::modelPermissionMiddleware('user');
    }

    /** @var list<string> */
    private const SORTABLE = ['name', 'email', 'created_at'];

    public function index(Request $request): Response
    {
        $request->merge([
            'role' => $request->filled('role') ? $request->input('role') : null,
        ]);

        $base = $this->indexFilters($request, self::SORTABLE);

        $extra = $request->validate([
            'role' => ['nullable', 'string', 'max:255'],
        ]);

        $role = $extra['role'] ?? null;

        $users = User::query()
            ->with('roles:id,name')
            ->search($base['search'] ?? null)
            ->when($role, fn ($query) => $query->role($role))
            ->when($base['created_from'], fn ($query) => $query->whereDate('created_at', '>=', $base['created_from']))
            ->when($base['created_to'], fn ($query) => $query->whereDate('created_at', '<=', $base['created_to']))
            ->orderBy($base['sort'], $base['direction'])
            ->paginate($base['per_page'])
            ->withQueryString()
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at?->toDateTimeString(),
                'roles' => $user->roles->pluck('name')->all(),
                'created_at' => $user->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                ...$this->indexFilterProps($base),
                'role' => $role ?? '',
            ],
            'perPageOptions' => self::PER_PAGE_OPTIONS,
            'roles' => Role::query()->orderBy('name')->pluck('name'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('users/create', [
            'roles' => Role::query()->orderBy('name')->get(['id', 'name']),
            'permissionGroups' => $this->permissionGroups(),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => Hash::make($request->validated('password')),
            'email_verified_at' => now(),
        ]);

        $user->syncRoles($request->validated('roles') ?? []);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('User created.'),
        ]);

        return to_route('users.index');
    }

    public function show(User $user): Response
    {
        $user->load('roles:id,name');

        return Inertia::render('users/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->all(),
                'created_at' => $user->created_at?->toDateTimeString(),
                'updated_at' => $user->updated_at?->toDateTimeString(),
            ],
        ]);
    }

    public function edit(User $user): Response
    {
        $user->load('roles:id,name');

        return Inertia::render('users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name')->all(),
            ],
            'roles' => Role::query()->orderBy('name')->get(['id', 'name']),
            'permissionGroups' => $this->permissionGroups(),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = [
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->validated('password'));
        }

        $user->update($data);
        $user->syncRoles($request->validated('roles') ?? []);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('User updated.'),
        ]);

        return to_route('users.index');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()?->is($user)) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('You cannot delete your own account.'),
            ]);

            return back();
        }

        $user->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('User deleted.'),
        ]);

        return to_route('users.index');
    }

    /**
     * @return list<array{model: string, label: string, permissions: list<string>}>
     */
    private function permissionGroups(): array
    {
        return collect(AppPermissions::grouped())
            ->map(fn (array $permissions, string $model) => [
                'model' => $model,
                'label' => AppPermissions::modelLabel($model),
                'permissions' => $permissions,
            ])
            ->values()
            ->all();
    }
}
