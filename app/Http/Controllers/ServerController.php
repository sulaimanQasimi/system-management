<?php

namespace App\Http\Controllers;

use App\Concerns\HandlesResourceIndexQuery;
use App\Enums\ServerStatus;
use App\Http\Controllers\Concerns\HasModelPermissionMiddleware;
use App\Http\Requests\StoreServerRequest;
use App\Http\Requests\UpdateServerRequest;
use App\Models\Department;
use App\Models\ItSupport;
use App\Models\Server;
use App\Models\ServerModel;
use App\Models\ServerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ServerController extends Controller implements HasMiddleware
{
    use HandlesResourceIndexQuery;
    use HasModelPermissionMiddleware;

    public static function middleware(): array
    {
        return self::modelPermissionMiddleware('server');
    }

    /** @var list<string> */
    private const SORTABLE = [
        'site_name',
        'name',
        'ip_address',
        'status',
        'created_at',
        'updated_at',
    ];

    public function index(Request $request): Response
    {
        $request->merge([
            'status' => $request->filled('status') ? $request->input('status') : null,
            'department_id' => $request->filled('department_id') ? $request->input('department_id') : null,
            'server_model_id' => $request->filled('server_model_id') ? $request->input('server_model_id') : null,
            'service_id' => $request->filled('service_id') ? $request->input('service_id') : null,
            'site_name' => $request->filled('site_name') ? $request->input('site_name') : null,
        ]);

        $base = $this->indexFilters($request, self::SORTABLE);

        $extra = $request->validate([
            'status' => ['nullable', Rule::enum(ServerStatus::class)],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'server_model_id' => ['nullable', 'integer', 'exists:server_models,id'],
            'service_id' => ['nullable', 'integer', 'exists:server_services,id'],
            'site_name' => ['nullable', 'string', 'max:255'],
        ]);

        $status = $extra['status'] ?? null;
        $departmentId = $extra['department_id'] ?? null;
        $serverModelId = $extra['server_model_id'] ?? null;
        $serviceId = $extra['service_id'] ?? null;
        $siteName = $extra['site_name'] ?? null;

        $departmentScopeIds = null;

        if ($departmentId) {
            $departmentScopeIds = array_merge(
                [$departmentId],
                Department::descendantIdsOf($departmentId),
            );
        }

        $filteredServers = Server::query()
            ->with([
                'department:id,name,parent_id',
                'serverModel:id,name',
                'itSupport:id,name,lastname,pbx',
                'services:id,name',
                'creator:id,name',
            ])
            ->search($base['search'])
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when(
                $departmentScopeIds,
                fn ($query) => $query->whereIn('department_id', $departmentScopeIds),
            )
            ->when($serverModelId, fn ($query) => $query->where('server_model_id', $serverModelId))
            ->when($siteName, fn ($query) => $query->where('site_name', 'like', '%'.$siteName.'%'))
            ->when($serviceId, fn ($query) => $query->whereHas(
                'services',
                fn ($services) => $services->where('server_services.id', $serviceId),
            ))
            ->when($base['created_from'], fn ($query) => $query->whereDate('created_at', '>=', $base['created_from']))
            ->when($base['created_to'], fn ($query) => $query->whereDate('created_at', '<=', $base['created_to']))
            ->orderBy($base['sort'], $base['direction'])
            ->get();

        $serversByDepartment = $filteredServers->groupBy('department_id');

        $departments = Department::query()
            ->orderBy('name')
            ->get(['id', 'name', 'parent_id']);

        $departmentTree = $this->buildDepartmentServerTree($departments, $serversByDepartment);

        $hasActiveFilters = filled($base['search'])
            || $status
            || $departmentId
            || $serverModelId
            || $serviceId
            || filled($siteName)
            || filled($base['created_from'])
            || filled($base['created_to']);

        if ($hasActiveFilters) {
            $departmentTree = $this->pruneEmptyDepartmentNodes($departmentTree);
        }

        return Inertia::render('servers/index', [
            'departmentTree' => $departmentTree,
            'totalServers' => $filteredServers->count(),
            'filters' => [
                ...$this->indexFilterProps($base),
                'status' => $status instanceof ServerStatus ? $status->value : ($status ?? ''),
                'department_id' => $departmentId ? (string) $departmentId : '',
                'server_model_id' => $serverModelId ? (string) $serverModelId : '',
                'service_id' => $serviceId ? (string) $serviceId : '',
                'site_name' => $siteName ?? '',
            ],
            'perPageOptions' => self::PER_PAGE_OPTIONS,
            'statusOptions' => ServerStatus::options(),
            'departments' => Department::optionsForSelect(),
            'serverModels' => ServerModel::query()->orderBy('name')->get(['id', 'name']),
            'services' => ServerService::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('servers/create', $this->formOptions());
    }

    public function store(StoreServerRequest $request): RedirectResponse
    {
        $data = $request->safe()->except(['service_ids']);

        $server = Server::create([
            ...$data,
            'created_by' => $request->user()->id,
        ]);

        $server->services()->sync($request->validated('service_ids') ?? []);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Server created.'),
        ]);

        return to_route('servers.show', $server);
    }

    public function show(Server $server): Response
    {
        $server->load([
            'department:id,name,parent_id',
            'serverModel:id,name',
            'itSupport:id,name,lastname,pbx',
            'services:id,name',
            'creator:id,name',
        ]);

        return Inertia::render('servers/show', [
            'server' => [
                'id' => $server->id,
                'site_name' => $server->site_name,
                'name' => $server->name,
                'ip_address' => $server->ip_address,
                'subnet_mask' => $server->subnet_mask,
                'default_gateway' => $server->default_gateway,
                'description' => $server->description,
                'is_vm' => $server->is_vm,
                'status' => $server->status->value,
                'status_label' => $server->status->label(),
                'department' => $server->department?->name,
                'department_path' => $server->department?->ancestryPath() ?? [],
                'department_path_label' => $server->department?->pathLabel(),
                'server_model' => $server->serverModel?->name,
                'it_support' => $server->itSupport
                    ? trim($server->itSupport->name.' '.$server->itSupport->lastname)
                    : null,
                'it_support_phone' => $server->it_support_phone,
                'idrac_ip_address' => $server->idrac_ip_address,
                'idrac_subnet_mask' => $server->idrac_subnet_mask,
                'idrac_default_gateway' => $server->idrac_default_gateway,
                'username' => $server->username,
                'has_password' => filled($server->password),
                'services' => $server->services->pluck('name')->all(),
                'created_by' => $server->creator?->name,
                'created_at' => $server->created_at?->toDateTimeString(),
                'updated_at' => $server->updated_at?->toDateTimeString(),
            ],
        ]);
    }

    public function edit(Server $server): Response
    {
        $server->load(['services:id']);

        return Inertia::render('servers/edit', [
            ...$this->formOptions(),
            'server' => [
                'id' => $server->id,
                'site_name' => $server->site_name,
                'department_id' => $server->department_id,
                'server_model_id' => $server->server_model_id,
                'name' => $server->name,
                'ip_address' => $server->ip_address,
                'subnet_mask' => $server->subnet_mask,
                'default_gateway' => $server->default_gateway,
                'description' => $server->description,
                'it_support_id' => $server->it_support_id,
                'it_support_phone' => $server->it_support_phone,
                'idrac_ip_address' => $server->idrac_ip_address,
                'idrac_subnet_mask' => $server->idrac_subnet_mask,
                'idrac_default_gateway' => $server->idrac_default_gateway,
                'username' => $server->username,
                'status' => $server->status->value,
                'is_vm' => $server->is_vm,
                'service_ids' => $server->services->pluck('id')->all(),
                'has_password' => filled($server->password),
            ],
        ]);
    }

    public function update(UpdateServerRequest $request, Server $server): RedirectResponse
    {
        $data = $request->safe()->except(['service_ids', 'password']);

        if ($request->boolean('is_vm')) {
            $data['password'] = null;
        } elseif ($request->filled('password')) {
            $data['password'] = $request->validated('password');
        }

        $server->update($data);
        $server->services()->sync($request->validated('service_ids') ?? []);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Server updated.'),
        ]);

        return to_route('servers.show', $server);
    }

    public function destroy(Server $server): RedirectResponse
    {
        $server->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Server deleted.'),
        ]);

        return to_route('servers.index');
    }

    /**
     * @return array{
     *     departments: Collection<int, Department>,
     *     serverModels: Collection<int, ServerModel>,
     *     services: Collection<int, ServerService>,
     *     itSupports: Collection<int, array{id: int, name: string, phone: string|null}>,
     *     statusOptions: list<array{value: string, label: string}>
     * }
     */
    private function formOptions(): array
    {
        return [
            'departments' => Department::optionsForSelect(),
            'serverModels' => ServerModel::query()->orderBy('name')->get(['id', 'name']),
            'services' => ServerService::query()->orderBy('name')->get(['id', 'name']),
            'itSupports' => ItSupport::query()
                ->orderBy('name')
                ->get(['id', 'name', 'lastname', 'site_name', 'pbx'])
                ->map(fn (ItSupport $contact) => [
                    'id' => $contact->id,
                    'name' => trim(
                        $contact->name.' '.$contact->lastname
                        .($contact->site_name !== '' ? ' — '.$contact->site_name : ''),
                    ),
                    'phone' => $contact->pbx,
                ]),
            'statusOptions' => ServerStatus::options(),
        ];
    }

    /**
     * @param  Collection<int, Department>  $departments
     * @param  Collection<int|string, Collection<int, Server>>  $serversByDepartment
     * @return list<array<string, mixed>>
     */
    private function buildDepartmentServerTree(
        Collection $departments,
        Collection $serversByDepartment,
    ): array {
        $byParent = $departments->groupBy(
            fn (Department $department) => $department->parent_id ?? 0,
        );

        $build = function (int|string $parentKey) use (
            &$build,
            $byParent,
            $serversByDepartment,
        ): array {
            /** @var Collection<int, Department> $children */
            $children = $byParent->get($parentKey, collect());

            return $children
                ->map(function (Department $department) use (
                    &$build,
                    $serversByDepartment,
                ): array {
                    $childNodes = $build($department->id);
                    /** @var Collection<int, Server> $directServers */
                    $directServers = $serversByDepartment->get($department->id, collect());
                    $servers = $directServers
                        ->map(fn (Server $server) => $this->transformServer($server))
                        ->values()
                        ->all();
                    $directCount = count($servers);
                    $childTotal = collect($childNodes)->sum(
                        fn (array $node): int => (int) $node['total_server_count'],
                    );

                    return [
                        'id' => $department->id,
                        'name' => $department->name,
                        'parent_id' => $department->parent_id,
                        'server_count' => $directCount,
                        'total_server_count' => $directCount + $childTotal,
                        'servers' => $servers,
                        'children' => $childNodes,
                    ];
                })
                ->values()
                ->all();
        };

        return $build(0);
    }

    /**
     * @param  list<array<string, mixed>>  $nodes
     * @return list<array<string, mixed>>
     */
    private function pruneEmptyDepartmentNodes(array $nodes): array
    {
        $pruned = [];

        foreach ($nodes as $node) {
            /** @var list<array<string, mixed>> $children */
            $children = $this->pruneEmptyDepartmentNodes($node['children'] ?? []);
            $servers = $node['servers'] ?? [];

            if ($children === [] && $servers === []) {
                continue;
            }

            $node['children'] = $children;
            $node['server_count'] = count($servers);
            $node['total_server_count'] = $node['server_count'] + collect($children)->sum(
                fn (array $child): int => (int) $child['total_server_count'],
            );
            $pruned[] = $node;
        }

        return $pruned;
    }

    /**
     * @return array<string, mixed>
     */
    private function transformServer(Server $server): array
    {
        return [
            'id' => $server->id,
            'site_name' => $server->site_name,
            'name' => $server->name,
            'ip_address' => $server->ip_address,
            'subnet_mask' => $server->subnet_mask,
            'default_gateway' => $server->default_gateway,
            'description' => $server->description,
            'idrac_ip_address' => $server->idrac_ip_address,
            'status' => $server->status->value,
            'status_label' => $server->status->label(),
            'is_vm' => $server->is_vm,
            'department_id' => $server->department_id,
            'department' => $server->department?->name,
            'server_model' => $server->serverModel?->name,
            'it_support' => $server->itSupport
                ? trim($server->itSupport->name.' '.$server->itSupport->lastname)
                : null,
            'it_support_phone' => $server->it_support_phone,
            'services' => $server->services->pluck('name')->all(),
            'created_by' => $server->creator?->name,
            'created_at' => $server->created_at?->toDateTimeString(),
        ];
    }
}
