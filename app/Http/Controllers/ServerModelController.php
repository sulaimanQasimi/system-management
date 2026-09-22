<?php

namespace App\Http\Controllers;

use App\Concerns\HandlesResourceIndexQuery;
use App\Http\Controllers\Concerns\HasModelPermissionMiddleware;
use App\Http\Requests\StoreServerModelRequest;
use App\Http\Requests\UpdateServerModelRequest;
use App\Models\ServerModel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class ServerModelController extends Controller implements HasMiddleware
{
    use HandlesResourceIndexQuery;
    use HasModelPermissionMiddleware;

    public static function middleware(): array
    {
        return self::modelPermissionMiddleware('server_model');
    }

    /** @var list<string> */
    private const SORTABLE = ['name', 'created_at', 'updated_at'];

    public function index(Request $request): Response
    {
        $filters = $this->indexFilters($request, self::SORTABLE);

        $models = ServerModel::query()
            ->search($filters['search'])
            ->when($filters['created_from'], fn ($query) => $query->whereDate('created_at', '>=', $filters['created_from']))
            ->when($filters['created_to'], fn ($query) => $query->whereDate('created_at', '<=', $filters['created_to']))
            ->orderBy($filters['sort'], $filters['direction'])
            ->paginate($filters['per_page'])
            ->withQueryString()
            ->through(fn (ServerModel $model) => [
                'id' => $model->id,
                'name' => $model->name,
                'created_at' => $model->created_at?->toDateTimeString(),
                'updated_at' => $model->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('server-models/index', [
            'models' => $models,
            'filters' => $this->indexFilterProps($filters),
            'perPageOptions' => self::PER_PAGE_OPTIONS,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('server-models/create');
    }

    public function store(StoreServerModelRequest $request): RedirectResponse
    {
        ServerModel::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Server model created.'),
        ]);

        return to_route('server-models.index');
    }

    public function show(ServerModel $serverModel): Response
    {
        return Inertia::render('server-models/show', [
            'model' => [
                'id' => $serverModel->id,
                'name' => $serverModel->name,
                'created_at' => $serverModel->created_at?->toDateTimeString(),
                'updated_at' => $serverModel->updated_at?->toDateTimeString(),
            ],
        ]);
    }

    public function edit(ServerModel $serverModel): Response
    {
        return Inertia::render('server-models/edit', [
            'model' => [
                'id' => $serverModel->id,
                'name' => $serverModel->name,
            ],
        ]);
    }

    public function update(
        UpdateServerModelRequest $request,
        ServerModel $serverModel,
    ): RedirectResponse {
        $serverModel->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Server model updated.'),
        ]);

        return to_route('server-models.index');
    }

    public function destroy(ServerModel $serverModel): RedirectResponse
    {
        $serverModel->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Server model deleted.'),
        ]);

        return to_route('server-models.index');
    }
}
