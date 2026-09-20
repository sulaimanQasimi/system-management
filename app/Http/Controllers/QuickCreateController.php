<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\ServerModel;
use App\Models\ServerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuickCreateController extends Controller
{
    public function department(Request $request): JsonResponse
    {
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
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:server_services,name'],
        ]);

        $service = ServerService::create($data);

        return response()->json([
            'id' => $service->id,
            'name' => $service->name,
        ]);
    }
}
