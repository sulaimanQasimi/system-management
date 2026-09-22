<?php

namespace App\Http\Controllers;

use App\Concerns\HandlesResourceIndexQuery;
use App\Http\Controllers\Concerns\HasModelPermissionMiddleware;
use App\Http\Requests\StoreServerServiceRequest;
use App\Http\Requests\UpdateServerServiceRequest;
use App\Models\ServerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class ServerServiceController extends Controller implements HasMiddleware
{
    use HandlesResourceIndexQuery;
    use HasModelPermissionMiddleware;

    public static function middleware(): array
    {
        return self::modelPermissionMiddleware('server_service');
    }

    /** @var list<string> */
    private const SORTABLE = ['name', 'created_at', 'updated_at'];

    public function index(Request $request): Response
    {
        $filters = $this->indexFilters($request, self::SORTABLE);

        $services = ServerService::query()
            ->search($filters['search'])
            ->when($filters['created_from'], fn ($query) => $query->whereDate('created_at', '>=', $filters['created_from']))
            ->when($filters['created_to'], fn ($query) => $query->whereDate('created_at', '<=', $filters['created_to']))
            ->orderBy($filters['sort'], $filters['direction'])
            ->paginate($filters['per_page'])
            ->withQueryString()
            ->through(fn (ServerService $service) => [
                'id' => $service->id,
                'name' => $service->name,
                'created_at' => $service->created_at?->toDateTimeString(),
                'updated_at' => $service->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('server-services/index', [
            'services' => $services,
            'filters' => $this->indexFilterProps($filters),
            'perPageOptions' => self::PER_PAGE_OPTIONS,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('server-services/create');
    }

    public function store(StoreServerServiceRequest $request): RedirectResponse
    {
        ServerService::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Server service created.'),
        ]);

        return to_route('server-services.index');
    }

    public function show(ServerService $serverService): Response
    {
        return Inertia::render('server-services/show', [
            'service' => [
                'id' => $serverService->id,
                'name' => $serverService->name,
                'created_at' => $serverService->created_at?->toDateTimeString(),
                'updated_at' => $serverService->updated_at?->toDateTimeString(),
            ],
        ]);
    }

    public function edit(ServerService $serverService): Response
    {
        return Inertia::render('server-services/edit', [
            'service' => [
                'id' => $serverService->id,
                'name' => $serverService->name,
            ],
        ]);
    }

    public function update(
        UpdateServerServiceRequest $request,
        ServerService $serverService,
    ): RedirectResponse {
        $serverService->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Server service updated.'),
        ]);

        return to_route('server-services.index');
    }

    public function destroy(ServerService $serverService): RedirectResponse
    {
        $serverService->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Server service deleted.'),
        ]);

        return to_route('server-services.index');
    }
}
