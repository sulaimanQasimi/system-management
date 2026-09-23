<?php

require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo 'roles='.Spatie\Permission\Models\Role::count().PHP_EOL;
echo 'perms='.Spatie\Permission\Models\Permission::count().PHP_EOL;

foreach (Spatie\Permission\Models\Role::orderBy('name')->get() as $role) {
    echo $role->name.'='.$role->permissions()->count().PHP_EOL;
}

$user = App\Models\User::query()->where('email', 'admin@network.local')->first();
echo 'admin='.($user
    ? $user->email.' roles='.$user->getRoleNames()->implode(',')
    : 'missing').PHP_EOL;
