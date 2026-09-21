<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Routing\Controllers\Middleware;

trait HasModelPermissionMiddleware
{
    /**
     * @return list<Middleware>
     */
    protected static function modelPermissionMiddleware(string $model): array
    {
        return [
            new Middleware("permission:{$model}.view", only: ['index', 'show']),
            new Middleware("permission:{$model}.create", only: ['create', 'store']),
            new Middleware("permission:{$model}.update", only: ['edit', 'update']),
            new Middleware("permission:{$model}.delete", only: ['destroy']),
        ];
    }
}
