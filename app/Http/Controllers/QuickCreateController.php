<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\ItSupport;
use App\Models\ServerModel;
use App\Models\ServerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuickCreateController extends Controller
{
    public function department(Request $request): JsonResponse
    {
        abort_unless($request->user()?->can('department.create'), 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:departments,name'],
        ]);

        $department = Department::create($data);

        return response()->json([
            'id' => $department->id,
            'name' => $department->name,
        ]);
    }

    public function serverModel(Request $request): JsonResponse
    {
        abort_unless($request->user()?->can('server_model.create'), 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:server_models,name'],
        ]);

        $model = ServerModel::create($data);

        return response()->json([
            'id' => $model->id,
            'name' => $model->name,
        ]);
    }

    public function serverService(Request $request): JsonResponse
    {
        abort_unless($request->user()?->can('server_service.create'), 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:server_services,name'],
        ]);

        $service = ServerService::create($data);

        return response()->json([
            'id' => $service->id,
            'name' => $service->name,
        ]);
    }

    public function itSupport(Request $request): JsonResponse
    {
        abort_unless($request->user()?->can('it_support.create'), 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'pbx' => ['nullable', 'string', 'max:255'],
        ]);

        $contact = ItSupport::create($data);

        return response()->json([
            'id' => $contact->id,
            'name' => trim($contact->name.' '.$contact->lastname),
            'phone' => $contact->pbx,
        ]);
    }
}
