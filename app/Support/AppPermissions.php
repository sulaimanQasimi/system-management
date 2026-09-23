<?php

namespace App\Support;

final class AppPermissions
{
    public const ACTIONS = ['view', 'create', 'update', 'delete'];

    /**
     * @var list<string>
     */
    public const MODELS = [
        'user',
        'role',
        'department',
        'ad_user',
        'server',
        'server_model',
        'server_service',
        'it_support',
    ];

    public const ROLE_SUPER_ADMIN = 'Super Admin';

    public const ROLE_ADMIN = 'Admin';

    public const ROLE_OPERATOR = 'Operator';

    public const ROLE_VIEWER = 'Viewer';

    /**
     * @return list<string>
     */
    public static function all(): array
    {
        $permissions = [];

        foreach (self::MODELS as $model) {
            foreach (self::ACTIONS as $action) {
                $permissions[] = self::name($model, $action);
            }
        }

        return $permissions;
    }

    public static function name(string $model, string $action): string
    {
        return "{$model}.{$action}";
    }

    /**
     * @return array<string, list<string>>
     */
    public static function grouped(): array
    {
        $grouped = [];

        foreach (self::MODELS as $model) {
            $grouped[$model] = array_map(
                fn (string $action) => self::name($model, $action),
                self::ACTIONS,
            );
        }

        return $grouped;
    }

    /**
     * Human label for a model key.
     */
    public static function modelLabel(string $model): string
    {
        return match ($model) {
            'user' => 'Users',
            'role' => 'Roles',
            'department' => 'Departments',
            'ad_user' => 'AD Users',
            'server' => 'Servers',
            'server_model' => 'Server Models',
            'server_service' => 'Server Services',
            'it_support' => 'IT Support',
            default => str_replace('_', ' ', ucfirst($model)),
        };
    }
}
