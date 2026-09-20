<?php

namespace App\Http\Controllers;

use App\Concerns\HandlesResourceIndexQuery;
use App\Enums\ServerStatus;
use App\Http\Requests\StoreServerRequest;
use App\Http\Requests\UpdateServerRequest;
use App\Models\Department;
use App\Models\ItSupport;
use App\Models\Server;
use App\Models\ServerModel;
use App\Models\ServerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ServerController extends Controller
{
    use HandlesResourceIndexQuery;

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

        $servers = Server::query()
            ->with([
                'department:id,name',
                'serverModel:id,name',
                'itSupport:id,name,lastname,pbx',
                'services:id,name',
                'creator:id,name',
            ])
            ->search($base['search'])
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($departmentId, fn ($query) => $query->where('department_id', $departmentId))
            ->when($serverModelId, fn ($query) => $query->where('server_model_id', $serverModelId))
            ->when($siteName, fn ($query) => $query->where('site_name', 'like', '%'.$siteName.'%'))
            ->when($serviceId, fn ($query) => $query->whereHas(
                'services',
                fn ($services) => $services->where('server_services.id', $serviceId),
            ))
            ->when($base['created_from'], fn ($query) => $query->whereDate('created_at', '>=', $base['created_from']))
            ->when($base['created_to'], fn ($query) => $query->whereDate('created_at', '<=', $base['created_to']))
            ->orderBy($base['sort'], $base['direction'])
            ->paginate($base['per_page'])
            ->withQueryString()
            ->through(fn (Server $server) => $this->transformServer($server));

        return Inertia::render('servers/index', [
            'servers' => $servers,
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
            'departments' => Department::query()->orderBy('name')->get(['id', 'name']),
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

        return to_route('servers.index');
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
                'service_ids' => $server->services->pluck('id')->all(),
                'has_password' => filled($server->password),
            ],
        ]);
    }

    public function update(UpdateServerRequest $request, Server $server): RedirectResponse
    {
        $data = $request->safe()->except(['service_ids', 'password']);

        if ($request->filled('password')) {
            $data['password'] = $request->validated('password');
        }

        $server->update($data);
        $server->services()->sync($request->validated('service_ids') ?? []);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Server updated.'),
        ]);

        return to_route('servers.index');
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
            'departments' => Department::query()->orderBy('name')->get(['id', 'name']),
            'serverModels' => ServerModel::query()->orderBy('name')->get(['id', 'name']),
            'services' => ServerService::query()->orderBy('name')->get(['id', 'name']),
            'itSupports' => ItSupport::query()
                ->orderBy('name')
                ->get(['id', 'name', 'lastname', 'pbx'])
                ->map(fn (ItSupport $contact) => [
                    'id' => $contact->id,
                    'name' => trim($contact->name.' '.$contact->lastname),
                    'phone' => $contact->pbx,
                ]),
            'statusOptions' => ServerStatus::options(),
        ];
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
