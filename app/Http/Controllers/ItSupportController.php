<?php

namespace App\Http\Controllers;

use App\Concerns\HandlesResourceIndexQuery;
use App\Http\Controllers\Concerns\HasModelPermissionMiddleware;
use App\Http\Requests\StoreItSupportRequest;
use App\Http\Requests\UpdateItSupportRequest;
use App\Models\ItSupport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class ItSupportController extends Controller implements HasMiddleware
{
    use HandlesResourceIndexQuery;
    use HasModelPermissionMiddleware;

    public static function middleware(): array
    {
        return self::modelPermissionMiddleware('it_support');
    }

    /** @var list<string> */
    private const SORTABLE = ['name', 'lastname', 'pbx', 'created_at', 'updated_at'];

    public function index(Request $request): Response
    {
        $base = $this->indexFilters($request, self::SORTABLE);

        $extra = $request->validate([
            'pbx' => ['nullable', 'string', 'max:255'],
        ]);

        $pbx = $extra['pbx'] ?? null;

        $contacts = ItSupport::query()
            ->search($base['search'])
            ->when($pbx, fn ($query) => $query->where('pbx', 'like', '%'.$pbx.'%'))
            ->when($base['created_from'], fn ($query) => $query->whereDate('created_at', '>=', $base['created_from']))
            ->when($base['created_to'], fn ($query) => $query->whereDate('created_at', '<=', $base['created_to']))
            ->orderBy($base['sort'], $base['direction'])
            ->paginate($base['per_page'])
            ->withQueryString()
            ->through(fn (ItSupport $contact) => [
                'id' => $contact->id,
                'name' => $contact->name,
                'lastname' => $contact->lastname,
                'pbx' => $contact->pbx,
                'created_at' => $contact->created_at?->toDateTimeString(),
                'updated_at' => $contact->updated_at?->toDateTimeString(),
            ]);

        return Inertia::render('it-support/index', [
            'contacts' => $contacts,
            'filters' => [
                ...$this->indexFilterProps($base),
                'pbx' => $pbx ?? '',
            ],
            'perPageOptions' => self::PER_PAGE_OPTIONS,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('it-support/create');
    }

    public function store(StoreItSupportRequest $request): RedirectResponse
    {
        ItSupport::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('IT Support contact created.'),
        ]);

        return to_route('it-support.index');
    }

    public function show(ItSupport $itSupport): Response
    {
        return Inertia::render('it-support/show', [
            'contact' => [
                'id' => $itSupport->id,
                'name' => $itSupport->name,
                'lastname' => $itSupport->lastname,
                'pbx' => $itSupport->pbx,
                'created_at' => $itSupport->created_at?->toDateTimeString(),
                'updated_at' => $itSupport->updated_at?->toDateTimeString(),
            ],
        ]);
    }

    public function edit(ItSupport $itSupport): Response
    {
        return Inertia::render('it-support/edit', [
            'contact' => [
                'id' => $itSupport->id,
                'name' => $itSupport->name,
                'lastname' => $itSupport->lastname,
                'pbx' => $itSupport->pbx,
            ],
        ]);
    }

    public function update(
        UpdateItSupportRequest $request,
        ItSupport $itSupport,
    ): RedirectResponse {
        $itSupport->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('IT Support contact updated.'),
        ]);

        return to_route('it-support.index');
    }

    public function destroy(ItSupport $itSupport): RedirectResponse
    {
        $itSupport->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('IT Support contact deleted.'),
        ]);

        return to_route('it-support.index');
    }
}
