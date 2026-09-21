<?php

namespace Database\Seeders;

use App\Models\User;
use App\Support\AppPermissions;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (AppPermissions::all() as $permission) {
            Permission::findOrCreate($permission);
        }

        $superAdmin = Role::findOrCreate(AppPermissions::ROLE_SUPER_ADMIN);
        $admin = Role::findOrCreate(AppPermissions::ROLE_ADMIN);
        $operator = Role::findOrCreate(AppPermissions::ROLE_OPERATOR);
        $viewer = Role::findOrCreate(AppPermissions::ROLE_VIEWER);

        $all = Permission::query()->whereIn('name', AppPermissions::all())->get();

        $superAdmin->syncPermissions($all);
        $admin->syncPermissions($all);

        $operatorPermissions = collect(AppPermissions::MODELS)
            ->reject(fn (string $model) => $model === 'user')
            ->flatMap(fn (string $model) => [
                AppPermissions::name($model, 'view'),
                AppPermissions::name($model, 'create'),
                AppPermissions::name($model, 'update'),
            ])
            ->all();

        $operator->syncPermissions(
            Permission::query()->whereIn('name', $operatorPermissions)->get(),
        );

        $viewerPermissions = collect(AppPermissions::MODELS)
            ->map(fn (string $model) => AppPermissions::name($model, 'view'))
            ->all();

        $viewer->syncPermissions(
            Permission::query()->whereIn('name', $viewerPermissions)->get(),
        );

        $adminUser = User::query()->firstOrCreate(
            ['email' => 'admin@network.local'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ],
        );

        $adminUser->syncRoles([AppPermissions::ROLE_SUPER_ADMIN]);

        $testUser = User::query()->where('email', 'test@example.com')->first();

        if ($testUser) {
            $testUser->syncRoles([AppPermissions::ROLE_SUPER_ADMIN]);
        }
    }
}
