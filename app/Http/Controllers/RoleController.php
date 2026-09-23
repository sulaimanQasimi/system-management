<?php

namespace App\Http\Controllers;

use App\Concerns\HandlesResourceIndexQuery;
use App\Http\Controllers\Concerns\HasModelPermissionMiddleware;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Support\AppPermissions;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleController extends Controller implements HasMiddleware
{
    use HandlesResourceIndexQuery;
    use HasModelPermissionMiddleware;

    public static function middleware(): array
    {
        return self::modelPermissionMiddleware('role');
    }

    /** @var list<string> */
    private const SORTABLE = ['name', 'created_at', 'updated_at'];

    public function index(Request $request): Response
    {
        $filters = $this->indexFilters($request, self::SORTABLE);

        $roles = Role::query()
            ->withCount('users')
            ->withCount('permissions')
            ->when(
                $filters['search'],
                fn ($query, $search) => $query->where('name', 'like', '%'.$search.'%'),
            )
            ->when($filters['created_from'], fn ($query) => $query->whereDate('created_at', '>=', $filters['created_from']))
            ->when($filters['created_to'], fn ($query) => $query->whereDate('created_at', '<=', $filters['created_to']))
            ->orderBy($filters['sort'], $filters['direction'])
            ->paginate($filters['per_page'])
            ->withQueryString()
            ->through(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'users_count' => $role->users_count,
                'permissions_count' => $role->permissions_count,
                'is_protected' => $role->name === AppPermissions::ROLE_SUPER_ADMIN,
                'created_at' => $role->created_at?->toDateTimeString(),
                'updated_at' => $role->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'filters' => $this->indexFilterProps($filters),
            'perPageOptions' => self::PER_PAGE_OPTIONS,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('roles/create', [
            'permissionGroups' => $this->permissionGroups(),
        ]);
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        $role = Role::create([
            'name' => $request->validated('name'),
            'guard_name' => 'web',
        ]);

        $role->syncPermissions($request->validated('permissions') ?? []);
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Role created.'),
        ]);

        return to_route('roles.index');
    }

    public function show(Role $role): Response
    {
        $role->load('permissions:id,name');

        return Inertia::render('roles/show', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->values()->all(),
                'users_count' => $role->users()->count(),
                'is_protected' => $role->name === AppPermissions::ROLE_SUPER_ADMIN,
                'created_at' => $role->created_at?->toDateTimeString(),
                'updated_at' => $role->updated_at?->toDateTimeString(),
            ],
            'permissionGroups' => $this->permissionGroups(),
        ]);
    }

    public function edit(Role $role): Response
    {
        $role->load('permissions:id,name');

        return Inertia::render('roles/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->values()->all(),
                'is_protected' => $role->name === AppPermissions::ROLE_SUPER_ADMIN,
            ],
            'permissionGroups' => $this->permissionGroups(),
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        $role->update([
            'name' => $request->validated('name'),
        ]);

        $role->syncPermissions($request->validated('permissions') ?? []);
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Role updated.'),
        ]);

        return to_route('roles.index');
    }

    public function destroy(Role $role): RedirectResponse
    {
        if ($role->name === AppPermissions::ROLE_SUPER_ADMIN) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('The Super Admin role cannot be deleted.'),
            ]);

            return back();
        }

        $role->delete();
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Role deleted.'),
        ]);

        return to_route('roles.index');
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
