<?php

namespace App\Http\Controllers;

use App\Concerns\HandlesResourceIndexQuery;
use App\Http\Controllers\Concerns\HasModelPermissionMiddleware;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Models\Department;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller implements HasMiddleware
{
    use HandlesResourceIndexQuery;
    use HasModelPermissionMiddleware;

    public static function middleware(): array
    {
        return self::modelPermissionMiddleware('department');
    }

    /** @var list<string> */
    private const SORTABLE = ['name', 'created_at', 'updated_at'];

    public function index(Request $request): Response
    {
        $filters = $this->indexFilters($request, self::SORTABLE);

        $departments = Department::query()
            ->search($filters['search'])
            ->when($filters['created_from'], fn ($query) => $query->whereDate('created_at', '>=', $filters['created_from']))
            ->when($filters['created_to'], fn ($query) => $query->whereDate('created_at', '<=', $filters['created_to']))
            ->orderBy($filters['sort'], $filters['direction'])
            ->paginate($filters['per_page'])
            ->withQueryString()
            ->through(fn (Department $department) => [
                'id' => $department->id,
                'name' => $department->name,
                'created_at' => $department->created_at?->toDateTimeString(),
                'updated_at' => $department->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('departments/index', [
            'departments' => $departments,
            'filters' => $this->indexFilterProps($filters),
            'perPageOptions' => self::PER_PAGE_OPTIONS,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('departments/create');
    }

    public function store(StoreDepartmentRequest $request): RedirectResponse
    {
        Department::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Department created.'),
        ]);

        return to_route('departments.index');
    }

    public function show(Department $department): Response
    {
        return Inertia::render('departments/show', [
            'department' => [
                'id' => $department->id,
                'name' => $department->name,
                'created_at' => $department->created_at?->toDateTimeString(),
                'updated_at' => $department->updated_at?->toDateTimeString(),
            ],
        ]);
    }

    public function edit(Department $department): Response
    {
        return Inertia::render('departments/edit', [
            'department' => [
                'id' => $department->id,
                'name' => $department->name,
            ],
        ]);
    }

    public function update(
        UpdateDepartmentRequest $request,
        Department $department,
    ): RedirectResponse {
        $department->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Department updated.'),
        ]);

        return to_route('departments.index');
    }

    public function destroy(Department $department): RedirectResponse
    {
        $department->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Department deleted.'),
        ]);

        return to_route('departments.index');
    }
}
